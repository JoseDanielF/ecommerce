import React from 'react';
import Styles from './TelaPrincipal.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaClipboardList, FaShoppingCart } from 'react-icons/fa';

function TelaPrincipal(quantidadeCarrinho) {
  console.log(quantidadeCarrinho)
  const navigate = useNavigate();

  const handleProdutos = () => {
    navigate('/produtos');
  };

  const handlePedidos = () => {
    navigate('/pedidos');
  };

  const handleCarrinho = () => {
    navigate('/carrinho');
  };

  return (
    <>
      <Header quantidadeCarrinho={quantidadeCarrinho} />
      <div className={Styles.TelaPrincipalContainer}>
        <div className={Styles.mainContent}>
          <h1>Bem-vindo!</h1>
        </div>
        <div className={Styles.buttonContainer}>
          <button type="button" className={Styles.BackButton} onClick={handleProdutos}>
            <FaBoxOpen className={Styles.icon} /> Produtos
          </button>
          <button type="button" className={Styles.BackButton} onClick={handlePedidos}>
            <FaClipboardList className={Styles.icon} /> Pedidos
          </button>
          <button type="button" className={Styles.BackButton} onClick={handleCarrinho}>
            <FaShoppingCart className={Styles.icon} /> Carrinho
          </button>
        </div>
      </div>
    </>
  );
}

export default TelaPrincipal;