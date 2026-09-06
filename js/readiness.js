import { saveReadinessRecord } from "./lib/user-data.js";

(function () {
    const scoringResult = window.PATHLY_SCORING_RESULT;
    const careerStage = localStorage.getItem("pathlyCareerStage");
    const careerTarget = localStorage.getItem("pathlyCareerTarget");

    const readinessCareer =
        document.getElementById("readinessCareer");

    const readinessAlignment =
        document.getElementById("readinessAlignment");

    const clarityStatus =
        document.getElementById("clarityStatus");

    const clarityDescription =
        document.getElementById("clarityDescription");

    const evidenceStatus =
        document.getElementById("evidenceStatus");

    const evidenceDescription =
        document.getElementById("evidenceDescription");

    const adaptabilityStatus =
        document.getElementById("adaptabilityStatus");

    const adaptabilityDescription =
        document.getElementById("adaptabilityDescription");

    const adaptabilityForm =
        document.getElementById("adaptabilityForm");

    const adaptabilityMessage =
        document.getElementById("adaptabilityMessage");

    const dimensionResults =
        document.getElementById("dimensionResults");

    const roadmapButton =
        document.getElementById("roadmapButton");

    const adaptabilitySaveState =
        document.getElementById("adaptabilitySaveState");

    const dimensions = [
        "concern",
        "control",
        "curiosity",
        "confidence"
    ];

    const dimensionItems = {
        concern: ["concernPlan", "concernAction"],
        control: ["controlDecision", "controlAction"],
        curiosity: ["curiosityExplore", "curiosityCompare"],
        confidence: ["confidenceLearn", "confidenceRecover"]
    };

    const reflectionItems = Object.values(dimensionItems).flat();

    const dimensionLabels = {
        concern: "perhatian pada masa depan",
        control: "kendali atas keputusan",
        curiosity: "rasa ingin tahu",
        confidence: "kepercayaan diri"
    };

    if (scoringResult) {
        readinessCareer.textContent =
            scoringResult.careerName;

        readinessAlignment.textContent =
            `${scoringResult.alignment}%`;
    } else {
        readinessCareer.textContent = "Belum dipilih";
        readinessAlignment.textContent = "Tidak tersedia";
    }

    function showCareerClarity() {
        if (!careerTarget || !scoringResult) {
            clarityStatus.textContent = "Belum ditentukan";

            clarityDescription.textContent =
                "Pilih target karier sebelum melanjutkan perjalananmu di Pathly.";

            return;
        }

        const careerName = scoringResult.careerName;

        if (careerStage === "prepare") {
            clarityStatus.textContent = "Target ditentukan";

            clarityDescription.textContent =
                `Kamu telah memilih ${careerName} sebagai target kariermu.`;

            return;
        }

        if (careerStage === "validate") {
            clarityStatus.textContent = "Arah telah dipilih";

            clarityDescription.textContent =
                `Setelah membandingkan beberapa pilihan, kamu memilih ${careerName}.`;

            return;
        }

        clarityStatus.textContent = "Arah dipilih";

        clarityDescription.textContent =
            `Setelah melakukan eksplorasi, kamu memilih ${careerName} untuk dikembangkan.`;
    }

    function showEvidenceCoverage() {
        if (!scoringResult) {
            evidenceStatus.textContent = "Tidak tersedia";

            evidenceDescription.textContent =
                "Selesaikan asesmen untuk melihat cakupan referensimu.";

            return;
        }

        const totalSkills = scoringResult.totalSkills;
        const evidenceCount = scoringResult.evidenceCount;

        const ratio =
            totalSkills > 0
                ? evidenceCount / totalSkills
                : 0;

        let status = "Belum ada referensi";

        if (ratio >= 0.75) {
            status = "Cakupan luas";
        } else if (ratio >= 0.4) {
            status = "Cakupan berkembang";
        } else if (ratio > 0) {
            status = "Cakupan awal";
        }

        evidenceStatus.textContent = status;

        evidenceDescription.textContent =
            `${evidenceCount} dari ${totalSkills} keahlian memiliki referensi yang kamu catat. Pathly tidak memverifikasi referensi dan tidak memasukkannya ke skor.`;
    }

    function getReflectionLabel(value) {
        const score = Number(value);
        if (!Number.isFinite(score)) return "Belum diisi";
        if (score < 1.5) return "Belum tampak";
        if (score < 2.5) return "Mulai terlihat";
        if (score < 3.5) return "Cukup konsisten";
        return "Konsisten";
    }

    function showAdaptabilityResult(data) {
        dimensions.forEach(function (dimension) {
            const resultElement = document.getElementById(
                `${dimension}Result`
            );

            if (resultElement) {
                resultElement.textContent =
                    getReflectionLabel(data[dimension]);
            }
        });

        dimensionResults.classList.add("show");

        adaptabilityStatus.textContent =
            "Refleksi selesai";

        adaptabilityDescription.textContent =
            "Keempat dimensi adaptabilitasmu telah disimpan secara terpisah.";

        roadmapButton.disabled = false;
    }

    function loadSavedAdaptability() {
        const savedData = localStorage.getItem(
            "pathlyAdaptabilityCheck"
        );

        if (!savedData) {
            return;
        }

        try {
            const data = JSON.parse(savedData);

            if (!data.items) {
                adaptabilitySaveState.textContent =
                    "Refleksi versi lama ditemukan. Isi ulang agar hasil memakai dua pernyataan per dimensi.";
                return;
            }

            reflectionItems.forEach(function (itemName) {
                const input = document.querySelector(
                    `input[name="${itemName}"][value="${data.items[itemName]}"]`
                );

                if (input) {
                    input.checked = true;
                }
            });

            showAdaptabilityResult(data);
            adaptabilitySaveState.textContent =
                "Menampilkan refleksi yang terakhir disimpan di akunmu.";
        } catch (error) {
            console.log(
                "Data adaptabilitas tidak dapat dibaca:",
                error
            );
        }
    }

    if (adaptabilityForm) {
        const adaptabilitySubmitButton = adaptabilityForm.querySelector(
            'button[type="submit"]'
        );

        reflectionItems.forEach(function (itemName) {
            adaptabilityForm
                .querySelectorAll(`input[name="${itemName}"]`)
                .forEach(function (input) {
                    input.addEventListener("change", function () {
                        input.closest(".adaptability-question")?.classList.remove("field-invalid");
                        adaptabilityForm
                            .querySelectorAll(`input[name="${itemName}"]`)
                            .forEach(function (item) {
                                item.setAttribute("aria-invalid", "false");
                            });
                        adaptabilitySaveState.textContent =
                            "Ada perubahan yang belum disimpan.";
                        adaptabilityStatus.textContent =
                            "Perubahan belum disimpan";
                        adaptabilityDescription.textContent =
                            "Tekan Simpan Refleksi agar jawaban baru masuk ke akunmu.";
                        roadmapButton.disabled = true;
                    });
                });
        });

        adaptabilityForm.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();

                const formData =
                    new FormData(adaptabilityForm);

                const missingItems = reflectionItems.filter(function (itemName) {
                    return !formData.get(itemName);
                });

                const missingDimensions = dimensions.filter(function (dimension) {
                    return dimensionItems[dimension].some(function (itemName) {
                        return missingItems.includes(itemName);
                    });
                });

                dimensions.forEach(function (dimension) {
                    const inputs = dimensionItems[dimension].flatMap(function (itemName) {
                        return Array.from(adaptabilityForm.querySelectorAll(
                            `input[name="${itemName}"]`
                        ));
                    });
                    const invalid = missingDimensions.includes(dimension);
                    inputs.forEach(function (input) {
                        input.setAttribute("aria-invalid", String(invalid));
                    });
                    inputs[0]?.closest(".adaptability-question")?.classList.toggle(
                        "field-invalid",
                        invalid
                    );
                });

                if (missingDimensions.length) {
                    adaptabilityMessage.textContent =
                        `Lengkapi refleksi berikut: ${missingDimensions.map(function (dimension) {
                            return dimensionLabels[dimension];
                        }).join(", ")}.`;
                    adaptabilityMessage.className = "form-message show error";

                    const firstInput = adaptabilityForm.querySelector(
                        `input[name="${missingItems[0]}"]`
                    );
                    firstInput?.closest(".adaptability-question")?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                    firstInput?.focus({ preventScroll: true });
                    return;
                }

                adaptabilityMessage.className = "form-message";

                const itemValues = Object.fromEntries(
                    reflectionItems.map(function (itemName) {
                        return [itemName, Number(formData.get(itemName))];
                    })
                );

                const dimensionScore = function (dimension) {
                    const values = dimensionItems[dimension].map(function (itemName) {
                        return itemValues[itemName];
                    });
                    return values.reduce(function (sum, value) {
                        return sum + value;
                    }, 0) / values.length;
                };

                const adaptabilityData = {
                    version: 2,
                    items: itemValues,
                    concern: dimensionScore("concern"),
                    control: dimensionScore("control"),
                    curiosity: dimensionScore("curiosity"),
                    confidence: dimensionScore("confidence"),
                    updatedAt: new Date().toISOString()
                };

                adaptabilitySubmitButton.disabled = true;

                const { error } = await saveReadinessRecord(
                    careerTarget,
                    adaptabilityData,
                    scoringResult
                );

                if (error) {
                    adaptabilitySubmitButton.disabled = false;
                    adaptabilityDescription.textContent =
                        "Refleksi belum berhasil disimpan. Periksa koneksi lalu coba lagi.";
                    adaptabilityMessage.textContent =
                        "Refleksi belum berhasil disimpan. Periksa koneksi lalu coba lagi.";
                    adaptabilityMessage.className = "form-message show error";
                    return;
                }

                localStorage.setItem(
                    "pathlyAdaptabilityCheck",
                    JSON.stringify(adaptabilityData)
                );

                showAdaptabilityResult(
                    adaptabilityData
                );

                adaptabilitySaveState.textContent =
                    "Refleksi berhasil disimpan ke akunmu.";

                adaptabilitySubmitButton.disabled = false;

                dimensionResults.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        );
    }

    if (roadmapButton) {
        roadmapButton.addEventListener(
            "click",
            function () {
                if (!roadmapButton.disabled) {
                    window.location.href =
                        "roadmap.html";
                }
            }
        );
    }

    showCareerClarity();
    showEvidenceCoverage();
    loadSavedAdaptability();
})();
