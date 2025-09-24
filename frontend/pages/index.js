import { useState } from "react";

export default function Home() {
  const [latex, setLatex] = useState(
    "\\documentclass{article}\\begin{document}Hello from LaTeX on XeLaTeX!\\end{document}"
  );
  const [pdfUrl, setPdfUrl] = useState(null);

  async function compile() {
    try {
      const res = await fetch("https://latexpdf-aevm.onrender.com/compile", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: latex,
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>LaTeX → PDF (XeLaTeX via Render + Vercel)</h2>
      <textarea
        rows={1000}
        cols={200}
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
      />
      <br />
      <button onClick={compile}>Generate PDF</button>
      <div style={{ marginTop: "1rem" }}>
        {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" />}
      </div>
    </div>
  );
}
