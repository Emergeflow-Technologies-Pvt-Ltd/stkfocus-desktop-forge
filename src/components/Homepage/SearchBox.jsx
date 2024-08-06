import React from "react";
import {
  Paper,
  Group,
  Text,
  TextInput,
  Loader,
  ActionIcon,
  ScrollArea,
  Flex,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useHomePageContext } from "./HomePage.context.jsx";
import { NEUTRALS } from "../../shared/colors.const.jsx";
import { useLayoutContext } from "../Layout.context.jsx";

export default function SearchBox() {
  const { searchResults, searchTerm, setSearchTerm, isLoading, searchError } =
    useHomePageContext();

  const { addToWatchlist } = useLayoutContext();

  const handleSearch = (event) => {
    setSearchTerm(event.currentTarget.value);
  };

  return (
    <Flex direction="column" style={{ height: "100%" }}>
      <Text size="lg" weight={500} mb="xs">
        Search for stocks
      </Text>
      <TextInput
        placeholder="Search stocks..."
        value={searchTerm}
        onChange={handleSearch}
        mb="xs"
      />
      {isLoading ? (
        <Flex justify="center" align="center" style={{ flex: 1 }}>
          <Loader />
        </Flex>
      ) : (
        <ScrollArea style={{ flex: 1, maxHeight: "calc(100% - 80px)" }}>
          <Flex direction="column" gap="xs">
            {searchError && (
              <Text c="#ff0004" mb="xs">
                {searchError}
              </Text>
            )}
            {searchResults.map((stock, index) => (
              <Paper
                bg={NEUTRALS[1100]}
                key={index}
                withBorder
                p="md"
                style={{ width: "100%" }}
              >
                <Group position="apart" noWrap style={{ width: "100%" }}>
                  <Flex direction="column" style={{ minWidth: 0, flex: 1 }}>
                    <Text truncate>{stock["Company Name"]}</Text>
                    <Text color="dimmed" size="sm" truncate>
                      {stock.Symbol}
                    </Text>
                  </Flex>
                  <ActionIcon
                    variant="outline"
                    color="rgba(255, 255, 255, 1)"
                    size="sm"
                    radius="xl"
                    onClick={() => addToWatchlist(stock)}
                  >
                    <IconPlus size={14} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
            {searchResults.length === 0 && searchTerm && (
              <Text>No results found for "{searchTerm}"</Text>
            )}
          </Flex>
        </ScrollArea>
      )}
    </Flex>
  );
}
