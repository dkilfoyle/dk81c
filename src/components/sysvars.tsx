import { SYSVARS, type ISYSVAR } from "@/zx81/sysvars";
import { Button, Table } from "@chakra-ui/react";
import { useState } from "react";

interface SysVarsProps {
  bytes: Uint8Array;
}

export const SysVars = ({ bytes }: SysVarsProps) => {
  const [valFormat, setValFormat] = useState(10);
  const [addrFormat, setAddrFormat] = useState(10);
  const getValue = (sv: ISYSVAR) => {
    if (sv.size == 1) {
      return bytes[sv.address];
    }
    if (sv.size == 2) {
      return (bytes[sv.address + 1] << 8) | bytes[sv.address];
    }
    return 0;
  };
  return (
    <Table.ScrollArea height="700px">
      <Table.Root size="sm" stickyHeader interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>
              <Button onClick={() => setValFormat((prev) => (prev == 16 ? 10 : 16))} size="xs" variant="outline">
                Value
              </Button>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <Button onClick={() => setAddrFormat((prev) => (prev == 16 ? 10 : 16))} size="xs" variant="outline">
                Address
              </Button>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Size</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body color="GrayText">
          {Object.entries(SYSVARS).map((x) => (
            <Table.Row key={x[0]}>
              <Table.Cell>{x[0]}</Table.Cell>
              <Table.Cell textAlign={"right"}>{getValue(x[1])?.toString(valFormat)}</Table.Cell>
              <Table.Cell textAlign={"right"}>{x[1].address?.toString(addrFormat)}</Table.Cell>
              <Table.Cell textAlign={"right"}>{x[1].size}</Table.Cell>
              <Table.Cell fontSize={"xs"}>{x[1].desc}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};
