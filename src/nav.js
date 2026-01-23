import { supabase } from "./supabaseClient.js";

export async function renderNav() {
  const nav = document.querySelector("nav");

  if (!nav) return;

  // check if user is logged in //
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const loggedIn = !!session;

  // render different nav items based on login status //
  if (session) {
    nav.innerHTML = `
       <a href="index.html">Home</a>
      <a href="create.html">Create article</a>
      <button id="logoutBtn" type="button">Logout</button>
    `;

    const logoutBtn = document.querySelector("#logoutBtn");
    logoutBtn.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "/login.html";
    });
  } else {
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="register.html">Register</a>
      <a href="login.html">Login</a>
    `;
  }
}
