# App de Agendamento para Clientes - Barbearia

Sistema de agendamento online mobile-first para clientes de barbearias, integrado com Firebase Firestore.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Firebase** - Backend (Firestore Database + Authentication)
- **Lucide React** - Biblioteca de ícones

## 📋 Funcionalidades

### Fluxo de Agendamento (Wizard Step-by-Step)

1. **Seleção da Barbearia** (opcional para múltiplas barbearias)
2. **Escolha do Serviço** - Grid com cards de serviços disponíveis
3. **Seleção do Profissional** - Opção de escolher barbeiro específico ou "Qualquer Profissional"
4. **Data e Horário** - Seletor de datas (próximos 7 dias) e horários disponíveis
5. **Identificação** - Formulário com dados do cliente e resumo do agendamento
6. **Confirmação** - Tela de sucesso com detalhes do agendamento

### Recursos

✅ Design mobile-first responsivo  
✅ Validação de disponibilidade em tempo real  
✅ Prevenção de conflitos de horário  
✅ Integração multi-tenant com Firebase  
✅ Animações e transições suaves  
✅ Feedback visual em todas as ações  
✅ Formatação automática de telefone  

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🔥 Configuração Firebase

O projeto já está configurado com o Firebase. A configuração está em `src/firebase.js`.

### Estrutura de Dados (Firestore)

```
usuarios/{userId}/
  ├── servicos/{servicoId}
  │   ├── nome: string
  │   ├── preco: number
  │   └── duracao: number (opcional)
  │
  ├── barbeiros/{barbeiroId}
  │   ├── nome: string
  │   └── especialidade: string (opcional)
  │
  ├── agendamentos/{agendamentoId}
  │   ├── barbeiroId: string | null
  │   ├── barbeiroNome: string
  │   ├── servico: string
  │   ├── preco: number
  │   ├── clienteNome: string
  │   ├── clienteTelefone: string
  │   ├── data: string (YYYY-MM-DD)
  │   ├── hora: string (HH:mm)
  │   ├── status: "pendente" | "confirmado" | "cancelado"
  │   ├── criadoEm: timestamp
  │   └── atualizado: timestamp
  │
  └── perfil/{perfilId}
      ├── nome: string
      └── telefone: string
```

## 🎨 Design System

### Paleta de Cores

- **Primária**: Gray-800/900 (`bg-gray-800`, `bg-gray-900`)
- **Secundária**: Blue-600 (`bg-blue-600`)
- **Sucesso**: Emerald-500/600 (`bg-emerald-500`)
- **Alerta**: Amber-500/600 (`bg-amber-500`)
- **Erro**: Rose-500/600 (`bg-rose-500`)
- **Texto**: Gray-100/800 (`text-gray-100`, `text-gray-800`)

### Componentes

- **Botões**: `rounded-lg`, `font-bold`, `py-3 px-6`
- **Cards**: `bg-white`, `rounded-lg`, `shadow-sm`, `border border-gray-200`
- **Inputs**: `border border-gray-300`, `rounded-lg`, `focus:ring-2`
- **Badges**: `rounded-full`, `px-3 py-1`, `text-xs font-semibold`

## 🌐 Uso

### Via URL Parameter

Acesse o app passando o ID da barbearia na URL:

```
http://localhost:3000?barbearia=USER_ID_AQUI
```

### Via LocalStorage

O app automaticamente armazena o `userId` no localStorage após a primeira seleção.

## 📱 Responsividade

- **Mobile**: Cards full-width, botões grandes (min-height: 56px)
- **Tablet/Desktop**: Grid de 2-3 colunas, wizard centralizado (max-width: 600px)

## 🔒 Validações

- Verificação de conflitos de horário antes de salvar
- Validação de campos obrigatórios em cada etapa
- Formatação automática de telefone
- Prevenção de duplo agendamento
- Verificação de disponibilidade em tempo real

## 📄 Licença

Este projeto foi desenvolvido para uso em barbearias.

## 👨‍💻 Desenvolvimento

O componente principal está em `src/AgendamentoCliente.jsx` e contém toda a lógica do wizard em um único arquivo, facilitando manutenção e customização.

### Estrutura do Projeto

```
├── public/
│   └── vite.svg
├── src/
│   ├── AgendamentoCliente.jsx  # Componente principal
│   ├── firebase.js              # Configuração Firebase
│   ├── index.css                # Estilos globais
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🚀 Deploy

Para fazer deploy:

1. Execute `npm run build`
2. Faça upload da pasta `dist` para seu hosting
3. Configure as variáveis de ambiente se necessário
4. Certifique-se de que o Firebase está configurado corretamente

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do sistema administrativo.
