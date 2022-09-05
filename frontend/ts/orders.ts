interface Order {
    id: number;
    productId: number;
    firstName: string;
    lastName: string;
    mail: string;
    phone: string;
    details: string;
    date: string;
    archived: boolean;
}

const createElement = (
    tag: string,
    parent: Element,
    className?: string,
    text?: string,
) => {
    const element = document.createElement(tag);
    element.className = className ?? "";
    element.textContent = text ?? "";
    parent.appendChild(element);
    return element;
};

const sortOrdersInPlace = (orders: Order[]) => {
    orders.sort((orderA: Order, orderB: Order) => {
        // if number is negative, A comes first
        // if number is positive, B comes first

        if (!orderA.archived && orderB.archived) return -1;
        if (orderA.archived && !orderB.archived) return 1;

        const orderADate = new Date(orderA.date);
        const orderBDate = new Date(orderB.date);

        if (orderADate > orderBDate) return -1;
        if (orderADate < orderBDate) return 1;

        return 0;
    });
};

const ordersInfo = async (): Promise<Order[] | null> => {
    const res = await (await fetch("/api/order/all")).json();
    if (res.msg !== "Ok") {
        const orderList = document.querySelector("#orders-list")!;
        orderList.textContent = res.msg;
        return null;
    }
    return res.data;
};

const toggleOrderItem = (id: number) => {
    const order = document.getElementById(`order-[${id}]`)!;
    order.classList.toggle("order-opened");
};

const productTitleFromId = async (productId: number): Promise<string> => {
    const res = await (await fetch(`/api/product/one/${productId}`)).json();
    if (res.msg !== "Ok") {
        return res.msg;
    }
    return res.data.title;
};

const orderItemAction = async (orderId: number, action: OrderItemAction) => {
    const actionConfirmed = confirm(
        `Er du sikker på, at du vil ${OrderItemConfirmMessage[action]}?`,
    );

    if (!actionConfirmed) return;

    const res = await (
        await fetch(`/api/order/${OrderItemApiUrl[action]}/${orderId}`, {
            method: "POST",
        })
    ).json();

    if (res.msg !== "Ok") {
        alert(`Fejl under ${OrderItemErrorMessage[action]}: ${res.msg}`);
        return;
    }

    alert(`Bestilling ${OrderItemSuccessMessage[action]}.`);
    await displayOrders();
};

const formatDate = (date: Date) => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const displayOrderItemActions = (header: HTMLElement, order: Order) => {
    if (!order.archived) {
        const archiveButton = createElement(
            "button",
            header,
            "order-action-icon interactable",
        );
        const archiveIcon = createElement(
            "img",
            archiveButton,
            "order-action-icon-image",
        ) as HTMLImageElement;
        archiveIcon.src = "/images/archive.svg";
        archiveButton.addEventListener("click", () =>
            orderItemAction(order.id, OrderItemAction.Archive),
        );
    } else {
        const unarchiveButton = createElement(
            "button",
            header,
            "order-action-icon interactable",
        );
        const unarchiveIcon = createElement(
            "img",
            unarchiveButton,
            "order-action-icon-image",
        ) as HTMLImageElement;
        unarchiveIcon.src = "/images/unarchive.svg";
        unarchiveButton.addEventListener("click", () =>
            orderItemAction(order.id, OrderItemAction.Unarchive),
        );

        const deleteButton = createElement(
            "button",
            header,
            "order-action-icon interactable",
        );
        const deleteIcon = createElement(
            "img",
            deleteButton,
            "order-action-icon-image",
        ) as HTMLImageElement;
        deleteIcon.src = "/images/delete.svg";
        deleteButton.addEventListener("click", () =>
            orderItemAction(order.id, OrderItemAction.Delete),
        );
    }
};

const displayOrderItemHeader = async (orderItem: HTMLElement, order: Order) => {
    const productTitle = await productTitleFromId(order.productId);
    const header = createElement("div", orderItem, "order-header");
    const toggleContainer = createElement(
        "button",
        header,
        "order-header-toggle interactable",
    );
    const title = createElement(
        "h2",
        toggleContainer,
        "product-title",
        productTitle,
    );
    const dateObject = new Date(order.date);

    const orderSubInfoContainer = createElement(
        "span",
        toggleContainer,
        "order-sub-info",
    );
    createElement(
        "time",
        orderSubInfoContainer,
        "date-ordered",
        formatDate(dateObject),
    );
    createElement(
        "span",
        orderSubInfoContainer,
        "order-sub-info-seperator",
        ` | `,
    );
    const orderId = createElement(
        "span",
        orderSubInfoContainer,
        "order-id",
        `#${order.id}`,
    );
    const toggleButton = createElement(
        "div",
        toggleContainer,
        "order-action-icon order-toggle-icon",
    );
    const toggleButtonIcon = createElement(
        "img",
        toggleButton,
        "order-action-icon-image",
    ) as HTMLImageElement;
    toggleButtonIcon.src = "/images/expand.svg";

    toggleContainer.addEventListener("click", () => toggleOrderItem(order.id));

    await displayOrderItemActions(header, order);
};

const displayOrderItemDetails = async (
    orderItem: HTMLElement,
    order: Order,
) => {
    const productTitle = await productTitleFromId(order.productId);

    const detailsContainer = createElement("div", orderItem, "order-details");
    const nameHeader = createElement("h3", detailsContainer);
    const name = createElement(
        "span",
        nameHeader,
        "order-person",
        `${order.firstName} ${order.lastName}`,
    );
    const email = createElement(
        "span",
        nameHeader,
        "order-email",
        ` (${order.mail})`,
    );

    const contactEmail = createElement(
        "a",
        detailsContainer,
        "order-contact-email",
        order.mail,
    ) as HTMLAnchorElement;
    contactEmail.href = `mailto:${order.mail}`;

    const firstSeperator = createElement(
        "span",
        detailsContainer,
        "order-contact-seperator",
        " | ",
    );

    const contactPhone = createElement(
        "a",
        detailsContainer,
        "order-contact-email",
        order.phone,
    ) as HTMLAnchorElement;
    contactPhone.href = `tel:${order.phone}`;

    const secondSeperator = createElement(
        "span",
        detailsContainer,
        "order-contact-seperator",
        " | ",
    );

    const productLink = createElement(
        "a",
        detailsContainer,
        "order.productId-link",
        productTitle,
    ) as HTMLAnchorElement;
    productLink.href = `/product/${order.productId}`;
};

const displayOrderItem = async (order: Order) => {
    const orderList = document.querySelector("#orders-list")!;

    const className = "order" + (order.archived ? " archived" : "");

    const orderItem = createElement("div", orderList, className);
    orderItem.id = `order-[${order.id}]`;

    await displayOrderItemHeader(orderItem, order);
    await displayOrderItemDetails(orderItem, order);
};

const displayOrders = async () => {
    const orderList = document.querySelector("#orders-list") as HTMLElement;
    const orders = await ordersInfo();
    if (!orders) return;
    sortOrdersInPlace(orders);

    orderList.classList.add("loading");
    orderList.innerHTML = "";
    for (let order of orders) {
        await displayOrderItem(order);
    }
    orderList.classList.remove("loading");
};

const ordersMain = async () => {
    await displayOrders();
};

ordersMain();
