document.addEventListener(
    "DOMContentLoaded",
    initializeEventsPage
);

let allEvents = [];
let selectedCategory = "ALL";
let searchQuery = "";
let selectedSort = "date";


async function initializeEventsPage() {

    initializeSearch();
    initializeFilters();
    initializeSorting();

    await loadEvents();
}


/* =========================
   API
========================= */

async function loadEvents() {

    showEventsLoading();

    try {

        const response =
            await getPublishedEvents(0, 50);

        allEvents = extractEvents(response);

        renderEvents();

    } catch (error) {

        console.error(
            "Unable to load events:",
            error
        );

        showEventsError(
            "Unable to load events. Please try again."
        );
    }
}


/* =========================
   SEARCH
========================= */

function initializeSearch() {

    const searchInput =
        document.querySelector("#eventSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        handleSearch
    );
}


function handleSearch(event) {

    searchQuery =
        event.target.value.trim().toLowerCase();

    renderEvents();
}


/* =========================
   FILTER
========================= */

function initializeFilters() {

    const buttons =
        document.querySelectorAll(".event-filter");

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => handleCategoryChange(button)
        );

    });
}


function handleCategoryChange(button) {

    selectedCategory =
        button.dataset.category || "ALL";

    document
        .querySelectorAll(".event-filter")
        .forEach(filter =>
            filter.classList.remove("active")
        );

    button.classList.add("active");

    renderEvents();
}


/* =========================
   SORT
========================= */

function initializeSorting() {

    const sortSelect =
        document.querySelector("#eventSort");

    if (!sortSelect) {
        return;
    }

    sortSelect.addEventListener(
        "change",
        event => {

            selectedSort =
                event.target.value;

            renderEvents();
        }
    );
}


/* =========================
   RENDER
========================= */

function renderEvents() {

    let filteredEvents =
        filterEvents(allEvents);

    filteredEvents =
        sortEvents(filteredEvents);

    updateResultCount(
        filteredEvents.length
    );

    if (!filteredEvents.length) {

        showEmptyState();

        return;
    }

    hideEmptyState();

    const grid =
        document.querySelector("#eventGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML =
        filteredEvents
            .map(createEventCard)
            .join("");
}


function filterEvents(events) {

    return events.filter(event => {

        const matchesSearch =
            !searchQuery ||
            event.name
                ?.toLowerCase()
                .includes(searchQuery) ||
            event.description
                ?.toLowerCase()
                .includes(searchQuery);

        const eventCategory =
            event.category?.toUpperCase();

        const matchesCategory =
            selectedCategory === "ALL" ||
            eventCategory === selectedCategory;

        return (
            matchesSearch &&
            matchesCategory
        );
    });
}


function sortEvents(events) {

    const sorted =
        [...events];

    if (selectedSort === "name") {

        return sorted.sort(
            (a, b) =>
                (a.name || "").localeCompare(
                    b.name || ""
                )
        );
    }

    return sorted.sort(
        (a, b) =>
            new Date(a.startTime) -
            new Date(b.startTime)
    );
}


/* =========================
   EVENT CARD
========================= */

function createEventCard(event, index) {

    return `
        <article class="event-card">

            <div class="event-card-image">

                <span class="event-card-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

            </div>

            <div class="event-card-content">

                <span class="event-card-category">
                    ${escapeHtml(
                        event.category || "EVENT"
                    )}
                </span>

                <h2>
                    ${escapeHtml(event.name)}
                </h2>

                <p class="event-card-description">
                    ${escapeHtml(
                        event.description || ""
                    )}
                </p>

                <div class="event-card-meta">

                    <span>
                        ◷
                        ${formatEventDateTime(
                            event.startTime
                        )}
                    </span>

                    <span>
                        ◉
                        ${escapeHtml(
                            event.venue?.name ||
                            "Venue TBA"
                        )}
                    </span>

                    <span>
                        ${escapeHtml(
                            event.venue?.city ||
                            "Location TBA"
                        )}
                    </span>

                </div>

                <div class="event-card-footer">

                    <span class="event-card-date">
                        ${formatEventDate(
                            event.startTime
                        )}
                    </span>

                    <a
                        href="event-details.html?id=${encodeURIComponent(event.id)}"
                        class="event-card-arrow"
                        aria-label="View ${escapeHtml(event.name)}"
                    >
                        →
                    </a>

                </div>

            </div>

        </article>
    `;
}


/* =========================
   UI STATES
========================= */

function showEventsLoading() {

    const grid =
        document.querySelector("#eventGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = `
        <div class="events-loading">
            Loading events...
        </div>
    `;
}


function showEventsError(message) {

    const grid =
        document.querySelector("#eventGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = `
        <div class="events-loading">
            ${escapeHtml(message)}
        </div>
    `;
}


function showEmptyState() {

    document
        .querySelector("#eventGrid")
        ?.classList.add("hidden");

    document
        .querySelector("#eventEmpty")
        ?.classList.remove("hidden");
}


function hideEmptyState() {

    document
        .querySelector("#eventGrid")
        ?.classList.remove("hidden");

    document
        .querySelector("#eventEmpty")
        ?.classList.add("hidden");
}


function updateResultCount(count) {

    const element =
        document.querySelector("#eventResultCount");

    if (!element) {
        return;
    }

    element.textContent =
        `${count} event${count === 1 ? "" : "s"} found`;
}


/* =========================
   HELPERS
========================= */

function extractEvents(response) {

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
}


function formatEventDate(dateValue) {

    if (!dateValue) {
        return "Date TBA";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(new Date(dateValue));
}


function formatEventDateTime(dateValue) {

    if (!dateValue) {
        return "Date & time TBA";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    ).format(new Date(dateValue));
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