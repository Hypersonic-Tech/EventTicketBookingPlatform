document.addEventListener(
    "DOMContentLoaded",
    initializeStaffDashboard
);


let assignedEvents = [];


async function initializeStaffDashboard() {

    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    initializeLogout();
    initializeRefresh();

    await loadAssignedEvents();
}


/* =========================================================
   EVENTS
========================================================= */

async function loadAssignedEvents() {

    const container =
        document.querySelector(
            "#staffEventsList"
        );

    if (!container) {
        return;
    }


    showLoading(container);


    try {

        const response =
            await getAssignedEvents();


        assignedEvents =
            extractEvents(response);


        renderEvents(
            assignedEvents
        );


        updateStats(
            assignedEvents
        );


    } catch (error) {

        console.error(
            "Unable to load assigned events:",
            error
        );


        showError(
            container,
            error.message
        );
    }
}


function extractEvents(
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

    if (Array.isArray(response?.events)) {
        return response.events;
    }

    return [];
}


/* =========================================================
   RENDER
========================================================= */

function renderEvents(
    events
) {

    const container =
        document.querySelector(
            "#staffEventsList"
        );

    if (!container) {
        return;
    }


    if (!events.length) {

        container.innerHTML = `
            <div class="empty-state">

                <span class="empty-state-number">
                    00
                </span>

                <h3>
                    No events assigned
                </h3>

                <p>
                    Events assigned to you by an
                    organizer will appear here.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        events
            .map(createEventCard)
            .join("");


    initializeEventButtons();
}


function createEventCard(
    event
) {

    const eventId =
        event.id
        || event.eventId
        || "";


    const eventName =
        event.name
        || "Unnamed Event";


    const status =
        event.status
        || "UPCOMING";


    const venue =
        event.venue?.name
        || event.venueName
        || "Venue not specified";


    const city =
        event.venue?.city
        || event.city
        || "";


    const checkedIn =
        event.checkedIn
        ?? 0;


    const capacity =
        event.capacity
        ?? event.venue?.capacity
        ?? "—";


    return `
        <article
            class="staff-event-card"
        >

            <div class="staff-event-date">
                ${formatEventDate(event.startTime)}
            </div>


            <div class="staff-event-main">

                <div class="staff-event-top">

                    <span class="staff-event-status">
                        ${escapeHtml(status)}
                    </span>

                </div>


                <h3>
                    ${escapeHtml(eventName)}
                </h3>


                <div class="staff-event-location">

                    <span>
                        ${escapeHtml(venue)}
                    </span>

                    ${
                        city
                            ? `<span>
                                ${escapeHtml(city)}
                               </span>`
                            : ""
                    }

                </div>


                <div class="staff-event-meta">

                    <div>
                        <span>CHECKED IN</span>
                        <strong>
                            ${checkedIn}
                        </strong>
                    </div>


                    <div>
                        <span>CAPACITY</span>
                        <strong>
                            ${capacity}
                        </strong>
                    </div>

                </div>

            </div>


            <div class="staff-event-action">

                <a
                    href="scanner.html?eventId=${encodeURIComponent(eventId)}"
                    class="btn btn-primary"
                >
                    Open Scanner
                </a>

            </div>

        </article>
    `;
}


/* =========================================================
   STATS
========================================================= */

function updateStats(
    events
) {

    const assignedElement =
        document.querySelector(
            "#assignedEventCount"
        );


    if (assignedElement) {
        assignedElement.textContent =
            events.length;
    }


    const today =
        new Date();


    const todayEvents =
        events.filter(
            event => {

                if (!event.startTime) {
                    return false;
                }

                const eventDate =
                    new Date(
                        event.startTime
                    );

                return (
                    eventDate.getFullYear()
                    === today.getFullYear()
                    &&
                    eventDate.getMonth()
                    === today.getMonth()
                    &&
                    eventDate.getDate()
                    === today.getDate()
                );
            }
        );


    const todayElement =
        document.querySelector(
            "#todayEventCount"
        );


    if (todayElement) {
        todayElement.textContent =
            todayEvents.length;
    }


    const checkedIn =
        events.reduce(
            (
                total,
                event
            ) => total +
                Number(
                    event.checkedIn
                    ?? 0
                ),
            0
        );


    const checkedInElement =
        document.querySelector(
            "#checkedInCount"
        );


    if (checkedInElement) {
        checkedInElement.textContent =
            checkedIn;
    }
}


/* =========================================================
   ACTIONS
========================================================= */

function initializeEventButtons() {

    const buttons =
        document.querySelectorAll(
            ".staff-event-action a"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    button.classList.add(
                        "loading"
                    );

                }
            );

        }
    );
}


function initializeRefresh() {

    const button =
        document.querySelector(
            "#refreshEventsButton"
        );


    button?.addEventListener(
        "click",
        async () => {

            button.disabled = true;

            button.textContent =
                "Refreshing...";


            await loadAssignedEvents();


            button.disabled = false;

            button.textContent =
                "Refresh";
        }
    );
}


function initializeLogout() {

    const button =
        document.querySelector(
            "#logoutButton"
        );


    button?.addEventListener(
        "click",
        () => {

            logout();

            redirectToLogin();

        }
    );
}


/* =========================================================
   HELPERS
========================================================= */

function formatEventDate(
    value
) {

    if (!value) {
        return "DATE TBD";
    }


    const date =
        new Date(value);


    if (Number.isNaN(
        date.getTime()
    )) {

        return "DATE TBD";
    }


    return date
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        )
        .toUpperCase();
}


function showLoading(
    container
) {

    container.innerHTML = `
        <div class="dashboard-loading">
            Loading assigned events...
        </div>
    `;
}


function showError(
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
                    message
                    || "Something went wrong."
                )}
            </p>

        </div>
    `;
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