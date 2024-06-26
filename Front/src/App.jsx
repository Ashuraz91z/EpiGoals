import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import NotFound from "./Components/NotFound/NotFound";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Test from "./Components/test/test";
import Header from "./Components/Header/Header";
import Profil from "./Components/Settings/Profil";
import Classement from "./Components/Classement/Classement";
import Notifications from "./Components/Notifications/Notifications";
import Match from "./Components/Match/Match";
import AjoutMatch from "./Components/Match/AddMatch";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";

const App = () => {
  return (
    <div>
      <Header />
      <Router>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/ajouter-match" element={<AjoutMatch />} />
          <Route path="/match" element={<Match />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/classement" element={<Classement />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/test" element={<Test />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
