import { getApiData, renderLoading, renderMessage } from "./script.js";

const searchBtn = document.querySelector(".search_field button");
const searchHeader = document.querySelector("#searchResult .header");
const searchUsers = document.querySelector("#searchResult .users_container");

searchBtn.addEventListener("click", async () => {
    const searchInput = document.querySelector(".search_field input");
    if (searchInput.value) {
        searchHeader.innerText = `searching...`;
        renderLoading(searchUsers);
        let html = '';

        const result = await getApiData(`search/users?q=${searchInput.value}`);
        if (result?.items?.length) {
            result.items.forEach(user => {
                html += `
                <div class="user_wrapper">
                    <img src=${user.avatar_url} alt="${user.login}" class="user_avatar">
                    <a href="/profile.html#${user.login}" class="user_name" title="${user.login}">${user.login}</a>
                </div>`
            })
        } else {
            html = renderMessage(result?.items, searchInput.value);
        }

        searchUsers.innerHTML = html;
        searchHeader.innerText = `Result for ${searchInput.value}`;
        searchInput.value = "";
    }
});

window.addEventListener("keyup", event => {
    if (event.keyCode === 13) {
        searchBtn.click();
    }
});