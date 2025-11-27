// Game Data - Stages Configuration
const GAME_START_DATE = new Date('2024-12-01T00:00:00');
const GAME_END_DATE = new Date('2025-01-22T23:59:59');

// Admin Email (change this to your email)
const ADMIN_EMAIL = 'admin@lybotics.com'; // غير هذا البريد إلى بريدك

const stages = [
    {
        id: 1,
        title: "تاريخ بلاكرس",
        icon: "🏆",
        unlockDate: new Date('2024-12-01T00:00:00'),
        description: "اكتشف تاريخ فريق بلاكرس وإنجازاته المميزة",
        challenges: [
            {
                type: "quiz",
                question: "ما هو رقم فريق Lybotics Balacris في FTC؟",
                options: ["#19361", "#12345", "#19999", "#10361"],
                correctAnswer: 0,
                points: 10,
                hint: "تحقق من شعار الفريق! 💚"
            },
            {
                type: "puzzle",
                question: "أكمل الجملة: فاز فريق بلاكرس بجائزة ___ في بطولة البيضاء المحلية",
                correctAnswer: "الإلهام",
                caseSensitive: false,
                points: 15,
                hint: "هي أكثر جائزة مرموقة في FTC 🌟"
            },
            {
                type: "quiz",
                question: "في أي مدينة ليبية يقع فريق بلاكرس؟",
                options: ["طرابلس", "بنغازي", "البيضاء", "مصراتة"],
                correctAnswer: 2,
                points: 10
            }
        ]
    },
    {
        id: 2,
        title: "أساسيات FTC",
        icon: "🤖",
        unlockDate: new Date('2024-12-08T00:00:00'),
        description: "تعرف على FIRST Tech Challenge والروبوتات",
        challenges: [
            {
                type: "quiz",
                question: "ماذا يعني FTC؟",
                options: [
                    "First Technology Challenge",
                    "FIRST Tech Challenge",
                    "Future Tech Competition",
                    "First Team Competition"
                ],
                correctAnswer: 1,
                points: 10
            },
            {
                type: "puzzle",
                question: "ما هو الحدث السنوي الذي ينظمه فريق بلاكرس لإطلاق موسم FTC الجديد؟ (بالإنجليزية)",
                correctAnswer: "KICK OFF",
                caseSensitive: false,
                points: 15,
                hint: "حدث الإطلاق! 🚀"
            },
            {
                type: "quiz",
                question: "FTC مناسب لأي فئة عمرية من الطلاب؟",
                options: [
                    "من 7-12 سنة",
                    "من 12-18 سنة",
                    "من 9-14 سنة",
                    "من 16-20 سنة"
                ],
                correctAnswer: 1,
                points: 10
            },
            {
                type: "puzzle",
                question: "كم عدد البطولات التي فاز بها فريق بلاكرس في موسم 21-22؟ (اكتب الرقم فقط)",
                correctAnswer: "2",
                caseSensitive: false,
                points: 20,
                hint: "🥇 + 🥈"
            }
        ]
    },
    {
        id: 3,
        title: "جائزة الإلهام",
        icon: "🌟",
        unlockDate: new Date('2024-12-15T00:00:00'),
        description: "تعرف على أعظم جائزة في FTC وكيف فاز بها بلاكرس",
        challenges: [
            {
                type: "quiz",
                question: "ما هي الجائزة التي تؤهل الفريق مباشرة للمرحلة التالية بغض النظر عن الترتيب؟",
                options: [
                    "جائزة التصميم",
                    "جائزة الإلهام",
                    "جائزة الابتكار",
                    "جائزة القيادة"
                ],
                correctAnswer: 1,
                points: 15
            },
            {
                type: "puzzle",
                question: "أكمل: الفريق الذي يفوز بجائزة الإلهام يكون سفيرًا قويًا للعلوم و___",
                correctAnswer: "التكنولوجيا",
                caseSensitive: false,
                points: 10,
                hint: "STEM = Science, Technology, Engineering, Math"
            },
            {
                type: "quiz",
                question: "جائزة الإلهام تُمنح للفريق الذي يُظهر:",
                options: [
                    "أفضل روبوت فقط",
                    "أعلى نقاط في المباريات",
                    "أداء متميز داخل وخارج الملعب",
                    "أكبر عدد من الأعضاء"
                ],
                correctAnswer: 2,
                points: 15
            }
        ]
    },
    {
        id: 4,
        title: "التكنولوجيا والابتكار",
        icon: "💡",
        unlockDate: new Date('2024-12-22T00:00:00'),
        description: "استكشف مجالات STEM والابتكار التكنولوجي",
        challenges: [
            {
                type: "quiz",
                question: "ما هو الكتاب الذي تعاون فريق بلاكرس في نشر نسخته الرقمية؟",
                options: [
                    "FTC Handbook",
                    "Beyond The Bot: An FTC Handbook",
                    "Robotics Guide",
                    "First Challenge Book"
                ],
                correctAnswer: 1,
                points: 15
            },
            {
                type: "puzzle",
                question: "اسم الفريق الذي تعاون معه بلاكرس في نشر الكتاب؟ (بالإنجليزية)",
                correctAnswer: "Aperture Robotics",
                caseSensitive: false,
                points: 20,
                hint: "اسم علمي للفتحة في الكاميرا 📸"
            },
            {
                type: "quiz",
                question: "ما هو الحدث الصيفي الذي نظمه فريق بلاكرس؟",
                options: [
                    "معسكر الروبوتات",
                    "منتدى الروبوتات الصيفي",
                    "ورشة البرمجة",
                    "مسابقة الصيف"
                ],
                correctAnswer: 1,
                points: 10
            }
        ]
    },
    {
        id: 5,
        title: "First Global Challenge",
        icon: "🌍",
        unlockDate: new Date('2024-12-29T00:00:00'),
        description: "رحلة بلاكرس في الأولمبياد العالمي للروبوتات",
        challenges: [
            {
                type: "quiz",
                question: "في أي دولة أقيم First Global Challenge الذي شارك فيه المنتخب الليبي 2025؟",
                options: ["البرازيل", "بنما", "الإمارات", "اليابان"],
                correctAnswer: 1,
                points: 10
            },
            {
                type: "puzzle",
                question: "كم عدد الدول المشاركة تقريباً في First Global Challenge 2025؟ (اكتب الرقم فقط)",
                correctAnswer: "192",
                caseSensitive: false,
                points: 15,
                hint: "عدد قريب من عدد دول العالم 🌍"
            },
            {
                type: "quiz",
                question: "ما هو اسم الفريق الليبي الذي دعمه بلاكرس في First Global 2025؟",
                options: [
                    "فريق ليبيا",
                    "فريق القلعة",
                    "فريق النصر",
                    "فريق الوحدة"
                ],
                correctAnswer: 1,
                points: 15
            },
            {
                type: "puzzle",
                question: "أكمل: First Global Challenge هو أولمبياد عالمي لل___",
                correctAnswer: "روبوتات",
                caseSensitive: false,
                points: 10
            }
        ]
    },
    {
        id: 6,
        title: "المجتمع والتأثير",
        icon: "💚",
        unlockDate: new Date('2025-01-05T00:00:00'),
        description: "دور بلاكرس في نشر ثقافة STEM في ليبيا",
        challenges: [
            {
                type: "quiz",
                question: "أين أقيم معرض التكنولوجيا الطبية الذي شارك فيه فريق بلاكرس؟",
                options: [
                    "مستشفى البيضاء",
                    "جامعة عمر المختار / كلية الطب البشري",
                    "المركز الثقافي",
                    "مركز الأبحاث"
                ],
                correctAnswer: 1,
                points: 15
            },
            {
                type: "puzzle",
                question: "ما هو المركز الذي استضاف حدث Kick Off الخاص بموسم 2025-2026؟",
                correctAnswer: "المركز الثقافي",
                caseSensitive: false,
                points: 10
            },
            {
                type: "quiz",
                question: "كم عدد الفرق التي شاركت في حدث Kick Off مع بلاكرس؟",
                options: ["3 فرق", "5 فرق", "7 فرق", "10 فرق"],
                correctAnswer: 1,
                points: 10,
                hint: "سيرين شحات، سوبر، جينسس، نادي الأخضر، امباكت"
            },
            {
                type: "puzzle",
                question: "ما هو شعار فريق بلاكرس الرئيسي؟ (بالإنجليزية - كلمة واحدة)",
                correctAnswer: "LYBOTICS",
                caseSensitive: false,
                points: 15
            }
        ]
    },
    {
        id: 7,
        title: "التحدي النهائي",
        icon: "🎯",
        unlockDate: new Date('2025-01-12T00:00:00'),
        description: "اختبار شامل لكل ما تعلمته عن بلاكرس وFTC",
        challenges: [
            {
                type: "quiz",
                question: "ما هي رسالة فريق بلاكرس الأساسية؟",
                options: [
                    "الفوز بالبطولات فقط",
                    "نشر ثقافة STEM وإلهام الشباب الليبي",
                    "بناء أفضل روبوت",
                    "المشاركة الدولية"
                ],
                correctAnswer: 1,
                points: 20
            },
            {
                type: "puzzle",
                question: "كم عدد المراحل في هذا التحدي الذي أنت فيه الآن؟ (اكتب الرقم فقط)",
                correctAnswer: "7",
                caseSensitive: false,
                points: 15
            },
            {
                type: "quiz",
                question: "أي من هذه القيم تمثل فريق بلاكرس بشكل أفضل؟",
                options: [
                    "المنافسة الفردية",
                    "العمل الجماعي والإلهام",
                    "الربح المادي",
                    "الشهرة الإعلامية"
                ],
                correctAnswer: 1,
                points: 15
            },
            {
                type: "puzzle",
                question: "ما هو اللون المميز لفريق بلاكرس؟ (بالعربية)",
                correctAnswer: "أخضر",
                caseSensitive: false,
                points: 10,
                hint: "انظر حولك في موقع اللعبة! 💚"
            },
            {
                type: "quiz",
                question: "متى بدأ موسم FTC 2024-2025 في ليبيا؟",
                options: [
                    "يناير 2024",
                    "يونيو 2024",
                    "سبتمبر 2024",
                    "ديسمبر 2024"
                ],
                correctAnswer: 2,
                points: 15
            },
            {
                type: "puzzle",
                question: "أكمل شعار FIRST: Gracious ___",
                correctAnswer: "Professionalism",
                caseSensitive: false,
                points: 20,
                hint: "الاحترافية الودودة - قيمة أساسية في FIRST"
            }
        ]
    }
];

// Initialize game data in localStorage if not exists
function initializeGameData() {
    if (!localStorage.getItem('gameData')) {
        const gameData = {
            players: [],
            version: '1.0'
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }
}

// Get all players data
function getAllPlayers() {
    const gameData = JSON.parse(localStorage.getItem('gameData') || '{"players":[]}');
    return gameData.players;
}

// Save player data
function savePlayerData(playerData) {
    const gameData = JSON.parse(localStorage.getItem('gameData') || '{"players":[]}');
    const existingIndex = gameData.players.findIndex(p => p.email === playerData.email);
    
    if (existingIndex >= 0) {
        gameData.players[existingIndex] = playerData;
    } else {
        gameData.players.push(playerData);
    }
    
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Get current player data
function getCurrentPlayer() {
    const email = localStorage.getItem('currentPlayerEmail');
    if (!email) return null;
    
    const players = getAllPlayers();
    return players.find(p => p.email === email);
}

// Calculate leaderboard
function getLeaderboard() {
    const players = getAllPlayers();
    return players
        .map(player => ({
            name: player.name,
            email: player.email,
            completedStages: player.progress.filter(p => p.completed).length,
            totalScore: player.progress.reduce((sum, p) => sum + p.score, 0),
            lastActive: player.lastActive
        }))
        .sort((a, b) => {
            if (b.completedStages !== a.completedStages) {
                return b.completedStages - a.completedStages;
            }
            return b.totalScore - a.totalScore;
        });
}

// Check if stage is unlocked
function isStageUnlocked(stageId) {
    const now = new Date();
    const stage = stages.find(s => s.id === stageId);
    return stage && now >= stage.unlockDate;
}

// Get next unlock date
function getNextUnlockDate() {
    const now = new Date();
    const lockedStages = stages.filter(s => now < s.unlockDate);
    
    if (lockedStages.length === 0) return null;
    
    return lockedStages.reduce((earliest, stage) => 
        stage.unlockDate < earliest ? stage.unlockDate : earliest
    , lockedStages[0].unlockDate);
}

// Export data for admin
function exportGameData() {
    const gameData = JSON.parse(localStorage.getItem('gameData') || '{"players":[]}');
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lybotics_game_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Initialize on load
initializeGameData();