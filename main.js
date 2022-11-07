import { getNewsData, formatNewsData } from "./getData.js";

const newsCardsContainer = document.querySelector(".news-cards");
const form = document.querySelector("#form-filters");
const searchInput = document.querySelector("#search-news");
const langSelect = document.querySelector("#news-lang");
const pageSizeSelect = document.querySelector("#news-number");

form.addEventListener(
  "submit",
  throttle((e) => {
    e.preventDefault();
    displayNews();
  }, 2000)
);

document.addEventListener("DOMContentLoaded", (e) => {
  const newsFilters = JSON.parse(localStorage.getItem("newsFilters"));
  searchInput.value = newsFilters?.searchVal || "";
  langSelect.value = newsFilters?.langVal || "all";
  pageSizeSelect.value = newsFilters?.amountVal || "10";

  displayNews();
});

langSelect.addEventListener("change", displayNews);
pageSizeSelect.addEventListener("change", displayNews);

function generateNewsCardMarkup(dataObj) {
  return `
  <article class="news-card">
  <a href="${dataObj.url}" class="news-card__link-wrapper">
    <div class="news-card__img-container">
      <img
        class="news-card__img"
        src="${dataObj.thumbnail || "./images/thumbnail.jpg"}"
        alt="A news thumbnail"
      />
      <span class="news-card__tag">${dataObj.pillar?.toUpperCase()}</span>
    </div>
    <div class="news-card__text-container">
      <h2 class="news-card__title">
        ${dataObj.headline}
      </h2>
      <p class="news-card__date">${dataObj.date}</p>
    </div>
  </a>
</article>`;
}

async function displayNews() {
  const searchVal = searchInput.value;
  const pageSizeVal = pageSizeSelect.value;
  const langVal = langSelect.value?.trim() === "all" ? "" : langSelect.value;

  localStorage.setItem(
    "newsFilters",
    JSON.stringify({
      searchVal,
      pageSizeVal,
      langVal,
    })
  );

  renderSpinner(newsCardsContainer);
  const newsData = await getNewsData(searchVal, langVal, pageSizeVal);
  const news = formatNewsData(newsData.results);
  const newsCardsMarkup = news.map(generateNewsCardMarkup).join("");

  newsCardsContainer.innerHTML = "";
  newsCardsContainer.insertAdjacentHTML("beforeend", newsCardsMarkup);
}

function throttle(fn, interval) {
  let enableCall = true;

  return (...args) => {
    if (!enableCall) return;

    enableCall = false;
    fn(...args);
    setTimeout(() => (enableCall = true), interval);
  };
}

function renderSpinner(parentElement) {
  const markup = `
  <div class='spinner'>
    <img src='./images/spinner.svg' alt='' />
  </div>
  `;

  parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML("afterbegin", markup);
}
