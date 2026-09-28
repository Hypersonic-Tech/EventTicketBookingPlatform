document.addEventListener(
    "DOMContentLoaded",
    initializeMyTickets
);


async function initializeMyTickets() {

    if (!isAuthenticated()) {
        navigateTo(ROUTES.LOGIN);
        return;
    }

    initializeUser();

    await loadTickets();
}


function initializeUser() {

    const user =
        getCurrentUser();

    if (!user) {
        return;
    }

    const name = [
        user.firstName,
        user.lastName
    ]
        .filter(Boolean)
        .join(" ");

    setText(
        "#userName",
        name
    );

    setText(
        "#userAvatar",
        (
            user.firstName?.charAt(0) ||
            "U"
        ).toUpperCase()
    );
}


async function loadTickets() {

    const container =
        document.querySelector(
            "#ticketList"
        );

    try {

        const response =
            await getMyTickets();

        const tickets =
            Array.isArray(response)
                ? response
                : response?.content ||
                  response?.data ||
                  [];

        renderTickets(
            tickets
        );

    } catch (error) {

        console.error(
            "Unable to load tickets:",
            error
        );

        if (container) {
            container.innerHTML = `
                <div class="dashboard-empty">
                    Unable to load your tickets.
                </div>
            `;
        }
    }
}


function renderTickets(tickets) {

    const container =
        document.querySelector(
            "#ticketList"
        );

    if (!container) {
        return;
    }

    if (!tickets.length) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <h3>
                    No tickets yet.
                </h3>

                <p>
                    Find an event and book your
                    first experience.
                </p>

                <a
                    href="../events.html"
                    class="btn btn-primary"
                >
                    Discover Events
                </a>

            </div>

        `;

        return;
    }


    container.innerHTML =
        tickets
            .map(createTicketCard)
            .join("");
}


function createTicketCard(ticket) {

    const event =
        ticket.event || {};

    return `

        <article class="my-ticket-card">

            <div class="my-ticket-date">

                <span>
                    ${formatMonth(
                        event.startTime
                    )}
                </span>

                <strong>
                    ${formatDay(
                        event.startTime
                    )}
                </strong>

            </div>


            <div class="my-ticket-info">

                <span class="event-category">
                    ${escapeHtml(
                        ticket.status ||
                        "CONFIRMED"
                    )}
                </span>

                <h2>
                    ${escapeHtml(
                        event.name ||
                        "Event"
                    )}
                </h2>

                <p>
                    ${formatDate(
                        event.startTime
                    )}

                    ·

                    ${escapeHtml(
                        event.venue?.name ||
                        "Venue TBA"
                    )}
                </p>

            </div>


            <a
                href="../ticket.html?id=${encodeURIComponent(
                    ticket.id
                )}"
                class="event-card-arrow"
            >
                →
            </a>

        </article>

    `;
}


function formatMonth(value) {

    if (!value) {
        return "---";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            month: "short"
        }
    )
        .format(new Date(value))
        .toUpperCase();
}


function formatDay(value) {

    if (!value) {
        return "--";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit"
        }
    ).format(new Date(value));
}


function formatDate(value) {

    if (!value) {
        return "Date TBA";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(new Date(value));
}


function setText(
    selector,
    value
) {

    const element =
        document.querySelector(
            selector
        );

    if (element) {
        element.textContent =
            value;
    }
}


function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}