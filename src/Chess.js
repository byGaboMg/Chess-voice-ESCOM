import React, { useState, useEffect, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./Chess.css"; // Archivo CSS para estilos del tablero

const initialPieces = [
  { piece: "♖", color: "white", position: [0, 0] },
  { piece: "♘", color: "white", position: [0, 1] },
  { piece: "♗", color: "white", position: [0, 2] },
  { piece: "♕", color: "white", position: [0, 3] },
  { piece: "♔", color: "white", position: [0, 4] },
  { piece: "♗", color: "white", position: [0, 5] },
  { piece: "♘", color: "white", position: [0, 6] },
  { piece: "♖", color: "white", position: [0, 7] },
  { piece: "♙", color: "white", position: [1, 0] },
  { piece: "♙", color: "white", position: [1, 1] },
  { piece: "♙", color: "white", position: [1, 2] },
  { piece: "♙", color: "white", position: [1, 3] },
  { piece: "♙", color: "white", position: [1, 4] },
  { piece: "♙", color: "white", position: [1, 5] },
  { piece: "♙", color: "white", position: [1, 6] },
  { piece: "♙", color: "white", position: [1, 7] },
  { piece: "♜", color: "black", position: [7, 0] },
  { piece: "♞", color: "black", position: [7, 1] },
  { piece: "♝", color: "black", position: [7, 2] },
  { piece: "♛", color: "black", position: [7, 3] },
  { piece: "♚", color: "black", position: [7, 4] },
  { piece: "♝", color: "black", position: [7, 5] },
  { piece: "♞", color: "black", position: [7, 6] },
  { piece: "♜", color: "black", position: [7, 7] },
  { piece: "♟", color: "black", position: [6, 0] },
  { piece: "♟", color: "black", position: [6, 1] },
  { piece: "♟", color: "black", position: [6, 2] },
  { piece: "♟", color: "black", position: [6, 3] },
  { piece: "♟", color: "black", position: [6, 4] },
  { piece: "♟", color: "black", position: [6, 5] },
  { piece: "♟", color: "black", position: [6, 6] },
  { piece: "♟", color: "black", position: [6, 7] },
];

const Board = () => {
  const [pieces, setPieces] = useState(initialPieces);
  const [recognizedText, setRecognizedText] = useState("");

  const movePiece = (piece, toPosition) => {
    setPieces((prev) =>
      prev.map((p) => (p === piece ? { ...p, position: toPosition } : p))
    );
  };

  const parseChessNotation = (notation) => {
    const col = notation.charCodeAt(0) - 65; // 'A' -> 0
    const row = 8 - parseInt(notation[1], 10); // '8' -> 0
    return [row, col];
  };

  const getUnicodePiece = (name) => {
    const pieceMap = {
      peón: "♙",
      torre: "♖",
      caballo: "♘",
      alfil: "♗",
      reina: "♕",
      rey: "♔",
    };
    return pieceMap[name.toLowerCase()];
  };

  const isValidMove = (piece, from, to) => {
    // Agregar reglas específicas para cada tipo de pieza
    return true; // Por ahora, permitimos todos los movimientos
  };

  const interpretVoiceCommand = useCallback(
    (command) => {
      setRecognizedText(command); // Actualiza el texto reconocido

      // Elimina cualquier espacio extra y asegura que las coordenadas estén en formato correcto (sin espacios)
      const cleanedCommand = command.replace(/\s+/g, "").toUpperCase(); // Elimina espacios y convierte a mayúsculas

      console.log("Comando reconocido limpio:", cleanedCommand); // Imprime el comando limpio para depuración

      // Ajustamos el regex para permitir que no haya espacios entre la pieza y las coordenadas
      const regex = /mover(\w+)de([A-H][1-8])a([A-H][1-8])/i;
      const match = cleanedCommand.match(regex);

      if (!match) {
        console.log("No se pudo reconocer el comando de movimiento."); // Imprime un mensaje si no hay coincidencia
        return;
      }

      const [, pieceName, from, to] = match;
      const fromPosition = parseChessNotation(from);
      const toPosition = parseChessNotation(to);

      console.log(`Comando válido: Mover ${pieceName} de ${from} a ${to}`); // Mensaje de depuración

      const piece = pieces.find(
        (p) =>
          p.piece === getUnicodePiece(pieceName) &&
          p.position[0] === fromPosition[0] &&
          p.position[1] === fromPosition[1]
      );

      if (piece && isValidMove(piece, fromPosition, toPosition)) {
        movePiece(piece, toPosition);
        console.log("Movimiento válido y pieza movida");
      } else {
        console.log("Movimiento inválido o pieza no encontrada");
      }
    },
    [pieces]
  );

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition API no soportada en este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      for (const result of event.results) {
        interpretVoiceCommand(result[0].transcript);
      }
    };

    recognition.start();
    return () => recognition.stop();
  }, [interpretVoiceCommand]);

  const squares = Array(8)
    .fill(null)
    .map((_, row) =>
      Array(8)
        .fill(null)
        .map((_, col) => ({ row, col }))
    );

  return (
    <>
      <div className="voice-display">
        <strong>Texto reconocido:</strong> {recognizedText}
      </div>
      <div className="board">
        {squares.map((row, rowIndex) =>
          row.map((square, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              pieces={pieces}
              movePiece={movePiece}
            />
          ))
        )}
      </div>
    </>
  );
};

const Square = ({ row, col, pieces, movePiece }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PIECE",
    drop: (item) => movePiece(item.piece, [row, col]),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const isBlack = (row + col) % 2 === 1;

  const piece = pieces.find(
    (p) => p.position[0] === row && p.position[1] === col
  );

  return (
    <div
      ref={drop}
      className={`square ${isBlack ? "black" : "white"} ${
        isOver ? "highlight" : ""
      }`}
    >
      {piece && <Piece piece={piece} />}
    </div>
  );
};

const Piece = ({ piece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PIECE",
    item: { piece },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="piece"
      style={{
        opacity: isDragging ? 0.5 : 1,
        color: piece.color === "white" ? "#fff" : "#000",
      }}
    >
      {piece.piece}
    </div>
  );
};

const ChessApp = () => (
  <DndProvider backend={HTML5Backend}>
    <Board />
  </DndProvider>
);

export default ChessApp;
