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
        return axios.post(`${Foodie_base_URL}/login`, { email, password });
    }
    
    getUser(userId) {
        return axios.get(`${Foodie_base_URL}/users/${userId}`);
    }

    updateSoundSetting(userId, enabled) {
        return axios.patch(`${Foodie_base_URL}/users/${userId}/sound`, null, {
            params: {
            enabled: enabled
            }
        });
    }


}

export default new UserService();