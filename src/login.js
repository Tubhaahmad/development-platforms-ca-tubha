import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";

await renderNav();

const loginForm = document.querySelector("#loginForm");
const msg = document.querySelector("#msg");

// helper function: show a message to the user in the UI //
function showMessage(text, type = "info") {
  msg.textContent = text;
  msg.className = type;
}

// Helper function: disable the button while we are submitting //
function setLoading(isLoading) {
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Logging in..." : "Login";
}

// when the user submits the form //
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("");

  // reading form values //
  const data = new FormData(loginForm);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");

  // basic validation //
  if (!email || !password) {
    showMessage("Email and password are required.", "error");
    return;
  }

  setLoading(true);

  // Ask Supabase to log the user in using email + password //
  // If it works, Supabase stores the session in the browser automatically //
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Supabase login error:", error);
      showMessage(`Login failed: ${error.message}`, "error");
      return;
    }

    showMessage("Login successful! Redirecting...");
    loginForm.reset();
    window.location.href = "/";
  } catch (error) {
    showMessage("Something went wrong. Please try again.", "error");
  } finally {
    setLoading(false);
  }
});
