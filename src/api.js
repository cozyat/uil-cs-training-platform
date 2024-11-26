import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

/**
 * Executes code using the Piston API.
 * @param {string} language - The programming language (e.g., 'java').
 * @param {string} sourceCode - The source code to execute.
 * @param {string} [input=""] - Optional input to pass into the program.
 * @returns {Promise<object>} - The execution result.
 */
export const executeCode = async (language, sourceCode, input = "") => {
  try {
    const response = await API.post("/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
      stdin: input,
    });

    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw new Error(error.response?.data?.message || "Code execution failed.");
  }
};