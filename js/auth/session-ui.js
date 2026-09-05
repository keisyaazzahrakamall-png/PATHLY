import { supabase } from "../lib/supabase.js";
import { resetCareerJourney } from "../lib/user-data.js";

const PATHLY_STORAGE_KEYS = [
  "pathlyProfile",
  "pathlyCareerStage",
  "pathlyCareerTarget",
  "pathlyComparedCareers",
  "pathlyAssessmentResults",
  "pathlyScoringResult",
  "pathlyAdaptabilityCheck",
  "pathlyRoadmapData",
  "pathlyRoadmapId",
  "pathlyCompletedTasks",
  "pathlyCustomCareers",
  "pathlyCustomCareer",
  "pathlyCacheUserId"
];

const authSlots = document.querySelectorAll("[data-auth-slot]");

function createLink(href, label, className = "") {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  if (className) link.className = className;
  return link;
}

function getDisplayName(user, profile) {
  return (
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "Pengguna Pathly"
  );
}

function getInitials(name) {
  return name.trim().charAt(0).toUpperCase() || "P";
}

function clearPathlyLocalData() {
  PATHLY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

function profileIsComplete(profile) {
  return Boolean(
    profile?.full_name?.trim() &&
    profile?.education_level &&
    profile?.major?.trim() &&
    profile?.semester &&
    profile?.graduation_year
  );
}

function updateJourneyLinks(destination, signedIn) {
  document.querySelectorAll("[data-journey-link]").forEach((link) => {
    const label = signedIn
      ? link.dataset.signedInLabel || "Buka Jalur Saya"
      : link.dataset.signedOutLabel || "Mulai Jalur Karier Saya";

    link.href = signedIn ? destination : "signup.html";
    link.replaceChildren(document.createTextNode(`${label} `));

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    link.append(arrow);
  });
}

async function resolveJourneyDestination(userId, profile) {
  if (!profileIsComplete(profile)) return "onboarding.html";

  const { data: journey } = await supabase
    .from("career_journeys")
    .select("career_stage, target_career_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!journey?.career_stage) return "career-stage.html";
  if (!journey?.target_career_id) {
    return `career.html?mode=${encodeURIComponent(journey.career_stage)}`;
  }

  const [assessmentResponse, roadmapResponse] = await Promise.all([
    supabase
      .from("assessments")
      .select("completed_at")
      .eq("user_id", userId)
      .eq("career_id", journey.target_career_id)
      .maybeSingle(),
    supabase
      .from("roadmaps")
      .select("id")
      .eq("user_id", userId)
      .eq("career_id", journey.target_career_id)
      .maybeSingle()
  ]);

  if (roadmapResponse.data?.id) return "my-path.html";
  if (assessmentResponse.data?.completed_at) return "results.html";
  return "assessment.html";
}

async function handleLogout(button) {
  button.disabled = true;
  button.textContent = "Keluar...";

  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    button.disabled = false;
    button.textContent = "Keluar";
    button.setAttribute("title", "Gagal keluar. Silakan coba lagi.");
    return;
  }

  clearPathlyLocalData();
  window.location.replace("index.html");
}

function renderSignedOut(slot) {
  slot.replaceChildren();
  updateJourneyLinks("signup.html", false);

  if (slot.dataset.authContext === "public") {
    slot.append(createLink("signup.html", "Mulai Jalur Saya", "btn-nav"));
    return;
  }

  slot.append(createLink("login.html", "Masuk", "session-login-link"));
}

function renderSignedIn(slot, name, email, destination) {
  slot.replaceChildren();

  if (slot.dataset.authContext === "public") {
    const journeyLabel = destination === "my-path.html"
      ? "Buka Jalur Saya"
      : "Lanjutkan Jalur Saya";
    slot.append(createLink(destination, journeyLabel, "btn-nav"));
  }

  updateJourneyLinks(destination, true);

  const profileMenu = document.createElement("div");
  profileMenu.className = "profile-menu";

  const account = document.createElement("button");
  account.type = "button";
  account.className = "account-chip profile-trigger";
  account.title = "Buka profil";
  account.setAttribute("aria-label", `Buka menu profil ${name}`);
  account.setAttribute("aria-expanded", "false");
  account.setAttribute("aria-haspopup", "menu");

  const avatar = document.createElement("span");
  avatar.className = "account-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = getInitials(name);

  account.append(avatar);

  const menuPanel = document.createElement("div");
  menuPanel.className = "profile-menu-panel";
  menuPanel.setAttribute("role", "menu");
  menuPanel.hidden = true;

  const menuHeader = document.createElement("div");
  menuHeader.className = "profile-menu-header";

  const menuAvatar = document.createElement("span");
  menuAvatar.className = "account-avatar profile-menu-avatar";
  menuAvatar.setAttribute("aria-hidden", "true");
  menuAvatar.textContent = getInitials(name);

  const identity = document.createElement("span");
  identity.className = "profile-identity";

  const profileName = document.createElement("strong");
  profileName.textContent = name;

  const profileEmail = document.createElement("small");
  profileEmail.textContent = email || "Email tidak tersedia";

  identity.append(profileName, profileEmail);
  menuHeader.append(menuAvatar, identity);

  const editProfile = createLink(
    "onboarding.html?edit=profile",
    "Edit Profil",
    "profile-menu-item"
  );
  editProfile.setAttribute("role", "menuitem");

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "profile-menu-item profile-menu-reset";
  resetButton.textContent = "Reset Perjalanan";
  resetButton.setAttribute("role", "menuitem");

  const logoutButton = document.createElement("button");
  logoutButton.type = "button";
  logoutButton.className = "profile-menu-item profile-menu-logout";
  logoutButton.textContent = "Keluar";
  logoutButton.setAttribute("role", "menuitem");
  logoutButton.addEventListener("click", () => handleLogout(logoutButton));

  menuPanel.append(
    menuHeader,
    editProfile,
    resetButton,
    logoutButton
  );
  profileMenu.append(account, menuPanel);
  slot.append(profileMenu);

  function setMenuOpen(isOpen) {
    menuPanel.hidden = !isOpen;
    account.setAttribute("aria-expanded", String(isOpen));
    profileMenu.classList.toggle("open", isOpen);
  }

  document.querySelector("[data-reset-dialog]")?.remove();

  const resetDialog = document.createElement("div");
  resetDialog.className = "reset-dialog-backdrop";
  resetDialog.dataset.resetDialog = "";
  resetDialog.hidden = true;
  resetDialog.innerHTML = `
    <section class="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="resetDialogTitle" aria-describedby="resetDialogDescription">
      <span class="reset-dialog-icon" aria-hidden="true">↻</span>
      <div>
        <p class="reset-dialog-label">RESET PERJALANAN</p>
        <h2 id="resetDialogTitle">Mulai ulang perjalanan karier?</h2>
        <p id="resetDialogDescription">Pilihan karier, jawaban asesmen, roadmap, dan progresmu akan dihapus. Data akun dan profil pendidikan tetap tersimpan.</p>
        <p class="reset-dialog-message" aria-live="polite"></p>
      </div>
      <div class="reset-dialog-actions">
        <button type="button" class="reset-dialog-cancel">Batal</button>
        <button type="button" class="reset-dialog-confirm">Ya, reset perjalanan</button>
      </div>
    </section>`;

  document.body.append(resetDialog);

  const cancelReset = resetDialog.querySelector(".reset-dialog-cancel");
  const confirmReset = resetDialog.querySelector(".reset-dialog-confirm");
  const resetMessage = resetDialog.querySelector(".reset-dialog-message");

  function closeResetDialog() {
    if (confirmReset.disabled) return;
    resetDialog.hidden = true;
    document.body.classList.remove("dialog-open");
    resetMessage.textContent = "";
    resetButton.focus();
  }

  resetButton.addEventListener("click", function () {
    setMenuOpen(false);
    resetDialog.hidden = false;
    document.body.classList.add("dialog-open");
    cancelReset.focus();
  });

  cancelReset.addEventListener("click", closeResetDialog);

  resetDialog.addEventListener("click", function (event) {
    if (event.target === resetDialog) closeResetDialog();
  });

  confirmReset.addEventListener("click", async function () {
    cancelReset.disabled = true;
    confirmReset.disabled = true;
    confirmReset.textContent = "Menghapus...";
    resetMessage.textContent = "Menghapus data perjalanan akun ini...";

    const { error } = await resetCareerJourney();

    if (error) {
      cancelReset.disabled = false;
      confirmReset.disabled = false;
      confirmReset.textContent = "Coba lagi";
      resetMessage.textContent =
        "Data belum berhasil dihapus. Periksa koneksi lalu coba lagi.";
      resetMessage.classList.add("error");
      return;
    }

    resetMessage.classList.remove("error");
    resetMessage.textContent = "Perjalanan berhasil direset.";
    window.location.replace("career-stage.html?reset=success");
  });

  account.addEventListener("click", function (event) {
    event.stopPropagation();
    setMenuOpen(menuPanel.hidden);
  });

  menuPanel.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  document.addEventListener("click", function () {
    setMenuOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !resetDialog.hidden) {
      closeResetDialog();
      return;
    }

    if (event.key === "Escape" && !menuPanel.hidden) {
      setMenuOpen(false);
      account.focus();
    }
  });
}

async function renderSession() {
  if (!authSlots.length) return;

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user) {
    authSlots.forEach(renderSignedOut);
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, education_level, major, semester, graduation_year")
    .eq("id", session.user.id)
    .maybeSingle();

  const destination = await resolveJourneyDestination(session.user.id, profile);
  const name = getDisplayName(session.user, profile);
  authSlots.forEach((slot) =>
    renderSignedIn(slot, name, session.user.email, destination)
  );
}

renderSession();

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_IN" || event === "USER_UPDATED") renderSession();
});
