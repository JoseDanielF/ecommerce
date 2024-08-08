import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

class RegisterService {


    async registerUser(userData) {
        try {
            const response = await axios.post(`${API_URL}/register`, userData, {
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

    async consultaCep(cep) {
        try {
            const response = await axios.get(`${API_URL}/consultCep/${cep}`, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200)
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
}

const registerService = new RegisterService();
export default registerService;