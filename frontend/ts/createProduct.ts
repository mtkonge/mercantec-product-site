const productValidCheck = (): ErrorMessage | null => {
    const title = stripInput("title");
    if (title === "") {
        return "Produkttitel felt må ikke være tomt.";
    }
    const image = stripInput("image");
    if (image === "") {
        return "Billede felt må ikke være tomt.";
    }

    const desc = stripInput("desc");
    if (desc === "") {
        return "Beskrivelse felt må ikke være tomt.";
    }

    return null;
};

const createProductSubmit = async () => {
    const error = productValidCheck();
    if (error !== null) {
        displayError(error);
        return;
    }
    clearError();

    const title = inputValue("title");
    const content = inputValue("desc");
    const imageInput = document.querySelector("#image") as HTMLInputElement;
    const imageFile = imageInput.files!.item(0)!;

    const MEGABYTE_IN_BYTES = 1048576;
    if (imageFile.size > MEGABYTE_IN_BYTES) {
        displayError("Billedet må ikke være større end 1mb.");
        return;
    }
    clearError();

    const FR = new FileReader();
    FR.addEventListener("load", async (evt) => {
        const image = FR.result;

        const res = await (
            await fetch("/api/product/create", {
                method: "POST",
                body: JSON.stringify({ title, content, image }),
                headers: new Headers({ "Content-Type": "application/json" }),
            })
        ).json();

        if (res.msg !== "Ok") {
            displayError(res.msg);
        } else {
            window.location.href = `/product/${res.data.id}`;
        }
    });
    FR.readAsDataURL(imageFile);
};

const createProductMain = () => {
    const submitElement = document.querySelector("#submit")!;
    submitElement.addEventListener("click", () => createProductSubmit());
};

createProductMain();
