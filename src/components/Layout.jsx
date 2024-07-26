import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Login/LoginPage.jsx";
import SignUp from "./SignUp/SignUp.jsx";
import Settings from "./Settings/Settings.jsx";
import WidgetComponent from "./WidgetComponent.jsx";
import HomePageWithContext from "./Homepage/HomePage.jsx";

function Layout() {
  const isUserLoggedIn = false;

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={isUserLoggedIn ? <HomePageWithContext /> : <LoginPage />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/widget" element={<WidgetComponent />} />
      </Routes>
    </HashRouter>
  );
}

export default Layout;
