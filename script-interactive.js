// Import Firebase functions
import { db, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, orderBy, limit } from './firebase-config.js';

// Main Game Logic
let currentPlayer = null;
let currentStageId = null;
let challengeTimers = {};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    setupEventListeners();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// Show loading spinner
function showLoading(show = true) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

// Check if user is logged in
async function checkLoginStatus() {
    const email = localStorage.getItem('currentPlayerEmail');
    if (email) {
        showLoading(true);
        currentPlayer = await getCurrentPlayer(email);
        showLoading(false);
        
        if (currentPlayer) {
            showGameScreen();
            return;
        }
    }
    showLoginScreen();
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('gameScreen').classList.remove('active');
}

// Show game screen
function showGameScreen() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    
    updatePlayerInfo();
    renderStages();
    
    // Show admin panel if admin
    if (currentPlayer && currentPlayer.email === ADMIN_EMAIL) {
        document.getElementById('adminPanel').style.display = 'block';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Leaderboard button
    document.getElementById('showLeaderboardBtn').addEventListener('click', showLeaderboard);
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Admin buttons
    const showAdminBtn = document.getElementById('showAdminBtn');
    if (showAdminBtn) {
        showAdminBtn.addEventListener('click', showAdminPanel);
    }
    
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportGameData);
    }
    
    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchAdminTab(tabName);
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim().toLowerCase();
    const phone = document.getElementById('userPhone').value.trim();
    
    if (!name || !email) {
        alert('الرجاء إدخال الاسم والبريد الإلكتروني');
        return;
    }
    
    showLoading(true);
    
    try {
        const playerDoc = await getDoc(doc(db, 'players', email));
        let player;
        
        if (playerDoc.exists()) {
            player = playerDoc.data();
            player.name = name;
            player.phone = phone;
            player.lastActive = new Date().toISOString();
            
            await updateDoc(doc(db, 'players', email), {
                name: player.name,
                phone: player.phone,
                lastActive: player.lastActive
            });
        } else {
            player = {
                name: name,
                email: email,
                phone: phone,
                registrationDate: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                progress: stages.map(stage => ({
                    stageId: stage.id,
                    completed: false,
                    score: 0,
                    attempts: 0,
                    completedChallenges: []
                }))
            };
            
            await setDoc(doc(db, 'players', email), player);
        }
        
        localStorage.setItem('currentPlayerEmail', email);
        currentPlayer = player;
        
        showLoading(false);
        showGameScreen();
    } catch (error) {
        console.error('Error during login:', error);
        showLoading(false);
        alert('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
    }
}

// Handle logout
function handleLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // Clear any running timers
        Object.keys(challengeTimers).forEach(key => {
            if (challengeTimers[key]) clearInterval(challengeTimers[key]);
        });
        challengeTimers = {};
        
        localStorage.removeItem('currentPlayerEmail');
        currentPlayer = null;
        currentStageId = null;
        showLoginScreen();
    }
}

// Update player info display
function updatePlayerInfo() {
    if (!currentPlayer) return;
    
    document.getElementById('displayName').textContent = currentPlayer.name;
    
    const totalScore = currentPlayer.progress.reduce((sum, p) => sum + p.score, 0);
    document.getElementById('userScore').textContent = totalScore;
}

// Render stages
function renderStages() {
    const grid = document.getElementById('stagesGrid');
    grid.innerHTML = '';
    
    stages.forEach(stage => {
        const stageProgress = currentPlayer.progress.find(p => p.stageId === stage.id);
        const isUnlocked = isStageUnlocked(stage.id);
        const isCompleted = stageProgress && stageProgress.completed;
        
        const stageCard = document.createElement('div');
        stageCard.className = 'stage-card';
        
        if (!isUnlocked) {
            stageCard.classList.add('locked');
        }
        if (isCompleted) {
            stageCard.classList.add('completed');
        }
        
        let statusText = '';
        if (!isUnlocked) {
            const unlockDate = new Date(stage.unlockDate);
            statusText = `يُفتح في ${unlockDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}`;
        } else if (isCompleted) {
            statusText = `✓ مكتمل - ${stageProgress.score} نقطة`;
        } else {
            statusText = 'متاح الآن';
        }
        
        stageCard.innerHTML = `
            <div class="stage-icon">${stage.icon}</div>
            <div class="stage-title">${stage.title}</div>
            <div class="stage-status">${statusText}</div>
            ${isCompleted ? '<div class="stage-badge">✓</div>' : ''}
        `;
        
        if (isUnlocked) {
            stageCard.addEventListener('click', () => loadStage(stage.id));
        }
        
        grid.appendChild(stageCard);
    });
}

// Load stage
function loadStage(stageId) {
    currentStageId = stageId;
    const stage = stages.find(s => s.id === stageId);
    const stageProgress = currentPlayer.progress.find(p => p.stageId === stageId);
    
    if (!stage || !isStageUnlocked(stageId)) {
        return;
    }
    
    const content = document.getElementById('stageContent');
    content.innerHTML = `
        <div class="challenge-header">
            <h2>${stage.icon} ${stage.title}</h2>
            <p class="challenge-description">${stage.description}</p>
            <div style="text-align: center; margin: 1rem 0;">
                <span style="color: var(--accent-yellow); font-weight: 700;">
                    نقاطك في هذه المرحلة: ${stageProgress.score}
                </span>
            </div>
        </div>
        <div id="challengesContainer"></div>
    `;
    
    renderChallenges(stage, stageProgress);
    
    content.scrollIntoView({ behavior: 'smooth' });
}

// Render challenges
function renderChallenges(stage, stageProgress) {
    const container = document.getElementById('challengesContainer');
    container.innerHTML = '';
    
    stage.challenges.forEach((challenge, index) => {
        const isCompleted = stageProgress.completedChallenges.includes(index);
        
        const challengeDiv = document.createElement('div');
        challengeDiv.className = challenge.type === 'quiz' ? 'quiz-section' : 'puzzle-section';
        challengeDiv.style.opacity = isCompleted ? '0.6' : '1';
        
        let challengeHTML = `
            <h3>${isCompleted ? '✓ ' : ''}التحدي ${index + 1} ${isCompleted ? '(مكتمل)' : ''}</h3>
            <p style="font-size: 1.1rem; margin: 1rem 0;">${challenge.question}</p>
            <p style="color: var(--accent-yellow); margin: 0.5rem 0;">النقاط: ${challenge.points}</p>
        `;
        
        if (!isCompleted) {
            // Render based on challenge type
            switch (challenge.type) {
                case 'quiz':
                    challengeHTML += renderQuizChallenge(challenge, index);
                    break;
                case 'puzzle':
                    challengeHTML += renderPuzzleChallenge(challenge, index);
                    break;
                case 'image-hunt':
                    challengeHTML += renderImageHuntChallenge(challenge, index);
                    break;
                case 'code-puzzle':
                    challengeHTML += renderCodePuzzleChallenge(challenge, index);
                    break;
                case 'map-quest':
                    challengeHTML += renderMapQuestChallenge(challenge, index);
                    break;
                case 'speed-challenge':
                    challengeHTML += renderSpeedChallenge(challenge, index);
                    break;
            }
            
            challengeHTML += `
                <button class="submit-answer" data-challenge="${index}" data-type="${challenge.type}">
                    إرسال الإجابة
                </button>
                <div id="feedback-${index}" class="feedback-message" style="display: none;"></div>
            `;
        } else {
            challengeHTML += '<p style="color: var(--primary-green); margin-top: 1rem;">✓ تم إكمال هذا التحدي</p>';
        }
        
        challengeDiv.innerHTML = challengeHTML;
        container.appendChild(challengeDiv);
    });
    
    // Setup event listeners after rendering
    setupChallengeListeners(stage);
}

// Render Quiz Challenge
function renderQuizChallenge(challenge, index) {
    let html = '<div class="quiz-options">';
    challenge.options.forEach((option, optIndex) => {
        html += `
            <div class="quiz-option" data-challenge="${index}" data-option="${optIndex}">
                ${option}
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// Render Puzzle Challenge
function renderPuzzleChallenge(challenge, index) {
    return `
        <input type="text" class="puzzle-input" id="puzzle-${index}" 
               placeholder="أدخل إجابتك هنا..." />
        ${challenge.hint ? `<p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 0.5rem;">💡 ${challenge.hint}</p>` : ''}
    `;
}

// Render Image Hunt Challenge
function renderImageHuntChallenge(challenge, index) {
    return `
        <div class="image-hunt-container" id="image-hunt-${index}">
            <img src="${challenge.imageUrl}" alt="تحدي البحث" class="hunt-image" 
                 data-challenge="${index}" />
            <input type="hidden" id="image-hunt-answer-${index}" />
        </div>
        ${challenge.hint ? `<p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem; text-align: center;">💡 ${challenge.hint}</p>` : ''}
    `;
}

// Render Code Puzzle Challenge
function renderCodePuzzleChallenge(challenge, index) {
    const lines = challenge.codeTemplate.split('\n');
    let html = '<div class="code-puzzle-container"><div class="code-editor">';
    
    lines.forEach((line, lineIndex) => {
        if (line.includes('___')) {
            const parts = line.split('___');
            html += `<div class="code-line">${parts[0]}<input type="text" class="code-input" id="code-${index}" placeholder="___" />${parts[1] || ''}</div>`;
        } else {
            html += `<div class="code-line">${line}</div>`;
        }
    });
    
    html += '</div></div>';
    html += challenge.hint ? `<p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem;">💡 ${challenge.hint}</p>` : '';
    return html;
}

// Render Map Quest Challenge
function renderMapQuestChallenge(challenge, index) {
    return `
        <div class="map-quest-container" id="map-${index}">
            <div class="map-canvas" style="position: relative; background: url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'700\\' height=\\'500\\'%3E%3Crect fill=\\'%2316213e\\' width=\\'700\\' height=\\'500\\'/%3E%3Ctext x=\\'350\\' y=\\'250\\' font-family=\\'Arial\\' font-size=\\'24\\' fill=\\'%232ecc71\\' text-anchor=\\'middle\\'%3Eانقر على الموقع الصحيح%3C/text%3E%3C/svg%3E') center/cover;">
                ${challenge.locations.map((loc, locIndex) => `
                    <div class="map-marker" data-challenge="${index}" data-location="${locIndex}" 
                         style="left: ${50 + (locIndex - 1) * 25}%; top: ${50 + (locIndex % 2) * 20}%;">
                        📍
                    </div>
                `).join('')}
            </div>
            <input type="hidden" id="map-answer-${index}" />
        </div>
        ${challenge.hint ? `<p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem; text-align: center;">💡 ${challenge.hint}</p>` : ''}
    `;
}

// Render Speed Challenge
function renderSpeedChallenge(challenge, index) {
    let html = `
        <div class="speed-challenge-container">
            <div class="timer-display" id="timer-${index}">${challenge.timeLimit}</div>
            <p style="color: var(--text-gray); margin-bottom: 1.5rem;">
                نقاط إضافية: ${challenge.bonusPoints} إذا أجبت بسرعة! ⚡
            </p>
            <div class="quiz-options">
    `;
    
    challenge.options.forEach((option, optIndex) => {
        html += `
            <div class="quiz-option" data-challenge="${index}" data-option="${optIndex}">
                ${option}
            </div>
        `;
    });
    
    html += '</div></div>';
    html += challenge.hint ? `<p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 0.5rem;">💡 ${challenge.hint}</p>` : '';
    return html;
}

// Setup Challenge Listeners
function setupChallengeListeners(stage) {
    // Quiz options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const challengeIndex = e.target.dataset.challenge;
            document.querySelectorAll(`.quiz-option[data-challenge="${challengeIndex}"]`).forEach(opt => {
                opt.classList.remove('selected');
            });
            e.target.classList.add('selected');
        });
    });
    
    // Image hunt
    document.querySelectorAll('.hunt-image').forEach(img => {
        img.addEventListener('click', (e) => {
            const challengeIndex = e.target.dataset.challenge;
            const challenge = stage.challenges[challengeIndex];
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const scaleX = e.target.naturalWidth / rect.width;
            const scaleY = e.target.naturalHeight / rect.height;
            const actualX = x * scaleX;
            const actualY = y * scaleY;
            
            // Check if click is within any hotspot
            let clickedHotspot = null;
            challenge.hotspots.forEach((hotspot, idx) => {
                const distance = Math.sqrt(Math.pow(actualX - hotspot.x, 2) + Math.pow(actualY - hotspot.y, 2));
                if (distance <= hotspot.radius) {
                    clickedHotspot = idx;
                }
            });
            
            if (clickedHotspot !== null) {
                document.getElementById(`image-hunt-answer-${challengeIndex}`).value = clickedHotspot;
                // Visual feedback
                const feedback = document.getElementById(`feedback-${challengeIndex}`);
                feedback.textContent = '✓ تم تحديد منطقة، اضغط إرسال للتحقق';
                feedback.className = 'feedback-message';
                feedback.style.display = 'block';
                feedback.style.background = 'rgba(243, 156, 18, 0.2)';
                feedback.style.borderColor = 'var(--accent-yellow)';
            }
        });
    });
    
    // Map markers
    document.querySelectorAll('.map-marker').forEach(marker => {
        marker.addEventListener('click', (e) => {
            const challengeIndex = e.currentTarget.dataset.challenge;
            const locationIndex = e.currentTarget.dataset.location;
            
            document.querySelectorAll(`.map-marker[data-challenge="${challengeIndex}"]`).forEach(m => {
                m.style.transform = 'translate(-50%, -50%)';
            });
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.5)';
            
            document.getElementById(`map-answer-${challengeIndex}`).value = locationIndex;
            
            const feedback = document.getElementById(`feedback-${challengeIndex}`);
            feedback.textContent = '✓ تم تحديد موقع، اضغط إرسال للتحقق';
            feedback.className = 'feedback-message';
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(243, 156, 18, 0.2)';
            feedback.style.borderColor = 'var(--accent-yellow)';
        });
    });
    
    // Start timers for speed challenges
    stage.challenges.forEach((challenge, index) => {
        if (challenge.type === 'speed-challenge') {
            startSpeedTimer(challenge, index);
        }
    });
    
    // Submit buttons
    document.querySelectorAll('.submit-answer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const challengeIndex = parseInt(e.target.dataset.challenge);
            const challengeType = e.target.dataset.type;
            checkAnswer(stage, challengeIndex, challengeType);
        });
    });
}

// Start Speed Timer
function startSpeedTimer(challenge, index) {
    let timeLeft = challenge.timeLimit;
    const timerDisplay = document.getElementById(`timer-${index}`);
    
    challengeTimers[`timer-${index}`] = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 3) {
            timerDisplay.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(challengeTimers[`timer-${index}`]);
            timerDisplay.textContent = '⏰ انتهى الوقت!';
            
            // Disable submit button
            const submitBtn = document.querySelector(`[data-challenge="${index}"]`);
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            }
            
            const feedback = document.getElementById(`feedback-${index}`);
            feedback.className = 'feedback-message error';
            feedback.textContent = '⏰ انتهى الوقت! لم تحصل على نقاط هذا التحدي';
            feedback.style.display = 'block';
        }
    }, 1000);
}

// Check Answer
async function checkAnswer(stage, challengeIndex, challengeType) {
    const challenge = stage.challenges[challengeIndex];
    const feedbackDiv = document.getElementById(`feedback-${challengeIndex}`);
    let isCorrect = false;
    let userAnswer = '';
    
    switch (challengeType) {
        case 'quiz':
        case 'speed-challenge':
            const selectedOption = document.querySelector(`.quiz-option[data-challenge="${challengeIndex}"].selected`);
            if (!selectedOption) {
                alert('الرجاء اختيار إجابة');
                return;
            }
            const selectedIndex = parseInt(selectedOption.dataset.option);
            isCorrect = selectedIndex === challenge.correctAnswer;
            break;
            
        case 'puzzle':
            const input = document.getElementById(`puzzle-${challengeIndex}`);
            userAnswer = input.value.trim();
            
            if (!userAnswer) {
                alert('الرجاء إدخال إجابة');
                return;
            }
            
            if (challenge.caseSensitive === false) {
                isCorrect = userAnswer.toLowerCase() === challenge.correctAnswer.toLowerCase();
            } else {
                isCorrect = userAnswer === challenge.correctAnswer;
            }
            break;
            
        case 'image-hunt':
            const imageAnswer = document.getElementById(`image-hunt-answer-${challengeIndex}`).value;
            if (!imageAnswer) {
                alert('الرجاء النقر على منطقة في الصورة');
                return;
            }
            const hotspotIndex = parseInt(imageAnswer);
            isCorrect = challenge.hotspots[hotspotIndex].isCorrect;
            if (!isCorrect) {
                feedbackDiv.textContent = challenge.hotspots[hotspotIndex].feedback;
            }
            break;
            
        case 'code-puzzle':
            const codeInput = document.getElementById(`code-${challengeIndex}`);
            userAnswer = codeInput.value.trim();
            
            if (!userAnswer) {
                alert('الرجاء إدخال الإجابة في الكود');
                return;
            }
            
            isCorrect = challenge.possibleAnswers.some(ans => 
                ans.toLowerCase() === userAnswer.toLowerCase()
            );
            break;
            
        case 'map-quest':
            const mapAnswer = document.getElementById(`map-answer-${challengeIndex}`).value;
            if (!mapAnswer) {
                alert('الرجاء تحديد موقع على الخريطة');
                return;
            }
            const locationIndex = parseInt(mapAnswer);
            isCorrect = challenge.locations[locationIndex].isCorrect;
            if (!isCorrect) {
                feedbackDiv.textContent = challenge.locations[locationIndex].feedback;
            }
            break;
    }
    
    // Stop timer if speed challenge
    if (challengeType === 'speed-challenge' && challengeTimers[`timer-${challengeIndex}`]) {
        clearInterval(challengeTimers[`timer-${challengeIndex}`]);
    }
    
    // Update progress
    const stageProgress = currentPlayer.progress.find(p => p.stageId === stage.id);
    stageProgress.attempts++;
    
    if (isCorrect) {
        let pointsEarned = challenge.points;
        
        // Bonus points for speed challenge
        if (challengeType === 'speed-challenge') {
            const timerDisplay = document.getElementById(`timer-${challengeIndex}`);
            const timeLeft = parseInt(timerDisplay.textContent);
            if (timeLeft > challenge.timeLimit / 2) {
                pointsEarned += challenge.bonusPoints;
                feedbackDiv.textContent = `🎉 رائع! إجابة سريعة وصحيحة! حصلت على ${pointsEarned} نقطة (${challenge.bonusPoints} نقطة إضافية)`;
            } else {
                feedbackDiv.textContent = `✓ إجابة صحيحة! حصلت على ${pointsEarned} نقطة`;
            }
        } else {
            feedbackDiv.textContent = `✓ إجابة صحيحة! حصلت على ${pointsEarned} نقطة`;
        }
        
        feedbackDiv.className = 'feedback-message success';
        feedbackDiv.style.display = 'block';
        
        if (!stageProgress.completedChallenges.includes(challengeIndex)) {
            stageProgress.completedChallenges.push(challengeIndex);
            stageProgress.score += pointsEarned;
        }
        
        // Check if stage is completed
        if (stageProgress.completedChallenges.length === stage.challenges.length) {
            stageProgress.completed = true;
        }
        
        // Save to Firestore
        showLoading(true);
        try {
            await updateDoc(doc(db, 'players', currentPlayer.email), {
                progress: currentPlayer.progress,
                lastActive: new Date().toISOString()
            });
            
            if (stageProgress.completed && stageProgress.completedChallenges.length === stage.challenges.length) {
                setTimeout(() => {
                    showStageCompletionMessage(stage, stageProgress.score);
                }, 1500);
            }
            
            showLoading(false);
            updatePlayerInfo();
            
            setTimeout(() => {
                loadStage(stage.id);
            }, 2000);
        } catch (error) {
            console.error('Error saving progress:', error);
            showLoading(false);
            alert('حدث خطأ أثناء حفظ التقدم');
        }
    } else {
        if (!feedbackDiv.textContent) {
            feedbackDiv.textContent = '✗ إجابة خاطئة، حاول مرة أخرى';
        }
        feedbackDiv.className = 'feedback-message error';
        feedbackDiv.style.display = 'block';
        
        // Save attempt count
        showLoading(true);
        try {
            await updateDoc(doc(db, 'players', currentPlayer.email), {
                progress: currentPlayer.progress,
                lastActive: new Date().toISOString()
            });
            showLoading(false);
        } catch (error) {
            console.error('Error saving attempt:', error);
            showLoading(false);
        }
    }
}

// Show stage completion message
function showStageCompletionMessage(stage, score) {
    const completedStages = currentPlayer.progress.filter(p => p.completed).length;
    
    let message = `🎉 تهانينا! أكملت ${stage.title}\n\n`;
    message += `حصلت على ${score} نقطة في هذه المرحلة\n\n`;
    
    if (completedStages === stages.length) {
        message += `🏆 رائع! أكملت جميع المراحل!\n`;
        message += `أنت الآن من أوائل المتسابقين\n`;
        message += `تابع لوحة المتصدرين لمعرفة ترتيبك النهائي`;
    } else {
        message += `أكملت ${completedStages} من ${stages.length} مرحلة\n`;
        message += `استمر لإكمال المراحل المتبقية!`;
    }
    
    alert(message);
    renderStages();
}

// Show leaderboard
async function showLeaderboard() {
    showLoading(true);
    const modal = document.getElementById('leaderboardModal');
    const tbody = document.getElementById('leaderboardBody');
    
    try {
        const leaderboard = await getLeaderboard();
        tbody.innerHTML = '';
        
        leaderboard.forEach((player, index) => {
            const row = document.createElement('tr');
            
            let rankDisplay = index + 1;
            if (index === 0) rankDisplay = '🥇';
            else if (index === 1) rankDisplay = '🥈';
            else if (index === 2) rankDisplay = '🥉';
            
            const isCurrentPlayer = player.email === currentPlayer.email;
            if (isCurrentPlayer) {
                row.style.background = 'rgba(46, 204, 113, 0.2)';
                row.style.fontWeight = '700';
            }
            
            row.innerHTML = `
                <td class="rank-medal">${rankDisplay}</td>
                <td>${player.name}${isCurrentPlayer ? ' (أنت)' : ''}</td>
                <td>${player.completedStages} / ${stages.length}</td>
                <td>${player.totalScore}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        showLoading(false);
        modal.classList.add('active');
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showLoading(false);
        alert('حدث خطأ أثناء تحميل لوحة المتصدرين');
    }
}

// Admin functions
async function showAdminPanel() {
    const modal = document.getElementById('adminModal');
    modal.classList.add('active');
    
    showLoading(true);
    await updateParticipantsList();
    await updateProgressStats();
    showLoading(false);
}

async function updateParticipantsList() {
    const container = document.getElementById('participantsList');
    
    try {
        const players = await getAllPlayers();
        
        if (players.length === 0) {
            container.innerHTML = '<p>لا يوجد مشاركون بعد</p>';
            return;
        }
        
        let html = '<table class="leaderboard-table"><thead><tr>';
        html += '<th>الاسم</th><th>البريد</th><th>الهاتف</th><th>تاريخ التسجيل</th><th>المراحل</th><th>النقاط</th>';
        html += '</tr></thead><tbody>';
        
        players.forEach(player => {
            const completedStages = player.progress.filter(p => p.completed).length;
            const totalScore = player.progress.reduce((sum, p) => sum + p.score, 0);
            const regDate = new Date(player.registrationDate).toLocaleDateString('ar-EG');
            
            html += '<tr>';
            html += `<td>${player.name}</td>`;
            html += `<td>${player.email}</td>`;
            html += `<td>${player.phone || 'غير محدد'}</td>`;
            html += `<td>${regDate}</td>`;
            html += `<td>${completedStages}/${stages.length}</td>`;
            html += `<td>${totalScore}</td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading participants:', error);
        container.innerHTML = '<p>حدث خطأ أثناء تحميل البيانات</p>';
    }
}

async function updateProgressStats() {
    const container = document.getElementById('progressStats');
    
    try {
        const players = await getAllPlayers();
        
        let html = '<div style="margin: 2rem 0;">';
        html += `<h4>إحصائيات عامة</h4>`;
        html += `<p>إجمالي المشاركين: ${players.length}</p>`;
        
        stages.forEach(stage => {
            const completedCount = players.filter(p => 
                p.progress.find(prog => prog.stageId === stage.id && prog.completed)
            ).length;
            
            const percentage = players.length > 0 ? ((completedCount / players.length) * 100).toFixed(1) : 0;
            
            html += `
                <div style="margin: 1.5rem 0; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <strong>${stage.icon} ${stage.title}</strong><br>
                    أكمله: ${completedCount} من ${players.length} (${percentage}%)
                    <div style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; margin-top: 0.5rem;">
                        <div style="background: var(--primary-green); height: 100%; width: ${percentage}%; border-radius: 5px;"></div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading progress stats:', error);
        container.innerHTML = '<p>حدث خطأ أثناء تحميل الإحصائيات</p>';
    }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'participants') updateParticipantsList();
    if (tabName === 'progress') updateProgressStats();
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function updateCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    
    const nextUnlock = getNextUnlockDate();
    if (!nextUnlock) {
        countdownEl.textContent = 'جميع المراحل متاحة!';
        return;
    }
    
    const now = new Date();
    const diff = nextUnlock - now;
    
    if (diff <= 0) {
        countdownEl.textContent = 'المرحلة متاحة الآن!';
        if (currentPlayer) renderStages();
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownEl.textContent = `${days} يوم ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
}

// Firebase helper functions
async function getCurrentPlayer(email) {
    try {
        const playerDoc = await getDoc(doc(db, 'players', email));
        if (playerDoc.exists()) {
            return playerDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting player:', error);
        return null;
    }
}

async function getAllPlayers() {
    try {
        const playersSnapshot = await getDocs(collection(db, 'players'));
        return playersSnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error getting all players:', error);
        return [];
    }
}

async function getLeaderboard() {
    try {
        const players = await getAllPlayers();
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
    } catch (error) {
        console.error('Error calculating leaderboard:', error);
        return [];
    }
}

async function exportGameData() {
    showLoading(true);
    try {
        const players = await getAllPlayers();
        const gameData = {
            players: players,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(gameData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lybotics_interactive_game_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showLoading(false);
        alert('تم تصدير البيانات بنجاح!');
    } catch (error) {
        console.error('Error exporting data:', error);
        showLoading(false);
        alert('حدث خطأ أثناء تصدير البيانات');
    }
}
