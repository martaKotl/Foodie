import axios from "axios";

const Foodie_base_URL = "http://localhost:8080/api";

class HistoryService {
  getHistoryMealsByUserId(userId) {
    return axios.get(`${Foodie_base_URL}/meals/history/user/${userId}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching history meals:", error);
        throw error;
      });
  }
}

export default new HistoryService();
