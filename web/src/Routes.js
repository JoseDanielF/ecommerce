import React, { useState } from 'react';
import { BrowserRouter, Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import dadosUserLogadoService from './Services/DadosUserLogado/DadosUserLogado-service';

// Pages
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import TelaPrincipal from './Pages/TelaPrincipal/TelaPrincipal';
import UserProfile from './Pages/PerfilUsuario/PerfilUsuario';
import Produtos from './Pages/Produtos/Produtos';
import Carrinho from './Pages/Carrinho/Carrinho';
import Pedidos from './Pages/Pedidos/Pedidos';
import Produto from './Pages/Produto/Produto';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = dadosUserLogadoService.getUserInfo() !== null;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const PublicRoute = ({ element }) => {
  const isAuthenticated = dadosUserLogadoService.getUserInfo() !== null;
  return !isAuthenticated ? element : <Navigate to="/telaPrincipal" replace />;
};

const Routes = () => {
  const [itens, setItems] = useState([]);

  const adicionarCarrinho = (produto, quantidade, pais) => {
    const existingItem = itens.find(item => item.id === produto.id && item.pais === pais);
    if (existingItem) {
      setItems(
        itens.map(item =>
          item.id === produto.id && item.pais === pais
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      );
    } else {
      setItems([...itens, { ...produto, quantidade, pais }]);
    }
  };

  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />

        <Route path="/telaPrincipal" element={<PrivateRoute element={<TelaPrincipal />} />} />
        <Route path="/perfil" element={<PrivateRoute element={<UserProfile />} />} />
        <Route path="/produtos" element={<PrivateRoute element={<Produtos />} />} />
        <Route path="/produto/:id/:pais" element={<Produto adicionarCarrinho={adicionarCarrinho} />} />
        <Route path="/carrinho" element={<Carrinho itens={itens} />} />
        <Route path="/pedidos" element={<PrivateRoute element={<Pedidos />} />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
