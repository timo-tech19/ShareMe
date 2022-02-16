import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Login } from "./components";
import Home from "./containers/Home";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) navigate("/login");
  }, [navigate]);

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/*' element={<Home />} />
    </Routes>
  );
}

export default App;
