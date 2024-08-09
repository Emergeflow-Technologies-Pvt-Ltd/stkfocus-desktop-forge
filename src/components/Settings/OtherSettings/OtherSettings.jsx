import { Flex, Text, Checkbox, Group } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { ReactComponent as InfoIcon } from "../../../../assets/info.svg";
const STOCK_MARKETS = {
  NSE: "NSE",
  BSE: "BSE",
};
function OtherSettings() {
  const [preferredStockMarket, setPreferredStockMarket] = useState([
    STOCK_MARKETS.NSE,
  ]);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  useEffect(() => {
    // Get the initial alwaysOnTop state when the component mounts
    window.electronAPI.getAlwaysOnTop().then(setAlwaysOnTop);
  }, []);
  const handleAlwaysOnTopChange = (event) => {
    const newValue = event.currentTarget.checked;
    setAlwaysOnTop(newValue);
    window.electronAPI.setAlwaysOnTop(newValue);
  };

  return (
    <Flex direction={"column"} gap={"2rem"}>
      {/* <Flex direction={'column'} gap={'10px'}>
        <Text>Market Preferences</Text>
        <Flex gap={'5px'} align={'center'}>
          <InfoIcon />
          <Text size="sm" c={'#738496'}>
            Choose your preferred stock market NSE, BSE, or both.
          </Text>
        </Flex>
        <Checkbox.Group
          value={preferredStockMarket}
          onChange={setPreferredStockMarket}
        >
          <Group>
            <Checkbox
              labelPosition="left"
              variant="outline"
              radius="xs"
              value={STOCK_MARKETS.NSE}
              label={STOCK_MARKETS.NSE}
            />
            <Checkbox
              labelPosition="left"
              variant="outline"
              radius="xs"
              value={STOCK_MARKETS.BSE}
              label={STOCK_MARKETS.BSE}
            />
          </Group>
        </Checkbox.Group>
      </Flex> */}
      <Flex direction={"column"} gap={"10px"}>
        <Text>Widget Configuration</Text>
        <Checkbox
          label="Always on top"
          labelPosition="left"
          variant="outline"
          radius="xs"
          checked={alwaysOnTop}
          onChange={handleAlwaysOnTopChange}
        />
      </Flex>
    </Flex>
  );
}
export default OtherSettings;
