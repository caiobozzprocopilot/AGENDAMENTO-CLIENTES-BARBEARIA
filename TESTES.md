# 🧪 Exemplos e Testes

## 📋 Dados de Teste para Firebase

Para testar o aplicativo, você precisa ter dados no Firebase Firestore. Abaixo estão exemplos de documentos para criar manualmente no console do Firebase.

## 🔥 Estrutura de Dados para Teste

### 1. Perfil da Barbearia
**Caminho**: `usuarios/{userId}/perfil/{perfilId}`

```json
{
  "nome": "Barbearia Estilo & Corte",
  "telefone": "(11) 98765-4321",
  "endereco": "Rua das Flores, 123",
  "horarioFuncionamento": "Seg-Sáb: 9h às 19h"
}
```

### 2. Serviços
**Caminho**: `usuarios/{userId}/servicos/{servicoId}`

#### Serviço 1: Corte de Cabelo
```json
{
  "nome": "Corte de Cabelo",
  "preco": 35.00,
  "duracao": 30
}
```

#### Serviço 2: Barba
```json
{
  "nome": "Barba Completa",
  "preco": 25.00,
  "duracao": 20
}
```

#### Serviço 3: Cabelo + Barba
```json
{
  "nome": "Cabelo + Barba",
  "preco": 55.00,
  "duracao": 45
}
```

#### Serviço 4: Corte Infantil
```json
{
  "nome": "Corte Infantil",
  "preco": 25.00,
  "duracao": 20
}
```

### 3. Barbeiros
**Caminho**: `usuarios/{userId}/barbeiros/{barbeiroId}`

#### Barbeiro 1: João Silva
```json
{
  "nome": "João Silva",
  "especialidade": "Cortes Clássicos",
  "telefone": "11987654321",
  "ativo": true
}
```

#### Barbeiro 2: Pedro Santos
```json
{
  "nome": "Pedro Santos",
  "especialidade": "Barbas e Degradês",
  "telefone": "11976543210",
  "ativo": true
}
```

#### Barbeiro 3: Carlos Oliveira
```json
{
  "nome": "Carlos Oliveira",
  "especialidade": "Cortes Modernos",
  "telefone": "11965432109",
  "ativo": true
}
```

### 4. Agendamento Exemplo (para teste de conflito)
**Caminho**: `usuarios/{userId}/agendamentos/{agendamentoId}`

```json
{
  "barbeiroId": "joao_silva_id",
  "barbeiroNome": "João Silva",
  "servico": "Corte de Cabelo",
  "preco": 35.00,
  "clienteNome": "Maria Souza",
  "clienteTelefone": "11999998888",
  "data": "2025-11-20",
  "hora": "14:00",
  "status": "confirmado",
  "criadoEm": "timestamp_atual",
  "atualizado": "timestamp_atual"
}
```

## 🧪 Cenários de Teste

### Teste 1: Fluxo Completo
1. Acesse: `http://localhost:3000?barbearia=SEU_USER_ID`
2. Selecione "Corte de Cabelo" (R$ 35,00)
3. Escolha "João Silva"
4. Selecione "Hoje" e horário "10:00"
5. Preencha: Nome = "Teste Cliente", Tel = "(11) 91234-5678"
6. Confirme o agendamento
7. ✅ Deve aparecer tela de sucesso

### Teste 2: Qualquer Profissional
1. Selecione um serviço
2. Escolha "Qualquer Profissional"
3. Selecione data e horário
4. Preencha dados e confirme
5. ✅ Agendamento salvo com `barbeiroId: null`

### Teste 3: Horário Ocupado
1. Crie um agendamento manual no Firebase para hoje às 14:00 com João Silva
2. No app, selecione João Silva
3. Selecione hoje
4. ✅ O horário 14:00 deve aparecer desabilitado (cinza)

### Teste 4: Validação de Campos
1. Tente avançar sem selecionar serviço
2. ✅ Botão "Continuar" deve estar desabilitado
3. Selecione serviço
4. ✅ Botão deve habilitar

### Teste 5: Formatação de Telefone
1. No campo WhatsApp, digite: 11912345678
2. ✅ Deve formatar automaticamente para: (11) 91234-5678

### Teste 6: Navegação
1. Avance até o Passo 3
2. Clique em "Voltar"
3. ✅ Deve voltar ao Passo 2 mantendo seleções anteriores

### Teste 7: Múltiplos Dias
1. No seletor de data, role horizontalmente
2. ✅ Deve mostrar próximos 7 dias
3. ✅ Primeiro dia deve ser "Hoje", segundo "Amanhã"

### Teste 8: Responsividade Mobile
1. Abra DevTools (F12)
2. Ative modo mobile (Ctrl+Shift+M)
3. ✅ Cards devem ocupar largura total
4. ✅ Botões devem ter altura mínima de 56px
5. ✅ Seletor de data deve permitir scroll horizontal

### Teste 9: Conflito em Tempo Real
1. Abra o app em duas abas
2. Na aba 1: selecione João Silva, hoje, 15:00
3. Na aba 2: selecione João Silva, hoje
4. Na aba 1: confirme o agendamento
5. Na aba 2: recarregue os horários
6. ✅ 15:00 deve aparecer ocupado

### Teste 10: Novo Agendamento
1. Complete um agendamento
2. Na tela de sucesso, clique "Fazer Novo Agendamento"
3. ✅ Deve voltar ao Passo 1 com todos os campos limpos

## 🎯 Checklist de Qualidade

- [ ] Todos os 6 passos funcionam corretamente
- [ ] Validação de disponibilidade funciona
- [ ] Formatação de telefone funciona
- [ ] Navegação (voltar/continuar) funciona
- [ ] Barra de progresso atualiza corretamente
- [ ] Tela de sucesso aparece após confirmação
- [ ] Dados são salvos corretamente no Firebase
- [ ] Design é responsivo (mobile e desktop)
- [ ] Animações funcionam suavemente
- [ ] Não há erros no console do navegador
- [ ] Loading aparece durante operações assíncronas
- [ ] Mensagens de erro são exibidas apropriadamente

## 📊 Monitoramento no Firebase

### Console Firestore
Acesse: https://console.firebase.google.com

1. Selecione seu projeto: "painel-de-controle-barbearia"
2. Vá em "Firestore Database"
3. Navegue até: `usuarios/{userId}/agendamentos`
4. ✅ Deve ver novos documentos sendo criados após confirmação

### Estrutura do Documento Criado
```
agendamentos/{autoId}
  ├── barbeiroId: "xyz123" ou null
  ├── barbeiroNome: "João Silva"
  ├── servico: "Corte de Cabelo"
  ├── preco: 35
  ├── clienteNome: "Teste Cliente"
  ├── clienteTelefone: "11912345678"
  ├── data: "2025-11-20"
  ├── hora: "10:00"
  ├── status: "pendente"
  ├── criadoEm: Timestamp
  └── atualizado: Timestamp
```

## 🔧 Debug

### Ver logs no console
```javascript
// Abra o console do navegador (F12)
// Procure por mensagens iniciadas com:
console.log() // Informações gerais
console.error() // Erros
```

### Verificar localStorage
```javascript
// No console do navegador:
localStorage.getItem('barbeariaId')
// Deve retornar o userId
```

### Limpar cache
```javascript
// No console do navegador:
localStorage.clear()
// Depois recarregue a página
```

## 📱 Teste em Dispositivos Reais

### Android/iOS
1. Certifique-se que o dispositivo está na mesma rede
2. Descubra o IP do computador: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
3. Acesse: `http://SEU_IP:3000?barbearia=USER_ID`

### Exemplo:
```
http://192.168.1.100:3000?barbearia=abc123
```

## ⚡ Performance

### Métricas Esperadas
- ⚡ First Load: < 2s
- ⚡ Navegação entre passos: < 100ms
- ⚡ Consulta Firebase: < 500ms
- ⚡ Confirmação de agendamento: < 1s

### Otimizações Implementadas
- ✅ Consulta Firebase apenas quando necessário
- ✅ Cache de dados no estado React
- ✅ Animações CSS (não JS)
- ✅ Lazy loading de imagens
- ✅ Code splitting automático (Vite)

## 🎓 Próximos Passos

1. Integrar notificações WhatsApp via API
2. Adicionar confirmação por SMS
3. Implementar cancelamento de agendamento
4. Adicionar histórico de agendamentos do cliente
5. Sistema de avaliação pós-atendimento
6. Push notifications
7. Modo offline (PWA)

---

**Happy Testing!** 🚀
