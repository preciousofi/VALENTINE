import { useEffect, useState } from "react";
import "./App.css";

const dateOptions = [
  {
    id: "dinner",
    emoji: "🍽️",
    title: "Dinner Date",
    description: "Good food, pretty ambience and just you and me. ❤️",
  },
  {
    id: "movie",
    emoji: "🎬",
    title: "Movie Date",
    description: "A movie, snacks and sitting beside you. 🥺",
  },
  {
    id: "beach",
    emoji: "🏖️",
    title: "Beach & Picnic",
    description: "Good food, the beach, sunset and just us. 🌅❤️",
  },
];

function FloatingHearts() {
  const hearts = ["❤️", "💕", "💗", "💖", "💘", "💓"];

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((heart, index) => (
        <span key={index} className={`heart heart-${index + 1}`}>
          {heart}
        </span>
      ))}
    </div>
  );
}

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      <span>✦</span>
      <span>✧</span>
      <span>✦</span>
      <span>✧</span>
      <span>✦</span>
    </div>
  );
}

function CuteBear({ mood = "happy" }) {
  return (
    <div className={`bear bear-${mood}`} aria-hidden="true">
      <div className="ear ear-left">🐻</div>
      <div className="ear ear-right">🐻</div>

      <div className="bear-face">
        <div className="bear-eyes">
          {mood === "shy" ? "◕‿◕" : mood === "sad" ? "ಥ﹏ಥ" : "◕ᴗ◕"}
        </div>

        <div className="bear-mouth">
          {mood === "shy" ? "♡" : mood === "sad" ? "︵" : "ᴗ"}
        </div>
      </div>

      <div className="bear-heart">❤️</div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("opening");
  const [selectedDate, setSelectedDate] = useState(null);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    document.body.className = `screen-${screen}`;
  }, [screen]);

  const startAudio = () => {
    if (audioStarted) return;

    const audio = document.getElementById("valentineMusic");

    if (audio) {
      audio
        .play()
        .then(() => setAudioStarted(true))
        .catch(() => {
          // Browser may block autoplay until another interaction.
        });
    }
  };

  const goTo = (nextScreen) => {
    startAudio();
    setScreen(nextScreen);
  };

  const sendResponse = async (answer, extra = {}) => {
    try {
      const result = await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer,
          ...extra,
        }),
      });
      const data = await result.json();

      console.log("API response:", data);
    } catch (error) {
      console.error("Email notification failed:", error);
    }
  };

  const handleYes = () => {
    goTo("yes");
    sendResponse("yes");
  };

  const handleNo = () => {
    goTo("no");
    sendResponse("no");
  };

  const chooseDate = (option) => {
    setSelectedDate(option);
    goTo("confirmed");

    sendResponse("date", {
      dateChoice: option.id,
    });
  };

  return (
    <main className="app">
      <audio id="valentineMusic" loop>
        <source src="/music/heaven-baby.mp3" type="audio/mpeg" />
      </audio>

      <FloatingHearts />
      <Sparkles />

      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <section className="valentine-card">
        {screen === "opening" && (
          <div className="screen">
            <CuteBear mood="shy" />

            <p className="eyebrow">A VERY IMPORTANT MESSAGE</p>

            <h1>
              Hey you...
              <br />
              👀❤️
            </h1>

            <p className="subtitle">
              I have a very important question to ask you...
            </p>

            <button onClick={() => goTo("beforeAsk")}>
              Okay, ask me ❤️
            </button>
          </div>
        )}

        {screen === "beforeAsk" && (
          <div className="screen">
            <CuteBear mood="happy" />

            <p className="eyebrow">WAIT... 🥺</p>

            <h1>But before I ask...</h1>

            <p className="subtitle">
              Let me tell you about the most beautiful girl in the whole wide
              world. 🥺❤️
            </p>

            <button onClick={() => goTo("mystery")}>
              Tell me about her 👀
            </button>
          </div>
        )}

        {screen === "mystery" && (
          <div className="screen">
            <CuteBear mood="shy" />

            <p className="eyebrow">HMMM... 👀</p>

            <h1>Do you know who that is? 👀</h1>

            <p className="subtitle">
              You don't?
              <br />
              But I'll tell you. ❤️
            </p>

            <button onClick={() => goTo("reveal")}>
              Who is she? 👀
            </button>
          </div>
        )}

        {screen === "reveal" && (
          <div className="screen reveal-screen">
            <div className="big-heart">❤️</div>

            <p className="eyebrow">HER NAME IS...</p>

            <h1 className="mercy-name">MERCY</h1>

            <p className="subtitle">
              The most beautiful girl in the whole wide world.
              <br />
              <br />
              The girl I met on Valentine’s Day. 🌹
            </p>

            <button onClick={() => goTo("story")}>Tell me more 🥺</button>
          </div>
        )}

        {screen === "story" && (
          <div className="screen">
            <div className="story-heart">🌹</div>

            <p className="eyebrow">A LITTLE STORY...</p>

            <h1>Funny thing about Valentine’s Day...</h1>

            <p className="story-text">
              Before I met you, it was just another day on the calendar.
              <br />
              <br />
              Then somehow, I met you on that exact day...
              <br />
              <br />
              And suddenly, Valentine’s Day had a completely different
              meaning. ❤️
              <br />
              <br />
              Because now whenever I think about that day, I think about you.
            </p>

            <button onClick={() => goTo("questionIntro")}>
              Okay... 🥺
            </button>
          </div>
        )}

        {screen === "questionIntro" && (
          <div className="screen">
            <CuteBear mood="shy" />

            <p className="eyebrow">ALRIGHT... 😭</p>

            <h1>Okay... enough talking. 😭❤️</h1>

            <p className="subtitle">
              I think it's finally time I ask you what I came here to ask.
            </p>

            <button onClick={() => goTo("question")}>
              Ask me ❤️
            </button>
          </div>
        )}

        {screen === "question" && (
          <div className="screen question-screen">
            <div className="question-heart">💌</div>

            <p className="eyebrow">SO, MERCY... ❤️</p>

            <h1>Would you like to go on a date with me on Valentine’s Day?</h1>

            <p className="subtitle">
              Just you and me.
              <br />
              Valentine’s Day. 🌹❤️
            </p>

            <div className="question-buttons">
              <button className="yes-button" onClick={handleYes}>
                YESSS ❤️
              </button>

              <button className="no-button" onClick={handleNo}>
                NO 🥺
              </button>
            </div>
          </div>
        )}

        {screen === "yes" && (
          <div className="screen celebration-screen">
            <div className="celebration">🎉</div>

            <p className="eyebrow">SHE SAID YES!!!</p>

            <h1>YOU SAID YES!!! 😭❤️</h1>

            <p className="subtitle">
              You have absolutely no idea how happy that just made me. 🥺
            </p>

            <div className="celebration-hearts">
              ❤️ 💕 💖 💗 💘
            </div>

            <button onClick={() => goTo("dateChoice")}>
              Now choose our date 👀❤️
            </button>
          </div>
        )}

        {screen === "dateChoice" && (
          <div className="screen date-choice-screen">
            <p className="eyebrow">ONE MORE THING... 👀</p>

            <h1>What kind of Valentine’s date would you like?</h1>

            <p className="subtitle">
              Valentine’s Day is already decided. ❤️
              <br />
              Now you choose what we do.
            </p>

            <div className="date-options">
              {dateOptions.map((option) => (
                <button
                  key={option.id}
                  className="date-option"
                  onClick={() => chooseDate(option)}
                >
                  <span className="date-emoji">{option.emoji}</span>

                  <span className="date-content">
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                  </span>

                  <span className="arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "confirmed" && selectedDate && (
          <div className="screen celebration-screen">
            <div className="big-heart">❤️</div>

            <p className="eyebrow">DATE CONFIRMED 💌</p>

            <h1>This is our date ❤️</h1>

            <div className="chosen-date">
              <span>{selectedDate.emoji}</span>
              <strong>{selectedDate.title}</strong>
            </div>

            <p className="subtitle">{selectedDate.description}</p>

            <button onClick={() => goTo("final")}>
              Continue ❤️
            </button>
          </div>
        )}

        {screen === "final" && selectedDate && (
          <div className="screen celebration-screen final-screen">
            <div className="celebration">🎉</div>

            <p className="eyebrow">OFFICIAL ANNOUNCEMENT 📢</p>

            <h1>IT’S A DATE!!! 😭❤️</h1>

            <p className="subtitle">
              You picked:
              <br />
              <strong>{selectedDate.title}</strong>
              <br />
              <br />
              Valentine’s Day is officially ours. 🥺❤️
              <br />
              <br />
              I’ll see you on our date, my love. ❤️
            </p>

            <div className="final-hearts">❤️ 💕 🌹 💕 ❤️</div>
          </div>
        )}

        {screen === "no" && (
          <div className="screen no-screen">
            <CuteBear mood="sad" />

            <p className="eyebrow">OH... 🥺</p>

            <h1>Okay... I understand. ❤️</h1>

            <p className="subtitle">
              No pressure.
              <br />
              I just wanted you to know I'd love to spend Valentine’s Day with
              you.
            </p>

            <button onClick={() => goTo("question")}>
              Let me think again 👀
            </button>
          </div>
        )}
      </section>

      <p className="bottom-text">made with ❤️ just for you</p>
    </main>
  );
}

export default App;