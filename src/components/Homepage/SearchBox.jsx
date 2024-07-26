import React from "react";
import {
  Paper,
  Group,
  Stack,
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
export default function SearchBox() {
  const {
    searchResults,
    searchTerm,
    setSearchTerm,
    addToWatchlist,
    isLoading,
    searchError,
  } = useHomePageContext();

  const handleSearch = (event) => {
    setSearchTerm(event.currentTarget.value);
  };

  return (
    <Flex direction={"column"} rowGap={5}>
      <Text size="lg" weight={500} mb={5}>
        Search for stocks
      </Text>
      <TextInput
        placeholder="Search stocks..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollArea type="scroll" style={{ flex: 1, maxHeight: "500px" }}>
          <Flex direction={"column"} rowGap={5}>
            <Text c={"#ff0004"}>{searchError}</Text>
            {searchResults.map((stock, index) => (
              <Paper bg={NEUTRALS[1100]} key={index} withBorder p="md" mt="xs">
                <Group spacing="xs" position="apart" style={{ width: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <Text>{stock["Company Name"]}</Text>
                    <Text color="dimmed">{stock.Symbol}</Text>
                  </div>
                  <ActionIcon
                    variant="outline"
                    color="rgba(255, 255, 255, 1)"
                    size="xs"
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
