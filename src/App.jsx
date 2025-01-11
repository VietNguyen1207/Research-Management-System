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
      <div className="min-h-screen">
        <Header />
        <NavBar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <main
                className={`transition-all duration-300 pt-16 ${
                  isNavOpen ? "pl-64" : "pl-0"
                }`}
              >
                <h1>Main Content</h1>
              </main>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
