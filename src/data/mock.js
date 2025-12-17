/**
 * ===================================================
 * LEAD DATA
 * ===================================================
 */
export const mockLeads = [
  { 
    id: 101, 
    name: 'João Silva (Tech)', 
    phone: '5511987654321',
    email: 'joao.silva@tech.com.br',
    status: 'New', 
    source: 'Website',
  },
  { 
    id: 102, 
    name: 'Maria Costa (Fintech)', 
    phone: '5521991234567',
    email: 'maria.costa@fintech.com.br',
    status: 'Proposal', 
    source: 'LinkedIn',
  },
  { 
    id: 103, 
    name: 'Cliente XPTO (Follow-up)', 
    phone: '5531988887777',
    email: 'cliente.xpto@negocio.com',
    status: 'FollowUp', 
    source: 'Referência',
  },
  { 
    id: 104, 
    name: 'Empresa Alfa (Convertido)', 
    phone: '',
    email: 'contato@alfa.com',
    status: 'Converted', 
    source: 'Cold Call',
  },
];


/**
 * ===================================================
 * TASK DATA
 * ===================================================
 */
export const mockTasks = [
  { 
    id: 201, 
    title: 'Ligar para João Silva', 
    dueDate: '2025-12-16', 
    status: 'Pending', 
    leadId: 101, 
    leadName: 'João Silva (Tech)',
  },
  { 
    id: 202, 
    title: 'Enviar proposta para Maria Costa', 
    dueDate: '2025-12-17',
    status: 'Pending', 
    leadId: 102, 
    leadName: 'Maria Costa (Fintech)',
  },
  { 
    id: 204, 
    title: 'E-mail de boas-vindas para Empresa Alfa', 
    dueDate: '2025-12-10', 
    status: 'Completed', 
    leadId: 104, 
    leadName: 'Empresa Alfa',
  },
  { 
    id: 205, 
    title: 'Follow-up do Cliente XPTO', 
    dueDate: '2025-12-20',
    status: 'Pending', 
    leadId: 103, 
    leadName: 'Cliente XPTO (Follow-up)',
  },
];
