const API_BASE_URL = "http://localhost:8080/api";


/* =========================================================
   GENERIC API REQUEST
   ========================================================= */

async function apiRequest(endpoint, options = {}) {

    const token =
        localStorage.getItem("accessToken");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };


    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }


    let response;

    try {

        response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );

    } catch (error) {

        throw new Error(
            "Unable to connect to the server."
        );
    }


    const data =
        await parseResponse(response);


    if (!response.ok) {

        throw new Error(
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        );
    }


    return data;
}


/* =========================================================
   RESPONSE PARSER
   ========================================================= */

async function parseResponse(response) {

    const contentType =
        response.headers.get("content-type");


    if (
        contentType &&
        contentType.includes("application/json")
    ) {

        return response.json();
    }


    return null;
}


/* =========================================================
   GET
   ========================================================= */

async function getRequest(endpoint) {

    return apiRequest(endpoint, {
        method: "GET"
    });
}


/* =========================================================
   POST
   ========================================================= */

async function postRequest(endpoint, data) {

    return apiRequest(endpoint, {

        method: "POST",

        body: JSON.stringify(data)

    });
}


/* =========================================================
   PUT
   ========================================================= */

async function putRequest(endpoint, data) {

    return apiRequest(endpoint, {

        method: "PUT",

        body: JSON.stringify(data)

    });
}


/* =========================================================
   DELETE
   ========================================================= */

async function deleteRequest(endpoint) {

    return apiRequest(endpoint, {
        method: "DELETE"
    });
}