import React, { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Flex, Modal, Text } from "@mantine/core";
import useNetworkStatus from "../hooks/useNetworkStatus";
import wifiOffIcon from "../../assets/wifi_off.svg";
function NetworkStatusIndicator() {
  const [opened, { open, close }] = useDisclosure(false);
  const { isOnline } = useNetworkStatus();
  useEffect(() => {
    if (!isOnline) {
      open();
    } else {
      close();
    }
  }, [isOnline]);
  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      closeOnClickOutside={false}
      centered
    >
      <Flex
        direction={"column"}
        align={"center"}
        justify={"center"}
        gap={"md"}
        p={"sm"}
      >
        <wifiOffIcon alt="wifi off icon" style={{ height: "40px" }} />

        <Text size="xl" fw={"bold"}>
          No internet connection !
        </Text>
        <Text>Please check your network connection</Text>
      </Flex>
    </Modal>
  );
}
export default NetworkStatusIndicator;
