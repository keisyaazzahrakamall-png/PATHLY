import {
    activateCareerTarget,
    getCareerHistory,
    saveTaskProgress
} from "./lib/user-data.js";

const result = window.PATHLY_SCORING_RESULT;

let roadmap = null;
let completedTasks = [];
const roadmapId = localStorage.getItem("pathlyRoadmapId");
const activeCareerId = localStorage.getItem("pathlyCareerTarget");

try {
    roadmap = JSON.parse(
        localStorage.getItem("pathlyRoadmapData")
    );

    completedTasks =
        JSON.parse(
            localStorage.getItem("pathlyCompletedTasks")
        ) || [];
} catch (error) {
    roadmap = null;
    completedTasks = [];
}

// Memastikan completedTasks berbentuk array
if (!Array.isArray(completedTasks)) {
    completedTasks = [];
}

function renderDashboard() {
    if (!result || !roadmap) {
        document.getElementById(
            "myPathContainer"
        ).innerHTML = `
            <div class="my-path-error pathly-empty-state">
                <h2>Data belum tersedia.</h2>

                <p>
                    Selesaikan asesmen dan buat roadmap terlebih dahulu.
                </p>

                <a
                    href="roadmap.html"
                    class="btn btn-primary"
                >
                    Buat Roadmap
                </a>
            </div>
        `;

        return;
    }

    showSummary();
    showNextTask();
    showTasks();
    showSkills();
}

function showSummary() {
    const totalTasks = roadmap.tasks.length;

    const finishedTasks = completedTasks.length;

    let progress = 0;

    if (totalTasks > 0) {
        progress = Math.round(
            (finishedTasks / totalTasks) * 100
        );
    }

    document.getElementById(
        "dashboardCareer"
    ).textContent = result.careerName;

    document.getElementById(
        "dashboardAlignment"
    ).textContent = `${result.alignment}%`;

    document.getElementById(
        "dashboardDeveloped"
    ).textContent =
        `${result.developedCount}/${result.totalSkills}`;

    document.getElementById(
        "dashboardEvidence"
    ).textContent =
        `${result.evidenceCount}/${result.totalSkills}`;

    document.getElementById(
        "dashboardProgress"
    ).textContent = `${progress}%`;

    document.getElementById(
        "dashboardProgressText"
    ).textContent =
        `${finishedTasks} dari ${totalTasks} tugas selesai`;

    document.getElementById(
        "pathProgressPercent"
    ).textContent = `${progress}%`;

    document.getElementById(
        "pathProgressValue"
    ).style.width = `${progress}%`;
}

function showNextTask() {
    const nextTask = roadmap.tasks.find(
        function (task) {
            return !completedTasks.includes(task.id);
        }
    );

    const title =
        document.getElementById("dashboardNextTitle");

    const information =
        document.getElementById("dashboardNextMeta");

    if (nextTask) {
        title.textContent = nextTask.title;

        information.textContent =
            `${nextTask.skill} • ${nextTask.type} • ${nextTask.estimate || "Estimasi belum tersedia"}`;
    } else {
        title.textContent = "Semua tugas selesai";

        information.textContent =
            "Kamu telah menyelesaikan roadmap.";
    }
}

function showTasks() {
    const container =
        document.getElementById("dashboardRoadmap");
    const saveMessage =
        document.getElementById("taskSaveMessage");

    container.innerHTML = "";

    const taskGuidance = {
        Pelajari: "Pahami konsepnya dan catat sumber belajar yang kamu gunakan.",
        Terapkan: "Gunakan kemampuan ini pada latihan, tugas, atau proyek kecil.",
        Buktikan: "Simpan hasilnya sebagai bukti yang dapat ditunjukkan di portofolio."
    };

    const groupedTasks = roadmap.tasks.reduce(function (groups, task) {
        const key = `${task.priority}-${task.skill}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(task);
        return groups;
    }, new Map());

    groupedTasks.forEach(function (tasks) {
        const firstTask = tasks[0];
        const priority = document.createElement("article");
        priority.className = "dashboard-priority";
        priority.innerHTML = `
            <div class="dashboard-priority-header">
                <div>
                    <span>PRIORITAS ${String(firstTask.priority).padStart(2, "0")}</span>
                    <h3>${firstTask.skill}</h3>
                </div>
                <strong>${tasks.filter(function (task) {
                    return completedTasks.includes(task.id);
                }).length}/${tasks.length} selesai</strong>
            </div>
            <div class="dashboard-task-list"></div>
        `;

        const taskList = priority.querySelector(".dashboard-task-list");

        tasks.forEach(function (task) {
            const checked = completedTasks.includes(task.id);

            const taskElement = document.createElement("label");

            taskElement.className = checked
                ? "dashboard-task completed"
                : "dashboard-task";

            taskElement.innerHTML = `
                <input
                    class="task-check"
                    type="checkbox"
                    ${checked ? "checked" : ""}
                >

                <span class="task-type">${task.type}</span>

                <span class="task-copy">
                    <strong class="task-title">${task.title}</strong>
                    <small>${taskGuidance[task.type] || "Selesaikan langkah ini sesuai kemampuanmu."}</small>
                    <small><strong>Estimasi belajar awal:</strong> ${task.estimate || "Belum tersedia"}</small>
                    <small><strong>Selesai jika:</strong> ${task.doneWhen || "Hasil langkah ini sudah disimpan."}</small>
                </span>
            `;

            const checkbox = taskElement.querySelector("input");

            checkbox.addEventListener("change", async function () {
                checkbox.disabled = true;
                saveMessage.textContent = "Menyimpan perubahan...";
                const saved = await updateTask(task.id, checkbox.checked);

                if (!saved) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.disabled = false;
                    saveMessage.textContent =
                        "Perubahan belum tersimpan. Periksa koneksi lalu coba lagi.";
                    return;
                }

                document.getElementById("taskSaveMessage").textContent = checkbox.checked
                    ? "Tugas ditandai selesai."
                    : "Tanda selesai dibatalkan.";
            });

            taskList.appendChild(taskElement);
        });

        container.appendChild(priority);
    });
}

async function updateTask(taskId, checked) {
    if (!roadmapId) {
        return false;
    }

    const { error } = await saveTaskProgress(
        roadmapId,
        taskId,
        checked
    );

    if (error) {
        return false;
    }

    if (checked) {
        if (!completedTasks.includes(taskId)) {
            completedTasks.push(taskId);
        }
    } else {
        completedTasks = completedTasks.filter(
            function (id) {
                return id !== taskId;
            }
        );
    }

    localStorage.setItem(
        "pathlyCompletedTasks",
        JSON.stringify(completedTasks)
    );
    renderDashboard();
    return true;
}

function showSkills() {
    const container =
        document.getElementById("dashboardSkills");

    container.innerHTML = "";

    result.skills.forEach(function (skill) {
        const row =
            document.createElement("div");

        row.className = "dashboard-skill";

        row.innerHTML = `
            <strong>${skill.skill}</strong>

            <span>
                Saat Ini: ${skill.userLevel}
            </span>

            <span>
                Target: ${skill.targetLevel}
            </span>

            <span>
                Referensi: ${skill.hasEvidence ? "Dicatat" : "Belum dicatat"}
            </span>
        `;

        container.appendChild(row);
    });
}

function formatHistoryDate(value) {
    if (!value) return "Tanggal belum tersedia";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Tanggal belum tersedia";

    return `Diperbarui ${date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })}`;
}

function getCareerDestination(career) {
    if (career.hasRoadmap) return "my-path.html";
    if (career.completed) return "results.html";
    return "assessment.html";
}

function createCareerHistoryItem(career) {
    const isActive = career.careerId === activeCareerId;
    const item = document.createElement("article");
    item.className = isActive
        ? "career-history-item active"
        : "career-history-item";

    const information = document.createElement("div");
    information.className = "career-history-info";

    const status = document.createElement("span");
    status.className = "career-history-status";
    status.textContent = isActive
        ? "Target aktif"
        : career.hasRoadmap
            ? "Roadmap tersedia"
            : career.completed
                ? "Asesmen selesai"
                : "Asesmen belum selesai";

    const name = document.createElement("h3");
    name.textContent = career.careerName;

    const updatedAt = document.createElement("p");
    updatedAt.textContent = formatHistoryDate(career.updatedAt);

    information.append(status, name, updatedAt);

    const button = document.createElement("button");
    button.type = "button";
    button.className = isActive
        ? "btn btn-secondary career-history-button active"
        : "btn btn-primary career-history-button";
    button.textContent = isActive ? "Sedang Digunakan" : "Jadikan Target";
    button.disabled = isActive;

    if (!isActive) {
        button.addEventListener("click", async function () {
            const historyButtons = document.querySelectorAll(
                ".career-history-button"
            );
            historyButtons.forEach(function (historyButton) {
                historyButton.disabled = true;
            });
            button.textContent = "Mengganti Target...";

            const { error } = await activateCareerTarget(career);

            if (error) {
                historyButtons.forEach(function (historyButton) {
                    historyButton.disabled = historyButton.classList.contains("active");
                });
                button.textContent = "Coba Lagi";
                document.getElementById("careerHistoryMessage").textContent =
                    "Target belum berhasil diganti. Periksa koneksi lalu coba lagi.";
                document.getElementById("careerHistoryMessage").classList.add("error");
                return;
            }

            window.location.assign(getCareerDestination(career));
        });
    }

    item.append(information, button);
    return item;
}

async function showCareerHistory() {
    const list = document.getElementById("careerHistoryList");
    const message = document.getElementById("careerHistoryMessage");
    if (!list || !message) return;

    const { data, error } = await getCareerHistory();

    if (error) {
        message.textContent =
            "Riwayat karier belum dapat dimuat. Data target aktifmu tetap aman.";
        message.classList.add("error");
        return;
    }

    if (!data.length) {
        message.textContent = "Belum ada karier lain yang pernah dinilai.";
        return;
    }

    message.textContent =
        "Satu target digunakan dalam satu waktu. Mengganti target tidak menghapus data lama.";
    list.replaceChildren(...data.map(createCareerHistoryItem));
}

function setupTabs() {
    const tabs =
        document.querySelectorAll(".dashboard-tab");

    tabs.forEach(function (tab) {
        tab.addEventListener(
            "click",
            function () {
                document
                    .querySelector(".dashboard-tab.active")
                    .classList.remove("active");

                document
                    .querySelector(".dashboard-panel.active")
                    .classList.remove("active");

                tab.classList.add("active");

                const panelId =
                    `${tab.dataset.tab}Panel`;

                document
                    .getElementById(panelId)
                    .classList.add("active");
            }
        );
    });
}

renderDashboard();
setupTabs();
showCareerHistory();
