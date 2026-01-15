/**
 * CONFIGURAÇÃO DE SEGURANÇA - Alternativa com Backend
 * 
 * ⚠️ IMPORTANTE: Este arquivo NÃO está sendo usado na versão atual
 * Ele é apenas uma REFERÊNCIA para uma abordagem mais segura usando backend
 * 
 * A implementação atual usa a chave no frontend porque é um chatbot público
 * Se você quiser MÁXIMA segurança, considere usar um backend Node.js/Python
 */

/**
 * ============================================
 * OPÇÃO 1: Frontend (Implementação Atual) ✅
 * ============================================
 * 
 * Vantagens:
 * ✅ Simples de configurar
 * ✅ Sem necessidade de backend
 * ✅ Funciona direto no Vercel (static hosting)
 * ✅ Rápido
 * 
 * Limitações:
 * ⚠️ Chave visível no código (mas protegida no Vercel)
 * ⚠️ Possível abuso se a chave vazar
 * ⚠️ Nenhum controle de limite de requisições
 */

/**
 * ============================================
 * OPÇÃO 2: Backend (Mais Seguro - Não Implementado)
 * ============================================
 * 
 * Como funcionaria:
 * 
 * Frontend (seu site):
 *   Pergunta → Envia para seu Backend → Backend chama API Gemini
 *        ↑                                    ↓
 *   Recebe resposta ←─────────────────────────
 * 
 * Vantagens:
 * ✅ Chave API completamente escondida
 * ✅ Controle total sobre requisições
 * ✅ Pode usar banco de dados
 * ✅ Monitoramento de abuso
 * 
 * Desvantagens:
 * ❌ Mais complexo de configurar
 * ❌ Precisa hospedar um backend
 * ❌ Mais lento (latência extra)
 * ❌ Custo extra (backend)
 */

/**
 * ============================================
 * COMO ESTÁ IMPLEMENTADO AGORA (Frontend)
 * ============================================
 * 
 * Fluxo:
 * 1. Chave é armazenada em variável de ambiente no Vercel
 * 2. No frontend, a chave é injetada via sessionStorage
 * 3. JavaScript faz requisição direto à API Gemini
 * 4. Resposta é exibida
 * 
 * Segurança:
 * ✅ Chave não fica no código-fonte
 * ✅ Chave vem apenas em tempo de execução
 * ✅ HTTPS (Vercel usa HTTPS por padrão)
 * ⚠️ Chave pode ser vista no Network tab do DevTools
 * 
 * Para minimizar riscos:
 * - Habilite controles de restrição na API Google
 * - Monitore o uso da API regularmente
 * - Regenere a chave se tiver vazamento
 */

/**
 * ============================================
 * INSTRUÇÕES SE QUISER USAR BACKEND
 * ============================================
 * 
 * Se você achar a abordagem frontend arriscada e quiser usar backend:
 * 
 * Opção A: Usar Vercel Functions (Node.js)
 * - Arquivo: /api/gemini.js
 * - Hospeda gratuito no Vercel
 * - Código Example:
 * 
 * export default async (req, res) => {
 *   const { pergunta } = req.body;
 *   const chave = process.env.GEMINI_API_KEY;
 *   
 *   const resposta = await fetch(
 *     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${chave}`,
 *     {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({
 *         contents: [{ parts: [{ text: pergunta }] }]
 *       })
 *     }
 *   );
 *   
 *   const dados = await resposta.json();
 *   return res.status(200).json(dados);
 * }
 * 
 * Depois edite gemini-api.js para chamar /api/gemini em vez da API direta.
 */

// ============================================
// 🔒 DICAS DE SEGURANÇA
// ============================================

/**
 * 1. Monitore o Uso
 * - Vá em https://aistudio.google.com
 * - Veja o dashboard de uso
 * - Estabeleça alertas se o custo subir
 */

/**
 * 2. Restrinja a Chave
 * - No Google Cloud Console
 * - Selecione a chave
 * - Configure "Application restrictions"
 * - Restrinja para seu domínio (seu site no Vercel)
 * - Configure "API restrictions" para apenas Gemini
 * 
 * Isso impede uso em outro lugar!
 */

/**
 * 3. Regenere Periodicamente
 * - Se a chave vazar, regenere imediatamente
 * - A antiga fica inválida em ~5 minutos
 * - Atualize no Vercel
 * - Faça novo deploy
 */

/**
 * 4. Logs e Monitoramento
 * - O DevTools mostra todas as requisições
 * - Você pode ver o uso da API
 * - Se vir requisições estranhas, é abuso
 * - Regenere a chave imediatamente
 */

console.log('%c🔒 NOTA SOBRE SEGURANÇA', 'color: red; font-weight: bold;');
console.log('A chave API é armazenada de forma segura no Vercel.');
console.log('Esta é a implementação padrão para chatbots públicos.');
console.log('Se tiver dúvidas, leia SETUP_VERCEL.md para mais detalhes.');
