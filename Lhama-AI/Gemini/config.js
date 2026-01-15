/**
 * Configuração da API Gemini
 * Usa variáveis de ambiente do Vercel
 */

const GEMINI_CONFIG = {
    // API Key vem de process.env no Vercel, ou de sessionStorage para testes locais
    API_KEY: () => {
        // Em produção (Vercel), a chave vem de uma variável de ambiente
        // que será acessada via endpoint backend
        return sessionStorage.getItem('GEMINI_API_KEY') || null;
    },
    
    // Model mais econômico e rápido recomendado
    MODEL: 'gemini-2.5-flash',
    
    // Endpoint da API Gemini
    API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models',
    
    // Configurações de requisição
    REQUEST_CONFIG: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
    },
    
    // Timeout em ms
    TIMEOUT: 30000,
};

/**
 * Função auxiliar para construir URL da API
 */
function construirURLAPI(chave) {
    return `${GEMINI_CONFIG.API_ENDPOINT}/${GEMINI_CONFIG.MODEL}:generateContent?key=${chave}`;
}

/**
 * Função auxiliar para validar se a chave está disponível
 */
function temChaveAPI() {
    const chave = GEMINI_CONFIG.API_KEY();
    return chave && chave.trim().length > 0;
}
