/* =====================================================
   ATBT — GLOBAL JAVASCRIPT
   Any Time Book Ticket
===================================================== */


/* =====================================================
   THEME MANAGEMENT
===================================================== */

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");


function applyTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        "atbt-theme",
        theme
    );

    updateThemeIcon(theme);
}


function updateThemeIcon(theme) {

    if (!themeIcon) {
        return;
    }

    themeIcon.textContent =
        theme === "dark"
            ? "☀"
            : "☾";
}


/*
    Load saved theme.
*/

const savedTheme =
    localStorage.getItem("atbt-theme");


if (savedTheme) {

    applyTheme(savedTheme);

} else {

    /*
        Use system preference when
        user has not selected a theme.
    */

    const prefersDark =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    applyTheme(
        prefersDark
            ? "dark"
            : "light"
    );
}


/*
    Theme button.
*/

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            const currentTheme =
                document.documentElement
                    .getAttribute("data-theme");

            const newTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";

            applyTheme(newTheme);

        }
    );

}


/* =====================================================
   ROLE SELECTION
===================================================== */

const roleOptions =
    document.querySelectorAll(
        ".role-option"
    );

const selectedRole =
    document.getElementById(
        "selectedRole"
    );


let currentRole = "ATTENDEE";


roleOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            roleOptions.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            option.classList.add(
                "active"
            );


            currentRole =
                option.dataset.role;


            const roleName =
                option
                    .querySelector("span:last-child")
                    ?.textContent
                    .trim();


            if (selectedRole) {

                selectedRole.textContent =
                    roleName;

            }

        }
    );

});


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

const password =
    document.getElementById(
        "password"
    );


const passwordToggle =
    document.getElementById(
        "passwordToggle"
    );


if (passwordToggle) {

    passwordToggle.addEventListener(
        "click",
        () => {

            const isPassword =
                password.type === "password";


            password.type =
                isPassword
                    ? "text"
                    : "password";


            passwordToggle.textContent =
                isPassword
                    ? "Hide"
                    : "Show";

        }
    );

}


/* =====================================================
   LOGIN FORM
===================================================== */

const loginForm =
    document.getElementById(
        "loginForm"
    );


const email =
    document.getElementById(
        "email"
    );


const passwordError =
    document.getElementById(
        "passwordError"
    );


const emailError =
    document.getElementById(
        "emailError"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginButtonText =
    document.getElementById(
        "loginButtonText"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearErrors();


            const emailValue =
                email.value.trim();


            const passwordValue =
                password.value;


            let isValid = true;


            /* Email */

            if (!emailValue) {

                emailError.textContent =
                    "Email is required.";

                isValid = false;

            }
            else if (
                !isValidEmail(emailValue)
            ) {

                emailError.textContent =
                    "Enter a valid email address.";

                isValid = false;

            }


            /* Password */

            if (!passwordValue) {

                passwordError.textContent =
                    "Password is required.";

                isValid = false;

            }
            else if (
                passwordValue.length < 6
            ) {

                passwordError.textContent =
                    "Password must contain at least 6 characters.";

                isValid = false;

            }


            if (!isValid) {
                return;
            }


            /* Loading */

            setLoginLoading(true);


            /*
                BACKEND WILL BE CONNECTED HERE.

                Future Spring Boot request:

                POST /api/auth/login

                {
                    email,
                    password,
                    role
                }

                Backend will return JWT.
            */


            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );


            console.log(
                "ATBT Login"
            );

            console.log(
                "Email:",
                emailValue
            );

            console.log(
                "Role:",
                currentRole
            );


            alert(
                `ATBT Login Demo\n\n` +
                `Role: ${currentRole}\n` +
                `Email: ${emailValue}`
            );


            setLoginLoading(false);

        }
    );

}


/* =====================================================
   LOGIN LOADING STATE
===================================================== */

function setLoginLoading(loading) {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        loading;


    loginButton.classList.toggle(
        "loading",
        loading
    );


    if (loginButtonText) {

        loginButtonText.textContent =
            loading
                ? "Signing in..."
                : "Sign in";

    }

}


/* =====================================================
   EMAIL VALIDATION
===================================================== */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =====================================================
   CLEAR FORM ERRORS
===================================================== */

function clearErrors() {

    if (emailError) {
        emailError.textContent = "";
    }

    if (passwordError) {
        passwordError.textContent = "";
    }

}

/* =====================================================
   GOOGLE OAUTH
===================================================== */

const googleButton =
    document.getElementById(
        "googleButton"
    );


if (googleButton) {

    googleButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "http://localhost:8080/oauth2/authorization/google";

        }
    );
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please enter email and password.");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:8080/api/auth/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Invalid email or password.");
                    return;
                }

                // Save JWT
                localStorage.setItem("atbt_token", data.token);

                // Save user information
                localStorage.setItem(
                    "atbt_user",
                    JSON.stringify({
                        userId: data.userId,
                        email: data.email,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        role: data.role,
                        authProvider: data.authProvider
                    })
                );

                // Go to events page
                window.location.href =
                    "http://localhost:63342/ETBPlatform/pages/events.html";

            } catch (error) {
                console.error("Login error:", error);
                alert(
                    "Unable to connect to server. Make sure Spring Boot is running."
                );
            }
        });
    }

}