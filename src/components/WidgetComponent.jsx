import React from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Button } from "@mantine/core";
import {
  HomePageContextwithProvider,
  useHomePageContext,
} from "./Homepage/HomePage.context.jsx";

const WidgetComponentContainer = () => {
  const navigate = useNavigate();
  const { watchList } = useHomePageContext();

  console.log("watchList", watchList);

  const goBack = () => {
    navigate("/home"); // Adjust to the correct path for HomePage
    window.electronAPI.createMainWindow();
  };

  return (
    <Paper>
      <Button onClick={goBack}>GO BACK</Button>
      {/* Other component content */}
    </Paper>
  );
};

const WidgetComponent = () => {
  return (
    <HomePageContextwithProvider>
      <WidgetComponentContainer />
    </HomePageContextwithProvider>
  );
};

export default WidgetComponent;
