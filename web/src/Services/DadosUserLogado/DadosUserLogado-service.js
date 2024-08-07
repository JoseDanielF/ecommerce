class DadosUserLogadoService {
    logOut() {
        localStorage.removeItem('userInfo');
        return null;
    }

    getUserInfo() {
        return JSON.parse(localStorage.getItem('userInfo'));
    }
}

const dadosUserLogadoService = new DadosUserLogadoService();
export default dadosUserLogadoService;