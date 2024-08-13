import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

class ProdutosService {
    async getAllProducts() {
        try {
            const response = await axios.get(`${API_URL}/getAllProducts`, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200)
                return {
                    error: false,
                    data: response.data,
                }

            return {
                error: true,
                data: response.data
            }
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    };

    async getProductByID(country, idProduct) {
        try {
            const response = await axios.get(`${API_URL}/getProductById/${country}/${idProduct}`, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                return {
                    error: false,
                    data: response.data.message || response.data
                };
            }

            return {
                error: true,
                data: response.data.error || response.data.message
            };
        } catch (error) {
            return {
                error: true,
                data: error.response ? error.response.data.error || error.response.data.message : 'Network Error'
            };
        }
    }
}

const produtosService = new ProdutosService();
export default produtosService;