import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Styles from './Produto.module.css';
import Header from '../Header/Header';
import { Paper, CircularProgress, Button, TextField } from '@material-ui/core';
import produtosService from '../../Services/Produtos/Produtos-service';

function Produto({ adicionarCarrinho, quantidadeCarrinho}) {
  const { id, pais } = useParams();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const response = await produtosService.getProductByID(pais, id);
        const data = response.data;
        setProduto(data);
        setCarregando(false);
      } catch (error) {
        setCarregando(false);
      }
    }
    fetchProduto();
  }, [id, pais]);

  const handleVoltar = () => {
    navigate('/produtos');
  };

  const handleCompra = () => {
    adicionarCarrinho(produto, quantidade, pais);
    navigate('/carrinho');
  };

  const calcularPreco = (price, discountValue) => {
    return price - (price * discountValue);
  };

  return (
    <>
      <Header quantidadeCarrinho={quantidadeCarrinho.toString()} />
      <div className={Styles.TelaPrincipalContainer}>
        <div className={Styles.mainContent}>
          {carregando ? (
            <div className={Styles.loading}>
              <CircularProgress />
              <p>Carregando...</p>
            </div>
          ) : (
            <>
              {produto ? (
                <>
                  <h1>{produto.name || produto.nome || "No Name Available"}</h1>
                  <Paper className={Styles.paper}>
                    <img 
                      src={(produto.gallery && produto.gallery[0]) || produto.imagem || "https://via.placeholder.com/150"}
                      alt={produto.name || produto.nome}
                      className={Styles.productImage}
                    />
                    {pais === 'eu' ? (
                      <>
                        <p><strong>Adjective:</strong> {produto.details?.adjective || "Not available"}</p>
                        <p><strong>Material:</strong> {produto.details?.material || "Not available"}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Categoria:</strong> {produto.categoria || "Categoria não disponível"}</p>
                        <p><strong>Departamento:</strong> {produto.departamento || "Departamento não disponível"}</p>
                      </>
                    )}
                    <p>{produto.description || produto.descricao || "No Description Available"}</p>
                    <div className={Styles.priceContainer}>
                      {produto.hasDiscount ? (
                        <>
                          <p className={Styles.originalPrice}><strong>Preço Original:</strong> R$ {produto.price}</p>
                          <p className={Styles.discountedPrice}><strong>Preço com Desconto:</strong> R$ {calcularPreco(produto.price, produto.discountValue).toFixed(2)}</p>
                          <p className={Styles.discount}><strong>Desconto:</strong> {`${produto.discountValue * 100}%`}</p>
                        </>
                      ) : (
                        <p><strong>Preço:</strong> R$ {produto.price || produto.preco || "No Price Available"}</p>
                      )}
                    </div>
                    <div className={Styles.actionContainer}>
                      <TextField
                        label="Quantidade"
                        type="number"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        InputProps={{ inputProps: { min: 1 } }}
                        variant="outlined"
                        className={Styles.quantityField}
                      />
                      <button
                        variant="contained"
                        color="primary"
                        onClick={handleCompra}
                        className={Styles.Button}
                      >
                        Comprar
                      </button>
                    </div>
                  </Paper>
                </>
              ) : (
                <p>Produto não encontrado.</p>
              )}
            </>
          )}
        </div>
        <div className={Styles.buttonContainer}>
          <button variant="contained" className={Styles.Button} onClick={handleVoltar}>
            Voltar
          </button>
        </div>
      </div>
    </>
  );
}

export default Produto;