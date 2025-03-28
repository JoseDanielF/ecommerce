import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { IoMdExit } from "react-icons/io";
import Styles from '../Header/Header.module.css';
import dadosUserLogadoService from '../../Services/DadosUserLogado/DadosUserLogado-service';

const Header = ({ quantidadeCarrinho }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/perfil');
  };

  const goToCarrinho = () => {
    navigate('/carrinho');
  };

  const realizarLogout = () => {
    dadosUserLogadoService.logOut();
    navigate('/login');
  };

  return (
    <div className={Styles.headerContainer}>
      <h1 className={Styles.title}>Ecommerce</h1>
      <div className={Styles.iconContainer}>
        <div className={Styles.iconBox} onClick={goToProfile}>
          <FaUserCircle className={Styles.profileIcon} />
        </div>
        <div className={Styles.iconBox} onClick={goToCarrinho}>
          <FaShoppingCart className={Styles.profileIcon} />
          <div className={Styles.cartCount}>
            {Number.isNaN(quantidadeCarrinho) ? '0' : quantidadeCarrinho.toString()}
          </div>
        </div>
        <div className={Styles.iconBox} style={{ marginRight: 15 }} onClick={realizarLogout}>
          <IoMdExit className={Styles.profileIcon} />
        </div>
      </div>
    </div>
  );
}

export default Header;
