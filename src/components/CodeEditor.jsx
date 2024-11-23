import { useRef, useState } from "react";
import { Box, HStack, VStack, Button } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import ProblemSelector from "./ProblemSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("java");
  const [selectedProblem, setSelectedProblem] = useState("1. Bogdan");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelectLanguage = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const onSelectProblem = (problem) => {
    setSelectedProblem(problem);
  };

  return (
    <Box>
      <HStack spacing={6} mb={6}>
        <LanguageSelector language={language} onSelect={onSelectLanguage} />
        <ProblemSelector problem={selectedProblem} onSelect={onSelectProblem} />
      </HStack>
      <Box w="100%" mb={4}>
        <Output editorRef={editorRef} language={language} />
      </Box>
      <HStack spacing={4}>
        <Box w="50%" height="75vh">
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="100%"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Box w="50%" height="75vh" className="pdf-container">
          <iframe src="/uilcs_district_2023_student_packet.pdf" width="100%" height="100%" />
        </Box>
      </HStack>
    </Box>
  );
};

export default CodeEditor;