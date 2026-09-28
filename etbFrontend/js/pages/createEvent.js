document.addEventListener(
    "DOMContentLoaded",
    initializeCreateEventPage
);


function initializeCreateEventPage() {

    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    const form =
        document.querySelector("#createEventForm");

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        handleCreateEvent
    );
}


async function handleCreateEvent(event) {

    event.preventDefault();

    const form = event.currentTarget;

    const eventData = collectEventFormData(form);

    if (!validateEventForm(eventData)) {
        return;
    }

    setCreateButtonState(true);

    try {

        const createdEvent =
            await createEvent(eventData);

        showFormMessage(
            "Event created successfully.",
            "success"
        );

        if (createdEvent?.id) {

            setTimeout(() => {

                navigateTo(
                    `event-manage.html?id=${encodeURIComponent(createdEvent.id)}`
                );

            }, 700);
        }

    } catch (error) {

        showFormMessage(
            error.message,
            "error"
        );

    } finally {

        setCreateButtonState(false);
    }
}


function collectEventFormData(form) {

    const formData =
        new FormData(form);

    return {
        name: formData.get("name")?.trim(),
        description: formData.get("description")?.trim(),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
        salesStart: formData.get("salesStart"),
        salesEnd: formData.get("salesEnd"),
        venueId: formData.get("venueId")?.trim()
    };
}


function validateEventForm(data) {

    if (!data.name) {
        showFormMessage(
            "Event name is required.",
            "error"
        );
        return false;
    }

    if (!data.description) {
        showFormMessage(
            "Event description is required.",
            "error"
        );
        return false;
    }

    if (
        !data.startTime ||
        !data.endTime ||
        !data.salesStart ||
        !data.salesEnd
    ) {
        showFormMessage(
            "Please complete the schedule.",
            "error"
        );
        return false;
    }

    if (!data.venueId) {
        showFormMessage(
            "Venue is required.",
            "error"
        );
        return false;
    }

    if (
        new Date(data.endTime) <=
        new Date(data.startTime)
    ) {
        showFormMessage(
            "Event end time must be after start time.",
            "error"
        );
        return false;
    }

    if (
        new Date(data.salesEnd) >
        new Date(data.startTime)
    ) {
        showFormMessage(
            "Ticket sales should end before the event starts.",
            "error"
        );
        return false;
    }

    return true;
}


function setCreateButtonState(isLoading) {

    const button =
        document.querySelector("#createEventButton");

    if (!button) {
        return;
    }

    button.disabled = isLoading;

    button.textContent =
        isLoading
            ? "Creating..."
            : "Create Event";
}


function showFormMessage(message, type) {

    const element =
        document.querySelector("#formMessage");

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className =
        `form-message ${type}`;
}