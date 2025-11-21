import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc,
  setDoc,
  doc,
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Scissors, 
  Sparkles, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Store
} from 'lucide-react';

const AgendamentoCliente = () => {
  // Estados principais
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [userId, setUserId] = useState(null);
  const [barbearias, setBarbearias] = useState([]);
  
  // Estados de seleção
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  
  // Estados de dados
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [perfilBarbearia, setPerfilBarbearia] = useState(null);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Inicialização - buscar userId do localStorage ou URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('barbearia');
    const storedUserId = localStorage.getItem('barbeariaId');
    
    if (urlUserId) {
      setUserId(urlUserId);
      localStorage.setItem('barbeariaId', urlUserId);
      carregarDadosBarbearia(urlUserId);
    } else if (storedUserId) {
      setUserId(storedUserId);
      carregarDadosBarbearia(storedUserId);
    } else {
      // Carregar lista de barbearias disponíveis
      carregarBarbearias();
      setEtapaAtual(0);
    }
  }, []);

  // Carregar lista de barbearias
  const carregarBarbearias = async () => {
    setLoading(true);
    try {
      const usuariosSnap = await getDocs(collection(db, 'usuarios'));
      const usuariosData = usuariosSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBarbearias(usuariosData);
      console.log('✅ Barbearias carregadas:', usuariosData.length);
    } catch (error) {
      console.error('❌ Erro ao carregar barbearias:', error);
      setErro('Erro ao carregar lista de barbearias');
    } finally {
      setLoading(false);
    }
  };

  // Selecionar barbearia
  const selecionarBarbearia = (barbeariaId) => {
    setUserId(barbeariaId);
    localStorage.setItem('barbeariaId', barbeariaId);
    carregarDadosBarbearia(barbeariaId);
  };

  // Carregar agendamentos quando a data é selecionada
  useEffect(() => {
    if (dataSelecionada && userId) {
      carregarAgendamentos(dataSelecionada);
    }
  }, [dataSelecionada, userId]);

  // Carregar dados da barbearia
  const carregarDadosBarbearia = async (uid) => {
    setLoading(true);
    console.log('🔍 Carregando dados da barbearia:', uid);
    try {
      // Carregar perfil da subcoleção (leitura pública permitida)
      try {
        const perfilSnap = await getDocs(collection(db, `usuarios/${uid}/perfil`));
        if (!perfilSnap.empty) {
          const perfilData = perfilSnap.docs[0].data();
          setPerfilBarbearia(perfilData);
          console.log('✅ Perfil carregado:', perfilData);
        } else {
          // Se não há perfil, usar dados padrão
          setPerfilBarbearia({ nome: 'Agendamento Online', telefone: '' });
          console.log('⚠️ Perfil não encontrado, usando dados padrão');
        }
      } catch (err) {
        console.log('⚠️ Erro ao carregar perfil:', err.message);
        setPerfilBarbearia({ nome: 'Agendamento Online', telefone: '' });
      }
      
      // Carregar serviços da coleção raiz filtrando por userId
      let servicosData = [];
      try {
        const servicosRaizRef = collection(db, 'servicos');
        const qServicos = query(servicosRaizRef, where('userId', '==', uid));
        const servicosRaizSnap = await getDocs(qServicos);
        servicosData = servicosRaizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('✅ Serviços carregados (coleção raiz):', servicosData.length, 'serviços', servicosData);
      } catch (errServicos) {
        console.log('⚠️ Erro ao carregar serviços da coleção raiz:', errServicos.message);
        // Tenta subcoleção como fallback
        try {
          const servicosSubSnap = await getDocs(collection(db, `usuarios/${uid}/servicos`));
          servicosData = servicosSubSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('✅ Serviços carregados (subcoleção):', servicosData.length, 'serviços');
        } catch (errSub) {
          console.log('⚠️ Também não encontrou na subcoleção:', errSub.message);
        }
      }
      setServicos(servicosData);
      
      // Carregar barbeiros da coleção raiz filtrando por userId
      let barbeirosData = [];
      try {
        const barbeirosRaizRef = collection(db, 'barbeiros');
        const qBarbeiros = query(barbeirosRaizRef, where('userId', '==', uid));
        const barbeirosRaizSnap = await getDocs(qBarbeiros);
        barbeirosData = barbeirosRaizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('✅ Barbeiros carregados (coleção raiz):', barbeirosData.length, 'barbeiros', barbeirosData);
      } catch (errBarbeiros) {
        console.log('⚠️ Erro ao carregar barbeiros da coleção raiz:', errBarbeiros.message);
        // Tenta subcoleção como fallback
        try {
          const barbeirosSubSnap = await getDocs(collection(db, `usuarios/${uid}/barbeiros`));
          barbeirosData = barbeirosSubSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('✅ Barbeiros carregados (subcoleção):', barbeirosData.length, 'barbeiros');
        } catch (errSub) {
          console.log('⚠️ Também não encontrou na subcoleção:', errSub.message);
        }
      }
      setBarbeiros(barbeirosData);
      
      // Se houver userId, pular para Step 1
      if (uid) {
        setEtapaAtual(1);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setErro('Erro ao carregar dados da barbearia: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar agendamentos para verificar disponibilidade
  const carregarAgendamentos = async (data) => {
    if (!userId || !data) return;
    
    try {
      // Tenta carregar agendamentos, mas se falhar (permissão negada), não é problema
      // Clientes não precisam ver agendamentos existentes, apenas criar novos
      const agendamentosRef = collection(db, `usuarios/${userId}/agendamentos`);
      const q = query(agendamentosRef, where('data', '==', data));
      const snapshot = await getDocs(q);
      const agendamentosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAgendamentos(agendamentosData);
      console.log('✅ Agendamentos carregados:', agendamentosData.length);
    } catch (error) {
      console.log('⚠️ Não foi possível carregar agendamentos (permissão negada - normal para clientes)');
      setAgendamentos([]); // Define array vazio se não conseguir ler
    }
  };

  // Gerar próximos 7 dias
  const gerarProximosDias = () => {
    const dias = [];
    const hoje = new Date();
    
    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      
      let label;
      if (i === 0) label = 'Hoje';
      else if (i === 1) label = 'Amanhã';
      else label = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      dias.push({
        data: data.toISOString().split('T')[0], // YYYY-MM-DD
        label,
        diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'short' })
      });
    }
    
    return dias;
  };

  // Gerar horários disponíveis
  const gerarHorarios = () => {
    const horarios = [];
    for (let hora = 9; hora <= 19; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 19 && minuto > 0) break; // Parar em 19:00
        const horaStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        horarios.push(horaStr);
      }
    }
    return horarios;
  };

  // Verificar se horário está disponível
  const horarioDisponivel = (hora) => {
    if (!dataSelecionada || !barbeiroSelecionado) return true;
    
    // Se não conseguiu carregar agendamentos (array vazio), assume todos disponíveis
    if (agendamentos.length === 0) return true;
    
    // Se for "qualquer profissional", verificar todos os barbeiros
    if (barbeiroSelecionado.id === 'qualquer') {
      // Verificar se há pelo menos um barbeiro disponível
      const todosOcupados = barbeiros.every(barbeiro => {
        return agendamentos.some(ag => 
          ag.hora === hora && ag.barbeiroId === barbeiro.id
        );
      });
      return !todosOcupados;
    }
    
    // Verificar barbeiro específico
    return !agendamentos.some(ag => 
      ag.hora === hora && ag.barbeiroId === barbeiroSelecionado.id
    );
  };

  // Formatar telefone
  const formatarTelefone = (valor) => {
    const numero = valor.replace(/\D/g, '');
    if (numero.length <= 10) {
      return numero.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numero.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  // Validar se pode avançar
  const podeAvancar = () => {
    switch (etapaAtual) {
      case 0: return userId !== null;
      case 1: return servicoSelecionado !== null;
      case 2: return barbeiroSelecionado !== null;
      case 3: return dataSelecionada !== null && horarioSelecionado !== null;
      case 4: return clienteNome.trim() !== '' && clienteTelefone.replace(/\D/g, '').length >= 10;
      default: return false;
    }
  };

  // Avançar etapa
  const avancar = () => {
    if (podeAvancar()) {
      if (etapaAtual === 3) {
        // Ao sair do Step 3, carregar agendamentos
        carregarAgendamentos(dataSelecionada);
      }
      setEtapaAtual(etapaAtual + 1);
    }
  };

  // Voltar etapa
  const voltar = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  // Confirmar agendamento
  const confirmarAgendamento = async () => {
    setLoading(true);
    setErro(null);
    
    try {
      // Criar documento de agendamento com ID personalizado
      const agendamentosRef = collection(db, `usuarios/${userId}/agendamentos`);
      
      // Gerar ID personalizado: BARBEARIA_AGENDAMENTOS_NOMECLIENTE_DATA_HORA
      const nomeBarbeariaNormalizado = (perfilBarbearia?.nome || 'BARBEARIA')
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^A-Z0-9]/g, '_') // Substitui não-alfanuméricos por _
        .replace(/_+/g, '_'); // Remove múltiplos underscores consecutivos
      
      const nomeClienteNormalizado = clienteNome.trim()
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .substring(0, 30); // Limita o tamanho
      
      const dataFormatada = dataSelecionada.replace(/-/g, '_');
      const horaFormatada = horarioSelecionado.replace(/:/g, '_');
      const timestamp = Date.now();
      
      const docId = `${nomeBarbeariaNormalizado}_AGENDAMENTOS_${nomeClienteNormalizado}_${dataFormatada}_${horaFormatada}_${timestamp}`;
      
      const novoAgendamento = {
        barbeiroId: barbeiroSelecionado.id === 'qualquer' ? 'qualquer' : barbeiroSelecionado.id,
        barbeiroNome: barbeiroSelecionado.nome || 'Qualquer Profissional',
        servico: servicoSelecionado.nome,
        preco: servicoSelecionado.preco || 0,
        clienteNome: clienteNome.trim(),
        clienteTelefone: clienteTelefone.replace(/\D/g, ''),
        data: dataSelecionada,
        hora: horarioSelecionado,
        status: 'pendente',
        criadoEm: serverTimestamp(),
        atualizado: serverTimestamp()
      };
      
      console.log('📝 Criando agendamento com ID:', docId);
      console.log('📝 Dados:', novoAgendamento);
      
      // Usar setDoc com ID customizado ao invés de addDoc
      await setDoc(doc(db, `usuarios/${userId}/agendamentos`, docId), novoAgendamento);
      
      console.log('✅ Agendamento criado com sucesso!');
      
      // Avançar para tela de sucesso
      setEtapaAtual(5);
    } catch (error) {
      console.error('❌ Erro ao confirmar agendamento:', error);
      setErro('Erro ao confirmar agendamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reiniciar processo
  const novoAgendamento = () => {
    setServicoSelecionado(null);
    setBarbeiroSelecionado(null);
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setClienteNome('');
    setClienteTelefone('');
    setEtapaAtual(1);
  };

  // Obter iniciais para avatar
  const obterIniciais = (nome) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Cores para avatares
  const coresAvatar = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];

  // STEP 0: Seleção de Barbearia
  const renderStep0 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <Store className="w-16 h-16 text-gray-800 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecione a Barbearia</h2>
        <p className="text-gray-600">Escolha a barbearia para fazer seu agendamento</p>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando barbearias...</p>
        </div>
      ) : barbearias.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <Store className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Nenhuma barbearia disponível</h3>
            <p className="text-amber-800 text-sm">
              Não há barbearias cadastradas no momento.<br/>
              Tente novamente mais tarde.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {barbearias.map((barbearia, index) => (
            <button
              key={barbearia.id}
              onClick={() => selecionarBarbearia(barbearia.id)}
              className="p-6 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-800 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${coresAvatar[index % coresAvatar.length]} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
                  {barbearia.nome ? obterIniciais(barbearia.nome) : <Store className="w-8 h-8" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-gray-900 truncate">
                    {barbearia.nome || barbearia.id}
                  </h3>
                  {barbearia.email && (
                    <p className="text-sm text-gray-600 truncate">{barbearia.email}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      Disponível
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-800 transition-colors flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
      
      {erro && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <p className="text-rose-800 text-sm">{erro}</p>
        </div>
      )}
    </div>
  );

  // STEP 1: Seleção de Serviço
  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Escolha o Serviço</h2>
        <p className="text-gray-600">Selecione o serviço desejado</p>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando serviços...</p>
        </div>
      ) : servicos.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <Scissors className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Nenhum serviço disponível</h3>
            <p className="text-amber-800 text-sm">
              Esta barbearia ainda não cadastrou serviços.<br/>
              Entre em contato ou tente novamente mais tarde.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicos.map((servico, index) => (
            <button
              key={servico.id}
              onClick={() => setServicoSelecionado(servico)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                servicoSelecionado?.id === servico.id
                  ? 'border-gray-800 bg-gray-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  index % 2 === 0 ? 'bg-blue-100' : 'bg-emerald-100'
                }`}>
                  {index % 2 === 0 ? (
                    <Scissors className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{servico.nome}</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    R$ {servico.preco.toFixed(2)}
                  </p>
                  {servico.duracao && (
                    <p className="text-sm text-gray-600 mt-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {servico.duracao} min
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // STEP 2: Seleção de Profissional
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Escolha o Profissional</h2>
        <p className="text-gray-600">Selecione seu barbeiro preferido</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opção: Qualquer Profissional */}
        <button
          onClick={() => setBarbeiroSelecionado({ id: 'qualquer', nome: 'Qualquer Profissional' })}
          className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
            barbeiroSelecionado?.id === 'qualquer'
              ? 'border-gray-800 bg-gray-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Qualquer Profissional</h3>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                Disponibilidade maior
              </span>
            </div>
          </div>
        </button>
        
        {/* Barbeiros cadastrados */}
        {barbeiros.map((barbeiro, index) => (
          <button
            key={barbeiro.id}
            onClick={() => setBarbeiroSelecionado(barbeiro)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
              barbeiroSelecionado?.id === barbeiro.id
                ? 'border-gray-800 bg-gray-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-full ${coresAvatar[index % coresAvatar.length]} flex items-center justify-center text-white font-bold text-lg`}>
                {obterIniciais(barbeiro.nome)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{barbeiro.nome}</h3>
                {barbeiro.especialidade && (
                  <p className="text-sm text-gray-600">{barbeiro.especialidade}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // STEP 3: Data e Horário
  const renderStep3 = () => {
    const proximosDias = gerarProximosDias();
    const horarios = gerarHorarios();
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Data e Horário</h2>
          <p className="text-gray-600">Escolha quando deseja ser atendido</p>
        </div>
        
        {/* Seletor de Data */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="w-4 h-4 inline mr-2" />
            Selecione a Data
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {proximosDias.map((dia) => (
              <button
                key={dia.data}
                onClick={() => {
                  setDataSelecionada(dia.data);
                  setHorarioSelecionado(null); // Reset horário
                }}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all duration-200 min-w-[100px] ${
                  dataSelecionada === dia.data
                    ? 'border-gray-800 bg-gray-800 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                }`}
              >
                <div className="text-xs font-semibold mb-1">{dia.diaSemana}</div>
                <div className="text-sm font-bold">{dia.label}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Seletor de Horário */}
        {dataSelecionada && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Clock className="w-4 h-4 inline mr-2" />
              Selecione o Horário
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {horarios.map((hora) => {
                const disponivel = horarioDisponivel(hora);
                return (
                  <button
                    key={hora}
                    onClick={() => disponivel && setHorarioSelecionado(hora)}
                    disabled={!disponivel}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all duration-200 ${
                      horarioSelecionado === hora
                        ? 'border-gray-800 bg-gray-800 text-white shadow-md'
                        : disponivel
                        ? 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                        : 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // STEP 4: Identificação
  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Seus Dados</h2>
        <p className="text-gray-600">Confirme suas informações</p>
      </div>
      
      {/* Formulário */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            value={clienteNome}
            onChange={(e) => setClienteNome(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            value={clienteTelefone}
            onChange={(e) => setClienteTelefone(formatarTelefone(e.target.value))}
            placeholder="(00) 00000-0000"
            maxLength="15"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
      
      {/* Resumo do Agendamento */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-3">Resumo do Agendamento</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Serviço:</span>
            <span className="font-semibold">{servicoSelecionado?.nome}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Profissional:</span>
            <span className="font-semibold">{barbeiroSelecionado?.nome}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Data:</span>
            <span className="font-semibold">
              {new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Horário:</span>
            <span className="font-semibold">{horarioSelecionado}</span>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-700">
            <span className="text-lg font-bold">Valor:</span>
            <span className="text-2xl font-bold text-emerald-400">
              R$ {servicoSelecionado?.preco.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      {erro && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <p className="text-rose-800 text-sm">{erro}</p>
        </div>
      )}
    </div>
  );

  // STEP 5: Sucesso
  const renderStep5 = () => (
    <div className="space-y-6 animate-fade-in text-center py-8">
      <div className="flex justify-center">
        <CheckCircle className="w-20 h-20 text-emerald-500 animate-bounce" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Agendamento Confirmado!</h2>
        <p className="text-gray-600">Você receberá uma confirmação no WhatsApp</p>
      </div>
      
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="space-y-2 text-left">
          <p className="text-sm text-gray-700">
            <strong>Serviço:</strong> {servicoSelecionado?.nome}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Profissional:</strong> {barbeiroSelecionado?.nome}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Data:</strong> {new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR')} às {horarioSelecionado}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Cliente:</strong> {clienteNome}
          </p>
        </div>
      </div>
      
      <button
        onClick={novoAgendamento}
        className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Fazer Novo Agendamento
      </button>
    </div>
  );

  // Renderizar etapa atual
  const renderEtapaAtual = () => {
    switch (etapaAtual) {
      case 0: return renderStep0();
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {userId && etapaAtual > 0 && (
              <button
                onClick={() => {
                  localStorage.removeItem('barbeariaId');
                  setUserId(null);
                  setEtapaAtual(0);
                  carregarBarbearias();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                title="Trocar de barbearia"
              >
                <Store className="w-5 h-5" />
                <span>Trocar</span>
              </button>
            )}
            <h1 className="text-2xl font-bold flex-1 text-center">
              {perfilBarbearia?.nome || 'Agendamento Online'}
            </h1>
            <div className="w-24"></div>
          </div>
          {perfilBarbearia?.telefone && (
            <p className="text-center text-gray-300 text-sm mt-1">
              {perfilBarbearia.telefone}
            </p>
          )}
        </div>
      </header>
      
      {/* Progress Bar */}
      {etapaAtual > 0 && etapaAtual < 5 && (
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <span>Passo {etapaAtual} de 4</span>
            <span>{Math.round((etapaAtual / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-800 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(etapaAtual / 4) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {renderEtapaAtual()}
        </div>
        
        {/* Navigation Buttons */}
        {etapaAtual > 0 && etapaAtual < 5 && (
          <div className="flex gap-4 mt-6">
            {etapaAtual > 1 && (
              <button
                onClick={voltar}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Voltar
              </button>
            )}
            
            {etapaAtual < 4 ? (
              <button
                onClick={avancar}
                disabled={!podeAvancar()}
                className={`flex-1 font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  podeAvancar()
                    ? 'bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continuar
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={confirmarAgendamento}
                disabled={!podeAvancar() || loading}
                className={`flex-1 font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  podeAvancar() && !loading
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirmar Agendamento
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>© 2025 - Sistema de Agendamento Online</p>
      </footer>
    </div>
  );
};

export default AgendamentoCliente;
