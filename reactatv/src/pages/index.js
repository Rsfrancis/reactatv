// pages/index.js
import { useState, useEffect } from "react";

const words = [
  "REACT", "JAVASCRIPT", "NODE", "NEXT", "COMPONENTE", "ESTADO", 
  "PROPS", "HOOK", "FUNCAO", "ARRAY", "OBJETO", "CSS", "HTML", 
  "TEMPLATE", "SERVIDOR", "CLIENTE", "PACOTE", "MODULO", "DOM", 
  "EVENTO", "FORMULARIO", "TEXTO", "BOTAO", "LISTA", "CONDICAO", 
  "LOOP", "VARIAVEL", "FUNCAO", "LOGICA", "DATA"
];

export default function Game() {
  const [word, setWord] = useState("");
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'lost'
  const maxAttempts = 6;

  useEffect(() => {
    startGame();
  }, []);

  function startGame() {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setCorrectLetters([]);
    setWrongLetters([]);
    setGameStatus("playing");
  }

  function handleGuess(letter) {
    if (gameStatus !== "playing") return;
    letter = letter.toUpperCase();
    if (correctLetters.includes(letter) || wrongLetters.includes(letter)) return;

    if (word.includes(letter)) {
      setCorrectLetters([...correctLetters, letter]);
      if (word.split("").every(l => [...correctLetters, letter].includes(l))) {
        setGameStatus("won");
      }
    } else {
      const newWrong = [...wrongLetters, letter];
      setWrongLetters(newWrong);
      if (newWrong.length >= maxAttempts) {
        setGameStatus("lost");
      }
    }
  }

  function renderWord() {
    return word.split("").map((letter, idx) => (
      <span key={idx} style={{marginRight: 8, fontSize: 24}}>
        {correctLetters.includes(letter) || gameStatus !== "playing" ? letter : "_"}
      </span>
    ));
  }

  return (
    <div style={{maxWidth:"600px", margin:"50px auto", textAlign:"center", fontFamily:"Arial"}}>
      <h1>Jogo da Forca</h1>

      <div style={{marginBottom: "20px"}}>
        {renderWord()}
      </div>

      <InputLetter onGuess={handleGuess} disabled={gameStatus !== "playing"} />

      <div>
        <h3>Letras erradas ({wrongLetters.length} / {maxAttempts}):</h3>
        <p>{wrongLetters.join(", ")}</p>
      </div>

      <GameStatus status={gameStatus} word={word} />

      <button onClick={startGame} style={{marginTop: "20px", padding: "10px 20px"}}>
        Reiniciar
      </button>
    </div>
  );
}

function InputLetter({ onGuess, disabled }) {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (input.length === 1 && /[a-zA-Z]/.test(input)) {
      onGuess(input);
      setInput("");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{marginBottom: "20px"}}>
      <input 
        type="text" 
        maxLength="1" 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        disabled={disabled}
        style={{fontSize: "20px", width: "40px", textAlign: "center"}}
        />
      <button type="submit" disabled={disabled || input.length === 0} style={{marginLeft: 10, padding: "5px 10px"}}>
        Enviar
      </button>
    </form>
  );
}

function GameStatus({ status, word }) {
  if (status === "won") return <h2>Parabéns! Você acertou a palavra: {word}</h2>;
  if (status === "lost") return <h2>Fim de jogo! A palavra era: {word}</h2>;
  return null;
}
