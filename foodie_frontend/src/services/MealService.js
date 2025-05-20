import axios from "axios";

const Foodie_base_URL = "http://localhost:8080/api";

class MealService {
    
    addMeal(meal) {
        return axios.post(`${Foodie_base_URL}/meals/add`, meal)
            .then(response => {
            
                if (response.data.success) {
                    return response.data;
                } else {
                    throw new Error(response.data.message || "Failed to add meal.");
                }
            })
            .catch(error => {
                
                console.error("There was an error adding the meal:", error.response?.data || error.message);
                throw error;
            });
    }

    getMealsByUserId(userId) {
        return axios.get(`${Foodie_base_URL}/meals/user/${userId}`)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("There was an error retrieving the meals:", error);
                throw error;
            });
    }

    deleteMealsByUserId(userId) {
        return axios.delete(`${Foodie_base_URL}/meals/delete/${userId}`)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("There was an error deleting the meals:", error);
                throw error;
            });
    }

    editMeal(id, meal) {
        console.log("Meal to send (as numbers):", meal);
        return axios.put(`${Foodie_base_URL}/meals/edit/${id}`, meal);
            
    }
}

export default new MealService();
