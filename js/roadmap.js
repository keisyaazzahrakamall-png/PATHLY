import { saveRoadmapRecord } from "./lib/user-data.js";
import { getSkillDescription } from "./skill-glossary.js";

function getStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || {};
    } catch (error) {
        return {};
    }
}

const result = window.PATHLY_SCORING_RESULT;
const profile = getStorage("pathlyProfile");
const assessment = getStorage("pathlyAssessmentResults");
const specialActions = {
    "Analisis Data": {
        learn: "Pahami alur kerja analisis data",
        apply: "Selesaikan analisis sederhana",
        prove: "Publikasikan studi kasus analisis"
    },

    SQL: {
        learn: "Pelajari dasar-dasar SQL",
        apply: "Analisis dataset menggunakan SQL",
        prove: "Dokumentasikan proyek SQL"
    },

    "BI / Visualisasi Data": {
        learn: "Pelajari visualisasi data yang efektif",
        apply: "Buat dasbor sederhana",
        prove: "Dokumentasikan proyek dasbor"
    },

    Figma: {
        learn: "Pelajari dasar-dasar Figma",
        apply: "Rancang antarmuka sederhana",
        prove: "Buat studi kasus desain UI"
    },

    "HTML / CSS": {
        learn: "Pelajari dasar-dasar HTML dan CSS",
        apply: "Buat halaman web responsif",
        prove: "Simpan proyek sebagai portofolio"
    },

    "Analisis Kebutuhan": {
        learn: "Pelajari dasar-dasar analisis kebutuhan",
        apply: "Analisis kebutuhan sebuah sistem",
        prove: "Buat studi kasus kebutuhan"
    }
};

const taskDetails = {
    Pelajari: {
        estimate: {
            Missing: "3–4 jam",
            Developing: "1–2 jam",
            Developed: "sekitar 1 jam"
        },
        doneWhen: (skill) =>
            `Dapat menjelaskan konsep utama ${skill} dan mencatat tiga poin penting.`
    },
    Terapkan: {
        estimate: {
            Missing: "4–6 jam",
            Developing: "2–4 jam",
            Developed: "1–2 jam"
        },
        doneWhen: (skill) =>
            `Menghasilkan satu latihan, tugas, atau proyek kecil yang menggunakan ${skill}.`
    },
    Buktikan: {
        estimate: {
            Missing: "2–3 jam",
            Developing: "1–2 jam",
            Developed: "sekitar 1 jam"
        },
        doneWhen: () =>
            "Menyimpan hasil, konteks pengerjaan, dan peran pribadi dalam portofolio."
    }
};

function createActions(skill) {
    if (specialActions[skill]) {
        return specialActions[skill];
    }

    return {
        learn: `Pelajari dasar-dasar ${skill}`,
        apply: `Gunakan ${skill} dalam proyek sederhana`,
        prove: `Buat bukti portofolio untuk ${skill}`
    };
}

function createTask(priority, number, type, title) {
    const detail = taskDetails[type];
    const status = priority.status || "Missing";
    const estimateExplanations = {
        Missing: "Waktu lebih panjang karena keahlian ini belum kamu kuasai.",
        Developing: "Waktu lebih singkat karena kamu sudah mulai mengembangkan keahlian ini.",
        Developed: "Waktu difokuskan untuk meninjau dan memperkuat hasil yang sudah kamu miliki."
    };

    return {
        id: `p${number}-${type.toLowerCase()}`,
        priority: number,
        skill: priority.skill,
        type,
        title,
        estimate: detail.estimate[status] || detail.estimate.Missing,
        estimateExplanation:
            estimateExplanations[status] || estimateExplanations.Missing,
        doneWhen: detail.doneWhen(priority.skill),
    };
}

function getPace() {
    const semester = Number(profile.semester || 0);

    if (semester >= 6) {
        return {
            label: "Dipercepat",
            duration: "1–2 minggu per prioritas"
        };
    }

    if (semester >= 3) {
        return {
            label: "Terfokus",
            duration: "2–3 minggu per prioritas"
        };
    }

    return {
        label: "Fondasi",
        duration: "3–4 minggu per prioritas"
    };
}

function buildRoadmap() {
    const priorities = result.priorityGaps.slice(0, 3);
    const tasks = [];

    priorities.forEach(function (priority, index) {
        const number = index + 1;
        const actions = createActions(priority.skill);

        const learnTask = createTask(priority, number, "Pelajari", actions.learn);
        learnTask.id = `p${number}-learn`;
        tasks.push(learnTask);

        const applyTask = createTask(priority, number, "Terapkan", actions.apply);
        applyTask.id = `p${number}-apply`;
        tasks.push(applyTask);

        const proveTask = createTask(priority, number, "Buktikan", actions.prove);
        proveTask.id = `p${number}-prove`;
        tasks.push(proveTask);
    });

    return {
        careerId: result.careerId,
        careerName: result.careerName,
        alignment: result.alignment,
        priorities: priorities,
        tasks: tasks,
        pace: getPace(),

        signature:
            result.careerId +
            "|" +
            (assessment.updatedAt || "no-date"),

        assessmentUpdatedAt: assessment.updatedAt || null,

        generatedAt: new Date().toISOString()
    };
}

function renderRoadmap(data) {
    document.getElementById("roadmapCareer").textContent =
        data.careerName;

    document.getElementById("roadmapAlignment").textContent =
        `${data.alignment}%`;

    document.getElementById("roadmapPriorityCount").textContent =
        data.priorities.length;

    document.getElementById("roadmapPace").textContent =
        data.pace.label;

    const education = profile.educationLevel || "Mahasiswa";

    const semester = profile.semester
        ? `Semester ${profile.semester}`
        : "Semester -";

    document.getElementById("roadmapProfile").textContent =
        `${education} • ${semester}`;

    showNextAction(data);
    showPriorities(data);
    showEvidenceMessage();
}

function showNextAction(data) {
    const title = document.getElementById("nextActionTitle");
    const description =
        document.getElementById("nextActionDescription");

    if (data.tasks.length > 0) {
        title.textContent = data.tasks[0].title;

        description.textContent =
            `${data.tasks[0].skill} • ${data.pace.duration}`;

        return;
    }

    title.textContent = "Perkuat buktimu";

    description.textContent =
        "Semua keahlianmu sudah mencapai target.";
}

function showPriorities(data) {
    const roadmapList =
        document.getElementById("roadmapList");

    roadmapList.innerHTML = "";

    const statusNames = {
        Developed: "Sudah Dikuasai",
        Developing: "Sedang Dikembangkan",
        Missing: "Belum Dimiliki"
    };

    function renderStep(task, number) {
        return `
            <div class="roadmap-step">
                <span class="roadmap-step-number">${number}</span>
                <span class="roadmap-step-type">${task.type.toUpperCase()}</span>
                <h3>${task.title}</h3>
                <p class="roadmap-step-meta"><strong>Estimasi belajar awal:</strong> ${task.estimate}</p>
                <p class="roadmap-step-meta">${task.estimateExplanation}</p>
                <p><strong>Selesai jika:</strong> ${task.doneWhen}</p>
            </div>
        `;
    }

    data.priorities.forEach(function (priority, index) {
        const status =
            statusNames[priority.status] || priority.status;
        const priorityTasks = data.tasks.filter(function (task) {
            return task.priority === index + 1;
        });

        const card = document.createElement("article");
        card.className = "roadmap-track";

        card.innerHTML = `
            <div class="roadmap-priority">
                <div class="priority-index">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <span>PRIORITAS</span>

                <strong>${priority.skill}</strong>

                <span class="priority-gap-status ${priority.status.toLowerCase()}">
                    ${status}
                </span>
            </div>

            <div class="roadmap-steps">
                <p class="roadmap-skill-definition">
                    <strong>Apa itu ${priority.skill}?</strong>
                    ${getSkillDescription(priority.skill)}
                </p>

                ${priorityTasks.map(function (task, taskIndex) {
                    return renderStep(task, taskIndex + 1);
                }).join("")}
            </div>
        `;

        roadmapList.appendChild(card);
    });
}

function showEvidenceMessage() {
    const message =
        document.getElementById("evidenceBoosterText");

    const missingEvidence = result.skills.filter(
        function (skill) {
            return !skill.hasEvidence;
        }
    );

    if (missingEvidence.length === 0) {
        message.textContent =
            "Semua keahlian memiliki referensi yang kamu catat sendiri. Pathly belum memverifikasinya.";

        return;
    }

    const names = missingEvidence
        .slice(0, 3)
        .map(function (skill) {
            return skill.skill;
        })
        .join(", ");

    message.textContent =
        `Belum ada referensi untuk: ${names}. Kamu tetap dapat melanjutkan; tambahkan catatan saat memiliki hasil yang relevan.`;
}

async function startRoadmap() {
    const container =
        document.querySelector(".roadmap-container");

    if (!result) {
        container.innerHTML = `
            <div class="roadmap-error pathly-empty-state">
                <h2>Data peta jalan tidak ditemukan.</h2>

                <p>
                    Selesaikan asesmen terlebih dahulu.
                </p>

                <a
                    href="assessment.html"
                    class="btn btn-primary"
                >
                    Buka Asesmen
                </a>
            </div>
        `;

        return;
    }

    const roadmapData = buildRoadmap();

    const { data, error } = await saveRoadmapRecord(roadmapData);

    if (error || !data?.id) {
        container.innerHTML = `
            <div class="roadmap-error pathly-error-state">
                <h2>Roadmap belum berhasil disimpan.</h2>
                <p>Periksa koneksi lalu muat ulang halaman ini.</p>
                <a href="roadmap.html" class="btn btn-primary">
                    Coba Lagi
                </a>
            </div>
        `;
        return;
    }

    localStorage.setItem(
        "pathlyRoadmapData",
        JSON.stringify(roadmapData)
    );
    localStorage.setItem("pathlyRoadmapId", data.id);

    renderRoadmap(roadmapData);
}

startRoadmap();
