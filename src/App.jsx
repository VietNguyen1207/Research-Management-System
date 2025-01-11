import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Login from "./pages/Login";
import { useState } from "react";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <Router>
      <div className="min-h-screen w-full overflow-auto scrollbar-hide">
        <Header />
        <NavBar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
