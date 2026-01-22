// Renderizador de slides e conteúdo

class SlideRenderer {
    static slides = [];

    static generateSlides(stats) {
        this.slides = [];

        // Slide 1: Abertura
        this.slides.push({
            id: 'intro',
            title: 'Seu Ano em WhatsApp',
            emoji: '📱',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">${stats.dateRange?.from ? '📱' : '🚀'}</div>
                    <h2 class="slide-title">Bem-vindo ao ZapWrapped</h2>
                    <p class="slide-description">
                        Prepare-se para descobrir os segredos da sua conversa!<br>
                        De ${new Date(stats.dateRange?.from).toLocaleDateString('pt-BR')} 
                        até ${new Date(stats.dateRange?.to).toLocaleDateString('pt-BR')}
                    </p>
                </div>
            `
        });

        // Slide 2: Números Principais
        this.slides.push({
            id: 'big-numbers',
            title: 'Os Números',
            emoji: '📊',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">📊</div>
                    <h2 class="slide-title">Os Números Falam</h2>
                    <div class="slide-list">
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📨</span> Mensagens Totais</span>
                            <span class="list-value">${this.formatNumber(stats.totalMessages)}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📝</span> Palavras</span>
                            <span class="list-value">${this.formatNumber(stats.totalWords)}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">🔤</span> Caracteres</span>
                            <span class="list-value">${this.formatNumber(stats.totalCharacters)}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📏</span> Média por Msg</span>
                            <span class="list-value">${stats.averageMessageLength} carac</span>
                        </div>
                    </div>
                </div>
            `
        });

        // Slide 3: Quem Mais Fala
        this.slides.push({
            id: 'top-talkers',
            title: 'Quem Fala Mais?',
            emoji: '🏆',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">🏆</div>
                    <h2 class="slide-title">Campeão do Papo</h2>
                    <div class="slide-list">
                        ${stats.participants.slice(0, 3).map((p, i) => `
                            <div class="slide-list-item">
                                <span class="list-name">
                                    <span class="list-rank">${['🥇', '🥈', '🥉'][i]}</span> 
                                    ${p.name}
                                </span>
                                <span class="list-value">${this.formatNumber(p.messageCount)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <p class="slide-description" style="margin-top: 20px;">
                        ${stats.participants[0].name} é o maior falador! 👑
                    </p>
                </div>
            `
        });

        // Slide 4: Padrão de Sono
        this.slides.push({
            id: 'sleep-pattern',
            title: 'Padrão de Sono',
            emoji: '🌙',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">${stats.sleepPattern.preference === 'Coruja Noturna 🦉' ? '🦉' : '🌅'}</div>
                    <h2 class="slide-title">${stats.sleepPattern.preference}</h2>
                    <div class="slide-list">
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">🌙</span> Mensagens às 3 AM</span>
                            <span class="list-value">${stats.sleepPattern.nightOwl}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">☀️</span> Mensagens às 7 AM</span>
                            <span class="list-value">${stats.sleepPattern.earlyBird}</span>
                        </div>
                    </div>
                </div>
            `
        });

        // Slide 5: Dia Mais Ativo
        this.slides.push({
            id: 'busiest-day',
            title: 'Dia Mais Ativo',
            emoji: '🔥',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">🔥</div>
                    <h2 class="slide-title">Qual Dia é Mais Quente?</h2>
                    <div style="margin: 30px 0;">
                        <p class="slide-description">
                            ${this.translateDay(stats.busiestDay.day)}
                        </p>
                        <div class="slide-stat">${stats.busiestDay.count}</div>
                        <p class="slide-description" style="font-size: 14px;">mensagens</p>
                    </div>
                </div>
            `
        });

        // Slide 6: Top 4 Emojis
        this.slides.push({
            id: 'top-emojis',
            title: 'Top 4 Emojis',
            emoji: '😂',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">😂</div>
                    <h2 class="slide-title">Seus Emojis Favoritos</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 30px;">
                        ${stats.topEmojis.slice(0, 4).map(e => `
                            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; text-align: center;">
                                <div style="font-size: 40px; margin-bottom: 10px;">${e.emoji}</div>
                                <div class="slide-stat" style="font-size: 24px;">${e.count}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
        });

        // Slide 7: Quem Inicia Conversa
        this.slides.push({
            id: 'initiators',
            title: 'Quem Puxa o Assunto',
            emoji: '🗣️',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">🗣️</div>
                    <h2 class="slide-title">Quem Começa a Brincadeira?</h2>
                    <div class="slide-list">
                        ${stats.initiators.slice(0, 3).map((p, i) => `
                            <div class="slide-list-item">
                                <span class="list-name">
                                    <span class="list-rank">${i + 1}.</span> 
                                    ${p.sender}
                                </span>
                                <span class="list-value">${p.count}x</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
        });

        // Slide 8: Estatísticas de Mídia
        this.slides.push({
            id: 'media-stats',
            title: 'Mídia Compartilhada',
            emoji: '📸',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">📸</div>
                    <h2 class="slide-title">Conteúdo Multimedia</h2>
                    <div class="slide-list">
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">🖼️</span> Imagens</span>
                            <span class="list-value">${stats.mediaStats.images}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">🎬</span> Vídeos</span>
                            <span class="list-value">${stats.mediaStats.videos}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">🎵</span> Áudios</span>
                            <span class="list-value">${stats.mediaStats.audios}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📄</span> Documentos</span>
                            <span class="list-value">${stats.mediaStats.documents}</span>
                        </div>
                    </div>
                </div>
            `
        });

        // Slide 9: Dados Extras
        this.slides.push({
            id: 'extra-stats',
            title: 'Dados Extras',
            emoji: '✨',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">✨</div>
                    <h2 class="slide-title">Curiosidades</h2>
                    <div class="slide-list">
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📅</span> Dias Seguidos</span>
                            <span class="list-value">${stats.consecutiveDays}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">🗓️</span> Período Total</span>
                            <span class="list-value">${this.calculateDaysDifference(stats.dateRange?.from, stats.dateRange?.to)} dias</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">👥</span> Participantes</span>
                            <span class="list-value">${stats.participants.length}</span>
                        </div>
                    </div>
                </div>
            `
        });

        // Slide 10: Mês Mais Movimentado
        this.slides.push({
            id: 'busiest-month',
            title: 'Mês Mais Movimentado',
            emoji: '📆',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">📆</div>
                    <h2 class="slide-title">O Mês Ápice</h2>
                    <div style="margin: 30px 0;">
                        <p class="slide-description">
                            ${stats.busiestMonth.month}
                        </p>
                        <div class="slide-stat">${stats.busiestMonth.count}</div>
                        <p class="slide-description" style="font-size: 14px;">mensagens naquele mês</p>
                    </div>
                </div>
            `
        });

        // Slide 11: Slangs/Keywords
        this.slides.push({
            id: 'keywords',
            title: 'Palavras-Chave',
            emoji: '🔑',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">🔑</div>
                    <h2 class="slide-title">Suas Palavras-Chave</h2>
                    <div class="slide-list">
                        ${stats.topKeywords.slice(0, 4).map((k, i) => `
                            <div class="slide-list-item">
                                <span class="list-name">
                                    <span class="list-rank">${i + 1}.</span> 
                                    <strong>${k.word}</strong>
                                </span>
                                <span class="list-value">${k.count}x</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
        });

        // Slide 13: Ghosters (Quem Some)
        this.slides.push({
            id: 'ghosts',
            title: 'Os Ghosters',
            emoji: '👻',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">👻</div>
                    <h2 class="slide-title">Quem Some Mais?</h2>
                    <div class="slide-list">
                        ${stats.ghosts.slice(0, 3).map((p, i) => `
                            <div class="slide-list-item">
                                <span class="list-name">
                                    <span class="list-rank">${['🥇', '🥈', '🥉'][i]}</span> 
                                    ${p.sender}
                                </span>
                                <span class="list-value">${p.count}x</span>
                            </div>
                        `).join('')}
                    </div>
                    <p class="slide-description" style="margin-top: 20px; font-size: 12px;">
                        Gaps maiores que 1 hora
                    </p>
                </div>
            `
        });

        // Slide 14: Mensagem Mais Longa
        this.slides.push({
            id: 'longest-message',
            title: 'Mensagem Épica',
            emoji: '📖',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">📖</div>
                    <h2 class="slide-title">A Mensagem Mais Longa</h2>
                    <div class="slide-list">
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">✍️</span> Enviada por</span>
                            <span class="list-value">${stats.longestMessage.sender}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📏</span> Comprimento</span>
                            <span class="list-value">${stats.longestMessage.length} carac</span>
                        </div>
                    </div>
                    <p class="slide-description" style="margin-top: 20px; font-style: italic; font-size: 12px;">
                        "${stats.longestMessage.content}"
                    </p>
                </div>
            `
        });

        // Slide 15: Dias Mais Ativos (Calendar Snapshot)
        this.slides.push({
            id: 'hot-days',
            title: 'Dias Quentes',
            emoji: '🔥',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">🔥</div>
                    <h2 class="slide-title">Top 5 Dias Mais Ativos</h2>
                    <div class="slide-list">
                        ${stats.mostActiveDays.slice(0, 5).map((day, i) => `
                            <div class="slide-list-item">
                                <span class="list-name">
                                    <span class="list-rank">${i + 1}.</span> 
                                    ${new Date(day.date).toLocaleDateString('pt-BR')}
                                </span>
                                <span class="list-value">${day.count}📨</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
        });

        // Slide 16: Heatmap de Atividade (Horas)
        this.slides.push({
            id: 'hourly-heatmap',
            title: 'Heatmap de Horas',
            emoji: '🌡️',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">🌡️</div>
                    <h2 class="slide-title">Atividade Por Hora</h2>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 20px;">
                        ${stats.hourlyActivity.map((count, hour) => {
                            const intensity = Math.min(count / Math.max(...stats.hourlyActivity), 1);
                            const color = \`rgba(37, 211, 102, \${0.3 + intensity * 0.7})\`;
                            return \`
                                <div style="
                                    background: \${color};
                                    padding: 10px;
                                    border-radius: 6px;
                                    text-align: center;
                                    font-size: 11px;
                                    border: 1px solid rgba(37, 211, 102, 0.3);
                                ">
                                    <div style="font-weight: bold; font-size: 12px;">\${hour}h</div>
                                    <div>\${count}</div>
                                </div>
                            \`;
                        }).join('')}
                    </div>
                </div>
            `
        });

        // Slide 17: Estatísticas por Participante (Principal)
        this.slides.push({
            id: 'participant-stats',
            title: 'Estatísticas Gerais',
            emoji: '📊',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">📊</div>
                    <h2 class="slide-title">${stats.participants[0].name} em Números</h2>
                    <div class="slide-list">
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📨</span> Mensagens</span>
                            <span class="list-value">${stats.participants[0].messageCount}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📝</span> Palavras</span>
                            <span class="list-value">${stats.participants[0].words}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">🔤</span> Caracteres</span>
                            <span class="list-value">${stats.participants[0].characterCount}</span>
                        </div>
                        <div class="slide-list-item">
                            <span class="list-name"><span class="list-rank">📊</span> Percentual</span>
                            <span class="list-value">${Math.round((stats.participants[0].messageCount / stats.totalMessages) * 100)}%</span>
                        </div>
                    </div>
                </div>
            `
        });

        // Slide 18: Final (Compartilhar)
        this.slides.push({
            id: 'final',
            title: 'Obrigado',
            emoji: '❤️',
            content: `
                <div class="slide-content">
                    <div class="slide-emoji">❤️</div>
                    <h2 class="slide-title">Seu Wrapped Acabou!</h2>
                    <p class="slide-description">
                        Agora é hora de compartilhar seus segredos (ou não 😄)<br>
                        Clique em "Baixar Screenshot" ou "Vídeo" para salvar sua jornada!<br>
                        <br>
                        Desenvolvido com ❤️ para você
                    </p>
                </div>
            `
        });

        return this.slides;
    }

    static formatNumber(num) {
        return new Intl.NumberFormat('pt-BR').format(num);
    }

    static translateDay(dayAbbr) {
        const days = {
            'mon': '🟦 Segunda-feira',
            'tue': '🟥 Terça-feira',
            'wed': '🟩 Quarta-feira',
            'thu': '🟦 Quinta-feira',
            'fri': '🟪 Sexta-feira',
            'sat': '⬜ Sábado',
            'sun': '🟨 Domingo'
        };
        return days[dayAbbr] || dayAbbr;
    }

    static calculateDaysDifference(date1, date2) {
        if (!date1 || !date2) return 0;
        const diff = Math.abs(new Date(date2) - new Date(date1));
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    static renderSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.slides.length) return '';
        
        const slide = this.slides[slideIndex];
        return `
            <div class="slide active" data-slide-id="${slide.id}">
                <div class="slide-bg"></div>
                ${slide.content}
            </div>
        `;
    }

    static renderAllSlides() {
        return this.slides.map((slide, i) => `
            <div class="slide ${i === 0 ? 'active' : ''}" data-slide-id="${slide.id}">
                <div class="slide-bg"></div>
                ${slide.content}
            </div>
        `).join('');
    }
}
