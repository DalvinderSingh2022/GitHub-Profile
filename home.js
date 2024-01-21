import { getApiData, recentSearch, renderLoading, renderMessage } from "./script.js";

const searchBtn = document.querySelector(".search_field button");
const searchHeading = document.querySelector("#searchResult .heading");
const searchUsersEl = document.querySelector("#searchResult .users_container");
const searchCloseBtn = document.querySelector("#searchResult button");
const recentClearBtn = document.querySelector("#recentSearch button");
const recentUsersEl = document.querySelector("#recentSearch .users_container");

renderLoading(recentUsersEl);
recentUsersEl.innerHTML = renderUsers(recentSearch, "Recent search");

searchCloseBtn.addEventListener("click", () => {
    document.body.classList.remove("result");
    searchUsersEl.innerHTML = "";
});

recentClearBtn.addEventListener("click", () => {
    localStorage.removeItem("recentsearch");
    recentSearch.length = 0;

    renderLoading(recentUsersEl);
    recentUsersEl.innerHTML = renderUsers(recentSearch, "Recent search");
})

searchBtn.addEventListener("click", async () => {
    const searchInput = document.querySelector(".search_field input");
    if (searchInput.value) {
        document.body.classList.add("result");
        searchHeading.innerText = `searching...`;
        renderLoading(searchUsersEl);

        const result = await getApiData(`search/users?q=${searchInput.value}`);
        searchUsersEl.innerHTML = renderUsers(result?.items, searchInput.value);
        searchHeading.innerText = `Result for ${searchInput.value}`;
        searchInput.value = "";
    }
});

window.addEventListener("keyup", event => {
    if (event.keyCode === 13) {
        searchBtn.click();
    }
});

function renderUsers(users, message) {
    let html = "";
    if (users.length) {
        users.forEach(user => {
            html += `
                <div class="user_wrapper">
                    <img src=${user.avatar_url} alt="${user.login}" class="user_avatar">
                    <a href="/profile.html#${user.login}" class="user_name" title="${user.login}">${user.login}</a>
                </div>`
        })
    } else {
        html = renderMessage(users, message);
    }
    return html;
}