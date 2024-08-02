import React, { useState } from "react";
import { Paper, Container, Flex, Text, Grid, Box } from "@mantine/core";
import NavBar from "../NavBar.jsx";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../../assets/back-icon.svg";
import { NEUTRALS } from "../../shared/colors.const.jsx";
import ProfileDetails from "./ProfileDetails/ProfileDetails.jsx";
import OtherSettings from "./OtherSettings/OtherSettings.jsx";
import { auth } from "../../firebase.config.js";
import { signOut } from "firebase/auth";
import { IconLogout } from "@tabler/icons-react";
import { useLayoutContext } from "../Layout.context.jsx";

export default function Settings() {
  const navigate = useNavigate();
  const { userDetails } = useLayoutContext();

  const TABS = {
    PROFILE_DETAILS: "Profile Details",
    OTHER_SETTINGS: "Other Settings",
  };
  const [activeTab, setActiveTab] = useState(TABS.PROFILE_DETAILS);
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    navigate("/");
    signOut(auth);
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
          height: "92vh",
        }}
      >
        <Container fluid style={{ maxWidth: "1100px" }}>
          <Flex
            align={"center"}
            gap={2}
            onClick={() => {
              navigate("/");
            }}
            style={{
              cursor: "pointer",
              marginBottom: "10px",
              width: "fit-content",
              transition: "text-decoration 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            <BackIcon />
            <Text>Back</Text>
          </Flex>
          {/* <Button
            onClick={() => {
              navigate('/home');
            }}
            variant="transparent"
            leftSection={<BackIcon />}
          >
            Back
          </Button> */}
          <Grid w={"100%"} gutter={"md"} style={{ marginTop: "20px" }}>
            <Grid.Col span={4}>
              <Paper withBorder bg={NEUTRALS[1100]} h={"70vh"}>
                <Box
                  w={"100%"}
                  p={"lg"}
                  style={{ borderBottom: "1px solid #444648" }}
                >
                  <Text size="xl" fw={"bold"}>
                    {userDetails.firstName}
                  </Text>
                </Box>
                <Box
                  w={"100%"}
                  p={"lg"}
                  style={{
                    borderBottom: "1px solid #282E33",
                    backgroundColor:
                      activeTab === TABS.PROFILE_DETAILS ? "#282E33" : null,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleTabChange(TABS.PROFILE_DETAILS);
                  }}
                >
                  <Text>{TABS.PROFILE_DETAILS}</Text>
                </Box>
                <Box
                  w={"100%"}
                  p={"lg"}
                  style={{
                    borderBottom: "1px solid #282E33",
                    backgroundColor:
                      activeTab === TABS.OTHER_SETTINGS ? "#282E33" : null,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleTabChange(TABS.OTHER_SETTINGS);
                  }}
                >
                  <Text>{TABS.OTHER_SETTINGS}</Text>
                </Box>
                <Box
                  w={"100%"}
                  p={"lg"}
                  style={{
                    borderBottom: "1px solid #444648",
                    cursor: "pointer",
                  }}
                  onClick={handleLogout}
                >
                  <Flex align={"center"} gap={"sm"}>
                    <Text>Logout</Text>
                    <IconLogout />
                  </Flex>
                </Box>
              </Paper>
            </Grid.Col>
            <Grid.Col span={8}>
              <Paper withBorder p="md" bg={NEUTRALS[1100]} h={"70vh"}>
                {activeTab === TABS.PROFILE_DETAILS ? (
                  <ProfileDetails />
                ) : activeTab === TABS.OTHER_SETTINGS ? (
                  <OtherSettings />
                ) : null}
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </Container>
    </>
  );
}
