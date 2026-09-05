function coreSkill(skill) {
    return {
        skill: skill,
        importance: "Inti",
        weight: 3,
        targetLevel: 2
    };
}

function importantSkill(skill) {
    return {
        skill: skill,
        importance: "Penting",
        weight: 2,
        targetLevel: 1
    };
}

window.PATHLY_REQUIREMENTS = {
    "data-analyst": [
        coreSkill("SQL"),
        coreSkill("Excel / Google Sheets"),
        coreSkill("Analisis Data"),
        coreSkill("BI / Visualisasi Data"),
        coreSkill("Berpikir Analitis"),
        importantSkill("Komunikasi")
    ],

    "business-analyst": [
        coreSkill("Analisis Kebutuhan"),
        coreSkill("BRD / FSD"),
        coreSkill("Pemetaan Proses"),
        coreSkill("Komunikasi Pemangku Kepentingan"),
        importantSkill("UAT"),
        importantSkill("SDLC / Agile")
    ],

    "frontend-developer": [
        coreSkill("HTML / CSS"),
        coreSkill("JavaScript"),
        coreSkill("React / Framework Modern"),
        coreSkill("Desain Responsif"),
        importantSkill("Integrasi API"),
        importantSkill("Git")
    ],

    "uiux-designer": [
        coreSkill("Riset UX"),
        coreSkill("Alur Pengguna"),
        coreSkill("Wireframing"),
        coreSkill("Pembuatan Purwarupa"),
        coreSkill("Kemudahan Penggunaan"),
        importantSkill("Figma"),
        importantSkill("Desain Visual / UI"),
        importantSkill("Kolaborasi")
    ],

    "digital-marketing": [
        coreSkill("Analitik"),
        coreSkill("SEO / SEM"),
        coreSkill("Optimalisasi Kampanye"),
        coreSkill("Konten"),
        coreSkill("Berpikir Berbasis Data"),
        importantSkill("Google Ads"),
        importantSkill("Meta Ads")
    ]
};
