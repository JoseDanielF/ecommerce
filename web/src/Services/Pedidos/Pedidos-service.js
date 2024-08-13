import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

class PedidosService {
    async buyProduct(data) {
        try {
            const response = await axios.post(`${API_URL}/registerBuy`, data, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 201)
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

    async getCompraByID(idProduct) {
        try {
            const response = await axios.get(`${API_URL}/getProductById/${idProduct}`, {
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

    async getAllBuys() {
        try {
            const response = await axios.get(`${API_URL}/getAllBuys`, {
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

const pedidosService = new PedidosService();
export default pedidosService;