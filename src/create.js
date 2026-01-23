import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";

await renderNav();

const createForm = document.querySelector("#createForm");
const msg = document.querySelector("#msg");

// helper function: show a message to the user in the UI //
function showMessage(text, type = "info") {
  msg.textContent = text;
  msg.className = type;
}

// Helper function: disable the button while we are submitting //
function setLoading(isLoading) {
  const submitBtn = createForm.querySelector('button[type="submit"]');
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Creating..." : "Create Article";
}

// Redirect to login if not logged in //
const {
  data: { session },
} = await supabase.auth.getSession();
if (!session) {
  window.location.href = "/login.html";
}

// when the user submits the form //
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("");

  // reading form values //
  const data = new FormData(createForm);
  const title = String(data.get("title") || "").trim();
  const category = String(data.get("category") || "").trim();
  const body = String(data.get("body") || "").trim();

  // basic validation //
  if (title.length < 5) {
    showMessage("Title must be at least 5 characters long.", "error");
    return;
  }

  if (body.length < 20) {
    showMessage("Body must be at least 20 characters long.", "error");
    return;
  }

  if (!category) {
    showMessage("Category is required.", "error");
    return;
  }

  setLoading(true);

  try {
    const {
      data: { session: newSession },
    } = await supabase.auth.getSession();

    if (!newSession) {
      showMessage("You must be logged in to create an article.", "error");
      return;
    }

    // Insert the article into the "articles" table in Supabase //
    // The "submitted_by" field links to the user who created it //
    const { error } = await supabase.from("articles").insert([
      {
        title,
        category,
        body,
        submitted_by: newSession.user.id,
      },
    ]);

    //   If Supabase returns an error, show it to the user //
    if (error) {
      showMessage(`Article creation failed: ${error.message}`, "error");
      return;
    }

    // if it worked, show success message and reset the form //
    showMessage("Article created successfully!");
    createForm.reset();
    window.location.href = "/";
  } catch (error) {
    showMessage("Something went wrong. Please try again.", "error");
  } finally {
    // remove loading state //
    setLoading(false);
  }
});
