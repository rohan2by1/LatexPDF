import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app = express();

// ✅ Enable CORS for your Vercel frontend
app.use(cors({
  origin: ["http://localhost:3000", "https://latex-pdf.vercel.app"], // allow both dev & production
}));

// ✅ Parse raw LaTeX as plain text
app.use(express.text({ limit: "5mb" }));  // support larger docs

// ===== Compile Route =====
app.post("/compile", (req, res) => {
  const latexCode = req.body;
  const id = uuidv4();
  const dir = path.join("/tmp", id);
  fs.mkdirSync(dir, { recursive: true });

  const texFile = path.join(dir, "doc.tex");
  fs.writeFileSync(texFile, latexCode);

  // Run XeLaTeX
  exec(
    `xelatex -no-shell-escape -interaction=nonstopmode -output-directory=${dir} ${texFile}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error("❌ XeLaTeX compilation failed!");
        console.error("STDOUT:\n", stdout);
        console.error("STDERR:\n", stderr);

        return res.status(500).send(
          "XeLaTeX compilation failed:\n\n" + (stderr || stdout)
        );
      }

      const pdfFile = path.join(dir, "doc.pdf");
      if (!fs.existsSync(pdfFile)) {
        console.error("⚠️ No PDF generated. XeLaTeX output:\n", stdout);
        return res.status(500).send("No PDF was generated.");
      }

      console.log("✅ PDF generated successfully:", pdfFile);

      const pdf = fs.readFileSync(pdfFile);
      res.setHeader("Content-Type", "application/pdf");
      // Optional: force download
      res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
      res.send(pdf);
    }
  );
});

// ===== Start Server =====
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 XeLaTeX API running at http://localhost:${port}`);
});
