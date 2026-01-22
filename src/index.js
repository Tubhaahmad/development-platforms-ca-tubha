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

    const titleEl = document.createElement("h2");
    titleEl.textContent = article.title;

    const dateText = new Date(article.created_at).toLocaleString();

    const metaEl = document.createElement("p");
    metaEl.textContent = `${article.category} • ${dateText}`;

    const bodyEl = document.createElement("p");
    bodyEl.textContent = article.body;

    articleEl.appendChild(titleEl);
    articleEl.appendChild(metaEl);
    articleEl.appendChild(bodyEl);

    container.appendChild(articleEl);
  });
}

loadArticles();
