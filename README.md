# Ecommerce

## :octocat: Integrante

[Daniel Duarte](https://github.com/JoseDanielF)

## 📃 Sobre o Projeto

Você deve construir uma pequena aplicação de ecommerce de acordo com o seguinte contexto: uma loja quer montar um site para vender seus produtos. Essa loja possui 2 fornecedores, que construíram uma API para você consumir e listar todos os produtos disponíveis nesta loja. O cliente deve ser capaz de filtrar e pesquisar por produtos específicos enquanto acessa o site. É importante que todos os produtos selecionados vão para um carrinho de compras. Além disso, você precisará registrar em um banco de dados cada compra realizada nesta loja com os dados do cliente e dos produtos comprados.

## :hammer_and_wrench: Tecnologias que serão usadas

### [React](https://react.dev/versions)
* versão 18.3.1

### [Node.js](https://nodejs.org/pt)
* versão 20.15.1

## :construction: Status do Projeto
Inicial

## :computer: Instruções para Configuração do Ambiente

1. Clone este repositório:

    ```bash
    git clone https://github.com/JoseDanielF/ecommerce.git
    ```

2. Navegue até a pasta do projeto:

    ```bash
    cd ecommerce
    ```

3. Entre na pasta `web` e instale as dependências:

    ```bash
    cd web
    yarn install
    ```

4. Em outra aba ou terminal, entre na pasta `api` e instale as dependências:

    ```bash
    cd api
    yarn install
    ```

5. Para iniciar a aplicação, abra dois terminais:

    - No primeiro terminal, inicie o front-end:

        ```bash
        cd web
        yarn start
        ```

    - No segundo terminal, inicie o back-end:

        ```bash
        cd api
        yarn start
        ```

## :floppy_disk: Banco de Dados

O banco de dados utilizado é o **PostgreSQL**. Você pode visualizar o modelo entidade-relacionamento (MER) através [deste link](https://lucid.app/lucidchart/b816203a-1321-471c-84cb-d29119172625/edit?invitationId=inv_b2932ffa-e1d2-4fd4-b8c8-035cfa32d5b5).

### Script SQL para Criação do Banco de Dados

```sql
CREATE TABLE Endereco (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    CEP VARCHAR(10) NOT NULL,
    Logradouro VARCHAR(255) NOT NULL,
    Bairro VARCHAR(100),
    UF CHAR(2) NOT NULL,
    Pais VARCHAR(100) NOT NULL,
    Complemento VARCHAR(255),
    Numero VARCHAR(10),
    Cidade VARCHAR(100) NOT NULL,
    Deletado BOOLEAN DEFAULT FALSE
);

CREATE TABLE Usuario (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Documento VARCHAR(20),
    Telefone VARCHAR(15),
    EnderecoID INT,
    Deletado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (EnderecoID) REFERENCES Endereco(ID)
);

CREATE TABLE Pedidos (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    DataPedido DATETIME NOT NULL,
    DataAlteracao DATETIME,
    IDUsuario INT,
    IDProduto INT,
    Fornecedor VARCHAR(255),
    Preco DECIMAL(10, 2) NOT NULL,
    Quantidade INT NOT NULL,
    FOREIGN KEY (IDUsuario) REFERENCES Usuario(ID)
);