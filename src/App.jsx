
import './App.css'

import React,{lazy,Suspense} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';

const Usuario =lazy(()=>import('./Pages/Usuario'));
const Login =lazy(()=>import('./Pages/Login'));
const Home =lazy(()=>import('./Pages/Home'));
const Cliente =lazy(()=>import('./Pages/Cliente'));

function App() {
  return (
    <Suspense fallback={<p>Cargando</p>}>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' exact element={<Login/>} />
          <Route path='/Home' exact element={<Home/>} />
          <Route path='/Usuario' exact element={<Usuario/>} />
          <Route path='/Cliente' exact element={<Cliente/>} />
        </Routes>
      </BrowserRouter>
   </Suspense>
  )
}

export default App
