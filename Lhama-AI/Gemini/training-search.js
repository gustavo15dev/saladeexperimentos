/**
 * Módulo de busca no training.json
 * Busca respostas com tolerância 0 (match EXATO)
 */

class BuscaTrainamento {
    constructor() {
        this.treinamentos = [];
        this.carregado = false;
    }

    /**
     * Carrega o arquivo training.json
     * @returns {Promise<boolean>} - true se carregou com sucesso
     */
    async carregar() {
        if (this.carregado) return true;

        try {
            const resposta = await fetch('../training.json');
            
            if (!resposta.ok) {
                console.error('Erro ao carregar training.json:', resposta.status);
                return false;
            }

            this.treinamentos = await resposta.json();
            this.carregado = true;
            console.log(`✓ Training.json carregado com ${this.treinamentos.length} entradas`);
            return true;

        } catch (erro) {
            console.error('Erro ao carregar training.json:', erro);
            return false;
        }
    }

    /**
     * Busca uma resposta com match EXATO (tolerância 0)
     * Compara a pergunta exatamente como vem no training.json
     * 
     * @param {string} pergunta - A pergunta do usuário
     * @returns {string|null} - A resposta encontrada ou null
     */
    buscarExato(pergunta) {
        if (!this.carregado || !this.treinamentos.length) {
            return null;
        }

        const perguntaNormalizada = pergunta.toLowerCase().trim();

        // Busca por match exato
        for (const item of this.treinamentos) {
            const perguntaTreinamento = item.pergunta.toLowerCase().trim();

            if (perguntaTreinamento === perguntaNormalizada) {
                return item.resposta;
            }
        }

        // Não encontrou
        return null;
    }

    /**
     * Tenta buscar com variações mínimas (sem pontuação, espaços extras)
     * Ainda é bem restritivo - apenas remove pontuação final
     * 
     * @param {string} pergunta - A pergunta do usuário
     * @returns {string|null} - A resposta encontrada ou null
     */
    buscarComVariacaoMinima(pergunta) {
        if (!this.carregado || !this.treinamentos.length) {
            return null;
        }

        // Remove pontuação final e normaliza
        const perguntaNormalizada = pergunta
            .toLowerCase()
            .trim()
            .replace(/[?.!;,]+$/, '') // Remove pontuação final
            .trim();

        for (const item of this.treinamentos) {
            const perguntaTreinamento = item.pergunta
                .toLowerCase()
                .trim()
                .replace(/[?.!;,]+$/, '')
                .trim();

            if (perguntaTreinamento === perguntaNormalizada) {
                return item.resposta;
            }
        }

        return null;
    }

    /**
     * Retorna o número de treinamentos carregados
     * @returns {number}
     */
    getTotalTreinamentos() {
        return this.treinamentos.length;
    }

    /**
     * Verifica se está carregado
     * @returns {boolean}
     */
    estaCarregado() {
        return this.carregado;
    }
}

// Instância global
const buscaTrainamento = new BuscaTrainamento();

// Carrega automaticamente quando a página inicia
document.addEventListener('DOMContentLoaded', async () => {
    await buscaTrainamento.carregar();
});
