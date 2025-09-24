import { useState } from "react";

export default function Home() {
  const [latex, setLatex] = useState(`\\documentclass[a4paper,10pt]{article}
\\begin{document}
Hello, this is a test.
\\end{document}`);

  async function compile() {
    try {
      const res = await fetch("https://latexpdf-aevm.onrender.com/compile", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: latex,
      });

      if (!res.ok) throw new Error(await res.text());

      // Get PDF blob from backend
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger download automatically
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>📄 LaTeX → PDF Resume Generator</h1>
        <p style={styles.subheading}>
          Paste your LaTeX resume code below and generate a styled PDF directly
          with XeLaTeX.
        </p>

        <textarea
          rows={30}
          style={styles.textarea}
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
        />

        <button onClick={compile} style={styles.button}>
          Generate & Download PDF
        </button>
      </div>
      <footer style={styles.footer}>
        Built with ❤️ using Vercel + Render + XeLaTeX
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f9f9f9 0%, #e9ecef 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "system-ui, sans-serif",
    color: "#333",
  },
  container: {
    maxWidth: "960px",
    margin: "3rem auto",
    padding: "2rem",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    color: "#212529",
  },
  subheading: {
    fontSize: "1rem",
    marginBottom: "2rem",
    color: "#555",
  },
  textarea: {
    width: "100%",
    height: "60vh",
    fontFamily: "monospace",
    fontSize: "14px",
    padding: "1rem",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    resize: "vertical",
    background: "#fdfdfd",
    marginBottom: "1.5rem",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
  },
  button: {
    background: "linear-gradient(90deg, #007bff 0%, #0056b3 100%)",
    border: "none",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "0.75rem 2rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  footer: {
    textAlign: "center",
    padding: "1rem",
    fontSize: "0.9rem",
    color: "#777",
  },
};

// Add hover manually in global CSS or via CSS-in-JS library
styles.button[":hover"] = {
  transform: "scale(1.03)",
  boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
};
