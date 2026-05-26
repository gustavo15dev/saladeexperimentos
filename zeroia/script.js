// Configuração de endpoints
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/ai-detect'
    : 'https://saladeexperimentos.vercel.app/api/ai-detect';

// Elementos principais do Editor (Painel Esquerdo)
const inputText = document.getElementById('inputText');
const interactiveTextContainer = document.getElementById('interactiveTextContainer');
const highlightedText = document.getElementById('highlightedText');
const legendContainer = document.getElementById('legendContainer');
const charCount = document.getElementById('charCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const tabWrite = document.getElementById('tabWrite');
const tabAnalyze = document.getElementById('tabAnalyze');

// Elementos principais de Análise (Painel Direito)
const resultContainer = document.getElementById('resultContainer');
const loadingContainer = document.getElementById('loadingContainer');
const emptyContainer = document.getElementById('emptyContainer');
const progressCircle = document.getElementById('gaugeProgress');
const percentageText = document.getElementById('percentageText');
const aiPercentage = document.getElementById('aiPercentage');
const humanPercentage = document.getElementById('humanPercentage');
const verdictEl = document.getElementById('verdict');

// Card flutuante
const floatingCard = document.getElementById('floatingCard');

// Containers da barra lateral direita
const aiSignalsContainer = document.getElementById('aiSignalsContainer');
const aiSignals = document.getElementById('aiSignals');
const improvementContainer = document.getElementById('improvementContainer');
const improvements = document.getElementById('improvements');
const phrasesContainer = document.getElementById('phrasesContainer');
const phrases = document.getElementById('phrases');
const characteristicsContainer = document.getElementById('characteristicsContainer');
const characteristics = document.getElementById('characteristics');

// Estado Global
let currentHighlights = [];
let hasBeenAnalyzed = false;

// ============================================
// SISTEMA DE ABAS DO EDITOR (✍️ Modo Escrita vs 📖 Modo Correção)
// ============================================

tabWrite.addEventListener('click', () => {
    switchEditorMode('write');
});

tabAnalyze.addEventListener('click', () => {
    if (hasBeenAnalyzed) {
        switchEditorMode('analyze');
    }
});

function switchEditorMode(mode) {
    if (mode === 'write') {
        tabWrite.classList.add('active');
        tabAnalyze.classList.remove('active');
        
        inputText.classList.remove('hidden');
        interactiveTextContainer.classList.add('hidden');
        legendContainer.classList.add('hidden');
        
        floatingCard.classList.remove('visible');
    } else {
        tabWrite.classList.remove('active');
        tabAnalyze.classList.add('active');
        
        inputText.classList.add('hidden');
        interactiveTextContainer.classList.remove('hidden');
        legendContainer.classList.remove('hidden');
    }
}

// ============================================
// EVENT LISTENERS DE CONTROLE
// ============================================

inputText.addEventListener('input', () => {
    charCount.textContent = inputText.value.length;
});

clearBtn?.addEventListener('click', () => {
    inputText.value = '';
    charCount.textContent = '0';
    hasBeenAnalyzed = false;
    tabAnalyze.disabled = true;
    switchEditorMode('write');
    
    resultContainer?.classList.add('hidden');
    emptyContainer?.classList.remove('hidden');
});

analyzeBtn.addEventListener('click', async () => {
    // Sempre analisa o texto que está no inputText atualmente
    const txt = inputText.value.trim();
    if (!txt) {
        alert('Por favor, digite ou cole um texto antes de analisar!');
        return;
    }

    showLoading();
    try {
        const data = await analyzeText(txt);
        renderResult(data, txt);
        
        hasBeenAnalyzed = true;
        tabAnalyze.disabled = false;
        switchEditorMode('analyze'); // Vai para visualização de grifos automaticamente
    } catch (err) {
        console.error(err);
        alert('Erro ao analisar a redação: ' + (err.message || err));
    } finally {
        hideLoading();
    }
});

// Atalho de teclado para facilidade de uso
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        analyzeBtn.click();
    }
});

document.getElementById('reanalyzeBtn')?.addEventListener('click', () => {
    analyzeBtn.click();
});

// Fecha o card de sugestões se o clique for fora do grifo ou do card
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
        throw new Error(err.error || 'Erro interno do servidor de análise.');
    }
    return resp.json();
}

// ============================================
// MOTOR HÍBRIDO DE CONTEXTO E GRIFOS
// ============================================

function createHighlights(text, data) {
    const highlights = [];
    const suspiciousPhrases = data.suspicious_phrases || [];

    // 1. REGRA 1: Procura e grifa em ordem prioritária todas as frases que a IA da API considerou suspeitas
    suspiciousPhrases.forEach(phrase => {
        if (phrase.length < 5) return; // ignora fragmentos sem sentido
        let index = 0;
        // Encontra todas as ocorrências da frase suspeita gerada pela API
        while (true) {
            const foundIndex = text.toLowerCase().indexOf(phrase.toLowerCase(), index);
            if (foundIndex === -1) break;
            
            highlights.push({
                start: foundIndex,
                end: foundIndex + phrase.length,
                type: 'ai-pattern',
                title: '🤖 Frase Padrão IA',
                feedback: phrase,
                suggestion: 'Este fragmento de texto apresenta perplexidade extremamente regular, idêntica ao estilo de redação das IAs.'
            });
            index = foundIndex + phrase.length;
        }
    });

    // 2. REGRA 2: Verificações locais focadas na folha de autoria do ENEM (Letrus)
    const patterns = [
        // Linguagem Comum clichê
        { regex: /\b(A sociedade|As pessoas|A população)\s+(contemporânea|moderna|atual)/gi, type: 'linguistic', title: '🔤 Linguagem Comum', suggestion: 'Substitua por um agente real que defina melhor quem faz parte desse grupo.' },
        { regex: /\b(nos dias de hoje|no mundo atual|atualmente)/gi, type: 'linguistic', title: '🔤 Pleonasmo Temporal', suggestion: 'Muito simplista. Prefira introduzir o contexto de forma direta e ativa.' },
        
        // Estrutura mecânica clichê
        { regex: /\b(Primeiramente|Em primeiro lugar|Inicialmente|A princípio),/gi, type: 'structure', title: '📐 Abertura Padrão', suggestion: 'Conectivo de redação padrão de IA. Comece o parágrafo diretamente de forma autoral.' },
        { regex: /\b(Em segundo lugar|Além disso|Posteriormente|Ademais),/gi, type: 'structure', title: '📐 Transição Rígida', suggestion: 'As IAs utilizam blocos de transição muito lineares. Evite essa marcação engessada.' },
        { regex: /\b(Por fim|Por último|Finalmente|Conclusão|Em suma),/gi, type: 'structure', title: '📐 Conclusão Prevista', suggestion: 'Evite terminar parágrafos com conectivos de conclusão excessivamente repetitivos.' },
        
        // Proposta vaga de ação
        { regex: /\b(deve se conscientizar|deve ter consciência|precisa entender)/gi, type: 'argument', title: '💬 Proposta Vaga', suggestion: 'Mencione ações práticas de conscientização ao invés de usar o termo abstrato.' },
        { regex: /\b(o governo|a escola|a família)\s+(deve|precisa)\s+([a-zç]+)/gi, type: 'argument', title: '💬 Agente Indefinido', suggestion: 'Indique o ministério ou secretaria específico responsável por essa ação.' },
        
        // Repertório sem fonte confiável
        { regex: /\b(estudos|pesquisas|dados|especialistas)\s+(apontam|mostram|indicam|revelam|afirmam)/gi, type: 'repertoire', title: '📚 Fonte Ocultada', suggestion: 'Citar dados ou pesquisas genéricas enfraquece a autoria. Cite órgãos específicos.' }
    ];

    patterns.forEach(pattern => {
        let match;
        pattern.regex.lastIndex = 0;
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

    // Ordenar por ordem cronológica no texto e eliminar sobreposições para manter renderização impecável
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
        // Texto limpo antes do grifo
        if (hl.start > lastIndex) {
            html += escapeHtml(text.substring(lastIndex, hl.start));
        }

        // Tag do grifo com ID mapeado para substituição única
        const highlightText = text.substring(hl.start, hl.end);
        html += `<span class="highlight ${hl.type}" data-idx="${idx}" id="hl-${idx}" title="Clique para avaliar">${escapeHtml(highlightText)}</span>`;
        lastIndex = hl.end;
    });

    // Restante do texto
    if (lastIndex < text.length) {
        html += escapeHtml(text.substring(lastIndex));
    }

    highlightedText.innerHTML = html;

    // Vincula o evento de clique nos novos grifos gerados
    document.querySelectorAll('.highlight').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(el.dataset.idx);
            const hl = currentHighlights[idx];
            if (hl) {
                showFloatingCard(el, hl);
            }
        });
    });
}

function showFloatingCard(element, highlightData) {
    const originalWord = element.textContent;
    
    // Obtém o texto total para analisar o gênero/número das palavras ao redor
    const fullText = inputText.value;
    const alternatives = getAlternativesWithContext(originalWord, highlightData.type, fullText, highlightData.start);
    
    document.getElementById('cardTitle').textContent = highlightData.title;
    document.getElementById('cardCategory').textContent = getCategoryFriendlyName(highlightData.type);
    document.getElementById('cardText').textContent = `"${originalWord}"`;

    let suggestionHtml = `
        <div class="card-suggestion">
            <strong>💡 Recomendação de Autoria:</strong>
            <p>${highlightData.suggestion}</p>
        </div>
    `;

    // Renderiza a lista se houver ideias contextuais
    let alternativesHtml = '';
    if (alternatives.length > 0) {
        alternativesHtml = `
            <div class="alternatives-box">
                <strong>✨ Troque instantaneamente por:</strong>
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

    const suggestionBox = document.getElementById('cardSuggestionBox');
    suggestionBox.innerHTML = suggestionHtml + alternativesHtml;

    // Vincula o evento de substituição apenas para este card
    suggestionBox.querySelectorAll('.alternative-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedWord = btn.dataset.word;
            replaceWord(element, originalWord, selectedWord);
            floatingCard.classList.remove('visible');
        });
    });

    // Posicionamento elegante do card próximo ao termo correspondente
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    let top = rect.bottom + scrollTop + 8;
    let left = rect.left + scrollLeft - 15;

    // Impede estouros laterais do card flutuante na viewport
    if (left + 330 > window.innerWidth) {
        left = window.innerWidth - 345;
    }
    if (left < 10) {
        left = 10;
    }

    floatingCard.style.top = top + 'px';
    floatingCard.style.left = left + 'px';
    floatingCard.classList.add('visible');
}

function getCategoryFriendlyName(type) {
    const names = {
        'linguistic': 'Linguagem Comum',
        'structure': 'Frase de Transição',
        'argument': 'Proposta Vaga',
        'repertoire': 'Repertório Sem Fonte',
        'ai-pattern': 'Estilo de IA'
    };
    return names[type] || 'Estilo Geral';
}

// ============================================
// SISTEMA DE CONCORDÂNCIA E COERÊNCIA CONTEXTUAL
// ============================================

function getAlternativesWithContext(word, type, fullText, startIndex) {
    const cleanWord = word.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const lowerWord = cleanWord.toLowerCase();

    // 1. Extração de contexto (analisa as palavras vizinhas antes e depois)
    const wordsBefore = fullText.substring(Math.max(0, startIndex - 20), startIndex).toLowerCase().trim();
    
    // Detectores de Concordância de Gênero (Masc / Fem)
    let isFeminine = false;
    if (wordsBefore.endsWith(' a') || wordsBefore.endsWith('as') || wordsBefore.endsWith('uma') || wordsBefore.endsWith('da') || wordsBefore.endsWith('na')) {
        isFeminine = true;
    }

    // Mapas de ideias reais e contextualizadas para substituição instantânea (mínimo 3 de alta qualidade)
    const map = {
        'linguistic': {
            'a sociedade': ['a coletividade nacional', 'o corpo social do país', 'a comunidade civil', 'o conjunto dos cidadãos'],
            'as pessoas': ['os indivíduos', 'os membros do corpo social', 'os cidadãos', 'os sujeitos sociais'],
            'a população': ['o corpo civil', 'a comunidade de indivíduos', 'os cidadãos em geral', 'o conjunto social'],
            'contemporânea': isFeminine 
                ? ['atual', 'de nossa era', 'da atualidade', 'do presente período']
                : ['atual', 'de nossa era', 'do presente momento', 'vigente'],
            'moderna': isFeminine
                ? ['vigente', 'atual', 'contemporânea', 'do presente século']
                : ['vigente', 'atual', 'contemporâneo', 'do nosso século'],
            'nos dias de hoje': ['na contemporaneidade', 'sob o panorama de nossa época', 'no atual cenário brasileiro', 'no presente século']
        },
        'structure': {
            'primeiramente': ['De início', 'Como ponto de partida', 'Em primeiro plano', 'A princípio'],
            'em primeiro lugar': ['Como tese inaugural', 'A princípio', 'Antes de tudo', 'Como ponto de partida'],
            'em segundo lugar': ['Somado a isso', 'Ademais', 'Outro fator relevante é', 'Paralelo a esse panorama'],
            'por fim': ['Dessa forma, conclui-se', 'Por conseguinte, convém notar', 'Em suma, torna-se claro', 'Por fim, infere-se'],
            'por último': ['Em última análise', 'Conclusivamente, é perceptível', 'Por derradeiro, faz-se útil', 'Em síntese final'],
            'finalmente': ['Por consequência', 'Sob essa ótica', 'Com efeito', 'Dessa maneira']
        },
        'argument': {
            'o governo deve': ['o Poder Executivo Federal deve', 'as administrações municipais necessitam', 'o Poder Público precisa', 'as pastas ministeriais devem'],
            'a escola precisa': ['o corpo docente em conjunto com a direção escolar deve', 'as instituições públicas de ensino precisam', 'o sistema educacional deve', 'as escolas de ensino médio têm o papel de'],
            'a família deve': ['os pais e responsáveis legais precisam', 'o núcleo familiar de apoio deve', 'os responsáveis diretos têm o papel de', 'a estrutura familiar deve']
        },
        'repertoire': {
            'estudos apontam': ['pesquisas publicadas pela USP apontam', 'dados levantados pelo IBGE demonstram', 'indicadores da OMS revelam', 'levantamentos estatísticos oficiais revelam'],
            'pesquisas indicam': ['levantamentos do Datafolha sugerem', 'artigos científicos nacionais revelam', 'dados empíricos do Ministério da Saúde mostram', 'estudos acadêmicos da área evidenciam'],
            'especialistas afirmam': ['pesquisadores da área destacam', 'sociólogos brasileiros apontam', 'pensadores contemporâneos explicam', 'analistas do setor defendem']
        },
        'ai-pattern': {
            'deve se conscientizar': ['precisa atuar ativamente na modificação de', 'deve adotar postura reflexiva quanto a', 'precisa rever suas ações cotidianas frente a', 'deve se engajar na resolução de'],
            'deve ter consciência': ['deve adotar posturas éticas e proativas', 'precisa ponderar os efeitos coletivos de', 'deve mobilizar esforços voltados a', 'precisa fiscalizar com rigidez os impactos de'],
            'parcerias entre governo e sociedade': ['ações conjuntas das prefeituras com ONGs locais', 'cooperação integrada entre esferas ministeriais e sociedade', 'trabalho mútuo de cooperativas locais e cidadãos']
        }
    };

    const database = map[type] || {};

    // 1. Busca direta exata
    if (database[lowerWord]) {
        return database[lowerWord];
    }

    // 2. Busca de concordância aproximada
    for (const [key, replacementList] of Object.entries(database)) {
        if (lowerWord.includes(key) || key.includes(lowerWord)) {
            return replacementList;
        }
    }

    // Fallbacks inteligentes de alto nível para evitar desencaixe
    const fallbacks = {
        'linguistic': ['termo mais preciso', 'expressão autoral', 'conceito bem delineado'],
        'structure': ['introdução orgânica', 'ponto de vista argumentado', 'parágrafo autônomo'],
        'argument': ['medida executável clara', 'agente específico de mudança', 'proposta viável detalhada'],
        'repertoire': ['dado oficial governamental', 'fato histórico reconhecido', 'exemplo social recente'],
        'ai-pattern': ['traço pessoal de escrita', 'análise ativa e crítica', 'perspectiva com opinião própria']
    };

    return fallbacks[type] || ['ideia autoral', 'termo detalhado'];
}

// Substituição direta no editor visual e bloqueio do grifo (Substituição Única)
function replaceWord(element, oldWord, newWord) {
    // 1. Altera o texto visualmente
    element.textContent = newWord;
    
    // 2. Transforma o nó em texto estático de sucesso (destrói o grifo de forma limpa)
    element.className = 'replaced-flash';
    element.removeAttribute('title');
    element.style.cursor = 'default';
    
    // Desativa o evento de clique limpando o elemento correspondente do índice ativo
    const idx = parseInt(element.dataset.idx);
    if (currentHighlights[idx]) {
        currentHighlights[idx] = null;
    }

    // 3. Atualiza o textarea em segundo plano para que as correções persistam na reanálise
    const finalNewText = highlightedText.innerText;
    inputText.value = finalNewText;
    charCount.textContent = finalNewText.length;
}

// ============================================
// GERAÇÃO DE SINAIS E RECOMENDAÇÕES (DIREITO)
// ============================================

function generateAISignals(percentage, text) {
    const signals = [];
    if (percentage >= 75) {
        signals.push({
            label: 'Taxa Altíssima de Previsibilidade',
            detail: 'O texto é extremamente regular em termos sintáticos, sem as oscilações típicas da escrita humana espontânea.'
        });
        signals.push({
            label: 'Presença Intensa de Clichês de IA',
            detail: 'Uso repetido de "a sociedade contemporânea", "parcerias entre governo e sociedade" e "em suma".'
        });
    } else if (percentage >= 50) {
        signals.push({
            label: 'Propostas de Intervenção Mecânicas',
            detail: 'Apresentação de agentes e formas genéricas de ação sem contextualização empírica detalhada.'
        });
        signals.push({
            label: 'Parágrafos Modelados',
            detail: 'O texto utiliza exatamente o mesmo molde e tamanho de blocos para expressar todos os argumentos.'
        });
    } else if (percentage >= 25) {
        signals.push({
            label: 'Escrita Excessivamente Uniforme',
            detail: 'Períodos com proporções muito regulares de palavras, sinalizando alto uso de corretor ortográfico pesado.'
        });
    }
    return signals;
}

function generateImprovements(percentage, text) {
    const improvements = [];
    if (percentage >= 40) {
        improvements.push({
            label: 'Seja Específico e dê Nomes Próprios',
            detail: 'Evite o jargão abstrato. Em vez de escrever "o governo deve", use "o Ministério da Educação" ou "o Ministério da Saúde".'
        });
        improvements.push({
            label: 'Varie o Ritmo das Sentenças',
            detail: 'Quebre a escrita: misture períodos deliberadamente mais curtos de uma linha com parágrafos mais longos de explicação.'
        });
        improvements.push({
            label: 'Aporte Vivência Local Própria',
            detail: 'Fale de problemas reais da sua escola, cidade, bairro ou observações cotidianas ao invés de ideias vagas e genéricas.'
        });
    } else {
        improvements.push({
            label: 'Mantenha esse nível excelente!',
            detail: 'Sua redação apresenta um tom autoral forte, com boa presença de marcas humanas personalizadas.'
        });
    }
    return improvements;
}

// ============================================
// RENDERIZAÇÃO COMPLETA DOS RESULTADOS
// ============================================

function renderResult(data = {}, originalText = '') {
    const percentage = Math.max(0, Math.min(100, Math.round(data.percentage || 0)));
    const suspiciousPhrases = data.suspicious_phrases || [];
    const characteristics = data.characteristics || [];

    // === GAUGE ===
    updateGauge(percentage);

    // === VEREDITO ===
    updateVerdict(percentage);

    // === PROCESSA E RENDERIZA OS GRIFOS INTERATIVOS ===
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

    // === GUIA DE MELHORIA ===
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
                    <span class="characteristic-trait">${c.trait || 'Análise de Ritmo'}</span>
                    <span class="characteristic-evidence">${c.evidence || 'Verificado com sucesso.'}</span>
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
        vtext = '✅ Alta Autoria e Originalidade Humana';
        verdictEl.classList.add('verdict-human');
    } else if (percentage <= 30) {
        vtext = '✔️ Baixíssimo risco de automação por IA';
        verdictEl.classList.add('verdict-low');
    } else if (percentage <= 60) {
        vtext = '⚠️ Indícios de polimento ou IA parcial';
        verdictEl.classList.add('verdict-medium');
    } else {
        vtext = '🚨 Padrões artificiais de escrita detectados';
        verdictEl.classList.add('verdict-high');
    }
    verdictEl.textContent = vtext;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('✅ Motor ZeroIA inicializado com pleno sucesso!');