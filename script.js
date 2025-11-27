// Main Game Logic
let currentPlayer = null;
let currentStageId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    setupEventListeners();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// Check if user is logged in
function checkLoginStatus() {
    const email = localStorage.getItem('currentPlayerEmail');
    if (email) {
        currentPlayer = getCurrentPlayer();
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
function handleLogin(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    
    if (!name || !email) {
        alert('الرجاء إدخال الاسم والبريد الإلكتروني');
        return;
    }
    
    // Check if player exists
    let player = getAllPlayers().find(p => p.email === email);
    
    if (!player) {
        // Create new player
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
    } else {
        // Update existing player info
        player.name = name;
        player.phone = phone;
        player.lastActive = new Date().toISOString();
    }
    
    savePlayerData(player);
    localStorage.setItem('currentPlayerEmail', email);
    currentPlayer = player;
    
    showGameScreen();
}

// Handle logout
function handleLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
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
    
    // Scroll to content
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
            <h3>${isCompleted ? '✓ ' : ''}السؤال ${index + 1} ${isCompleted ? '(مكتمل)' : ''}</h3>
            <p style="font-size: 1.1rem; margin: 1rem 0;">${challenge.question}</p>
            <p style="color: var(--accent-yellow); margin: 0.5rem 0;">النقاط: ${challenge.points}</p>
        `;
        
        if (!isCompleted) {
            if (challenge.type === 'quiz') {
                challengeHTML += '<div class="quiz-options">';
                challenge.options.forEach((option, optIndex) => {
                    challengeHTML += `
                        <div class="quiz-option" data-challenge="${index}" data-option="${optIndex}">
                            ${option}
                        </div>
                    `;
                });
                challengeHTML += '</div>';
            } else if (challenge.type === 'puzzle') {
                challengeHTML += `
                    <input type="text" class="puzzle-input" id="puzzle-${index}" 
                           placeholder="أدخل إجابتك هنا..." />
                    ${challenge.hint ? `<p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 0.5rem;">💡 ${challenge.hint}</p>` : ''}
                `;
            }
            
            challengeHTML += `
                <button class="submit-answer" data-challenge="${index}">
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
    
    // Add event listeners
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const challengeIndex = e.target.dataset.challenge;
            document.querySelectorAll(`.quiz-option[data-challenge="${challengeIndex}"]`).forEach(opt => {
                opt.classList.remove('selected');
            });
            e.target.classList.add('selected');
        });
    });
    
    document.querySelectorAll('.submit-answer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const challengeIndex = parseInt(e.target.dataset.challenge);
            checkAnswer(stage, challengeIndex);
        });
    });
}

// Check answer
function checkAnswer(stage, challengeIndex) {
    const challenge = stage.challenges[challengeIndex];
    const feedbackDiv = document.getElementById(`feedback-${challengeIndex}`);
    let isCorrect = false;
    
    if (challenge.type === 'quiz') {
        const selectedOption = document.querySelector(`.quiz-option[data-challenge="${challengeIndex}"].selected`);
        if (!selectedOption) {
            alert('الرجاء اختيار إجابة');
            return;
        }
        const selectedIndex = parseInt(selectedOption.dataset.option);
        isCorrect = selectedIndex === challenge.correctAnswer;
    } else if (challenge.type === 'puzzle') {
        const input = document.getElementById(`puzzle-${challengeIndex}`);
        const userAnswer = input.value.trim();
        
        if (!userAnswer) {
            alert('الرجاء إدخال إجابة');
            return;
        }
        
        if (challenge.caseSensitive === false) {
            isCorrect = userAnswer.toLowerCase() === challenge.correctAnswer.toLowerCase();
        } else {
            isCorrect = userAnswer === challenge.correctAnswer;
        }
    }
    
    // Update progress
    const stageProgress = currentPlayer.progress.find(p => p.stageId === stage.id);
    stageProgress.attempts++;
    
    if (isCorrect) {
        feedbackDiv.className = 'feedback-message success';
        feedbackDiv.textContent = `✓ إجابة صحيحة! حصلت على ${challenge.points} نقطة`;
        feedbackDiv.style.display = 'block';
        
        if (!stageProgress.completedChallenges.includes(challengeIndex)) {
            stageProgress.completedChallenges.push(challengeIndex);
            stageProgress.score += challenge.points;
        }
        
        // Check if stage is completed
        if (stageProgress.completedChallenges.length === stage.challenges.length) {
            stageProgress.completed = true;
            setTimeout(() => {
                showStageCompletionMessage(stage, stageProgress.score);
            }, 1500);
        }
        
        savePlayerData(currentPlayer);
        updatePlayerInfo();
        
        // Reload stage after delay
        setTimeout(() => {
            loadStage(stage.id);
        }, 2000);
    } else {
        feedbackDiv.className = 'feedback-message error';
        feedbackDiv.textContent = '✗ إجابة خاطئة، حاول مرة أخرى';
        feedbackDiv.style.display = 'block';
        
        savePlayerData(currentPlayer);
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
function showLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    const tbody = document.getElementById('leaderboardBody');
    
    const leaderboard = getLeaderboard();
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
    
    modal.classList.add('active');
}

// Show admin panel
function showAdminPanel() {
    const modal = document.getElementById('adminModal');
    modal.classList.add('active');
    
    updateParticipantsList();
    updateProgressStats();
}

// Update participants list
function updateParticipantsList() {
    const container = document.getElementById('participantsList');
    const players = getAllPlayers();
    
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
}

// Update progress stats
function updateProgressStats() {
    const container = document.getElementById('progressStats');
    const players = getAllPlayers();
    
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
}

// Switch admin tab
function switchAdminTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'participants') updateParticipantsList();
    if (tabName === 'progress') updateProgressStats();
}

// Close all modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Update countdown
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
        renderStages(); // Refresh stages
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownEl.textContent = `${days} يوم ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
}