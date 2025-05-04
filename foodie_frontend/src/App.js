import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';

import Register from './component/Register';
import VerifyAccount from "./component/VerifyAccount";

function App() {
  return (
    <div className="">
      <BrowserRouter>
      <Routes>
        <Route index element={<Register />} />
        <Route path="/" element={<Register />} />
        <Route path="/verify" element={<VerifyAccount />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
