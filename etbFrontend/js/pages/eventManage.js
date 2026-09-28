document.addEventListener(
    "DOMContentLoaded",
    initializeEventManagePage
);


let currentEventId = null;


async function initializeEventManagePage() {

    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    currentEventId = getEventIdFromUrl();

    if (!currentEventId) {
        showEventError("Event ID is missing.");
        return;
    }

    initializeManageActions();

    await loadEvent();
    await loadEventStaff();
}


function getEventIdFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
}


async function loadEvent() {

    try {

        const event =
            await getOrganizerEvent(
                currentEventId
            );

        renderEvent(event);

        showElement(
            "eventContent"
        );

        hideElement(
            "eventLoading"
        );

    } catch (error) {

        console.error(
            "Unable to load event:",
            error
        );

        showEventError(
            error.message
        );
    }
}


function renderEvent(event) {

    setText(
        "eventName",
        event.name ?? "Untitled Event"
    );

    setText(
        "eventDescription",
        event.description ??
        "No description available."
    );

    setText(
        "eventStatus",
        event.status ?? "DRAFT"
    );

    setText(
        "eventDate",
        formatDate(event.startTime)
    );

    setText(
        "eventTime",
        formatTimeRange(
            event.startTime,
            event.endTime
        )
    );

    setText(
        "eventVenue",
        event.venue?.name ??
        "Venue not specified"
    );

    setText(
        "eventLocation",
        formatLocation(
            event.venue
        )
    );

    setText(
        "ticketsSold",
        event.ticketsSold ?? 0
    );

    setText(
        "ticketCapacity",
        event.venue?.capacity ?? "—"
    );

    setText(
        "checkedIn",
        event.checkedIn ?? 0
    );

    setText(
        "eventRevenue",
        formatCurrency(
            event.revenue ?? 0
        )
    );


    const editButton =
        document.querySelector(
            "#editEventButton"
        );

    if (editButton) {

        editButton.href =
            `create-event.html?id=${encodeURIComponent(event.id)}`;
    }
}


async function loadEventStaff() {

    const container =
        document.querySelector(
            "#eventStaffList"
        );

    if (!container) {
        return;
    }

    try {

        const response =
            await getEventStaff(
                currentEventId
            );

        const staff =
            extractStaff(response);

        renderStaff(
            container,
            staff
        );

    } catch (error) {

        console.error(
            "Unable to load event staff:",
            error
        );

        container.innerHTML = `
            <div class="dashboard-error">
                Unable to load staff.
            </div>
        `;
    }
}


function extractStaff(response) {

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.staff)) {
        return response.staff;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
}


function renderStaff(
    container,
    staff
) {

    if (!staff.length) {

        container.innerHTML = `
            <div class="empty-state compact">

                <span class="empty-state-number">
                    00
                </span>

                <h3>
                    No staff assigned
                </h3>

                <p>
                    Assign staff members to handle event entry.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        staff.map(
            createStaffRow
        ).join("");


    initializeRemoveStaffButtons();
}


function createStaffRow(staff) {

    const staffId =
        staff.id ?? staff.userId ?? "";

    const firstName =
        staff.firstName ?? "";

    const lastName =
        staff.lastName ?? "";

    const fullName =
        `${firstName} ${lastName}`.trim()
        || staff.email
        || "Staff member";


    return `
        <div
            class="staff-row"
            data-staff-id="${escapeHtml(staffId)}"
        >

            <div class="staff-avatar">
                ${getInitials(fullName)}
            </div>


            <div class="staff-info">

                <strong>
                    ${escapeHtml(fullName)}
                </strong>

                <span>
                    ${escapeHtml(
                        staff.email ?? "No email"
                    )}
                </span>

            </div>


            <span class="staff-role">
                ENTRY STAFF
            </span>


            <button
                type="button"
                class="remove-staff-button"
                data-staff-id="${escapeHtml(staffId)}"
            >
                Remove
            </button>

        </div>
    `;
}


function initializeManageActions() {

    const assignButton =
        document.querySelector(
            "#assignStaffButton"
        );

    const closeButton =
        document.querySelector(
            "#closeStaffModal"
        );

    const modal =
        document.querySelector(
            "#staffModal"
        );

    const form =
        document.querySelector(
            "#assignStaffForm"
        );

    const cancelButton =
        document.querySelector(
            "#cancelEventButton"
        );


    assignButton?.addEventListener(
        "click",
        openStaffModal
    );


    closeButton?.addEventListener(
        "click",
        closeStaffModal
    );


    modal?.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {
                closeStaffModal();
            }
        }
    );


    form?.addEventListener(
        "submit",
        handleAssignStaff
    );


    cancelButton?.addEventListener(
        "click",
        handleCancelEvent
    );
}


function initializeRemoveStaffButtons() {

    const buttons =
        document.querySelectorAll(
            ".remove-staff-button"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            handleRemoveStaff
        );
    });
}


function openStaffModal() {

    const modal =
        document.querySelector(
            "#staffModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "hidden"
    );

    document
        .querySelector("#staffId")
        ?.focus();
}


function closeStaffModal() {

    const modal =
        document.querySelector(
            "#staffModal"
        );

    modal?.classList.add(
        "hidden"
    );

    document
        .querySelector("#assignStaffForm")
        ?.reset();

    clearMessage(
        "staffMessage"
    );
}


async function handleAssignStaff(event) {

    event.preventDefault();

    const form =
        event.currentTarget;

    const formData =
        new FormData(form);

    const staffId =
        formData.get("staffId")?.trim();


    if (!staffId) {

        showMessage(
            "staffMessage",
            "Staff ID is required.",
            "error"
        );

        return;
    }


    setAssignButtonLoading(true);


    try {

        await assignStaff(
            currentEventId,
            staffId
        );

        closeStaffModal();

        showMessage(
            "eventMessage",
            "Staff member assigned successfully.",
            "success"
        );

        await loadEventStaff();

    } catch (error) {

        showMessage(
            "staffMessage",
            error.message,
            "error"
        );

    } finally {

        setAssignButtonLoading(false);
    }
}


async function handleRemoveStaff(event) {

    const button =
        event.currentTarget;

    const staffId =
        button.dataset.staffId;

    if (!staffId) {
        return;
    }


    button.disabled = true;
    button.textContent = "Removing...";


    try {

        await removeStaff(
            currentEventId,
            staffId
        );

        showMessage(
            "eventMessage",
            "Staff member removed.",
            "success"
        );

        await loadEventStaff();

    } catch (error) {

        showMessage(
            "eventMessage",
            error.message,
            "error"
        );

        button.disabled = false;
        button.textContent = "Remove";
    }
}


async function handleCancelEvent() {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this event?"
        );

    if (!confirmed) {
        return;
    }


    const button =
        document.querySelector(
            "#cancelEventButton"
        );

    if (button) {
        button.disabled = true;
        button.textContent = "Cancelling...";
    }


    try {

        await cancelEvent(
            currentEventId
        );

        showMessage(
            "eventMessage",
            "Event cancelled successfully.",
            "success"
        );

        await loadEvent();

    } catch (error) {

        showMessage(
            "eventMessage",
            error.message,
            "error"
        );

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent = "Cancel Event";
        }
    }
}


function setAssignButtonLoading(
    isLoading
) {

    const button =
        document.querySelector(
            "#assignStaffSubmit"
        );

    if (!button) {
        return;
    }

    button.disabled =
        isLoading;

    button.textContent =
        isLoading
            ? "Assigning..."
            : "Assign Staff";
}


function formatDate(value) {

    if (!value) {
        return "Not specified";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


function formatTimeRange(
    start,
    end
) {

    if (!start) {
        return "Not specified";
    }

    const startDate =
        new Date(start);

    const endDate =
        end
            ? new Date(end)
            : null;

    const format =
        date =>
            date.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    return endDate
        ? `${format(startDate)} – ${format(endDate)}`
        : format(startDate);
}


function formatLocation(venue) {

    if (!venue) {
        return "Location not specified";
    }

    return [
        venue.city,
        venue.state,
        venue.country
    ]
        .filter(Boolean)
        .join(", ");
}


function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(value);
}


function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0)
                    .toUpperCase()
        )
        .join("");
}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function showElement(id) {

    document
        .getElementById(id)
        ?.classList.remove("hidden");
}


function hideElement(id) {

    document
        .getElementById(id)
        ?.classList.add("hidden");
}


function showEventError(message) {

    hideElement("eventLoading");

    const error =
        document.querySelector(
            "#eventError"
        );

    if (!error) {
        return;
    }

    error.textContent =
        message || "Unable to load event.";

    error.classList.remove(
        "hidden"
    );
}


function showMessage(
    id,
    message,
    type
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        `form-message ${type}`;
}


function clearMessage(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent = "";
    element.className =
        "form-message";
}


function escapeHtml(value) {

    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;
}