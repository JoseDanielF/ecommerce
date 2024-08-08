import React, { useState, useEffect, useCallback } from 'react';
import Styles from './Produtos.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import produtosService from '../../Services/Produtos/Produtos-service';
import ProdutoItem from './componentes/ProdutoItem';
import {
  Paper,
  CircularProgress,
  Button
} from '@material-ui/core';

function Produtos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [filterType, setFilterType] = useState('category');
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleBack = () => {
    navigate('/telaPrincipal');
  };

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await produtosService.getAllProducts();
      if (response.error === false) {
        const products = response.data;
        setProducts(products);
        setFilteredProducts(products);

        const categoriesSet = new Set();
        const departmentsSet = new Set();

        products.forEach(product => {
          if (product.category) categoriesSet.add(product.category);
          if (product.categoria) categoriesSet.add(product.categoria);
          if (product.departamento) departmentsSet.add(product.departamento);
        });

        setCategories(Array.from(categoriesSet));
        setDepartments(Array.from(departmentsSet));
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.nome && product.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.descricao && product.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (category) {
      filtered = filtered.filter(product =>
        (filterType === 'category' &&
          ((product.category && product.category === category) ||
            (product.categoria && product.categoria === category))) ||
        (filterType === 'department' && product.departamento && product.departamento === category)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Resetar para a primeira página após filtrar
  }, [products, searchTerm, category, filterType]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, category, filterProducts]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={Styles.searchBar}
            disabled={loading}
          />
          <div className={Styles.filterOptions}>
            <button
              type="button"
              className={Styles.filterButton}
              onClick={() => setFilterType(filterType === 'category' ? 'department' : 'category')}
              disabled={loading}
            >
              Filtrar por: {filterType === 'category' ? 'Categorias' : 'Departamentos'}
            </button>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={Styles.filterSelect}
              disabled={loading}
            >
              <option value="">Todas as {filterType === 'category' ? 'Categorias' : 'Departamentos'}</option>
              {filterType === 'category' ? (
                categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))
              )}
            </select>
          </div>
        </div>
        <Paper className={Styles.paper}>
          {loading ? (
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
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  disabled={loading}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className={Styles.gallery}>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <ProdutoItem key={product.id} product={product} />
                  ))
                ) : (
                  <p className={Styles.noProductsMessage}>Nenhum produto encontrado</p>
                )}
              </div>
            </>
          )}
        </Paper>
        <div className={Styles.paginationContainer}>
          <Button
            className={Styles.BackButton}
            variant="contained"
            color="primary"
            onClick={handlePrevPage}
            disabled={loading || currentPage === 1}
          >
            Página Anterior
          </Button>
          <Button
            className={Styles.BackButton}
            variant="contained"
            color="primary"
            onClick={handleNextPage}
            disabled={loading || paginatedProducts.length < itemsPerPage}
          >
            Próxima Página
          </Button>
        </div>
        <p className={Styles.productCount}>Total de produtos: {filteredProducts.length}</p>
      </div>
      <div className={Styles.buttonContainer}>
        <button type="button" className={Styles.BackButton} onClick={handleBack} disabled={loading}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default Produtos;
