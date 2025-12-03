// Gerador de Cores - Lógica Principal

class GeradorCores {
    constructor() {
        this.perguntas = [
            {
                id: 'ambiente',
                tipo: 'opcoes',
                texto: 'Para qual ambiente você quer essa cor?',
                desc: 'Isso ajuda a definir o tom e a energia',
                opcoes: [
                    'Trabalho/Produtividade',
                    'Criatividade/Arte',
                    'Relaxamento/Meditação',
                    'Diversão/Entretenimento',
                    'Natureza/Ecologia'
                ]
            },
            {
                id: 'temperatura',
                tipo: 'opcoes',
                texto: 'Qual temperatura cromática você prefere?',
                desc: 'Quente (vermelho/laranja) ou Frio (azul/verde)?',
                opcoes: [
                    'Muito Quente 🔥',
                    'Quente 🌅',
                    'Neutro ⚖️',
                    'Frio ❄️',
                    'Muito Frio 🧊'
                ]
            },
            {
                id: 'energia',
                tipo: 'opcoes',
                texto: 'Qual nível de energia você busca?',
                desc: 'De pastel suave até neon explosivo',
                opcoes: [
                    'Ultra Pastel',
                    'Pastel Suave',
                    'Equilibrado',
                    'Vibrante',
                    'Neon/Ultra Vibrante'
                ]
            },
            {
                id: 'psicologia',
                tipo: 'opcoes',
                texto: 'Qual emoção essa cor deve transmitir?',
                desc: 'Escolha o sentimento principal',
                opcoes: [
                    'Calma & Paz',
                    'Confiança & Segurança',
                    'Alegria & Energia',
                    'Sofisticação & Elegância',
                    'Criatividade & Inovação'
                ]
            },
            {
                id: 'inspiracao',
                tipo: 'texto',
                texto: 'Descreva uma coisa que te inspira',
                desc: 'Ex: "céu ao entardecer", "oceano profundo", "floresta verde"',
                placeholder: 'Seu exemplo aqui...'
            },
            {
                id: 'descricao',
                tipo: 'textarea',
                texto: 'Dê mais detalhes sobre o que você imagina',
                desc: 'Texturas, materiais, sentimentos associados',
                placeholder: 'Descreva com liberdade...'
            }
        ];

        this.respostas = {};
        this.indiceAtual = 0;
        this.coresGeradas = [];

        this.init();
    }

    init() {
        this.renderizarQuestao();
        this.setupEventos();
    }

    renderizarQuestao() {
        const questao = this.perguntas[this.indiceAtual];
        const container = document.getElementById('questoes-container');
        container.innerHTML = '';

        const item = document.createElement('div');
        item.className = 'questao-item';

        let conteudo = `
            <label class="questao-label">
                ${questao.texto}
                <span class="questao-desc">${questao.desc}</span>
            </label>
        `;

        if (questao.tipo === 'opcoes') {
            conteudo += '<div class="opcoes-container">';
            questao.opcoes.forEach(opcao => {
                const selecionada = this.respostas[questao.id] === opcao ? 'active' : '';
                conteudo += `
                    <button class="opcao-btn ${selecionada}" data-opcao="${opcao}">
                        ${opcao}
                    </button>
                `;
            });
            conteudo += '</div>';
        } else if (questao.tipo === 'texto') {
            const valor = this.respostas[questao.id] || '';
            conteudo += `
                <input 
                    type="text" 
                    class="questao-input" 
                    placeholder="${questao.placeholder}"
                    value="${valor}"
                    id="input-${questao.id}"
                >
            `;
        } else if (questao.tipo === 'textarea') {
            const valor = this.respostas[questao.id] || '';
            conteudo += `
                <textarea 
                    class="questao-textarea" 
                    placeholder="${questao.placeholder}"
                    id="input-${questao.id}"
                >${valor}</textarea>
            `;
        }

        item.innerHTML = conteudo;
        container.appendChild(item);

        // Attach eventos
        if (questao.tipo === 'opcoes') {
            item.querySelectorAll('.opcao-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    item.querySelectorAll('.opcao-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.respostas[questao.id] = e.target.getAttribute('data-opcao');
                });
            });
        } else {
            document.getElementById(`input-${questao.id}`).addEventListener('change', (e) => {
                this.respostas[questao.id] = e.target.value;
            });
        }

        // Update UI
        this.atualizarProgresso();
        this.atualizarBotoes();
    }

    setupEventos() {
        document.getElementById('btn-proximo').addEventListener('click', () => {
            if (this.indiceAtual < this.perguntas.length - 1) {
                this.indiceAtual++;
                this.renderizarQuestao();
            } else {
                this.gerar();
            }
        });

        document.getElementById('btn-anterior').addEventListener('click', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.renderizarQuestao();
            }
        });

        document.getElementById('btn-regenerar')?.addEventListener('click', () => {
            this.gerar();
        });

        document.getElementById('btn-copiar-todos')?.addEventListener('click', () => {
            this.copiarTodos();
        });
    }

    atualizarProgresso() {
        const percentual = ((this.indiceAtual + 1) / this.perguntas.length) * 100;
        document.getElementById('progresso-fill').style.width = percentual + '%';
    }

    atualizarBotoes() {
        const btnAnterior = document.getElementById('btn-anterior');
        const btnProximo = document.getElementById('btn-proximo');

        btnAnterior.style.display = this.indiceAtual === 0 ? 'none' : 'flex';
        btnProximo.textContent = this.indiceAtual === this.perguntas.length - 1 
            ? '✨ Gerar Cores' 
            : 'Próximo →';
    }

    gerar() {
        // Mostrar fase gerando
        document.getElementById('questionario-fase').style.display = 'none';
        document.getElementById('gerando-fase').style.display = 'block';
        document.getElementById('resultado-fase').style.display = 'none';

        // Simular processamento
        setTimeout(() => {
            this.coresGeradas = this.calcularCores();
            this.mostrarResultado();
        }, 1500);
    }

    calcularCores() {
        // Base: mapa respostas → hue/saturation/lightness
        const temperatura = this.respostas['temperatura'] || '';
        const energia = this.respostas['energia'] || '';
        const psicologia = this.respostas['psicologia'] || '';
        const inspiracao = this.respostas['inspiracao'] || '';

        let hue = this.calcularHue(temperatura, inspiracao);
        let saturation = this.calcularSaturacao(energia);
        let lightness = this.calcularLuminosidade(energia, psicologia);

        // Gerar paleta (5-6 cores relacionadas)
        const paleta = [];
        const variacoes = [
            { hOffset: 0, sOffset: 0, lOffset: 0 },  // Principal
            { hOffset: 180, sOffset: -10, lOffset: 5 },  // Complementar
            { hOffset: 30, sOffset: -15, lOffset: 15 },  // Análoga 1
            { hOffset: -30, sOffset: -15, lOffset: -10 },  // Análoga 2
            { hOffset: 60, sOffset: 10, lOffset: -5 },  // Triádica 1
            { hOffset: -60, sOffset: 10, lOffset: 10 }   // Triádica 2
        ];

        variacoes.forEach(v => {
            const h = (hue + v.hOffset + 360) % 360;
            const s = Math.max(0, Math.min(100, saturation + v.sOffset));
            const l = Math.max(0, Math.min(100, lightness + v.lOffset));

            const hex = this.hslToHex(h, s, l);
            const nome = this.nomeHSL(h, s, l);

            paleta.push({ hex, nome, h, s, l });
        });

        return paleta;
    }

    calcularHue(temperatura, inspiracao) {
        let base = 200; // Azul padrão

        if (temperatura.includes('Quente') || temperatura.includes('🔥')) {
            base = Math.random() * 60; // Vermelho/Laranja
        } else if (temperatura.includes('Frio') || temperatura.includes('❄️')) {
            base = 180 + Math.random() * 60; // Azul/Ciano
        } else if (temperatura.includes('Muito Frio')) {
            base = 200 + Math.random() * 40;
        } else if (temperatura.includes('Muito Quente')) {
            base = Math.random() * 30;
        }

        // Adicionar variação baseada em inspiração
        const varHash = inspiracao.charCodeAt(0) || 0;
        base = (base + varHash * 2) % 360;

        return base;
    }

    calcularSaturacao(energia) {
        const sat = {
            'Ultra Pastel': 20 + Math.random() * 10,
            'Pastel Suave': 35 + Math.random() * 15,
            'Equilibrado': 55 + Math.random() * 15,
            'Vibrante': 75 + Math.random() * 15,
            'Neon/Ultra Vibrante': 95 + Math.random() * 5
        };
        return sat[energia] || 50;
    }

    calcularLuminosidade(energia, psicologia) {
        let base = 50;

        if (psicologia.includes('Calma')) {
            base = 60 + Math.random() * 20; // Mais claro
        } else if (psicologia.includes('Sofisticação')) {
            base = 40 + Math.random() * 20; // Mais escuro
        } else if (psicologia.includes('Alegria')) {
            base = 65 + Math.random() * 15; // Brilhante
        }

        if (energia.includes('Ultra')) {
            base = Math.max(20, base + (Math.random() * 20 - 10));
        }

        return Math.max(15, Math.min(85, base));
    }

    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r = 0, g = 0, b = 0;

        if (h < 60) {
            r = c; g = x; b = 0;
        } else if (h < 120) {
            r = x; g = c; b = 0;
        } else if (h < 180) {
            r = 0; g = c; b = x;
        } else if (h < 240) {
            r = 0; g = x; b = c;
        } else if (h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        const toHex = (v) => {
            const hex = Math.round((v + m) * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return '#' + toHex(r).toUpperCase() + toHex(g).toUpperCase() + toHex(b).toUpperCase();
    }

    nomeHSL(h, s, l) {
        const nomes = [
            'Vermelho', 'Laranja', 'Amarelo', 'Verde Limão', 'Verde',
            'Verde Água', 'Ciano', 'Azul Céu', 'Azul', 'Azul Marinho',
            'Roxo', 'Magenta', 'Rosa', 'Salmão'
        ];

        let idx = Math.floor((h / 360) * nomes.length);
        let nome = nomes[idx] || 'Cor';

        if (s < 30) nome += ' Pastel';
        else if (s > 80) nome += ' Vibrante';

        if (l > 70) nome += ' Claro';
        else if (l < 30) nome += ' Escuro';

        return nome;
    }

    mostrarResultado() {
        document.getElementById('questionario-fase').style.display = 'none';
        document.getElementById('gerando-fase').style.display = 'none';
        document.getElementById('resultado-fase').style.display = 'block';

        const descricao = `Baseado em: ${this.respostas['ambiente']}, ${this.respostas['psicologia'].toLowerCase()}`;
        document.getElementById('resultado-descricao').textContent = descricao;

        const container = document.getElementById('cores-container');
        container.innerHTML = '';

        this.coresGeradas.forEach((cor, idx) => {
            const card = document.createElement('div');
            card.className = 'cor-card';
            card.innerHTML = `
                <div class="cor-preview" style="--cor-bg: ${cor.hex}" data-hex="${cor.hex}"></div>
                <div class="cor-info">
                    <div class="cor-nome">${cor.nome}</div>
                    <div class="cor-codigo">${cor.hex}</div>
                </div>
            `;

            card.querySelector('.cor-preview').addEventListener('click', () => {
                this.copiarCor(cor.hex);
            });

            card.querySelector('.cor-codigo').addEventListener('click', () => {
                this.copiarCor(cor.hex);
            });

            container.appendChild(card);
        });

        this.setupEventos();
    }

    copiarCor(hex) {
        navigator.clipboard.writeText(hex).then(() => {
            this.mostrarToast(`${hex} copiado!`);
        });
    }

    copiarTodos() {
        const json = JSON.stringify(this.coresGeradas.map(c => ({ nome: c.nome, hex: c.hex })), null, 2);
        navigator.clipboard.writeText(json).then(() => {
            this.mostrarToast('Paleta copiada (JSON)!');
        });
    }

    mostrarToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 2500);
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new GeradorCores();
});
