import React, { useState } from "react";
import {
  Container,
  Text,
  Button,
  TextInput,
  Grid,
  Flex,
  Paper,
} from "@mantine/core";
import Icon from "../../../assets/buttonIcon.svg";
import NavBar from "../NavBar.jsx";
import WatchList from "./WatchList.jsx";
import SearchBox from "./SearchBox.jsx";

import { NEUTRALS, PRIMARY_COLORS } from "../../shared/colors.const.jsx";
import { HomePageContextwithProvider } from "./HomePage.context.jsx";
import { useNavigate } from "react-router-dom";
import { useLayoutContext } from "../Layout.context.jsx";

const HomePage = () => {
  const { watchlist, isAddingToWatchlist } = useLayoutContext();

  const navigate = useNavigate();

  const handleLaunchWidget = () => {
    window.electronAPI.launchWidget();
  };
  return (
    <>
      <NavBar />
      <Container
        fluid
        style={{
          color: "white",
          padding: "20px",
          backgroundColor: NEUTRALS[1100],
          height: "100vh",
        }}
      >
        <Container fluid style={{ maxWidth: "1100px" }}>
          <Grid>
            <Grid.Col span={8}>
              <Text style={{ fontSize: "2rem" }}>
                Nice to see you,{" "}
                <span style={{ color: "#C3FFF8" }}>Atharva</span>
              </Text>
            </Grid.Col>
            <Grid.Col
              p={0}
              span={4}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                mt="md"
                bg={PRIMARY_COLORS["blue_main"]}
                onClick={handleLaunchWidget}
                styles={{
                  label: { color: "white" },
                }}
              >
                <Icon />
                Launch Widget
              </Button>
            </Grid.Col>
          </Grid>
          <Grid>
            <Flex gap="md" style={{ width: "100%" }}>
              <Paper
                withBorder
                p="md"
                mt="sm"
                bg={NEUTRALS[1100]}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <SearchBox />
              </Paper>

              <WatchList watchlist={watchlist} />
            </Flex>
          </Grid>
        </Container>
      </Container>
    </>
  );
};

const HomePageWithContext = () => {
  return (
    <HomePageContextwithProvider>
      <HomePage />
    </HomePageContextwithProvider>
  );
};

export default HomePageWithContext;
