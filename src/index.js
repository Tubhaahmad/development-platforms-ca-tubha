import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";

await renderNav();

const container = document.getElementById("articles");
container.textContent = "Articles will be displayed here.";
// Future implementation: Fetch and display articles from Supabase
// This is a placeholder for now.

async function loadArticles() {
  const result = await supabase
    .from("articles")
    .select("title, body, category, created_at")
    .order("created_at", { ascending: false });

  const data = result.data;
  const error = result.error;

  if (error) {
    container.textContent = "Error loading articles: " + error.message;
    return;
  }

  if (!data || data.length === 0) {
    container.textContent = "No articles yet.";
    return;
  }

  container.innerHTML = "";
  data.forEach((article) => {
    const articleEl = document.createElement("article");
    articleEl.className = "news-card";

    const titleEl = document.createElement("h2");
    titleEl.className = "news-title";
    titleEl.textContent = article.title;

    const dateText = new Date(article.created_at).toLocaleString();

    const metaEl = document.createElement("div");
    metaEl.className = "news-meta";

    const categoryEl = document.createElement("span");
    categoryEl.className = "news-category";
    categoryEl.textContent = article.category;

    const dateEl = document.createElement("span");
    dateEl.className = "news-date";
    dateEl.textContent = dateText;

    metaEl.appendChild(categoryEl);
    metaEl.appendChild(dateEl);

    const bodyEl = document.createElement("p");
    bodyEl.className = "news-body";
    bodyEl.textContent = article.body;

    articleEl.appendChild(titleEl);
    articleEl.appendChild(metaEl);
    articleEl.appendChild(bodyEl);

    container.appendChild(articleEl);
  });
}

loadArticles();
