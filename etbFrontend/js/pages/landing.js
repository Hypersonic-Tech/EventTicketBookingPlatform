document.addEventListener("DOMContentLoaded", initializeLandingPage);


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeLandingPage() {

    initializeMobileMenu();
    initializeEventFilters();
    initializeEventActions();
    initializeSmoothNavigation();
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.querySelector("#mobileMenuButton");

    const navLinks =
        document.querySelector(".nav-links");

    const navActions =
        document.querySelector(".nav-actions");

    if (!menuButton || !navLinks || !navActions) {
        return;
    }

    menuButton.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("mobile-open");

        navActions.classList.toggle(
            "mobile-open",
            isOpen
        );

        menuButton.classList.toggle(
            "active",
            isOpen
        );
    });
}


/* =========================================================
   EVENT FILTERS
   ========================================================= */

function initializeEventFilters() {

    const filterButtons =
        document.querySelectorAll(".filter-button");

    if (!filterButtons.length) {
        return;
    }

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            setActiveFilter(filterButtons, button);

            const selectedCategory =
                button.textContent.trim();

            filterEvents(selectedCategory);
        });
    });
}


function setActiveFilter(buttons, activeButton) {

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    activeButton.classList.add("active");
}


function filterEvents(category) {

    const eventCards =
        document.querySelectorAll(".event-card");

    if (category === "All Events") {

        eventCards.forEach(card => {
            card.style.display = "";
        });

        return;
    }

    eventCards.forEach(card => {

        const cardCategory =
            card
                .querySelector(".event-card-category")
                ?.textContent
                .trim()
                .toLowerCase();

        const requestedCategory =
            category
                .replace("Technology", "TECH")
                .replace("Music", "MUSIC")
                .replace("Sports", "SPORTS")
                .replace("Workshops", "WORKSHOP")
                .toLowerCase();

        const shouldShow =
            cardCategory === requestedCategory;

        card.style.display =
            shouldShow ? "" : "none";
    });
}


/* =========================================================
   EVENT ACTIONS
   ========================================================= */

function initializeEventActions() {

    const eventButtons =
        document.querySelectorAll(
            ".event-arrow"
        );

    eventButtons.forEach(button => {

        button.addEventListener("click", () => {

            const eventId =
                button.dataset.eventId;

            if (!eventId) {
                return;
            }

            handleEventSelection(eventId);
        });
    });
}


function handleEventSelection(eventId) {

    /*
     * For now we only demonstrate the flow.
     *
     * Later this function will call:
     *
     * getEventById(eventId)
     *
     * and then open the actual
     * event-details page.
     */

    console.log(
        `Event selected: ${eventId}`
    );
}


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

function initializeSmoothNavigation() {

    const navigationLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    navigationLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}