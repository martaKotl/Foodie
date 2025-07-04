import axios from "axios";

const Foodie_base_URL = "http://localhost:8080/api";

class RecipeService {

  getAllRecipes() {
    return axios.get(`${Foodie_base_URL}/recipes`)
      .then(response => {
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || "Failed to fetch recipes.");
        }
      })
      .catch(error => {
        console.error("There was an error retrieving the recipes:", error.response?.data || error.message);
        throw error;
      });
  }

  getRecipeById(id) {
  return axios.get(`${Foodie_base_URL}/recipes/${id}`);
}

}

export default new RecipeService();
