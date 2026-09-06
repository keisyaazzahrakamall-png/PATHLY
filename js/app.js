import { supabase } from "./lib/supabase.js";
import { saveCareerJourney } from "./lib/user-data.js";

console.log("Pathly is running!");

function getSavedData(key) {
    const savedData = localStorage.getItem(key);

    if (!savedData) {
        return null;
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        console.log("Data tidak dapat dibaca:", error);
        return null;
    }
}

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
        navLinks.classList.toggle("active");

        const isOpen = navLinks.classList.contains("active");

        menuButton.setAttribute("aria-expanded", isOpen);
        menuButton.textContent = isOpen ? "×" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "☰";
        });
    });
}

const sectionNavLinks = navLinks
    ? Array.from(navLinks.querySelectorAll('a[href^="#"]'))
    : [];
const observedSections = sectionNavLinks
    .map(function (link) {
        return {
            link: link,
            section: document.querySelector(link.getAttribute("href"))
        };
    })
    .filter(function (item) {
        return item.section;
    });

if (observedSections.length) {
    let scrollUpdateQueued = false;

    function updateActiveSection() {
        const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
        const readingLine = window.scrollY + navbarHeight + window.innerHeight * 0.22;
        let activeItem = null;

        observedSections.forEach(function (item) {
            if (item.section.offsetTop <= readingLine) {
                activeItem = item;
            }
        });

        observedSections.forEach(function (item) {
            const isActive = item === activeItem;
            item.link.classList.toggle("is-active", isActive);

            if (isActive) {
                item.link.setAttribute("aria-current", "location");
            } else {
                item.link.removeAttribute("aria-current");
            }
        });

        scrollUpdateQueued = false;
    }

    function requestActiveSectionUpdate() {
        if (scrollUpdateQueued) return;
        scrollUpdateQueued = true;
        window.requestAnimationFrame(updateActiveSection);
    }

    window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", requestActiveSectionUpdate);
    updateActiveSection();
}

const profileForm = document.getElementById("profileForm");
const formMessage = document.getElementById("formMessage");

if (profileForm) {
    const profileParams = new URLSearchParams(window.location.search);
    const isEditingProfile = profileParams.get("edit") === "profile";
    const profileReturnPage = "index.html";
    const fullNameInput = document.getElementById("fullName");
    const majorInput = document.getElementById("major");
    const semesterInput = document.getElementById("semester");
    const graduationInput = document.getElementById("graduationYear");
    const profileSubmitButton = profileForm.querySelector('button[type="submit"]');
    const educationInputs = Array.from(
        profileForm.querySelectorAll('input[name="educationLevel"]')
    );
    const experienceInputs = Array.from(
        profileForm.querySelectorAll('input[name="experience"]')
    );
    const noExperienceInput = profileForm.querySelector('[data-no-experience]');

    if (isEditingProfile) {
        document.getElementById("profilePageLabel").textContent = "PROFIL SAYA";
        document.getElementById("profilePageTitle").textContent = "Edit profilmu.";
        document.getElementById("profilePageDescription").textContent =
            "Perbarui informasi pendidikan dan pengalaman yang digunakan untuk mempersonalisasi jalur kariermu.";
        document.getElementById("profileBackButton").href = profileReturnPage;
        document.getElementById("profileBackButton").textContent = "Batal";
        document.getElementById("profileSaveButton").innerHTML =
            "Simpan Perubahan <span>✓</span>";
    }
    const profileFields = [
        { key: "fullName", label: "nama panggilan", input: fullNameInput },
        {
            key: "educationLevel",
            label: "jenjang pendidikan",
            input: educationInputs[0],
            isEmpty: function () {
                return !educationInputs.some(function (input) { return input.checked; });
            }
        },
        { key: "major", label: "bidang studi", input: majorInput },
        { key: "semester", label: "semester saat ini", input: semesterInput },
        { key: "graduationYear", label: "perkiraan tahun kelulusan", input: graduationInput },
        {
            key: "experience",
            label: "pengalaman",
            input: experienceInputs[0],
            isEmpty: function () {
                return !experienceInputs.some(function (input) { return input.checked; });
            }
        }
    ];

    function isProfileFieldEmpty(field) {
        return field.isEmpty ? field.isEmpty() : !field.input.value.trim();
    }

    function markProfileField(field, invalid) {
        const group = field.input.closest(".form-group");
        if (group) group.classList.toggle("field-invalid", invalid);

        let errorText = group?.querySelector(".field-error-text");
        if (invalid && group && !errorText) {
            errorText = document.createElement("p");
            errorText.className = "field-error-text";
            errorText.textContent = "Bagian ini belum diisi.";
            group.appendChild(errorText);
        } else if (!invalid) {
            errorText?.remove();
        }

        if (field.key === "educationLevel" || field.key === "experience") {
            const groupedInputs = field.key === "educationLevel"
                ? educationInputs
                : experienceInputs;
            groupedInputs.forEach(function (input) {
                input.setAttribute("aria-invalid", String(invalid));
            });
        } else {
            field.input.setAttribute("aria-invalid", String(invalid));
        }
    }

    function showMissingProfileFields(fields) {
        profileFields.forEach(function (field) {
            markProfileField(field, fields.some(function (item) { return item.key === field.key; }));
        });

        if (formMessage) {
            formMessage.textContent = `Lengkapi bagian berikut: ${fields.map(function (field) { return field.label; }).join(", ")}.`;
            formMessage.className = "form-message show error";
        }

        if (fields[0]) {
            fields[0].input.closest(".form-group")?.scrollIntoView({ behavior: "smooth", block: "center" });
            fields[0].input.focus({ preventScroll: true });
        }
    }

    profileFields.forEach(function (field) {
        const inputs = field.key === "educationLevel"
            ? educationInputs
            : field.key === "experience"
                ? experienceInputs
                : [field.input];
        inputs.forEach(function (input) {
            input.addEventListener(
                input.type === "radio" || input.type === "checkbox" ? "change" : "input",
                function () {
                if (!isProfileFieldEmpty(field)) markProfileField(field, false);
                }
            );
        });
    });

    experienceInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            if (!input.checked) return;

            if (input === noExperienceInput) {
                experienceInputs.forEach(function (otherInput) {
                    if (otherInput !== noExperienceInput) otherInput.checked = false;
                });
            } else if (noExperienceInput) {
                noExperienceInput.checked = false;
            }
        });
    });

    function fillProfile(profile) {
        if (!profile) {
            return;
        }

        fullNameInput.value = profile.fullName || "";
        majorInput.value = profile.major || "";
        semesterInput.value = profile.semester || "";
        graduationInput.value = profile.graduationYear || "";

        document
            .querySelectorAll('input[name="educationLevel"]')
            .forEach(function (input) {
                input.checked = input.value === profile.educationLevel;
            });

        document
            .querySelectorAll('input[name="experience"]')
            .forEach(function (input) {
                input.checked =
                    Array.isArray(profile.experience) &&
                    profile.experience.includes(input.value);
            });
    }

    async function loadAccountProfile() {
        const localProfile = getSavedData("pathlyProfile");
        fillProfile(localProfile);

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            return;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select(
                "full_name, education_level, major, semester, graduation_year, experiences"
            )
            .eq("id", user.id)
            .maybeSingle();

        if (error || !data) {
            return;
        }

        const accountProfile = {
            fullName: data.full_name || "",
            educationLevel: data.education_level || "",
            major: data.major || "",
            semester: data.semester ? String(data.semester) : "",
            graduationYear: data.graduation_year
                ? String(data.graduation_year)
                : "",
            experience: Array.isArray(data.experiences)
                ? data.experiences
                : []
        };

        localStorage.setItem(
            "pathlyProfile",
            JSON.stringify(accountProfile)
        );
        fillProfile(accountProfile);
    }

    loadAccountProfile().then(function () {
        const requestedMissing = new URLSearchParams(window.location.search)
            .get("missing")
            ?.split(",") || [];
        const fields = profileFields.filter(function (field) {
            return requestedMissing.includes(field.key) && isProfileFieldEmpty(field);
        });

        if (fields.length) showMissingProfileFields(fields);
    });

    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const missingFields = profileFields.filter(isProfileFieldEmpty);
        if (missingFields.length) {
            showMissingProfileFields(missingFields);
            return;
        }

        const educationInput = document.querySelector(
            'input[name="educationLevel"]:checked'
        );

        const experience = Array.from(
            document.querySelectorAll('input[name="experience"]:checked')
        ).map(function (input) {
            return input.value;
        });

        const profile = {
            fullName: fullNameInput.value.trim(),
            educationLevel: educationInput ? educationInput.value : "",
            major: majorInput.value.trim(),
            semester: semesterInput.value,
            graduationYear: graduationInput.value,
            experience: experience
        };

        profileSubmitButton.disabled = true;

        if (formMessage) {
            formMessage.textContent = "Menyimpan profilmu...";
            formMessage.className = "form-message show";
        }

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            window.location.replace("login.html?next=onboarding.html");
            return;
        }

        const { error } = await supabase.from("profiles").upsert(
            {
                id: user.id,
                full_name: profile.fullName,
                education_level: profile.educationLevel,
                major: profile.major,
                semester: Number(profile.semester),
                graduation_year: Number(profile.graduationYear),
                experiences: profile.experience
            },
            { onConflict: "id" }
        );

        if (error) {
            profileSubmitButton.disabled = false;

            if (formMessage) {
                formMessage.textContent =
                    "Profil belum berhasil disimpan. Periksa koneksi lalu coba lagi.";
                formMessage.className = "form-message show error";
            }

            return;
        }

        localStorage.setItem("pathlyProfile", JSON.stringify(profile));

        if (formMessage) {
            formMessage.textContent =
                isEditingProfile
                    ? "Perubahan profil berhasil disimpan."
                    : "Profil tersimpan. Membuka tahap kariermu...";
            formMessage.className = "form-message show";
        }

        window.setTimeout(function () {
            window.location.href = isEditingProfile
                ? profileReturnPage
                : "career-stage.html";
        }, isEditingProfile ? 500 : 0);
    });
}

const careerStageForm = document.getElementById("careerStageForm");
const stageMessage = document.getElementById("stageMessage");
const stageGreeting = document.getElementById("stageGreeting");

if (careerStageForm) {
    const profile = getSavedData("pathlyProfile");
    const savedStage = localStorage.getItem("pathlyCareerStage");
    const stageSubmitButton = careerStageForm.querySelector(
        'button[type="submit"]'
    );
    const stageGrid = careerStageForm.querySelector(".stage-grid");
    const stageInputs = Array.from(
        careerStageForm.querySelectorAll('input[name="careerStage"]')
    );

    const stageUrl = new URL(window.location.href);
    if (stageUrl.searchParams.get("reset") === "success" && stageMessage) {
        stageMessage.textContent =
            "Perjalanan kariermu berhasil direset. Pilih tahap untuk memulai lagi.";
        stageMessage.className = "form-message show";
        stageUrl.searchParams.delete("reset");
        window.history.replaceState({}, "", stageUrl);
    }

    stageInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            stageGrid?.classList.remove("field-invalid");
            stageInputs.forEach(function (item) {
                item.setAttribute("aria-invalid", "false");
            });
            if (stageMessage?.classList.contains("error")) {
                stageMessage.className = "form-message";
            }
        });
    });

    if (profile && profile.fullName && stageGreeting) {
        stageGreeting.textContent =
            `Di tahap mana kamu dalam perjalanan kariermu, ${profile.fullName}?`;
    }

    if (savedStage) {
        const savedStageInput = document.querySelector(
            `input[name="careerStage"][value="${savedStage}"]`
        );

        if (savedStageInput) {
            savedStageInput.checked = true;
        }
    }

    careerStageForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const selectedStage = document.querySelector(
            'input[name="careerStage"]:checked'
        );

        if (!selectedStage) {
            stageGrid?.classList.add("field-invalid");
            stageInputs.forEach(function (input) {
                input.setAttribute("aria-invalid", "true");
            });
            if (stageMessage) {
                stageMessage.textContent =
                    "Silakan pilih tahap kariermu saat ini.";
                stageMessage.className = "form-message show error";
            }

            stageGrid?.scrollIntoView({ behavior: "smooth", block: "center" });
            stageInputs[0]?.focus({ preventScroll: true });

            return;
        }

        const stage = selectedStage.value;

        stageSubmitButton.disabled = true;

        if (stageMessage) {
            stageMessage.textContent =
                "Menyimpan tahap kariermu...";

            stageMessage.className = "form-message show";
        }

        const { error } = await saveCareerJourney({
            career_stage: stage
        });

        if (error) {
            stageSubmitButton.disabled = false;

            if (stageMessage) {
                stageMessage.textContent =
                    "Tahap karier belum berhasil disimpan. Coba lagi.";
                stageMessage.className = "form-message show error";
            }

            return;
        }

        localStorage.setItem("pathlyCareerStage", stage);

        if (stageMessage) {
            stageMessage.textContent =
                "Tahap karier tersimpan. Menyiapkan langkah berikutnya...";
            stageMessage.className = "form-message show";
        }

        window.location.href = `career.html?mode=${stage}`;
    });
}

const routeContent = {
    explore: {
        label: "MODE EKSPLORASI",
        title: "Mari temukan arah karier yang layak dijelajahi.",
        description:
            "Kamu belum harus memiliki jawaban karier yang final. Pathly akan membantumu memahami beberapa jalur karier digital sebelum menentukan fokus.",
        nextTitle: "Berikutnya: Eksplorasi Karier",
        nextDescription:
            "Jelajahi lima jalur karier Pathly dan pahami cakupan setiap peran."
    },

    validate: {
        label: "MODE VALIDASI",
        title:
            "Mari bandingkan jalur karier yang sedang kamu pertimbangkan.",
        description:
            "Pathly akan membantumu membandingkan beberapa pilihan karier agar kamu dapat mengambil keputusan yang lebih terstruktur.",
        nextTitle: "Berikutnya: Perbandingan Karier",
        nextDescription:
            "Pilih hingga tiga karier dan bandingkan fokus peran serta kebutuhan kompetensinya."
    },

    prepare: {
        label: "MODE PERSIAPAN",
        title: "Mari bersiap untuk karier yang sudah kamu inginkan.",
        description:
            "Karena kamu sudah memiliki target, Pathly akan mengarahkanmu ke pemilihan karier dan asesmen kesenjangan keahlian.",
        nextTitle: "Berikutnya: Pilih Target Kariermu",
        nextDescription:
            "Pilih target kariermu sebelum memulai asesmen keahlian dan bukti."
    }
};

const routeTitle = document.getElementById("routeTitle");
const routeDescription = document.getElementById("routeDescription");
const routePreview = document.getElementById("routePreview");
const routeLabel = document.getElementById("routeLabel");

if (routeTitle && routeDescription && routePreview) {
    const urlParams = new URLSearchParams(window.location.search);

    const mode =
        urlParams.get("mode") ||
        localStorage.getItem("pathlyCareerStage");

    const content = routeContent[mode];

    if (content) {
        if (routeLabel) {
            routeLabel.textContent = content.label;
        }

        routeTitle.textContent = content.title;
        routeDescription.textContent = content.description;

        routePreview.innerHTML = `
            <strong>${content.nextTitle}</strong>
            ${content.nextDescription}
        `;
    } else {
        if (routeLabel) {
            routeLabel.textContent = "TAHAP KARIER";
        }

        routeTitle.textContent =
            "Pilih tahap kariermu terlebih dahulu.";

        routeDescription.textContent =
            "Pathly perlu memahami posisimu dalam perjalanan karier sebelum menyusun langkah berikutnya.";

        routePreview.innerHTML = `
            <strong>Tahap karier tidak ditemukan</strong>
            Kembali ke halaman sebelumnya dan pilih Eksplorasi, Validasi, atau Persiapan.
        `;
    }
}
