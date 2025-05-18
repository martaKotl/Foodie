import axios from "axios";

const Foodie_base_URL = "http://localhost:8080/api";

class UserService {
    registerUser(user){
        return axios.post(`${Foodie_base_URL}/register`, user);
    }

    activateAccount(token){
        return axios.get(`${Foodie_base_URL}/activate`, { params: { token } });
    }

    loginUser(email, password) {
        //console.log(email, password)
        return axios.post(`${Foodie_base_URL}/login`, { email, password });
    }
}

export default new UserService();