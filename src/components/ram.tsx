import { Badge, Box, Text, Flex, Grid, GridItem, HStack, Input, Heading, IconButton, ButtonGroup } from "@chakra-ui/react";
import { range } from "es-toolkit";
import { ScrollArea } from "@/components/customui/scroll-area";
import { useCallback, useEffect, useState } from "react";
import { SegmentedControl } from "./ui/segmented-control";
import { SYSVARS } from "@/zx81/sysvars";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface RamProps {
  bytes: Uint8Array;
}

interface RamRowProps {
  bytes: Uint8Array;
  startAddress: number;
  setHoverAddr: (addr: number) => void;
}

const toHex = (x: number, width = 2) => {
  return x.toString(16).padStart(width, "0");
};

const RamHeader = () => {
  return (
    <Flex gap={2}>
      <Box w="40px"></Box>
      {range(0, 16).map((x) => (
        <Box key={x}>{toHex(x, 2)}</Box>
      ))}
    </Flex>
  );
};

const RamRow = ({ bytes, startAddress, setHoverAddr }: RamRowProps) => {
  const cellColor = useCallback((addr: number) => {
    const dfileStart = (bytes[SYSVARS["D_FILE"].address + 1] << 8) | bytes[SYSVARS["D_FILE"].address];
    if (addr >= 0x4009 && addr < 0x407d)
      return {
        bg: { base: "green.700", _hover: "green.200" },
        color: { base: "white", _hover: "black" },
      };
    if (addr >= 0x407d && addr < dfileStart)
      return {
        bg: { base: "blue.700", _hover: "blue.200" },
        color: { base: "white", _hover: "black" },
      };
    if (addr >= dfileStart && addr < dfileStart + (1 + 24 * 33))
      return {
        bg: { base: "yellow.700", _hover: "yellow.200" },
        color: { base: "white", _hover: "black" },
      };
    return {
      bg: { base: "black", _hover: "gray.200" },
      color: { base: "gray.500", _hover: "black" },
    };
  }, []);
  return (
    <Flex gap={"4px"} mb={"0px"}>
      <Box w="40px">{toHex(startAddress, 4)}</Box>
      {range(startAddress, startAddress + 16).map((x) => (
        <Box key={"row" + x} {...cellColor(x)} px={"2px"} onMouseEnter={() => setHoverAddr(x)} onMouseLeave={() => setHoverAddr(-1)}>
          {toHex(bytes[x])}
        </Box>
      ))}
    </Flex>
  );
};

const NUMBYTES = 128 * 16;

export const Ram = ({ bytes }: RamProps) => {
  const [hoverAddr, setHoverAddr] = useState(-1);
  const [area, setArea] = useState<"RAM" | "ROM" | "STK" | "PC">("RAM");
  const [addrRange, setAddrRange] = useState<number[]>([0, 0]);

  useEffect(() => {
    setAddrRange(
      {
        ROM: [0, 0 + NUMBYTES],
        RAM: [0x4000, 0x4000 + NUMBYTES],
        STK: [bytes[SYSVARS["STKEND"].address], bytes[SYSVARS["STKBOT"].address]],
        PC: [0, 0],
      }[area]
    );
  }, [area, bytes]);

  return (
    <Flex fontFamily={"monospace"} gap="20px">
      <Flex direction={"column"}>
        <RamHeader></RamHeader>
        <ScrollArea height="700px" maxW="lg" pr="15px">
          {range(addrRange[0], Math.min(bytes.length, addrRange[1]), 16).map((x) => (
            <RamRow key={"header" + x} bytes={bytes} startAddress={x} setHoverAddr={setHoverAddr}></RamRow>
          ))}
        </ScrollArea>
      </Flex>
      <Flex direction="column" gap={2}>
        <Heading size="sm" color="teal.600">
          Address Range:
        </Heading>
        <Box>
          <SegmentedControl
            items={["ROM", "RAM", "STK", "PC"]}
            value={area}
            onValueChange={(e) => setArea(e.value ? (e.value as "RAM" | "ROM" | "STK" | "PC") : "RAM")}
            size="xs"></SegmentedControl>
        </Box>
        <HStack>
          <Text w={35} textAlign={"right"}>
            From
          </Text>
          <Input
            value={addrRange[0]}
            onChange={(e) => setAddrRange((prev) => [parseInt(e.currentTarget.value), prev[1]])}
            size="xs"
            width="60px"></Input>
          <Input
            value={addrRange[0].toString(16)}
            onChange={(e) => setAddrRange((prev) => [parseInt(e.currentTarget.value, 16), prev[1]])}
            size="xs"
            width="60px"></Input>
          <ButtonGroup size="2xs" variant="outline" attached>
            <IconButton onClick={() => setAddrRange((prev) => [prev[0] - 128 * 16, prev[1]])}>
              <MdChevronLeft />
            </IconButton>
            <IconButton onClick={() => setAddrRange((prev) => [prev[0] + 128 * 16, prev[1]])}>
              <MdChevronRight />
            </IconButton>
          </ButtonGroup>
        </HStack>
        <HStack>
          <Text w={35} textAlign={"right"}>
            To
          </Text>
          <Input
            value={addrRange[1]}
            onChange={(e) => setAddrRange((prev) => [prev[0], parseInt(e.currentTarget.value)])}
            size="xs"
            width="60px"></Input>
          <Input
            value={addrRange[1].toString(16)}
            onChange={(e) => setAddrRange((prev) => [prev[0], parseInt(e.currentTarget.value, 16)])}
            size="xs"
            width="60px"></Input>
          <ButtonGroup size="2xs" variant="outline" attached>
            <IconButton onClick={() => setAddrRange((prev) => [prev[0], prev[1] - 128 * 16])}>
              <MdChevronLeft />
            </IconButton>
            <IconButton onClick={() => setAddrRange((prev) => [prev[0], prev[1] + 128 * 16])}>
              <MdChevronRight />
            </IconButton>
          </ButtonGroup>
        </HStack>
        <Heading size="sm" color="teal.600">
          Selected Byte:
        </Heading>
        <Grid gridTemplateColumns="40px auto auto auto" gapX={3} gapY={1} alignItems={"center"}>
          <GridItem></GridItem>
          <GridItem textAlign={"right"}>Hex</GridItem>
          <GridItem textAlign={"right"}>Dec</GridItem>
          <GridItem textAlign={"right"}>Chr$</GridItem>

          <GridItem textAlign={"right"}>Addr:</GridItem>
          <GridItem>
            <Badge w="50px" colorPalette="green">
              <Text w="100%" textAlign={"right"}>
                {hoverAddr != -1 ? hoverAddr.toString(16) : "?"}
              </Text>
            </Badge>
          </GridItem>
          <GridItem>
            <Badge w="50px" colorPalette="green">
              <Text w="100%" textAlign={"right"}>
                {hoverAddr != -1 ? hoverAddr : "?"}
              </Text>
            </Badge>
          </GridItem>
          <GridItem></GridItem>

          <GridItem textAlign={"right"}>Val:</GridItem>
          <GridItem>
            <Badge w="50px" colorPalette="green">
              <Text w="100%" textAlign={"right"}>
                {hoverAddr != -1 ? bytes[hoverAddr].toString(16) : "?"}
              </Text>
            </Badge>
          </GridItem>
          <GridItem>
            <Badge w="50px" colorPalette="green">
              <Text w="100%" textAlign={"right"}>
                {hoverAddr != -1 ? bytes[hoverAddr] : "?"}
              </Text>
            </Badge>
          </GridItem>
          <GridItem>
            <Badge w="50px" colorPalette="green">
              <Text w="100%" textAlign={"right"}>
                {hoverAddr != -1 ? String.fromCharCode(bytes[hoverAddr]) : "?"}
              </Text>
            </Badge>
          </GridItem>
        </Grid>
      </Flex>
    </Flex>
  );
};
