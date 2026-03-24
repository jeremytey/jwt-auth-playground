import './App.css'
import useAuthStore from './store/authStore';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App({onLogin, onLogout}) {
  const accessToken = useAuthStore((state) => state.accessToken);









  return(
   <div>JWT Auth Playground
   {accessToken ? <Dashboard onLogout={onLogout} /> : <LoginForm onLogin={onLogin} />}


  </div>
  );

}

export default App