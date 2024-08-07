import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./RecuperarSenha.module.css";
import logo from "../../Assets/logo.png";
import RecuperarSenhaService from '../../Services/RecuperarSenha/RecuperarSenha-service';

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const preencherDados = (e) => {
    const { value } = e.target;
    setEmail(value);

    if (!validarEmail(value)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  };

  const enviarSolicitacao = async (e) => {
    e.preventDefault();
    if (emailError) {
      alert(emailError);
      return;
    }
    
    const dados = {
      email: email
    }

    try {
      const response = await RecuperarSenhaService.sendEmailReset(JSON.stringify(dados));

      if (response.error === false) {
        setTimeout(() => {
          navigate('/telaPrincipal');
        }, 2000);
      } else {
        alert(response.error);
      }

    } catch (error) {
      alert(error.error);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <h2>Recuperar Senha</h2>
      <form onSubmit={enviarSolicitacao} className={styles.forgotPasswordForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={preencherDados}
            required
          />
          {emailError && <span className={styles.error}>{emailError}</span>}
        </div>
        <button type="submit" className={styles.submitButton}>Enviar</button>
      </form>
      <p className={styles.backToLogin}>
        Lembrou sua senha? <Link to="/login">Voltar para o login</Link>
      </p>
    </div>
  );
};

export default RecuperarSenha;
