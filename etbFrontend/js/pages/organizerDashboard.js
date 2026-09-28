document.addEventListener(
    "DOMContentLoaded",
    initializeOrganizerDashboard
);

async function initializeOrganizerDashboard() {

    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    try {
        const dashboard = await getOrganizerDashboard();

        renderOrganizerStats(dashboard);
        renderRecentEvents(dashboard);

    } catch (error) {

        console.error("Organizer dashboard error:", error);

        showDashboardError(
            "Unable to load your organizer dashboard."
        );
    }
}


function renderOrganizerStats(data) {

    setElementText(
        "totalEvents",
        data.totalEvents ?? 0
    );

    setElementText(
        "upcomingEvents",
        data.upcomingEvents ?? 0
    );

    setElementText(
        "ticketsSold",
        data.ticketsSold ?? 0
    );

    setElementText(
        "activeEvents",
        data.activeEvents ?? 0
    );
}


function renderRecentEvents(data) {

    const container =
        document.querySelector("#recentEvents");

    if (!container) {
        return;
    }

    const events = extractEvents(data);

    if (!events.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No events yet</h3>
                <p>Create your first event and start building your audience.</p>

                <a href="create-event.html"
                   class="btn btn-primary">
                    Create Event
                </a>
            </div>
        `;

        return;
    }

    container.innerHTML = events
        .slice(0, 5)
        .map(createEventRow)
        .join("");
}


function extractEvents(data) {

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.events)) {
        return data.events;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    return [];
}


function createEventRow(event) {

    const eventId = event.id;

    return `
        <article class="organizer-event-row">

            <div class="event-date-block">
                <span>${formatEventMonth(event.startTime)}</span>
                <strong>${formatEventDay(event.startTime)}</strong>
            </div>

            <div class="organizer-event-info">

                <span class="event-status">
                    ${event.status ?? "DRAFT"}
                </span>

                <h3>
                    ${escapeHtml(event.name ?? "Untitled Event")}
                </h3>

                <p>
                    ${escapeHtml(event.venue?.name ?? "Venue not specified")}
                </p>

            </div>

            <a
                href="event-manage.html?id=${encodeURIComponent(eventId)}"
                class="event-manage-link"
            >
                Manage →
            </a>

        </article>
    `;
}


function formatEventMonth(dateValue) {

    if (!dateValue) {
        return "--";
    }

    const date = new Date(dateValue);

    return date
        .toLocaleString("en-US", {
            month: "short"
        })
        .toUpperCase();
}


function formatEventDay(dateValue) {

    if (!dateValue) {
        return "--";
    }

    return new Date(dateValue)
        .getDate()
        .toString()
        .padStart(2, "0");
}


function setElementText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function showDashboardError(message) {

    const container =
        document.querySelector("#recentEvents");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="dashboard-error">
            ${escapeHtml(message)}
        </div>
    `;
}


function escapeHtml(value) {

    const element = document.createElement("div");

    element.textContent = value;

    return element.innerHTML;
}