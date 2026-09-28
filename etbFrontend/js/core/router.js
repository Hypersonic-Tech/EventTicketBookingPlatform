const ROUTES = {
    HOME: "../index.html",
    LOGIN: "../pages/login.html",
    SIGNUP: "../pages/signup.html",

    ATTENDEE_DASHBOARD: "../pages/attendee/dashboard.html",
    ORGANIZER_DASHBOARD: "../pages/organizer/dashboard.html",
    STAFF_DASHBOARD: "../pages/staff/dashboard.html",
    ADMIN_DASHBOARD: "../pages/admin/dashboard.html"
};

function navigateTo(route) {
    if (!route) {
        return;
    }

    window.location.href = route;
}

function navigateToRoleDashboard(role) {
    const dashboardRoutes = {
        ATTENDEE: ROUTES.ATTENDEE_DASHBOARD,
        ORGANIZER: ROUTES.ORGANIZER_DASHBOARD,
        STAFF: ROUTES.STAFF_DASHBOARD,
        ADMIN: ROUTES.ADMIN_DASHBOARD
    };

    const route = dashboardRoutes[role];

    if (!route) {
        throw new Error("Unknown user role.");
    }

    navigateTo(route);
}