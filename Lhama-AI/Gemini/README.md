# 🤖 API Gemini para Lhama AI 1

Esta pasta contém toda a integração com a API do Gemini.

## 📁 Arquivos

| Arquivo | Função |
|---------|--------|
| **config.js** | Configurações da API (modelo, timeout, etc) |
| **api-init.js** | Inicialização e carregamento da chave |
| **training-search.js** | Busca no training.json (match exato) |
| **gemini-api.js** | Handler das requisições à API |
| **SETUP_VERCEL.md** | Guia completo de configuração |

## ⚡ Como Funciona?

```
Pergunta do usuário
    ↓
Busca no training.json (EXATO)
    ↓
[Encontrou?] → SIM → Resposta imediata ⚡
    ↓ NÃO
Chama API Gemini 🤖
    ↓
Resposta criativa
    ↓
Exibe ao usuário ✨
```

## 🚀 Quick Start

1. **Leia** [SETUP_VERCEL.md](SETUP_VERCEL.md) - Guia passo a passo
2. **Obtenha** sua chave em https://aistudio.google.com
3. **Configure** no Vercel (Environment Variables)
4. **Teste** fazendo uma pergunta que não está no training.json

## 🎯 Modelos Disponíveis

Alterar em `config.js`:
- `gemini-2.5-flash` ⭐ Rápido e econômico
- `gemini-2.0-flash` Bom custo-benefício
- `gemini-1.5-pro` Mais poderoso, mais lento

## 💾 Variável de Ambiente

Nome: `GEMINI_API_KEY`
Valor: Sua chave da API do Google

## 🔒 Segurança

- ✅ A chave é protegida no Vercel
- ✅ Nunca exponha a chave no código
- ✅ Regenere se vazar acidentalmente

## 📞 Suporte

Veja [SETUP_VERCEL.md](SETUP_VERCEL.md) para solução de problemas.

---

**Desenvolvido para Lhama AI 1** 💖
