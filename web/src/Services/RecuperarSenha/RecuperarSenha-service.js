import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

class RecuperarSenhaService {
    async sendEmailReset(email) {
        try {
            const response = await axios.post(`${API_URL}/sendEmailReset`, email, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 201)
                return {
                    error: false,
                    data: response.data
                }

            return {
                error: true,
                data: response.data
            }
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    };

    async resetPassword(data) {
        try {
            const response = await axios.post(`${API_URL}/resetPassword`, data, {
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

const recuperarSenhaService = new RecuperarSenhaService();
export default recuperarSenhaService;