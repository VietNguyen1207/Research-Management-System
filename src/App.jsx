import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthState, selectAuthChecked } from "./features/auth/authSlice";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();
  const authChecked = useSelector(selectAuthChecked);

  useEffect(() => {
    // Check auth state immediately on app load
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <Router>
      {!authChecked ? (
        // Show a centered loading spinner while checking auth
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F2722B]"></div>
        </div>
      ) : (
        <AppRoutes />
      )}
    </Router>
  );
}

export default App;
