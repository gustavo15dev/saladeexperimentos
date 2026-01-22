// Parser para extrair dados de chats do WhatsApp

class ChatParser {
    // Padrões de regex para diferentes formatos de WhatsApp
    static PATTERNS = {
        // Formato: [HH:MM:SS] NOME: mensagem ou 
        // [DD/MM/YYYY, HH:MM:SS] NOME: mensagem
        pt_br_detailed: /\[(\d{2}\/\d{2}\/\d{4},\s*\d{2}:\d{2}:\d{2})\]\s+([^:]+):\s+(.*)/,
        
        // Formato: 01/01/2023 10:30:45 - NOME: mensagem
        pt_br_simple: /(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})\s+-\s+([^:]+):\s+(.*)/,
        
        // Formato: [2023-01-01, 10:30:45] NOME: mensagem
        iso_format: /\[(\d{4}-\d{2}-\d{2},\s*\d{2}:\d{2}:\d{2})\]\s+([^:]+):\s+(.*)/,
        
        // Mensagens de sistema (adições, remoções, etc)
        system_message: /^.*(adicionou|removeu|saiu|entrou|criou|alterou|bloqueou|desbloqueou).*$/i,
        
        // Media messages
        media: /<Media omitted>|<imagem omitida>|<vídeo omitido>|<áudio omitido>/i,
    };

    static parseText(text) {
        const lines = text.split('\n').filter(line => line.trim());
        const messages = [];

        for (const line of lines) {
            // Tenta diferentes formatos
            let match = line.match(this.PATTERNS.pt_br_detailed);
            if (!match) match = line.match(this.PATTERNS.pt_br_simple);
            if (!match) match = line.match(this.PATTERNS.iso_format);

            if (match) {
                const [, timestamp, sender, content] = match;
                
                // Pula mensagens de sistema
                if (this.PATTERNS.system_message.test(content)) {
                    continue;
                }

                messages.push({
                    timestamp: this.parseTimestamp(timestamp),
                    sender: sender.trim(),
                    content: content.trim(),
                    isMedia: this.PATTERNS.media.test(content),
                    type: this.detectMessageType(content),
                    length: content.length,
                });
            }
        }

        return messages;
    }

    static parseTimestamp(timestamp) {
        // Trata diferentes formatos de data/hora
        let date;

        // Formato DD/MM/YYYY, HH:MM:SS
        if (timestamp.includes(',')) {
            const parts = timestamp.split(',');
            const dateParts = parts[0].split('/');
            const timeParts = parts[1].trim().split(':');

            date = new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0]),
                parseInt(timeParts[0]),
                parseInt(timeParts[1]),
                parseInt(timeParts[2])
            );
        } 
        // Formato ISO: YYYY-MM-DD, HH:MM:SS
        else if (timestamp.includes('-')) {
            date = new Date(timestamp.replace(',', 'T'));
        }

        return date || new Date();
    }

    static detectMessageType(content) {
        if (this.PATTERNS.media.test(content)) {
            if (content.includes('vídeo') || content.includes('video')) return 'video';
            if (content.includes('áudio') || content.includes('audio')) return 'audio';
            if (content.includes('imagem') || content.includes('image')) return 'image';
            if (content.includes('documento') || content.includes('document')) return 'document';
            if (content.includes('sticker')) return 'sticker';
            return 'media';
        }
        
        if (content.startsWith('http')) return 'link';
        if (/^\d+$/.test(content.replace(/\D/g, ''))) return 'number';
        
        return 'text';
    }

    static async parseZip(file) {
        const jsZip = new JSZip();
        const zip = await jsZip.loadAsync(file);
        const messages = [];

        for (const filename in zip.files) {
            if (filename.endsWith('.txt')) {
                const content = await zip.files[filename].async('text');
                messages.push(...this.parseText(content));
            }
        }

        return messages;
    }

    static async parseFile(file) {
        if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
            return this.parseZip(file);
        } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const text = await file.text();
            return this.parseText(text);
        } else {
            throw new Error('Formato de arquivo não suportado. Use .txt ou .zip');
        }
    }
}
