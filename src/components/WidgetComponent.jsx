import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Text,
  Title,
  Flex,
  Divider,
  ScrollArea,
  Button,
  Container,
} from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import { NEUTRALS } from "../shared/colors.const.jsx";
import {
  HomePageContextwithProvider,
  useHomePageContext,
} from "./Homepage/HomePage.context.jsx";
import { WidgetContextProvider, useWidgetContext } from "./Widget.context.jsx";
import Advertisement from "../../assets/advertise.svg";

const StockWidget = ({ item }) => {
  const pChange = parseFloat(item.pChange).toFixed(2);
  const isChangePositive = pChange > 0;

  return (
    <Flex
      shadow="md"
      bg={NEUTRALS[1100]}
      p="md"
      gap="xs"
      align="center"
      style={{
        flex: 1,
        border: `1px solid ${NEUTRALS[900]}`,
        borderRadius: "4px",
        marginBottom: "12px",
      }}
    >
      <Flex direction="column" style={{ flex: 1 }}>
        <Text fw={600}>{item.companyName}</Text>
        <Text c={NEUTRALS[600]} size="sm">
          {item.symbol} • {item.industry}
        </Text>
      </Flex>
      <Flex direction="column">
        <Text fw={500} size="xs" ta="right" c={NEUTRALS[500]}>
          WEEK HIGH: ₹{item.maxPrice}
        </Text>
        <Text fw={500} size="xs" ta="right" c={NEUTRALS[500]}>
          WEEK LOW: ₹{item.minPrice}
        </Text>
      </Flex>
      <Divider size="sm" orientation="vertical" />
      <Flex direction="column" align="flex-end">
        <Text fw={900} size="xl" ta="right">
          ₹{item.lastPrice}
        </Text>
        <Flex align="center">
          {isChangePositive ? (
            <IconArrowUpRight color="green" />
          ) : (
            <IconArrowDownRight color="red" />
          )}
          <Text fw={500} color={isChangePositive ? "green" : "red"} ta="right">
            {pChange}%
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

const WidgetContent = () => {
  const navigate = useNavigate();
  const { watchlist } = useHomePageContext();
  const { widgetStocks } = useWidgetContext();

  const goBack = () => {
    navigate("/home");
    window.electronAPI.createMainWindow();
  };

  return (
    <ScrollArea
      type="scroll"
      style={{
        flex: 1,
        maxHeight: "500px",
      }}
    >
      <Container
        className="draggable"
        fluid
        style={{
          padding: "20px",
          backgroundColor: NEUTRALS[1100],
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          bg={NEUTRALS[1100]}
          withBorder
          py="sm"
          pl="sm"
          pr="xs"
          mt="sm"
          style={{
            flex: 1, // Take available space
            display: "flex",
            flexDirection: "column",
            maxWidth: "400px",
            margin: "auto",
          }}
        >
          <Flex direction={"column"} rowGap={34} gap="xs">
            <Title
              order={1}
              style={{ fontSize: "1.5rem", fontStyle: "italic" }}
            >
              Stkfocus
            </Title>

            <Button className="no-drag" onClick={goBack} fullWidth>
              GO BACK
            </Button>

            <Flex direction={"column"} rowGap={12}>
              {widgetStocks.map((stock) => (
                <StockWidget key={stock.symbol} item={stock} />
              ))}
            </Flex>
          </Flex>
        </Paper>

        <Flex style={{ justifyContent: "center", marginTop: "20px" }}>
          <Advertisement
            style={{
              alignItems: "center",
            }}
          />
        </Flex>
      </Container>
    </ScrollArea>
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
