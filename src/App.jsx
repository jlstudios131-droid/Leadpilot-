import { AuthProvider } from './context/AuthContext';
import RoutesConfig from './RoutesConfig';

function App() {
  return (
    <AuthProvider>
      <RoutesConfig />
    </AuthProvider>
  );
}

export default App;
