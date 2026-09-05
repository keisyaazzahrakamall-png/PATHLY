let loadingTimer = null;
let overlay = null;

function createOverlay() {
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.className = "page-state-overlay";
  document.body.appendChild(overlay);
  return overlay;
}

export function startPageLoading(message = "Menyiapkan perjalanan kariermu...") {
  window.clearTimeout(loadingTimer);

  loadingTimer = window.setTimeout(function () {
    const element = createOverlay();
    element.className = "page-state-overlay is-loading";
    element.setAttribute("role", "status");
    element.setAttribute("aria-live", "polite");
    element.innerHTML = `
      <div class="page-state-card">
        <div class="page-state-spinner" aria-hidden="true"></div>
        <p>${message}</p>
      </div>
    `;
  }, 650);
}

export function finishPageLoading() {
  window.clearTimeout(loadingTimer);
  overlay?.remove();
  overlay = null;
}

export function showPageLoadError() {
  window.clearTimeout(loadingTimer);
  const element = createOverlay();
  element.className = "page-state-overlay";
  element.setAttribute("role", "alert");
  element.innerHTML = `
    <div class="page-state-card">
      <div class="page-state-symbol" aria-hidden="true">!</div>
      <h2>Halaman belum dapat dimuat.</h2>
      <p>Periksa koneksi internetmu, lalu coba kembali.</p>
      <div class="page-state-actions">
        <a class="btn btn-secondary" href="index.html">Ke Beranda</a>
        <button class="btn btn-primary" type="button" data-retry-page>Coba Lagi</button>
      </div>
    </div>
  `;

  element.querySelector("[data-retry-page]").addEventListener("click", function () {
    window.location.reload();
  });
}
