import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import './Flashcard.css'

const API_BASE = "http://localhost:5000";

function FlashCard() {
  const location = useLocation();
  const topic = location.state?.topic || "";
  const level = location.state?.level || "basic"; // ✅ level added (default basic)

  const [flashcards, setFlashcards] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (topic) {
      fetchFlashcards();
    }
  }, [topic, level]); // ✅ re-fetch if level changes

  async function fetchFlashcards() {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level }), // ✅ send level also
      });

      const data = await res.json();
      setFlashcards(data.flashcards || []);
    } catch (err) {
      console.error("Flashcards fetch error:", err);
      alert("Flashcards load nahi ho paaye");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>
        📚 Flashcards: {topic} ({level})
      </h2>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && flashcards.length === 0 && (
        <p style={{ textAlign: "center" }}>No flashcards found</p>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {flashcards.map((card, index) => (
          <div
            key={index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            style={{ height: "140px", cursor: "pointer", perspective: "1000px" }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                textAlign: "center",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                transform:
                  openIndex === index ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  background: "#f3f4f6",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
              >
                {card.title}
              </div>

              {/* Back */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  background: "#dbeafe",
                  borderRadius: "12px",
                  transform: "rotateY(180deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  padding: "16px",
                }}
              >
                {card.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlashCard;
