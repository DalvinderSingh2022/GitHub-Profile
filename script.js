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

export function loading(container) {
    container.innerHTML = `
        <div class="message">
            <svg  width="80" height="80">
            <circle r="20" cx="40" cy="40"></circle>
        </div>`;
}