const { spawn } = require("child_process");

async function executeCode(req, res) {
    const { language, sourceCode, input } = req.body;

    if (language !== "java") {
        return res.status(400).json({ error: "Only Java is supported for now." });
    }

    const fs = require("fs");
    fs.writeFileSync("Main.java", sourceCode);

    const compile = spawn("javac", ["Main.java"]);
    compile.on("close", (code) => {
        if (code !== 0) {
            return res.status(400).json({ error: "Compilation failed." });
        }

        const run = spawn("java", ["Main"]);
        run.stdin.write(input);
        run.stdin.end();

        let output = "";
        let error = "";

        run.stdout.on("data", (data) => {
            output += data.toString();
        });

        run.stderr.on("data", (data) => {
            error += data.toString();
        });

        run.on("close", (code) => {
            if (code !== 0) {
                res.status(400).json({ error });
            } else {
                res.status(200).json({ output });
            }
        });
    });
}

module.exports = executeCode;