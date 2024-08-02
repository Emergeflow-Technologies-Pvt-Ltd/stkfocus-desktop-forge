import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Login/LoginPage.jsx";
import SignUp from "./SignUp/SignUp.jsx";
import Settings from "./Settings/Settings.jsx";
import HomePageWithContext from "./Homepage/HomePage.jsx";
import { LayoutProvider, useLayoutContext } from "./Layout.context.jsx";
import WidgetComponent from "./Widget/WidgetComponent.jsx";
import { Loader, Flex } from "@mantine/core";

function LayoutContainer() {
  const { isUserLoggedIn, isLoading } = useLayoutContext();

  return (
    <>
      {/* TODO: Loader should be in center of the page */}
      {isLoading ? (
        <Flex flex={1} h={"100vh"} justify={"center"} align={"center"}>
          <Loader size={"lg"} />
        </Flex>
      ) : (
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
      )}
    </>
  );
}

const Layout = () => {
  return (
    <LayoutProvider>
      <LayoutContainer />
    </LayoutProvider>
  );
};

export default Layout;
