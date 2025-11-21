# 📱 Guia de Uso - App de Agendamento Cliente

## 🎯 Acesso ao Aplicativo

O aplicativo está rodando em: **http://localhost:3000**

## 🔑 Configuração Inicial

### Opção 1: Via URL (Recomendado)
Acesse o app com o ID da barbearia na URL:
```
http://localhost:3000?barbearia=SEU_USER_ID
```

Substitua `SEU_USER_ID` pelo ID do usuário do painel administrativo.

### Opção 2: Via LocalStorage
O app armazena automaticamente o ID da barbearia após o primeiro acesso.

## 📊 Estrutura do Fluxo

### Passo 1: Seleção de Serviço
- Visualize todos os serviços disponíveis
- Cada card mostra: Nome, Preço e Duração
- Clique no serviço desejado para selecioná-lo

### Passo 2: Escolha do Profissional
- Selecione um barbeiro específico
- Ou escolha "Qualquer Profissional" para maior disponibilidade
- Cada barbeiro mostra nome e especialidade (se cadastrada)

### Passo 3: Data e Horário
- **Data**: Selecione um dos próximos 7 dias (horizontal scroll)
- **Horário**: Escolha um horário disponível no grid
- Horários ocupados aparecem desabilitados (cinza)
- Sistema verifica conflitos em tempo real

### Passo 4: Seus Dados
- Preencha seu nome completo
- Informe seu WhatsApp (formatação automática)
- Revise o resumo do agendamento no card escuro
- Clique em "Confirmar Agendamento"

### Passo 5: Confirmação
- Tela de sucesso com todos os detalhes
- Mensagem: "Você receberá uma confirmação no WhatsApp"
- Botão para fazer novo agendamento

## 🎨 Design Responsivo

### Mobile (Padrão)
- Cards em coluna única
- Botões grandes e touch-friendly (mínimo 44px)
- Grid de horários otimizado para toque
- Scroll horizontal para seleção de datas

### Desktop/Tablet
- Grid de 2-3 colunas
- Wizard centralizado (max-width: 600px)
- Melhor aproveitamento do espaço

## ✅ Validações Implementadas

1. **Conflitos de Horário**: Sistema verifica automaticamente
2. **Campos Obrigatórios**: Botão "Continuar" desabilitado até preencher
3. **Telefone**: Mínimo 10 dígitos, formatação automática
4. **Disponibilidade**: Horários ocupados não podem ser selecionados

## 🔄 Navegação

- **Voltar**: Retorna ao passo anterior (disponível a partir do Passo 2)
- **Continuar**: Avança para próximo passo (habilitado após seleção)
- **Barra de Progresso**: Mostra progresso visual (Passo X de 4)

## 🎯 Funcionalidades Especiais

### "Qualquer Profissional"
- Aumenta disponibilidade de horários
- Sistema distribui automaticamente
- Salva como `barbeiroId: null` no Firebase

### Verificação de Disponibilidade
- Consulta em tempo real ao Firebase
- Considera todos os agendamentos do dia
- Para "Qualquer Profissional": verifica todos os barbeiros

### Formatação Automática
- Telefone: (XX) XXXXX-XXXX
- Data: DD/MM/YYYY
- Horário: HH:mm
- Preço: R$ XX,XX

## 📱 Dados Salvos no Firebase

Cada agendamento cria um documento em:
```
usuarios/{userId}/agendamentos/{agendamentoId}
```

Com os campos:
- `barbeiroId`: ID do barbeiro (ou null)
- `barbeiroNome`: Nome do profissional
- `servico`: Nome do serviço
- `preco`: Valor do serviço
- `clienteNome`: Nome do cliente
- `clienteTelefone`: Telefone sem formatação
- `data`: Formato YYYY-MM-DD
- `hora`: Formato HH:mm
- `status`: "pendente" (padrão)
- `criadoEm`: Timestamp de criação
- `atualizado`: Timestamp de atualização

## 🐛 Troubleshooting

### Erro: "Barbearia não configurada"
- Certifique-se de passar o `?barbearia=USER_ID` na URL
- Ou configure manualmente no localStorage:
  ```javascript
  localStorage.setItem('barbeariaId', 'SEU_USER_ID');
  ```

### Erro: "Erro ao carregar dados"
- Verifique a conexão com Firebase
- Confirme que o userId existe no Firestore
- Verifique as regras de segurança do Firestore

### Nenhum serviço/barbeiro aparece
- Cadastre serviços no painel administrativo
- Cadastre barbeiros no painel administrativo
- Caminho no Firestore: `usuarios/{userId}/servicos` e `usuarios/{userId}/barbeiros`

### Todos os horários aparecem ocupados
- Verifique os agendamentos existentes no Firebase
- Considere usar "Qualquer Profissional"
- Tente outra data

## 🔧 Personalização

### Alterar horários disponíveis
Edite a função `gerarHorarios()` em `AgendamentoCliente.jsx`:
```javascript
for (let hora = 9; hora <= 19; hora++) { // Altere aqui
  for (let minuto = 0; minuto < 60; minuto += 30) { // Intervalo de 30min
```

### Alterar quantidade de dias exibidos
Edite a função `gerarProximosDias()`:
```javascript
for (let i = 0; i < 7; i++) { // Altere o número 7
```

### Personalizar cores
Todas as cores seguem o padrão Tailwind CSS e podem ser alteradas nas classes do componente.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre integração, consulte o README.md principal ou entre em contato com o desenvolvedor do sistema.

---

**Status**: ✅ Sistema pronto para uso
**Versão**: 1.0.0
**Última atualização**: 20/11/2025
