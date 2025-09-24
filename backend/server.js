import express from "express";
import cors from "cors";              // <-- add this
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app = express();

// allow requests from your Vercel domain
app.use(cors({
  origin: "https://latex-pdf.vercel.app"
}));

app.use(express.text({ limit: "2mb" }));

app.post("/compile", (req, res) => {
  const latexCode = req.body;
  const id = uuidv4();
  const dir = path.join("/tmp", id);
  fs.mkdirSync(dir);
  const texFile = path.join(dir, "doc.tex");
  fs.writeFileSync(texFile, latexCode);

  exec(
    `xelatex -no-shell-escape -interaction=nonstopmode -output-directory=${dir} ${texFile}`,
    (err, stdout, stderr) => {
      if (err) {
        return res.status(500).send("XeLaTeX compilation failed:\n" + stderr);
      }

      const pdfFile = path.join(dir, "doc.pdf");
      if (!fs.existsSync(pdfFile)) {
        return res.status(500).send("No PDF was generated.");
      }

      const pdf = fs.readFileSync(pdfFile);
      res.contentType("application/pdf").send(pdf);
    }
  );
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("XeLaTeX API running on " + port));
