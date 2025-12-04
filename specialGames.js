// Special Interactive Games for Stages 8, 9, and 10
// Must be loaded after main script.js

// ============================================
// STAGE 8: Password Puzzle System
// ============================================

class PasswordPuzzle {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.collectedPasswords = [];
    }

    render(challenge, challengeIndex) {
        let html = `
            <div class="password-puzzle-container">
                <div class="puzzle-header">
                    <h3>🔐 ${challenge.question}</h3>
                    ${challenge.hint ? `<p class="hint">💡 ${challenge.hint}</p>` : ''}
                </div>
                <div class="password-input-group">
                    <input type="text" 
                           id="password-${challengeIndex}" 
                           class="password-input-field"
                           placeholder="أدخل الكود السري..."
                           autocomplete="off" />
                    <button class="submit-password-btn" data-challenge="${challengeIndex}">
                        تحقق من الكود
                    </button>
                </div>
                <div id="password-feedback-${challengeIndex}" class="feedback-message" style="display: none;"></div>
            </div>
        `;
        return html;
    }

    checkPassword(userAnswer, correctAnswer, challengeIndex) {
        const feedback = document.getElementById(`password-feedback-${challengeIndex}`);
        const input = document.getElementById(`password-${challengeIndex}`);
        
        const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        
        if (isCorrect) {
            feedback.className = 'feedback-message success';
            feedback.innerHTML = '✓ كود صحيح! تم حفظه في ذاكرتك 🎉';
            feedback.style.display = 'block';
            input.disabled = true;
            this.collectedPasswords.push(userAnswer);
            return true;
        } else {
            feedback.className = 'feedback-message error';
            feedback.innerHTML = '✗ كود خاطئ! راجع المراحل السابقة 🔍';
            feedback.style.display = 'block';
            return false;
        }
    }
}

// ============================================
// STAGE 9: Platform Game (Mario-style)
// ============================================

class PlatformGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Game state
        this.player = {
            x: 50,
            y: 300,
            width: 40,
            height: 40,
            velocityY: 0,
            velocityX: 0,
            isJumping: false,
            collected: 0
        };
        
        this.gravity = 0.6;
        this.jumpPower = 15;
        this.moveSpeed = 5;
        this.gameStarted = false;
        this.gameWon = false;
        this.codeFix = false;
        
        // Collectibles (gears)
        this.collectibles = [];
        this.generateCollectibles();
        
        // Obstacles
        this.obstacles = [];
        this.generateObstacles();
        
        // Platforms
        this.platforms = [
            { x: 0, y: 360, width: 800, height: 40 }, // Ground
            { x: 200, y: 280, width: 150, height: 20 },
            { x: 450, y: 200, width: 150, height: 20 },
            { x: 650, y: 280, width: 150, height: 20 }
        ];
        
        // Controls
        this.keys = {};
        this.setupControls();
    }
    
    generateCollectibles() {
        const positions = [
            { x: 150, y: 250 },
            { x: 250, y: 200 },
            { x: 350, y: 150 },
            { x: 500, y: 150 },
            { x: 600, y: 250 },
            { x: 700, y: 200 },
            { x: 300, y: 300 },
            { x: 550, y: 300 },
            { x: 400, y: 100 },
            { x: 750, y: 250 }
        ];
        
        positions.forEach(pos => {
            this.collectibles.push({
                x: pos.x,
                y: pos.y,
                width: 25,
                height: 25,
                collected: false
            });
        });
    }
    
    generateObstacles() {
        const positions = [
            { x: 300, y: 340 },
            { x: 500, y: 340 },
            { x: 400, y: 260 },
            { x: 600, y: 180 }
        ];
        
        positions.forEach(pos => {
            this.obstacles.push({
                x: pos.x,
                y: pos.y,
                width: 30,
                height: 30
            });
        });
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Jump
            if ((e.key === ' ' || e.key === 'ArrowUp') && !this.player.isJumping) {
                this.player.velocityY = -this.jumpPower;
                this.player.isJumping = true;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    update() {
        if (!this.gameStarted || this.gameWon) return;
        
        // Horizontal movement
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.velocityX = this.moveSpeed;
        } else if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.velocityX = -this.moveSpeed;
        } else {
            this.player.velocityX = 0;
        }
        
        // Apply gravity
        this.player.velocityY += this.gravity;
        
        // Update position
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // Boundary check
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.width;
        }
        
        // Platform collision
        this.player.isJumping = true;
        this.platforms.forEach(platform => {
            if (this.checkCollision(this.player, platform)) {
                if (this.player.velocityY > 0) {
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.isJumping = false;
                }
            }
        });
        
        // Collectible collision
        this.collectibles.forEach(item => {
            if (!item.collected && this.checkCollision(this.player, item)) {
                item.collected = true;
                this.player.collected++;
            }
        });
        
        // Obstacle collision (only matters if code is not fixed)
        if (!this.codeFix) {
            this.obstacles.forEach(obstacle => {
                if (this.checkCollision(this.player, obstacle)) {
                    this.player.x = 50;
                    this.player.y = 300;
                    this.player.velocityY = 0;
                }
            });
        }
        
        // Win condition
        if (this.player.collected >= 10 && this.codeFix) {
            this.gameWon = true;
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw platforms
        this.ctx.fillStyle = '#2ecc71';
        this.platforms.forEach(platform => {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // Draw collectibles
        this.ctx.font = '25px Arial';
        this.collectibles.forEach(item => {
            if (!item.collected) {
                this.ctx.fillText('⚙️', item.x, item.y + 20);
            }
        });
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillText('🚧', obstacle.x, obstacle.y + 25);
        });
        
        // Draw player (LYBOTICS robot)
        this.ctx.font = '40px Arial';
        this.ctx.fillText('🤖', this.player.x, this.player.y + 35);
        
        // Draw UI
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Cairo';
        this.ctx.fillText(`القطع المجمعة: ${this.player.collected}/10`, 10, 30);
        
        if (!this.codeFix) {
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.fillText('⚠️ أصلح الكود أولاً!', 10, 60);
        }
        
        if (this.gameWon) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#2ecc71';
            this.ctx.font = '40px Cairo';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎉 أحسنت! فزت باللعبة!', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.textAlign = 'right';
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    start() {
        this.gameStarted = true;
        this.gameLoop();
    }
    
    setCodeFixed(fixed) {
        this.codeFix = fixed;
    }
}

// Code Fix Challenge for Stage 9
class CodeFixChallenge {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    
    render(challenge) {
        return `
            <div class="code-fix-container">
                <h3>🐛 أصلح الكود لمساعدة الروبوت!</h3>
                <div class="code-display">
                    <pre><code>${challenge.brokenCode}</code></pre>
                </div>
                <p class="code-hint">💡 ${challenge.hint}</p>
                <div class="code-input-group">
                    <input type="text" 
                           id="code-fix-input" 
                           class="code-input-field"
                           placeholder="اكتب السطر الصحيح هنا..."
                           autocomplete="off" />
                    <button class="submit-code-btn" id="submitCodeFix">
                        إصلاح الكود
                    </button>
                </div>
                <div id="code-feedback" class="feedback-message" style="display: none;"></div>
            </div>
        `;
    }
    
    checkFix(userCode, correctCode) {
        const feedback = document.getElementById('code-feedback');
        const normalized1 = userCode.toLowerCase().replace(/\s+/g, '');
        const normalized2 = correctCode.toLowerCase().replace(/\s+/g, '');
        
        if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
            feedback.className = 'feedback-message success';
            feedback.innerHTML = '✓ أحسنت! الكود يعمل الآن! 🎉';
            feedback.style.display = 'block';
            return true;
        } else {
            feedback.className = 'feedback-message error';
            feedback.innerHTML = '✗ الكود لا يزال به خطأ. حاول مرة أخرى!';
            feedback.style.display = 'block';
            return false;
        }
    }
}

// ============================================
// STAGE 10: Robot Lab System
// ============================================

class RobotLab {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.selectedComponents = [];
        this.programmingBlocks = [];
        this.robotDesign = null;
    }
    
    renderComponentSelector(challenge) {
        let html = `
            <div class="robot-lab-container">
                <h3>🔧 صمم روبوتك</h3>
                <p>${challenge.question}</p>
                <div class="components-grid">
        `;
        
        challenge.components.forEach((comp, index) => {
            const component = robotLabComponents.parts.find(p => p.name === comp);
            if (component) {
                html += `
                    <div class="component-card" data-component="${index}">
                        <div class="component-icon">${component.icon}</div>
                        <div class="component-name">${component.name}</div>
                        <div class="component-desc">${component.description}</div>
                    </div>
                `;
            }
        });
        
        html += `
                </div>
                <div class="selected-components">
                    <h4>المكونات المختارة: <span id="selectedCount">0</span>/${challenge.minComponents}</h4>
                    <div id="selectedList"></div>
                </div>
                <button class="submit-design-btn" id="submitDesign" disabled>
                    تأكيد التصميم
                </button>
            </div>
        `;
        
        return html;
    }
    
    renderBlockProgramming(challenge) {
        let html = `
            <div class="block-programming-container">
                <h3>💻 برمج روبوتك</h3>
                <p>${challenge.question}</p>
                <div class="blocks-palette">
        `;
        
        robotLabComponents.programmingBlocks.forEach((block, index) => {
            html += `
                <div class="programming-block" 
                     data-block="${index}"
                     style="background: ${block.color};">
                    ${block.icon} ${block.name}
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="programming-workspace" id="workspace">
                    <p class="workspace-hint">اسحب الكتل البرمجية هنا لإنشاء البرنامج</p>
                </div>
                <button class="run-program-btn" id="runProgram">
                    ▶️ شغّل البرنامج
                </button>
                <div id="program-feedback" class="feedback-message" style="display: none;"></div>
            </div>
        `;
        
        return html;
    }
    
    renderSimulation() {
        return `
            <div class="simulation-container">
                <h3>🎮 اختبار المحاكاة</h3>
                <canvas id="robotSimCanvas" width="600" height="400"></canvas>
                <div class="simulation-stats">
                    <p>الكرات المجمعة: <span id="ballsCollected">0</span>/5</p>
                    <p>الوقت المتبقي: <span id="timeLeft">60</span>s</p>
                </div>
                <button class="start-sim-btn" id="startSimulation">
                    بدء المحاكاة
                </button>
                <div id="sim-feedback" class="feedback-message" style="display: none;"></div>
            </div>
        `;
    }
    
    setupComponentSelection(challenge) {
        const cards = document.querySelectorAll('.component-card');
        const selectedList = document.getElementById('selectedList');
        const selectedCount = document.getElementById('selectedCount');
        const submitBtn = document.getElementById('submitDesign');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const compIndex = parseInt(card.dataset.component);
                const compName = challenge.components[compIndex];
                
                if (card.classList.contains('selected')) {
                    card.classList.remove('selected');
                    this.selectedComponents = this.selectedComponents.filter(c => c !== compName);
                } else {
                    card.classList.add('selected');
                    this.selectedComponents.push(compName);
                }
                
                // Update UI
                selectedCount.textContent = this.selectedComponents.length;
                selectedList.innerHTML = this.selectedComponents.map(c => `<span class="selected-tag">${c}</span>`).join('');
                
                // Enable submit if min reached
                if (this.selectedComponents.length >= challenge.minComponents) {
                    submitBtn.disabled = false;
                } else {
                    submitBtn.disabled = true;
                }
            });
        });
    }
    
    setupBlockProgramming() {
        const blocks = document.querySelectorAll('.programming-block');
        const workspace = document.getElementById('workspace');
        
        blocks.forEach(block => {
            block.draggable = true;
            
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('blockIndex', block.dataset.block);
            });
        });
        
        workspace.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        workspace.addEventListener('drop', (e) => {
            e.preventDefault();
            const blockIndex = e.dataTransfer.getData('blockIndex');
            const blockData = robotLabComponents.programmingBlocks[blockIndex];
            
            const blockElement = document.createElement('div');
            blockElement.className = 'workspace-block';
            blockElement.style.background = blockData.color;
            blockElement.innerHTML = `${blockData.icon} ${blockData.name} <span class="remove-block">✖</span>`;
            
            blockElement.querySelector('.remove-block').addEventListener('click', () => {
                blockElement.remove();
                this.programmingBlocks = Array.from(workspace.querySelectorAll('.workspace-block'))
                    .map(b => b.textContent.replace('✖', '').trim());
            });
            
            workspace.appendChild(blockElement);
            this.programmingBlocks.push(blockData.name);
        });
    }
}

// Robot Simulation for Stage 10
class RobotSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.robot = { x: 50, y: 50, angle: 0, size: 30 };
        this.balls = [];
        this.obstacles = [];
        this.collected = 0;
        this.timeLeft = 60;
        this.running = false;
        
        this.generateBalls();
        this.generateObstacles();
    }
    
    generateBalls() {
        for (let i = 0; i < 5; i++) {
            this.balls.push({
                x: Math.random() * 500 + 50,
                y: Math.random() * 300 + 50,
                size: 15,
                collected: false
            });
        }
    }
    
    generateObstacles() {
        for (let i = 0; i < 3; i++) {
            this.obstacles.push({
                x: Math.random() * 400 + 100,
                y: Math.random() * 250 + 75,
                width: 50,
                height: 50
            });
        }
    }
    
    update(program) {
        if (!this.running) return;
        
        // Simple AI movement based on program
        if (program.includes('حرك إلى الأمام')) {
            const dx = Math.cos(this.robot.angle) * 2;
            const dy = Math.sin(this.robot.angle) * 2;
            this.robot.x += dx;
            this.robot.y += dy;
        }
        
        // Check collision with balls
        this.balls.forEach(ball => {
            if (!ball.collected) {
                const dist = Math.hypot(this.robot.x - ball.x, this.robot.y - ball.y);
                if (dist < this.robot.size + ball.size) {
                    ball.collected = true;
                    this.collected++;
                }
            }
        });
        
        // Boundary check
        if (this.robot.x < 0 || this.robot.x > this.canvas.width ||
            this.robot.y < 0 || this.robot.y > this.canvas.height) {
            this.robot.x = 50;
            this.robot.y = 50;
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#16213e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw obstacles
        this.ctx.fillStyle = '#e74c3c';
        this.obstacles.forEach(obs => {
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
        
        // Draw balls
        this.balls.forEach(ball => {
            if (!ball.collected) {
                this.ctx.fillStyle = '#2ecc71';
                this.ctx.beginPath();
                this.ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Draw robot
        this.ctx.fillStyle = '#3498db';
        this.ctx.save();
        this.ctx.translate(this.robot.x, this.robot.y);
        this.ctx.rotate(this.robot.angle);
        this.ctx.fillRect(-this.robot.size/2, -this.robot.size/2, this.robot.size, this.robot.size);
        this.ctx.restore();
    }
    
    start(program) {
        this.running = true;
        const timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timeLeft').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0 || this.collected >= 5) {
                this.running = false;
                clearInterval(timer);
                this.showResult();
            }
        }, 1000);
        
        const gameLoop = () => {
            if (this.running) {
                this.update(program);
                this.draw();
                document.getElementById('ballsCollected').textContent = this.collected;
                requestAnimationFrame(gameLoop);
            }
        };
        gameLoop();
    }
    
    showResult() {
        const feedback = document.getElementById('sim-feedback');
        if (this.collected >= 5) {
            feedback.className = 'feedback-message success';
            feedback.innerHTML = '✓ نجح الروبوت في جمع جميع الكرات! 🎉';
        } else {
            feedback.className = 'feedback-message error';
            feedback.innerHTML = `✗ جمع الروبوت ${this.collected}/5 كرات فقط. حاول تحسين البرنامج!`;
        }
        feedback.style.display = 'block';
    }
}

// Export classes
window.PasswordPuzzle = PasswordPuzzle;
window.PlatformGame = PlatformGame;
window.CodeFixChallenge = CodeFixChallenge;
window.RobotLab = RobotLab;
window.RobotSimulation = RobotSimulation;
