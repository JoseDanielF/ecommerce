import React from 'react';
import PropTypes from 'prop-types';
import Styles from './ProdutoItem.module.css';

function ProdutoItem({ product }) {
  let preco, valorDesconto, precoDesconto, name, description, gallery, hasDiscount, departamento, categoria, adjective, material;

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
  } else {
    return null;
  }

  const truncateDescription = (description) => {
    const maxLength = 100;
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  return (
    <div className={Styles.productItem}>
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
    // Type 2 and Type 3 specific props
    nome: PropTypes.string,
    descricao: PropTypes.string,
    imagem: PropTypes.string,
    preco: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // Type 4 specific props
    categoria: PropTypes.string,
    departamento: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
};

export default ProdutoItem;