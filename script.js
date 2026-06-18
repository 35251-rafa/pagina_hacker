// --- CANVAS DE FUNDO ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
const mouse = { x: null, y: null, radius: 140 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.baseX = this.x; this.baseY = this.y;
        this.density = (Math.random() * 30) + 10;
    }
    update() {
        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * this.density;
            this.y -= (dy / distance) * force * this.density;
        } else {
            if (this.x !== this.baseX) this.x += (this.baseX - this.x) * 0.05;
            if (this.y !== this.baseY) this.y += (this.baseY - this.y) * 0.05;
        }
    }
    draw() {
        ctx.fillStyle = 'rgba(57, 255, 20, 0.4)';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}
for (let i = 0; i < 70; i++) stars.push(new Star());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animate);
}
animate();

// --- LÓGICA DE PASSAGEM DE ETAPAS ---
let activeStep = 1;

function advanceStep(currentStep) {
    if (currentStep === 1) {
        const idInput = document.getElementById('identity');
        if (idInput.value.trim().length < 3) { triggerError(idInput); return; }
    } else if (currentStep === 2) {
        const cipherInput = document.getElementById('cipher');
        if (cipherInput.value.length < 4) { triggerError(cipherInput); return; }
    }

    document.getElementById(`step-${currentStep}`).classList.remove('active');
    activeStep++;
    document.getElementById(`step-${activeStep}`).classList.add('active');
    document.getElementById('progress-bar').style.width = `${activeStep * 33.3}%`;

    if (activeStep === 3) initMiniGame();
}

function triggerError(element) {
    element.classList.add('shake-error');
    setTimeout(() => element.classList.remove('shake-error'), 400);
}

// --- MINI GAME: ALINHAMENTO ---
function initMiniGame() {
    const gameZone = document.getElementById('game-zone');
    const playerCore = document.getElementById('player-core');
    const targets = document.querySelectorAll('.target-node');
    let hits = 0; let isDragging = false;

    playerCore.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);

    gameZone.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = gameZone.getBoundingClientRect();
        let x = Math.max(10, Math.min(e.clientX - rect.left, rect.width - 10));
        let y = Math.max(10, Math.min(e.clientY - rect.top, rect.height - 10));
        
        playerCore.style.left = `${x}px`; playerCore.style.top = `${y}px`;

        targets.forEach(target => {
            if (target.classList.contains('hit')) return;
            const tRect = target.getBoundingClientRect();
            const pRect = playerCore.getBoundingClientRect();
            const dist = Math.hypot((pRect.left + pRect.width/2) - (tRect.left + tRect.width/2), (pRect.top + pRect.height/2) - (tRect.top + tRect.height/2));

            if (dist < 18) {
                target.classList.add('hit');
                hits++;
                if (hits === targets.length) unlockHackerSystem();
            }
        });
    });
}

// --- DESBLOQUEIO E INICIALIZAÇÃO DO PAINEL HACKER ---
function unlockHackerSystem() {
    const loginInterface = document.getElementById('login-interface');
    const dashboard = document.getElementById('hacker-dashboard');

    // Transição de sumiço da tela de login
    loginInterface.style.transform = 'scale(0.3) rotate(15deg)';
    loginInterface.style.opacity = '0';

    setTimeout(() => {
        loginInterface.classList.add('hidden');
        dashboard.classList.remove('hidden');
        
        // Ativa o fade-in do painel hacker
        setTimeout(() => dashboard.classList.add('visible'), 50);
        
        // Inicia a simulação das ferramentas de hacker
        startHackerSimulations();
    }, 600);
}

function startHackerSimulations() {
    const logBox = document.getElementById('terminal-log');
    const binaryBox = document.getElementById('binary-box');
    
    const fakeLogs = [
        "Conexão backdoor estabelecida em proxy reverso...",
        "Buscando vetores de autenticação vulneráveis...",
        "Exploit injetado no buffer local [0x7FFF56B]",
        "Sincronizando banco de dados SQL via Blind Injection...",
        "Quebrando hashes de chaves administrativas...",
        "Acesso root obtido na filial regional.",
        "Status de criptografia do sistema alterado para: COMPROMETIDO.",
        "Desviando tráfego de rede para servidores fantasmas..."
    ];

    // Adiciona linhas de logs continuamente no terminal central
    setInterval(() => {
        const p = document.createElement('p');
        p.innerText = `> ${fakeLogs[Math.floor(Math.random() * fakeLogs.length)]}`;
        logBox.appendChild(p);
        logBox.scrollTop = logBox.scrollHeight;
    }, 1800);

    // Stream de dados binários falsos rodando no canto
    setInterval(() => {
        let binString = "";
        for(let i=0; i<40; i++) { binString += Math.round(Math.random()); }
        binaryBox.innerText = binString + "\n" + binaryBox.innerText.substring(0, 300);
    }, 150);
}