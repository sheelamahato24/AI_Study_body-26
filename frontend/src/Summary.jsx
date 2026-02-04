import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Summary.css";

function Summary() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getSummary = async () => {
    if (!topic || !level) {
      alert("Topic aur level select karo");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/summary", {
        topic,
        level,
      });

      setResult(res.data.summary);
    } catch (err) {
      console.error(err);
      alert("Summary generate nahi hui");
    } finally {
      setLoading(false);
    }
  };

  const goToQuiz = () => {
    navigate("/quize", { state: { topic, level } });
  };

  const goToFlashcard = () => {
    navigate("/flashcard", { state: { topic } }); // Pass topic here
  };

  return (
    <div className="container">
      <h1>What do you want to learn?</h1>

      <label>Topic</label>
      <input
        type="text"
        placeholder="e.g., JavaScript"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <label>Difficulty Level</label>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">Select your level</option>
        <option value="basic">Basic</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button onClick={getSummary} disabled={loading}>
        {loading ? "Loading..." : "📘 Get Summary"}
      </button>

      {result && (
        <div className="result">
          <h3>Summary:</h3>
          <pre>{result}</pre>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button onClick={goToQuiz}>📝 Quiz</button>
            <button onClick={goToFlashcard}>🗂️ Flashcard</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;
