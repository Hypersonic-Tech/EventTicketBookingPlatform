async function getAdminDashboard() {

    return getRequest(
        "/v1/admin/dashboard"
    );
}


async function getAdminUsers() {

    return getRequest(
        "/v1/admin/users"
    );
}


async function getAdminEvents() {

    return getRequest(
        "/v1/admin/events"
    );
}


async function getAdminVenues() {

    return getRequest(
        "/v1/admin/venues"
    );
}


async function getAdminActivity() {

    return getRequest(
        "/v1/admin/activity"
    );
}


async function updateUserStatus(
    userId,
    enabled
) {

    if (!userId) {
        throw new Error(
            "User ID is required."
        );
    }

    return putRequest(
        `/v1/admin/users/${encodeURIComponent(userId)}/status`,
        {
            enabled
        }
    );
}


async function deleteAdminUser(
    userId
) {

    if (!userId) {
        throw new Error(
            "User ID is required."
        );
    }

    return deleteRequest(
        `/v1/admin/users/${encodeURIComponent(userId)}`
    );
}


async function deleteAdminEvent(
    eventId
) {

    if (!eventId) {
        throw new Error(
            "Event ID is required."
        );
    }

    return deleteRequest(
        `/v1/admin/events/${encodeURIComponent(eventId)}`
    );
}


async function createVenue(
    venueData
) {

    validateVenueData(
        venueData
    );

    return postRequest(
        "/v1/admin/venues",
        venueData
    );
}


async function updateVenue(
    venueId,
    venueData
) {

    if (!venueId) {
        throw new Error(
            "Venue ID is required."
        );
    }

    validateVenueData(
        venueData
    );

    return putRequest(
        `/v1/admin/venues/${encodeURIComponent(venueId)}`,
        venueData
    );
}


async function deleteVenue(
    venueId
) {

    if (!venueId) {
        throw new Error(
            "Venue ID is required."
        );
    }

    return deleteRequest(
        `/v1/admin/venues/${encodeURIComponent(venueId)}`
    );
}


function validateVenueData(
    venueData
) {

    if (!venueData) {
        throw new Error(
            "Venue information is required."
        );
    }

    if (!venueData.name?.trim()) {
        throw new Error(
            "Venue name is required."
        );
    }

    if (!venueData.address?.trim()) {
        throw new Error(
            "Venue address is required."
        );
    }

    if (!venueData.city?.trim()) {
        throw new Error(
            "Venue city is required."
        );
    }

    if (!venueData.state?.trim()) {
        throw new Error(
            "Venue state is required."
        );
    }

    if (!venueData.country?.trim()) {
        throw new Error(
            "Venue country is required."
        );
    }

    if (
        !Number.isInteger(
            Number(venueData.capacity)
        )
        ||
        Number(venueData.capacity) <= 0
    ) {

        throw new Error(
            "Venue capacity must be greater than zero."
        );
    }
}