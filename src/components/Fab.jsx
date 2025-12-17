import { Plus } from 'lucide-react';

export default function Fab() {
  const handleFabClick = () => {
    alert('Ação Rápida: Abrir modal de Nova Tarefa/Lead');
  };

  return (
    <button
      onClick={handleFabClick}
      className="
        fixed bottom-6 right-6 
        p-4 
        bg-primary-600 
        text-white 
        rounded-full 
        shadow-lg 
        hover:bg-primary-700 
        transition-colors 
        md:hidden 
        z-20
      "
      aria-label="Criar nova ação"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
