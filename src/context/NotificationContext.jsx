import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import clsx from 'clsx';

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto-remove após 4 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const notify = {
    success: (msg) => addNotification('success', msg),
    error: (msg) => addNotification('error', msg),
    info: (msg) => addNotification('info', msg),
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      
      {/* Container de Notificações */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={clsx(
                "p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 backdrop-blur-md",
                n.type === 'success' && "bg-emerald-50/90 border-emerald-100 text-emerald-800",
                n.type === 'error' && "bg-rose-50/90 border-rose-100 text-rose-800",
                n.type === 'info' && "bg-blue-50/90 border-blue-100 text-blue-800"
              )}
            >
              <div className="flex items-center gap-3">
                {n.type === 'success' && <CheckCircle2 size={18} className="text-emerald-600" />}
                {n.type === 'error' && <AlertCircle size={18} className="text-rose-600" />}
                {n.type === 'info' && <Info size={18} className="text-blue-600" />}
                <p className="text-sm font-bold tracking-tight">{n.message}</p>
              </div>
              <button onClick={() => removeNotification(n.id)} className="opacity-50 hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);
