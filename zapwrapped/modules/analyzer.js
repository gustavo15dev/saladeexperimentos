// Analisador de dados do chat

class ChatAnalyzer {
    constructor(messages) {
        this.messages = messages;
        this.data = {};
        this.analyze();
    }

    analyze() {
        this.calculateBasicStats();
        this.calculateParticipants();
        this.calculateTimeAnalysis();
        this.calculateEmojis();
        this.calculateMediaStats();
        this.calculateKeywords();
        this.calculateInitiators();
        this.calculateGhosts();
        this.calculateConsecutiveDays();
        this.calculateActivityHeatmap();
        this.calculateMessageLengths();
        this.calculateAudioStats();
        this.calculateDailyCalendar();
    }

    calculateBasicStats() {
        this.data.totalMessages = this.messages.length;
        this.data.totalWords = this.messages.reduce((sum, msg) => 
            sum + msg.content.split(/\s+/).length, 0);
        this.data.totalCharacters = this.messages.reduce((sum, msg) => 
            sum + msg.content.length, 0);
        this.data.averageMessageLength = Math.round(this.data.totalCharacters / this.data.totalMessages);
        this.data.firstMessage = this.messages[0];
        this.data.lastMessage = this.messages[this.messages.length - 1];
        this.data.dateRange = {
            from: this.data.firstMessage?.timestamp,
            to: this.data.lastMessage?.timestamp,
        };
    }

    calculateParticipants() {
        const participants = {};

        this.messages.forEach(msg => {
            if (!participants[msg.sender]) {
                participants[msg.sender] = {
                    name: msg.sender,
                    messageCount: 0,
                    characterCount: 0,
                    words: 0,
                    emojis: [],
                    mediaCount: { image: 0, video: 0, audio: 0, document: 0, sticker: 0 },
                };
            }
            participants[msg.sender].messageCount++;
            participants[msg.sender].characterCount += msg.content.length;
            participants[msg.sender].words += msg.content.split(/\s+/).length;

            // Extrai emojis
            const emojis = this.extractEmojis(msg.content);
            participants[msg.sender].emojis.push(...emojis);

            // Conta mídia
            if (msg.isMedia) {
                const type = msg.type || 'media';
                participants[msg.sender].mediaCount[type]++;
            }
        });

        this.data.participants = Object.values(participants).sort((a, b) => 
            b.messageCount - a.messageCount);
    }

    calculateTimeAnalysis() {
        const hourlyActivity = new Array(24).fill(0);
        const dailyActivity = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };
        const monthlyActivity = {};

        this.messages.forEach(msg => {
            const hour = msg.timestamp.getHours();
            const day = msg.timestamp.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
            const monthKey = msg.timestamp.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

            hourlyActivity[hour]++;
            dailyActivity[day]++;
            monthlyActivity[monthKey] = (monthlyActivity[monthKey] || 0) + 1;
        });

        this.data.hourlyActivity = hourlyActivity;
        this.data.dailyActivity = dailyActivity;
        this.data.monthlyActivity = monthlyActivity;

        // Night Owl vs Early Bird
        const nightOwl = hourlyActivity[3] || 0; // 3 AM
        const earlyBird = hourlyActivity[7] || 0; // 7 AM
        this.data.sleepPattern = {
            nightOwl,
            earlyBird,
            preference: nightOwl > earlyBird ? 'Coruja Noturna 🦉' : 'Madrugador(a) 🌅',
        };

        // Dia mais ativo
        const maxDay = Object.keys(dailyActivity).reduce((a, b) => 
            dailyActivity[a] > dailyActivity[b] ? a : b);
        this.data.busiestDay = { day: maxDay, count: dailyActivity[maxDay] };

        // Mês mais movimentado
        const maxMonth = Object.keys(monthlyActivity).reduce((a, b) => 
            monthlyActivity[a] > monthlyActivity[b] ? a : b);
        this.data.busiestMonth = { month: maxMonth, count: monthlyActivity[maxMonth] };
    }

    calculateEmojis() {
        const emojiMap = {};
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

        this.messages.forEach(msg => {
            const matches = msg.content.match(emojiRegex) || [];
            matches.forEach(emoji => {
                emojiMap[emoji] = (emojiMap[emoji] || 0) + 1;
            });
        });

        this.data.topEmojis = Object.entries(emojiMap)
            .map(([emoji, count]) => ({ emoji, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }

    calculateMediaStats() {
        const mediaStats = {
            images: 0,
            videos: 0,
            audios: 0,
            documents: 0,
            stickers: 0,
        };

        this.messages.forEach(msg => {
            if (msg.isMedia) {
                switch (msg.type) {
                    case 'image': mediaStats.images++; break;
                    case 'video': mediaStats.videos++; break;
                    case 'audio': mediaStats.audios++; break;
                    case 'document': mediaStats.documents++; break;
                    case 'sticker': mediaStats.stickers++; break;
                }
            }
        });

        this.data.mediaStats = mediaStats;
        this.data.totalMedia = Object.values(mediaStats).reduce((a, b) => a + b);
    }

    calculateKeywords() {
        const wordFreq = {};
        const stopwords = new Set([
            'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 
            'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu',
            'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo',
            'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem',
            'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu',
            'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe',
            'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'vos', 'lhes',
            'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas', 'dela', 'delas',
            'aq', 'tá', 'ta', 'msg', 'blz', 'vc', 'cmg', 'kkk', 'rsrs', 'haha', 'kkkk',
        ]);

        this.messages.forEach(msg => {
            const words = msg.content
                .toLowerCase()
                .replace(/[^a-záéíóúãõçñ\s]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 2 && !stopwords.has(w));

            words.forEach(word => {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            });
        });

        this.data.topKeywords = Object.entries(wordFreq)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }

    calculateInitiators() {
        const dayInitiators = {};

        for (let i = 0; i < this.messages.length - 1; i++) {
            const current = this.messages[i];
            const next = this.messages[i + 1];
            const timeDiff = (next.timestamp - current.timestamp) / (1000 * 60); // em minutos

            // Se passou mais de 30 minutos, a próxima mensagem inicia uma conversa
            if (timeDiff > 30) {
                dayInitiators[next.sender] = (dayInitiators[next.sender] || 0) + 1;
            }
        }

        this.data.initiators = Object.entries(dayInitiators)
            .map(([sender, count]) => ({ sender, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }

    calculateGhosts() {
        const ghosts = {};

        for (let i = 0; i < this.messages.length - 1; i++) {
            const current = this.messages[i];
            const next = this.messages[i + 1];
            
            if (current.sender !== next.sender) {
                const timeDiff = (next.timestamp - current.timestamp) / (1000 * 60); // em minutos

                if (timeDiff > 60) { // Mais de 1 hora
                    ghosts[current.sender] = (ghosts[current.sender] || 0) + 1;
                }
            }
        }

        this.data.ghosts = Object.entries(ghosts)
            .map(([sender, count]) => ({ sender, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }

    calculateConsecutiveDays() {
        const dates = new Set();
        this.messages.forEach(msg => {
            dates.add(msg.timestamp.toLocaleDateString('pt-BR'));
        });

        const dateArray = Array.from(dates).map(d => new Date(d.split('/').reverse().join('-')));
        dateArray.sort((a, b) => a - b);

        let maxConsecutive = 0;
        let currentConsecutive = 1;

        for (let i = 1; i < dateArray.length; i++) {
            const diff = (dateArray[i] - dateArray[i - 1]) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                currentConsecutive++;
            } else {
                maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
                currentConsecutive = 1;
            }
        }

        this.data.consecutiveDays = Math.max(maxConsecutive, currentConsecutive);
    }

    calculateActivityHeatmap() {
        const heatmap = {};
        
        this.messages.forEach(msg => {
            const dateStr = msg.timestamp.toLocaleDateString('pt-BR');
            if (!heatmap[dateStr]) {
                heatmap[dateStr] = 0;
            }
            heatmap[dateStr]++;
        });

        this.data.activityHeatmap = heatmap;
    }

    extractEmojis(text) {
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
        return text.match(emojiRegex) || [];
    }

    calculateMessageLengths() {
        const lengths = this.messages.map(m => m.content.length).sort((a, b) => b - a);
        
        this.data.longestMessage = {
            sender: this.messages.find(m => m.content.length === lengths[0])?.sender || 'N/A',
            length: lengths[0],
            content: this.messages.find(m => m.content.length === lengths[0])?.content.substring(0, 50) + '...' || '',
        };

        this.data.shortestNonEmptyMessage = lengths.reverse()[0];
    }

    calculateAudioStats() {
        const audioMessages = this.messages.filter(m => m.type === 'audio');
        this.data.longestAudio = {
            sender: audioMessages.length > 0 ? audioMessages[0].sender : 'N/A',
            count: audioMessages.length,
        };
    }

    calculateDailyCalendar() {
        const calendar = {};
        
        this.messages.forEach(msg => {
            const dateStr = msg.timestamp.toLocaleDateString('pt-BR');
            calendar[dateStr] = (calendar[dateStr] || 0) + 1;
        });

        // Ordenar por atividade
        this.data.dailyCalendar = Object.entries(calendar)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => b.count - a.count);

        this.data.mostActiveDays = this.data.dailyCalendar.slice(0, 5);
    }

    getStats() {
        return this.data;
    }
}
