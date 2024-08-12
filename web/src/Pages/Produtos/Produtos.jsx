import React, { useState, useEffect, useCallback } from 'react';
import Styles from './Produtos.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import produtosService from '../../Services/Produtos/Produtos-service';
import ProdutoItem from './componentes/ProdutoItem';
import {
  Paper,
  CircularProgress,
} from '@material-ui/core';

function Produtos(quantidadeCarrinho) {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);

  const handleVoltar = () => {
    navigate('/telaPrincipal');
  };

  const obterTodosProdutos = async () => {
    setCarregando(true);
    try {
      const resposta = await produtosService.getAllProducts();
      if (resposta.error === false) {
        const produtos = resposta.data;
        setProdutos(produtos);
        setProdutosFiltrados(produtos);

        const categorias = new Set();
        const departamentos = new Set();

        produtos.forEach(produto => {
          if (produto.category) categorias.add(produto.category);
          if (produto.categoria) categorias.add(produto.categoria);
          if (produto.departamento) departamentos.add(produto.departamento);
        });

        setCategorias(Array.from(categorias));
        setDepartamentos(Array.from(departamentos));
      } else {
        alert(resposta.message);
      }
    } catch (erro) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    obterTodosProdutos();
  }, []);

  const filtrarProdutos = useCallback(() => {
    let filtrados = [...produtos];

    if (termoBusca) {
      const termoLower = termoBusca.toLowerCase();
      filtrados = filtrados.filter(produto =>
        (produto.name && produto.name.toLowerCase().includes(termoLower)) ||
        (produto.nome && produto.nome.toLowerCase().includes(termoLower)) ||
        (produto.description && produto.description.toLowerCase().includes(termoLower)) ||
        (produto.descricao && produto.descricao.toLowerCase().includes(termoLower))
      );
    }

    if (categoria) {
      filtrados = filtrados.filter(produto =>
        (produto.category && produto.category === categoria) ||
        (produto.categoria && produto.categoria === categoria)
      );
    }

    if (departamento) {
      filtrados = filtrados.filter(produto =>
        produto.departamento && produto.departamento === departamento
      );
    }

    setProdutosFiltrados(filtrados);
    setPaginaAtual(1);
  }, [produtos, termoBusca, categoria, departamento]);

  useEffect(() => {
    filtrarProdutos();
  }, [termoBusca, categoria, departamento, filtrarProdutos]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [itensPorPagina]);

  const produtosPaginados = produtosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const handleProximaPagina = () => {
    setPaginaAtual((prevPage) => prevPage + 1);
  };

  const handlePaginaAnterior = () => {
    setPaginaAtual((prevPage) => Math.max(prevPage - 1, 1));
  };

  const totalProdutos = produtosFiltrados.length;
  const inicioExibicao = (paginaAtual - 1) * itensPorPagina + 1;
  const fimExibicao = Math.min(paginaAtual * itensPorPagina, totalProdutos);

  return (
    <>
      <Header quantidadeCarrinho={quantidadeCarrinho.toString()}/>
      <div className={Styles.TelaPrincipalContainer}>
        <div className={Styles.mainContent}>
          <h1>Produtos</h1>
          <div className={Styles.filterContainer}>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className={Styles.searchBar}
              disabled={carregando}
            />
            <div className={Styles.filterOptions}>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={Styles.filterSelect}
                disabled={carregando}
              >
                <option value="">Todas as Categorias</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className={Styles.filterSelect}
                disabled={carregando}
              >
                <option value="">Todos os Departamentos</option>
                {departamentos.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
          </div>
          <Paper className={Styles.paper}>
            {carregando ? (
              <div className={Styles.loading}>
                <CircularProgress />
                <p>Carregando...</p>
              </div>
            ) : (
              <>
                <div className={Styles.paginationControls}>
                  <label htmlFor="itemsPerPage">Itens por página:</label>
                  <select
                    id="itemsPerPage"
                    value={itensPorPagina}
                    onChange={(e) => setItensPorPagina(Number(e.target.value))}
                    disabled={carregando}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <p className={Styles.productCount}>
                    {inicioExibicao}-{fimExibicao} de {totalProdutos}
                  </p>
                </div>
                <div className={Styles.gallery}>
                  {produtosFiltrados.length > 0 ? (
                    produtosPaginados.length > 0 ? (
                      produtosPaginados.map((produto) => (
                        <ProdutoItem key={produto.id} product={produto} />
                      ))
                    ) : (
                      <p className={Styles.noProductsMessage}>Nenhum produto encontrado</p>
                    )
                  ) : (
                    <p className={Styles.noProductsMessage}>Nenhum produto encontrado</p>
                  )}
                </div>
              </>
            )}
          </Paper>
          <div className={Styles.paginationContainer}>
            <button
              type="button"
              className={Styles.BackButton}
              onClick={handlePaginaAnterior}
              disabled={carregando || paginaAtual === 1}
            >
              Página Anterior
            </button>

            <button
              type="button"
              className={Styles.BackButton}
              onClick={handleProximaPagina}
              disabled={carregando || fimExibicao >= totalProdutos}
            >
              Próxima Página
            </button>
          </div>
        </div>
        <div className={Styles.buttonContainer}>
          <button type="button" className={Styles.BackButton} onClick={handleVoltar} disabled={carregando}>
            Voltar
          </button>
        </div>
      </div>
    </>
  );
}

export default Produtos;
