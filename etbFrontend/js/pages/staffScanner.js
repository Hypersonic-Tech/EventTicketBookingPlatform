document.addEventListener(
    "DOMContentLoaded",
    initializeScannerPage
);


let cameraStream = null;
let barcodeDetector = null;
let scannerRunning = false;
let detectionFrame = null;
let isValidating = false;
let currentEventId = null;


/* =========================================================
   INITIALIZATION
========================================================= */

async function initializeScannerPage() {

    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }


    currentEventId =
        getEventIdFromUrl();


    initializeControls();
    initializeManualEntry();

    await loadEventInformation();
    await initializeBarcodeDetector();
}


/* =========================================================
   EVENT
========================================================= */

function getEventIdFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get(
        "eventId"
    );
}


async function loadEventInformation() {

    const eventName =
        document.querySelector(
            "#eventName"
        );

    const eventLocation =
        document.querySelector(
            "#eventLocation"
        );


    if (!currentEventId) {

        if (eventName) {
            eventName.textContent =
                "Event not selected";
        }

        if (eventLocation) {
            eventLocation.textContent =
                "Return to dashboard and select an event.";
        }

        return;
    }


    try {

        const response =
            await getRequest(
                `/v1/staff/events/${encodeURIComponent(currentEventId)}`
            );


        const event =
            response?.data
            || response;


        if (eventName) {

            eventName.textContent =
                event.name
                || "Event";
        }


        if (eventLocation) {

            eventLocation.textContent =
                formatLocation(event);
        }


        updateCheckedInCount(
            event.checkedIn
            ?? 0
        );


    } catch (error) {

        console.error(
            "Unable to load event:",
            error
        );


        if (eventName) {
            eventName.textContent =
                "Event Scanner";
        }

        if (eventLocation) {
            eventLocation.textContent =
                "Unable to load event information.";
        }
    }
}


function formatLocation(
    event
) {

    const venue =
        event.venue?.name
        || event.venueName
        || "";


    const city =
        event.venue?.city
        || event.city
        || "";


    if (venue && city) {
        return `${venue} · ${city}`;
    }


    return venue
        || city
        || "Venue information unavailable";
}


/* =========================================================
   BARCODE DETECTOR
========================================================= */

async function initializeBarcodeDetector() {

    if (!("BarcodeDetector" in globalThis)) {

        console.info(
            "BarcodeDetector is not available in this browser."
        );

        return;
    }


    try {

        const supportedFormats =
            await BarcodeDetector
                .getSupportedFormats();


        if (
            !supportedFormats
                .includes("qr_code")
        ) {

            console.info(
                "QR detection is not supported."
            );

            return;
        }


        barcodeDetector =
            new BarcodeDetector({
                formats: ["qr_code"]
            });


    } catch (error) {

        console.error(
            "BarcodeDetector initialization failed:",
            error
        );

        barcodeDetector = null;
    }
}


/* =========================================================
   CONTROLS
========================================================= */

function initializeControls() {

    document
        .querySelector(
            "#startScannerButton"
        )
        ?.addEventListener(
            "click",
            startScanner
        );


    document
        .querySelector(
            "#stopScannerButton"
        )
        ?.addEventListener(
            "click",
            stopScanner
        );


    document
        .querySelector(
            "#scanNextButton"
        )
        ?.addEventListener(
            "click",
            resetValidation
        );
}


/* =========================================================
   CAMERA
========================================================= */

async function startScanner() {

    if (scannerRunning) {
        return;
    }


    if (
        !navigator.mediaDevices
        ||
        !navigator.mediaDevices.getUserMedia
    ) {

        showCameraError(
            "Camera access is not supported by this browser."
        );

        return;
    }


    try {

        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({
                    video: {
                        facingMode: {
                            ideal: "environment"
                        },

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        }
                    },

                    audio: false
                });


        const video =
            document.querySelector(
                "#scannerVideo"
            );


        if (!video) {
            stopCameraTracks();
            return;
        }


        video.srcObject =
            cameraStream;


        await video.play();


        scannerRunning = true;


        video.classList.add(
            "active"
        );


        document
            .querySelector(
                "#cameraPlaceholder"
            )
            ?.classList.add(
                "hidden"
            );


        document
            .querySelector(
                "#scanFrame"
            )
            ?.classList.remove(
                "hidden"
            );


        setCameraStatus(
            "SCANNING"
        );


        const stopButton =
            document.querySelector(
                "#stopScannerButton"
            );


        if (stopButton) {
            stopButton.disabled = false;
        }


        startDetectionLoop();


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        handleCameraError(
            error
        );
    }
}


function stopScanner() {

    scannerRunning = false;


    if (detectionFrame) {

        cancelAnimationFrame(
            detectionFrame
        );

        detectionFrame = null;
    }


    stopCameraTracks();


    const video =
        document.querySelector(
            "#scannerVideo"
        );


    if (video) {

        video.srcObject = null;

        video.classList.remove(
            "active"
        );
    }


    document
        .querySelector(
            "#cameraPlaceholder"
        )
        ?.classList.remove(
            "hidden"
        );


    document
        .querySelector(
            "#scanFrame"
        )
        ?.classList.add(
            "hidden"
        );


    setCameraStatus(
        "CAMERA OFF"
    );


    const stopButton =
        document.querySelector(
            "#stopScannerButton"
        );


    if (stopButton) {
        stopButton.disabled = true;
    }
}


function stopCameraTracks() {

    if (!cameraStream) {
        return;
    }


    cameraStream
        .getTracks()
        .forEach(
            track => track.stop()
        );


    cameraStream = null;
}


/* =========================================================
   QR DETECTION
========================================================= */

function startDetectionLoop() {

    if (!barcodeDetector) {

        setCameraStatus(
            "CAMERA READY · MANUAL FALLBACK"
        );

        return;
    }


    detectQrCode();
}


async function detectQrCode() {

    if (
        !scannerRunning
        ||
        isValidating
    ) {

        return;
    }


    const video =
        document.querySelector(
            "#scannerVideo"
        );


    if (
        !video
        ||
        video.readyState <
        HTMLMediaElement.HAVE_CURRENT_DATA
    ) {

        detectionFrame =
            requestAnimationFrame(
                detectQrCode
            );

        return;
    }


    try {

        const barcodes =
            await barcodeDetector
                .detect(video);


        if (barcodes.length > 0) {

            const qrValue =
                barcodes[0].rawValue;


            if (qrValue) {

                await validateScannedCode(
                    qrValue
                );

                return;
            }
        }


    } catch (error) {

        console.debug(
            "QR detection frame failed:",
            error
        );
    }


    detectionFrame =
        requestAnimationFrame(
            detectQrCode
        );
}


/* =========================================================
   VALIDATION
========================================================= */

async function validateScannedCode(
    qrCode
) {

    if (
        isValidating
        ||
        !qrCode?.trim()
    ) {

        return;
    }


    isValidating = true;


    setCameraStatus(
        "VALIDATING..."
    );


    try {

        const response =
            await validateTicket(
                qrCode
            );


        handleValidationResponse(
            response
        );


    } catch (error) {

        handleValidationError(
            error
        );

    } finally {

        isValidating = false;
    }
}


function handleValidationResponse(
    response
) {

    const result =
        response?.data
        || response;


    const valid =
        result?.valid === true
        ||
        result?.status === "VALID"
        ||
        result?.status === "CHECKED_IN"
        ||
        result?.success === true;


    if (valid) {

        showValidationResult({
            type: "success",

            label:
                "VALID TICKET",

            title:
                "Entry Approved",

            message:
                result.message
                || "Ticket has been successfully validated.",

            ticket:
                result.ticket
                || result.data
                || {}
        });


        updateCheckedInCount(
            result.checkedIn
            ?? result.totalCheckedIn
            ?? null
        );


    } else {

        showValidationResult({
            type: "error",

            label:
                result.status === "ALREADY_USED"
                    ? "ALREADY CHECKED IN"
                    : "INVALID TICKET",

            title:
                result.status === "ALREADY_USED"
                    ? "Entry Rejected"
                    : "Ticket Not Valid",

            message:
                result.message
                || "This ticket could not be validated.",

            ticket:
                result.ticket
                || {}
        });
    }


    stopScanner();
}


function handleValidationError(
    error
) {

    showValidationResult({

        type: "error",

        label:
            "VALIDATION FAILED",

        title:
            "Entry Rejected",

        message:
            error.message
            || "Unable to validate this ticket.",

        ticket: {}
    });


    stopScanner();
}


/* =========================================================
   RESULT UI
========================================================= */

function showValidationResult(
    result
) {

    const container =
        document.querySelector(
            "#validationResult"
        );


    if (!container) {
        return;
    }


    container.className =
        `validation-result ${result.type}`;


    const icon =
        document.querySelector(
            "#validationIcon"
        );


    const label =
        document.querySelector(
            "#validationLabel"
        );


    const title =
        document.querySelector(
            "#validationTitle"
        );


    const message =
        document.querySelector(
            "#validationMessage"
        );


    const ticketInfo =
        document.querySelector(
            "#validationTicketInfo"
        );


    if (icon) {

        icon.textContent =
            result.type === "success"
                ? "✓"
                : "!";
    }


    if (label) {
        label.textContent =
            result.label;
    }


    if (title) {
        title.textContent =
            result.title;
    }


    if (message) {
        message.textContent =
            result.message;
    }


    if (ticketInfo) {

        const ticket =
            result.ticket
            || {};


        const ticketId =
            ticket.id
            || ticket.ticketId
            || "";


        const attendee =
            ticket.attendeeName
            || ticket.userName
            || "";


        ticketInfo.innerHTML =
            `
                ${
                    attendee
                        ? `<span>
                            ${escapeHtml(attendee)}
                           </span>`
                        : ""
                }

                ${
                    ticketId
                        ? `<span>
                            #${escapeHtml(ticketId)}
                           </span>`
                        : ""
                }
            `;
    }


    container
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
}


function resetValidation() {

    const container =
        document.querySelector(
            "#validationResult"
        );


    if (container) {

        container.className =
            "validation-result hidden";
    }


    setCameraStatus(
        "CAMERA OFF"
    );


    startScanner();
}


/* =========================================================
   MANUAL ENTRY
========================================================= */

function initializeManualEntry() {

    const openButton =
        document.querySelector(
            "#manualEntryButton"
        );


    const closeButton =
        document.querySelector(
            "#closeManualQrButton"
        );


    const modal =
        document.querySelector(
            "#manualQrModal"
        );


    const form =
        document.querySelector(
            "#manualQrForm"
        );


    openButton?.addEventListener(
        "click",
        () => {

            modal
                ?.classList
                .remove(
                    "hidden"
                );


            document
                .querySelector(
                    "#manualQrInput"
                )
                ?.focus();
        }
    );


    closeButton?.addEventListener(
        "click",
        closeManualModal
    );


    modal?.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeManualModal();
            }
        }
    );


    form?.addEventListener(
        "submit",
        handleManualSubmit
    );
}


async function handleManualSubmit(
    event
) {

    event.preventDefault();


    const input =
        document.querySelector(
            "#manualQrInput"
        );


    const qrCode =
        input?.value.trim();


    if (!qrCode) {

        showManualMessage(
            "Enter a QR code.",
            "error"
        );

        return;
    }


    const submit =
        document.querySelector(
            "#manualQrSubmit"
        );


    if (submit) {

        submit.disabled = true;

        submit.textContent =
            "Validating...";
    }


    try {

        closeManualModal();


        await validateScannedCode(
            qrCode
        );


    } finally {

        if (submit) {

            submit.disabled = false;

            submit.textContent =
                "Validate Ticket";
        }
    }
}


function closeManualModal() {

    document
        .querySelector(
            "#manualQrModal"
        )
        ?.classList.add(
            "hidden"
        );


    document
        .querySelector(
            "#manualQrForm"
        )
        ?.reset();


    showManualMessage(
        "",
        ""
    );
}


function showManualMessage(
    message,
    type
) {

    const element =
        document.querySelector(
            "#manualQrMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `form-message ${type}`;
}


/* =========================================================
   CAMERA STATES
========================================================= */

function setCameraStatus(
    status
) {

    const element =
        document.querySelector(
            "#scannerStatus"
        );


    if (element) {
        element.textContent =
            status;
    }
}


function showCameraError(
    message
) {

    const placeholder =
        document.querySelector(
            "#cameraPlaceholder"
        );


    if (!placeholder) {
        return;
    }


    placeholder.innerHTML = `
        <div class="camera-icon">
            !
        </div>

        <h2>
            Camera unavailable
        </h2>

        <p>
            ${escapeHtml(message)}
        </p>

        <button
            type="button"
            class="btn btn-secondary"
            id="cameraRetryButton"
        >
            Try Again
        </button>
    `;


    document
        .querySelector(
            "#cameraRetryButton"
        )
        ?.addEventListener(
            "click",
            startScanner
        );
}


function handleCameraError(
    error
) {

    if (
        error.name ===
        "NotAllowedError"
    ) {

        showCameraError(
            "Camera permission was denied. Allow camera access and try again."
        );

        return;
    }


    if (
        error.name ===
        "NotFoundError"
    ) {

        showCameraError(
            "No camera was found on this device."
        );

        return;
    }


    showCameraError(
        "The camera could not be started."
    );
}


/* =========================================================
   CHECK-IN COUNT
========================================================= */

function updateCheckedInCount(
    count
) {

    if (
        count === null
        ||
        count === undefined
    ) {

        return;
    }


    const element =
        document.querySelector(
            "#checkedInCount"
        );


    if (element) {
        element.textContent =
            count;
    }
}


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    stopScanner
);


/* =========================================================
   SECURITY / HTML
========================================================= */

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