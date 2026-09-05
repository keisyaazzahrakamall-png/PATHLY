import {
  bootstrapProtectedPage,
  loadCareerFoundation
} from "./bootstrap-protected.js";

await bootstrapProtectedPage({
  loadingMessage: "Membuka progres perjalananmu...",
  loadPage: async () => {
    await loadCareerFoundation({ withScoring: true });
    await import("../my-path.js");
  }
});
