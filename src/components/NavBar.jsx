import React from "react";
import { Flex, Text, Container, ActionIcon, Popover } from "@mantine/core";
import Logo from "../../assets/logo.svg";
import HelpIcon from "../../assets/helpLogo.svg";
import SettingIcon from "../../assets/settingIcon.svg";
import { NEUTRALS } from "../shared/colors.const.jsx";
import { useNavigate } from "react-router-dom";
export default function NavBar() {
  const navigate = useNavigate();
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
              <ActionIcon
                variant="transparent"
                style={{ display: "flex", alignItems: "center" }}
              >
                <HelpIcon />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Text>
            </Popover.Dropdown>
          </Popover>
          <ActionIcon
            variant="transparent"
            style={{ display: "flex", alignItems: "center" }}
          >
            <SettingIcon
              onClick={() => {
                navigate("/settings");
              }}
            />
          </ActionIcon>
        </Flex>
      </Flex>
    </Container>
  );
}
