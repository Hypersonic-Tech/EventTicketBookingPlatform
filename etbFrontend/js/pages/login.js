document.addEventListener("DOMContentLoaded", initializeLoginPage);

function initializeLoginPage() {
    initializeLoginForm();
    initializePasswordToggle();
    initializeGoogleLogin();
}

function initializeLoginForm() {
    const loginForm = document.querySelector("#loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();

    clearLoginError();
    setLoginLoading(true);

    const email = document.querySelector("#email")?.value.trim();
    const password = document.querySelector("#password")?.value;

    try {
        const response = await loginUser({
            email,
            password
        });

        saveAuthentication(response);

        const role = getCurrentRole();

        if (!role) {
            throw new Error("User role was not returned by the server.");
        }

        navigateToRoleDashboard(role);

    } catch (error) {
        showLoginError(error.message);
        setLoginLoading(false);
    }
}

function initializePasswordToggle() {
    const toggleButton = document.querySelector("#togglePassword");
    const passwordInput = document.querySelector("#password");

    if (!toggleButton || !passwordInput) {
        return;
    }

    toggleButton.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        toggleButton.textContent =
            isPassword ? "Hide" : "Show";
    });
}

function initializeGoogleLogin() {
    const googleButton =
        document.querySelector("#googleLoginButton");

    if (!googleButton) {
        return;
    }

    googleButton.addEventListener("click", () => {

        /*
         * Your Spring Security OAuth2 endpoint.
         * We will finalize this when we connect
         * your existing Google OAuth configuration.
         */

        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    });
}

function setLoginLoading(isLoading) {
    const loginButton =
        document.querySelector("#loginButton");

    const buttonText =
        document.querySelector(".button-text");

    const buttonLoader =
        document.querySelector(".button-loader");

    if (!loginButton) {
        return;
    }

    loginButton.disabled = isLoading;

    if (buttonText) {
        buttonText.style.display =
            isLoading ? "none" : "inline";
    }

    if (buttonLoader) {
        buttonLoader.style.display =
            isLoading ? "inline" : "none";
    }
}

function showLoginError(message) {
    const errorElement =
        document.querySelector("#loginError");

    if (!errorElement) {
        return;
    }

    errorElement.textContent =
        message || "Login failed. Please try again.";

    errorElement.classList.add("visible");
}

function clearLoginError() {
    const errorElement =
        document.querySelector("#loginError");

    if (!errorElement) {
        return;
    }

    errorElement.textContent = "";
    errorElement.classList.remove("visible");
}