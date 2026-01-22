// Recursos Avançados e Otimizações

class AdvancedAnalytics {
    /**
     * Calcula sentimento básico das mensagens
     */
    static analyzeSentiment(messages) {
        const positiveWords = ['legal', 'ótimo', 'bom', 'demais', 'incrível', 'adorei', 'amei', 'topa', 'sim', 'top', '❤️', '😊', '😍', '🔥', '🎉'];
        const negativeWords = ['ruim', 'chato', 'triste', 'odeio', 'pior', 'mal', '😠', '😞', '💔', '😤'];

        let positive = 0, negative = 0;

        messages.forEach(msg => {
            const content = msg.content.toLowerCase();
            positiveWords.forEach(word => {
                if (content.includes(word)) positive++;
            });
            negativeWords.forEach(word => {
                if (content.includes(word)) negative++;
            });
        });

        return {
            positive,
            negative,
            vibe: positive > negative ? '😊 Positivo' : negative > positive ? '😞 Negativo' : '😐 Neutro'
        };
    }

    /**
     * Detecta períodos de inatividade
     */
    static detectInactivityPeriods(messages, days = 7) {
        const gaps = [];
        
        for (let i = 0; i < messages.length - 1; i++) {
            const current = messages[i].timestamp;
            const next = messages[i + 1].timestamp;
            const gapDays = (next - current) / (1000 * 60 * 60 * 24);

            if (gapDays > days) {
                gaps.push({
                    from: current,
                    to: next,
                    days: Math.round(gapDays)
                });
            }
        }

        return gaps;
    }

    /**
     * Calcula taxa de crescimento de mensagens ao longo do tempo
     */
    static calculateGrowthRate(messages) {
        const months = {};

        messages.forEach(msg => {
            const monthKey = msg.timestamp.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            months[monthKey] = (months[monthKey] || 0) + 1;
        });

        const values = Object.values(months);
        if (values.length < 2) return 0;

        const firstMonth = values[0];
        const lastMonth = values[values.length - 1];
        return ((lastMonth - firstMonth) / firstMonth * 100).toFixed(2);
    }

    /**
     * Encontra horários de pico de atividade
     */
    static findPeakHours(hourlyActivity) {
        const sorted = hourlyActivity
            .map((count, hour) => ({ hour, count }))
            .sort((a, b) => b.count - a.count);

        return sorted.slice(0, 3);
    }

    /**
     * Calcula compatibilidade de horários entre participantes
     */
    static calculateTimeCompatibility(messages) {
        const compatibility = {};

        for (let i = 0; i < messages.length - 1; i++) {
            const msg1 = messages[i];
            const msg2 = messages[i + 1];

            if (msg1.sender !== msg2.sender) {
                const diff = (msg2.timestamp - msg1.timestamp) / (1000 * 60); // em minutos

                const key = `${msg1.sender} → ${msg2.sender}`;
                if (!compatibility[key]) {
                    compatibility[key] = { count: 0, avgResponseTime: 0 };
                }

                compatibility[key].count++;
                compatibility[key].avgResponseTime += diff;
            }
        }

        // Calcular média
        Object.keys(compatibility).forEach(key => {
            compatibility[key].avgResponseTime = Math.round(compatibility[key].avgResponseTime / compatibility[key].count);
        });

        return compatibility;
    }

    /**
     * Detecta conversas em tempo real (rápidas trocas)
     */
    static detectRealTimeConversations(messages, maxGapMinutes = 2) {
        const conversations = [];
        let currentConversation = [messages[0]];

        for (let i = 1; i < messages.length; i++) {
            const timeDiff = (messages[i].timestamp - messages[i - 1].timestamp) / (1000 * 60);

            if (timeDiff <= maxGapMinutes) {
                currentConversation.push(messages[i]);
            } else {
                if (currentConversation.length > 3) {
                    conversations.push({
                        start: currentConversation[0].timestamp,
                        end: currentConversation[currentConversation.length - 1].timestamp,
                        messageCount: currentConversation.length,
                        participants: [...new Set(currentConversation.map(m => m.sender))]
                    });
                }
                currentConversation = [messages[i]];
            }
        }

        return conversations;
    }
}

/**
 * Sistema de Cache Local para melhor performance
 */
class CacheManager {
    static setCache(key, value) {
        try {
            sessionStorage.setItem(`zapwrapped_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('Cache storage indisponível');
        }
    }

    static getCache(key) {
        try {
            const item = sessionStorage.getItem(`zapwrapped_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    }

    static clearCache() {
        try {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith('zapwrapped_')) {
                    sessionStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.warn('Erro ao limpar cache');
        }
    }
}

/**
 * Sistema de Validação de Dados
 */
class DataValidator {
    static validateMessage(message) {
        return {
            hasValidTimestamp: message.timestamp instanceof Date,
            hasSender: message.sender && message.sender.trim().length > 0,
            hasContent: message.content && message.content.length > 0,
            hasType: message.type !== undefined,
            isValid: () => {
                return this.hasValidTimestamp && this.hasSender && this.hasContent && this.hasType;
            }
        };
    }

    static validateDataset(messages) {
        const stats = {
            total: messages.length,
            valid: 0,
            invalid: 0,
            warnings: []
        };

        messages.forEach((msg, i) => {
            const validation = this.validateMessage(msg);
            if (validation.isValid()) {
                stats.valid++;
            } else {
                stats.invalid++;
                stats.warnings.push(`Mensagem ${i}: ${JSON.stringify(validation)}`);
            }
        });

        return stats;
    }
}

/**
 * Gerador de Estatísticas Avançadas
 */
class StatsGenerator {
    static generateDetailedReport(stats) {
        return {
            summary: {
                period: `${stats.dateRange.from.toLocaleDateString('pt-BR')} - ${stats.dateRange.to.toLocaleDateString('pt-BR')}`,
                totalMessages: stats.totalMessages,
                totalParticipants: stats.participants.length,
                averageMessagesPerDay: Math.round(stats.totalMessages / this.daysDifference(stats.dateRange.from, stats.dateRange.to)),
            },
            topStats: {
                topTalker: stats.participants[0],
                topEmoji: stats.topEmojis[0],
                topKeyword: stats.topKeywords[0],
            },
            patterns: {
                sleepPattern: stats.sleepPattern,
                busiestDay: stats.busiestDay,
                busiestMonth: stats.busiestMonth,
            },
            insights: [
                `Você é um ${stats.sleepPattern.preference}`,
                `${stats.busiestDay.count} mensagens no ${SlideRenderer.translateDay(stats.busiestDay.day)}`,
                `${stats.consecutiveDays} dias seguidos de conversa!`
            ]
        };
    }

    static daysDifference(date1, date2) {
        return Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24)) || 1;
    }
}

// Exportar módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedAnalytics, CacheManager, DataValidator, StatsGenerator };
}
