document.addEventListener(
    "DOMContentLoaded",
    initializeAttendeeDashboard
);

async function initializeAttendeeDashboard() {

    if (!isAuthenticated()) {
        navigateTo(ROUTES.LOGIN);
        return;
    }

    initializeUserInformation();
    initializeLogout();

    await loadDashboardData();
}


function initializeUserInformation() {

    const user = getCurrentUser();

    if (!user) {
        return;
    }

    const fullName = buildFullName(user);

    setElementText("#userName", fullName);
    setElementText("#welcomeName", user.firstName || "there");

    const avatar = createAvatarLetter(user);

    setElementText("#userAvatar", avatar);
}


function buildFullName(user) {

    return [
        user.firstName,
        user.lastName
    ]
        .filter(Boolean)
        .join(" ");
}


function createAvatarLetter(user) {

    return (
        user.firstName?.charAt(0) ||
        user.email?.charAt(0) ||
        "U"
    ).toUpperCase();
}


function initializeLogout() {

    const logoutButton =
        document.querySelector("#logoutButton");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener(
        "click",
        handleLogout
    );
}


function handleLogout() {

    logoutUser();
}


async function loadDashboardData() {

    try {

        const [
            tickets,
            events
        ] = await Promise.all([
            loadMyTickets(),
            getPublishedEvents(0, 6)
        ]);

        updateTicketStatistics(tickets);
        renderNextEvent(tickets);
        renderRecommendedEvents(events);

    } catch (error) {

        console.error(
            "Unable to load attendee dashboard:",
            error
        );

        showDashboardError(
            "Unable to load dashboard data."
        );
    }
}


async function loadMyTickets() {

    /*
     * Temporary endpoint assumption.
     *
     * Once your TicketController is finalized,
     * replace this endpoint with the actual one.
     */

    return getRequest("/v1/tickets/my");
}


function updateTicketStatistics(tickets) {

    if (!Array.isArray(tickets)) {
        return;
    }

    const now = new Date();

    const upcoming =
        tickets.filter(ticket =>
            ticket.event?.startTime &&
            new Date(ticket.event.startTime) > now
        );

    const attended =
        tickets.filter(ticket =>
            ticket.status === "USED" ||
            ticket.status === "ATTENDED"
        );

    setElementText(
        "#ticketCount",
        tickets.length
    );

    setElementText(
        "#upcomingCount",
        upcoming.length
    );

    setElementText(
        "#attendedCount",
        attended.length
    );
}


function renderNextEvent(tickets) {

    const container =
        document.querySelector("#nextEventContainer");

    if (!container || !Array.isArray(tickets)) {
        return;
    }

    const upcomingTickets =
        tickets
            .filter(ticket =>
                ticket.event?.startTime &&
                new Date(ticket.event.startTime) > new Date()
            )
            .sort(
                (a, b) =>
                    new Date(a.event.startTime) -
                    new Date(b.event.startTime)
            );

    if (!upcomingTickets.length) {
        return;
    }

    const ticket =
        upcomingTickets[0];

    const event =
        ticket.event;

    container.innerHTML = createNextEventMarkup(
        event,
        ticket
    );
}


function createNextEventMarkup(event, ticket) {

    return `
        <div class="next-event-content">

            <div class="next-event-date">
                <span>
                    ${formatEventMonth(event.startTime)}
                </span>

                <strong>
                    ${formatEventDay(event.startTime)}
                </strong>
            </div>

            <div class="next-event-details">

                <span class="event-category">
                    UPCOMING
                </span>

                <h3>
                    ${escapeHtml(event.name)}
                </h3>

                <p>
                    ${escapeHtml(
                        event.venue?.name || "Venue TBA"
                    )}
                </p>

                <span class="event-time">
                    ${formatEventTime(event.startTime)}
                </span>

            </div>

            <a
                href="../ticket.html?id=${encodeURIComponent(ticket.id)}"
                class="btn btn-primary"
            >
                View Ticket
            </a>

        </div>
    `;
}


function renderRecommendedEvents(response) {

    const container =
        document.querySelector("#recommendedEvents");

    if (!container) {
        return;
    }

    const events =
        extractEvents(response);

    if (!events.length) {

        container.innerHTML = `
            <div class="dashboard-empty">
                No events available right now.
            </div>
        `;

        return;
    }

    container.innerHTML =
        events
            .map(createEventCardMarkup)
            .join("");
}


function extractEvents(response) {

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
}


function createEventCardMarkup(event) {

    return `
        <article class="dashboard-event-card">

            <div class="dashboard-event-image">

                <span>
                    EVENT
                </span>

            </div>

            <div class="dashboard-event-content">

                <span class="event-category">
                    ${escapeHtml(
                        event.category || "EVENT"
                    )}
                </span>

                <h3>
                    ${escapeHtml(event.name)}
                </h3>

                <p>
                    ${escapeHtml(
                        event.venue?.city || "Location TBA"
                    )}
                </p>

                <div class="event-card-bottom">

                    <span>
                        ${formatEventDate(
                            event.startTime
                        )}
                    </span>

                    <a
                        href="../event-details.html?id=${encodeURIComponent(event.id)}"
                        aria-label="View event"
                    >
                        →
                    </a>

                </div>

            </div>

        </article>
    `;
}


function formatEventDate(dateValue) {

    if (!dateValue) {
        return "Date TBA";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(new Date(dateValue));
}


function formatEventMonth(dateValue) {

    if (!dateValue) {
        return "---";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            month: "short"
        }
    ).format(new Date(dateValue))
        .toUpperCase();
}


function formatEventDay(dateValue) {

    if (!dateValue) {
        return "--";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit"
        }
    ).format(new Date(dateValue));
}


function formatEventTime(dateValue) {

    if (!dateValue) {
        return "Time TBA";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    ).format(new Date(dateValue));
}


function setElementText(selector, value) {

    const element =
        document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }
}


function showDashboardError(message) {

    const container =
        document.querySelector("#recommendedEvents");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="dashboard-empty">
            ${escapeHtml(message)}
        </div>
    `;
}


function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}