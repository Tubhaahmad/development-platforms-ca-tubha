import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";

await renderNav();

const loginForm = document.querySelector("#loginForm");
const msg = document.querySelector("#msg");

function showMessage(text, type = "info") {
  msg.textContent = text;
  msg.className = type;
}

function setLoading(isLoading) {
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Logging in..." : "Login";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("");

  const data = new FormData(loginForm);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");

  if (!email || !password) {
    showMessage("Email and password are required.", "error");
    return;
  }

  setLoading(true);

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
