import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";

await renderNav();

const registerForm = document.querySelector("#registerForm");
const msg = document.querySelector("#msg");

// helper function: show a message to the user in the UI //
function showMessage(text, type = "info") {
  msg.textContent = text;
  msg.className = type;
}

// Helper function: disable the button while we are submitting //
function setLoading(isLoading) {
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Registering..." : "Register";
}

// when the user submits the form //
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("");

  // reading form values //
  const data = new FormData(registerForm);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");

  // basic validation //
  if (!email || !password) {
    showMessage("Email and password are required.", "error");
    return;
  }

  setLoading(true);

  // Ask Supabase to create a new user account //
  // Supabase will send a confirmation email (because email confirmation is enabled) //
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
