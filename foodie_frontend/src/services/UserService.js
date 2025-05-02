import axios from "axios";

const Foodie_base_URL = "http://localhost:8080/api";

class UserService {
    registerUser(user){
        return axios.post(`${Foodie_base_URL}/register`, user);
    }
}

export default new UserService();