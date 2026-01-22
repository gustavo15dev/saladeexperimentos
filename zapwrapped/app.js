// Aplicação Principal - ZapWrapped

class ZapWrappedApp {
    constructor() {
        this.currentSlide = 0;
        this.messages = [];
        this.stats = null;
        this.setupEventListeners();
        this.createParticles();
    }

    setupEventListeners() {
        // Drop Zone
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });

            dropZone.addEventListener('drop', async (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    await this.handleFile(files[0]);
                }
            });

            dropZone.addEventListener('click', () => {
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    await this.handleFile(e.target.files[0]);
                }
            });
        }

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'Escape') this.backToLanding();
        });
    }

    createParticles() {
        const container = document.getElementById('particles');
        if (container) {
            AnimationSystem.createParticles(container, 20);
        }
    }

    async handleFile(file) {
        // Mostrar loading state
        this.showLoadingState();

        try {
            // Parse do arquivo
            this.messages = await ChatParser.parseFile(file);
            
            if (this.messages.length === 0) {
                alert('Nenhuma mensagem encontrada no arquivo. Verifique o formato.');
                this.hideLoadingState();
                return;
            }

            // Análise dos dados
            const analyzer = new ChatAnalyzer(this.messages);
            this.stats = analyzer.getStats();

            // Gerar slides
            const slides = SlideRenderer.generateSlides(this.stats);

            // Mostrar stories
            setTimeout(() => {
                this.showStories(slides);
            }, 800);

        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            alert(`Erro: ${error.message}`);
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        const landing = document.getElementById('landing');
        const loadingState = document.querySelector('.loading-state');
        const dropZone = document.querySelector('.drop-zone');

        if (dropZone) dropZone.style.display = 'none';
        if (loadingState) {
            loadingState.classList.remove('hidden');
            loadingState.style.display = 'block';
        }

        // Simular progresso
        this.simulateProgress();
    }

    hideLoadingState() {
        const loadingState = document.querySelector('.loading-state');
        const dropZone = document.querySelector('.drop-zone');

        if (loadingState) {
            loadingState.classList.add('hidden');
            loadingState.style.display = 'none';
        }
        if (dropZone) dropZone.style.display = 'block';
    }

    simulateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        if (!progressFill) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            progressFill.style.width = progress + '%';

            if (progress >= 90) clearInterval(interval);
        }, 300);
    }

    showStories(slides) {
        this.hideLoadingState();
        
        // Renderizar slides
        const slidesWrapper = document.getElementById('slidesWrapper');
        if (slidesWrapper) {
            slidesWrapper.innerHTML = SlideRenderer.renderAllSlides();
        }

        // Atualizar progresso
        this.updateProgressBars();

        // Animar primeira slide
        this.animateSlide(0);

        // Mostrar página de stories
        this.showPage('stories');

        // Auto-play
        this.startAutoPlay();
    }

    updateProgressBars() {
        const container = document.getElementById('progressBarsContainer');
        if (!container) return;

        container.innerHTML = '';
        const totalSlides = SlideRenderer.slides.length;

        for (let i = 0; i < totalSlides; i++) {
            const bar = document.createElement('div');
            bar.className = `progress-bar-item ${i === 0 ? 'active' : ''}`;
            bar.innerHTML = '<div class="bar-fill"></div>';
            bar.addEventListener('click', () => this.goToSlide(i));
            container.appendChild(bar);
        }
    }

    animateSlide(index) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update progress bars
        const bars = document.querySelectorAll('.progress-bar-item');
        bars.forEach((bar, i) => {
            bar.classList.toggle('active', i === index);
        });

        // Update slide counter
        const slideNumber = document.getElementById('slideNumber');
        const totalSlides = document.getElementById('totalSlides');
        if (slideNumber) slideNumber.textContent = index + 1;
        if (totalSlides) totalSlides.textContent = slides.length;

        // Animações de entrada
        AnimationSystem.animate(slides[index], 'slideUp', 0.5);
    }

    nextSlide() {
        this.currentSlide++;
        if (this.currentSlide >= SlideRenderer.slides.length) {
            this.showSummary();
            return;
        }
        this.animateSlide(this.currentSlide);
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.animateSlide(this.currentSlide);
        }
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.animateSlide(index);
    }

    startAutoPlay() {
        // Auto-play de 5 segundos por slide
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    showSummary() {
        this.stopAutoPlay();
        this.generateSummary();
        this.showPage('summary');
    }

    generateSummary() {
        const summaryContent = document.getElementById('summaryContent');
        if (!summaryContent) return;

        const stats = this.stats;
        const topParticipant = stats.participants[0];

        let html = `
            <div class="summary-card">
                <div class="summary-title">📊 Seu Resumo de 2024</div>
                
                <div class="summary-stat-grid">
                    <div class="summary-stat">
                        <div class="stat-emoji">📨</div>
                        <div class="stat-value">${SlideRenderer.formatNumber(stats.totalMessages)}</div>
                        <div class="stat-label">Mensagens</div>
                    </div>
                    <div class="summary-stat">
                        <div class="stat-emoji">📝</div>
                        <div class="stat-value">${SlideRenderer.formatNumber(stats.totalWords)}</div>
                        <div class="stat-label">Palavras</div>
                    </div>
                    <div class="summary-stat">
                        <div class="stat-emoji">👥</div>
                        <div class="stat-value">${stats.participants.length}</div>
                        <div class="stat-label">Participantes</div>
                    </div>
                    <div class="summary-stat">
                        <div class="stat-emoji">📸</div>
                        <div class="stat-value">${stats.totalMedia}</div>
                        <div class="stat-label">Arquivos</div>
                    </div>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <div class="slide-emoji" style="font-size: 60px; margin-bottom: 20px;">👑</div>
                    <h3 style="color: #25D366; margin-bottom: 10px;">Campeão do Papo</h3>
                    <p style="font-size: 18px; margin-bottom: 5px;">${topParticipant.name}</p>
                    <p style="color: #b0b5c1; font-size: 14px;">
                        ${SlideRenderer.formatNumber(topParticipant.messageCount)} mensagens
                    </p>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <div class="slide-emoji" style="font-size: 60px; margin-bottom: 20px;">🏆</div>
                    <h3 style="color: #00D9FF; margin-bottom: 15px;">Top 4 Emojis</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                        ${stats.topEmojis.slice(0, 4).map(e => `
                            <div>
                                <div style="font-size: 32px; margin-bottom: 8px;">${e.emoji}</div>
                                <div style="color: #25D366; font-weight: bold;">${e.count}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #25D366; margin-bottom: 15px;">📅 Timeline</h3>
                    <div style="font-size: 14px; line-height: 1.8; color: #b0b5c1;">
                        <p>
                            <strong>Primeira mensagem:</strong> 
                            ${stats.firstMessage?.timestamp.toLocaleDateString('pt-BR')}
                        </p>
                        <p>
                            <strong>Dia mais ativo:</strong> 
                            ${SlideRenderer.translateDay(stats.busiestDay.day)} 
                            (${stats.busiestDay.count} mensagens)
                        </p>
                        <p>
                            <strong>Dias seguidos de conversa:</strong> 
                            ${stats.consecutiveDays} dias 🔥
                        </p>
                        <p>
                            <strong>Padrão de sono:</strong> 
                            ${stats.sleepPattern.preference}
                        </p>
                    </div>
                </div>
            </div>
        `;

        summaryContent.innerHTML = html;

        // Animar números
        setTimeout(() => {
            this.animateSummaryNumbers();
        }, 500);

        // Confetti de celebração
        AnimationSystem.createConfetti(document.getElementById('summary'));
    }

    animateSummaryNumbers() {
        const statValues = document.querySelectorAll('.stat-value');
        const stats = this.stats;
        const values = [
            stats.totalMessages,
            stats.totalWords,
            stats.participants.length,
            stats.totalMedia
        ];

        statValues.forEach((element, i) => {
            AnimationSystem.animateCounter(element, 0, values[i], 1.5);
        });
    }

    async exportAsVideo() {
        const btn = document.getElementById('downloadBtn');
        if (!btn) return;

        btn.disabled = true;
        btn.textContent = '🎬 Processando...';

        try {
            // Exportar como WebM (suporte melhor)
            const success = await ExportSystem.exportAsVideo(
                document.getElementById('slidesWrapper')
            );

            if (success) {
                btn.textContent = '✅ Download Iniciado!';
                setTimeout(() => {
                    btn.textContent = '🎬 Baixar Vídeo';
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Falha na exportação');
            }
        } catch (error) {
            console.error('Erro ao exportar:', error);
            btn.textContent = '❌ Erro ao exportar';
            setTimeout(() => {
                btn.textContent = '🎬 Baixar Vídeo';
                btn.disabled = false;
            }, 2000);
        }
    }

    async shareScreenshot() {
        const btn = document.getElementById('shareBtn');
        if (!btn) return;

        btn.disabled = true;
        btn.textContent = '📸 Salvando...';

        try {
            const success = await ExportSystem.exportAsScreenshot(
                document.getElementById('summary')
            );

            if (success) {
                btn.textContent = '✅ Screenshot Salvo!';
                setTimeout(() => {
                    btn.textContent = '📸 Compartilhar Screenshot';
                    btn.disabled = false;
                }, 3000);
            }
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
            btn.textContent = '❌ Erro';
            setTimeout(() => {
                btn.textContent = '📸 Compartilhar Screenshot';
                btn.disabled = false;
            }, 2000);
        }
    }

    showPage(pageName) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    backToLanding() {
        this.stopAutoPlay();
        this.currentSlide = 0;
        this.messages = [];
        this.stats = null;
        this.showPage('landing');
        
        // Reset form
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
    }
}

// Instância global da app
const app = new ZapWrappedApp();

// Garantir que módulos estejam carregados
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ ZapWrapped pronto!');
    console.log('Parser:', ChatParser ? '✅' : '❌');
    console.log('Analyzer:', ChatAnalyzer ? '✅' : '❌');
    console.log('Renderer:', SlideRenderer ? '✅' : '❌');
    console.log('Animations:', AnimationSystem ? '✅' : '❌');
});
