// Configuração de endpoints
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/ai-detect'
    : 'https://saladeexperimentos.vercel.app/api/ai-detect';

// Elementos principais
const inputText = document.getElementById('inputText');
const analyzeBtn = document.getElementById('analyzeBtn');
const charCount = document.getElementById('charCount');
const resultContainer = document.getElementById('resultContainer');
const loadingContainer = document.getElementById('loadingContainer');
const emptyContainer = document.getElementById('emptyContainer');
const progressCircle = document.getElementById('gaugeProgress');
const percentageText = document.getElementById('percentageText');
const aiPercentage = document.getElementById('aiPercentage');
const humanPercentage = document.getElementById('humanPercentage');
const verdictEl = document.getElementById('verdict');
const clearBtn = document.getElementById('clearBtn');

// Containers de análise
const aiSignalsContainer = document.getElementById('aiSignalsContainer');
const aiSignals = document.getElementById('aiSignals');
const improvementContainer = document.getElementById('improvementContainer');
const improvements = document.getElementById('improvements');
const phrasesContainer = document.getElementById('phrasesContainer');
const phrases = document.getElementById('phrases');
const characteristicsContainer = document.getElementById('characteristicsContainer');
const characteristics = document.getElementById('characteristics');

// Atualizar contagem de caracteres
inputText.addEventListener('input', () => {
    charCount.textContent = inputText.value.length;
});

// Limpar texto
clearBtn?.addEventListener('click', () => {
    inputText.value = '';
    charCount.textContent = '0';
    resultContainer?.classList.add('hidden');
    emptyContainer?.classList.remove('hidden');
});

// Função para mostrar loading
function showLoading() {
    emptyContainer?.classList.add('hidden');
    resultContainer?.classList.add('hidden');
    loadingContainer?.classList.remove('hidden');
    analyzeBtn.disabled = true;
}

function hideLoading() {
    loadingContainer?.classList.add('hidden');
    analyzeBtn.disabled = false;
}

// Função para chamar a API
async function analyzeText(text) {
    const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Erro na API');
    }
    return resp.json();
}

// Botão Analisar
analyzeBtn.addEventListener('click', async () => {
    const txt = inputText.value.trim();
    if (!txt) return alert('Cole um texto para analisar');

    showLoading();
    try {
        const data = await analyzeText(txt);
        renderResult(data);
    } catch (err) {
        console.error(err);
        alert('Erro ao analisar: ' + (err.message || err));
    } finally {
        hideLoading();
    }
});

// Atalho Ctrl/Cmd + Enter
inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') analyzeBtn.click();
});

// Gera sinais de IA baseado na porcentagem
function generateAISignals(percentage, text) {
    const signals = [];

    if (percentage >= 75) {
        signals.push({
            label: 'Estrutura muito padronizada',
            detail: 'O texto segue um padrão muito uniforme e previsível.'
        });
        signals.push({
            label: 'Falta variação de estilo',
            detail: 'As frases têm comprimento e ritmo muito similares.'
        });
        signals.push({
            label: 'Linguagem genérica',
            detail: 'Uso excessivo de expressões e frases comuns.'
        });
    } else if (percentage >= 50) {
        signals.push({
            label: 'Padrões repetitivos detectados',
            detail: 'Estrutura de frases muito similar em vários pontos.'
        });
        signals.push({
            label: 'Transições artificiais',
            detail: 'Conectores entre ideias muito formais ou previsíveis.'
        });
    } else if (percentage >= 25) {
        signals.push({
            label: 'Alguns traços de IA',
            detail: 'Pequenas seções com padrões menos naturais.'
        });
    }

    return signals;
}

// Gera sugestões de melhoria
function generateImprovements(percentage, text) {
    const improvements = [];

    if (percentage >= 50) {
        improvements.push({
            label: 'Varie a estrutura das frases',
            detail: 'Alterne entre frases curtas, médias e longas.'
        });
        improvements.push({
            label: 'Adicione mais personalidade',
            detail: 'Use exemplos reais, experiências pessoais ou opiniões.'
        });
        improvements.push({
            label: 'Mude o tom em trechos',
            detail: 'Alterne entre formal, coloquial e narrativo.'
        });
    } else if (percentage >= 25) {
        improvements.push({
            label: 'Revise os parágrafos mais formais',
            detail: 'Torne-os mais naturais e pessoais.'
        });
        improvements.push({
            label: 'Adicione detalhes específicos',
            detail: 'Números reais, nomes, datas e contextos concretos.'
        });
    }

    return improvements;
}

// Renderiza resultado
function renderResult(data = {}) {
    const percentage = Math.max(0, Math.min(100, Math.round(data.percentage || 0)));
    const suspiciousPhrases = data.suspicious_phrases || [];
    const characteristics = data.characteristics || [];

    // === ATUALIZAR GAUGE ===
    percentageText.textContent = `${percentage}%`;
    aiPercentage.textContent = `${percentage}%`;
    humanPercentage.textContent = `${100 - percentage}%`;

    // Atualizar cor e progresso do gauge
    const gaugeProgress = document.getElementById('gaugeProgress');
    const strokeDashoffset = 219 - (percentage / 100) * 219;
    gaugeProgress.style.strokeDashoffset = strokeDashoffset;

    // Aplicar classe de cor baseada na porcentagem
    gaugeProgress.classList.remove('level-low', 'level-medium', 'level-high', 'level-critical');
    if (percentage >= 75) {
        gaugeProgress.classList.add('level-critical');
    } else if (percentage >= 50) {
        gaugeProgress.classList.add('level-high');
    } else if (percentage >= 25) {
        gaugeProgress.classList.add('level-medium');
    } else {
        gaugeProgress.classList.add('level-low');
    }

    // === VEREDITO ===
    verdictEl.classList.remove('verdict-human', 'verdict-low', 'verdict-medium', 'verdict-high');

    let vtext = '';
    if (percentage <= 15) {
        vtext = '✅ Texto claramente humano';
        verdictEl.classList.add('verdict-human');
    } else if (percentage <= 30) {
        vtext = '✔️ Provavelmente texto humano';
        verdictEl.classList.add('verdict-low');
    } else if (percentage <= 60) {
        vtext = '⚠️ Possível conteúdo de IA';
        verdictEl.classList.add('verdict-medium');
    } else {
        vtext = '🚨 Muito provável conteúdo de IA';
        verdictEl.classList.add('verdict-high');
    }
    verdictEl.textContent = vtext;

    // === SINAIS DE IA ===
    const signals = generateAISignals(percentage, inputText.value);
    if (signals.length > 0) {
        aiSignals.innerHTML = signals
            .map(s => `
                <div class="signal-item">
                    <span class="signal-label">${s.label}</span>
                    <span class="signal-detail">${s.detail}</span>
                </div>
            `)
            .join('');
        aiSignalsContainer.classList.remove('hidden');
    } else {
        aiSignalsContainer.classList.add('hidden');
    }

    // === ÁREAS DE MELHORIA ===
    const improvementsList = generateImprovements(percentage, inputText.value);
    if (improvementsList.length > 0) {
        improvements.innerHTML = improvementsList
            .map(imp => `
                <div class="improvement-item">
                    <span class="improvement-label">${imp.label}</span>
                    <span class="improvement-detail">${imp.detail}</span>
                </div>
            `)
            .join('');
        improvementContainer.classList.remove('hidden');
    } else {
        improvementContainer.classList.add('hidden');
    }

    // === TRECHOS SUSPEITOS ===
    if (suspiciousPhrases.length > 0) {
        phrases.innerHTML = suspiciousPhrases
            .slice(0, 5)
            .map(p => `<div class="phrase-item">"${p}"</div>`)
            .join('');
        phrasesContainer.classList.remove('hidden');
    } else {
        phrasesContainer.classList.add('hidden');
    }

    // === CARACTERÍSTICAS ===
    if (characteristics.length > 0) {
        characteristics.innerHTML = characteristics
            .slice(0, 5)
            .map(c => `
                <div class="characteristic-item">
                    <span class="characteristic-trait">${c.trait || 'Característica'}</span>
                    <span class="characteristic-evidence">${c.evidence || ''}</span>
                </div>
            `)
            .join('');
        characteristicsContainer.classList.remove('hidden');
    } else {
        characteristicsContainer.classList.add('hidden');
    }

    // === MOSTRAR RESULTADO ===
    emptyContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
}

// Reanalisar
document.getElementById('reanalyzeBtn')?.addEventListener('click', () => {
    analyzeBtn.click();
});