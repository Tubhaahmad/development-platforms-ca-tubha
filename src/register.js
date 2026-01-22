import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";

await renderNav();

const registerForm = document.querySelector("#registerForm");
const msg = document.querySelector("#msg");

function showMessage(text, type = "info") {
  msg.textContent = text;
  msg.className = type;
}

function setLoading(isLoading) {
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Registering..." : "Register";
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("");

  const data = new FormData(registerForm);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");

  if (!email || !password) {
    showMessage("Email and password are required.", "error");
    return;
  }

  setLoading(true);

  try {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      showMessage(`Register failed: ${error.message}`, "error");
      return;
    }

    showMessage(
      "Registration successful! Check your email to confirm, then go to login.",
    );
    registerForm.reset();
  } catch (error) {
    showMessage("Something went wrong. Please try again.", "error");
  } finally {
    setLoading(false);
  }
});
