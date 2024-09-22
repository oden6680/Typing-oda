import React from "react";
import { Game } from "./Components/Game";
import { Box } from "@yamada-ui/layouts";

const App: React.FC = () => {
  return (
    <Box width="100%">
      <Game />
    </Box>
  );
};

export default App;
