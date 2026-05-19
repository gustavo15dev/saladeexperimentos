export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let LOCAL_CONFIG = {};
    try {
        LOCAL_CONFIG = (await import('./local-config.js')).default || {};
    } catch (error) {
        // local-config.js may not exist in production
    }

    const apiKey = process.env.GROQ_API_KEY_007 || process.env.GROQ_API_KEY || LOCAL_CONFIG.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GROQ_API_KEY_007 is not configured on the server' });
    }

    const payload = req.body || {};
    const requestType = payload.requestType || payload.type || 'chat';

    if (requestType === 'transcription') {
        const { data, filename = 'audio.webm', mimeType = 'audio/webm', model = 'whisper-large-v3-turbo' } = payload;
        if (!data) {
            return res.status(400).json({ error: 'Missing audio data for transcription' });
        }

        try {
            const buffer = Buffer.from(data, 'base64');
            const formData = new FormData();
            const blob = new Blob([buffer], { type: mimeType });
            formData.append('file', blob, filename);
            formData.append('model', model);

            const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`
                },
                body: formData
            });

            const responseBody = await response.text();
            if (!response.ok) {
                return res.status(response.status).json({ error: 'Groq transcription error', details: responseBody });
            }

            return res.status(200).send(responseBody);
        } catch (error) {
            console.error('[GROQ PROXY] transcription error', error);
            return res.status(500).json({ error: 'Failed to forward transcription request', details: error.message });
        }
    }

    if (requestType === 'chat') {
        const { model = 'llama-3.1-8b-instant', messages, temperature = 0.7, max_tokens = 8192, top_p = 1 } = payload;
        if (!messages) {
            return res.status(400).json({ error: 'Missing messages for chat request' });
        }

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ model, messages, temperature, max_tokens, top_p })
            });

            const responseBody = await response.text();
            if (!response.ok) {
                return res.status(response.status).json({ error: 'Groq chat error', details: responseBody });
            }

            return res.status(200).send(responseBody);
        } catch (error) {
            console.error('[GROQ PROXY] chat error', error);
            return res.status(500).json({ error: 'Failed to forward chat request', details: error.message });
        }
    }

    return res.status(400).json({ error: 'Invalid requestType, expected transcription or chat' });
}
