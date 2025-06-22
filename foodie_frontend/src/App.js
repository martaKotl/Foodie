import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { MusicProvider } from './component/MusicPlayer';
import './App.css';

import Register from './component/Register';
import VerifyAccount from "./component/VerifyAccount";
import Login from "./component/Login";
import HomePage from "./component/HomePage";
import AddMeal from "./component/AddMeal";
import BrowseRecipes from './component/BrowseRecipes';
import RecipeDetails from './component/RecipeDetails';
import History from './component/History';



const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('userId');
  return isAuthenticated ? children : <Navigate to="/" replace />;
};


function App() {

  return (
    <MusicProvider>
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/home/add_a_meal" element={<ProtectedRoute><AddMeal /></ProtectedRoute>} />
          <Route path="/browse-recipes" element={<ProtectedRoute><BrowseRecipes /></ProtectedRoute>} />
          <Route path="/recipes/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/home/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      
    </div>
    </MusicProvider>
  );
}

export default App;
