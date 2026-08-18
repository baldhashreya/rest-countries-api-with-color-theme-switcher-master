// Shared theme toggle logic used by both the home page and the detail page.
(function () {
  const STORAGE_KEY = "theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    applyTheme(theme);

    const toggleButton = document.getElementById("themeToggle");
    if (!toggleButton) return;

    updateToggleLabel(toggleButton, theme);

    toggleButton.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      updateToggleLabel(toggleButton, next);
    });
  }

  function updateToggleLabel(button, theme) {
    const label = button.querySelector("span");
    if (label) {
      label.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    }
  }

  document.addEventListener("DOMContentLoaded", initTheme);
})();
