const API_BASE_URL = "https://api.github.com";

export async function getApiData(url) {
    try {
        const response = await fetch(`${API_BASE_URL}/${url}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export function renderLoading(container) {
    container.innerHTML = `
    <div class="message">
    <svg  width="80" height="80">
    <circle r="20" cx="40" cy="40"></circle>
        </div>`;
}

export function renderMessage(data, message) {
    if (data?.length === 0) {
        return `<div class="message">${message} Not found</div>`;
    } else {
        return (
            `<div class="message">
                <i class="fa-solid fa-circle-exclamation"></i>
                <div>Error occur while searching for ${message}</div>
            </ div>`);
    }
}

export const recentSearch = JSON.parse(localStorage.getItem("recentsearch")) || [];