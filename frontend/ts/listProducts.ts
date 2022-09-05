interface Product {
    id: number;
    title: string;
    content: string;
    image: string;
}

const productListInfo = async (): Promise<Product[] | null> => {
    const res = await (await fetch("/api/product/all")).json();
    if (res.msg !== "Ok") {
        const productContainer = document.querySelector(
            "#product-example-grid",
        )!;
        productContainer.textContent = res.msg;
        return null;
    }
    return res.data;
};

const productListMain = async () => {
    const productContainer = document.querySelector("#product-example-grid")!;
    const products = await productListInfo();
    if (!products) return;
    for (let product of products) {
        const card = document.createElement("a");
        card.className = "product-example";
        card.href = `/product/${product.id}`;

        const image = document.createElement("img");
        image.className = "product-example-image";
        image.src = product.image;

        const title = document.createElement("h2");
        title.className = "product-example-title";
        title.textContent = product.title;

        card.appendChild(image);
        card.appendChild(title);
        productContainer.appendChild(card);
    }
};

productListMain();
