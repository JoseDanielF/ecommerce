import React, { useState, useEffect } from 'react';
import Styles from './Produtos.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import produtosService from '../../Services/Produtos/Produtos-service';
import ProdutoItem from './ProdutoItem';

function Produtos() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleBack = () => {
    navigate('/telaPrincipal');
  };

  const getAllProducts = async () => {
    try {
      const response = await produtosService.getAllProducts();

      if (response.error === false) {
        setProducts(response.data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className={Styles.TelaPrincipalContainer}>
      <Header />
      <div className={Styles.mainContent}>
        <h1>Produtos</h1>
        <div className={Styles.gallery}>
          {products.map((product) => (
            <ProdutoItem key={product.id} product={product} />
          ))}
        </div>
        <p className={Styles.productCount}>Total de produtos: {products.length}</p>
      </div>
      <div className={Styles.buttonContainer}>
        <button type="button" className={Styles.BackButton} onClick={handleBack}>Voltar</button>
      </div>
    </div>
  );
}

export default Produtos;
