import { saveCareerJourney } from "./lib/user-data.js";

const careers = window.PATHLY_CAREERS || [];
const customCareerEngine = window.PATHLY_CUSTOM_CAREER_ENGINE;
const dataProvenance = window.PATHLY_DATA_PROVENANCE || null;


/* ELEMEN HALAMAN */

const careerGrid = document.getElementById("careerGrid");
const modeBadge = document.getElementById("modeBadge");
const modeTitle = document.getElementById("modeTitle");
const modeDescription = document.getElementById("modeDescription");
const modeHint = document.getElementById("modeHint");
const selectionCounter = document.getElementById("selectionCounter");
const continueButton = document.getElementById("careerContinueButton");
const careerMessage = document.getElementById("careerMessage");

const comparisonPanel = document.getElementById("comparisonPanel");
const comparisonGrid = document.getElementById("comparisonGrid");
const targetConfirmation = document.getElementById("targetConfirmation");
const targetConfirmationName = document.getElementById(
    "targetConfirmationName"
);

const dreamCareerForm = document.getElementById("dreamCareerForm");
const dreamCareerInput = document.getElementById("dreamCareerInput");
const careerClarification = document.getElementById(
    "careerClarification"
);
const clarificationTitle = document.getElementById(
    "clarificationTitle"
);
const clarificationDescription = document.getElementById(
    "clarificationDescription"
);
const specificCareerOptions = document.getElementById(
    "specificCareerOptions"
);
const unsureCareerButton = document.getElementById(
    "unsureCareerButton"
);
const writeAnotherCareerButton = document.getElementById(
    "writeAnotherCareerButton"
);
const careerPreferencePanel = document.getElementById(
    "careerPreferencePanel"
);
const careerPreferenceOptions = document.getElementById(
    "careerPreferenceOptions"
);


/* MODE HALAMAN */

const modeConfig = {
    explore: {
        badge: "MODE EKSPLORASI",
        title: "Temukan arah karier yang layak dijelajahi.",
        description:
            "Jelajahi fokus peran dan kompetensi setiap karier sebelum menentukan pilihan.",
        hint: "Pilih satu karier yang menarik bagimu."
    },

    validate: {
        badge: "MODE VALIDASI",
        title:
            "Bandingkan jalur karier yang sedang kamu pertimbangkan.",
        description:
            "Pilih dua atau tiga karier untuk membandingkan fokus dan kompetensi intinya.",
        hint: "Pilih 2–3 karier untuk dibandingkan."
    },

    prepare: {
        badge: "MODE PERSIAPAN",
        title: "Pilih karier yang ingin kamu persiapkan.",
        description:
            "Pilih target kariermu lalu lanjutkan ke asesmen kemampuan.",
        hint: "Pilih target kariermu."
    }
};

const urlParams = new URLSearchParams(window.location.search);

let careerMode =
    urlParams.get("mode") ||
    localStorage.getItem("pathlyCareerStage") ||
    "explore";

if (!modeConfig[careerMode]) {
    careerMode = "explore";
}

const currentMode = modeConfig[careerMode];

modeBadge.textContent = currentMode.badge;
modeTitle.textContent = currentMode.title;
modeDescription.textContent = currentMode.description;
modeHint.textContent = currentMode.hint;
continueButton.hidden = careerMode === "validate";


/* DATA PILIHAN */

let selectedCareerIds = [];
let activeClarificationGroup = null;

const savedTarget = localStorage.getItem("pathlyCareerTarget");
const savedComparison = localStorage.getItem(
    "pathlyComparedCareers"
);

if (careerMode === "validate" && savedComparison) {
    try {
        selectedCareerIds = JSON.parse(savedComparison);

        if (!Array.isArray(selectedCareerIds)) {
            selectedCareerIds = [];
        }
    } catch (error) {
        selectedCareerIds = [];
    }
} else if (savedTarget) {
    selectedCareerIds = [savedTarget];
}


/* PESAN */

function showMessage(message, isError) {
    careerMessage.textContent = message;
    careerMessage.classList.add("show");
    careerMessage.classList.toggle("error", Boolean(isError));
}

function hideMessage() {
    careerMessage.classList.remove("show", "error");
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* CATATAN SUMBER DATA */

function formatReviewDate(isoDate) {
    const parsed = new Date(isoDate);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function renderDataProvenanceNote() {
    const noteElement = document.getElementById("dataProvenanceNote");

    if (!noteElement || !dataProvenance) {
        return;
    }

    const formattedDate = formatReviewDate(dataProvenance.lastReviewed);

    noteElement.textContent = formattedDate
        ? `Data terakhir ditinjau: ${formattedDate} • Kurasi manual dari O*NET, ESCO, SKKNI, dan sampel lowongan Indonesia.`
        : "Data dikurasi manual dari O*NET, ESCO, SKKNI, dan sampel lowongan Indonesia.";

    noteElement.hidden = false;
    noteElement.title = dataProvenance.reviewCycle || "";
}


/* MENCARI KARIER */

function findCareer(careerId) {
    return careers.find(function (career) {
        return career.id === careerId;
    });
}

function createSkillTags(skills, limit) {
    const displayedSkills = limit
        ? skills.slice(0, limit)
        : skills;

    return displayedSkills
        .map(function (skill) {
            return `<span>${escapeHtml(skill)}</span>`;
        })
        .join("");
}


/* MENAMPILKAN KARTU KARIER */

function renderCareers() {
    careerGrid.innerHTML = "";

    careers.forEach(function (career) {
        const card = document.createElement("label");
        const inputType =
            careerMode === "validate" ? "checkbox" : "radio";

        card.className = "career-option";

        card.innerHTML = `
            <input
                type="${inputType}"
                name="careerSelection"
                value="${escapeHtml(career.id)}"
                ${selectedCareerIds.includes(career.id) ? "checked" : ""}
            >

            <span class="career-option-content">
                <span class="option-top">
                    <span class="option-symbol">
                        ${escapeHtml(career.symbol)}
                    </span>

                    <span class="option-category">
                        ${escapeHtml(career.category)}
                    </span>
                </span>

                <h3>${escapeHtml(career.name)}</h3>

                <span class="option-description">
                    ${escapeHtml(career.description)}
                </span>

                <span class="option-focus">
                    <span>FOKUS PERAN</span>
                    <p>${escapeHtml(career.focus)}</p>
                </span>

                <span class="option-skills">
                    ${createSkillTags(career.skills, 5)}
                </span>
            </span>

            <span class="select-indicator">✓</span>
        `;

        const input = card.querySelector("input");

        input.addEventListener("change", function () {
            handleCareerSelection(career.id, input);
        });

        careerGrid.appendChild(card);
    });
}


/* MENYIMPAN PILIHAN PERBANDINGAN */

function saveComparedCareers() {
    localStorage.setItem(
        "pathlyComparedCareers",
        JSON.stringify(selectedCareerIds)
    );

    saveCareerJourney({
        compared_career_ids: selectedCareerIds
    }).then(function ({ error }) {
        if (error) {
            showMessage(
                "Pilihan perbandingan belum tersimpan ke akun. Coba pilih kembali.",
                true
            );
        }
    });
}


/* MEMILIH KARIER */

function handleCareerSelection(careerId, input) {
    hideMessage();

    if (careerMode !== "validate") {
        selectedCareerIds = [careerId];
        updateSingleSelection();
        return;
    }

    if (input.checked) {
        if (selectedCareerIds.length >= 3) {
            input.checked = false;

            showMessage(
                "Kamu dapat membandingkan maksimal tiga karier.",
                true
            );

            return;
        }

        if (!selectedCareerIds.includes(careerId)) {
            selectedCareerIds.push(careerId);
        }
    } else {
        selectedCareerIds = selectedCareerIds.filter(function (id) {
            return id !== careerId;
        });
    }

    saveComparedCareers();
    updateValidationSelection();
}


/* MEMPERBARUI PILIHAN TUNGGAL */

function updateSingleSelection() {
    const count = selectedCareerIds.length;

    selectionCounter.textContent = `${count} dipilih`;
    continueButton.disabled = count !== 1;

    if (count !== 1) {
        continueButton.innerHTML =
            `Lanjutkan <span>→</span>`;

        return;
    }

    const career = findCareer(selectedCareerIds[0]);

    if (!career) {
        return;
    }

    const buttonText =
        careerMode === "prepare"
            ? `Lanjutkan dengan ${career.name}`
            : `Jelajahi ${career.name}`;

    continueButton.innerHTML =
        `${escapeHtml(buttonText)} <span>→</span>`;
}


/* MEMPERBARUI MODE VALIDASI */

function updateValidationSelection() {
    const count = selectedCareerIds.length;

    selectionCounter.textContent = `${count} dari 3 dipilih`;

    if (count >= 2) {
        renderComparison();
    } else {
        comparisonPanel.classList.remove("show");
    }
}


/* MENAMPILKAN PERBANDINGAN */

function renderComparison() {
    if (selectedCareerIds.length < 2) {
        comparisonPanel.classList.remove("show");
        return;
    }

    comparisonGrid.innerHTML = "";

    selectedCareerIds.forEach(function (careerId) {
        const career = findCareer(careerId);

        if (!career) {
            return;
        }

        const card = document.createElement("article");

        card.className = "compare-card";

        card.innerHTML = `
            <span class="compare-category">
                ${escapeHtml(career.category)}
            </span>

            <h3>${escapeHtml(career.name)}</h3>

            <div class="compare-row">
                <span>FOKUS PERAN</span>
                <p>${escapeHtml(career.focus)}</p>
            </div>

            <div class="compare-row">
                <span>AREA KEBUTUHAN</span>

                <div class="option-skills">
                    ${createSkillTags(career.skills)}
                </div>
            </div>

            <button
                type="button"
                class="btn btn-primary choose-target-button"
                data-career-id="${escapeHtml(career.id)}"
            >
                Pilih sebagai Target Saya
            </button>
        `;

        comparisonGrid.appendChild(card);
    });

    comparisonPanel.classList.add("show");

    comparisonGrid
        .querySelectorAll(".choose-target-button")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                chooseCareerTarget(button.dataset.careerId);
            });
        });
}


/* MENYIMPAN TARGET KARIER */

async function chooseCareerTarget(careerId) {
    const career = findCareer(careerId);

    if (!career) {
        return;
    }

    const { error } = await saveCareerJourney({
        target_career_id: career.id,
        target_career_name: career.name
    });

    if (error) {
        showMessage(
            "Target karier belum berhasil disimpan. Coba lagi.",
            true
        );
        return;
    }

    localStorage.setItem("pathlyCareerTarget", career.id);

    targetConfirmationName.textContent = career.name;
    targetConfirmation.classList.add("show");

    showMessage(
        `${career.name} disimpan sebagai target kariermu.`
    );

    setTimeout(function () {
        window.location.href = "assessment.html";
    }, 600);
}


/* MEMBUAT KARIER PILIHAN PENGGUNA */

function selectCustomCareer(data, message) {
    const career = customCareerEngine.saveCareer(data);

    if (!career) {
        showMessage(
            "Karier belum dapat dibuat. Silakan coba posisi lain.",
            true
        );

        return;
    }

    let resultMessage =
        message ||
        `${career.name} siap digunakan dalam proses Pathly.`;

    if (careerMode === "validate") {
        selectedCareerIds = selectedCareerIds.filter(findCareer);

        if (!selectedCareerIds.includes(career.id)) {
            if (selectedCareerIds.length >= 3) {
                resultMessage =
                    `${career.name} ditambahkan ke pilihan karier. Batalkan salah satu pilihan sebelumnya jika ingin membandingkannya.`;
            } else {
                selectedCareerIds.push(career.id);
            }
        }

        saveComparedCareers();
    } else {
        selectedCareerIds = [career.id];
    }

    renderCareers();

    if (careerMode === "validate") {
        updateValidationSelection();
    } else {
        updateSingleSelection();
    }

    careerClarification.classList.remove("show");
    careerPreferencePanel.classList.remove("show");

    showMessage(resultMessage);

    const selectedCard = careerGrid.querySelector(
        `input[value="${career.id}"]`
    );

    if (selectedCard) {
        selectedCard
            .closest(".career-option")
            .scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
    }
}


/* MEMBUAT KARIER DARI TEMPLATE */

function selectCareerTemplate(template, message) {
    const data = customCareerEngine.buildCareer(
        template.name,
        template
    );

    selectCustomCareer(
        data,
        message ||
        `${template.name} dipilih dan siap digunakan untuk asesmen.`
    );
}


/* MENAMPILKAN POSISI YANG LEBIH SPESIFIK */

function showSpecificCareers(group) {
    activeClarificationGroup = group;

    clarificationTitle.textContent =
        `${group.name} memiliki beberapa jalur karier.`;

    clarificationDescription.textContent =
        "Pilih posisi yang paling sesuai agar asesmen dan roadmap lebih relevan.";

    specificCareerOptions.innerHTML = "";

    group.suggestions.forEach(function (suggestion) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "specific-career-option";

        button.innerHTML = `
            <span class="specific-career-symbol">
                ${escapeHtml(suggestion.symbol)}
            </span>

            <span>
                <strong>${escapeHtml(suggestion.name)}</strong>
                <small>${escapeHtml(suggestion.focus)}</small>
            </span>

            <span class="specific-career-arrow">→</span>
        `;

        button.addEventListener("click", function () {
            selectCareerTemplate(suggestion);
        });

        specificCareerOptions.appendChild(button);
    });

    careerPreferencePanel.classList.remove("show");
    careerClarification.classList.add("show");

    careerClarification.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* REKOMENDASI BERDASARKAN PREFERENSI */

function showPreferenceOptions() {
    careerPreferenceOptions.innerHTML = "";

    customCareerEngine.preferenceOptions.forEach(
        function (preference) {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "career-preference-option";
            button.textContent = preference.label;

            button.addEventListener("click", function () {
                if (!activeClarificationGroup) {
                    return;
                }

                const recommendation =
                    customCareerEngine.recommend(
                        activeClarificationGroup,
                        preference.id
                    );

                selectCareerTemplate(
                    recommendation,
                    `Berdasarkan pilihanmu, Pathly merekomendasikan ${recommendation.name}.`
                );
            });

            careerPreferenceOptions.appendChild(button);
        }
    );
}


/* FORM PEKERJAAN IMPIAN */

if (dreamCareerForm && customCareerEngine) {
    dreamCareerInput.addEventListener("input", function () {
        if (dreamCareerInput.getAttribute("aria-invalid") === "true") {
            dreamCareerInput.setAttribute("aria-invalid", "false");
            hideMessage();
        }
    });

    dreamCareerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage();

        const rawInput = dreamCareerInput.value;

        if (customCareerEngine.containsUnsafeInput(rawInput)) {
            showMessage(
                "Nama pekerjaan tidak boleh berisi kode, tag HTML, atau karakter berbahaya.",
                true
            );
            dreamCareerInput.setAttribute("aria-invalid", "true");
            dreamCareerInput.focus();
            return;
        }

        const input = customCareerEngine.sanitizeName(rawInput);

        if (input.length < 2) {
            showMessage(
                "Tuliskan nama pekerjaan atau bidang karier terlebih dahulu.",
                true
            );

            dreamCareerInput.focus();
            return;
        }

        dreamCareerInput.value = input;
        dreamCareerInput.setAttribute("aria-invalid", "false");

        const normalizedInput =
            customCareerEngine.normalize(input);

        const matchingCareers = careers.filter(function (career) {
            return (
                customCareerEngine.normalize(career.name) ===
                normalizedInput
            );
        });

        const existingCareer =
            matchingCareers.find(function (career) {
                return !career.isCustom;
            }) || matchingCareers[0];

        if (existingCareer) {
            showMessage(
                `${existingCareer.name} sudah tersedia. Pilih kartunya untuk melanjutkan.`
            );

            const existingInput = Array.from(
                careerGrid.querySelectorAll('input[name="careerSelection"]')
            ).find(function (inputElement) {
                return inputElement.value === existingCareer.id;
            });

            existingInput?.closest(".career-option")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            existingInput?.focus({ preventScroll: true });

            return;
        }

        const broadGroup =
            customCareerEngine.findBroadGroup(input) ||
            customCareerEngine.inferGroup(input);

        if (broadGroup) {
            showSpecificCareers(broadGroup);
            return;
        }

        showMessage(
            "Karier tersebut belum tersedia di katalog Pathly. Coba nama lain atau pilih salah satu karier yang tersedia.",
            true
        );
        dreamCareerInput.setAttribute("aria-invalid", "true");
        dreamCareerInput.focus();
    });

    unsureCareerButton.addEventListener("click", function () {
        if (!activeClarificationGroup) {
            return;
        }

        showPreferenceOptions();
        careerPreferencePanel.classList.add("show");

        careerPreferencePanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });

    writeAnotherCareerButton.addEventListener(
        "click",
        function () {
            careerClarification.classList.remove("show");
            careerPreferencePanel.classList.remove("show");
            dreamCareerInput.value = "";
            dreamCareerInput.focus();
        }
    );
}


/* TOMBOL LANJUT */

continueButton.addEventListener("click", function () {
    if (careerMode === "validate") {
        return;
    }

    if (selectedCareerIds.length !== 1) {
        showMessage(
            "Silakan pilih satu karier terlebih dahulu.",
            true
        );

        return;
    }

    chooseCareerTarget(selectedCareerIds[0]);
});


/* MEMULAI HALAMAN */

renderCareers();
renderDataProvenanceNote();

if (careerMode === "validate") {
    updateValidationSelection();
} else {
    updateSingleSelection();
}
