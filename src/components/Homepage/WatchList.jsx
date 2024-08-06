import React from "react";
import {
  Paper,
  Text,
  Title,
  Flex,
  Divider,
  ActionIcon,
  ScrollArea,
  Button,
  Loader,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconMinus,
} from "@tabler/icons-react";
import { NEUTRALS } from "../../shared/colors.const.jsx";
import { useHomePageContext } from "./HomePage.context.jsx";
import { useLayoutContext } from "../Layout.context.jsx";

export default function WatchList({ watchlist }) {
  const { error } = useHomePageContext();
  const { removeFromWatchlist, isLoadingWatchlist } = useLayoutContext();

  return (
    <Paper
      bg={NEUTRALS[1100]}
      withBorder
      py="sm"
      px="sm"
      mt="sm"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Flex direction="column" gap="xs">
        <Title order={1} style={{ fontSize: "1.5rem" }}>
          Watchlist
        </Title>
        <Text>List of stocks which will be shown in widget</Text>
        <Text c="#ff0004">{error}</Text>
      </Flex>

      <ScrollArea
        type="scroll"
        style={{
          flex: 1,
          maxHeight: "500px",
          marginTop: "1rem",
        }}
      >
        {isLoadingWatchlist ? (
          <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Loader />
          </Flex>
        ) : (
          <Flex direction="column" gap="md">
            {watchlist.map((item) => {
              const pChange = parseFloat(item.pChange).toFixed(2);
              const isChangePositive = pChange > 0;

              return (
                <Flex
                  key={item.symbol}
                  align="center"
                  gap="xs"
                  style={{ width: "100%" }}
                >
                  <Flex
                    shadow="md"
                    bg={NEUTRALS[1100]}
                    p="md"
                    gap="sm"
                    align="center"
                    style={{
                      border: `1px solid ${NEUTRALS[900]}`,
                      borderRadius: "4px",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={600} truncate>
                        {item.companyName}
                      </Text>
                      <Text c={NEUTRALS[600]} size="sm" truncate>
                        {item.symbol} • {item.industry}
                      </Text>
                    </Flex>
                    <Flex
                      direction="column"
                      style={{ minWidth: "fit-content" }}
                    >
                      <Text fw={500} size="xs" ta="right" c={NEUTRALS[500]}>
                        HIGH: ₹{item.maxPrice}
                      </Text>
                      <Text fw={500} size="xs" ta="right" c={NEUTRALS[500]}>
                        LOW: ₹{item.minPrice}
                      </Text>
                    </Flex>
                    <Divider size="sm" orientation="vertical" />
                    <Flex
                      direction="column"
                      align="flex-end"
                      style={{ minWidth: "fit-content" }}
                    >
                      <Text fw={900} size="md" ta="right">
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
                          size="sm"
                          color={isChangePositive ? "green" : "red"}
                          ta="right"
                        >
                          {pChange}%
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <ActionIcon
                    variant="outline"
                    color="#e50606"
                    size="sm"
                    radius="xl"
                    onClick={() => removeFromWatchlist(item.symbol)}
                  >
                    <IconMinus size={14} />
                  </ActionIcon>
                </Flex>
              );
            })}
          </Flex>
        )}
      </ScrollArea>
    </Paper>
  );
}
