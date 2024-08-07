import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

class UsuarioService {
    async updateUser(data, idUsuario) {
        try {
            const response = await axios.put(`${API_URL}/updateUser/${idUsuario}`, data, {
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

    async deleteUser(idUsuario, senha) {
        try {
            console.log(senha)
            const response = await axios.put(`${API_URL}/deleteUser/${idUsuario}`, {id: idUsuario, senha: senha}, {
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

const usuarioService = new UsuarioService();
export default usuarioService;