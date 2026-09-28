document.addEventListener("DOMContentLoaded", initializeSignupPage);

function initializeSignupPage() {
    initializeSignupForm();
}

function initializeSignupForm() {
    const signupForm = document.querySelector("#signupForm");

    if (!signupForm) {
        return;
    }

    signupForm.addEventListener("submit", handleSignup);
}

async function handleSignup(event) {
    event.preventDefault();

    clearSignupMessage();
    setSignupLoading(true);

    const userData = {
        firstName: getInputValue("firstName"),
        lastName: getInputValue("lastName"),
        email: getInputValue("email"),
        password: getInputValue("password"),
        role: getInputValue("role")
    };

    try {

        const response =
            await registerUser(userData);

        /*
         * Depending on your backend,
         * registration may directly return
         * an authenticated user/token.
         */

        if (extractToken(response)) {

            saveAuthentication(response);

            navigateToRoleDashboard(
                getCurrentRole()
            );

            return;
        }

        showSignupSuccess(
            "Account created successfully. Redirecting to login..."
        );

        setTimeout(() => {
            navigateTo(ROUTES.LOGIN);
        }, 1200);

    } catch (error) {

        showSignupError(error.message);

        setSignupLoading(false);
    }
}

function getInputValue(id) {
    const input = document.querySelector(`#${id}`);

    return input
        ? input.value.trim()
        : "";
}

function setSignupLoading(isLoading) {

    const button =
        document.querySelector("#signupButton");

    const buttonText =
        document.querySelector(".button-text");

    const buttonLoader =
        document.querySelector(".button-loader");

    if (!button) {
        return;
    }

    button.disabled = isLoading;

    if (buttonText) {
        buttonText.style.display =
            isLoading ? "none" : "inline";
    }

    if (buttonLoader) {
        buttonLoader.style.display =
            isLoading ? "inline" : "none";
    }
}

function showSignupError(message) {

    const messageElement =
        document.querySelector("#signupMessage");

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        message || "Unable to create account.";

    messageElement.className =
        "form-message error-message visible";
}

function showSignupSuccess(message) {

    const messageElement =
        document.querySelector("#signupMessage");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;

    messageElement.className =
        "form-message success-message visible";
}

function clearSignupMessage() {

    const messageElement =
        document.querySelector("#signupMessage");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = "";
    messageElement.className = "form-message";
}