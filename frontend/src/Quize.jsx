import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Quize.css";

function Quize() {
  const [selectedTime, setSelectedTime] = useState(null);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { topic, level } = location.state || {};

  const options = [
    { time: 1, label: "Quick test" },
    { time: 3, label: "Standard" },
    { time: 5, label: "Relaxed" },
  ];

  // ✅ Updated handleStart
  const handleStart = async () => {
    if (!selectedTime) {
      alert("Please select time");
      return;
    }

    try {
      setLoading(true);

      // Topic aur level backend me bhej rahe hai
      const res = await axios.post("http://localhost:5000/api/quiz", {
        topic,
        level,
      });

      // AI response me questions array
      setQuestions(res.data.questions || []);
      setStarted(true);
      setCurrent(0);
    } catch (err) {
      console.error(err);
      alert("Quiz load nahi hua");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (value) => {
    setAnswers({ ...answers, [current]: value });
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setShowScore(true);
  };

  if (!started) {
    return (
      <div className="quiz-wrapper">
        <div className="back-icon" onClick={() => navigate(-1)}>←</div>
        <h1>Ready to test yourself?</h1>
        <p className="subtitle">
          Topic: <b>{topic}</b> | Level: <b>{level}</b>
        </p>

        <div className="options">
          {options.map((opt) => (
            <div
              key={opt.time}
              className={`option-card ${
                selectedTime === opt.time ? "active" : ""
              }`}
              onClick={() => setSelectedTime(opt.time)}
            >
              <h3>
                {opt.time} minute{opt.time > 1 && "s"}
              </h3>
              <span>{opt.label}</span>
            </div>
          ))}
        </div>

        <button className="start-btn" onClick={handleStart} disabled={loading}>
          {loading ? "Loading..." : "Start Quiz"}
        </button>
      </div>
    );
  }

  // Quiz started
  return (
    <div className="quiz-wrapper">
      <div className="back-icon" onClick={() => navigate(-1)}>←</div>

      {showScore ? (
        <div className="score-card">
          <h2>Quiz Completed!</h2>
          <p>Total Questions: {questions.length}</p>
          <p>Correct Answers: {score}</p>
          <p>Wrong Answers: {questions.length - score}</p>
          <p>
            Score Percentage: {((score / questions.length) * 100).toFixed(2)}%
          </p>
        </div>
      ) : (
        <div className="question-card">
          <p>
            <b>Q{current + 1} / {questions.length}</b>
          </p>
          <p>{questions[current].question}</p>

          {questions[current].options.map((opt, idx) => (
            <div key={idx}>
              <label>
                <input
                  type="radio"
                  name="option"
                  checked={answers[current] === opt}
                  onChange={() => handleOptionChange(opt)}
                />
                {opt}
              </label>
            </div>
          ))}

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button onClick={prevQuestion} disabled={current === 0}>Previous</button>
            {current < questions.length - 1 ? (
              <button onClick={nextQuestion}>Next</button>
            ) : (
              <button onClick={handleSubmit}>Submit</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Quize;
