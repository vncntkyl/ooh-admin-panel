import Cookies from "js-cookie";

import Navbar from "./components/Navbar";
import Sidebar from "~components/Sidebar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Roles from "~pages/Roles";

function App() {
  const isAuthenticated = Cookies.get("user");
  const loginPage = "http://localhost:5173/";

  if (!isAuthenticated) {
    window.location.href = loginPage;
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Router>
        <main className="flex flex-row gap-4 p-4">
          <Sidebar />
          <Routes>
            <Route exact path="/" element={<>Dashboard</>} />
            <Route path="/roles/*" element={<Roles />} />
            <Route path="/users" element={<>Users</>} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
