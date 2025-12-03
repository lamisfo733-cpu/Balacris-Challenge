// Stage 8 Interactive Games Logic
// هذا الملف يحتوي على منطق الألعاب التفاعلية للمرحلة الثامنة

// ===== Mario Game Logic =====
class MarioGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 500;
        this.canvas.height = 400;
        
        this.mario = {
            x: 50,
            y: 300,
            width: 40,
            height: 40,
            velocityY: 0,
            isJumping: false,
            score: 0
        };
        
        this.gravity = 0.5;
        this.jumpPower = -12;
        this.coins = [];
        this.gameRunning = false;
        this.codeFixed = false;
        
        this.setupControls();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameRunning) {
                this.jump();
            }
        });
    }
    
    jump() {
        if (!this.mario.isJumping && this.codeFixed) {
            this.mario.velocityY = this.jumpPower;
            this.mario.isJumping = true; // هذا هو السطر الصحيح!
        }
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // تطبيق الجاذبية
        this.mario.velocityY += this.gravity;
        this.mario.y += this.mario.velocityY;
        
        // التحقق من الأرض
        if (this.mario.y >= 300) {
            this.mario.y = 300;
            this.mario.velocityY = 0;
            this.mario.isJumping = false;
        }
        
        // تحديث العملات
        for (let i = this.coins.length - 1; i >= 0; i--) {
            this.coins[i].x -= 3;
            
            // جمع العملات
            if (this.checkCollision(this.mario, this.coins[i])) {
                this.mario.score += 10;
                this.coins.splice(i, 1);
            }
            
            // حذف العملات خارج الشاشة
            if (this.coins[i] && this.coins[i].x < -20) {
                coins.splice(i, 1);
            }
        }
        
        // إضافة عملات جديدة
        if (Math.random() < 0.02) {
            this.coins.push({
                x: 500, 
                y: Math.random() * 200 + 100, 
                width: 20, 
                height: 20
            });
        }
    }
    
    draw() {
        // مسح الشاشة
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // رسم الأرض
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 340, this.canvas.width, 60);
        
        // رسم العشب
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, 340, this.canvas.width, 10);
        
        // رسم Mario
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(this.mario.x, this.mario.y, this.mario.width, this.mario.height);
        
        // رسم عيون Mario
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.mario.x + 10, this.mario.y + 10, 8, 8);
        this.ctx.fillRect(this.mario.x + 22, this.mario.y + 10, 8, 8);
        
        // رسم العملات
        this.coins.forEach(coin => {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
            this.ctx.fill();
            
            // رسم علامة العملة
            this.ctx.fillStyle = '#FFA500';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText('$', coin.x + 5, coin.y + 16);
        });
        
        // رسم النقاط
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 20px Cairo';
        this.ctx.fillText(`النقاط: ${this.mario.score}`, 10, 30);
        
        // رسم التعليمات
        if (!this.codeFixed) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 24px Cairo';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('أصلح الكود أولاً!', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '16px Cairo';
            this.ctx.fillText('ابحث عن الخطأ في دالة القفز', this.canvas.width / 2, this.canvas.height / 2 + 30);
            this.ctx.textAlign = 'right';
        }
        
        // رسم رسالة الفوز
        if (this.mario.score >= 50) {
            this.ctx.fillStyle = 'rgba(46, 204, 113, 0.9)';
            this.ctx.fillRect(50, 150, 400, 100);
            
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 30px Cairo';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎉 مبروك! فزت باللعبة!', this.canvas.width / 2, 200);
            this.ctx.font = '20px Cairo';
            this.ctx.fillText('حصلت على 50 نقطة', this.canvas.width / 2, 230);
            this.ctx.textAlign = 'right';
            
            this.gameRunning = false;
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    start() {
        this.gameRunning = true;
        this.gameLoop();
    }
    
    stop() {
        this.gameRunning = false;
    }
    
    reset() {
        this.mario = {
            x: 50,
            y: 300,
            width: 40,
            height: 40,
            velocityY: 0,
            isJumping: false,
            score: 0
        };
        this.coins = [];
    }
    
    fixCode() {
        this.codeFixed = true;
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ===== Code Editor Logic =====
function createCodeEditor(challenge, challengeIndex) {
    const editorHTML = `
        <div class="code-game-container">
            <div class="code-instructions">
                <h4>📝 المهمة:</h4>
                <p>${challenge.instructions}</p>
                <p><strong>💡 تلميح:</strong> ${challenge.hint}</p>
            </div>
            
            <div class="code-editor-section">
                <h4>محرر الكود:</h4>
                <textarea id="codeEditor-${challengeIndex}" class="code-editor">${challenge.gameCode}</textarea>
                
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button class="btn-primary" onclick="checkCodeFix(${challengeIndex})">
                        ✅ تحقق من التعديل
                    </button>
                    <button class="btn-secondary" onclick="resetCode(${challengeIndex})">
                        🔄 إعادة تعيين
                    </button>
                </div>
                
                <div id="codeResult-${challengeIndex}" class="code-result"></div>
            </div>
            
            <div class="game-canvas-section">
                <h4>🎮 اللعبة:</h4>
                <canvas id="marioCanvas-${challengeIndex}"></canvas>
                <p style="text-align: center; margin-top: 1rem; color: var(--text-gray);">
                    اضغط SPACE للقفز | الهدف: اجمع 50 نقطة
                </p>
            </div>
        </div>
    `;
    
    return editorHTML;
}

// التحقق من التعديل في الكود
function checkCodeFix(challengeIndex) {
    const editor = document.getElementById(`codeEditor-${challengeIndex}`);
    const code = editor.value;
    const resultDiv = document.getElementById(`codeResult-${challengeIndex}`);
    
    const stage = stages.find(s => s.id === 8);
    const challenge = stage.challenges[challengeIndex];
    
    // التحقق من أن السطر الخاطئ تم تغييره
    if (code.includes(challenge.wrongLine)) {
        resultDiv.className = 'code-result error';
        resultDiv.innerHTML = `
            ❌ <strong>الكود لا يزال يحتوي على خطأ!</strong><br>
            ابحث عن السطر: <code>${challenge.wrongLine}</code><br>
            يجب تغييره إلى: <code>${challenge.correctFix}</code>
        `;
        return false;
    }
    
    // التحقق من أن التعديل الصحيح موجود
    if (code.includes(challenge.correctFix)) {
        resultDiv.className = 'code-result success';
        resultDiv.innerHTML = `
            ✅ <strong>ممتاز! أصلحت الكود بنجاح!</strong><br>
            الآن يمكنك لعب اللعبة. اضغط SPACE للقفز واجمع 50 نقطة!
        `;
        
        // تفعيل اللعبة
        if (window.marioGame) {
            window.marioGame.fixCode();
            window.marioGame.start();
        }
        
        return true;
    } else {
        resultDiv.className = 'code-result error';
        resultDiv.innerHTML = `
            ❌ <strong>التعديل غير صحيح!</strong><br>
            تأكد من كتابة السطر الصحيح: <code>${challenge.correctFix}</code>
        `;
        return false;
    }
}

// إعادة تعيين الكود
function resetCode(challengeIndex) {
    const stage = stages.find(s => s.id === 8);
    const challenge = stage.challenges[challengeIndex];
    const editor = document.getElementById(`codeEditor-${challengeIndex}`);
    
    editor.value = challenge.gameCode;
    
    const resultDiv = document.getElementById(`codeResult-${challengeIndex}`);
    resultDiv.innerHTML = '';
    
    if (window.marioGame) {
        window.marioGame.stop();
        window.marioGame.reset();
        window.marioGame.codeFixed = false;
    }
}

// التحقق من اكتمال لعبة Mario
function checkMarioGameCompletion() {
    if (window.marioGame && window.marioGame.mario.score >= 50) {
        return true;
    }
    return false;
}

// إنشاء لغز الكلمات السرية
function createSecretWordPuzzle(challenge, challengeIndex) {
    const puzzleHTML = `
        <div class="secret-word-puzzle">
            <div class="puzzle-instructions">
                <h4>🔐 ${challenge.question}</h4>
                <p><strong>💡 تلميح:</strong> ${challenge.hint}</p>
                <p style="color: var(--accent-yellow); margin-top: 1rem;">
                    ${challenge.instructions}
                </p>
            </div>
            
            <div class="secret-words-display">
                <h5 style="text-align: center; margin-bottom: 1rem;">الكلمات السرية من المراحل السابقة:</h5>
                <div class="secret-words-grid">
                    ${generateSecretWordsDisplay()}
                </div>
            </div>
            
            <div class="answer-section">
                <input type="text" 
                       id="secretWordInput-${challengeIndex}" 
                       class="puzzle-input" 
                       placeholder="أدخل الأحرف الأولى مجتمعة..."
                       style="text-transform: uppercase;">
                <button class="submit-answer" onclick="checkSecretWord(${challengeIndex})">
                    إرسال الإجابة
                </button>
            </div>
        </div>
    `;
    
    return puzzleHTML;
}

// عرض الكلمات السرية
function generateSecretWordsDisplay() {
    let html = '';
    for (let i = 1; i <= 7; i++) {
        const stage = stages.find(s => s.id === i);
        const stageProgress = currentPlayer.progress.find(p => p.stageId === i);
        
        if (stageProgress && stageProgress.completed) {
            html += `
                <div class="secret-word-card completed">
                    <div class="stage-number">المرحلة ${i}</div>
                    <div class="secret-word">${stage.secretWord}</div>
                    <div class="first-letter">الحرف الأول: <strong>${stage.secretWord[0]}</strong></div>
                </div>
            `;
        } else {
            html += `
                <div class="secret-word-card locked">
                    <div class="stage-number">المرحلة ${i}</div>
                    <div class="secret-word">🔒 مقفل</div>
                    <div class="hint">أكمل المرحلة ${i} أولاً</div>
                </div>
            `;
        }
    }
    return html;
}

// التحقق من الكلمة السرية
function checkSecretWord(challengeIndex) {
    const input = document.getElementById(`secretWordInput-${challengeIndex}`);
    const userAnswer = input.value.trim().toUpperCase();
    
    const stage = stages.find(s => s.id === 8);
    const challenge = stage.challenges[challengeIndex];
    
    if (userAnswer === challenge.correctAnswer.toUpperCase()) {
        return true;
    }
    
    return false;
}

// إنشاء اللغز الذكي
function createSmartPuzzle(challenge, challengeIndex) {
    const puzzleHTML = `
        <div class="smart-puzzle">
            <div class="puzzle-question">
                <h4>${challenge.question}</h4>
                <p style="color: var(--text-gray); margin-top: 1rem;">
                    <strong>💡 تلميح:</strong> ${challenge.hint}
                </p>
            </div>
            
            <div class="answer-section">
                <input type="text" 
                       id="smartPuzzleInput-${challengeIndex}" 
                       class="puzzle-input" 
                       placeholder="أدخل إجابتك هنا...">
                <button class="submit-answer" data-challenge="${challengeIndex}">
                    إرسال الإجابة
                </button>
            </div>
        </div>
    `;
    
    return puzzleHTML;
}

// التحقق من اللغز الذكي
function checkSmartPuzzle(challengeIndex) {
    const input = document.getElementById(`smartPuzzleInput-${challengeIndex}`);
    const userAnswer = input.value.trim();
    
    const stage = stages.find(s => s.id === 8);
    const challenge = stage.challenges[challengeIndex];
    
    const normalizedAnswer = userAnswer.toLowerCase();
    const correctAnswer = challenge.correctAnswer.toLowerCase();
    
    // التحقق من الإجابة الصحيحة
    if (normalizedAnswer === correctAnswer) {
        return true;
    }
    
    // التحقق من الإجابات البديلة
    if (challenge.alternativeAnswers) {
        for (let alt of challenge.alternativeAnswers) {
            if (normalizedAnswer === alt.toLowerCase()) {
                return true;
            }
        }
    }
    
    return false;
}

// Export functions for global use
window.MarioGame = MarioGame;
window.createCodeEditor = createCodeEditor;
window.checkCodeFix = checkCodeFix;
window.resetCode = resetCode;
window.checkMarioGameCompletion = checkMarioGameCompletion;
window.createSecretWordPuzzle = createSecretWordPuzzle;
window.checkSecretWord = checkSecretWord;
window.createSmartPuzzle = createSmartPuzzle;
window.checkSmartPuzzle = checkSmartPuzzle;
