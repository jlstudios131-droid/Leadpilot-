import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="
      min-h-screen 
      bg-muted-50 
      flex flex-col 
      items-center 
      justify-center 
      p-4 sm:p-6
    ">
      
      {/* Logo/Header */}
      <header className="
        w-full max-w-sm 
        mb-6 sm:mb-8 
        text-center 
        sm:fixed sm:top-8
      ">
        <Link to="/login">
            <span className="
              text-3xl font-black 
              text-primary-600 
              tracking-tighter
            ">
              LeadPilot
            </span>
        </Link>
      </header>
      
      {/* Área de Conteúdo */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>

      {/* Footer Simples */}
      <footer className="mt-8 text-xs text-muted-400">
        &copy; {new Date().getFullYear()} LeadPilot. Todos os direitos reservados.
      </footer>
    </div>
  );
        }
