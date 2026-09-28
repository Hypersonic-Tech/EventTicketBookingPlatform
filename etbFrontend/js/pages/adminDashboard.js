document.addEventListener(
    "DOMContentLoaded",
    initializeAdminDashboard
);


async function initializeAdminDashboard() {

    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    initializeLogout();

    await loadDashboard();
}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const response =
            await getAdminDashboard();


        const dashboard =
            response?.data
            || response;


        renderDashboard(
            dashboard
        );


    } catch (error) {

        console.error(
            "Unable to load admin dashboard:",
            error
        );

        setFallbackStats();
    }


    await loadActivity();
}


function renderDashboard(
    dashboard
) {

    setText(
        "totalUsers",
        dashboard.totalUsers
        ?? dashboard.users
        ?? "—"
    );


    setText(
        "totalEvents",
        dashboard.totalEvents
        ?? dashboard.events
        ?? "—"
    );


    setText(
        "totalVenues",
        dashboard.totalVenues
        ?? dashboard.venues
        ?? "—"
    );


    setText(
        "activeUsers",
        dashboard.activeUsers
        ?? "—"
    );
}


function setFallbackStats() {

    setText(
        "totalUsers",
        "—"
    );

    setText(
        "totalEvents",
        "—"
    );

    setText(
        "totalVenues",
        "—"
    );

    setText(
        "activeUsers",
        "—"
    );
}


/* =========================================================
   ACTIVITY
========================================================= */

async function loadActivity() {

    const container =
        document.querySelector(
            "#adminActivityList"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await getAdminActivity();


        const activities =
            extractCollection(
                response
            );


        renderActivity(
            activities
        );


    } catch (error) {

        console.error(
            "Unable to load activity:",
            error
        );


        container.innerHTML = `
            <div class="admin-empty">
                Activity information unavailable.
            </div>
        `;
    }
}


function renderActivity(
    activities
) {

    const container =
        document.querySelector(
            "#adminActivityList"
        );


    if (!container) {
        return;
    }


    if (!activities.length) {

        container.innerHTML = `
            <div class="admin-empty">
                No recent activity.
            </div>
        `;

        return;
    }


    container.innerHTML =
        activities
            .slice(0, 10)
            .map(
                createActivityItem
            )
            .join("");
}


function createActivityItem(
    activity
) {

    const type =
        activity.type
        || "ACTIVITY";


    const description =
        activity.description
        || activity.message
        || "Platform activity";


    const time =
        activity.createdAt
        || activity.timestamp;


    return `
        <div class="admin-activity-item">

            <div class="activity-marker">
                /
            </div>

            <div class="activity-content">

                <span>
                    ${escapeHtml(type)}
                </span>

                <p>
                    ${escapeHtml(description)}
                </p>

            </div>

            <time>
                ${formatActivityTime(time)}
            </time>

        </div>
    `;
}


/* =========================================================
   HELPERS
========================================================= */

function extractCollection(
    response
) {

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.activities)) {
        return response.activities;
    }

    return [];
}


function initializeLogout() {

    document
        .querySelector(
            "#logoutButton"
        )
        ?.addEventListener(
            "click",
            () => {

                logout();

                redirectToLogin();
            }
        );
}


function setText(
    id,
    value
) {

    const element =
        document.querySelector(
            `#${id}`
        );

    if (element) {
        element.textContent =
            value;
    }
}


function formatActivityTime(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short"
        }
    );
}


function escapeHtml(
    value
) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        String(value);

    return element.innerHTML;
}