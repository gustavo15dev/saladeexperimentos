/**
 * Middleware para injetar a chave API do Vercel no frontend
 * 
 * Em produção no Vercel: A chave vem como variável de ambiente
 * Localmente: Use sessionStorage ou variável global
 * 
 * NUNCA coloque a chave diretamente neste arquivo!
 */

// Inicializa a chave assim que a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    // Tenta obter a chave de diferentes fontes
    let chaveAPI = null;

    // 1. Tenta de variável global do window (para injeção manual)
    if (window.GEMINI_API_KEY) {
        chaveAPI = window.GEMINI_API_KEY;
        console.log('✓ Chave API encontrada em window.GEMINI_API_KEY');
    }
    // 2. Tenta de sessionStorage (para testes locais)
    else if (sessionStorage.getItem('GEMINI_API_KEY')) {
        chaveAPI = sessionStorage.getItem('GEMINI_API_KEY');
        console.log('✓ Chave API encontrada em sessionStorage');
    }
    // 3. Tenta de localStorage (persistente)
    else if (localStorage.getItem('GEMINI_API_KEY')) {
        chaveAPI = localStorage.getItem('GEMINI_API_KEY');
        console.log('✓ Chave API encontrada em localStorage');
    }
    // 4. Tenta buscar da API Vercel Function (Produção no Vercel)
    else {
        try {
            const resposta = await fetch('/api/config');
            if (resposta.ok) {
                const config = await resposta.json();
                if (config.GEMINI_API_KEY) {
                    chaveAPI = config.GEMINI_API_KEY;
                    console.log('✓ Chave API obtida da Vercel Function');
                }
            }
        } catch (e) {
            // Falha ao buscar, continua
            console.log('ℹ️ Vercel Function não disponível (esperado em localhost)');
        }
    }

    // Se encontrou a chave, armazena em sessionStorage para acesso
    if (chaveAPI) {
        sessionStorage.setItem('GEMINI_API_KEY', chaveAPI);
        console.log('✓ Sistema de API pronto para usar');
    } else {
        console.warn('⚠️ Chave API não encontrada. A API do Gemini não funcionará sem ela.');
        console.warn('Para testes locais, execute no console: sessionStorage.setItem("GEMINI_API_KEY", "sua-chave-aqui")');
        console.warn('Para produção no Vercel, certifique-se de que /api/config.js está presente e GEMINI_API_KEY está em Environment Variables');
    }
});

/**
 * Função auxiliar para definir chave manualmente (para testes)
 * Use no console do navegador assim: definirChaveAPI('sua-chave-aqui')
 */
function definirChaveAPI(chave) {
    if (!chave || chave.trim().length === 0) {
        console.error('❌ Chave vazia');
        return false;
    }
    
    sessionStorage.setItem('GEMINI_API_KEY', chave);
    console.log('✓ Chave definida com sucesso! Você já pode usar a API do Gemini.');
    return true;
}

/**
 * Verifica se há chave definida
 */
function temChaveDefinida() {
    const chave = sessionStorage.getItem('GEMINI_API_KEY');
    return chave && chave.trim().length > 0;
}

/**
 * Limpar chave (para logout/segurança)
 */
function limparChaveAPI() {
    sessionStorage.removeItem('GEMINI_API_KEY');
    console.log('✓ Chave API removida');
}
