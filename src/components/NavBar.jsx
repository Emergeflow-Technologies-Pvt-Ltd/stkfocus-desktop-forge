import React, { useState, useEffect } from "react";
import {
  Flex,
  UnstyledButton,
  Text,
  Container,
  Button,
  Popover,
} from "@mantine/core";
import Logo from "../../assets/logo.svg";
import HelpIcon from "../../assets/helpLogo.svg";
import SettingIcon from "../../assets/settingIcon.svg";
import { NEUTRALS } from "../shared/colors.const.jsx";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const [appVersion, setAppVersion] = useState("");

  useEffect(() => {
    const fetchAppVersion = async () => {
      try {
        const version = await window.electronAPI.getAppVersion();
        setAppVersion(version);
      } catch (error) {
        console.error("Failed to fetch app version:", error);
        setAppVersion("Unknown");
      }
    };

    fetchAppVersion();
  }, []);

  return (
    <Container fluid bg={NEUTRALS[900]}>
      <Flex
        justify="space-between"
        align="center"
        style={{ padding: "10px 2px" }}
      >
        <Flex align="center" gap="xs">
          <Logo alt="logo" style={{ width: "40px", height: "18px" }} />
          <Text
            style={{
              fontSize: "0.75rem",
              marginBottom: "0",
            }}
          >
            Stkfocus
          </Text>
        </Flex>
        <Flex
          minHeight={50}
          justify="flex-end"
          align="center"
          direction="row"
          gap="md"
          wrap="wrap"
        >
          <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
              <UnstyledButton style={{ display: "flex", alignItems: "center" }}>
                <HelpIcon />
              </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">App Version: {appVersion}</Text>
              <Text size="xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Text>
            </Popover.Dropdown>
          </Popover>
          <UnstyledButton style={{ display: "flex", alignItems: "center" }}>
            <SettingIcon
              onClick={() => {
                navigate("/settings");
              }}
            />
          </UnstyledButton>
        </Flex>
      </Flex>
    </Container>
  );
}
