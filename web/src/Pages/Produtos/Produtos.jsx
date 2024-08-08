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

function Produtos() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('category');
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
      filtrados = filtrados.filter(produto =>
        (produto.name && produto.name.toLowerCase().includes(termoBusca.toLowerCase())) ||
        (produto.nome && produto.nome.toLowerCase().includes(termoBusca.toLowerCase())) ||
        (produto.description && produto.description.toLowerCase().includes(termoBusca.toLowerCase())) ||
        (produto.descricao && produto.descricao.toLowerCase().includes(termoBusca.toLowerCase()))
      );
    }

    if (categoria) {
      filtrados = filtrados.filter(produto =>
        (tipoFiltro === 'category' &&
          ((produto.category && produto.category === categoria) ||
            (produto.categoria && produto.categoria === categoria))) ||
        (tipoFiltro === 'department' && produto.departamento && produto.departamento === categoria)
      );
    }

    setProdutosFiltrados(filtrados);
    setPaginaAtual(1);
  }, [produtos, termoBusca, categoria, tipoFiltro]);

  useEffect(() => {
    filtrarProdutos();
  }, [termoBusca, categoria, filtrarProdutos]);

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

  return (
    <div className={Styles.TelaPrincipalContainer}>
      <Header />
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
            <button
              type="button"
              className={Styles.filterButton}
              onClick={() => setTipoFiltro(tipoFiltro === 'category' ? 'department' : 'category')}
              disabled={carregando}
            >
              Filtrar por: {tipoFiltro === 'category' ? 'Categorias' : 'Departamentos'}
            </button>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={Styles.filterSelect}
              disabled={carregando}
            >
              <option value="">Todas as {tipoFiltro === 'category' ? 'Categorias' : 'Departamentos'}</option>
              {tipoFiltro === 'category' ? (
                categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                departamentos.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))
              )}
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
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className={Styles.gallery}>
                {produtosPaginados.length > 0 ? (
                  produtosPaginados.map((produto) => (
                    <ProdutoItem key={produto.id} product={produto} />
                  ))
                ) : (
                  <p className={Styles.noProductsMessage}>Nenhum produto encontrado</p>
                )}
              </div>
            </>
          )}
        </Paper>
        <div className={Styles.paginationContainer}>
          <button type="button" className={Styles.BackButton}
            onClick={handlePaginaAnterior}
            disabled={carregando || paginaAtual === 1}
          >
            Página Anterior
          </button>
          <button type="button" className={Styles.BackButton}
            onClick={handleProximaPagina}
            disabled={carregando || produtosPaginados.length < itensPorPagina}
          >
            Próxima Página
          </button>
        </div>
        {/* <p className={Styles.productCount}>Total de produtos: {produtosFiltrados.length}</p> */}
      </div>
      <div className={Styles.buttonContainer}>
        <button type="button" className={Styles.BackButton} onClick={handleVoltar} disabled={carregando}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default Produtos;