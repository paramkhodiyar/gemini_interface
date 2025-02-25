import { useState, useEffect } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
export default function PoemBox() {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("Hello, User");
  const [loading, setLoading] = useState(false);

  const typeText = (text) => {
    setResponse(""); 
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setResponse((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15);
  };
  const fetchPoem = async () => {
    setLoading(true);
    setError("");
  
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const result = await model.generateContent(prompt);
      console.log("Full API Response:", result);
  
      if (!result?.response) {
        setError("Error: No valid response from Gemini API.");
        return;
      }
  
      const candidates = result.response.candidates;
      console.log("Candidates:", candidates);
  
      if (!candidates || candidates.length === 0) {
        setError("Error: No candidates received from Gemini API.");
        return;
      }
      const content = candidates[0]?.content;
      if (!content || !content.parts || content.parts.length === 0) {
        setError("Error: No valid content received.");
        return;
      }
  
      const text = content.parts[0]?.text || "No poem received.";
      console.log("Extracted Text:", text);
  
      typeText(text);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("API Call Failed:", err);
    } finally {
      setLoading(false);
    }
  };  
  return (
    <div className="container">
      <div className="left">
        <input 
          type="text" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder="Enter your prompt here"
          className="prompt-input"
        />
        <button onClick={fetchPoem} className="fetch-button" disabled={loading}>
          {loading ? "Generating..." : "Use Gemini"}
        </button>
      </div>
      <div className="right">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <p className="response-message">{response}</p>
        )}
      </div>
    </div>
  );
}
