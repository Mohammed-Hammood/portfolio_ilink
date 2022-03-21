import {Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import NotFound from './components/not-found';
import Panel from './components/panel';
import './styling/main.scss';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/panel' element={ <Panel /> } />
        <Route path='*' element={ <NotFound /> } />
      </Routes>
    </>
  );
}

export default App;
