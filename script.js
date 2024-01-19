const API_BASE_URL = "https://api.github.com/users";

export async function getApiData(url) {
    try {
        const response = await fetch(`${API_BASE_URL}/${url}`);
        if (response.status !== 200) {
            new Error(`Something Went Wrong! status code ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

document.querySelector("button")?.addEventListener("click", () => {
    location.hash = "Dalvinder2022";
    location.pathname = "/profile.html";
});