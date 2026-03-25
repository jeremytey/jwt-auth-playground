import './App.css'
import api from './api';
import useAuthStore from './store/authStore';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleLogin = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken } = response.data;
    useAuthStore.getState().setAccessToken(accessToken);
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    useAuthStore.getState().logout();
  };


  return(
   <div>JWT Auth Playground
   {accessToken ? <Dashboard onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}


  </div>
  );

}

export default App