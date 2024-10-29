import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Usuario from '../Pages/Usuario'
import Campo from '../Pages/Campo'
import Login from "../Pages/Login";
import Cliente from "../Pages/Cliente";
import Home from "../Pages/Home";
import Navbar from "../Components/Navbar";
import Logout from "../Pages/Logout";
import DetallePasciente from "../Pages/DetallePasciente";
import Pasciente from "../Pages/Pasciente";

function Router () {
    return (

        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" exact element={<Login/>} />
                <Route path="/Home" exact element={<Home/>} />
                <Route path="/DetallePasciente" exact element={<DetallePasciente/>} />
                <Route path="/Pasciente" exact element={<Pasciente/>} />
                <Route path="/Usuario" exact element={<Usuario/>} />
                <Route path="/Cliente" exact element={<Cliente/>} />
                <Route path="/Campo" exact element={<Campo/>} />
                <Route path="/Logout" exact element={<Logout/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;