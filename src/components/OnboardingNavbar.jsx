import React from "react";
import { Flex, Text, Container } from "@mantine/core";
import Logo from "../../assets/logo.svg";
import { NEUTRALS } from "../shared/colors.const.jsx";

export default function OnboardingNavbar() {
  return (
    <Container fluid bg={NEUTRALS[900]}>
      <Flex align="center" style={{ padding: "10px 20px" }}>
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
      </Flex>
    </Container>
  );
}
