# 🚀 Guia de Deploy - Firebase Hosting

## ✅ Pré-requisitos
- Node.js instalado
- Conta Firebase (já configurada: `painel-de-controle-barbearia`)

## 📦 Passo a Passo

### 1️⃣ **Instalar Firebase CLI**
```powershell
npm install -g firebase-tools
```

### 2️⃣ **Fazer Login no Firebase**
```powershell
firebase login
```
- Abrirá o navegador para autenticação
- Faça login com a conta do projeto

### 3️⃣ **Build do Projeto**
```powershell
npm run build
```
- Cria a pasta `dist` com arquivos otimizados

### 4️⃣ **Deploy**
```powershell
firebase deploy --only hosting
```

### 5️⃣ **Pronto! 🎉**
- URL de produção: `https://painel-de-controle-barbearia.web.app`
- URL alternativa: `https://painel-de-controle-barbearia.firebaseapp.com`

---

## 🔄 Deploy Automático (GitHub Actions)

Se você usar GitHub, o deploy será automático a cada push na branch `main`:

1. **Criar repositório no GitHub**
2. **Adicionar secret no GitHub:**
   - Settings → Secrets → New repository secret
   - Nome: `FIREBASE_SERVICE_ACCOUNT`
   - Valor: Execute `firebase login:ci` e cole o token

3. **Push para main:**
```powershell
git add .
git commit -m "Deploy inicial"
git push origin main
```

---

## 🌐 URLs do Projeto

**App de Clientes (este projeto):**
- 🔗 https://painel-de-controle-barbearia.web.app

**Painel Administrativo:**
- 🔗 Seu painel atual (se hospedar, use outro projeto Firebase)

**Firebase Console:**
- 🔗 https://console.firebase.google.com/project/painel-de-controle-barbearia

---

## 📱 Testar PWA

Após o deploy:

**Android (Chrome):**
1. Acesse a URL de produção
2. Menu (⋮) → "Instalar app" ou "Adicionar à tela inicial"

**iOS (Safari):**
1. Acesse a URL de produção
2. Botão Compartilhar → "Adicionar à Tela de Início"

---

## 🔧 Comandos Úteis

```powershell
# Ver preview local antes do deploy
firebase serve

# Deploy apenas hosting
firebase deploy --only hosting

# Ver histórico de deploys
firebase hosting:channel:list

# Rollback para versão anterior
firebase hosting:rollback
```

---

## ⚠️ Importante

- ✅ Mesma conta Firebase = mesmo Firestore
- ✅ Regras de segurança já configuradas
- ✅ PWA configurado
- ✅ SSL/HTTPS automático
- ✅ CDN global (rápido em todo mundo)

---

## 🎯 Próximos Passos

1. **Domínio Personalizado** (opcional):
   - Firebase Console → Hosting → "Adicionar domínio personalizado"
   - Ex: `agendamento.suabarbearia.com.br`

2. **Analytics** (opcional):
   ```powershell
   firebase init analytics
   ```

3. **Performance Monitoring** (opcional):
   - Ativar no Firebase Console
