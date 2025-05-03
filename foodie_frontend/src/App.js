import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Register from './component/Register';
import Login from "./component/Login";

function App() {
  return (
    <div className="">
      <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
