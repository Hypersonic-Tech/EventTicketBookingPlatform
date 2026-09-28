document.addEventListener(
    "DOMContentLoaded",
    initializeTicketPage
);


async function initializeTicketPage() {

    if (!isAuthenticated()) {
        navigateTo(ROUTES.LOGIN);
        return;
    }

    const ticketId =
        getTicketId();

    if (!ticketId) {

        showTicketError(
            "Ticket could not be identified."
        );

        return;
    }

    await loadTicket(ticketId);
}


function getTicketId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
}


async function loadTicket(ticketId) {

    try {

        const ticket =
            await getTicketById(ticketId);

        renderTicket(ticket);

    } catch (error) {

        console.error(
            "Unable to load ticket:",
            error
        );

        showTicketError(
            error.message ||
            "Unable to load ticket."
        );
    }
}


function renderTicket(ticket) {

    const container =
        document.querySelector(
            "#ticketContainer"
        );

    if (!container) {
        return;
    }


    const event =
        ticket.event || {};


    const qr =
        ticket.qrCode || {};


    const qrImage =
        qr.imageUrl ||
        qr.qrImageUrl ||
        null;


    container.innerHTML = `

        <article class="ticket-card">


            <div class="ticket-information">

                <span class="ticket-status">
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


                <div class="ticket-meta">

                    <div class="ticket-meta-item">

                        <span>
                            DATE
                        </span>

                        <strong>
                            ${formatDate(
                                event.startTime
                            )}
                        </strong>

                    </div>


                    <div class="ticket-meta-item">

                        <span>
                            TIME
                        </span>

                        <strong>
                            ${formatTime(
                                event.startTime
                            )}
                        </strong>

                    </div>


                    <div class="ticket-meta-item">

                        <span>
                            VENUE
                        </span>

                        <strong>
                            ${escapeHtml(
                                event.venue?.name ||
                                "Venue TBA"
                            )}
                        </strong>

                    </div>


                    <div class="ticket-meta-item">

                        <span>
                            TICKET
                        </span>

                        <strong>
                            ${escapeHtml(
                                ticket.id
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="ticket-qr-section">

                <div class="qr-wrapper">

                    ${
                        qrImage

                        ? `
                            <img
                                src="${escapeHtml(
                                    qrImage
                                )}"
                                alt="Ticket QR code"
                            >
                        `

                        : `
                            <div class="qr-placeholder">
                                QR CODE
                            </div>
                        `
                    }

                </div>


                <div class="ticket-code">

                    ${escapeHtml(
                        qr.code ||
                        ticket.code ||
                        ticket.id ||
                        ""
                    )}

                </div>

            </div>


        </article>
    `;
}


function showTicketError(message) {

    const container =
        document.querySelector(
            "#ticketContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="ticket-loading">
            ${escapeHtml(message)}
        </div>
    `;
}


function formatDate(value) {

    if (!value) {
        return "TBA";
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


function formatTime(value) {

    if (!value) {
        return "TBA";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    ).format(new Date(value));
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