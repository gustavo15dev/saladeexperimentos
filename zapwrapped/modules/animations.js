// Sistema de Animações

class AnimationSystem {
    static animate(element, animation, duration = 0.6) {
        return new Promise((resolve) => {
            element.style.animation = `none`;
            element.offsetHeight; // Trigger reflow
            element.style.animation = `${animation} ${duration}s ease forwards`;
            setTimeout(resolve, duration * 1000);
        });
    }

    static createParticles(container, count = 30) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 10 + 5 + 'px';
            particle.style.height = particle.style.width;
            
            const colors = ['#25D366', '#00D9FF', '#8B5CF6'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            particle.style.animation = `particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite`;
            
            container.appendChild(particle);
        }
    }

    static createConfetti(container) {
        const confettiCount = 50;
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'particle';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = Math.random() * 8 + 4 + 'px';
            confetti.style.height = Math.random() * 8 + 4 + 'px';
            
            const colors = ['#25D366', '#00D9FF', '#8B5CF6', '#FFD700'];
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = 1;
            confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s ease-in forwards`;
            
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    static animateCounter(element, start, end, duration = 1.5) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const updateInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / (duration * 1000), 1);
                const value = Math.floor(start + (end - start) * progress);
                element.textContent = this.formatNumber(value);
                
                if (progress === 1) {
                    clearInterval(updateInterval);
                    resolve();
                }
            }, 50);
        });
    }

    static formatNumber(num) {
        return new Intl.NumberFormat('pt-BR').format(num);
    }

    static addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(40px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-40px);
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes scale {
                from {
                    transform: scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            @keyframes bounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-20px);
                }
            }

            @keyframes particleFloat {
                0% {
                    transform: translateY(0px) translateX(0px);
                    opacity: 0.3;
                }
                50% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-100px) translateX(50px);
                    opacity: 0;
                }
            }

            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }

            @keyframes float-emoji {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                }
                50% {
                    transform: translateY(-20px) rotate(5deg);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
            }

            @keyframes glow {
                0%, 100% {
                    box-shadow: 0 0 5px rgba(37, 211, 102, 0.2);
                }
                50% {
                    box-shadow: 0 0 20px rgba(37, 211, 102, 0.6);
                }
            }

            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes shake {
                0%, 100% {
                    transform: translateX(0);
                }
                25% {
                    transform: translateX(-5px);
                }
                75% {
                    transform: translateX(5px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar animações
AnimationSystem.addAnimationStyles();
