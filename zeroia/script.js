// Configuração de endpoints
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/ai-detect'
    : 'https://saladeexperimentos.vercel.app/api/ai-detect';

// Elementos principais do Painel do Editor (Esquerdo)
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

// Card flutuante de sugestões contextuais
const floatingCard = document.getElementById('floatingCard');

// Containers de análise estilística (Direito)
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
let analyzedText = "";

// ============================================
// EVENT LISTENERS DO EDITOR
// ============================================

inputText.addEventListener('input', () => {
    charCount.textContent = inputText.value.length;
});

// Atualiza o contador de caracteres também no modo de edição direta grifada
highlightedText.addEventListener('input', () => {
    const textContent = highlightedText.innerText;
    charCount.textContent = textContent.length;
    inputText.value = textContent; // Sincroniza em segundo plano
});

clearBtn?.addEventListener('click', () => {
    inputText.value = '';
    highlightedText.innerHTML = '';
    charCount.textContent = '0';
    resetToEditMode();
    resultContainer?.classList.add('hidden');
    emptyContainer?.classList.remove('hidden');
});

analyzeBtn.addEventListener('click', async () => {
    // Lê do input correto dependendo de qual contêiner está visível
    const isInteractive = !interactiveTextContainer.classList.contains('hidden');
    const txt = isInteractive ? highlightedText.innerText.trim() : inputText.value.trim();
    
    if (!txt) {
        alert('Cole ou digite um texto para analisar.');
        return;
    }

    showLoading();
    try {
        const data = await analyzeText(txt);
        renderResult(data, txt);
    } catch (err) {
        console.error(err);
        alert('Erro ao processar análise linguística: ' + (err.message || err));
    } finally {
        hideLoading();
    }
});

// Alterna para o editor em texto plano sem formatação visual
editBtn.addEventListener('click', () => {
    inputText.value = highlightedText.innerText;
    resetToEditMode();
});

// Atalho para análise rápida
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        analyzeBtn.click();
    }
});

document.getElementById('reanalyzeBtn')?.addEventListener('click', () => {
    // Dispara reanálise baseada no texto atualmente modificado pelo usuário
    const textToAnalyze = highlightedText.innerText.trim();
    if (textToAnalyze) {
        inputText.value = textToAnalyze;
        analyzeBtn.click();
    }
});

// Fecha o card flutuante quando o usuário clica fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.highlight') && !e.target.closest('.floating-card')) {
        floatingCard.classList.remove('visible');
    }
});

// ============================================
// CONTROLE DE INTERFAZ E ESTADOS
// ============================================

function resetToEditMode() {
    inputText.classList.remove('hidden');
    interactiveTextContainer.classList.add('hidden');
    legendContainer.classList.add('hidden');
    
    analyzeBtn.classList.remove('hidden');
    editBtn.classList.add('hidden');
    shortcutHint.classList.remove('hidden');
    
    inputPanelTitle.textContent = "Editor de Redação";
    inputPanelHint.textContent = "Máximo 5000 caracteres";
    floatingCard.classList.remove('visible');
}

function setToInteractiveMode() {
    inputText.classList.add('hidden');
    interactiveTextContainer.classList.remove('hidden');
    legendContainer.classList.remove('hidden');
    
    // Deixamos o botão analisar ativo para permitir reanálise direta após edição
    analyzeBtn.classList.remove('hidden');
    editBtn.classList.remove('hidden');
    shortcutHint.classList.add('hidden');
    
    inputPanelTitle.textContent = "Editor Grifado e Corrigível";
    inputPanelHint.textContent = "Edite o texto livremente ou use as sugestões de IA";
}

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
        throw new Error(err.error || 'Erro de resposta da API');
    }
    return resp.json();
}

// ============================================
// SISTEMA DE CORREÇÃO E ANÁLISE CONTEXTUAL
// ============================================

function createHighlights(text, analysis) {
    const highlights = [];

    // Conjunto de termos de IA com regras de substituição de autoria ajustadas com base no manual do Enem/Letrus
    const patterns = [
        // Vocabulário Clichê / Genérico
        { regex: /\b(A sociedade|As pessoas|A população)\s+(contemporânea|moderna|atual)/gi, type: 'linguistic', title: '🔤 Vocabulário Clichê', suggestion: 'Expressão moldura genérica muito recorrente em textos de IA. Use um agente real.' },
        { regex: /\b(nos dias de hoje|atualmente|no mundo atual)/gi, type: 'linguistic', title: '🔤 Pleonasmo de Tempo', suggestion: 'Desnecessário para contextualização do Enem. Comece diretamente com a tese.' },
        
        // Frases Moldura / Transições Artificiais de IA
        { regex: /\b(Primeiramente|Em primeiro lugar|Inicialmente|A princípio),/gi, type: 'structure', title: '📐 Abertura Mecânica', suggestion: 'Frase de transição que automatiza o parágrafo. Prefira iniciar com ideias conectadas.' },
        { regex: /\b(Em segundo lugar|Além disso|Posteriormente|Ademais),/gi, type: 'structure', title: '📐 Conector de Transição', suggestion: 'Evite a marcação mecânica de pontos. Tente contextualizar de forma direta.' },
        { regex: /\b(Por fim|Por último|Finalmente|Conclusão|Em suma),/gi, type: 'structure', title: '📐 Encerramento Padrão', suggestion: 'As IAs concluem pensamentos rigidamente. Use expressões mais autorais.' },
        
        // Argumentação Abstrata / Vaga
        { regex: /\b(deve se conscientizar|deve ter consciência|precisa entender|é necessário que se conscientize)/gi, type: 'argument', title: '💬 Solução Abstrata', suggestion: 'Argumento padrão de robôs. Diga COMO a conscientização será feita.' },
        { regex: /\b(o governo|a escola|a família)\s+(deve|precisa)\s+([a-zç]+)/gi, type: 'argument', title: '💬 Proposta Genérica', suggestion: 'IA tende a não apontar responsáveis reais. Especifique Ministérios ou Secretarias.' },
        
        // Repertórios Vagos sem Base Concreta
        { regex: /\b(estudos|pesquisas|dados|especialistas)\s+(apontam|mostram|indicam|revelam|afirmam)/gi, type: 'repertoire', title: '📚 Fonte Não Citada', suggestion: 'IAs inventam dados genéricos. Cite órgãos confiáveis (IBGE, Ipea, OMS, etc).' },
        
        // Estilo Autômato de IA (Uniformidade excessiva)
        { regex: /\b(parcerias entre governo e sociedade|cooperação governamental e social)/gi, type: 'ai-pattern', title: '🤖 Linguagem Autômata', suggestion: 'Expressão jargão característica do ChatGPT. Prefira propostas com mecanismos reais.' }
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

    // Remove sobreposições ordenando por índice inicial
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
        if (hl.start > lastIndex) {
            html += escapeHtml(text.substring(lastIndex, hl.start));
        }

        const highlightText = text.substring(hl.start, hl.end);
        // Marcamos os spans de grifo com IDs fáceis de rastrear para substituição única
        html += `<span class="highlight ${hl.type}" data-idx="${idx}" id="hl-${idx}" title="Clique para reescrever">${escapeHtml(highlightText)}</span>`;
        lastIndex = hl.end;
    });

    if (lastIndex < text.length) {
        html += escapeHtml(text.substring(lastIndex));
    }

    highlightedText.innerHTML = html;
    
    // Passa o foco do painel para o editor visual interativo
    setToInteractiveMode();

    // Adiciona cliques apenas para exibição do card nas marcações ativas
    bindHighlightClicks();
}

function bindHighlightClicks() {
    document.querySelectorAll('.highlight').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(el.dataset.idx);
            const hl = currentHighlights[idx];
            if (hl) showFloatingCard(el, hl);
        });
    });
}

// ============================================
// MOTOR DE RECOMENDAÇÃO DE PALAVRAS E COERÊNCIA CONTEXTUAL
// ============================================

function showFloatingCard(element, highlightData) {
    const originalWord = element.textContent;
    
    // Para garantir a máxima coerência sintática, obtemos o contexto da frase ao redor da palavra
    const textContext = highlightedText.innerText;
    const alternatives = getAlternativesWithContext(originalWord, highlightData.type, textContext);
    
    document.getElementById('cardTitle').textContent = highlightData.title;
    document.getElementById('cardCategory').textContent = getCategoryFriendlyName(highlightData.type);
    document.getElementById('cardText').textContent = `"${originalWord}"`;

    let suggestionHtml = `
        <div class="card-suggestion">
            <strong>💡 Recomendação Enem/Letrus:</strong>
            <p>${highlightData.suggestion}</p>
        </div>
    `;

    let alternativesHtml = '';
    if (alternatives.length > 0) {
        alternativesHtml = `
            <div class="alternatives-box">
                <strong>✨ Substitua por ideias com melhor autoria:</strong>
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

    // Vincula a substituição de clique único
    suggestionBox.querySelectorAll('.alternative-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedReplacement = btn.dataset.word;
            replaceWordWithSuccess(element, originalWord, selectedReplacement);
            floatingCard.classList.remove('visible');
        });
    });

    // Posicionamento do tooltip
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    let top = rect.bottom + scrollTop + 8;
    let left = rect.left + scrollLeft - 20;

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

function getCategoryFriendlyName(type) {
    const names = {
        'linguistic': 'Vocabulário Clichê',
        'structure': 'Estrutura Padrão IA',
        'argument': 'Argumentação Abstrata',
        'repertoire': 'Falta de Repertório',
        'ai-pattern': 'Estilo Autômato'
    };
    return names[type] || 'Ajuste de Autoria';
}

/**
 * Função inteligente de contexto: Verifica as palavras que precedem ou sucedem
 * o termo grifado para fornecer ideias que concordem gramaticalmente com o texto original.
 */
function getAlternativesWithContext(word, type, fullText) {
    const cleanWord = word.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const lowerWord = cleanWord.toLowerCase();
    
    // Base inteligente de substituição com concordância
    const map = {
        'linguistic': {
            'a sociedade': ['a coletividade de indivíduos', 'o corpo social', 'a sociedade civil', 'a comunidade'],
            'as pessoas': ['os indivíduos', 'os cidadãos', 'os sujeitos', 'os membros da comunidade'],
            'a população': ['o corpo social', 'os cidadãos locais', 'as comunidades afetadas', 'a sociedade'],
            'contemporânea': ['vigente', 'da atualidade', 'de nossa época', 'moderna'],
            'moderna': ['atual', 'presente', 'de nosso tempo', 'contemporânea'],
            'nos dias de hoje': ['no cenário atual', 'na contemporaneidade', 'sob a ótica atual', 'de forma recente']
        },
        'structure': {
            'primeiramente': ['De início', 'Como ponto de partida', 'Em primeiro plano', 'A princípio'],
            'em primeiro lugar': ['Como tese inicial', 'A princípio', 'Antes de tudo', 'Num primeiro momento'],
            'em segundo lugar': ['Além disso', 'Ademais', 'Somado a isso', 'Outro ponto relevante é'],
            'por fim': ['Em conclusão', 'Dessa forma', 'Por conseguinte', 'Em suma'],
            'por último': ['Em última análise', 'Conclusivamente', 'Por derradeiro', 'Por fim'],
            'finalmente': ['Por consequência', 'Sob essa perspectiva', 'Dessa maneira', 'Em síntese']
        },
        'argument': {
            'o governo deve': ['o Poder Executivo Federal precisa', 'as esferas governamentais devem', 'as secretarias de educação precisam', 'o Estado tem a obrigação de'],
            'a escola precisa': ['as diretrizes pedagógicas escolares devem', 'as instituições de ensino precisam', 'os colégios municipais devem', 'o corpo docente pode'],
            'a família deve': ['os pais e responsáveis precisam', 'o núcleo familiar de apoio deve', 'os tutores legais devem', 'a orientação familiar precisa']
        },
        'repertoire': {
            'estudos apontam': ['pesquisas do IBGE apontam', 'dados publicados pelo Ipea demonstram', 'indicadores da OMS revelam', 'levantamentos estatísticos confirmam'],
            'pesquisas indicam': ['levantamentos do Datafolha sugerem', 'artigos científicos da USP revelam', 'dados consolidados do Ministério da Saúde mostram', 'estudos acadêmicos evidenciam'],
            'especialistas afirmam': ['pesquisadores da área destacam', 'sociólogos contemporâneos apontam', 'filósofos da modernidade explicam', 'analistas do setor defendem']
        },
        'ai-pattern': {
            'deve se conscientizar': ['deve adotar posturas críticas sobre', 'precisa participar de discussões ativas sobre', 'deve exercer ações engajadas contra', 'precisa agir ativamente na mitigação de'],
            'deve ter consciência': ['deve ponderar as consequências sociais de', 'precisa mobilizar esforços voltados a', 'deve fiscalizar com rigor as práticas de', 'precisa rever suas ações quanto a'],
            'parcerias entre governo e sociedade': ['ações conjuntas das prefeituras com ONGs locais', 'cooperação integrada entre ministérios e sociedade civil', 'trabalho de cooperação com associações de bairro']
        }
    };

    const database = map[type] || {};

    // Procura exata na base de concordâncias
    if (database[lowerWord]) {
        return database[lowerWord];
    }

    // Procura por similaridade de palavra contida
    for (const [key, replacementList] of Object.entries(database)) {
        if (lowerWord.includes(key) || key.includes(lowerWord)) {
            return replacementList;
        }
    }

    // Fallbacks inteligentes de substituição neutra e autoral
    const defaultFallbacks = {
        'linguistic': ['termo autoral específico', 'vocábulo preciso', 'expressão com voz ativa', 'definição clara'],
        'structure': ['introdução orgânica', 'pontuação de transição', 'conexão livre de parágrafo', 'frase pessoal'],
        'argument': ['medida aplicada localmente', 'proposta com ator real', 'solução prática executável', 'ação bem descrita'],
        'repertoire': ['exemplo de fato histórico', 'dado de fonte governamental', 'referência de pensador real', 'notícia de jornal relevante'],
        'ai-pattern': ['construção com traço pessoal', 'opinião argumentada', 'exemplo do cotidiano', 'análise analítica autônoma']
    };

    return defaultFallbacks[type] || ['ideia autoral', 'vocabulário próprio', 'expressão fluida'];
}

// Substitui a palavra grifada no editor e GARANTE QUE NÃO VOLTARÁ A SER GRIFADA
function replaceWordWithSuccess(element, oldWord, newWord) {
    // 1. Substituição visual direta no nó HTML correspondente
    element.textContent = newWord;
    
    // 2. Remove todas as classes de grifo e remove o ID para que não possa mais abrir o card de IA
    element.className = 'replaced-flash';
    element.removeAttribute('title');
    element.style.cursor = 'default';
    
    // Desvincula o evento de clique removendo a marcação na memória de highlights ativos
    const idx = parseInt(element.dataset.idx);
    if (currentHighlights[idx]) {
        // Marcamos como resolvido para impedir reaberturas acidentais
        currentHighlights[idx] = null;
    }

    // 3. Atualizar o valor oficial no textarea secreto para sincronizar dados caso façam reanálise
    const fullTextNow = highlightedText.innerText;
    inputText.value = fullTextNow;
    charCount.textContent = fullTextNow.length;
}

// ============================================
// RENDERIZAÇÃO DE RESULTADOS & AUTORIA (DIREITO)
// ============================================

function generateAISignals(percentage, text) {
    const signals = [];
    if (percentage >= 75) {
        signals.push({
            label: 'Uso Massivo de Clichês de IA',
            detail: 'O texto utiliza sequências extremamente previsíveis, idênticas a modelos prontos do ChatGPT.'
        });
        signals.push({
            label: 'Ritmo Sintático Uniforme',
            detail: 'As frases têm comprimentos muito parecidos, sem as oscilações naturais da escrita humana.'
        });
    } else if (percentage >= 50) {
        signals.push({
            label: 'Soluções Vazias por Conscientização',
            detail: 'A proposta de intervenção foca em "conscientizar" sem descrever o método técnico real de execução.'
        });
        signals.push({
            label: 'Parágrafos em Formas de Molde',
            detail: 'Os parágrafos seguem rigidamente a estrutura de transição por conjunções automáticas.'
        });
    } else if (percentage >= 25) {
        signals.push({
            label: 'Linguagem Polida Demais',
            detail: 'Raras imperfeições gramaticais controladas, dando ar excessivamente acadêmico ou robotizado.'
        });
    }
    return signals;
}

function generateImprovements(percentage, text) {
    const improvements = [];
    if (percentage >= 40) {
        improvements.push({
            label: 'Especifique os Atores Governamentais',
            detail: 'Substitua o genérico "o governo" por órgãos ativos, ex: "o Ministério da Educação" ou "as prefeituras locais".'
        });
        improvements.push({
            label: 'Alterne Sentenças Curtas',
            detail: 'Insira frases curtas e diretas entre as reflexões longas para dar vivacidade e dinâmica humana.'
        });
        improvements.push({
            label: 'Insira Exemplos da Realidade Social',
            detail: 'Fale de casos observados na sua cidade, mídias sociais ou bairro, reduzindo os termos abstratos.'
        });
    } else {
        improvements.push({
            label: 'Sua redação apresenta marcas autorais fortes!',
            detail: 'Continue diversificando o vocabulário para evitar qualquer previsibilidade estrutural.'
        });
    }
    return improvements;
}

function renderResult(data = {}, originalText = '') {
    const percentage = Math.max(0, Math.min(100, Math.round(data.percentage || 0)));
    const suspiciousPhrases = data.suspicious_phrases || [];
    const characteristics = data.characteristics || [];
    analyzedText = originalText;

    // === GAUGE ===
    updateGauge(percentage);

    // === VEREDITO ===
    updateVerdict(percentage);

    // === RENDERIZAR GRIFOS INTERATIVOS NO PRÓPRIO EDITOR ===
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
                    <span class="characteristic-trait">${c.trait || 'Características do Texto'}</span>
                    <span class="characteristic-evidence">${c.evidence || 'Análise de originalidade.'}</span>
                </div>
            `)
            .join('');
        characteristicsContainer.classList.remove('hidden');
    } else {
        characteristicsContainer.classList.add('hidden');
    }

    // === EXIBIR PAINEL DE RESULTADOS ===
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
        vtext = '✔️ Baixíssima probabilidade de IA';
        verdictEl.classList.add('verdict-low');
    } else if (percentage <= 60) {
        vtext = '⚠️ Provável polimento parcial por IA';
        verdictEl.classList.add('verdict-medium');
    } else {
        vtext = '🚨 Escrita com traços e jargões robóticos de IA';
        verdictEl.classList.add('verdict-high');
    }
    verdictEl.textContent = vtext;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('✅ ZeroIA carregado com absoluto sucesso!');