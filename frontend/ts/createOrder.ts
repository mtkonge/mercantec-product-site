const orderValidCheck = (): ErrorMessage | null => {
    const firstName = stripInput("first-name");
    if (firstName === "") {
        return "Fornavnsfelt felt må ikke være tomt.";
    }
    const lastName = stripInput("last-name");
    if (lastName === "") {
        return "Efternavnsfelt felt må ikke være tomt.";
    }

    const email = stripInput("email");
    if (email === "") {
        return "Emailfelt må ikke være tomt.";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return "Email addresse er ukorrekt";
    }

    const phone = stripInput("phone");
    if (phone === "") {
        return "Telefon nr. felt må ikke være tomt.";
    }

    const whitespaceStrippedPhone = phone.replace(/\s/g, "");

    const phoneRegex = /(\+45)?\d{8}/;
    if (!phoneRegex.test(whitespaceStrippedPhone)) {
        return "Telefonnummer er ukorrekt";
    }

    const desc = stripInput("description");
    if (desc === "") {
        return "Detaljer felt må ikke være tomt.";
    }

    return null;
};

const createOrderSubmit = async () => {
    const error = orderValidCheck();
    if (error !== null) {
        displayError(error);
        return;
    }
    clearError();

    const firstName = inputValue("first-name");
    const lastName = inputValue("last-name");
    const mail = inputValue("email");
    const rawPhone = inputValue("phone");
    const phone = rawPhone.replace("+45", "").replace(/\s/g, "");
    const details = inputValue("description");
    // defined in product.ts
    const product = parseInt(productId());

    const res = await (
        await fetch("/api/order/create", {
            method: "POST",
            body: JSON.stringify({
                firstName,
                lastName,
                mail,
                phone,
                details,
                productId: product,
            }),
            headers: new Headers({ "Content-Type": "application/json" }),
        })
    ).json();

    if (res.msg !== "Ok") {
        displayError(res.msg);
    } else {
        alert("Bestilling sendt. Du får en konfirmation i din email.");
    }
};

const createOrderMain = () => {
    const submitElement = document.querySelector("#submit")!;
    submitElement.addEventListener("click", () => createOrderSubmit());
};

createOrderMain();
