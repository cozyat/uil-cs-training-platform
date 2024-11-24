import { useRef, useState, useEffect } from "react";
import { Box, HStack, Button } from "@chakra-ui/react";
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

  const [editorWidth, setEditorWidth] = useState(60); // Start with 60% width
  const [dragging, setDragging] = useState(false);

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

  // Mouse down event to start dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    document.body.style.cursor = "col-resize"; // Change cursor to resize
  };

  // Mouse move event to adjust editor width
  const handleMouseMove = (e) => {
    if (!dragging) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;
    // Limit the width between 30% and 70% to prevent extreme resizing
    if (newWidth >= 30 && newWidth <= 70) {
      setEditorWidth(newWidth);
    }
  };

  // Mouse up event to stop dragging
  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.cursor = "auto"; // Reset cursor
  };

  // Use requestAnimationFrame for smoother dragging
  useEffect(() => {
    const handleMouseMoveDebounced = (e) => {
      if (!dragging) return;

      requestAnimationFrame(() => {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth >= 30 && newWidth <= 70) {
          setEditorWidth(newWidth);
        }
      });
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMoveDebounced);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMoveDebounced);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMoveDebounced);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <Box>
      {/* Selectors at the top */}
      <HStack spacing={4} mb={6}>
        <LanguageSelector language={language} onSelect={onSelectLanguage} />
        <ProblemSelector problem={selectedProblem} onSelect={onSelectProblem} />
      </HStack>

      {/* Flexbox container for the editor and pdf/output sections with padding */}
      <HStack spacing={3} height="75vh" width="100%" justifyContent="flex-start">
        {/* Left section: Code editor */}
        <Box
          width={`${editorWidth}%`} // Dynamic width based on state
          height="100%"
          position="relative"
          borderRight="2px solid #ccc" // Border between sections
        >
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

        {/* Right section: PDF and Output */}
        <Box
          width={`${100 - editorWidth}%`} // Dynamic width based on editor width
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={4} // Added padding to create space
        >
          {/* PDF viewer */}
          <Box w="100%" height="50%" mb={3}>
            <iframe src="/uilcs_district_2023_student_packet.pdf" width="100%" height="100%" />
          </Box>

          {/* Output section */}
          <Box w="100%" height="50%">
            <Output editorRef={editorRef} language={language} />
          </Box>
        </Box>
      </HStack>

      {/* Draggable divider */}
      <Box
        width="10px"
        cursor="col-resize"
        backgroundColor="#ccc"
        height="100%"
        onMouseDown={handleMouseDown}
      />
    </Box>
  );
};

export default CodeEditor;