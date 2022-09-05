const usernamePasswordFormValidCheck = (): ErrorMessage | null => {
    const usernameInput = document.querySelector(
        "#username",
    ) as HTMLInputElement;
    const username = usernameInput.value;
    if (username.trim() === "") {
        return "Brugernavn felt må ikke være tomt.";
    }
    const passwordInput = document.querySelector(
        "#password",
    ) as HTMLInputElement;
    const password = passwordInput.value;
    if (password.trim() === "") {
        return "Adgangskode felt må ikke være tomt.";
    }
    return null;
};

const submitUsernamePasswordForm = async (
    endpoint: string,
    redirectUrl: string,
) => {
    const error = usernamePasswordFormValidCheck();
    if (error !== null) {
        displayError(error);
        return;
    }
    clearError();

    const usernameInput = document.querySelector(
        "#username",
    ) as HTMLInputElement;
    const username = usernameInput.value;
    const passwordInput = document.querySelector(
        "#password",
    ) as HTMLInputElement;
    const password = passwordInput.value;

    const res = await (
        await fetch(`/api/user/${endpoint}`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: new Headers({ "Content-Type": "application/json" }),
        })
    ).json();

    if (res.msg !== "Ok") {
        displayError(res.msg);
    } else {
        window.location.href = redirectUrl;
    }
};

const usernamePasswordFormMain = (apiEndpoint: string, redirectUrl: string) => {
    const usernameInput = document.querySelector("#username")!;
    const passwordInput = document.querySelector("#password")!;
    const submitElement = document.querySelector("#submit")!;
    usernameInput.addEventListener("keydown", (event: Event) => {
        submitOnEnterKey(event as KeyboardEvent);
    });
    passwordInput.addEventListener("keydown", (event: Event) => {
        submitOnEnterKey(event as KeyboardEvent);
    });
    submitElement.addEventListener("click", () =>
        submitUsernamePasswordForm(apiEndpoint, redirectUrl),
    );
};
