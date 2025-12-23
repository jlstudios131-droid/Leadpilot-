import { createContext, useContext, useState } from 'react';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark'); // dark por defeito para LTD High Level

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AppContext.Provider value={{ 
      isSidebarOpen, 
      setIsSidebarOpen, 
      toggleSidebar,
      theme,
      setTheme 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
