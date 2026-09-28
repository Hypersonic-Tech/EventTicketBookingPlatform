document.addEventListener(
    "DOMContentLoaded",
    initializeOrganizerEventsPage
);


async function initializeOrganizerEventsPage() {

    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    initializeEventFilters();

    await loadOrganizerEvents();
}


async function loadOrganizerEvents() {

    const container =
        document.querySelector("#organizerEvents");

    if (!container) {
        return;
    }

    showLoadingState(container);

    try {

        const response =
            await getOrganizerEvents();

        const events =
            extractEvents(response);

        renderOrganizerEvents(
            container,
            events
        );

    } catch (error) {

        console.error(
            "Unable to load organizer events:",
            error
        );

        showErrorState(
            container,
            error.message
        );
    }
}


function extractEvents(response) {

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.events)) {
        return response.events;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
}


function renderOrganizerEvents(
    container,
    events
) {

    if (!events.length) {

        container.innerHTML = `
            <div class="empty-state">

                <span class="empty-state-number">
                    00
                </span>

                <h3>
                    No events yet.
                </h3>

                <p>
                    Create your first event and start building your audience.
                </p>

                <a
                    href="create-event.html"
                    class="btn btn-primary"
                >
                    Create Event
                </a>

            </div>
        `;

        return;
    }

    container.innerHTML = events
        .map(createEventCard)
        .join("");
}


function createEventCard(event) {

    const eventId =
        event.id ?? "";

    const status =
        event.status ?? "DRAFT";

    const eventName =
        escapeHtml(
            event.name ?? "Untitled Event"
        );

    const description =
        escapeHtml(
            event.description ?? "No description available."
        );

    const venueName =
        escapeHtml(
            event.venue?.name ??
            "Venue not specified"
        );

    const city =
        escapeHtml(
            event.venue?.city ?? ""
        );

    return `
        <article
            class="organizer-event-card"
            data-event-status="${status}"
        >

            <div class="organizer-event-card-top">

                <span class="event-status ${getStatusClass(status)}">
                    ${escapeHtml(status)}
                </span>

                <span class="event-card-number">
                    ${formatEventNumber(eventId)}
                </span>

            </div>


            <div class="organizer-event-card-content">

                <h3>
                    ${eventName}
                </h3>

                <p>
                    ${description}
                </p>

            </div>


            <div class="organizer-event-card-meta">

                <div>
                    <span>DATE</span>
                    <strong>
                        ${formatEventDate(event.startTime)}
                    </strong>
                </div>

                <div>
                    <span>VENUE</span>
                    <strong>
                        ${venueName}
                    </strong>
                </div>

                <div>
                    <span>LOCATION</span>
                    <strong>
                        ${city || "—"}
                    </strong>
                </div>

            </div>


            <div class="organizer-event-card-footer">

                <a
                    href="event-manage.html?id=${encodeURIComponent(eventId)}"
                    class="event-manage-link"
                >
                    Manage Event →
                </a>

            </div>

        </article>
    `;
}


function initializeEventFilters() {

    const filterButtons =
        document.querySelectorAll(
            ".event-tab"
        );

    if (!filterButtons.length) {
        return;
    }

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setActiveFilter(
                    filterButtons,
                    button
                );

                const filter =
                    button.dataset.filter;

                filterOrganizerEvents(
                    filter
                );
            }
        );
    });
}


function setActiveFilter(
    buttons,
    activeButton
) {

    buttons.forEach(button => {

        button.classList.remove(
            "active"
        );

    });

    activeButton.classList.add(
        "active"
    );
}


function filterOrganizerEvents(filter) {

    const eventCards =
        document.querySelectorAll(
            ".organizer-event-card"
        );

    eventCards.forEach(card => {

        const status =
            card.dataset.eventStatus;

        const shouldShow =
            filter === "ALL" ||
            matchesEventFilter(
                status,
                filter
            );

        card.style.display =
            shouldShow
                ? ""
                : "none";
    });
}


function matchesEventFilter(
    status,
    filter
) {

    const normalizedStatus =
        status.toUpperCase();

    if (filter === "UPCOMING") {

        return (
            normalizedStatus === "UPCOMING" ||
            normalizedStatus === "PUBLISHED"
        );
    }

    if (filter === "ACTIVE") {

        return (
            normalizedStatus === "ACTIVE"
        );
    }

    if (filter === "COMPLETED") {

        return (
            normalizedStatus === "COMPLETED" ||
            normalizedStatus === "ENDED"
        );
    }

    return true;
}


function formatEventDate(dateValue) {

    if (!dateValue) {
        return "Date not set";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function formatEventNumber(eventId) {

    if (!eventId) {
        return "#EVENT";
    }

    return `#${String(eventId)
        .substring(0, 6)
        .toUpperCase()}`;
}


function getStatusClass(status) {

    const normalizedStatus =
        status.toLowerCase();

    if (
        normalizedStatus === "active" ||
        normalizedStatus === "published"
    ) {
        return "status-active";
    }

    if (
        normalizedStatus === "completed" ||
        normalizedStatus === "ended"
    ) {
        return "status-completed";
    }

    if (
        normalizedStatus === "cancelled" ||
        normalizedStatus === "canceled"
    ) {
        return "status-cancelled";
    }

    return "status-draft";
}


function showLoadingState(container) {

    container.innerHTML = `
        <div class="dashboard-loading">
            Loading your events...
        </div>
    `;
}


function showErrorState(
    container,
    message
) {

    container.innerHTML = `
        <div class="dashboard-error">

            <h3>
                Unable to load events
            </h3>

            <p>
                ${escapeHtml(
                    message ||
                    "Something went wrong."
                )}
            </p>

            <button
                type="button"
                class="btn btn-secondary"
                id="retryEventsButton"
            >
                Try Again
            </button>

        </div>
    `;

    const retryButton =
        document.querySelector(
            "#retryEventsButton"
        );

    retryButton?.addEventListener(
        "click",
        loadOrganizerEvents
    );
}


function escapeHtml(value) {

    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;
}