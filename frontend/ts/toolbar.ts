interface User {
    id: number;
    username: string;
    admin: boolean;
}

const userInfo = async (): Promise<User | null> => {
    const res = await (await fetch("/api/user/data")).json();
    if (res.msg === "Ok") return res.data;
    return null;
};

const logout = async () => {
    const res = await (
        await fetch("/api/user/logout", { method: "POST" })
    ).json();
    window.location.reload();
};

const showAdminInput = () => {
    const createInput = document.querySelector("#toolbar-create")!;
    createInput.setAttribute("style", "display: inherit");

    const ordersInput = document.querySelector("#toolbar-orders")!;
    ordersInput.setAttribute("style", "display: inherit");
};

const setupMobileNavToggle = () => {
    const mobileNavToggle = document.querySelector("#mobile-nav-toggle")!;
    mobileNavToggle.addEventListener("click", () => {
        const toolbar = document.querySelector("#main-toolbar")!;
        toolbar.classList.toggle("mobile-toggle-enabled");
    });
};

const setupInitialToolbarHtml = () => {
    const toolbar = document.querySelector("#main-toolbar")!;
    toolbar.innerHTML = /*html*/ `
        <a class="toolbar-logo-container" href="/">
            <div class="toolbar-logo" src="/images/mercantec.svg"></div>
        </a>
        <button id="mobile-nav-toggle" class="interactable"><img src="/images/menu.svg"/></button>
        <nav class="main-nav">
            <a id="toolbar-orders" class="toolbar-button" href="/orders">
                <img src="/images/orders.svg" />
                Bestillinger</a
            >
            <a id="toolbar-create" class="toolbar-button" href="/create">
                <img src="/images/create.svg" />
                Skab produkt</a
            >
            <a id="toolbar-account" class="toolbar-button" href="/login"
                ><img id="toolbar-account-image" src="/images/login.svg" />
                <span id="toolbar-account-text">Log ind</span></a
            >
        </nav>
    `;
};

const toolbarMain = async () => {
    setupInitialToolbarHtml();
    setupMobileNavToggle();

    const user = await userInfo();
    if (!user) return;

    const accountImage = document.querySelector(
        "#toolbar-account-image",
    ) as HTMLImageElement;
    accountImage.src = "/images/logout.svg";

    const accountText = document.querySelector("#toolbar-account-text")!;
    accountText.textContent = `Log ud (${user.username})`;

    const accountInput = document.querySelector(
        "#toolbar-account",
    ) as HTMLAnchorElement;
    // this is done for accessability reasons, as /logout is not an actual link
    accountInput.href = "/logout";
    accountInput.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });

    if (user.admin) showAdminInput();
};

toolbarMain();
