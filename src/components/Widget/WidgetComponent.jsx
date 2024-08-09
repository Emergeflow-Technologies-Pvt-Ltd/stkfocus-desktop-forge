import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Title,
  Flex,
  ScrollArea,
  ActionIcon,
  Loader,
  Popover,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconArrowBackUp,
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconPoint,
} from "@tabler/icons-react";
import { NEUTRALS, PRIMARY_COLORS } from "../../shared/colors.const.jsx";
import { WidgetContextProvider, useWidgetContext } from "./Widget.context.jsx";
import { useLayoutContext } from "../Layout.context.jsx";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Advertisement from "../../../assets/advertise.svg";
import Logo from "../../../assets/logo.svg";
import HelpIcon from "../../../assets/helpLogo.svg";
import moment from "moment";
import "./WidgetComponent.css";

//displays information about a stock
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
          ₹{item.price}
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

const WidgetComponentContainer = () => {
  const navigate = useNavigate();
  const { widgetStocks, appVersion } = useWidgetContext();
  const { watchlist } = useLayoutContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [niftyData, setNiftyData] = useState({});
  const [direction, setDirection] = useState("next");
  const [currentTime, setCurrentTime] = useState(moment());
  // fetches data from a local API endpoint and updates the niftyData
  const fetchNiftyData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/get_nifty_data");
      const data = await response.json();
      setNiftyData(data.niftyData);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchNiftyData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNiftyData();
    }, 15000);
    return () => clearTimeout(timer);
  }, [niftyData]);

  const goBack = () => {
    navigate("/home");
    window.electronAPI.createMainWindow();
  };

  //represents pages in carousel, will show stock data or nifty data according to pageIndex
  const renderPage = (pageIndex) => {
    return (
      <div
        className="carousel-page no-drag"
        style={{ flex: 1, overflow: "hidden" }}
      >
        <Text size="md" align="left" mb="xs">
          {currentTime.format("HH:mm:ss a")}
        </Text>
        <ScrollArea style={{ height: "calc(100% - 20px)" }}>
          <Flex direction="column" gap="xs">
            {pageIndex === 0 ? (
              loading ? (
                <Flex
                  justify="center"
                  align="center"
                  style={{ height: "100%" }}
                >
                  <Loader color={PRIMARY_COLORS.blue_main} />
                </Flex>
              ) : (
                watchlist.map((stock) => (
                  <StockWidget key={stock.symbol} item={stock} />
                ))
              )
            ) : (
              <>
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
                      {niftyData.index}
                    </Text>
                  </Flex>
                  <Flex direction="column" align="flex-end">
                    <Text fw={900} size="xs" ta="right">
                      ₹{niftyData.last}
                    </Text>
                    <Flex align="center">
                      {niftyData.percentChange > 0 ? (
                        <IconArrowUpRight color="green" />
                      ) : (
                        <IconArrowDownRight color="red" />
                      )}
                      <Text fw={500} ta="right" size="xs">
                        {niftyData.percentChange}%
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Text align="center">Contact us at 7775544332</Text>
              </>
            )}
          </Flex>
        </ScrollArea>
      </div>
    );
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
        <Flex gap={"md"} align={"center"}>
          <Flex align="center" className="draggable">
            <Logo style={{ width: "35px", height: "12px" }} />
            <Title
              order={1}
              style={{ fontSize: "0.75rem", fontStyle: "italic" }}
            >
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
          <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon
                className="no-drag"
                variant="transparent"
                style={{ display: "flex", alignItems: "center" }}
              >
                <HelpIcon />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">App Version: {appVersion}</Text>
              <Text size="xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Text>
            </Popover.Dropdown>
          </Popover>
        </Flex>
        <Flex align={"center"}>
          <ActionIcon
            className="no-drag"
            variant="transparent"
            c={NEUTRALS[300]}
            onClick={() => {
              if (currentPage > 0) {
                setDirection("prev");
                setCurrentPage(currentPage - 1);
              }
            }}
          >
            <IconArrowNarrowLeft />
          </ActionIcon>
          <IconPoint fill={currentPage === 0 ? NEUTRALS[300] : null} />
          <IconPoint fill={currentPage === 1 ? NEUTRALS[300] : null} />
          <ActionIcon
            className="no-drag"
            variant="transparent"
            c={NEUTRALS[300]}
            onClick={() => {
              if (currentPage < 1) {
                setDirection("next");
                setCurrentPage(currentPage + 1);
              }
            }}
          >
            <IconArrowNarrowRight />
          </ActionIcon>
        </Flex>
      </Flex>

      <div
        className="carousel-container"
        style={{ flex: 1, overflow: "hidden" }}
      >
        <TransitionGroup className="carousel-inner">
          <CSSTransition
            key={currentPage}
            timeout={500}
            classNames={
              direction === "next" ? "carousel-next" : "carousel-prev"
            }
          >
            {renderPage(currentPage)}
          </CSSTransition>
        </TransitionGroup>
      </div>

      <Flex justify="center" mt="10px" className="draggable">
        <Advertisement style={{ alignItems: "center" }} />
      </Flex>
    </Flex>
  );
};

const WidgetComponent = () => {
  return (
    <WidgetContextProvider>
      <WidgetComponentContainer />
    </WidgetContextProvider>
  );
};

export default WidgetComponent;
