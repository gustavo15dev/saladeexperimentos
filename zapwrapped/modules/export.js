// Sistema de Exportação (Vídeo e Screenshot)

class ExportSystem {
    static async exportAsScreenshot(element) {
        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#0f1419',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `zapwrapped-${Date.now()}.png`;
            link.click();
            
            return true;
        } catch (error) {
            console.error('Erro ao exportar screenshot:', error);
            return false;
        }
    }

    static async exportAsVideo(slidesContainer) {
        try {
            // Criar um vídeo WebM com a animação
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1920;
            const ctx = canvas.getContext('2d');

            // Capturar fluxo de vídeo
            const stream = canvas.captureStream(30); // 30 fps
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 5000000,
            });

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            
            return new Promise((resolve) => {
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `zapwrapped-wrapped-${Date.now()}.webm`;
                    link.click();
                    resolve(true);
                };

                mediaRecorder.start();

                // Animar durante 15 segundos (10 slides x 1.5 segundos cada)
                this.animateCanvasSlides(canvas, ctx, 15000, () => {
                    mediaRecorder.stop();
                });
            });

        } catch (error) {
            console.error('Erro ao criar vídeo:', error);
            // Fallback para imagem estática
            return await this.exportAsStaticImage(slidesContainer);
        }
    }

    static animateCanvasSlides(canvas, ctx, duration, onComplete) {
        const startTime = Date.now();
        const totalSlides = SlideRenderer.slides.length || 10;
        const slideDuration = duration / totalSlides;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > duration) {
                onComplete();
                return;
            }

            const slideIndex = Math.floor(elapsed / slideDuration);
            const slideProgress = (elapsed % slideDuration) / slideDuration;

            this.drawSlideFrame(canvas, ctx, slideIndex, slideProgress);
            requestAnimationFrame(animate);
        };

        animate();
    }

    static drawSlideFrame(canvas, ctx, slideIndex, progress) {
        // Limpar canvas
        ctx.fillStyle = '#0f1419';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenhar gradiente de fundo
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a1f2e');
        gradient.addColorStop(1, '#0a0e27');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Configurações de texto
        ctx.fillStyle = '#25D366';
        ctx.textAlign = 'center';
        ctx.font = 'bold 60px system-ui';

        // Fade in/out suave
        ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.8 + 0.2;

        const slide = SlideRenderer.slides[slideIndex];
        if (slide) {
            ctx.fillText(slide.title, canvas.width / 2, 300);
        }

        ctx.globalAlpha = 1;
    }

    static async exportAsStaticImage(slidesContainer) {
        try {
            const container = document.createElement('div');
            container.style.cssText = `
                width: 1080px;
                padding: 60px 40px;
                background: linear-gradient(135deg, #0f1419 0%, #0a0e27 100%);
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                overflow: hidden;
                position: fixed;
                left: -2000px;
                top: 0;
            `;

            let html = `
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 56px; margin: 0; background: linear-gradient(135deg, #25D366 0%, #00D9FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ZapWrapped
                    </h1>
                    <p style="color: #b0b5c1; margin: 15px 0 0 0; font-size: 18px;">Seu Ano em WhatsApp</p>
                </div>
            `;

            // Adicionar resumo visual
            html += `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0;">
                    <div style="background: rgba(37,211,102,0.1); padding: 25px; border-radius: 15px; text-align: center;">
                        <div style="font-size: 12px; color: #b0b5c1; margin-bottom: 10px;">MENSAGENS</div>
                        <div style="font-size: 32px; font-weight: bold; color: #25D366;">∞</div>
                    </div>
                    <div style="background: rgba(139,92,246,0.1); padding: 25px; border-radius: 15px; text-align: center;">
                        <div style="font-size: 12px; color: #b0b5c1; margin-bottom: 10px;">PARTICIPANTES</div>
                        <div style="font-size: 32px; font-weight: bold; color: #8B5CF6;">👥</div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 60px; padding: 20px; border-top: 2px solid rgba(37,211,102,0.2);">
                    <p style="color: #b0b5c1; font-size: 14px;">
                        Gerado com ❤️ por ZapWrapped<br>
                        Seus dados, sua privacidade, sua história
                    </p>
                </div>
            `;

            container.innerHTML = html;
            document.body.appendChild(container);

            const canvas = await html2canvas(container, {
                backgroundColor: '#0f1419',
                scale: 2,
                logging: false,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `zapwrapped-poster-${Date.now()}.png`;
            link.click();

            document.body.removeChild(container);
            return true;
        } catch (error) {
            console.error('Erro ao exportar imagem estática:', error);
            return false;
        }
    }
}
