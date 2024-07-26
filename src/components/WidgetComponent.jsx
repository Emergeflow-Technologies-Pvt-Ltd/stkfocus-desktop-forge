import React from "react";
import { useNavigate } from "react-router-dom";
import { Text, Title, Flex, ScrollArea, ActionIcon } from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconArrowBackUp,
} from "@tabler/icons-react";
import { NEUTRALS, PRIMARY_COLORS } from "../shared/colors.const.jsx";
import {
  HomePageContextwithProvider,
  useHomePageContext,
} from "./Homepage/HomePage.context.jsx";
import { WidgetContextProvider, useWidgetContext } from "./Widget.context.jsx";
import Advertisement from "../../assets/advertise.svg";
import Logo from "../../assets/logo.svg";

const StockWidget = ({ item }) => {
  const pChange = parseFloat(item.pChange).toFixed(2);
  const isChangePositive = pChange > 0;

  return (
    <Flex
      shadow="md"
      bg={NEUTRALS[1100]}
      p="5px"
      gap="xs"
      align="center"
      style={{
        flex: 1,
        border: `1px solid ${NEUTRALS[900]}`,
        borderRadius: "4px",
      }}
    >
      <Flex direction="column" style={{ flex: 1 }}>
        <Text fw={600} size="sm">
          {item.companyName}
        </Text>
        <Text c={NEUTRALS[600]} size="xs">
          {item.symbol} • {item.industry}
        </Text>
      </Flex>
      <Flex direction="column" align="flex-end">
        <Text fw={900} size="xs" ta="right">
          ₹{item.lastPrice}
        </Text>
        <Flex align="center">
          {isChangePositive ? (
            <IconArrowUpRight color="green" />
          ) : (
            <IconArrowDownRight color="red" />
          )}
          <Text
            fw={500}
            color={isChangePositive ? "green" : "red"}
            ta="right"
            size="xs"
          >
            {pChange}%
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

const WidgetContent = () => {
  const navigate = useNavigate();
  const { widgetStocks } = useWidgetContext();

  const goBack = () => {
    navigate("/home");
    window.electronAPI.createMainWindow();
  };

  return (
    <Flex
      className="draggable"
      direction="column"
      style={{
        height: "100vh",
        backgroundColor: NEUTRALS[1100],
        padding: "10px",
      }}
    >
      <Flex
        className="draggable"
        justify="space-between"
        align="center"
        mb="sm"
      >
        <Flex align="center" className="draggable">
          <Logo style={{ width: "35px", height: "12px" }} />
          <Title order={1} style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
            Stkfocus
          </Title>
        </Flex>
        <ActionIcon
          className="no-drag"
          variant="outline"
          c={PRIMARY_COLORS.blue_main}
          size="xs"
          radius="xl"
          onClick={goBack}
        >
          <IconArrowBackUp />
        </ActionIcon>
      </Flex>

      <div className="no-drag" style={{ flex: 1, overflow: "hidden" }}>
        <ScrollArea style={{ height: "100%" }}>
          <Flex direction="column" gap="xs">
            {widgetStocks.map((stock) => (
              <StockWidget key={stock.symbol} item={stock} />
            ))}
          </Flex>
        </ScrollArea>
      </div>

      <Flex justify="center" mt="10px" className="draggable">
        <Advertisement style={{ alignItems: "center" }} />
      </Flex>
    </Flex>
  );
};

const WidgetComponentContainer = () => (
  <WidgetContextProvider>
    <WidgetContent />
  </WidgetContextProvider>
);

const WidgetComponent = () => {
  return (
    <HomePageContextwithProvider>
      <WidgetComponentContainer />
    </HomePageContextwithProvider>
  );
};

export default WidgetComponent;
