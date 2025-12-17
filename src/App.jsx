import RoutesConfig from './RoutesConfig';

/**
 * Componente Raiz da Aplicação.
 * Aqui é o lugar ideal para envolver a aplicação com Provedores (Providers),
 * como Contexto de Autenticação, Temas ou Bibliotecas de Notificação (Toast).
 */
function App() {
  return (
    <>
      {/* No futuro, adicionaremos aqui o <AuthProvider> 
         para gerenciar o estado global do usuário com o Supabase.
      */}
      <RoutesConfig />
      
      {/* DICA: Se você quiser adicionar notificações (toasts), 
         o componente da biblioteca ficaria aqui também.
      */}
    </>
  );
}

export default App;
