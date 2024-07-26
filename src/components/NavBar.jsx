import React from "react";
import { Flex, UnstyledButton, Text, Container } from "@mantine/core";
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
        style={{ padding: "10px 20px" }}
      >
        <Flex align="center" gap="xs">
          <Logo alt="logo" style={{ width: "30px", height: "30px" }} />
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
          align="center"
          direction="row"
          gap="md"
          wrap="wrap"
        >
          <UnstyledButton style={{ display: "flex", alignItems: "center" }}>
            <HelpIcon />
          </UnstyledButton>
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