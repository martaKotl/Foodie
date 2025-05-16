import axios from "axios";

const Foodie_base_URL = "http://localhost:8080/api";

class DailyGoalsService {
  getGoals(userId) {
    return axios.get(`${Foodie_base_URL}/goals/${userId}`);
  }

  updateGoals(userId, goals) {
    return axios.put(`${Foodie_base_URL}/goals/${userId}`, goals);
  }
}

export default new DailyGoalsService();
