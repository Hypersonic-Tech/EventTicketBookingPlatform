async function registerUser(userData) {
    validateRegistrationData(userData);

    return postRequest("/auth/register", {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role
    });
}

async function loginUser(credentials) {

    if (!credentials.email?.trim()) {
        throw new Error("Email is required.");
    }

    if (!credentials.password) {
        throw new Error("Password is required.");
    }

    return postRequest("/auth/login", {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
    });
}

function validateRegistrationData(userData) {
    if (!userData.firstName?.trim()) {
        throw new Error("First name is required.");
    }

    if (!userData.lastName?.trim()) {
        throw new Error("Last name is required.");
    }

    if (!userData.email?.trim()) {
        throw new Error("Email is required.");
    }

    if (!userData.password) {
        throw new Error("Password is required.");
    }

    if (userData.password.length < 8) {
        throw new Error("Password must contain at least 8 characters.");
    }

    if (!["ATTENDEE", "ORGANIZER"].includes(userData.role)) {
        throw new Error("Invalid account type.");
    }
}