import React, { useState } from 'react';
import { auth } from './firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { LogIn, Mail, Lock, User as UserIcon } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  
  // Campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErro(null);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log('✅ Login Google bem-sucedido:', result.user);
      
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } catch (error) {
      console.error('❌ Erro no login Google:', error);
      setErro('Erro ao fazer login com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      let result;
      
      if (modoRegistro) {
        // Criar nova conta
        if (!nome.trim()) {
          setErro('Por favor, preencha seu nome');
          setLoading(false);
          return;
        }
        
        result = await createUserWithEmailAndPassword(auth, email, senha);
        
        // Atualizar perfil com nome
        await updateProfile(result.user, {
          displayName: nome
        });
        
        console.log('✅ Cadastro bem-sucedido:', result.user);
      } else {
        // Login
        result = await signInWithEmailAndPassword(auth, email, senha);
        console.log('✅ Login bem-sucedido:', result.user);
      }
      
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
      
      // Mensagens de erro mais amigáveis
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErro('❌ Este email já está cadastrado. Clique em "Fazer login" abaixo para entrar com sua conta.');
          break;
        case 'auth/weak-password':
          setErro('Senha muito fraca. Use pelo menos 6 caracteres.');
          break;
        case 'auth/invalid-email':
          setErro('Email inválido. Verifique o formato.');
          break;
        case 'auth/user-not-found':
          setErro('Usuário não encontrado. Clique em "Cadastre-se" abaixo para criar uma conta.');
          break;
        case 'auth/wrong-password':
          setErro('Senha incorreta. Tente novamente.');
          break;
        case 'auth/invalid-credential':
          setErro('Email ou senha incorretos. Verifique seus dados.');
          break;
        case 'auth/too-many-requests':
          setErro('Muitas tentativas falhas. Aguarde alguns minutos e tente novamente.');
          break;
        case 'auth/network-request-failed':
          setErro('Erro de conexão. Verifique sua internet.');
          break;
        default:
          setErro('Erro ao autenticar. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {modoRegistro ? 'Criar Conta' : 'Bem-vindo!'}
          </h1>
          <p className="text-gray-600">
            {modoRegistro ? 'Cadastre-se para agendar' : 'Faça login para agendar seu horário'}
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
            <p className="text-rose-800 text-sm text-center">{erro}</p>
          </div>
        )}

        {/* Formulário Email/Senha */}
        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          {modoRegistro && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  required={modoRegistro}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                minLength="6"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                onInvalid={(e) => {
                  e.preventDefault();
                  if (e.target.validity.valueMissing) {
                    e.target.setCustomValidity('Por favor, preencha este campo');
                  } else if (e.target.validity.tooShort) {
                    e.target.setCustomValidity('A senha deve ter no mínimo 6 caracteres');
                  }
                }}
                onInput={(e) => e.target.setCustomValidity('')}
              />
            </div>
            {modoRegistro && senha.length > 0 && senha.length < 6 && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>A senha deve ter no mínimo 6 caracteres</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Aguarde...</span>
              </div>
            ) : modoRegistro ? (
              'Criar Conta'
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Botão Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
              <span>Carregando...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuar com Google</span>
            </>
          )}
        </button>

        {/* Toggle Registro/Login */}
        <div className="text-center">
          <button
            onClick={() => {
              setModoRegistro(!modoRegistro);
              setErro(null);
            }}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {modoRegistro ? (
              <>Já tem uma conta? <span className="font-semibold">Fazer login</span></>
            ) : (
              <>Não tem uma conta? <span className="font-semibold">Cadastre-se</span></>
            )}
          </button>
        </div>

        {/* Informação */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
