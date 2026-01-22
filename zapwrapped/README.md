# ZapWrapped - Seu Ano em WhatsApp 🎉

Um aplicativo web profissional e estilizado que analisa seus chats do WhatsApp de forma 100% privada, gerando um "Wrapped" interativo estilo Spotify com Stories dinâmicas e animações impressionantes!

## 🎯 Funcionalidades

### Core Features
✅ **Análise 100% Client-Side** - Seus dados nunca saem do seu computador  
✅ **Parser Inteligente** - Suporta múltiplos formatos de WhatsApp (.txt e .zip)  
✅ **Stories Dinâmicas** - Apresentação estilo Instagram com auto-play  
✅ **Animações Suaves** - Transições, contadores fluidos, emojis flutuantes  
✅ **Design WhatsApp** - Cores verde (#25D366), roxo e azul elétrico  
✅ **Responsivo** - Funciona em desktop e mobile  

### Dados Extraídos
- 📊 **Números Totais**: Mensagens, palavras, caracteres
- 👥 **Participantes**: Ranking por mensagens enviadas (Top 3)
- 🕐 **Análise Temporal**: 
  - Padrão de sono (Coruja Noturna vs Madrugador)
  - Dia da semana mais ativo
  - Mês mais movimentado
  - Heatmap de atividade 24h
- 😂 **Emojis**: Top 5 emojis mais utilizados
- 🗣️ **Dinâmica de Conversa**:
  - Quem inicia conversas
  - Quem deixa mais "read receipts" (Ghosters)
- 📸 **Mídia**: Contagem de imagens, vídeos, áudios, documentos
- 🎯 **Curiosidades**: Dias seguidos, primeira mensagem, timeline completa

## 🚀 Como Usar

### 1. Exportar Chat do WhatsApp

**No WhatsApp Desktop:**
1. Clique em ⋮ (menu) no topo
2. Selecione "Mais" → "Exportar Chat"
3. Escolha a opção **"Sem mídia"** para arquivo menor
4. Salve o arquivo `.txt`

**Ou no Android/iPhone:**
1. Abra o chat desejado
2. Clique em ⋮ → "Mais" → "Exportar Chat"
3. Selecione "Sem mídia"
4. Envie para seu PC

### 2. Abrir o ZapWrapped

1. Abra `index.html` em seu navegador
2. Clique na zona de drop ou no botão "Selecionar arquivo"
3. Escolha o arquivo `.txt` ou `.zip` do WhatsApp

### 3. Explorar Seu Wrapped

- Use **setas direcionais** (←→) para navegar entre slides
- Ou clique nas **barras de progresso** no topo para ir direto
- **Auto-play** de 5 segundos por slide
- Pressione **ESC** para voltar à página inicial

### 4. Baixar/Compartilhar

- **📸 Screenshot**: Salva a página resumida como PNG
- **🎬 Vídeo**: Exporta a animação completa como arquivo

## 📁 Estrutura de Arquivos

```
zapwrapped/
├── index.html              # Página principal
├── styles.css              # Estilos (Dark Mode, animações)
├── app.js                  # Lógica principal da app
├── modules/
│   ├── parser.js          # Parser de chat WhatsApp
│   ├── analyzer.js        # Análise de dados estatísticos
│   ├── renderer.js        # Geração de slides
│   ├── animations.js      # Sistema de animações
│   └── export.js          # Exportação (screenshot/vídeo)
└── README.md              # Este arquivo
```

## 🎨 Design & Cores

| Elemento | Cor | Código |
|----------|-----|--------|
| Verde WhatsApp | #25D366 | Primária |
| Roxo Royal | #8B5CF6 | Secundária |
| Azul Elétrico | #00D9FF | Destaque |
| Fundo Escuro | #0f1419 | Base |

## 🔧 Tecnologias Usadas

- **HTML5** - Estrutura
- **CSS3** - Estilos e animações
- **Vanilla JavaScript** - Lógica
- **JSZip** - Suporte a arquivos .zip
- **html2canvas** - Exportação de screenshots

## 📊 Exemplo de Dados Extraídos

```javascript
{
  totalMessages: 2456,
  totalWords: 12340,
  totalCharacters: 45820,
  participants: [
    { name: "João", messageCount: 987 },
    { name: "Maria", messageCount: 756 },
    { name: "Pedro", messageCount: 713 }
  ],
  topEmojis: [
    { emoji: "😂", count: 234 },
    { emoji: "❤️", count: 198 },
    { emoji: "🔥", count: 167 }
  ],
  sleepPattern: {
    nightOwl: 45,
    earlyBird: 12,
    preference: "Coruja Noturna 🦉"
  }
}
```

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `→` | Próximo slide |
| `←` | Slide anterior |
| `ESC` | Voltar ao início |

## 🎬 Formatos de Chat Suportados

### WhatsApp Desktop/Web
```
[DD/MM/YYYY, HH:MM:SS] Pessoa: Olá!
```

### WhatsApp Android (Exportar Chat)
```
01/01/2024, 10:30:45 - João: Olá!
```

### Formatos ISO
```
[2024-01-01, 10:30:45] João: Olá!
```

## 🔐 Privacidade

✅ **100% Client-Side Processing**
- Nenhum arquivo é enviado para servidores
- Análise acontece completamente no seu navegador
- Dados são descartados quando você fecha a página
- Nenhum rastreamento ou cookies

## 🐛 Troubleshooting

### "Nenhuma mensagem encontrada"
- Verifique se o arquivo é o export correto do WhatsApp
- Tente exportar novamente sem mídia

### Arquivo não abre
- Use .txt para chats individuais
- Use .zip para múltiplos chats
- Verifique a codificação do arquivo (UTF-8)

### Animações lentas
- Feche abas/programas para liberar RAM
- Atualize o navegador
- Use Chrome/Edge para melhor performance

## 🎯 Roadmap Futuro

- [ ] Suporte a análise de grupos
- [ ] Exportação de vídeo MP4 real
- [ ] Gráficos interativos Chart.js
- [ ] Análise de sentimento
- [ ] Comparação entre múltiplos chats
- [ ] Tema claro/escuro
- [ ] Modo offline completo

## 📝 Licença

Criado com ❤️ para a comunidade. Use livremente!

## 🤝 Contribuindo

Encontrou um bug? Tem uma sugestão? Sinta-se livre para melhorar!

---

**Desenvolvido com 🚀 e muita determinação**

Enjoy your ZapWrapped! 🎉
