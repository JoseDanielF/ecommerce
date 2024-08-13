import React, { useState, useEffect } from 'react';
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
      const itemExistente = prevItems.findIndex(item => item.id === produto.id && item.pais === pais);

      if (itemExistente >= 0) {
        const atualizarItens = [...prevItems];
        const quantidadeAtualizada = Number(atualizarItens[itemExistente].quantidade) + Number(quantidade);
        atualizarItens[itemExistente].quantidade = quantidadeAtualizada;
        return atualizarItens;
      } else {
        const novoItem = { ...produto, quantidade: Number(quantidade), pais };
        return [...prevItems, novoItem];
      }
    });
  };

  const limparCarrinho = () => {
    setItems([]);
  };
  
  const calcularQuantidadeTotal = () => {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  };

  return (
    <BrowserRouter>
      <Header quantidadeCarrinho={calcularQuantidadeTotal()} />
      <RouterRoutes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />

        <Route path="/telaPrincipal" element={<PrivateRoute element={<TelaPrincipal quantidadeCarrinho={calcularQuantidadeTotal()} />} />} />
        <Route path="/perfil" element={<PrivateRoute element={<UserProfile quantidadeCarrinho={calcularQuantidadeTotal()} />} />} />
        <Route path="/produtos" element={<PrivateRoute element={<Produtos quantidadeCarrinho={calcularQuantidadeTotal()} />} />} />
        <Route path="/produto/:id/:pais" element={<Produto adicionarCarrinho={adicionarCarrinho} quantidadeCarrinho={calcularQuantidadeTotal()} />} />
        <Route path="/carrinho" element={<Carrinho itens={itens} quantidadeCarrinho={calcularQuantidadeTotal()} limparCarrinho={limparCarrinho} />} />
        <Route path="/pedidos" element={<PrivateRoute element={<Pedidos quantidadeCarrinho={calcularQuantidadeTotal()} />} />} />

      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;