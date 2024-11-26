import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import LanguageSelector from "./components/LanguageSelector";
import ProblemSelector from "./components/ProblemSelector";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("language-selector")).render(
  <LanguageSelector language="java" onSelect={() => { }} />
);

ReactDOM.createRoot(document.getElementById("problem-selector")).render(
  <ProblemSelector problem="1. Bogdan" onSelect={() => { }} />
);