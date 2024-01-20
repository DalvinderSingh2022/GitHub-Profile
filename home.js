import { getApiData, loading } from "./script.js";

const searchBtn = document.querySelector(".search_field button");
const searchHeader = document.querySelector("#searchResult .header");
const searchUsers = document.querySelector("#searchResult .users_container");

searchBtn.addEventListener("click", async () => {
    const input = document.querySelector(".search_field input");
    if (input.value) {
        searchHeader.innerText = `searching...`;
        loading(searchUsers);
        let html = '';

        const result = await getApiData(`search/users?q=${input.value}`);
        if (result?.items?.length) {
            result.items.forEach(user => {
                html += `
                <div class="user_wrapper">
                    <img src=${user.avatar_url} alt="${user.login}" class="user_avatar">
                    <a href="/profile.html#${user.login}" class="user_name" title="${user.login}">${user.login}</a>
                </div>`
            })
        } else if (result?.items?.length === 0) {
            html = `<div class="message">${input.value} Not found</div>`;
        } else {
            html = `
            <div class="message">
                <i class="fa-solid fa-circle-exclamation"></i>
                <div>Error occur while searching for ${input.value}</div>
            </ div>`
        }

        searchUsers.innerHTML = html;
        searchHeader.innerText = `Result for ${input.value}`;
        input.value = "";
    }
});