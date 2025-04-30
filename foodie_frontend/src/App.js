import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Register from './component/Register';

function App() {
  return (
    <div className="">
      <BrowserRouter>
      <Routes>
        <Route index element={<Register />} />
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
