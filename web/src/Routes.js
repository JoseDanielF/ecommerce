import React from 'react';
import { BrowserRouter, Route, Routes as RouterRoutes, Navigate  } from 'react-router-dom';
import dadosUserLogadoService from './Services/DadosUserLogado/DadosUserLogado-service';
//Pages
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import TelaPrincipal from './Pages/TelaPrincipal/TelaPrincipal';
import UserProfile from './Pages/PerfilUsuario/PerfilUsuario';
import Produtos from './Pages/Produtos/Produtos';

const PrivateRoute = ({ element, ...rest }) => {
    const isAuthenticated = dadosUserLogadoService.getUserInfo() !== null;
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const PublicRoute = ({ element, ...rest }) => {
    const isAuthenticated = dadosUserLogadoService.getUserInfo() !== null;
    return !isAuthenticated ? element : <Navigate to="/telaPrincipal" replace />;
};


const Routes = () => (
    <BrowserRouter>
      <RouterRoutes>
        
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<PublicRoute element={<Login />} />} />
        <Route path='/register' element={<PublicRoute element={<Register />} />} />
        
        <Route path='/telaPrincipal' element={<PrivateRoute element={<TelaPrincipal />} />} />
        <Route path='/perfil' element={<PrivateRoute element={<UserProfile />} />} />
        <Route path='/produtos' element={<PrivateRoute element={<Produtos />} />} />
      </RouterRoutes>
    </BrowserRouter>
);

export default Routes;