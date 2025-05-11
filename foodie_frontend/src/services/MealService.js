import axios from "axios";

// Base URL of the API
const Foodie_base_URL = "http://localhost:8080/api";

// MealService class
class MealService {
    
addMeal(meal) {
    return axios.post(`${Foodie_base_URL}/meals/add`, meal)
        .then(response => {
            // Optional: Check backend's 'success' flag if using custom response structure
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to add meal.");
            }
        })
        .catch(error => {
            // Log detailed error info for debugging
            console.error("There was an error adding the meal:", error.response?.data || error.message);
            throw error;
        });
}

    // Method to get meals by userId
    getMealsByUserId(userId) {
        return axios.get(`${Foodie_base_URL}/meals/user/${userId}`)
            .then(response => {
                return response.data;  // Returning response data from the backend
            })
            .catch(error => {
                console.error("There was an error retrieving the meals:", error);
                throw error;
            });
    }

    // Method to delete meals by userId
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
}

export default new MealService();
