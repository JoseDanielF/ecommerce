import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Register.module.css";
import logo from "../../Assets/logo.png";
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { registerUser } from '../../Services/Register/Register-service';

const Register = () => {
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const navigate = useNavigate();
  const [tipoCadastro, setTipoCadastro] = useState('pessoaComum');
  const [dadosCadastro, setDadosCadastro] = useState({
    email: '',
    senha: '',
    nome: '',
    telefone: '',
    documento: '',
  });
  const [senhaValida, setSenhaValida] = useState({
    tamanho: false,
    hasUpperCase: false,
    hasLowerCase: false,
    numero: false,
    special: false,
  });

  const alterarDados = (e) => {
    const { name, value } = e.target;
    setDadosCadastro({
      ...dadosCadastro,
      [name]: value
    });
  };

  const validarSenha = (senha) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasLowerCase = /[a-z]/.test(senha);
    const hasNumber = /[0-9]/.test(senha);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

    return senha.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const submeter = async (e) => {
    e.preventDefault();
    if (dadosCadastro.senha !== confirmacaoSenha) {
      alert('Senhas diferentes');
      return;
    } else if (!validarSenha(dadosCadastro.senha)) {
      alert('A senha deve ter no mínimo 8 caracteres, incluir uma letra maiúscula, uma letra minúscula, um número e um caractere especial.');
      return;
    }

    try {
      const response = await registerUser(JSON.stringify(dadosCadastro));

      if (response.error === false) {
        alert('Usuário cadastrado com sucesso!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }

    } catch (error) {
      alert(error.message || 'Erro ao registrar usuário');
    }
  };

  useEffect(() => {
    const tamanho = dadosCadastro.senha.length >= 8;
    const hasUpperCase = /[A-Z]/.test(dadosCadastro.senha);
    const hasLowerCase = /[a-z]/.test(dadosCadastro.senha);
    const numero = /[0-9]/.test(dadosCadastro.senha);
    const special = /[^A-Za-z0-9]/.test(dadosCadastro.senha);
    setSenhaValida({ tamanho, hasUpperCase, hasLowerCase, numero, special });
  }, [dadosCadastro.senha]);

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerHeader}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h2>Cadastro</h2>
      </div>

      <form onSubmit={submeter} className={styles.registerForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={dadosCadastro.email}
            onChange={alterarDados}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={dadosCadastro.senha}
            onChange={alterarDados}
            required
          />
          <div className={styles.passwordTooltip}>
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <div className={styles.passwordCriteria}>Mínimo de 8 caracteres: {senhaValida.tamanho ? "✔️" : "❌"}</div>
              <div className={styles.passwordCriteria}>Letra maiúscula: {senhaValida.hasUpperCase ? "✔️" : "❌"}</div>
              <div className={styles.passwordCriteria}>Letra minúscula: {senhaValida.hasLowerCase ? "✔️" : "❌"}</div>
              <div className={styles.passwordCriteria}>Número: {senhaValida.numero ? "✔️" : "❌"}</div>
              <div className={styles.passwordCriteria}>Caractere especial: {senhaValida.special ? "✔️" : "❌"}</div>
            </div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmacaoSenha">Confirmação da senha:</label>
          <input
            type="password"
            id="confirmacaoSenha"
            name="confirmacaoSenha"
            value={confirmacaoSenha}
            onChange={(event) => setConfirmacaoSenha(event.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome do usuário:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={dadosCadastro.nome}
            onChange={alterarDados}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={dadosCadastro.documento}
            onChange={alterarDados}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="telefone">Número do telefone com DDD:</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={dadosCadastro.telefone}
            onChange={alterarDados}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Cadastre-se</button>
      </form>
      <p className={styles.backToLogin}>
        Já tem uma conta? <Link to="/login">Voltar para o login</Link>
      </p>
    </div>
  );
};

export default Register;
