import Card from '@/components/ui/Card';

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-muted-900 md:text-3xl">Configurações</h1>
      <p className="text-muted-500">Gerencie seu perfil, conta e preferências do LeadPilot.</p>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-3">Informações de Perfil</h2>
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 input-placeholder-style">Nome: Usuário Mock</div>
                <div className="flex-1 input-placeholder-style">Email: usuario@leadpilot.com</div>
            </div>
            <button className="btn-secondary">Atualizar Perfil</button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-3">Segurança da Conta</h2>
        <p className="text-muted-500 mb-4">Altere sua senha de acesso.</p>
        <button className="btn-secondary">Alterar Senha</button>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-3 text-danger-600">Encerrar Conta</h2>
        <p className="text-muted-500 mb-4">Esta ação é irreversível.</p>
        <button className="py-2 px-4 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition">
            Excluir Conta
        </button>
      </Card>
      
    </div>
  );
}
