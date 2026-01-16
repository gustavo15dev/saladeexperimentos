/**
 * Vercel Serverless Function
 * Passa a chave API para o frontend de forma segura
 * 
 * Arquivo: /api/config.js
 * URL: https://seu-dominio.vercel.app/api/config
 */

export default (req, res) => {
    // Apenas GET
    if (req.method !== 'GET') {
        return res.status(405).json({ erro: 'Method not allowed' });
    }

    // Retorna a chave de forma segura
    res.status(200).json({
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || null
    });
};
