/* =========================================================
   EVENT SERVICE
   ========================================================= */

async function getPublishedEvents(
    page = 0,
    size = 10
) {

    return getRequest(
        `/v1/events/published?page=${page}&size=${size}`
    );
}


async function getEventById(eventId) {

    validateEventId(eventId);

    return getRequest(
        `/v1/events/${eventId}`
    );
}


async function createEvent(eventData) {

    validateEventData(eventData);

    return postRequest(
        "/v1/events",
        eventData
    );
}


async function updateEvent(
    eventId,
    eventData
) {

    validateEventId(eventId);

    validateEventData(eventData);

    return putRequest(
        `/v1/events/${eventId}`,
        eventData
    );
}


async function deleteEvent(eventId) {

    validateEventId(eventId);

    return deleteRequest(
        `/v1/events/${eventId}`
    );
}


/* =========================================================
   VALIDATION
   ========================================================= */

function validateEventId(eventId) {

    if (!eventId) {

        throw new Error(
            "Event ID is required."
        );
    }
}


function validateEventData(eventData) {

    if (!eventData) {

        throw new Error(
            "Event data is required."
        );
    }

    if (!eventData.name?.trim()) {

        throw new Error(
            "Event name is required."
        );
    }

    if (!eventData.description?.trim()) {

        throw new Error(
            "Event description is required."
        );
    }
}
async function createEvent(eventData) {

    validateEventData(eventData);

    return postRequest(
        "/v1/events",
        eventData
    );
}


function validateEventData(eventData) {

    if (!eventData) {
        throw new Error("Event data is required.");
    }

    if (!eventData.name?.trim()) {
        throw new Error("Event name is required.");
    }

    if (!eventData.description?.trim()) {
        throw new Error("Event description is required.");
    }

    if (!eventData.startTime) {
        throw new Error("Event start time is required.");
    }

    if (!eventData.endTime) {
        throw new Error("Event end time is required.");
    }

    if (!eventData.salesStart) {
        throw new Error("Sales start time is required.");
    }

    if (!eventData.salesEnd) {
        throw new Error("Sales end time is required.");
    }

    if (!eventData.venueId) {
        throw new Error("Venue is required.");
    }
}
async function cancelEvent(eventId) {

    validateEventId(eventId);

    return deleteRequest(
        `/v1/events/${encodeURIComponent(eventId)}`
    );
}