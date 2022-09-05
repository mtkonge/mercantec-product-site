type ErrorMessage = string;

const inputValue = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    return input.value;
};

const stripInput = (inputId: string) => {
    return inputValue(inputId).trim();
};

const submitOnEnterKey = (event: KeyboardEvent) => {
    if (event.keyCode === 13 || event.key === "Enter") {
        const submitElement = document.querySelector("#submit") as HTMLElement;
        submitElement.click!();
    }
};

const displayError = (error: ErrorMessage) => {
    const errorElement = document.querySelector(".form-error")!;
    errorElement.textContent = error;
};

const clearError = () => {
    const errorElement = document.querySelector(".form-error")!;
    errorElement.textContent = "";
};
