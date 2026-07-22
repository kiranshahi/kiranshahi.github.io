const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");
const preferredTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

root.dataset.theme = savedTheme || preferredTheme;

function updateThemeLabel() {
  themeToggle?.setAttribute(
    "aria-label",
    `Switch to ${root.dataset.theme === "dark" ? "light" : "dark"} mode`
  );
}

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  navigation?.classList.toggle("open", isOpen);
});

navigation?.addEventListener("click", event => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("click", event => {
  if (!event.target.closest(".nav-wrap")) closeMenu();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
    menuToggle?.focus();
  }
});

themeToggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
  updateThemeLabel();
});

function updateHeader() {
  header?.classList.toggle("has-scrolled", window.scrollY > 8);
}

updateThemeLabel();
updateHeader();
addEventListener("scroll", updateHeader, { passive: true });
