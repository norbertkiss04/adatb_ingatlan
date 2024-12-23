import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Properties from "./pages/Properties";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetail from "./pages/PropertyDetail";
import Favorites from "./pages/Favorites";
import AdminPanel from "./pages/AdminPanel";
import EditProperty from "./components/EditProperty";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/properties/edit/:id" element={<EditProperty />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
