import {
  bootstrapProtectedPage,
  loadCareerFoundation
} from "./bootstrap-protected.js";

await bootstrapProtectedPage({
  loadingMessage: "Menyiapkan roadmap kariermu...",
  loadPage: async () => {
    await loadCareerFoundation({ withScoring: true });
    await import("../roadmap.js");
  }
});
