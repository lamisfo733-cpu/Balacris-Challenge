// Game Data - Interactive Stages Configuration
const GAME_START_DATE = new Date('2024-12-01T00:00:00');
const GAME_END_DATE = new Date('2025-01-22T23:59:59');

// Admin Email
const ADMIN_EMAIL = 'lamisfo733@gmail.com';

const stages = [
    {
        id: 1,
        title: "تاريخ بلاكرس",
        icon: "🏆",
        unlockDate: new Date('2024-12-01T00:00:00'),
        description: "اكتشف تاريخ فريق بلاكرس وإنجازاته المميزة",
        challenges: [
            {
                type: "image-hunt",
                question: "ابحث عن الرقم المخفي في شعار الفريق",
                imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%231a1a2e' width='600' height='400'/%3E%3Ccircle cx='300' cy='200' r='120' fill='%232ecc71' opacity='0.2'/%3E%3Ctext x='300' y='180' font-family='Arial' font-size='48' fill='%232ecc71' text-anchor='middle' font-weight='bold'%3ELYBOTICS%3C/text%3E%3Ctext x='300' y='230' font-family='Arial' font-size='32' fill='%23f39c12' text-anchor='middle'%3E%2319361%3C/text%3E%3Ctext x='520' y='50' font-family='Arial' font-size='24' fill='%231a1a2e' opacity='0.3'%3E2022%3C/text%3E%3Cpath d='M 250 280 L 280 310 L 350 240' stroke='%232ecc71' stroke-width='8' fill='none' opacity='0.3'/%3E%3Ccircle cx='450' cy='320' r='30' fill='%232ecc71' opacity='0.1'/%3E%3Ctext x='450' y='330' font-family='Arial' font-size='20' fill='%232ecc71' text-anchor='middle' opacity='0.4'%3E1%3C/text%3E%3C/svg%3E",
                hotspots: [
                    { x: 520, y: 50, radius: 40, isCorrect: true, feedback: "ممتاز! وجدت التاريخ المخفي 2022" },
                    { x: 450, y: 320, radius: 35, isCorrect: false, feedback: "قريب لكن ليس هذا!" }
                ],
                correctAnswer: "2022",
                points: 20,
                hint: "ابحث في الزوايا... 🔍"
            },
            {
                type: "quiz",
                question: "ما هو رقم فريق Lybotics Balacris في FTC؟",
                options: ["#19361", "#12345", "#19999", "#10361"],
                correctAnswer: 0,
                points: 10,
                hint: "تحقق من شعار الفريق! 💚"
            },
            {
                type: "speed-challenge",
                question: "كم عدد الجوائز التي فاز بها بلاكرس في موسم 2021-2022؟",
                options: ["1", "2", "3", "4"],
                correctAnswer: 1,
                timeLimit: 10,
                points: 15,
                bonusPoints: 10,
                hint: "فكر بسرعة! ⚡"
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
                type: "code-puzzle",
                question: "أكمل الكود البرمجي لتحريك الروبوت للأمام",
                codeTemplate: "robot.move(___); // املأ الفراغ\nrobot.speed(100);",
                correctAnswer: "forward",
                possibleAnswers: ["forward", "FORWARD", "Forward"],
                codeLanguage: "java",
                points: 20,
                hint: "الاتجاه المعاكس لـ backward 🤖"
            },
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
                type: "speed-challenge",
                question: "FTC مناسب لأي فئة عمرية؟",
                options: ["7-12 سنة", "12-18 سنة", "9-14 سنة", "16-20 سنة"],
                correctAnswer: 1,
                timeLimit: 8,
                points: 10,
                bonusPoints: 5,
                hint: "سريع! ⏱️"
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
                type: "image-hunt",
                question: "ابحث عن الجائزة المخفية في صورة الاحتفال",
                imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%2316213e' width='600' height='400'/%3E%3Ccircle cx='300' cy='200' r='80' fill='%23f39c12' opacity='0.3'/%3E%3Ctext x='300' y='100' font-family='Arial' font-size='36' fill='%232ecc71' text-anchor='middle' font-weight='bold'%3E%D8%A7%D9%84%D8%A8%D9%8A%D8%B6%D8%A7%D8%A1 2022%3C/text%3E%3Ctext x='300' y='210' font-family='Arial' font-size='28' fill='%23f39c12' text-anchor='middle'%3E%F0%9F%8F%86%3C/text%3E%3Ctext x='100' y='350' font-family='Arial' font-size='18' fill='%232ecc71' opacity='0.5'%3EInspire%3C/text%3E%3Ctext x='480' y='280' font-family='Arial' font-size='16' fill='%23adb5bd' opacity='0.4'%3EAward%3C/text%3E%3Cpath d='M 250 250 L 300 300 L 350 250' fill='%232ecc71' opacity='0.2'/%3E%3C/svg%3E",
                hotspots: [
                    { x: 100, y: 350, radius: 50, isCorrect: true, feedback: "أحسنت! وجدت جائزة الإلهام 🌟" },
                    { x: 300, y: 200, radius: 45, isCorrect: false, feedback: "هذه الميدالية فقط!" }
                ],
                correctAnswer: "Inspire",
                points: 25,
                hint: "ابحث في الأسفل... 🌟"
            },
            {
                type: "code-puzzle",
                question: "فك شيفرة Base64 لتعرف اسم الجائزة",
                codeTemplate: "String award = decode('SW5zcGlyZSBBd2FyZA==');\n// ما هو اسم الجائزة؟",
                correctAnswer: "Inspire Award",
                possibleAnswers: ["Inspire Award", "inspire award", "INSPIRE AWARD"],
                codeLanguage: "java",
                points: 20,
                hint: "استخدم أي موقع لفك Base64 🔓"
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
                type: "map-quest",
                question: "حدد موقع المركز الثقافي على الخريطة",
                mapCenter: { lat: 32.7667, lng: 21.7333 },
                locations: [
                    { 
                        name: "المركز الثقافي", 
                        lat: 32.7620, 
                        lng: 21.7380, 
                        isCorrect: true,
                        feedback: "ممتاز! هنا أقيم Kick Off 2025 🎯"
                    },
                    { 
                        name: "موقع خاطئ 1", 
                        lat: 32.7700, 
                        lng: 21.7400, 
                        isCorrect: false,
                        feedback: "ليس هنا، حاول مرة أخرى"
                    },
                    { 
                        name: "موقع خاطئ 2", 
                        lat: 32.7580, 
                        lng: 21.7300, 
                        isCorrect: false,
                        feedback: "قريب لكن ليس الموقع الصحيح"
                    }
                ],
                points: 25,
                hint: "فكر في مكان الفعاليات الثقافية 🏛️"
            },
            {
                type: "speed-challenge",
                question: "كم عدد الفرق التي شاركت في Kick Off 2025؟",
                options: ["3", "5", "7", "10"],
                correctAnswer: 1,
                timeLimit: 10,
                points: 15,
                bonusPoints: 10,
                hint: "سريع! 🚀"
            },
            {
                type: "code-puzzle",
                question: "صحح الخطأ في كود تشغيل المحرك",
                codeTemplate: "motor.setPower(1.5); // خطأ!\nmotor.start();",
                correctAnswer: "1.0",
                possibleAnswers: ["1.0", "1", "1.00"],
                codeLanguage: "java",
                points: 20,
                hint: "القيمة يجب أن تكون بين 0 و 1 💡"
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
                type: "map-quest",
                question: "حدد موقع بنما على الخريطة",
                mapCenter: { lat: 8.5380, lng: -80.7821 },
                locations: [
                    { 
                        name: "بنما", 
                        lat: 8.9824, 
                        lng: -79.5199, 
                        isCorrect: true,
                        feedback: "صحيح! هنا أقيم First Global 2025 🌍"
                    },
                    { 
                        name: "البرازيل", 
                        lat: -14.2350, 
                        lng: -51.9253, 
                        isCorrect: false,
                        feedback: "هذه البرازيل، حاول مرة أخرى"
                    },
                    { 
                        name: "المكسيك", 
                        lat: 23.6345, 
                        lng: -102.5528, 
                        isCorrect: false,
                        feedback: "هذه المكسيك، ابحث جنوباً أكثر"
                    }
                ],
                points: 25,
                hint: "أمريكا الوسطى 🗺️"
            },
            {
                type: "image-hunt",
                question: "ابحث عن علم ليبيا في صورة المشاركين",
                imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%231a1a2e' width='600' height='400'/%3E%3Ctext x='300' y='80' font-family='Arial' font-size='32' fill='%232ecc71' text-anchor='middle' font-weight='bold'%3EFirst Global 2025%3C/text%3E%3Crect x='50' y='150' width='80' height='60' fill='%23e74c3c'/%3E%3Crect x='50' y='210' width='80' height='60' fill='%23000000'/%3E%3Crect x='50' y='270' width='80' height='60' fill='%232ecc71'/%3E%3Ccircle cx='90' cy='240' r='15' fill='%23ffffff'/%3E%3Cpath d='M 90 235 L 95 245 L 85 240 L 95 240 L 85 245 Z' fill='%23ffffff'/%3E%3Crect x='200' y='180' width='80' height='60' fill='%2300247d' opacity='0.3'/%3E%3Crect x='350' y='200' width='80' height='60' fill='%23009e49' opacity='0.3'/%3E%3Ctext x='300' y='360' font-family='Arial' font-size='20' fill='%23adb5bd' text-anchor='middle'%3E192 Countries%3C/text%3E%3C/svg%3E",
                hotspots: [
                    { x: 90, y: 240, radius: 60, isCorrect: true, feedback: "رائع! وجدت علم ليبيا 🇱🇾" },
                    { x: 240, y: 210, radius: 45, isCorrect: false, feedback: "هذا علم آخر!" }
                ],
                correctAnswer: "Libya",
                points: 20,
                hint: "الأحمر والأسود والأخضر مع الهلال والنجمة 🇱🇾"
            },
            {
                type: "speed-challenge",
                question: "كم عدد الدول المشاركة تقريباً في First Global؟",
                options: ["100", "150", "192", "220"],
                correctAnswer: 2,
                timeLimit: 8,
                points: 10,
                bonusPoints: 5
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
                type: "code-puzzle",
                question: "أكمل كود حساب عدد الطلاب المستفيدين",
                codeTemplate: "int workshops = 5;\nint studentsPerWorkshop = 30;\nint total = workshops ___ studentsPerWorkshop;\n// ما هو المعامل الناقص؟",
                correctAnswer: "*",
                possibleAnswers: ["*", "×"],
                codeLanguage: "java",
                points: 15,
                hint: "عملية الضرب 🔢"
            },
            {
                type: "map-quest",
                question: "حدد موقع جامعة عمر المختار - كلية الطب البشري",
                mapCenter: { lat: 32.7667, lng: 21.7333 },
                locations: [
                    { 
                        name: "كلية الطب", 
                        lat: 32.7550, 
                        lng: 21.7450, 
                        isCorrect: true,
                        feedback: "ممتاز! هنا أقيم معرض التكنولوجيا الطبية 🏥"
                    },
                    { 
                        name: "موقع خاطئ 1", 
                        lat: 32.7680, 
                        lng: 21.7250, 
                        isCorrect: false,
                        feedback: "حاول مرة أخرى"
                    }
                ],
                points: 20,
                hint: "حيث يدرس الأطباء 🏥"
            },
            {
                type: "speed-challenge",
                question: "ما هو شعار فريق بلاكرس الرئيسي؟",
                options: ["ROBOTICS", "LYBOTICS", "BALACRIS", "FTC"],
                correctAnswer: 1,
                timeLimit: 5,
                points: 10,
                bonusPoints: 10,
                hint: "سريع جداً! ⚡"
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
                type: "speed-challenge",
                question: "كم عدد المراحل في هذا التحدي؟",
                options: ["5", "6", "7", "8"],
                correctAnswer: 2,
                timeLimit: 5,
                points: 15,
                bonusPoints: 15,
                hint: "أنت في المرحلة الأخيرة! 🎯"
            },
            {
                type: "code-puzzle",
                question: "فك شيفرة اسم الفريق من Base64",
                codeTemplate: "decode('QmFsYWNyaXM=');\n// ما هو اسم الفريق؟",
                correctAnswer: "Balacris",
                possibleAnswers: ["Balacris", "balacris", "BALACRIS"],
                codeLanguage: "java",
                points: 20,
                hint: "استخدم أي أداة Base64 decoder 🔓"
            },
            {
                type: "image-hunt",
                question: "ابحث عن الكأس الذهبي في صورة الفوز",
                imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%2316213e' width='600' height='400'/%3E%3Ctext x='300' y='60' font-family='Arial' font-size='40' fill='%232ecc71' text-anchor='middle' font-weight='bold'%3E%F0%9F%8F%86 WINNERS %F0%9F%8F%86%3C/text%3E%3Ctext x='300' y='120' font-family='Arial' font-size='24' fill='%23f39c12' text-anchor='middle'%3EBalacris Champions%3C/text%3E%3Cpath d='M 280 200 L 270 250 L 300 260 L 330 250 L 320 200 L 300 190 Z' fill='%23f39c12' opacity='0.8'/%3E%3Cellipse cx='300' cy='195' rx='25' ry='15' fill='%23f39c12'/%3E%3Crect x='290' y='260' width='20' height='40' fill='%23f39c12'/%3E%3Crect x='275' y='300' width='50' height='30' fill='%23f39c12'/%3E%3Ctext x='300' y='322' font-family='Arial' font-size='16' fill='%2316213e' text-anchor='middle' font-weight='bold'%3E2025%3C/text%3E%3Ctext x='500' y='380' font-family='Arial' font-size='14' fill='%232ecc71' opacity='0.3'%3E%2319361%3C/text%3E%3C/svg%3E",
                hotspots: [
                    { x: 300, y: 240, radius: 70, isCorrect: true, feedback: "🏆 ممتاز! وجدت الكأس الذهبي!" },
                    { x: 500, y: 380, radius: 40, isCorrect: false, feedback: "هذا رقم الفريق فقط" }
                ],
                correctAnswer: "trophy",
                points: 25,
                hint: "في المنتصف... أين الشيء الذهبي؟ 🏆"
            },
            {
                type: "map-quest",
                question: "حدد موقع مدينة البيضاء على خريطة ليبيا",
                mapCenter: { lat: 32.7667, lng: 21.7333 },
                locations: [
                    { 
                        name: "البيضاء", 
                        lat: 32.7667, 
                        lng: 21.7333, 
                        isCorrect: true,
                        feedback: "تماماً! موطن فريق بلاكرس 💚"
                    },
                    { 
                        name: "بنغازي", 
                        lat: 32.1191, 
                        lng: 20.0686, 
                        isCorrect: false,
                        feedback: "هذه بنغازي"
                    },
                    { 
                        name: "طرابلس", 
                        lat: 32.8872, 
                        lng: 13.1913, 
                        isCorrect: false,
                        feedback: "هذه طرابلس"
                    }
                ],
                points: 20,
                hint: "شرق ليبيا، الجبل الأخضر 🗺️"
            },
            {
                type: "code-puzzle",
                question: "أكمل قيمة FIRST الأساسية",
                codeTemplate: "String value = 'Gracious ___';\n// أكمل القيمة",
                correctAnswer: "Professionalism",
                possibleAnswers: ["Professionalism", "professionalism", "PROFESSIONALISM"],
                codeLanguage: "java",
                points: 20,
                hint: "القيمة الأساسية لـ FIRST 🤝"
            }
        ]
    }
];

// Initialize game data
function initializeGameData() {
    if (!localStorage.getItem('gameData')) {
        const gameData = {
            players: [],
            version: '2.0'
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
