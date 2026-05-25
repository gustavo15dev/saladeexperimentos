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

// Highlighting
const highlightedTextSection = document.getElementById('highlightedTextSection');
const highlightedText = document.getElementById('highlightedText');
const floatingCard = document.getElementById('floatingCard');

// Containers de análise
const aiSignalsContainer = document.getElementById('aiSignalsContainer');
const aiSignals = document.getElementById('aiSignals');
const improvementContainer = document.getElementById('improvementContainer');
const improvements = document.getElementById('improvements');
const phrasesContainer = document.getElementById('phrasesContainer');
const phrases = document.getElementById('phrases');
const characteristicsContainer = document.getElementById('characteristicsContainer');
const characteristics = document.getElementById('characteristics');

// Estado global
let currentHighlights = [];

// ============================================
// EVENT LISTENERS
// ============================================

inputText.addEventListener('input', () => {
    charCount.textContent = inputText.value.length;
});

clearBtn?.addEventListener('click', () => {
    inputText.value = '';
    charCount.textContent = '0';
    resultContainer?.classList.add('hidden');
    emptyContainer?.classList.remove('hidden');
});

analyzeBtn.addEventListener('click', async () => {
    const txt = inputText.value.trim();
    if (!txt) return alert('Cole um texto para analisar');

    showLoading();
    try {
        const data = await analyzeText(txt);
        renderResult(data, txt);
    } catch (err) {
        console.error(err);
        alert('Erro ao analisar: ' + (err.message || err));
    } finally {
        hideLoading();
    }
});

inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') analyzeBtn.click();
});

document.getElementById('reanalyzeBtn')?.addEventListener('click', () => {
    analyzeBtn.click();
});

// Fechar card ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.highlight') && !e.target.closest('.floating-card')) {
        floatingCard.classList.remove('visible');
    }
});

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

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

// ============================================
// HIGHLIGHTING COM INTERATIVIDADE
// ============================================

function createHighlights(text, analysis) {
    const highlights = [];

    // Detectar padrões para highlighting
    const patterns = [
        // Padrões de estrutura repetitiva
        { regex: /\b(Primeiramente|Em primeiro lugar|Inicialmente|Primeiro),/gi, type: 'structure', title: '📐 Abertura Padrão', suggestion: 'Considere variações de inicio de parágrafo' },
        { regex: /\b(Em segundo lugar|Além disso|Posteriormente),/gi, type: 'structure', title: '📐 Estrutura Repetida', suggestion: 'Use conectivos mais variados' },
        { regex: /\b(Por fim|Por último|Finalmente|Conclusão),/gi, type: 'structure', title: '📐 Encerramento Padrão', suggestion: 'Varie a forma de conclusão' },
        // Linguagem genérica
        { regex: /\b(A sociedade|As pessoas|A população)\s+(contemporânea|moderna|atual)/gi, type: 'linguistic', title: '🔤 Expressão Genérica', suggestion: 'Seja mais específico - cite contextos reais' },
        { regex: /\b(deve se conscientizar|deve ter consciência|precisa entender)/gi, type: 'ai-pattern', title: '⚠️ Padrão de IA', suggestion: 'Substitua por argumentação mais concreta' },
        // Repertório vago
        { regex: /\b(estudos|pesquisas|dados|especialistas)\s+(apontam|mostram|indicam|revelam)/gi, type: 'repertoire', title: '📚 Repertório Vago', suggestion: 'Cite fontes e dados específicos' },
        // Proposta vaga
        { regex: /\b(o governo|a escola|a família)\s+(deve|precisa)\s+([a-zç]+)/gi, type: 'argument', title: '💬 Proposta Genérica', suggestion: 'Especifique quem faz o quê e como' },
    ];

    // Encontrar todos os matches
    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.regex.exec(text)) !== null) {
            highlights.push({
                start: match.index,
                end: match.index + match[0].length,
                type: pattern.type,
                title: pattern.title,
                feedback: match[0],
                suggestion: pattern.suggestion
            });
        }
    });

    // Remover duplicatas e sobrelaps
    highlights.sort((a, b) => a.start - b.start);
    const filtered = [];
    let lastEnd = -1;

    highlights.forEach(hl => {
        if (hl.start >= lastEnd) {
            filtered.push(hl);
            lastEnd = hl.end;
        }
    });

    return filtered;
}

function renderHighlightedText(text, highlights) {
    if (!highlights || highlights.length === 0) {
        highlightedTextSection.classList.add('hidden');
        return;
    }

    currentHighlights = highlights;
    let html = '';
    let lastIndex = 0;

    highlights.forEach((hl, idx) => {
        // Texto antes do highlight
        if (hl.start > lastIndex) {
            html += escapeHtml(text.substring(lastIndex, hl.start));
        }

        // Span do highlight
        const highlightText = text.substring(hl.start, hl.end);
        html += `<span class="highlight ${hl.type}" data-idx="${idx}" title="Clique para sugestão">${escapeHtml(highlightText)}</span>`;
        lastIndex = hl.end;
    });

    // Texto restante
    if (lastIndex < text.length) {
        html += escapeHtml(text.substring(lastIndex));
    }

    highlightedText.innerHTML = html;
    highlightedTextSection.classList.remove('hidden');

    // Adicionar event listeners
    document.querySelectorAll('.highlight').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(el.dataset.idx);
            const hl = currentHighlights[idx];
            showFloatingCard(el, hl);
        });
    });
}

function showFloatingCard(element, highlightData) {
    const rect = element.getBoundingClientRect();
    
    document.getElementById('cardTitle').textContent = highlightData.title;
    document.getElementById('cardCategory').textContent = getCategoryName(highlightData.type);
    document.getElementById('cardText').textContent = `"${highlightData.feedback}"`;
    document.getElementById('cardSuggestion').textContent = highlightData.suggestion;

    // Posicionar card
    let top = rect.bottom + 10;
    let left = Math.max(10, rect.left - 150);

    // Garantir que não saia da tela
    if (left + 340 > window.innerWidth) {
        left = window.innerWidth - 350;
    }

    floatingCard.style.top = top + 'px';
    floatingCard.style.left = left + 'px';
    floatingCard.classList.add('visible');
}

function getCategoryName(type) {
    const names = {
        'linguistic': '🔤 Linguístico',
        'structure': '📐 Estrutura',
        'argument': '💬 Argumentação',
        'repertoire': '📚 Repertório',
        'ai-pattern': '⚠️ Padrão IA'
    };
    return names[type] || type;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// GERAÇÃO DE SINAIS E SUGESTÕES
// ============================================

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

function generateImprovements(percentage, text) {
    const improvements = [];

    if (percentage >= 50) {
        improvements.push({
            label: 'Varie a estrutura das frases',
            detail: 'Alterne entre frases curtas, médias e longas para melhor ritmo.'
        });
        improvements.push({
            label: 'Adicione mais personalidade',
            detail: 'Use exemplos reais, experiências pessoais ou opiniões genuínas.'
        });
        improvements.push({
            label: 'Diversifique os conectivos',
            detail: 'Não use sempre os mesmos: "Portanto", "Contudo", "Além disso".'
        });
    } else if (percentage >= 25) {
        improvements.push({
            label: 'Revise os parágrafos mais formais',
            detail: 'Torne-os mais naturais adicionando detalhes pessoais.'
        });
        improvements.push({
            label: 'Adicione contextos específicos',
            detail: 'Cite números reais, nomes, datas e situações concretas.'
        });
    }

    return improvements;
}

// ============================================
// RENDERIZAÇÃO PRINCIPAL
// ============================================

function renderResult(data = {}, originalText = '') {
    const percentage = Math.max(0, Math.min(100, Math.round(data.percentage || 0)));
    const suspiciousPhrases = data.suspicious_phrases || [];
    const characteristics = data.characteristics || [];

    // === GAUGE ===
    updateGauge(percentage);

    // === VEREDITO ===
    updateVerdict(percentage);

    // === HIGHLIGHTING ===
    const highlights = createHighlights(originalText, data);
    renderHighlightedText(originalText, highlights);

    // === SINAIS DE IA ===
    const signals = generateAISignals(percentage, originalText);
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
    const improvementsList = generateImprovements(percentage, originalText);
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

function updateGauge(percentage) {
    percentageText.textContent = `${percentage}%`;
    aiPercentage.textContent = `${percentage}%`;
    humanPercentage.textContent = `${100 - percentage}%`;

    const strokeDashoffset = 219 - (percentage / 100) * 219;
    progressCircle.style.strokeDashoffset = strokeDashoffset;

    progressCircle.classList.remove('level-low', 'level-medium', 'level-high', 'level-critical');
    if (percentage >= 75) {
        progressCircle.classList.add('level-critical');
    } else if (percentage >= 50) {
        progressCircle.classList.add('level-high');
    } else if (percentage >= 25) {
        progressCircle.classList.add('level-medium');
    } else {
        progressCircle.classList.add('level-low');
    }
}

function updateVerdict(percentage) {
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
}

console.log('✅ ZeroIA carregado com sucesso!');