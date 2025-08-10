
import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import MyRoutes from './component/route/routes';
import { useSearchParams } from 'react-router-dom';

function App() {
  // const [searchParams] = useSearchParams();

  // useEffect(() => {
  //   const demoEmail = searchParams.get('demoemail');
  //   const demoPassword = searchParams.get('password');

  //   if (demoEmail && demoPassword) {
  //     sessionStorage.setItem('demoEmail', demoEmail);
  //     sessionStorage.setItem('demoPassword', demoPassword);
  //   }
  // }, []); 


  return (
    <Router>
      <MyRoutes/>
    </Router>
  );
}

export default App;
