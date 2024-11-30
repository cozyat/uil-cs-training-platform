import { useRef, useState, useEffect } from "react";
import { Box, HStack, Button } from "@chakra-ui/react";
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

// Judging outputs for each problem
const problemOutputs = {
  "1. Bogdan": "-------------------------------------------------------------\n1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 3 3\n1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1\n-------------------------------------------------------------\nS M T W T F S S M T W T F S S M T W T F S S M T W T F S S M T\nU O U E H R A U O U E H R A U O U E H R A U O U E H R A U O U\nN N E D U I T N N E D U I T N N E D U I T N N E D U I T N N E\n-------------------------------------------------------------\nN N A B A B N N A B A B A N N N B A B A N N B A B A B N N A B\no o o o o o o o o o o i\nD D D D D D D D D D D D D D D D D D D r\nC C a a a a C C a a a a a C C C a a a a C C a a a a a C C a t\nl l y y y y l l y y y y y l l l y y y y l l y y y y y l l y h\na a a a a a a a a a a d\ns s s s s s s s s s s a\ns s s s s s s s s s s y\n-------------------------------------------------------------",
  "2. Christine": "7 6 5 4 3\n3\n3 4 5 6 7 8 9 10 11 12\n12 13 14 15 16 17 18 19 20\n20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5",
  "3. George": "I've got a bad feeling about this.\nNever tell me the odds.\nI've got a bad feeling about this.\nNever tell me the odds.",
  "4. Hisoka": "9000.00 78374.10 87374.10\n15000.00 18346.73 33346.73\n296294.40 429983.64 726278.04",
  "5. Janice": "I WAS WONDERING IF AFTER ALL THESE YEARS YOUD LIKE TO MEET\nI AM YOUR FATHER\nTHE WORLD WAS GONNA ROLL ME\nGHIJKLMNOPQRSTUVWXYZ",
  "6. Krishna": "10\n35\n364\n46\n1375",
  "7. Liza": "HOMEWORK 1\nMonica Chan: 98\nAayush Targaryen: 96\nElsa Vu: 96\nMEAN SCORE: 80.55\nMEDIAN SCORE: 83.0\nEXAM - DIGITAL LOGIC\nSamantha Vu: 99\nTina Parker: 98\nDavid O'neal: 96\nMEAN SCORE: 80.87\nMEDIAN SCORE: 83.0\nMACHINE LEARNING PROJECT PRELIMINARY EVALUATION\nBobbi America: 100\nTina Davis: 90\nHunter Targaryen: 89\nMEAN SCORE: 78.06\nMEDIAN SCORE: 77.0",
  "8. Miguel": "Dgo\nAaacceeeee fg Hiiii Llnnoorrssssttt Tuuvxy\nAbcde1234-5678Fghijklmnopqrst\nc-E-I-n=Q^z\nAcce-Ikoop-Prrrssss",
  "9. Patrick": "31131211131221\n1117121411101318\n31131122211311123113321112131221123113111231121123222112\n5",
  "10. Shreya": "Dine and Dash.\nBusiness as usual.\nBusiness as usual.",
  "11. Sunil": "-35.00 56.00 24.00 -31.00 -7.00\n-4.40 7.20\n1.40\n=========================\n39.50 -29.33 -34.50\n10.33 2.33 -54.00 -3.67 15.67 -19.33\n-8.11\n=========================\n0.57 -15.00 -35.71 17.29 2.57 38.00 -30.00\n22.43 7.43 -12.86 44.43 -38.00 -9.57 -36.14\n-3.18\n=========================",
  "12. Vanessa": "4\n6\n5\n49\n0"
};

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("java");
  const [selectedProblem, setSelectedProblem] = useState("1. Bogdan");
  const [output, setOutput] = useState("");

  const [editorWidth, setEditorWidth] = useState(50);
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
    const savedCode = localStorage.getItem(`code-${selectedProblem}`);
    if (savedCode) {
      setValue(savedCode);
    } else {
      setValue(CODE_SNIPPETS[language]);
    }
  }, [selectedProblem]);

  useEffect(() => {
    if (value) {
      localStorage.setItem(`code-${selectedProblem}`, value);
    }
  }, [value, selectedProblem]);

  const handleRunCode = () => {
    if (language === "java") {
      setOutput("Code executed successfully!\nOutput:\n" + value);
    } else if (language === "python") {
      setOutput("Python code executed successfully!\nOutput:\n" + value);
    } else {
      setOutput("Unsupported language or execution error.");
    }
  };

  const handleLogOut = () => {
    localStorage.clear();
    setValue("");
    logout();
    window.location.href = "login.html";
  };

  if (!sessionStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
  }

  function logout() {
    sessionStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
  }

  return (
    <Box position="relative">
      {/* Language and Problem Selectors Positioned on the Left */}
      <Box
        position="relative"
        top="-25px"  // Moved up by adjusting the top value
        left="0"
        zIndex={10}
        p={4}
      >
        <HStack spacing={8}>
          <LanguageSelector language={language} onSelect={onSelectLanguage} />
          <ProblemSelector problem={selectedProblem} onSelect={onSelectProblem} />
        </HStack>
      </Box>

      {/* Dynamic positioning of the Log Out button */}
      <Button
        colorScheme="red"
        onClick={handleLogOut}
        position="absolute"
        top="0px"  // Moved up by adjusting the top value
        right="0"
        zIndex={10}
        mt={3}  // Optional, adjust for spacing
      >
        Log Out
      </Button>

      <HStack spacing={2} height="97.5vh" width="100%" justifyContent="flex-start">
        <Box
          width={{ base: "100%", md: `${editorWidth}%` }}
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
              height="50%"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
            <Box
              height="49.5%"
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
          width={{ base: "100%", md: `${100 - editorWidth}%` }}
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={0.001}
        >
          <Box w="auto" height="100%" mb={3}>
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