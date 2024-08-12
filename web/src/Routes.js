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
import Header from './Pages/Header/Header';

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
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === produto.id && item.pais === pais);

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantidade += quantidade;
        return updatedItems;
      } else {
        return [...prevItems, { ...produto, quantidade, pais }];
      }
    });
  };

  const quantidadeCarrinho = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <BrowserRouter>
      <Header quantidadeCarrinho={quantidadeCarrinho} />
      <RouterRoutes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />

        <Route path="/telaPrincipal" element={<PrivateRoute element={<TelaPrincipal quantidadeCarrinho={quantidadeCarrinho} />} />} />
        <Route path="/perfil" element={<PrivateRoute element={<UserProfile quantidadeCarrinho={quantidadeCarrinho}/>} />} />
        <Route path="/produtos" element={<PrivateRoute element={<Produtos quantidadeCarrinho={quantidadeCarrinho}/>} />} />
        <Route path="/produto/:id/:pais" element={<Produto adicionarCarrinho={adicionarCarrinho} quantidadeCarrinho={quantidadeCarrinho}/>} />
        <Route path="/carrinho" element={<Carrinho itens={itens} />} />
        <Route path="/pedidos" element={<PrivateRoute element={<Pedidos quantidadeCarrinho={quantidadeCarrinho}/>} />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;