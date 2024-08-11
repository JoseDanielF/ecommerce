import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Styles from './ProdutoItem.module.css';

function ProdutoItem({ product }) {
  const navigate = useNavigate();

  let preco, valorDesconto, precoDesconto, name, description, gallery, hasDiscount, departamento, categoria, adjective, material, dataOrigin;

  if (product.hasOwnProperty('details')) {
    preco = parseFloat(product.price);
    valorDesconto = parseFloat(product.discountValue);
    precoDesconto = (preco - preco * valorDesconto).toFixed(2);
    name = product.name;
    description = product.description;
    gallery = product.gallery;
    hasDiscount = product.hasDiscount;
    adjective = product.details.adjective;
    material = product.details.material;
    dataOrigin = 'european';
  } else if (product.hasOwnProperty('body')) {
    preco = parseFloat(product.preco);
    valorDesconto = 0;
    precoDesconto = preco.toFixed(2);
    name = product.nome;
    description = product.descricao;
    gallery = [product.imagem];
    hasDiscount = false;
    adjective = null;
    material = null;
    dataOrigin = 'brazilian';
  } else if (product.hasOwnProperty('nome') && product.hasOwnProperty('imagem')) {
    preco = parseFloat(product.preco);
    valorDesconto = 0;
    precoDesconto = preco.toFixed(2);
    name = product.nome;
    description = product.descricao;
    gallery = [product.imagem];
    hasDiscount = false;
    adjective = null;
    material = null;
    dataOrigin = 'brazilian';
  } else if (product.hasOwnProperty('categoria') && product.hasOwnProperty('departamento')) {
    preco = parseFloat(product.preco);
    valorDesconto = 0;
    precoDesconto = preco.toFixed(2);
    name = product.nome;
    description = product.descricao;
    gallery = [product.imagem];
    hasDiscount = false;
    departamento = product.departamento;
    categoria = product.categoria;
    adjective = null;
    material = null;
    dataOrigin = 'brazilian';
  } else {
    return null;
  }

  const truncateDescription = (description) => {
    const maxLength = 100;
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  const handleClick = () => {
    navigate(`/produto/${product.id}/${dataOrigin === 'brazilian' ? 'br' : 'eu'}`);
  };

  return (
    <div className={Styles.productItem} onClick={handleClick}>
      <img src={gallery[0]} alt={name} className={Styles.productImage} />
      <h2>{name}</h2>
      <p>{truncateDescription(description)}</p>
      <p className={Styles.productPrice}>
        {hasDiscount ? (
          <>
            <span className={Styles.precoDesconto}>${precoDesconto}</span>
            <span className={Styles.originalPrice}>${preco.toFixed(2)}</span>
          </>
        ) : (
          <span>${preco.toFixed(2)}</span>
        )}
      </p>
      <p className={Styles.dataOrigin}>Origin: {dataOrigin}</p>
    </div>
  );
}

ProdutoItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    gallery: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    hasDiscount: PropTypes.bool,
    discountValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    details: PropTypes.shape({
      adjective: PropTypes.string,
      material: PropTypes.string,
    }),
    nome: PropTypes.string,
    descricao: PropTypes.string,
    imagem: PropTypes.string,
    preco: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    categoria: PropTypes.string,
    departamento: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
};

export default ProdutoItem;
