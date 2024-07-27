import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Login/LoginPage.jsx";
import SignUp from "./SignUp/SignUp.jsx";
import Settings from "./Settings/Settings.jsx";
import WidgetComponent from "./WidgetComponent.jsx";
import HomePageWithContext from "./Homepage/HomePage.jsx";
import { auth } from "../firebase.config.js";

function LayoutContainer() {
  // TODO: Create context of layout,
  // store isUserLoggedIn state in context
  let isUserLoggedIn = false;

  console.log("auth", { auth });
  console.log("auth.currentUser", auth.currentUser);

  if (auth.currentUser !== null) {
    isUserLoggedIn = true;
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          // element={isUserLoggedIn ? <HomePageWithContext /> : <LoginPage />}
          element={<HomePageWithContext />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/widget" element={<WidgetComponent />} />
      </Routes>
    </HashRouter>
  );
}

const Layout = () => {
  return (
    // TODO: Wrap layout context provider here
    <div>
      <LayoutContainer />
    </div>
  );
};

export default Layout;
