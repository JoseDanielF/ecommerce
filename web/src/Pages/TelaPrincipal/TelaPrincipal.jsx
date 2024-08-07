import React from 'react';
import Styles from './TelaPrincipal.module.css';
import Header from '../Header/Header';

function TelaPrincipal() {

  return (
    <div className={Styles.TelaPrincipalContainer}>
      <Header />
      <div className={Styles.mainContent}>
        <h1>Bem Vindo</h1>
      </div>
    </div>
  );
}

export default TelaPrincipal;
