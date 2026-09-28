document.addEventListener(
    "DOMContentLoaded",
    initializeEventDetails
);


async function initializeEventDetails() {

    const eventId =
        getEventIdFromUrl();

    if (!eventId) {

        showEventError(
            "Event could not be identified."
        );

        return;
    }

    await loadEventDetails(eventId);
}


function getEventIdFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
}


async function loadEventDetails(eventId) {

    try {

        const event =
            await getEventById(eventId);

        renderEventDetails(event);

    } catch (error) {

        console.error(
            "Unable to load event:",
            error
        );

        showEventError(
            error.message ||
            "Unable to load event."
        );
    }
}


function renderEventDetails(event) {

    const container =
        document.querySelector("#eventDetails");

    if (!container) {
        return;
    }

    container.innerHTML = `

        <section class="event-detail-hero">

            <div class="container">

                <span class="eyebrow">
                    ${escapeHtml(
                        event.category || "EVENT"
                    )}
                </span>

                <h1>
                    ${escapeHtml(event.name)}
                </h1>

                <p class="event-detail-intro">
                    ${escapeHtml(
                        event.description || ""
                    )}
                </p>

            </div>

        </section>


        <section class="event-detail-content">

            <div class="container event-detail-layout">


                <div class="event-main-info">

                    <div class="detail-block">

                        <span class="detail-label">
                            ABOUT THE EVENT
                        </span>

                        <p>
                            ${escapeHtml(
                                event.description || ""
                            )}
                        </p>

                    </div>


                    <div class="detail-grid">

                        <div class="detail-item">

                            <span>
                                DATE
                            </span>

                            <strong>
                                ${formatDate(
                                    event.startTime
                                )}
                            </strong>

                        </div>


                        <div class="detail-item">

                            <span>
                                TIME
                            </span>

                            <strong>
                                ${formatTime(
                                    event.startTime
                                )}
                            </strong>

                        </div>


                        <div class="detail-item">

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


                        <div class="detail-item">

                            <span>
                                LOCATION
                            </span>

                            <strong>
                                ${escapeHtml(
                                    event.venue?.city ||
                                    "Location TBA"
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <aside class="booking-card">

                    <span class="eyebrow">
                        READY TO GO?
                    </span>

                    <h2>
                        Get your ticket.
                    </h2>

                    <p>
                        Secure your place at this
                        experience before tickets sell out.
                    </p>


                    <div class="booking-divider"></div>


                    <div class="booking-info">

                        <span>
                            SALES END
                        </span>

                        <strong>
                            ${formatDate(
                                event.salesEnd
                            )}
                        </strong>

                    </div>


                    <button
                        type="button"
                        id="bookTicketButton"
                        class="btn btn-primary booking-button"
                    >
                        Book Ticket
                    </button>


                    <span
                        id="bookingMessage"
                        class="booking-message"
                    ></span>

                </aside>

            </div>

        </section>
    `;


    initializeBookingButton(event);
}


function initializeBookingButton(event) {

    const button =
        document.querySelector(
            "#bookTicketButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => handleBooking(event)
    );
}


function handleBooking(event) {

    if (!isAuthenticated()) {

        const loginUrl =
            `login.html?redirect=${encodeURIComponent(
                `event-details.html?id=${event.id}`
            )}`;

        window.location.href =
            loginUrl;

        return;
    }


    const checkoutUrl =
        `checkout.html?eventId=${encodeURIComponent(
            event.id
        )}`;

    window.location.href =
        checkoutUrl;
}


function showEventError(message) {

    const container =
        document.querySelector("#eventDetails");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="event-details-loading">
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
            month: "long",
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