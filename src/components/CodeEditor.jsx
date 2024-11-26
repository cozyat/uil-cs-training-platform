import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import ProblemSelector from "./ProblemSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";

// Pre-determined inputs for each problem
const problemInputs = {
  "1. Bogdan": "",
  "2. Christine": "7\n3\n3\n12\n20\n5",
  "3. George": "4\n10 15 175\n10 15 100\n10 10 101\n10 10 100",
  "4. Hisoka": "3\n25.00 12.0 30\n50.00 5.75 25\n1234.56 7.99 20",
  "5. Janice": "4\nHELLO ITS ME\nDAHHK EPO IA\nE SWO SKJZANEJC EB WBPAN WHH PDAOA UAWNO UKQZ HEGA PK IAAP\nLUKE",
  "6. Krishna": "5\n1 3\n1 5\n1 12\n4 6\n10 20",
  "7. Liza": "3\nHOMEWORK 1\n20\nWashington,Bobbi,85\nPetrovic,James,84\nGeorge,Rahul,64\nGates,Charles,79\nDavis,Jack,65\nHatley,Aayush,92\nWashington,Monica,89\nTargaryen,Aayush,96\nBryant,Angela,70\nChan,Monica,98\nJames,Benjamin,84\nKetchum,Lebron,86\nJefferson,Angela,68\nJefferson,Cameron,82\nHatley,Samantha,64\nVu,Elsa,96\nParker,Benjamin,93\nPetrovic,Phyllis,70\nAdams,Henry,73\nLee,Monica,73\nEXAM - DIGITAL LOGIC\n15\nGeorge,Bobbi,83\nAnderson,Lebron,94\nFranklin,Leia,87\nJames,Hunter,66\nParker,Tina,98\nAdams,David,64\nO'neal,Angela,74\nPetrovic,Samantha,75\nO'neal,David,96\nO'neal,Monica,61\nVu,Samantha,99\nDavis,Hunter,68\nLee,Samantha,86\nDavis,Samantha,77\nGates,Henry,85\nMACHINE LEARNING PROJECT PRELIMINARY EVALUATION\n16\nGalo,Cameron,88\nO'reilly,Shaquille,88\nAnderson,Benjamin,63\nGates,Elsa,76\nGates,Phyllis,63\nBryant,Hunter,70\nJohnson,Tina,70\nVu,Tristan,62\nTargaryen,Hunter,89\nVu,Leia,77\nStroud,Phyllis,77\nAmerica,Bobbi,100\nAmerica,Hunter,67\nHatley,Angela,82\nFranklin,Jack,8",
  "8. Miguel": "5\nDog\nUniversity of Texas Interscholastic League\nLmnop1234-5678Qrstabcdefghijk\nz-C-N-e=I^q\nRock-Paper-Scissors",
  "9. Patrick": "1 9\n7440888 3\n2 13\n5 1",
  "10. Shreya": "3\n2 3 5\n6\n2 3 3 5\n6\n4 5 6 7\n15",
  "11. Sunil": "3\n5 2\n11 -81\n26 86\n71 -23\n-68 6\n-62 48\n3 6\n40 90 -42 21 97 31\n21 -28 -84 67 -85 -67\n-30 -55 -36 -99 35 -22\n7 7\n38 26 -87 76 -29 -34 14\n95 35 31 0 -71 -96 -99\n-37 -70 -97 -39 56 -36 -27\n53 -5 36 4 -36 97 -28\n-14 31 17 78 -86 21 -29\n16 98 99 93 -19 22 -43\n6 -63 -89 99 -81 -41 -41",
  "12. Vanessa": "5\n1,2,3\n4\n--------------------\n1,2,3,5\n5\n--------------------\n2,5,3,6\n10\n--------------------\n1,2,3,4,5,10\n12\n--------------------\n2,4,6,8\n7\n--------------------"
};

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("java");
  const [selectedProblem, setSelectedProblem] = useState("1. Bogdan");

  const [editorWidth, setEditorWidth] = useState(50);  // Start with 50% width for the editor
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

  const handleMouseDown = (e) => {
    setDragging(true);
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth >= 30 && newWidth <= 70) {
      setEditorWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.cursor = "auto";
  };

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
      <HStack spacing={4} mb={6}>
        <LanguageSelector language={language} onSelect={onSelectLanguage} />
        <ProblemSelector problem={selectedProblem} onSelect={onSelectProblem} />
      </HStack>

      <HStack spacing={2} height="97.5vh" width="100%" justifyContent="flex-start">
        <Box
          width={{ base: "100%", md: `${editorWidth}%` }}  // Adjust for smaller screens
          height="100%"
          position="relative"
          borderRight="0px solid #ccc"
        >
          <Box height="100%" display="flex" flexDirection="column" justifyContent="space-between">
            <Editor
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              height="50%" // Adjust to fit editor
              theme="vs-dark"
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
            <Box
              height="49.5%" // Terminal occupies the bottom part
              bg="gray.800"
              color="white"
              p={0.01}
              fontFamily="monospace"
              overflow="auto"
            >
              <Output editorRef={editorRef} language={language} userInput={problemInputs[selectedProblem]} />
            </Box>
          </Box>
        </Box>

        <Box
          width={{ base: "100%", md: `${100 - editorWidth}%` }}  // Adjust for smaller screens
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={0.001}
        >
          <Box w="auto" height="170%" mb={3}>
            <iframe src="/uilcs_district_2023_student_packet.pdf" width="100%" height="100%" />
          </Box>

          <Box w="100%" height="30%" />
        </Box>
      </HStack>

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