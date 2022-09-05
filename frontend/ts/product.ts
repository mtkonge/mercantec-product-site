const isFilePage = (): boolean => {
    return productId() === "/product";
};

const productId = (): string => {
    // reverse to get last element as first
    return window.location.pathname.split("/").reverse()[0];
};

const productInfo = async () => {
    const res = await (await fetch(`/api/product/one/${productId()}`)).json();
    if (res.msg !== "Ok") {
        const titleElement = document.querySelector("#product-title")!;
        titleElement.textContent = res.msg;
        const contentElement = document.querySelector("#product-content")!;
        contentElement.textContent = "";
    }
    return res.data;
};

const deleteProduct = async () => {
    const deletionConfirmed = confirm(
        "Er du sikker på, at du vil slette dette produkt?",
    );

    if (!deletionConfirmed) return;

    const res = await (
        await fetch(`/api/product/remove/${productId()}`, { method: "POST" })
    ).json();

    if (res.msg !== "Ok") {
        alert(`Fejl under slettelse: ${res.msg}`);
        return;
    }

    alert("Produkt slettet, du bliver nu henviset til forsiden.");
    window.location.href = "/";
};

const showDeleteInput = () => {
    const deleteInput = document.querySelector("#product-delete")!;
    deleteInput.setAttribute("style", "display: inherit");
};

const handleDeleteInput = async () => {
    const user = await userInfo();
    if (!user) return;

    const deleteInput = document.querySelector("#product-delete")!;
    deleteInput.addEventListener("click", (event) => {
        deleteProduct();
    });

    if (user.admin) showDeleteInput();
};

const productMain = async () => {
    if (isFilePage()) return;

    const data = await productInfo();
    const titleElement = document.querySelector("#product-title")!;
    titleElement.textContent = data.title;
    const contentElement = document.querySelector("#product-content")!;
    contentElement.textContent = data.content;
    const imageElement = document.querySelector(
        "#product-image",
    ) as HTMLImageElement;
    imageElement.src = data.image;

    await handleDeleteInput();
};

productMain();
