async function getMyTickets() {
    return getRequest("/v1/tickets/my");
}


async function getTicketById(ticketId) {

    validateTicketId(ticketId);

    return getRequest(
        `/v1/tickets/${encodeURIComponent(ticketId)}`
    );
}


async function createTicket(ticketData) {

    validateTicketData(ticketData);

    return postRequest(
        "/v1/tickets",
        ticketData
    );
}


async function cancelTicket(ticketId) {

    validateTicketId(ticketId);

    return deleteRequest(
        `/v1/tickets/${encodeURIComponent(ticketId)}`
    );
}


function validateTicketId(ticketId) {

    if (!ticketId) {
        throw new Error("Ticket ID is required.");
    }
}


function validateTicketData(ticketData) {

    if (!ticketData) {
        throw new Error("Ticket information is required.");
    }

    if (!ticketData.eventId) {
        throw new Error("Event ID is required.");
    }

    if (
        !Number.isInteger(ticketData.quantity) ||
        ticketData.quantity < 1
    ) {
        throw new Error(
            "Ticket quantity must be at least 1."
        );
    }
}