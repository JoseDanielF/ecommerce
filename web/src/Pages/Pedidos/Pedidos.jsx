import React, { useState, useEffect } from 'react';
import Styles from './Pedidos.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import pedidosService from '../../Services/Pedidos/Pedidos-service';
import produtosService from '../../Services/Produtos/Produtos-service';

function Pedidos(quantidadeCarrinho) {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [pedidos, setPedidos] = useState([]);

  const handleVoltar = () => {
    navigate('/telaPrincipal');
  };

  const obterProduto = async (idproduto, fornecedor) => {
    try {
      const response = await produtosService.getProductByID(idproduto);
      const data = response.data;
      return fornecedor === 'eu' ? data.europeanProvider : data.brazilianProvider;
    } catch (erro) {
      alert(`Erro ao obter produto: ${erro.message}`);
      return null;
    }
  };

  const obterTodosPedidos = async () => {
    setCarregando(true);
    try {
      const resposta = await pedidosService.getAllBuys();
      if (!resposta.error) {
        const pedidosComProdutos = await Promise.all(
          resposta.data.map(async (pedido) => {
            const produto = await obterProduto(pedido.idproduto, pedido.fornecedor);
            return { ...pedido, produto };
          })
        );
        setPedidos(pedidosComProdutos);
      } else {
        alert(resposta.message);
      }
    } catch (erro) {
      alert(`Erro ao carregar pedidos: ${erro.message}`);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    obterTodosPedidos();
  }, []);

  return (
    <>
      <Header quantidadeCarrinho={quantidadeCarrinho.toString()}/>
      <div className={Styles.TelaPrincipalContainer}>
        <div className={Styles.mainContent}>
          <h1>Pedidos</h1>
          <Paper className={Styles.paper}>
            {carregando ? (
              <div className={Styles.loading}>
                <p>Carregando...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <p>Você ainda não fez nenhum pedido.</p>
            ) : (
              pedidos.map((pedido, index) => (
                <div key={index} className={Styles.pedidoItem}>
                  <div className={Styles.pedidoItemImage}>
                    <img src={pedido.produto?.imagem || '/path/to/default-image.png'} alt={pedido.produto?.nome || pedido.produto?.name} />
                  </div>
                  <div className={Styles.pedidoItemDetails}>
                    <p><strong>Data:</strong> {new Date(pedido.datapedido).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Quantidade:</strong> {pedido.quantidade}</p>
                    <p><strong>Total:</strong> R$ {pedido.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    {pedido.produto ? (
                      <>
                        <p><strong>Produto:</strong> {pedido.produto.nome || pedido.produto.name}</p>
                        <p><strong>Descrição:</strong> {pedido.produto.descricao || pedido.produto.description}</p>
                      </>
                    ) : (
                      <p>Informações do produto indisponíveis</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </Paper>
        </div>
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