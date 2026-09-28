const ACCESS_TOKEN_KEY = "accessToken";
const USER_ROLE_KEY = "userRole";
const USER_DATA_KEY = "userData";

function saveAuthentication(authResponse) {
    const token = extractToken(authResponse);
    const user = extractUser(authResponse);

    if (!token) {
        throw new Error("Authentication token was not returned.");
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, token);

    if (user?.role) {
        localStorage.setItem(USER_ROLE_KEY, user.role);
    }

    if (user) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    }
}

function extractToken(authResponse) {
    return (
        authResponse?.accessToken ||
        authResponse?.token ||
        authResponse?.jwt
    );
}

function extractUser(authResponse) {
    return (
        authResponse?.user ||
        authResponse?.data?.user ||
        null
    );
}

function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getCurrentUser() {
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch {
        return null;
    }
}

function getCurrentRole() {
    return localStorage.getItem(USER_ROLE_KEY);
}

function isAuthenticated() {
    return Boolean(getAccessToken());
}

function logoutUser() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_DATA_KEY);

    navigateToLogin();
}

function navigateToLogin() {
    window.location.href = "login.html";
}

function navigateToDashboard() {
    const role = getCurrentRole();

    const dashboardRoutes = {
        ATTENDEE: "attendee/dashboard.html",
        ORGANIZER: "organizer/dashboard.html",
        STAFF: "staff/dashboard.html",
        ADMIN: "admin/dashboard.html"
    };

    const dashboard = dashboardRoutes[role];

    if (!dashboard) {
        throw new Error("Unable to determine user dashboard.");
    }

    window.location.href = dashboard;
}