export function togglePasswordVisibility(input, button) {
  if (!input || !button) return;

  const shouldShow = input.type === "password";
  const label = shouldShow ? "Sembunyikan password" : "Tampilkan password";

  input.type = shouldShow ? "text" : "password";
  button.classList.toggle("is-visible", shouldShow);
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.setAttribute("aria-pressed", String(shouldShow));
}

export function initializePasswordToggles(root = document) {
  root.querySelectorAll("[data-password-toggle]").forEach(function (button) {
    if (button.dataset.passwordToggleBound === "true") return;

    const input = root.getElementById(button.dataset.passwordToggle);
    if (!input) return;

    button.dataset.passwordToggleBound = "true";
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", function () {
      togglePasswordVisibility(input, button);
    });
  });
}

if (typeof document !== "undefined") {
  initializePasswordToggles();
}
