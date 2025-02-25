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
    }, 50); // Adjust speed of typing animation
  };

  const fetchPoem = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyAmqV2g1Z8tGZF4dCEYV_-Kkt7y3GTbqgA");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);

      const text = result.response.candidates[0]?.content.parts[0]?.text || "No poem received.";
      typeText(text);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Left Side: Input and Button */}
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
