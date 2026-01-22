# 🎯 Guia de Uso - ZapWrapped

## Começando

### Pré-requisitos
- Um navegador moderno (Chrome, Firefox, Safari, Edge)
- Um arquivo de chat exportado do WhatsApp
- Nenhuma instalação necessária (100% funciona localmente!)

## 📱 Como Exportar seu Chat do WhatsApp

### No **WhatsApp Desktop/Web**:
1. Abra o chat desejado
2. Clique no menu ⋮ (três pontos) no topo
3. Selecione **"Mais"** → **"Exportar Chat"**
4. Escolha **"Sem mídia"** (arquivo menor e mais rápido)
5. Salve o arquivo `.txt` em um local acessível

### No **Android**:
1. Abra o chat no WhatsApp
2. Toque no menu ⋮ → **"Mais"** → **"Exportar Chat"**
3. Selecione **"Sem mídia"**
4. Envie para seu PC via email ou nuvem

### No **iPhone**:
1. Abra o chat
2. Toque em mais opções (ℹ️)
3. Escolha **"Exportar Chat"**
4. Selecione **"Sem mídia"**
5. Compartilhe para seu PC

## 🚀 Usando o ZapWrapped

### 1. Abrir o App
- Localize o arquivo `index.html`
- Abra com seu navegador (clique duplo)
- Você verá a página inicial com o logo ZapWrapped

### 2. Carregar seu Chat
**Opção A - Arrastar e Soltar:**
- Pegue seu arquivo `.txt` do WhatsApp
- Arraste para a zona de drop
- Solte e aguarde a análise

**Opção B - Selecionar Arquivo:**
- Clique no botão "Selecionar arquivo"
- Navegue e escolha seu `.txt`
- Aguarde a análise

### 3. Explorar seu Wrapped
Uma vez carregado, você verá:

**Barra de Progresso** - No topo, mostra qual slide você está
- Clique em qualquer barra para ir direto para aquele slide

**Slides** - 18 slides dinâmicos com:
- Números e estatísticas
- Gráficos visuais
- Ranking de participantes
- Dados divertidos

**Auto-play** - Muda de slide a cada 5 segundos
- Pause clicando em qualquer slide
- Use setas para navegação manual

### 4. Atalhos de Teclado
```
Seta Direita (→)  - Próximo slide
Seta Esquerda (←) - Slide anterior
ESC                - Voltar ao início
Click na barra     - Ir para slide específico
```

### 5. Compartilhar seu Wrapped

**Opção 1: Screenshot (Recomendado)**
- Clique em "📸 Compartilhar Screenshot"
- Salva como PNG em alta qualidade
- Perfeito para compartilhar no Instagram/WhatsApp

**Opção 2: Vídeo (Experimental)**
- Clique em "🎬 Baixar Vídeo"
- Gera animação WebM com seus dados
- Ideal para stories ou posts

## 📊 Os 18 Slides Explicados

| # | Slide | O que Mostra |
|---|-------|-------------|
| 1 | Abertura | Bem-vindo ao seu Wrapped |
| 2 | Os Números | Total de mensagens, palavras, caracteres |
| 3 | Campeão do Papo | Top 3 pessoas que mais falam |
| 4 | Padrão de Sono | Coruja Noturna vs Madrugador |
| 5 | Dia Mais Ativo | Qual dia da semana mais você conversa |
| 6 | Top 4 Emojis | Seus emojis favoritos |
| 7 | Quem Puxa o Assunto | Quem inicia conversas |
| 8 | Mídia Compartilhada | Imagens, vídeos, áudios, documentos |
| 9 | Mês Mais Movimentado | Qual mês teve mais atividade |
| 10 | Palavras-Chave | Suas palavras mais usadas |
| 11 | Os Ghosters | Quem some mais (maiores gaps) |
| 12 | Mensagem Épica | A mensagem mais longa |
| 13 | Dias Quentes | Top 5 dias com mais atividade |
| 14 | Heatmap de Horas | Atividade por hora do dia |
| 15 | Estatísticas do Campeão | Números do participante mais ativo |
| 16 | Curiosidades | Dados extras (dias seguidos, etc) |
| 17 | Timeline | Primeira mensagem, período total |
| 18 | Final | Fechamento e opções de compartilhar |

## 🎨 Personalizações

### Mudar Cores
Edite o arquivo `styles.css`:
```css
:root {
    --whatsapp-green: #25D366;
    --royal-purple: #8B5CF6;
    --electric-blue: #00D9FF;
    --dark-bg: #0f1419;
}
```

### Ajustar Duração do Auto-play
Em `app.js`, procure por `startAutoPlay()`:
```javascript
this.autoPlayInterval = setInterval(() => {
    this.nextSlide();
}, 5000); // Mude 5000 para outro valor em ms
```

## ⚙️ Formatos de Chat Suportados

### WhatsApp Desktop
```
[DD/MM/YYYY, HH:MM:SS] Pessoa: Olá!
```

### WhatsApp Mobile (Android/iPhone)
```
01/01/2024, 10:30:45 - João: Olá!
```

### Formato ISO
```
[2024-01-01, 10:30:45] João: Olá!
```

## 🔐 Segurança & Privacidade

✅ **100% Local**: Seus dados não deixam seu PC
✅ **Sem Servidor**: Nenhuma conexão com internet necessária
✅ **Sem Armazenamento**: Tudo é descartado ao fechar
✅ **Código Aberto**: Você pode ver exatamente o que fazemos

## 🐛 Problemas Comuns

### "Nenhuma mensagem encontrada"
**Solução:**
- Verifique se é o export correto do WhatsApp
- Tente exportar novamente
- Certifique-se que é um arquivo `.txt`

### "Arquivo não é reconhecido"
**Solução:**
- Abra o arquivo em um editor de texto
- Verifique se tem formato: `[Data, Hora] Nome: Mensagem`
- Se não, corrija manualmente as primeiras linhas

### "Animações muito lentas"
**Solução:**
- Feche outras abas/programas
- Limpe cache do navegador (Ctrl+Shift+Del)
- Tente com Chrome (melhor performance)

### "Não consigo exportar vídeo"
**Solução:**
- Seu navegador pode não suportar MediaRecorder
- Use Chrome ou Firefox
- Ou use a opção de Screenshot em vez de vídeo

## 💡 Dicas Profissionais

1. **Para Grupos**: Exporte o chat do grupo completo
2. **Para Casais**: Seu Wrapped a dois pode ser bem legal!
3. **Análise Longa**: Chats com muitas mensagens podem levar mais tempo
4. **Compartilhar**: O screenshot fica MUITO bom no Instagram
5. **Qualidade**: Deixe em tela cheia (F11) antes de fazer screenshot

## 📞 Suporte

Encontrou um bug? Tente:
1. Recarregar a página (F5)
2. Limpar cache (Ctrl+Shift+Del)
3. Tentar com outro navegador
4. Verificar o arquivo de chat

## 🎁 Extras

### Arquivo de Teste
Use `exemplo_chat.txt` para testar sem seus dados pessoais!

### Código-Fonte
Todos os arquivos JS estão organizados em `modules/`:
- `parser.js` - Extração de dados
- `analyzer.js` - Análise estatística
- `renderer.js` - Geração de slides
- `animations.js` - Sistema de animações
- `export.js` - Exportação

---

**Divirta-se descobrindo seus segredos do WhatsApp! 🎉**

Desenvolvido com ❤️ para você.
