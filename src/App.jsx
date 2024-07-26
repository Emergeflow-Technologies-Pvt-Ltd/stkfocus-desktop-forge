import React from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import "../src/App.css";
import { Notifications } from "@mantine/notifications";
import NetworkStatusIndicator from "./components/NetworkStatusIndicator.jsx";
import Layout from "./components/Layout.jsx";
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
      <Layout />
      <Notifications position="top-right" autoClose={2000} />
    </MantineProvider>
  );
}
