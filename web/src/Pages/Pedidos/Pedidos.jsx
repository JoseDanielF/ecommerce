import React, { useState, useEffect, useCallback } from 'react';
import Styles from './Pedidos.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import pedidosService from '../../Services/Pedidos/Pedidos-service';
import produtosService from '../../Services/Produtos/Produtos-service';

function Pedidos({ quantidadeCarrinho }) {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  const handleVoltar = () => {
    navigate('/telaPrincipal');
  };

  const obterProduto = async (fornecedor, idproduto) => {
    try {
      const response = await produtosService.getProductByID(fornecedor, idproduto);
      const data = response.data;
      return data;
    } catch (erro) {
      alert(`Erro ao obter produto: ${erro.message}`);
      return null;
    }
  };

  const obterTodosPedidos = useCallback(async () => {
    setCarregando(true);
    try {
      const resposta = await pedidosService.getAllBuys();
      if (!resposta.error) {
        const pedidosComProdutos = await Promise.all(
          resposta.data.map(async (pedido) => {
            const produto = await obterProduto(pedido.fornecedor, pedido.idproduto);
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
  }, []);

  const filtrarPedidos = useCallback(() => {
    let filtrados = [...pedidos];

    if (termoBusca) {
      const termoLower = termoBusca.toLowerCase();
      filtrados = filtrados.filter(pedido =>
        (pedido.produto?.nome && pedido.produto.nome.toLowerCase().includes(termoLower)) ||
        (pedido.produto?.name && pedido.produto.name.toLowerCase().includes(termoLower)) ||
        (pedido.produto?.descricao && pedido.produto.descricao.toLowerCase().includes(termoLower)) ||
        (pedido.produto?.description && pedido.produto.description.toLowerCase().includes(termoLower))
      );
    }


    setPedidosFiltrados(filtrados);
  }, [pedidos, termoBusca]);

  useEffect(() => {
    obterTodosPedidos();
  }, [obterTodosPedidos]);

  useEffect(() => {
    filtrarPedidos();
  }, [termoBusca, filtrarPedidos]);

  return (
    <>
      <Header quantidadeCarrinho={quantidadeCarrinho.toString()} />
      <div className={Styles.TelaPrincipalContainer}>
        <div className={Styles.mainContent}>
          <h1>Pedidos</h1>
          <div className={Styles.filterContainer}>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className={Styles.searchBar}
              disabled={carregando}
            />
          </div>
          <Paper className={Styles.paper}>
            {carregando ? (
              <div className={Styles.loading}>
                <p>Carregando...</p>
              </div>
            ) : pedidosFiltrados.length === 0 ? (
              <p>Nenhum pedido encontrado.</p>
            ) : (
              pedidosFiltrados.map((pedido, index) => (
                <div key={index} className={Styles.pedidoItem}>
                  <div className={Styles.pedidoItemImage}>
                    <img src={pedido.produto?.imagem || '/path/to/default-image.png'} alt={pedido.produto?.nome || pedido.produto?.name} />
                  </div>
                  <div className={Styles.pedidoItemDetails}>
                    {pedido.produto ? (
                      <>
                        <p><strong>Produto:</strong> {pedido.produto.nome || pedido.produto.name}</p>
                        <p><strong>Descrição:</strong> {pedido.produto.descricao || pedido.produto.description}</p>
                      </>
                    ) : (
                      <p>Informações do produto indisponíveis</p>
                    )}
                    <p><strong>Data:</strong> {new Date(pedido.datapedido).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Quantidade:</strong> {pedido.quantidade}</p>
                    <p><strong>Total:</strong> R$ {pedido.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
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
