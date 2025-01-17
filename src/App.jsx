import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Login from "./pages/Login";
import RegisterResearch from "./pages/RegisterResearch";
import Papers from "./pages/Papers";
import Quotas from "./pages/Quotas";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthState } from "./auth/authSlice";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check auth state when app loads
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen w-full overflow-auto scrollbar-hide">
        <Header />
        <NavBar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register-research" element={<RegisterResearch />} />
          <Route path="/papers" element={<Papers />} />
          <Route path="/quotas" element={<Quotas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
