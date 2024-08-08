import React from 'react';
import Styles from './TelaPrincipal.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

function TelaPrincipal() {
  const navigate = useNavigate();

  const handleProdutos = () => {
    navigate('/produtos');
  };

  return (
    <div className={Styles.TelaPrincipalContainer}>
      <Header />
      <div className={Styles.mainContent}>
        <h1>Bem Vindo</h1>
      </div>
      <div className={Styles.buttonContainer}>
        <button type="button" className={Styles.BackButton} onClick={handleProdutos}>Produtos</button>
      </div>
    </div>
  );
}

export default TelaPrincipal;
