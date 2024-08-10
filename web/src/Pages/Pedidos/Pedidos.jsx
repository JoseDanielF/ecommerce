import React, { useState } from 'react';
import Styles from './Pedidos.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { Paper, CircularProgress } from '@material-ui/core';

function Pedidos() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);

  const handleVoltar = () => {
    navigate('/telaPrincipal');
  };

  return (
    <>
      <Header />
      <div className={Styles.TelaPrincipalContainer}>
        <div className={Styles.mainContent}>
          <h1>Pedidos</h1>
        </div>

        <Paper className={Styles.paper}>
          {/* {carregando ? (
          <div className={Styles.loading}>
            <CircularProgress />
            <p>Carregando...</p>
          </div>
        ) : (
          <>
           Opa
          </>
        )} */}
        </Paper>
        <div className={Styles.buttonContainer}>
          <button type="button" className={Styles.BackButton} onClick={handleVoltar}>
            Voltar
          </button>
        </div>
      </div>
    </>
  );
}

export default Pedidos;