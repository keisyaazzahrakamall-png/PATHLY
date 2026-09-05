const result = window.PATHLY_SCORING_RESULT;
const container = document.getElementById("resultsContainer");

const statusLabels = {
  Developed: "Sudah Dikuasai",
  Developing: "Sedang Dikembangkan",
  Missing: "Belum Dimiliki"
};

function getElement(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAlignmentMessage(score) {
  if (score >= 80) {
    return {
      title: "Kamu telah memenuhi sebagian besar kebutuhan.",
      description:
        "Fokus pada kesenjangan yang tersisa dan lengkapi portofoliomu."
    };
  }

  if (score >= 50) {
    return {
      title: "Kamu sudah memiliki fondasi untuk dikembangkan.",
      description:
        "Beberapa kemampuan sudah terpenuhi dan sisanya masih perlu ditingkatkan."
    };
  }

  return {
    title: "Kamu memiliki area yang jelas untuk dikembangkan.",
    description: "Fokuslah pada kesenjangan terpenting secara bertahap."
  };
}

function showError() {
  container.innerHTML = `
    <div class="results-error pathly-empty-state">
      <h2>Hasil asesmen tidak ditemukan.</h2>
      <p>Selesaikan asesmen sebelum membuka halaman hasil.</p>
      <a href="assessment.html" class="btn btn-primary">Buka Asesmen</a>
    </div>
  `;
}

function showSummary() {
  const score = `${result.alignment}%`;
  const message = getAlignmentMessage(result.alignment);

  getElement("resultCareerName").textContent = result.careerName;
  getElement("alignmentScore").textContent = score;
  getElement("alignmentBarPercent").textContent = score;
  getElement("alignmentBarValue").style.width = score;
  getElement("scoreCircle").style.setProperty(
    "--score-angle",
    `${result.alignment * 3.6}deg`
  );
  getElement("alignmentHeadline").textContent = message.title;
  getElement("alignmentDescription").textContent = message.description;
  getElement("developedCount").textContent = result.developedCount;
  getElement("developingCount").textContent = result.developingCount;
  getElement("missingCount").textContent = result.missingCount;
  getElement("evidenceCount").textContent =
    `${result.evidenceCount}/${result.totalSkills}`;
}

function showPriorities() {
  const priorities = result.priorityGaps.slice(0, 3);
  const priorityGrid = getElement("priorityGrid");

  if (priorities.length === 0) {
    priorityGrid.innerHTML = `
      <article class="priority-card">
        <span class="priority-rank">✓</span>
        <h3>Semua tingkat target telah tercapai</h3>
        <p class="priority-meta">Terus tingkatkan kemampuan dan catat hasil kerjamu.</p>
      </article>
    `;
    return;
  }

  priorityGrid.innerHTML = priorities
    .map(function (skill, index) {
      return `
        <article class="priority-card">
          <span class="priority-rank">${index + 1}</span>
          <h3>${skill.skill}</h3>
          <p class="priority-meta">
            Saat ini ${skill.userLevel}/${skill.targetLevel} • ${skill.importance}
          </p>
          <span class="priority-status ${skill.status.toLowerCase()}">
            ${statusLabels[skill.status] || skill.status}
          </span>
        </article>
      `;
    })
    .join("");
}

function showSkills() {
  getElement("skillResultList").innerHTML = result.skills
    .map(function (skill) {
      const evidence = skill.hasEvidence ? "Dicatat" : "Belum dicatat";
      const proof = skill.evidenceDetail
        ? `<div class="evidence-proof-note">"${escapeHtml(skill.evidenceDetail)}"</div>`
        : "";

      return `
        <div class="skill-result-row">
          <div class="skill-result-name">
            <strong>${skill.skill}</strong>
            <small>${skill.importance} • Bobot ${skill.weight}</small>
          </div>
          <div class="level-display">Saat ini: ${skill.userLevel}</div>
          <div class="level-display">Target: ${skill.targetLevel}</div>
          <span class="status-badge ${skill.status.toLowerCase()}">
            ${statusLabels[skill.status] || skill.status}
          </span>
          <div class="evidence-display">
            Referensi: ${evidence}
            ${proof}
          </div>
        </div>
      `;
    })
    .join("");
}

if (!result) {
  showError();
} else {
  showSummary();
  showPriorities();
  showSkills();
}
