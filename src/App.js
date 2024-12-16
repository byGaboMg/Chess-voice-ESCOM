import "./App.css";
import ChessApp from "./Chess";
import newLogo from "./logocaballo.png";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <title>Chess-withVoice(beta)</title>
        <img src={newLogo} className="App-logo" alt="logo" />
        <h2>Chess-withVoice V1.2</h2>
        <span className="textosugerencia">
          Dí tu movimiento de la forma: Mover [pieza] de [casilla inicial] a
          [casilla final]
        </span>
        <p className="textosugerencia">
          Ejemplo: Mover CABALLO de B8 a B5 (de momento funciona únicamente con
          piezas blancas)
        </p>

        <ChessApp></ChessApp>
      </header>
      <footer className="App-footer">
        <p>Copyright ©All rights reserved xd</p>
      </footer>
    </div>
  );
}

export default App;
