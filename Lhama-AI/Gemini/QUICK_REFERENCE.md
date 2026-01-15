# 📞 REFERÊNCIA RÁPIDA

## ⚡ Cheat Sheet - Tudo em Uma Página

### 🔑 Obter Chave (2 min)
```
1. https://aistudio.google.com
2. API keys
3. Create API key
4. Copy → Guarde seguro
```

### 🚀 Adicionar no Vercel (3 min)
```
1. https://vercel.com/dashboard
2. Seu projeto → Settings
3. Environment Variables
4. Name:  GEMINI_API_KEY
   Value: [Cole a chave]
5. Save
6. Redeploy
```

### 🧪 Testar (1 min)
```javascript
// Console (F12):
temChaveAPI()                    // true = chave OK
buscaTrainamento.estaCarregado() // true = training OK

// Ou faça pergunta nova (não no training):
// "Como é viver na Lua?"
// → Recebe resposta = ✨ Funcionando!
```

---

## 🗂️ ARQUIVOS PRINCIPAIS

| Arquivo | Função |
|---------|--------|
| `config.js` | Configurações (modelo, timeout) |
| `api-init.js` | Carrega chave |
| `training-search.js` | Busca no training.json |
| `gemini-api.js` | Chama API Gemini |

## 📚 DOCUMENTAÇÃO

| Arquivo | Leia Se |
|---------|---------|
| `00_LEIA_PRIMEIRO.md` | Quer começar AGORA |
| `COMECE_AQUI.md` | Quer resumo executivo |
| `SETUP_VERCEL.md` | Precisa guia completo |
| `CHECKLIST.md` | Quer verificar tudo |
| `SECURITY.md` | Preocupa com segurança |

---

## 🎯 FLUXO

```
Pergunta
   ↓
Training.json?
  /    \
SIM    NÃO
 │      │
 │      API Gemini
 │      │
 └──────→ Resposta
```

---

## ⚙️ CONFIGURAR

### Mudar Modelo
Edit `config.js`:
```javascript
MODEL: 'gemini-2.5-flash'  // ← aqui
```

### Ajustar Criatividade
Edit `config.js`:
```javascript
temperature: 0.7  // 0=exato, 1=criativo
```

### Limite de Tokens
Edit `config.js`:
```javascript
maxOutputTokens: 1024  // tamanho resposta
```

---

## 🔐 VARIÁVEL DE AMBIENTE

**Nome:** `GEMINI_API_KEY`
**Lugar:** Vercel → Settings → Environment Variables
**Valor:** Sua chave do Google

---

## ❌ PROBLEMAS COMUNS

| Problema | Solução |
|----------|---------|
| "Chave inválida" | Copie chave inteira, sem espaços |
| "Muitas requisições" | Aguarde minutos, tente novamente |
| "Nenhuma resposta" | Verifique internet, aguarde 30s |
| "training.json não carrega" | Verifique caminho em training-search.js |

---

## 📊 MONITORAR USO

Vá para: **https://aistudio.google.com**
- Veja requisições
- Veja custo
- Configure alertas

---

## 🆘 CHECKLIST DE TUDO

- [ ] Tenho chave API do Google
- [ ] Adicionei no Vercel
- [ ] Fiz Deploy
- [ ] Aguardei ficar verde
- [ ] Testei pergunta nova
- [ ] Recebi resposta ✨

---

## 🎓 PRÓXIMOS PASSOS

1. Você está lendo isto! ✅
2. Leia `00_LEIA_PRIMEIRO.md`
3. Siga os 3 passos do Vercel
4. Teste!
5. Pronto! 🎉

---

**Tudo que precisa saber está na pasta `/Gemini/`**
