import React from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import {
  HashRouter,
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import "../src/App.css";
import { Notifications } from "@mantine/notifications";
import HomePage from "./components/Homepage/HomePage.jsx";
import LoginPage from "./components/Login/LoginPage.jsx";
import Verification from "./components/Verification/Verification.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import NetworkStatusIndicator from "./components/NetworkStatusIndicator.jsx";
import Settings from "./components/Settings/Settings.jsx";
import WidgetComponent from "./components/WidgetComponent.jsx";
export default function App() {
  const theme = createTheme({
    colorScheme: "dark",

    // primaryColor: 'dark',
    fontFamily: "Inter",
    defaultRadius: "md",
    headings: {
      fontFamily: "Inter",
      sizes: {
        h1: { fontSize: "2rem" },
        h2: { fontSize: "1.75rem" },
        h3: { fontSize: "1.5rem" },
      },
    },
  });

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
      withGlobalStyles
      withNormalizeCSS
    >
      <NetworkStatusIndicator />
      <HashRouter>
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/widget" element={<WidgetComponent />} />
        </Routes>
      </HashRouter>

      {/* <HomePage /> */}
      {/* <LoginPage /> */}
      {/* <Verification /> */}
      {/* <SignUp /> */}
      <Notifications position="top-right" autoClose={2000} />
    </MantineProvider>
  );
}
