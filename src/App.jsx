import "./App.css";
import NavBar from "./components/NavBar";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <NavBar />
      <main className="pl-64 pt-16">
        <h1>Main Content</h1>
      </main>
    </div>
  );
}

export default App;
