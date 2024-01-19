import { getApiData } from "./script.js";

async function renderProfileCard(search) {
    const profileCardEl = document.getElementById("profile");
    const profile = await getApiData(search);
    let profileCardHtml = "";

    profileCardHtml += `
        <div class="profile_container">
            <img src="${profile.avatar_url}" alt="${profile.name}" class="profile_avatar">
            <h2 class="profile_name">${profile.name}</h2>
            <h4 class="profile_login">@${profile.login}</h4>`;

    if (profile.bio) {
        profileCardHtml += `<div class="profile_bio"><h4>${profile.bio}</h4></div>`;
    }

    profileCardHtml += `
            <span class="profile_location">${profile.location}</span>
            <div class="profile_created">Joined : ${new Date(profile.created_at.split("T")[0]).toDateString()}</div>
            <div class="profile_socials">`;

    if (profile.twitter_username) {
        profileCardHtml += `
                <a target="_blank" href="https://www.twitter.com/${profile.twitter_username}">
                    <i class="fa-brands fa-x-twitter"></i>
                    <span>Twitter</span>
                </a>`;
    }
    if (profile.email) {
        profileCardHtml += `
                <a target="_blank" href="${profile.email}">
                    <i class="fa-brands fa-x-twitter"></i>
                    <span>Email</span>
                </a>`;
    }

    profileCardHtml += `
                <a target="blank" href="${profile.html_url}">
                    <i class="fa-brands fa-github"></i>
                    <span>GitHub</span>
                </a>
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

    profileCardEl.innerHTML = profileCardHtml;
}

async function renderRepos(user, page, per_page) {
    const profileReposEl = document.getElementById("repos");
    const repos = await getApiData(`${user}/repos?page=${page}&per_page=${per_page}`);
    let profileReposHtml = "";

    repos.forEach(repo => {
        profileReposHtml += `
        <div class="repo_container">
                <a class="repo_name" href="${repo.html_url}">${repo.name}</a>
                <span class="repo_status">${repo.private ? "private" : "public"}</span>`;

        if (repo.description) {
            profileReposHtml += `<h4 class="repo_description">${repo.description}</h4>`;
        }

        if (repo.language) {
            profileReposHtml += `<h5 class="repo_language">${repo.language}</h4>
            <div class="repo_topics">`;
        }

        if (repo.topics.length) {
            console.log(repo.topics)
            repo.topics.forEach(topic => profileReposHtml += `<span>${topic}</span>`);
        }

        profileReposHtml += `</div></div>`;
    });

    profileReposEl.innerHTML = profileReposHtml;
}

window.addEventListener("DOMContentLoaded", () => {
    const user = location.hash.replace("#", "");
    console.log(user)
    renderProfileCard(user);
    renderRepos(user, 1, 10)
})