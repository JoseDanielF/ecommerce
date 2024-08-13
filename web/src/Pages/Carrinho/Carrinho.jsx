import React from 'react';
import Styles from './Carrinho.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import pedidosService from '../../Services/Pedidos/Pedidos-service';
import dadosUserLogadoService from '../../Services/DadosUserLogado/DadosUserLogado-service';

function Carrinho({ itens = [], quantidadeCarrinho, limparCarrinho }) {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate('/telaPrincipal');
  };

  const handleFinalizarCompra = async () => {
    const promises = itens.map((item) => {
      const dados = {
        idProduto: item.id || item.productId,
        idUsuario: dadosUserLogadoService.getUserInfo().id,
        quantidade: item.quantidade,
        preco: item.price || item.preco,
        fornecedor: item.pais
      };

      return pedidosService.buyProduct(dados);
    });

    const resultados = await Promise.all(promises);

    const erros = resultados.filter(resposta => resposta.error);

    if (erros.length === 0) {
      alert('Todas as compras foram finalizadas com sucesso!');
      limparCarrinho();
      return navigate('/pedidos');
    } else {
      alert(`Algumas compras falharam.`);
    }
  };

  const calcularValorTotal = () => {
    return itens.reduce((total, item) => {
      const precoUnitario = item.hasDiscount ? (item.price - (item.price * item.discountValue)) : item.price;
      return total + (precoUnitario * item.quantidade);
    }, 0).toFixed(2);
  };

  return (
    <>
      <Header quantidadeCarrinho={quantidadeCarrinho} />
      <div className={Styles.TelaPrincipalContainer}>
        <div className={Styles.mainContent}>
          <h1>Carrinho</h1>
          <Paper className={Styles.paper}>
            {itens.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                {itens.map((item, index) => (
                  <div key={index} className={Styles.cartItem}>
                    <img src={item.imagem || item.gallery[0]} alt={item.name || item.nome} className={Styles.cartItemImage} />
                    <div className={Styles.cartItemDetails}>
                      <p><strong>{item.name || item.nome}</strong></p>
                      <p>Quantidade: {item.quantidade}</p>
                      <p>Preço Unitário: R$ {item.price || item.preco}</p>
                      {item.hasDiscount && (
                        <p>Preço com Desconto: R$ {(item.price - (item.price * item.discountValue)).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div className={Styles.totalContainer}>
                  <p><strong>Valor Total:</strong> R$ {calcularValorTotal()}</p>
                </div>
              </>
            )}
          </Paper>
        </div>
        <div className={Styles.buttonContainer}>
          <button variant="contained" className={Styles.Button} onClick={handleVoltar}>
            Voltar
          </button>
          <button variant="contained" className={Styles.Button} onClick={handleFinalizarCompra}>
            Finalizar Compra
          </button>
        </div>
      </div>
    </>
  );
}

export default Carrinho;
