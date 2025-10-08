import { ScrollArea as ChakraScrollArea } from "@chakra-ui/react";
import * as React from "react";

export const ScrollArea = React.forwardRef<HTMLDivElement, ChakraScrollArea.RootProps>(function ScrollArea(props, ref) {
  const { children, ...rest } = props;
  return (
    <ChakraScrollArea.Root ref={ref} {...rest}>
      <ChakraScrollArea.Viewport>
        <ChakraScrollArea.Content>{children}</ChakraScrollArea.Content>
      </ChakraScrollArea.Viewport>
      <ChakraScrollArea.Scrollbar>
        <ChakraScrollArea.Thumb />
      </ChakraScrollArea.Scrollbar>
      <ChakraScrollArea.Corner />
    </ChakraScrollArea.Root>
  );
});
