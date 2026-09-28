document.addEventListener(
    "DOMContentLoaded",
    initializeCheckout
);


let checkoutEvent = null;
let ticketQuantity = 1;


async function initializeCheckout() {

    if (!isAuthenticated()) {
        navigateTo(ROUTES.LOGIN);
        return;
    }

    const eventId =
        getEventId();

    if (!eventId) {

        showCheckoutError(
            "No event was selected."
        );

        return;
    }

    initializeQuantityControls();
    initializeBookingButton();

    loadAttendeeInformation();

    await loadCheckoutEvent(eventId);
}


/* =========================
   EVENT
========================= */

function getEventId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("eventId");
}


async function loadCheckoutEvent(eventId) {

    try {

        checkoutEvent =
            await getEventById(eventId);

        renderCheckoutEvent();

        updateSummary();

    } catch (error) {

        console.error(
            "Unable to load checkout event:",
            error
        );

        showCheckoutError(
            error.message ||
            "Unable to load event."
        );
    }
}


function renderCheckoutEvent() {

    const container =
        document.querySelector(
            "#checkoutEvent"
        );

    if (!container || !checkoutEvent) {
        return;
    }

    container.innerHTML = `

        <span class="checkout-event-category">
            ${escapeHtml(
                checkoutEvent.category ||
                "EVENT"
            )}
        </span>

        <h3>
            ${escapeHtml(
                checkoutEvent.name
            )}
        </h3>

        <p>
            ${formatDate(
                checkoutEvent.startTime
            )}
            ·
            ${escapeHtml(
                checkoutEvent.venue?.name ||
                "Venue TBA"
            )}
        </p>

    `;
}


/* =========================
   ATTENDEE
========================= */

function loadAttendeeInformation() {

    const user =
        getCurrentUser();

    const container =
        document.querySelector(
            "#attendeeInformation"
        );

    if (!container || !user) {
        return;
    }

    const fullName = [
        user.firstName,
        user.lastName
    ]
        .filter(Boolean)
        .join(" ");

    container.innerHTML = `

        <div class="attendee-name">
            ${escapeHtml(fullName)}
        </div>

        <div class="attendee-email">
            ${escapeHtml(user.email)}
        </div>

    `;
}


/* =========================
   QUANTITY
========================= */

function initializeQuantityControls() {

    const increase =
        document.querySelector(
            "#increaseQuantity"
        );

    const decrease =
        document.querySelector(
            "#decreaseQuantity"
        );

    increase?.addEventListener(
        "click",
        increaseQuantity
    );

    decrease?.addEventListener(
        "click",
        decreaseQuantity
    );
}


function increaseQuantity() {

    if (ticketQuantity >= 10) {
        return;
    }

    ticketQuantity++;

    updateQuantityDisplay();
    updateSummary();
}


function decreaseQuantity() {

    if (ticketQuantity <= 1) {
        return;
    }

    ticketQuantity--;

    updateQuantityDisplay();
    updateSummary();
}


function updateQuantityDisplay() {

    const element =
        document.querySelector(
            "#ticketQuantity"
        );

    if (element) {
        element.textContent =
            ticketQuantity;
    }
}


/* =========================
   SUMMARY
========================= */

function updateSummary() {

    if (!checkoutEvent) {
        return;
    }

    const price =
        Number(
            checkoutEvent.ticketPrice ||
            checkoutEvent.price ||
            0
        );

    const fee =
        calculatePlatformFee(
            price * ticketQuantity
        );

    const total =
        price * ticketQuantity + fee;


    setText(
        "#summaryEvent",
        checkoutEvent.name
    );

    setText(
        "#summaryQuantity",
        ticketQuantity
    );

    setText(
        "#summaryPrice",
        formatCurrency(
            price * ticketQuantity
        )
    );

    setText(
        "#summaryFee",
        formatCurrency(fee)
    );

    setText(
        "#summaryTotal",
        formatCurrency(total)
    );
}


function calculatePlatformFee(amount) {

    /*
     * Placeholder only.
     *
     * Do not trust this value for actual payment.
     * Final amount must be calculated by backend.
     */

    return Math.round(
        amount * 0.02
    );
}


/* =========================
   BOOKING
========================= */

function initializeBookingButton() {

    const button =
        document.querySelector(
            "#confirmBooking"
        );

    button?.addEventListener(
        "click",
        handleBooking
    );
}


async function handleBooking() {

    if (!checkoutEvent) {
        return;
    }

    clearCheckoutError();

    const button =
        document.querySelector(
            "#confirmBooking"
        );

    setBookingLoading(
        button,
        true
    );

    try {

        const ticket =
            await createTicket({

                eventId:
                    checkoutEvent.id,

                quantity:
                    ticketQuantity

            });


        const ticketId =
            ticket?.id ||
            ticket?.ticketId ||
            ticket?.data?.id;


        if (!ticketId) {
            throw new Error(
                "Ticket was created but no ticket ID was returned."
            );
        }


        navigateTo(
            `ticket.html?id=${encodeURIComponent(
                ticketId
            )}`
        );


    } catch (error) {

        console.error(
            "Booking failed:",
            error
        );

        showCheckoutError(
            error.message ||
            "Unable to complete booking."
        );

        setBookingLoading(
            button,
            false
        );
    }
}


function setBookingLoading(
    button,
    loading
) {

    if (!button) {
        return;
    }

    button.disabled =
        loading;

    button.textContent =
        loading
            ? "Creating Ticket..."
            : "Confirm Booking";
}


/* =========================
   UI HELPERS
========================= */

function showCheckoutError(message) {

    const element =
        document.querySelector(
            "#checkoutError"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.classList.add(
        "visible"
    );
}


function clearCheckoutError() {

    const element =
        document.querySelector(
            "#checkoutError"
        );

    if (!element) {
        return;
    }

    element.textContent = "";

    element.classList.remove(
        "visible"
    );
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


function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);
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
    ).format(
        new Date(value)
    );
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