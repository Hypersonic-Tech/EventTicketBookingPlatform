/* =====================================================
   ATBT EVENTS PAGE
   ===================================================== */


/* ================= AUTH ================= */

const hash = window.location.hash;

if (hash.startsWith("#token=")) {

    const token = hash.substring(7);

    if (token) {

        localStorage.setItem(
            "atbt_token",
            token
        );

        // Remove JWT from address bar
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }
}


const token =
    localStorage.getItem("atbt_token");


/* ================= JWT USER ================= */

function getUserFromToken(token) {

    try {

        const payload =
            token.split(".")[1];

        const decoded =
            JSON.parse(
                atob(
                    payload
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

        return decoded;

    } catch (error) {

        console.error(
            "Invalid JWT",
            error
        );

        return null;
    }
}


let currentUser = null;

if (token) {

    currentUser =
        getUserFromToken(token);

}


/* ================= USER UI ================= */

function loadUserInfo() {

    if (!currentUser) {

        document.getElementById("userName")
            .textContent = "Guest";

        document.getElementById("userRole")
            .textContent = "GUEST";

        document.getElementById("userAvatar")
            .textContent = "?";

        return;
    }


    const email =
        currentUser.email || "Attendee";

    const role =
        currentUser.role || "ATTENDEE";


    document.getElementById("userName")
        .textContent = email.split("@")[0];

    document.getElementById("userRole")
        .textContent = role;

    document.getElementById("userAvatar")
        .textContent =
            email.charAt(0).toUpperCase();
}


/* ================= EVENT DATA ================= */
/*
   Temporary frontend data.

   Later this will come from:

   GET /api/v1/events
*/

const events = [

    {
        id: 1,

        title: "ATBT Music Festival 2026",

        category: "MUSIC",

        date: "Oct 18, 2026",

        time: "6:00 PM",

        location: "Phoenix Arena, Indore",

        price: 499,

        image:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
    },

    {
        id: 2,

        title: "Tech Innovators Conference",

        category: "TECHNOLOGY",

        date: "Oct 25, 2026",

        time: "10:00 AM",

        location: "Convention Centre, Bhopal",

        price: 799,

        image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
    },

    {
        id: 3,

        title: "Cricket Championship",

        category: "SPORTS",

        date: "Nov 02, 2026",

        time: "7:00 PM",

        location: "Holkar Stadium, Indore",

        price: 299,

        image:
            "https://images.unsplash.com/photo-1531415074968-036ba1b575da"
    },

    {
        id: 4,

        title: "Stand Up Comedy Night",

        category: "COMEDY",

        date: "Nov 08, 2026",

        time: "8:00 PM",

        location: "Ravindra Bhavan, Bhopal",

        price: 399,

        image:
            "https://images.unsplash.com/photo-1585699324551-f6c309eedeca"
    },

    {
        id: 5,

        title: "Future Business Summit",

        category: "CONFERENCE",

        date: "Nov 15, 2026",

        time: "9:00 AM",

        location: "Brilliant Convention Centre",

        price: 999,

        image:
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
    },

    {
        id: 6,

        title: "Live Indie Night",

        category: "MUSIC",

        date: "Nov 22, 2026",

        time: "7:30 PM",

        location: "Phoenix Citadel, Indore",

        price: 599,

        image:
            "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b"
    }

];


/* ================= STATE ================= */

let selectedCategory = "ALL";

let searchText = "";


/* ================= ELEMENTS ================= */

const eventsGrid =
    document.getElementById("eventsGrid");

const eventsLoading =
    document.getElementById("eventsLoading");

const noEvents =
    document.getElementById("noEvents");

const eventCount =
    document.getElementById("eventCount");


/* ================= RENDER EVENTS ================= */

function renderEvents() {

    eventsLoading.classList.add("hidden");

    const filteredEvents =
        events.filter(event => {

            const matchesCategory =
                selectedCategory === "ALL" ||
                event.category === selectedCategory;


            const search =
                searchText.toLowerCase();


            const matchesSearch =
                event.title
                    .toLowerCase()
                    .includes(search)

                ||

                event.location
                    .toLowerCase()
                    .includes(search)

                ||

                event.category
                    .toLowerCase()
                    .includes(search);


            return (
                matchesCategory &&
                matchesSearch
            );
        });


    eventCount.textContent =
        `${filteredEvents.length} ${
            filteredEvents.length === 1
                ? "event"
                : "events"
        }`;


    if (filteredEvents.length === 0) {

        eventsGrid.innerHTML = "";

        noEvents.classList.remove("hidden");

        return;
    }


    noEvents.classList.add("hidden");


    eventsGrid.innerHTML =
        filteredEvents.map(event => `

            <article
                class="event-card"
                data-event-id="${event.id}"
            >

                <div class="event-image">

                    <img
                        src="${event.image}"
                        alt="${event.title}"
                        loading="lazy"
                    >

                    <span class="event-category">
                        ${event.category}
                    </span>

                </div>


                <div class="event-content">

                    <div class="event-date">
                        ${event.date} · ${event.time}
                    </div>

                    <h3 class="event-title">
                        ${event.title}
                    </h3>

                    <div class="event-location">
                        📍 ${event.location}
                    </div>


                    <div class="event-bottom">

                        <div class="event-price">

                            Starting from

                            <strong>
                                ₹${event.price}
                            </strong>

                        </div>

                        <button
                            class="view-event"
                            data-id="${event.id}"
                        >
                            View Details
                        </button>

                    </div>

                </div>

            </article>

        `).join("");


    attachEventListeners();
}


/* ================= EVENT CLICK ================= */

function attachEventListeners() {

    document
        .querySelectorAll(".view-event")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const id =
                        button.dataset.id;

                    /*
                       Later:

                       window.location.href =
                       `event-details.html?id=${id}`;
                    */

                    alert(
                        `Event ID: ${id}\n\n` +
                        "Event details page coming next."
                    );
                }
            );
        });
}


/* ================= SEARCH ================= */

const searchInput =
    document.getElementById("eventSearch");

const searchButton =
    document.getElementById("searchButton");


searchInput.addEventListener(
    "input",
    event => {

        searchText =
            event.target.value.trim();

        renderEvents();
    }
);


searchButton.addEventListener(
    "click",
    () => {

        searchText =
            searchInput.value.trim();

        renderEvents();
    }
);


/* ================= CATEGORIES ================= */

document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category-btn")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                selectedCategory =
                    button.dataset.category;

                renderEvents();
            }
        );
    });


/* ================= CLEAR FILTERS ================= */

document
    .getElementById("clearFilters")
    .addEventListener(
        "click",
        () => {

            searchInput.value = "";

            searchText = "";

            selectedCategory = "ALL";

            document
                .querySelectorAll(".category-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            document
                .querySelector(
                    '[data-category="ALL"]'
                )
                .classList.add("active");

            renderEvents();
        }
    );


/* ================= USER DROPDOWN ================= */

const userButton =
    document.getElementById("userButton");

const userDropdown =
    document.getElementById("userDropdown");


userButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        userDropdown.classList.toggle("show");
    }
);


document.addEventListener(
    "click",
    () => {

        userDropdown.classList.remove("show");
    }
);


/* ================= LOGOUT ================= */

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "atbt_token"
            );

            window.location.href =
                "../index.html";
        }
    );


/* ================= THEME ================= */

const themeToggle =
    document.getElementById("themeToggle");


function loadTheme() {

    const theme =
        localStorage.getItem("atbt-theme");

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent = "☀️";

    } else {

        themeToggle.textContent = "🌙";
    }
}


themeToggle.addEventListener(
    "click",
    () => {

        const dark =
            document.body.classList.toggle(
                "dark-mode"
            );

        localStorage.setItem(
            "atbt-theme",
            dark ? "dark" : "light"
        );

        themeToggle.textContent =
            dark ? "☀️" : "🌙";
    }
);


/* ================= INITIALIZE ================= */

loadUserInfo();

loadTheme();

renderEvents();