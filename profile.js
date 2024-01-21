import { getApiData, recentSearch, renderLoading, renderMessage } from "./script.js";

const paginationEl = document.getElementById("pagination");
const paginationNumberBtns = paginationEl.querySelector("#number_buttons");
const perPageInput = paginationEl.querySelector("#perpage");
const nextBtn = paginationEl.querySelector(".next");
const prevBtn = paginationEl.querySelector(".prev");

const user = location.hash.replace("#", "");
let currentPage = 1;
let perPage = 10;
let firstBtn = 0;
let totalrepos;
let totalPage;

renderProfileCard();
renderRepos();

nextBtn.addEventListener("click", () => changePage(++currentPage));
prevBtn.addEventListener("click", () => changePage(--currentPage));
perPageInput.addEventListener("change", function () {
    perPage = Number(this.value);
    totalPage = Math.ceil(totalrepos / perPage);
    currentPage = 1;
    firstBtn = 1;
    changePage();
})

function changePage(pageNumber = currentPage) {
    if (currentPage - 6 == firstBtn) {
        firstBtn = totalPage - currentPage < 5 ? ((currentPage - 1) - (totalPage - currentPage)) : currentPage - 1;
        renderPaginationBtns();
    }
    if (currentPage == firstBtn) {
        firstBtn = currentPage - 5 > 0 ? currentPage - 5 : 0;
        renderPaginationBtns();
    }
    if (pageNumber <= totalPage && pageNumber > 0) {
        renderRepos();
        paginationNumberBtns.querySelectorAll("button")?.forEach(btn => {
            btn.getAttribute("data-number") == currentPage ?
                btn.classList.add("active") :
                btn.classList.remove("active");
        });
    }
    nextBtn.disabled = pageNumber == totalPage;
    prevBtn.disabled = pageNumber <= 1;
}

function renderPaginationBtns() {
    let html = "";

    for (let index = firstBtn; index < firstBtn + 5; index++) {
        if (totalPage <= index) {
            break;
        }
        html += `<button data-number='${index + 1}' class="${(index == 0 && currentPage == 1) ? "active" : ""}">${index + 1}</button>`;
    }

    paginationNumberBtns.innerHTML = html;

    paginationNumberBtns.querySelectorAll("button")?.forEach(btn => {
        btn.addEventListener("click", () => {
            currentPage = Number(btn.getAttribute("data-number"));
            changePage();
        });
    });
}

async function renderProfileCard() {
    const profileCardEl = document.getElementById("profile");
    renderLoading(profileCardEl);

    const profile = await getApiData(`users/${user}`);
    let html = "";

    if (profile.id) {
        totalrepos = profile.public_repos;
        totalPage = Math.ceil(totalrepos / perPage);
        perPageInput.value = totalrepos < 10 ? totalrepos : 10;
        renderPaginationBtns();

        if (!recentSearch.find(user => user.id == profile.id)) {
            recentSearch.push({
                id: profile.id,
                login: profile.login,
                avatar_url: profile.avatar_url
            });
        }
        localStorage.setItem("recentsearch", JSON.stringify(recentSearch));

        html += `
        <div class="profile_container">
            <div class="profile_wrapper">
                <div class="profile_container">
                    <h2 class="profile_login">${profile.login}</h2>
                    <h4 class="profile_name">@${profile.name}</h4>`;

        if (profile.bio) {
            html += `<div class="profile_bio"><h4>${profile.bio}</h4></div>`;
        }

        if (profile.location) {
            html += ` <span class="profile_location">${profile.location}</span>`;
        }

        html += `
            <div class="profile_created">Joined : ${new Date(profile.created_at.split("T")[0]).toDateString()}</div>
            <div class="profile_socials">`;

        if (profile.twitter_username) {
            html += `
                <a target="_blank" href="https://www.twitter.com/${profile.twitter_username}" title="${profile.twitter_username}">
                    <i class="fa-brands fa-twitter"></i>
                </a>`;
        }
        if (profile.email) {
            html += `
                <a target="_blank" href="mailto:${profile.email}" title="mailto:${profile.email}">
                    <i class="fa-solid fa-at"></i>
                </a>`;
        }
        if (profile.blog) {
            html += `
                <a target="_blank" href="${profile.blog}" title="${profile.blog}">
                    <i class="fa-solid fa-link"></i>
                </a>`;
        }

        html += `<a target="blank" href="${profile.html_url}">
                            <i class="fa-brands fa-github"></i>
                        </a>
                    </div>
                </div>
                <img src="${profile.avatar_url}" alt="${profile.name}" class="profile_avatar">
            </div>
            <div class="profile_table">
                <div class="item">
                    <h2 class="item_count">${profile.public_repos < 1000 ? profile.public_repos : (profile.public_repos / 1000).toFixed(1) + "k"}</h2>
                    <h4 class="item_type">repositors</h4>
                </div>
                <div class="item">
                    <h2 class="item_count">${profile.following < 1000 ? profile.following : (profile.following / 1000).toFixed(1) + "k"}</h2>
                    <h4 class="item_type">followings</h4>
                </div>
                <div class="item">
                    <h2 class="item_count">${profile.followers < 1000 ? profile.followers : (profile.followers / 1000).toFixed(1) + "k"}</h2>
                    <h4 class="item_type">followers</h4>
                </div>
            </div>
        </div>`;
    } else {
        html = renderMessage(profile, user);
    }

    profileCardEl.innerHTML = html;
}

async function renderRepos() {
    const profileReposEl = document.querySelector("#repos .repos_container");
    renderLoading(profileReposEl);

    const repos = await getApiData(`users/${user}/repos?page=${currentPage}&per_page=${perPage}`);
    let html = "";

    if (repos?.length) {
        repos.forEach((repo, index) => {
            html += `
        <div class="repo_container">
                <span class="repo_number">${(((currentPage - 1) * perPage) + (index + 1))}.</span>
                <a class="repo_name" href="${repo.html_url}">${repo.name}</a>`;
            if (repo.description) {
                html += `<h4 class="repo_description">${repo.description}</h4>`;
            }

            html += `<div class="repo_details">`;

            if (repo.language) {
                html += `<span class="repo_language" title="language">${repo.language}</span>`;
            }

            html += `<span class="repo_stars">
                        <i class="fa-solid fa-star"></i>
                        <span title="language">${repo.stargazers_count}</span>
                    </span>`;

            if (repo.updated_at) {
                html += `
                <span class="repo_language" title="language">
                    Last updated on ${new Date(repo?.updated_at?.split("T")[0]).toDateString()}
                </span>`;
            }

            html += `</div><div class="repo_topics">`;

            if (repo.topics.length) {
                repo.topics.forEach(topic => html += `<span> ${topic}</span> `);
            }
            html += `</div></div> `;
        });
    } else {
        html = renderMessage(repos, "Repositories");
        paginationEl.remove();
    }

    profileReposEl.innerHTML = html;
}