import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";

await renderNav();

const registerForm = document.querySelector("#registerForm");
const msg = document.querySelector("#msg");
