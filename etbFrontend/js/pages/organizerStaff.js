document.addEventListener(
    "DOMContentLoaded",
    initializeOrganizerStaffPage
);


let allStaff = [];
let allEvents = [];
let selectedStaffId = null;


async function initializeOrganizerStaffPage() {

    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    initializeSearch();
    initializeRefresh();
    initializeModal();

    await loadStaff();
    await loadEvents();
}


/* =========================================================
   LOAD STAFF
========================================================= */

async function loadStaff() {

    const container =
        document.querySelector(
            "#staffManagementList"
        );

    if (!container) {
        return;
    }

    showLoading(
        container
    );

    try {

        const response =
            await getOrganizerStaff();

        allStaff =
            extractCollection(response);

        renderStaff(
            allStaff
        );

        updateStaffCount(
            allStaff.length
        );

    } catch (error) {

        console.error(
            "Unable to load staff:",
            error
        );

        showErrorState(
            container,
            error.message
        );
    }
}


function extractCollection(response) {

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.staff)) {
        return response.staff;
    }

    return [];
}


/* =========================================================
   RENDER STAFF
========================================================= */

function renderStaff(
    staffList
) {

    const container =
        document.querySelector(
            "#staffManagementList"
        );

    if (!container) {
        return;
    }


    if (!staffList.length) {

        container.innerHTML = `
            <div class="empty-state">

                <span class="empty-state-number">
                    00
                </span>

                <h3>
                    No staff members found
                </h3>

                <p>
                    Staff members assigned to your
                    organization will appear here.
                </p>

            </div>
        `;

        updateResultCount(0);

        return;
    }


    container.innerHTML =
        staffList
            .map(createStaffManagementCard)
            .join("");


    initializeStaffActions();

    updateResultCount(
        staffList.length
    );
}


function createStaffManagementCard(
    staff
) {

    const staffId =
        staff.id ??
        staff.userId ??
        "";


    const firstName =
        staff.firstName ?? "";

    const lastName =
        staff.lastName ?? "";


    const fullName =
        `${firstName} ${lastName}`.trim()
        || staff.email
        || "Staff Member";


    const email =
        staff.email
        || "No email available";


    const status =
        staff.enabled === false
            ? "INACTIVE"
            : "ACTIVE";


    return `
        <article
            class="staff-management-card"
            data-staff-id="${escapeHtml(staffId)}"
        >

            <div class="staff-management-avatar">
                ${escapeHtml(
                    getInitials(fullName)
                )}
            </div>


            <div class="staff-management-info">

                <div class="staff-name-row">

                    <h3>
                        ${escapeHtml(fullName)}
                    </h3>

                    <span
                        class="staff-status
                        ${status === "ACTIVE"
                            ? "active"
                            : "inactive"}"
                    >
                        ${status}
                    </span>

                </div>


                <p>
                    ${escapeHtml(email)}
                </p>


                <span class="staff-id">
                    ID: ${escapeHtml(staffId)}
                </span>

            </div>


            <div class="staff-management-actions">

                <button
                    type="button"
                    class="btn btn-primary assign-staff-button"
                    data-staff-id="${escapeHtml(staffId)}"
                    data-staff-name="${escapeHtml(fullName)}"
                >
                    Assign Event
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {

    const searchInput =
        document.querySelector(
            "#staffSearch"
        );

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        handleStaffSearch
    );
}


function handleStaffSearch(
    event
) {

    const query =
        event.target.value
            .trim()
            .toLowerCase();


    if (!query) {

        renderStaff(
            allStaff
        );

        return;
    }


    const filtered =
        allStaff.filter(
            staff => {

                const firstName =
                    staff.firstName
                    ?? "";

                const lastName =
                    staff.lastName
                    ?? "";

                const email =
                    staff.email
                    ?? "";


                const searchableText =
                    `${firstName}
                     ${lastName}
                     ${email}`
                        .toLowerCase();


                return searchableText
                    .includes(query);
            }
        );


    renderStaff(
        filtered
    );
}


/* =========================================================
   STAFF ACTIONS
========================================================= */

function initializeStaffActions() {

    const buttons =
        document.querySelectorAll(
            ".assign-staff-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                handleAssignButton
            );

        }
    );
}


function handleAssignButton(
    event
) {

    const button =
        event.currentTarget;


    selectedStaffId =
        button.dataset.staffId;


    const staffName =
        button.dataset.staffName
        || "Staff Member";


    const nameElement =
        document.querySelector(
            "#assignmentStaffName"
        );


    if (nameElement) {

        nameElement.textContent =
            staffName;
    }


    populateEventSelect();

    openAssignmentModal();
}


/* =========================================================
   EVENTS
========================================================= */

async function loadEvents() {

    try {

        const response =
            await getOrganizerEvents();

        allEvents =
            extractCollection(response);

        populateEventSelect();

    } catch (error) {

        console.error(
            "Unable to load organizer events:",
            error
        );
    }
}


function populateEventSelect() {

    const select =
        document.querySelector(
            "#eventSelect"
        );

    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select an event
        </option>
    `;


    allEvents.forEach(
        event => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                event.id;


            option.textContent =
                event.name
                || "Unnamed Event";


            select.appendChild(
                option
            );
        }
    );
}


/* =========================================================
   ASSIGNMENT
========================================================= */

function initializeModal() {

    const modal =
        document.querySelector(
            "#assignEventModal"
        );

    const closeButton =
        document.querySelector(
            "#closeAssignModal"
        );

    const form =
        document.querySelector(
            "#assignEventForm"
        );


    closeButton?.addEventListener(
        "click",
        closeAssignmentModal
    );


    modal?.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeAssignmentModal();
            }
        }
    );


    form?.addEventListener(
        "submit",
        handleAssignmentSubmit
    );
}


function openAssignmentModal() {

    document
        .querySelector(
            "#assignEventModal"
        )
        ?.classList.remove(
            "hidden"
        );
}


function closeAssignmentModal() {

    document
        .querySelector(
            "#assignEventModal"
        )
        ?.classList.add(
            "hidden"
        );


    document
        .querySelector(
            "#assignEventForm"
        )
        ?.reset();


    clearMessage(
        "assignmentMessage"
    );


    selectedStaffId = null;
}


async function handleAssignmentSubmit(
    event
) {

    event.preventDefault();


    const select =
        document.querySelector(
            "#eventSelect"
        );


    const eventId =
        select?.value;


    if (!selectedStaffId) {

        showMessage(
            "assignmentMessage",
            "Staff member is missing.",
            "error"
        );

        return;
    }


    if (!eventId) {

        showMessage(
            "assignmentMessage",
            "Please select an event.",
            "error"
        );

        return;
    }


    setAssignmentLoading(
        true
    );


    try {

        await assignStaffToEvent(
            eventId,
            selectedStaffId
        );


        closeAssignmentModal();


        showMessage(
            "staffPageMessage",
            "Staff member assigned successfully.",
            "success"
        );


    } catch (error) {

        showMessage(
            "assignmentMessage",
            error.message,
            "error"
        );

    } finally {

        setAssignmentLoading(
            false
        );
    }
}


function setAssignmentLoading(
    loading
) {

    const button =
        document.querySelector(
            "#assignEventSubmit"
        );

    if (!button) {
        return;
    }


    button.disabled =
        loading;


    button.textContent =
        loading
            ? "Assigning..."
            : "Assign to Event";
}


/* =========================================================
   REFRESH
========================================================= */

function initializeRefresh() {

    const button =
        document.querySelector(
            "#refreshStaffButton"
        );


    button?.addEventListener(
        "click",
        async () => {

            button.disabled = true;

            button.textContent =
                "Refreshing...";


            await loadStaff();
            await loadEvents();


            button.disabled = false;

            button.textContent =
                "Refresh";
        }
    );
}


/* =========================================================
   UI HELPERS
========================================================= */

function updateStaffCount(
    count
) {

    const element =
        document.querySelector(
            "#staffCount"
        );


    if (element) {
        element.textContent =
            count;
    }
}


function updateResultCount(
    count
) {

    const element =
        document.querySelector(
            "#staffResultCount"
        );


    if (!element) {
        return;
    }


    element.textContent =
        `${count} ${
            count === 1
                ? "member"
                : "members"
        }`;
}


function showLoading(
    container
) {

    container.innerHTML = `
        <div class="dashboard-loading">
            Loading staff...
        </div>
    `;
}


function showErrorState(
    container,
    message
) {

    container.innerHTML = `
        <div class="dashboard-error">

            <h3>
                Unable to load staff
            </h3>

            <p>
                ${escapeHtml(
                    message
                    || "Something went wrong."
                )}
            </p>

        </div>
    `;
}


function showMessage(
    id,
    message,
    type
) {

    const element =
        document.querySelector(
            `#${id}`
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `form-message ${type}`;
}


function clearMessage(
    id
) {

    const element =
        document.querySelector(
            `#${id}`
        );


    if (!element) {
        return;
    }


    element.textContent =
        "";


    element.className =
        "form-message";
}


function getInitials(
    name
) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join("");
}


function escapeHtml(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(value);


    return element.innerHTML;
}