import React from 'react';
import Styles from './TelaPrincipal.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

function TelaPrincipal() {
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
      <Header />
      <div className={Styles.TelaPrincipalContainer}>
        <div className={Styles.mainContent}>
          <h1>Bem Vindo</h1>
        </div>
        <div className={Styles.buttonContainer}>
          <button type="button" className={Styles.BackButton} onClick={handleProdutos}>
            Produtos
          </button>
          <button type="button" className={Styles.BackButton} onClick={handlePedidos}>
            Pedidos
          </button>
          <button type="button" className={Styles.BackButton} onClick={handleCarrinho}>
            Carrinho
          </button>
        </div>
      </div>
    </>
  );
}

export default TelaPrincipal;