async function getOrganizerDashboard() {
    return getRequest("/v1/organizer/dashboard");
}

async function getOrganizerEvents() {
    return getRequest("/v1/organizer/events");
}

async function getOrganizerEvent(eventId) {
    validateOrganizerEventId(eventId);

    return getRequest(
        `/v1/organizer/events/${encodeURIComponent(eventId)}`
    );
}

async function assignStaff(eventId, staffId) {
    validateOrganizerEventId(eventId);
    validateStaffId(staffId);

    return postRequest(
        `/v1/organizer/events/${encodeURIComponent(eventId)}/staff`,
        {
            staffId
        }
    );
}

async function getEventStaff(eventId) {
    validateOrganizerEventId(eventId);

    return getRequest(
        `/v1/organizer/events/${encodeURIComponent(eventId)}/staff`
    );
}

async function removeStaff(eventId, staffId) {
    validateOrganizerEventId(eventId);
    validateStaffId(staffId);

    return deleteRequest(
        `/v1/organizer/events/${encodeURIComponent(eventId)}/staff/${encodeURIComponent(staffId)}`
    );
}

function validateOrganizerEventId(eventId) {
    if (!eventId) {
        throw new Error("Event ID is required.");
    }
}

function validateStaffId(staffId) {
    if (!staffId) {
        throw new Error("Staff ID is required.");
    }
}
async function getOrganizerStaff() {

    return getRequest(
        "/v1/organizer/staff"
    );
}


async function getOrganizerEvents() {

    return getRequest(
        "/v1/organizer/events"
    );
}


async function assignStaffToEvent(
    eventId,
    staffId
) {

    if (!eventId) {
        throw new Error(
            "Event ID is required."
        );
    }

    if (!staffId) {
        throw new Error(
            "Staff ID is required."
        );
    }

    return postRequest(
        `/v1/events/${encodeURIComponent(eventId)}/staff`,
        {
            staffId
        }
    );
}


async function removeStaffFromEvent(
    eventId,
    staffId
) {

    if (!eventId) {
        throw new Error(
            "Event ID is required."
        );
    }

    if (!staffId) {
        throw new Error(
            "Staff ID is required."
        );
    }

    return deleteRequest(
        `/v1/events/${encodeURIComponent(eventId)}/staff/${encodeURIComponent(staffId)}`
    );
}


async function getEventStaff(eventId) {

    if (!eventId) {
        throw new Error(
            "Event ID is required."
        );
    }

    return getRequest(
        `/v1/events/${encodeURIComponent(eventId)}/staff`
    );
}


async function getOrganizerDashboard() {

    return getRequest(
        "/v1/organizer/dashboard"
    );
}