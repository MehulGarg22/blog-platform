
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import MyRoutes from './component/route/routes';

function App() {
  return (
    <BrowserRouter>
      <MyRoutes/>
    </BrowserRouter>
  );
}

export default App;
