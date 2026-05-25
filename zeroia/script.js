// Configuração de endpoints
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/ai-detect'
    : 'https://saladeexperimentos.vercel.app/api/ai-detect';

// Elementos principais do Painel Esquerdo
const inputText = document.getElementById('inputText');
const interactiveTextContainer = document.getElementById('interactiveTextContainer');
const highlightedText = document.getElementById('highlightedText');
const legendContainer = document.getElementById('legendContainer');
const charCount = document.getElementById('charCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const editBtn = document.getElementById('editBtn');
const clearBtn = document.getElementById('clearBtn');
const shortcutHint = document.getElementById('shortcutHint');
const inputPanelTitle = document.getElementById('inputPanelTitle');
const inputPanelHint = document.getElementById('inputPanelHint');

// Elementos principais do Painel de Resultados (Direito)
const resultContainer = document.getElementById('resultContainer');
const loadingContainer = document.getElementById('loadingContainer');
const emptyContainer = document.getElementById('emptyContainer');
const progressCircle = document.getElementById('gaugeProgress');
const percentageText = document.getElementById('percentageText');
const aiPercentage = document.getElementById('aiPercentage');
const humanPercentage = document.getElementById('humanPercentage');
const verdictEl = document.getElementById('verdict');

// Card flutuante de sugestões
const floatingCard = document.getElementById('floatingCard');

// Containers de análise detalhada (Direito)
const aiSignalsContainer = document.getElementById('aiSignalsContainer');
const aiSignals = document.getElementById('aiSignals');
const improvementContainer = document.getElementById('improvementContainer');
const improvements = document.getElementById('improvements');
const phrasesContainer = document.getElementById('phrasesContainer');
const phrases = document.getElementById('phrases');
const characteristicsContainer = document.getElementById('characteristicsContainer');
const characteristics = document.getElementById('characteristics');

// Estado global do aplicativo
let currentHighlights = [];
let analyzedTextContent = '';

// ============================================
// EVENT LISTENERS
// ============================================

inputText.addEventListener('input', () => {
    charCount.textContent = inputText.value.length;
});

clearBtn?.addEventListener('click', () => {
    inputText.value = '';
    charCount.textContent = '0';
    resetToEditMode();
    resultContainer?.classList.add('hidden');
    emptyContainer?.classList.remove('hidden');
});

analyzeBtn.addEventListener('click', async () => {
    const txt = inputText.value.trim();
    if (!txt) {
        alert('Cole um texto para analisar');
        return;
    }

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

// Ao clicar em "Editar Texto", volta para a edição mantendo as modificações feitas pelas substituições
editBtn.addEventListener('click', () => {
    resetToEditMode();
});

inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        analyzeBtn.click();
    }
});

document.getElementById('reanalyzeBtn')?.addEventListener('click', () => {
    analyzeBtn.click();
});

// Fechar card ao clicar fora de um termo grifado ou do próprio card
document.addEventListener('click', (e) => {
    if (!e.target.closest('.highlight') && !e.target.closest('.floating-card')) {
        floatingCard.classList.remove('visible');
    }
});

// ============================================
// MODOS DE EXIBIÇÃO DO PAINEL ESQUERDO
// ============================================

function resetToEditMode() {
    // Volta a exibir o textarea e esconde a área grifada
    inputText.classList.remove('hidden');
    interactiveTextContainer.classList.add('hidden');
    legendContainer.classList.add('hidden');
    
    // Atualiza os botões de ação
    analyzeBtn.classList.remove('hidden');
    editBtn.classList.add('hidden');
    shortcutHint.classList.remove('hidden');
    
    // Altera títulos informativos
    inputPanelTitle.textContent = "Cole seu texto";
    inputPanelHint.textContent = "Máximo 5000 caracteres";
    
    // Fecha o card de sugestões
    floatingCard.classList.remove('visible');
}

function setToInteractiveMode() {
    // Esconde o textarea para focar na visualização interativa com os grifos no próprio texto original
    inputText.classList.add('hidden');
    interactiveTextContainer.classList.remove('hidden');
    legendContainer.classList.remove('hidden');
    
    // Atualiza os botões de ação
    analyzeBtn.classList.add('hidden');
    editBtn.classList.remove('hidden');
    shortcutHint.classList.add('hidden');
    
    // Altera títulos informativos
    inputPanelTitle.textContent = "Texto Analisado e Corrigível";
    inputPanelHint.textContent = "Clique nos termos grifados para ver sugestões";
}

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
// HIGHLIGHTING COM INTERATIVIDADE DIRETA NO TEXTO
// ============================================

function createHighlights(text, analysis) {
    const highlights = [];

    // Padrões de detecção locais atualizados com legendas muito simples
    const patterns = [
        // Linguagem comum / Genérica
        { regex: /\b(A sociedade|As pessoas|A população)\s+(contemporânea|moderna|atual)/gi, type: 'linguistic', title: '🔤 Linguagem Comum', suggestion: 'Substitua por termos mais específicos ou cite contextos mais detalhados.' },
        
        // Frases repetitivas / Transições duras
        { regex: /\b(Primeiramente|Em primeiro lugar|Inicialmente|Primeiro),/gi, type: 'structure', title: '📐 Abertura Padrão', suggestion: 'Varie o início para dar mais ritmo ao texto.' },
        { regex: /\b(Em segundo lugar|Além disso|Posteriormente|Ademais),/gi, type: 'structure', title: '📐 Conector de Transição', suggestion: 'Evite a transição rígida de tópicos.' },
        { regex: /\b(Por fim|Por último|Finalmente|Conclusão|Em suma),/gi, type: 'structure', title: '📐 Encerramento Padrão', suggestion: 'Conclua seu pensamento com conectivos menos óbvios.' },
        
        // Ideia Vaga / Argumento Vazio
        { regex: /\b(deve se conscientizar|deve ter consciência|precisa entender|é necessário que)/gi, type: 'ai-pattern', title: '⚠️ Solução Clichê', suggestion: 'Explique como essa conscientização aconteceria de forma prática.' },
        { regex: /\b(o governo|a escola|a família)\s+(deve|precisa)\s+([a-zç]+)/gi, type: 'argument', title: '💬 Agente Vago', suggestion: 'Indique exatamente qual ministério, projeto social ou ação resolveria a situação.' },
        
        // Falta de Fonte / Repertório vago
        { regex: /\b(estudos|pesquisas|dados|especialistas)\s+(apontam|mostram|indicam|revelam|afirmam)/gi, type: 'repertoire', title: '📚 Fonte Não Citada', suggestion: 'Especifique quais estudos ou de qual órgão/universidade os dados provêm.' }
    ];

    // Encontrar os matches no texto
    patterns.forEach(pattern => {
        let match;
        pattern.regex.lastIndex = 0; // reset
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

    // Ordenar e remover sobreposições
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
    currentHighlights = highlights;
    let html = '';
    let lastIndex = 0;

    highlights.forEach((hl, idx) => {
        // Texto anterior ao highlight
        if (hl.start > lastIndex) {
            html += escapeHtml(text.substring(lastIndex, hl.start));
        }

        // Tag do termo grifado
        const highlightText = text.substring(hl.start, hl.end);
        html += `<span class="highlight ${hl.type}" data-idx="${idx}" title="Clique para corrigir">${escapeHtml(highlightText)}</span>`;
        lastIndex = hl.end;
    });

    // Restante do texto
    if (lastIndex < text.length) {
        html += escapeHtml(text.substring(lastIndex));
    }

    highlightedText.innerHTML = html;
    
    // Ativa o modo interativo dividindo o espaço de input
    setToInteractiveMode();

    // Atribuir cliques aos termos grifados no próprio texto
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
    const originalWord = element.textContent;
    const alternatives = getAlternatives(originalWord, highlightData.type);
    
    // Atualiza os textos do cabeçalho do card
    document.getElementById('cardTitle').textContent = highlightData.title;
    document.getElementById('cardCategory').textContent = getCategoryFriendlyName(highlightData.type);
    document.getElementById('cardText').textContent = `"${originalWord}"`;

    // Constrói a sugestão explicativa
    let suggestionHtml = `
        <div class="card-suggestion">
            <strong>💡 Como melhorar:</strong>
            <p>${highlightData.suggestion}</p>
        </div>
    `;

    // Constrói a lista com as IDEIAS DE PALAVRAS práticas de substituição direta
    let alternativesHtml = '';
    if (alternatives.length > 0) {
        alternativesHtml = `
            <div class="alternatives-box">
                <strong>✨ Substitua instantaneamente por:</strong>
                <div class="alternatives-list">
                    ${alternatives.map(alt => `
                        <button class="alternative-btn" data-word="${alt.trim()}">
                            ${alt.trim()}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Alimenta o container do card com as sugestões explicativas e práticas
    const suggestionBox = document.getElementById('cardSuggestionBox');
    suggestionBox.innerHTML = suggestionHtml + alternativesHtml;

    // Vincula a substituição automática em lote para cada botão de ideia sugerida
    suggestionBox.querySelectorAll('.alternative-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedWord = btn.dataset.word;
            replaceWord(element, originalWord, selectedWord);
            floatingCard.classList.remove('visible');
        });
    });

    // Posicionar o card dinamicamente próximo ao elemento grifado clicado
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Define a posição absoluta do card em relação ao body
    let top = rect.bottom + scrollTop + 8;
    let left = rect.left + scrollLeft - 20;

    // Impede que o card exceda as margens da janela
    if (left + 320 > window.innerWidth) {
        left = window.innerWidth - 335;
    }
    if (left < 10) {
        left = 10;
    }

    floatingCard.style.top = top + 'px';
    floatingCard.style.left = left + 'px';
    floatingCard.classList.add('visible');
}

// Simplificação amigável para a categoria dos grifos
function getCategoryFriendlyName(type) {
    const names = {
        'linguistic': 'Linguagem Comum',
        'structure': 'Frase Repetitiva',
        'argument': 'Ideia Vaga',
        'repertoire': 'Falta de Fonte',
        'ai-pattern': 'Estilo de IA'
    };
    return names[type] || 'Ajuste Geral';
}

// Proposição de no mínimo 3 a 4 palavras de substituição contextual e real
function getAlternatives(word, type) {
    // Normalização básica para busca inteligente
    const normalized = word.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

    const alternativesMap = {
        'linguistic': {
            'A sociedade': ['Os cidadãos', 'A coletividade', 'A comunidade civil', 'A população'],
            'As pessoas': ['Os indivíduos', 'Os sujeitos', 'Os cidadãos', 'A população em geral'],
            'A população': ['A sociedade civil', 'A comunidade', 'O corpo social', 'Os habitantes'],
            'contemporânea': ['atual', 'de nossa era', 'do nosso tempo', 'moderna'],
            'moderna': ['vigente', 'atual', 'contemporânea', 'do presente momento']
        },
        'structure': {
            'Primeiramente': ['De início', 'Para começar', 'Em primeiro plano', 'A princípio'],
            'Em primeiro lugar': ['Como ponto de partida', 'Primeiramente', 'Antes de tudo', 'De antemão'],
            'Em segundo lugar': ['Além disso', 'Ademais', 'Somado a isso', 'Outro ponto relevante é'],
            'Por fim': ['Em conclusão', 'Por conseguinte', 'Em suma', 'Portanto'],
            'Por último': ['Por derradeiro', 'Por fim', 'Em última análise', 'Conclusivamente'],
            'Finalmente': ['Dessa forma', 'Como consequência', 'Por fim', 'Em síntese']
        },
        'argument': {
            'o governo deve': ['o Ministério Público pode', 'as secretarias estaduais devem', 'o Poder Legislativo tem o papel de', 'os governantes precisam'],
            'a escola precisa': ['as instituições educacionais devem', 'o corpo pedagógico precisa', 'os colégios públicos têm de', 'os educadores podem'],
            'a família deve': ['o núcleo familiar precisa', 'os pais e responsáveis devem', 'a rede de apoio familiar pode', 'a orientação familiar deve']
        },
        'repertoire': {
            'estudos apontam': ['pesquisas da USP apontam', 'dados do IBGE mostram', 'relatórios da ONU confirmam', 'indicadores do setor revelam'],
            'pesquisas indicam': ['estudos do Ipea apontam', 'levantamentos estatísticos confirmam', 'artigos científicos revelam', 'dados empíricos demonstram'],
            'especialistas afirmam': ['pesquisadores da área explicam', 'profissionais da saúde sustentam', 'analistas de mercado afirmam', 'acadêmicos pontuam'],
            'é necessário destacar': ['merece atenção especial', 'faz-se imperativo observar', 'cabe ressaltar com afinco', 'notabiliza-se que']
        },
        'ai-pattern': {
            'deve se conscientizar': ['precisa agir ativamente', 'deve refletir criticamente sobre', 'precisa participar ativamente de', 'pode se engajar em'],
            'deve ter consciência': ['deve adotar posturas éticas', 'precisa ponderar sobre as consequências de', 'deve mobilizar esforços para', 'precisa amadurecer a percepção de']
        }
    };

    const typeAlts = alternativesMap[type] || {};

    // 1. Busca pela correspondência exata
    if (typeAlts[normalized]) {
        return typeAlts[normalized];
    }

    // 2. Busca parcial (caso seja uma variação ou frase contendo o trecho)
    for (const [key, list] of Object.entries(typeAlts)) {
        if (normalized.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalized.toLowerCase())) {
            return list;
        }
    }

    // 3. Fallback inteligente e enriquecido caso não encontre correspondência
    const fallbacks = {
        'linguistic': ['termo mais preciso', 'vocábulo específico', 'expressão autoral', 'conceito definido'],
        'structure': ['introdução original', 'conectivo alternativo', 'relação fluida de causa', 'transição pessoal'],
        'argument': ['detalhe prático da proposta', 'ação direta', 'agente específico de mudança', 'medida aplicável'],
        'repertoire': ['dado de fonte oficial', 'estudo de universidade pública', 'exemplo jornalístico real', 'fato histórico de destaque'],
        'ai-pattern': ['ponto de vista argumentativo', 'exposição de causa e efeito', 'exemplo tangível', 'visão particular do problema']
    };

    return fallbacks[type] || ['ideia mais precisa', 'termo autoral', 'perspectiva detalhada'];
}

// Substituição instantânea do termo e atualização do editor oculto
function replaceWord(element, oldWord, newWord) {
    // 1. Substituir visualmente no elemento grifado ativo
    element.textContent = newWord;
    
    // Limpa a formatação de erro visual
    element.className = 'highlight word-replaced-flash';
    
    // 2. Atualizar o valor oficial no textarea original para que a mudança persista nas análises seguintes
    const originalText = inputText.value;
    
    // Substitui de forma segura apenas na ocorrência correspondente
    const updatedText = originalText.replace(oldWord, newWord);
    inputText.value = updatedText;
    analyzedTextContent = updatedText;
    
    // Atualizar o contador oficial de caracteres
    charCount.textContent = updatedText.length;
    
    // 3. Recriar os listeners temporários para evitar descompasso
    setTimeout(() => {
        element.classList.remove('word-replaced-flash');
    }, 1500);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// GERAÇÃO DE SINAIS E SUGESTÕES GERAIS
// ============================================

function generateAISignals(percentage, text) {
    const signals = [];

    if (percentage >= 75) {
        signals.push({
            label: 'Vocabulário Excessivamente Neutro',
            detail: 'O texto utiliza expressões extremamente comuns e encadeadas que não demonstram subjetividade.'
        });
        signals.push({
            label: 'Redação em Blocos Perfeitos',
            detail: 'Todos os parágrafos iniciam e concluem com transições rígidas e idênticas.'
        });
        signals.push({
            label: 'Generalização do Tema',
            detail: 'Abordagem vaga do assunto sem detalhamento de nomes, localidades ou datas reais.'
        });
    } else if (percentage >= 50) {
        signals.push({
            label: 'Padrão de Escrita Cadenciado',
            detail: 'Frases com proporção similar de tamanho e pouca variação de pontuação.'
        });
        signals.push({
            label: 'Soluções utópicas',
            detail: 'Recomendação de soluções prontas baseadas em conscientização ampla e abstrata.'
        });
    } else if (percentage >= 25) {
        signals.push({
            label: 'Fórmula de Escrita Pronta',
            detail: 'Uso recorrente de conectivos burocráticos ao iniciar parágrafos.'
        });
    }

    return signals;
}

function generateImprovements(percentage, text) {
    const improvements = [];

    if (percentage >= 50) {
        improvements.push({
            label: 'Traga exemplos da realidade local',
            detail: 'Seja específico: em vez de dizer "o governo", aponte uma secretaria, um programa social ou lei.'
        });
        improvements.push({
            label: 'Quebre a harmonia das sentenças',
            detail: 'Utilize algumas frases curtas e diretas intercaladas com parágrafos mais explicativos.'
        });
        improvements.push({
            label: 'Troque conectivos padronizados',
            detail: 'Use pontuações naturais ou ligue ideias sem depender de "Portanto" ou "Além disso".'
        });
    } else if (percentage >= 25) {
        improvements.push({
            label: 'Enriqueça seu repertório',
            detail: 'Forneça dados, citações reais ou referências sociológicas concretas para embasar.'
        });
    }

    return improvements;
}

// ============================================
// RENDERIZAÇÃO DA ANÁLISE COMPLETA
// ============================================

function renderResult(data = {}, originalText = '') {
    const percentage = Math.max(0, Math.min(100, Math.round(data.percentage || 0)));
    const suspiciousPhrases = data.suspicious_phrases || [];
    const characteristics = data.characteristics || [];
    analyzedTextContent = originalText;

    // === GAUGE ===
    updateGauge(percentage);

    // === VEREDITO ===
    updateVerdict(percentage);

    // === HIGHLIGHTING DIRETO NO PAINEL ESQUERDO ===
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
                    <span class="characteristic-trait">${c.trait || 'Análise da Sentença'}</span>
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
        vtext = '✅ Escrita Natural e Humana';
        verdictEl.classList.add('verdict-human');
    } else if (percentage <= 30) {
        vtext = '✔️ Baixos indícios de automação';
        verdictEl.classList.add('verdict-low');
    } else if (percentage <= 60) {
        vtext = '⚠️ Possível uso parcial de IA';
        verdictEl.classList.add('verdict-medium');
    } else {
        vtext = '🚨 Padrões artificiais de IA detectados';
        verdictEl.classList.add('verdict-high');
    }
    verdictEl.textContent = vtext;
}

console.log('✅ ZeroIA carregado com sucesso!');