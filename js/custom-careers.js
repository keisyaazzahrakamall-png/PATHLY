import { saveCareerJourney } from "./lib/user-data.js";
import {
    CUSTOM_CAREERS_STORAGE_KEY,
    LEGACY_CUSTOM_CAREER_STORAGE_KEY,
    coerceCustomCareerCollection,
    removeCustomCareer,
    upsertCustomCareer
} from "./lib/custom-career-collection.js";
import {
    containsUnsafeCareerInput,
    sanitizeCareerName
} from "./lib/input-safety.js";

(function () {
    
    function createCareer(
        name,
        symbol,
        description,
        focus,
        skills,
        preferences
    ) {
        return {
            name: name,
            symbol: symbol,
            description: description,
            focus: focus,
            skills: skills,
            preferences: preferences
        };
    }

    function createGroup(
        id,
        name,
        aliases,
        keywords,
        suggestions
    ) {
        return {
            id: id,
            name: name,
            aliases: aliases,
            keywords: keywords,
            suggestions: suggestions
        };
    }

    const careerGroups = [
        createGroup(
            "hr",
            "Human Resources",
            ["hr", "human resources", "sumber daya manusia", "sdm"],
            ["recruit", "talent", "people", "employee", "hr"],
            [
                createCareer(
                    "Talent Acquisition Specialist",
                    "TA",
                    "Mencari dan menilai kandidat untuk kebutuhan organisasi.",
                    "Sourcing, screening, wawancara, dan employer branding",
                    [
                        "Proses Rekrutmen",
                        "Candidate Screening",
                        "Teknik Wawancara",
                        "Talent Sourcing",
                        "Employer Branding",
                        "Komunikasi"
                    ],
                    ["people", "communication"]
                ),

                createCareer(
                    "Learning & Development Specialist",
                    "LD",
                    "Merancang program pengembangan kemampuan karyawan.",
                    "Pelatihan, fasilitasi, evaluasi, dan pengembangan",
                    [
                        "Training Needs Analysis",
                        "Desain Pembelajaran",
                        "Fasilitasi",
                        "Evaluasi Pelatihan",
                        "Manajemen Program",
                        "Komunikasi"
                    ],
                    ["growth", "people"]
                ),

                createCareer(
                    "HR Operations Specialist",
                    "HO",
                    "Mengelola administrasi dan proses operasional SDM.",
                    "Administrasi SDM, HRIS, kebijakan, dan layanan karyawan",
                    [
                        "Administrasi SDM",
                        "HRIS",
                        "Kebijakan Karyawan",
                        "Payroll Dasar",
                        "Manajemen Dokumen",
                        "Ketelitian"
                    ],
                    ["process", "detail"]
                ),

                createCareer(
                    "People Analytics Specialist",
                    "PA",
                    "Menggunakan data karyawan untuk mendukung keputusan.",
                    "Analisis data SDM, dashboard, dan metrik tenaga kerja",
                    [
                        "Analisis Data SDM",
                        "Excel / Google Sheets",
                        "Visualisasi Data",
                        "HR Metrics",
                        "Berpikir Analitis",
                        "Komunikasi Wawasan"
                    ],
                    ["data", "analysis"]
                )
            ]
        ),


        createGroup(
            "technology",
            "Teknologi Informasi",
            [
                "it",
                "teknologi",
                "teknologi informasi",
                "software",
                "programming"
            ],
            [
                "developer",
                "engineer",
                "programmer",
                "cyber",
                "cloud",
                "software",
                "it"
            ],
            [
                createCareer(
                    "Software Engineer",
                    "SE",
                    "Membangun, menguji, dan memelihara perangkat lunak.",
                    "Pemrograman, pengujian, dan pengembangan aplikasi",
                    [
                        "Programming Fundamentals",
                        "Struktur Data",
                        "Git",
                        "Software Testing",
                        "System Design Dasar",
                        "Problem Solving"
                    ],
                    ["build", "analysis"]
                ),

                createCareer(
                    "Cybersecurity Analyst",
                    "CA",
                    "Melindungi sistem dan data dari risiko keamanan.",
                    "Keamanan jaringan, monitoring, dan respons insiden",
                    [
                        "Network Security",
                        "Threat Analysis",
                        "Incident Response",
                        "Security Monitoring",
                        "Risk Assessment",
                        "Technical Reporting"
                    ],
                    ["analysis", "detail"]
                ),

                createCareer(
                    "Cloud Engineer",
                    "CE",
                    "Membangun dan mengelola infrastruktur cloud.",
                    "Cloud, deployment, otomatisasi, dan jaringan",
                    [
                        "Cloud Fundamentals",
                        "Linux",
                        "Networking",
                        "Infrastructure as Code",
                        "CI/CD",
                        "Monitoring"
                    ],
                    ["build", "process"]
                ),

                createCareer(
                    "IT Business Analyst",
                    "IB",
                    "Menghubungkan kebutuhan bisnis dengan solusi sistem.",
                    "Kebutuhan, proses bisnis, dokumentasi, dan komunikasi",
                    [
                        "Analisis Kebutuhan",
                        "Pemetaan Proses",
                        "BRD / FSD",
                        "UAT",
                        "SDLC",
                        "Komunikasi Pemangku Kepentingan"
                    ],
                    ["communication", "analysis"]
                )
            ]
        ),


        createGroup(
            "data",
            "Data",
            ["data", "analisis data", "data science"],
            [
                "data",
                "analytics",
                "scientist",
                "machine learning",
                "business intelligence"
            ],
            [
                createCareer(
                    "Data Analyst",
                    "DA",
                    "Mengolah data menjadi wawasan untuk keputusan.",
                    "Analisis, pelaporan, visualisasi, dan wawasan bisnis",
                    [
                        "SQL",
                        "Excel / Google Sheets",
                        "Analisis Data",
                        "Visualisasi Data",
                        "Berpikir Analitis",
                        "Komunikasi"
                    ],
                    ["data", "analysis"]
                ),

                createCareer(
                    "Data Scientist",
                    "DS",
                    "Menggunakan statistik dan machine learning untuk membuat prediksi.",
                    "Statistik, pemrograman, machine learning, dan eksperimen",
                    [
                        "Python",
                        "Statistik",
                        "Data Preparation",
                        "Machine Learning",
                        "Model Evaluation",
                        "Data Storytelling"
                    ],
                    ["data", "build"]
                ),

                createCareer(
                    "Business Intelligence Analyst",
                    "BI",
                    "Membangun laporan dan dashboard performa bisnis.",
                    "Data warehouse, dashboard, KPI, dan analisis",
                    [
                        "SQL",
                        "Data Modeling",
                        "BI Tools",
                        "Dashboard Design",
                        "Business Metrics",
                        "Stakeholder Communication"
                    ],
                    ["data", "communication"]
                ),

                createCareer(
                    "Machine Learning Engineer",
                    "ML",
                    "Menerapkan model machine learning ke dalam produk.",
                    "Model ML, deployment, pipeline data, dan monitoring",
                    [
                        "Python",
                        "Machine Learning",
                        "Data Pipeline",
                        "Model Deployment",
                        "API",
                        "MLOps Dasar"
                    ],
                    ["build", "data"]
                )
            ]
        ),


        createGroup(
            "marketing",
            "Marketing",
            ["marketing", "pemasaran", "digital marketing"],
            [
                "marketing",
                "brand",
                "content",
                "seo",
                "social media",
                "campaign"
            ],
            [
                createCareer(
                    "Digital Marketing Specialist",
                    "DM",
                    "Merencanakan dan mengoptimalkan kampanye digital.",
                    "Iklan digital, analitik, konten, dan optimalisasi",
                    [
                        "Digital Campaign",
                        "Google Ads",
                        "Meta Ads",
                        "Analitik",
                        "SEO / SEM",
                        "Optimalisasi Kampanye"
                    ],
                    ["creative", "data"]
                ),

                createCareer(
                    "Content Strategist",
                    "CS",
                    "Menyusun strategi konten sesuai kebutuhan audiens.",
                    "Riset audiens, konten, storytelling, dan evaluasi",
                    [
                        "Content Strategy",
                        "Audience Research",
                        "Copywriting",
                        "Storytelling",
                        "Content Calendar",
                        "Content Analytics"
                    ],
                    ["creative", "communication"]
                ),

                createCareer(
                    "Brand Marketing Specialist",
                    "BM",
                    "Membangun identitas dan persepsi sebuah merek.",
                    "Brand positioning, riset pasar, dan kampanye",
                    [
                        "Brand Strategy",
                        "Market Research",
                        "Campaign Planning",
                        "Consumer Insight",
                        "Presentation",
                        "Project Management"
                    ],
                    ["creative", "communication"]
                ),

                createCareer(
                    "Performance Marketing Specialist",
                    "PM",
                    "Mengelola kampanye berdasarkan target performa.",
                    "Paid ads, conversion, eksperimen, dan anggaran",
                    [
                        "Paid Advertising",
                        "Conversion Tracking",
                        "A/B Testing",
                        "Campaign Analytics",
                        "Budget Management",
                        "Data-driven Thinking"
                    ],
                    ["data", "analysis"]
                )
            ]
        ),


        createGroup(
            "finance",
            "Keuangan",
            ["finance", "keuangan", "accounting", "akuntansi"],
            [
                "finance",
                "financial",
                "account",
                "audit",
                "tax",
                "investment"
            ],
            [
                createCareer(
                    "Financial Analyst",
                    "FA",
                    "Menganalisis data keuangan untuk keputusan bisnis.",
                    "Analisis laporan, budgeting, dan forecasting",
                    [
                        "Financial Analysis",
                        "Excel",
                        "Financial Modeling",
                        "Budgeting",
                        "Forecasting",
                        "Business Communication"
                    ],
                    ["data", "analysis"]
                ),

                createCareer(
                    "Accountant",
                    "AC",
                    "Mencatat dan melaporkan transaksi keuangan.",
                    "Pencatatan, rekonsiliasi, pelaporan, dan pajak",
                    [
                        "Accounting Principles",
                        "Journal Entry",
                        "Financial Reporting",
                        "Reconciliation",
                        "Tax Fundamentals",
                        "Ketelitian"
                    ],
                    ["detail", "process"]
                ),

                createCareer(
                    "Internal Auditor",
                    "IA",
                    "Mengevaluasi kontrol, proses, dan risiko organisasi.",
                    "Audit, kontrol internal, risiko, dan kepatuhan",
                    [
                        "Audit Fundamentals",
                        "Internal Control",
                        "Risk Assessment",
                        "Data Analysis",
                        "Compliance",
                        "Audit Reporting"
                    ],
                    ["detail", "analysis"]
                ),

                createCareer(
                    "Investment Analyst",
                    "IN",
                    "Menilai peluang investasi berdasarkan data pasar.",
                    "Riset, valuasi, analisis pasar, dan risiko",
                    [
                        "Investment Research",
                        "Valuation",
                        "Financial Statements",
                        "Market Analysis",
                        "Risk Analysis",
                        "Report Writing"
                    ],
                    ["data", "analysis"]
                )
            ]
        ),


        createGroup(
            "design",
            "Desain",
            ["design", "desain", "creative", "kreatif"],
            [
                "design",
                "designer",
                "creative",
                "visual",
                "ui",
                "ux"
            ],
            [
                createCareer(
                    "UI/UX Designer",
                    "UX",
                    "Merancang pengalaman digital yang mudah digunakan.",
                    "Riset, alur pengguna, wireframe, dan pengujian",
                    [
                        "Figma",
                        "Riset UX",
                        "Alur Pengguna",
                        "Wireframing",
                        "Pembuatan Purwarupa",
                        "Usability Testing"
                    ],
                    ["creative", "analysis"]
                ),

                createCareer(
                    "Graphic Designer",
                    "GD",
                    "Mengomunikasikan ide melalui desain visual.",
                    "Layout, tipografi, warna, dan produksi desain",
                    [
                        "Visual Design",
                        "Typography",
                        "Layout",
                        "Color Theory",
                        "Adobe / Design Tools",
                        "Creative Communication"
                    ],
                    ["creative", "detail"]
                ),

                createCareer(
                    "Product Designer",
                    "PD",
                    "Merancang produk berdasarkan kebutuhan pengguna dan bisnis.",
                    "Riset, interaction design, dan prototyping",
                    [
                        "Product Thinking",
                        "User Research",
                        "Interaction Design",
                        "Prototyping",
                        "Design System",
                        "Collaboration"
                    ],
                    ["creative", "build"]
                ),

                createCareer(
                    "Motion Graphic Designer",
                    "MG",
                    "Membuat komunikasi visual bergerak.",
                    "Animasi, editing, dan storytelling visual",
                    [
                        "Motion Design",
                        "Animation Principles",
                        "Video Editing",
                        "Visual Storytelling",
                        "Compositing",
                        "Creative Tools"
                    ],
                    ["creative", "build"]
                )
            ]
        ),


        createGroup(
            "business",
            "Bisnis dan Manajemen",
            ["business", "bisnis", "management", "manajemen"],
            [
                "business",
                "manager",
                "management",
                "product",
                "sales",
                "operation"
            ],
            [
                createCareer(
                    "Business Development Specialist",
                    "BD",
                    "Mencari peluang pertumbuhan dan kemitraan bisnis.",
                    "Riset pasar, prospek, negosiasi, dan kemitraan",
                    [
                        "Market Research",
                        "Lead Generation",
                        "Partnership",
                        "Negotiation",
                        "Business Presentation",
                        "Relationship Management"
                    ],
                    ["communication", "growth"]
                ),

                createCareer(
                    "Product Manager",
                    "PM",
                    "Mengarahkan pengembangan sebuah produk.",
                    "Strategi, riset pengguna, prioritas, dan koordinasi",
                    [
                        "Product Strategy",
                        "User Research",
                        "Roadmapping",
                        "Prioritization",
                        "Data Analysis",
                        "Stakeholder Management"
                    ],
                    ["build", "communication"]
                ),

                createCareer(
                    "Operations Specialist",
                    "OS",
                    "Meningkatkan efektivitas proses operasional.",
                    "Proses, koordinasi, kualitas, dan dokumentasi",
                    [
                        "Process Management",
                        "SOP",
                        "Project Coordination",
                        "Quality Control",
                        "Data Reporting",
                        "Problem Solving"
                    ],
                    ["process", "detail"]
                ),

                createCareer(
                    "Sales Executive",
                    "SA",
                    "Membangun hubungan dengan calon pelanggan.",
                    "Prospecting, presentasi, negosiasi, dan pipeline",
                    [
                        "Prospecting",
                        "Needs Analysis",
                        "Sales Presentation",
                        "Negotiation",
                        "CRM",
                        "Relationship Building"
                    ],
                    ["people", "communication"]
                )
            ]
        ),


        createGroup(
            "education",
            "Pendidikan",
            ["education", "pendidikan", "teaching", "guru"],
            [
                "teacher",
                "lecturer",
                "trainer",
                "education",
                "learning",
                "guru",
                "dosen"
            ],
            [
                createCareer(
                    "Teacher",
                    "TE",
                    "Merancang dan memfasilitasi pembelajaran.",
                    "Perencanaan, pengajaran, asesmen, dan pengelolaan kelas",
                    [
                        "Lesson Planning",
                        "Teaching Methods",
                        "Classroom Management",
                        "Student Assessment",
                        "Communication",
                        "Learning Media"
                    ],
                    ["people", "growth"]
                ),

                createCareer(
                    "Instructional Designer",
                    "ID",
                    "Merancang materi dan pengalaman pembelajaran.",
                    "Learning design, media, asesmen, dan evaluasi",
                    [
                        "Learning Needs Analysis",
                        "Instructional Design",
                        "Curriculum Design",
                        "Learning Media",
                        "Assessment Design",
                        "Evaluation"
                    ],
                    ["creative", "growth"]
                ),

                createCareer(
                    "Corporate Trainer",
                    "CT",
                    "Memberikan pelatihan untuk meningkatkan kemampuan karyawan.",
                    "Fasilitasi, materi, presentasi, dan evaluasi",
                    [
                        "Training Delivery",
                        "Facilitation",
                        "Presentation",
                        "Training Materials",
                        "Participant Engagement",
                        "Training Evaluation"
                    ],
                    ["communication", "growth"]
                ),

                createCareer(
                    "Education Program Officer",
                    "EP",
                    "Mengelola program pendidikan dari awal hingga evaluasi.",
                    "Program, koordinasi, monitoring, dan kemitraan",
                    [
                        "Program Planning",
                        "Project Coordination",
                        "Monitoring & Evaluation",
                        "Stakeholder Communication",
                        "Reporting",
                        "Partnership"
                    ],
                    ["process", "people"]
                )
            ]
        )
    ];

    const preferenceOptions = [
        {
            id: "people",
            label: "Banyak berinteraksi dengan orang"
        },
        {
            id: "data",
            label: "Menganalisis data dan pola"
        },
        {
            id: "creative",
            label: "Menciptakan ide atau visual"
        },
        {
            id: "process",
            label: "Mengelola proses dengan teratur"
        },
        {
            id: "build",
            label: "Membangun produk atau solusi"
        },
        {
            id: "growth",
            label: "Membantu orang atau bisnis berkembang"
        }
    ];

    function normalize(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9/ &+-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function sanitizeCareerData(data) {
        const rawName = data?.career?.name;

        if (
            typeof rawName !== "string" ||
            containsUnsafeCareerInput(rawName)
        ) {
            return null;
        }

        const safeName = sanitizeCareerName(rawName);

        if (safeName.length < 2) {
            return null;
        }
        return buildCareer(safeName);
    }

    function createId(name) {
        const id = normalize(name)
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        return `custom-${id}`;
    }

    function createSymbol(name) {
        return name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(function (word) {
                return word[0].toUpperCase();
            })
            .join("");
    }

    function formatTitle(value) {
        const uppercaseTerms = [
            "hr",
            "it",
            "ui",
            "ux",
            "ui/ux",
            "seo",
            "sem",
            "qa"
        ];

        return value
            .trim()
            .split(/\s+/)
            .map(function (word) {
                if (uppercaseTerms.includes(word.toLowerCase())) {
                    return word.toUpperCase();
                }

                return (
                    word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase()
                );
            })
            .join(" ");
    }

    function findBroadGroup(input) {
        const normalizedInput = normalize(input);

        return careerGroups.find(function (group) {
            return group.aliases.includes(normalizedInput);
        });
    }

    function inferGroup(input) {
        const normalizedInput = normalize(input);

        return careerGroups.find(function (group) {
            const terms = group.aliases.concat(group.keywords);

            return terms.some(function (term) {
                return normalizedInput.includes(term);
            });
        });
    }

    function findBestTemplate(input, group) {
        if (!group) {
            return null;
        }

        const normalizedInput = normalize(input);

        const exactMatch = group.suggestions.find(
            function (suggestion) {
                return (
                    normalize(suggestion.name) === normalizedInput
                );
            }
        );

        if (exactMatch) {
            return exactMatch;
        }

        return group.suggestions.find(function (suggestion) {
            return normalize(suggestion.name)
                .split(" ")
                .some(function (word) {
                    return (
                        word.length > 4 &&
                        normalizedInput.includes(word)
                    );
                });
        });
    }

    function buildRequirements(skills) {
        return skills.map(function (skill, index) {
            const isCore = index < 4;

            return {
                skill: skill,
                importance: isCore ? "Inti" : "Penting",
                weight: isCore ? 3 : 2,
                targetLevel: isCore ? 2 : 1
            };
        });
    }

    function buildCareer(name, template) {
        const safeName = sanitizeCareerName(name);

        if (safeName.length < 2 || containsUnsafeCareerInput(name)) {
            return null;
        }

        const formattedName = formatTitle(safeName);

        const templateGroup = template
            ? careerGroups.find(function (group) {
                return group.suggestions.includes(template);
            })
            : null;

        const group =
            templateGroup || inferGroup(formattedName);

        const selectedTemplate =
            template || findBestTemplate(formattedName, group);

        const fallbackSkills = [
            `Pengetahuan Dasar ${formattedName}`,
            `Keahlian Teknis ${formattedName}`,
            "Pemecahan Masalah",
            "Komunikasi Profesional",
            "Manajemen Waktu",
            "Kolaborasi"
        ];

        const skills = selectedTemplate
            ? [...selectedTemplate.skills]
            : fallbackSkills;

        const career = {
            id: createId(formattedName),
            name: formattedName,
            category: group
                ? group.name.toUpperCase()
                : "PILIHANMU",
            symbol: selectedTemplate
                ? selectedTemplate.symbol
                : createSymbol(formattedName),
            description: selectedTemplate
                ? selectedTemplate.description
                : `Membangun kemampuan yang relevan untuk berkembang sebagai ${formattedName}.`,
            focus: selectedTemplate
                ? selectedTemplate.focus
                : "Pengetahuan bidang, kemampuan teknis, pemecahan masalah, dan komunikasi",
            skills: skills,
            isCustom: true
        };

        return {
            career: career,
            requirements: buildRequirements(skills)
        };
    }

    function readStoredCareers() {
        const storedCollection = localStorage.getItem(
            CUSTOM_CAREERS_STORAGE_KEY
        );
        const storedLegacyCareer = localStorage.getItem(
            LEGACY_CUSTOM_CAREER_STORAGE_KEY
        );
        const rawValue = storedCollection || storedLegacyCareer;

        if (!rawValue) {
            return {
                careers: [],
                needsMigration: false
            };
        }

        try {
            const parsedValue = JSON.parse(rawValue);
            const safeCareers = [];

            coerceCustomCareerCollection(parsedValue).forEach(
                function (careerData) {
                    const safeData = sanitizeCareerData(careerData);
                    const careerId = safeData?.career?.id;

                    if (
                        safeData &&
                        !safeCareers.some(function (item) {
                            return item.career.id === careerId;
                        })
                    ) {
                        safeCareers.push(safeData);
                    }
                }
            );

            return {
                careers: safeCareers,
                needsMigration:
                    Boolean(storedLegacyCareer) ||
                    JSON.stringify(
                        coerceCustomCareerCollection(parsedValue)
                    ) !== JSON.stringify(safeCareers)
            };
        } catch (error) {
            console.log(
                "Data karier kustom tidak dapat dibaca:",
                error
            );

            return {
                careers: [],
                needsMigration: true
            };
        }
    }

    function persistStoredCareers(careerCollection) {
        const safeCollection = coerceCustomCareerCollection(
            careerCollection
        );

        if (safeCollection.length) {
            localStorage.setItem(
                CUSTOM_CAREERS_STORAGE_KEY,
                JSON.stringify(safeCollection)
            );
        } else {
            localStorage.removeItem(CUSTOM_CAREERS_STORAGE_KEY);
        }

        localStorage.removeItem(LEGACY_CUSTOM_CAREER_STORAGE_KEY);

        saveCareerJourney({
            custom_career: safeCollection.length
                ? safeCollection
                : null
        });
    }

    function registerCareer(data) {
        data = sanitizeCareerData(data);

        if (
            !data ||
            !data.career ||
            !Array.isArray(data.requirements)
        ) {
            return null;
        }

        window.PATHLY_CAREERS =
            window.PATHLY_CAREERS || [];

        const careers = window.PATHLY_CAREERS;

        const builtInCareer = careers.find(function (career) {
            return (
                !career.isCustom &&
                normalize(career.name) === normalize(data.career.name)
            );
        });

        if (builtInCareer) {
            const journeyChanges = {};
            const oldCareerId = data.career.id;

            if (localStorage.getItem("pathlyCareerTarget") === oldCareerId) {
                localStorage.setItem("pathlyCareerTarget", builtInCareer.id);
                journeyChanges.target_career_id = builtInCareer.id;
                journeyChanges.target_career_name = builtInCareer.name;
            }

            try {
                const savedComparison = JSON.parse(
                    localStorage.getItem("pathlyComparedCareers") || "[]"
                );

                if (Array.isArray(savedComparison)) {
                    const migratedComparison = Array.from(
                        new Set(
                            savedComparison.map(function (careerId) {
                                return careerId === oldCareerId
                                    ? builtInCareer.id
                                    : careerId;
                            })
                        )
                    );

                    if (
                        JSON.stringify(migratedComparison) !==
                        JSON.stringify(savedComparison)
                    ) {
                        localStorage.setItem(
                            "pathlyComparedCareers",
                            JSON.stringify(migratedComparison)
                        );
                        journeyChanges.compared_career_ids = migratedComparison;
                    }
                }
            } catch (error) {
                localStorage.removeItem("pathlyComparedCareers");
            }

            if (Object.keys(journeyChanges).length) {
                saveCareerJourney(journeyChanges);
            }

            return builtInCareer;
        }

        const existingCustomIndex = careers.findIndex(
            function (career) {
                return (
                    career.isCustom &&
                    career.id === data.career.id
                );
            }
        );

        if (existingCustomIndex >= 0) {
            careers.splice(existingCustomIndex, 1);
        }

        careers.unshift(data.career);

        if (window.PATHLY_REQUIREMENTS) {
            window.PATHLY_REQUIREMENTS[data.career.id] =
                data.requirements;
        }

        return data.career;
    }

    function saveCareer(data) {
        data = sanitizeCareerData(data);

        if (!data) {
            return null;
        }

        const registeredCareer = registerCareer(data);

        if (!registeredCareer) {
            return null;
        }

        const storedCareers = readStoredCareers().careers;
        const updatedCareers = registeredCareer.isCustom
            ? upsertCustomCareer(storedCareers, data)
            : removeCustomCareer(
                storedCareers,
                data.career.id
            );

        persistStoredCareers(updatedCareers);

        return registeredCareer;
    }

    function loadStoredCareers() {
        const stored = readStoredCareers();
        const retainedCareerIds = new Set();

        [...stored.careers]
            .reverse()
            .forEach(function (careerData) {
                const registeredCareer = registerCareer(careerData);

                if (registeredCareer?.isCustom) {
                    retainedCareerIds.add(careerData.career.id);
                }
            });

        const retainedCareers = stored.careers.filter(
            function (careerData) {
                return retainedCareerIds.has(careerData.career.id);
            }
        );

        if (
            stored.needsMigration ||
            retainedCareers.length !== stored.careers.length
        ) {
            persistStoredCareers(retainedCareers);
        }
    }

    function recommend(group, preference) {
        return (
            group.suggestions.find(function (suggestion) {
                return suggestion.preferences.includes(preference);
            }) || group.suggestions[0]
        );
    }

    window.PATHLY_CUSTOM_CAREER_ENGINE = {
        groups: careerGroups,
        preferenceOptions: preferenceOptions,
        normalize: normalize,
        containsUnsafeInput: containsUnsafeCareerInput,
        sanitizeName: sanitizeCareerName,
        findBroadGroup: findBroadGroup,
        inferGroup: inferGroup,
        buildCareer: buildCareer,
        saveCareer: saveCareer,
        registerCareer: registerCareer,
        recommend: recommend
    };

    loadStoredCareers();
})();
