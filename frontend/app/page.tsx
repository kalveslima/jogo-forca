"use client";

import { useState } from "react";

function ForcaSVG({ erros }: { erros: number }) {
  return (
    <svg width="220" height="250" viewBox="0 0 220 250">
      <line x1="20" y1="230" x2="180" y2="230" stroke="black" strokeWidth="4" />
      <line x1="60" y1="230" x2="60" y2="20" stroke="black" strokeWidth="4" />
      <line x1="60" y1="20" x2="140" y2="20" stroke="black" strokeWidth="4" />
      <line x1="140" y1="20" x2="140" y2="50" stroke="black" strokeWidth="4" />

      {erros >= 1 && (
        <circle
          cx="140"
          cy="70"
          r="20"
          stroke="black"
          strokeWidth="4"
          fill="none"
        />
      )}
      {erros >= 2 && (
        <line
          x1="140"
          y1="90"
          x2="140"
          y2="150"
          stroke="black"
          strokeWidth="4"
        />
      )}

      {erros >= 3 && (
        <line
          x1="140"
          y1="110"
          x2="110"
          y2="130"
          stroke="black"
          strokeWidth="4"
        />
      )}

      {erros >= 4 && (
        <line
          x1="140"
          y1="110"
          x2="170"
          y2="130"
          stroke="black"
          strokeWidth="4"
        />
      )}

      {erros >= 5 && (
        <line
          x1="140"
          y1="150"
          x2="115"
          y2="190"
          stroke="black"
          strokeWidth="4"
        />
      )}

      {erros >= 6 && (
        <line
          x1="140"
          y1="150"
          x2="165"
          y2="190"
          stroke="black"
          strokeWidth="4"
        />
      )}
    </svg>
  );
}

export default function Home() {
  const [palavra, setPalavra] = useState("");
  const [letrasUsadas, setLetrasUsadas] = useState<string[]>([]);
  const [erros, setErros] = useState(0);

  async function novoJogo() {
    try {
      const resposta = await fetch(
        "/api/palavra"
      );

      const dados = await resposta.json();

      setPalavra(dados.palavra.toLowerCase());
      setLetrasUsadas([]);
      setErros(0);
    } catch (erro) {
      console.error("Erro ao buscar palavra:", erro);
    }
  }

  const venceu =
    palavra.length > 0 &&
    palavra
      .split("")
      .every((letra) =>
        letrasUsadas.includes(letra)
      );

  const perdeu = erros >= 6;

  function tentarLetra(letra: string) {
    if (
      letrasUsadas.includes(letra) ||
      venceu ||
      perdeu
    ) {
      return;
    }

    const novasLetras = [...letrasUsadas, letra];
    setLetrasUsadas(novasLetras);

    if (!palavra.includes(letra)) {
      setErros((valorAtual) => valorAtual + 1);
    }
  }

  const palavraOculta = palavra
    .split("")
    .map((letra) =>
      letrasUsadas.includes(letra)
        ? letra.toUpperCase()
        : "_"
    )
    .join(" ");

  const alfabeto =
    "abcdefghijklmnopqrstuvwxyz".split("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">

      <h1 className="text-4xl font-bold">
        Jogo da Forca
      </h1>

      <ForcaSVG erros={erros} />

      <div className="text-2xl">
        Erros: {erros}/6
      </div>

      <div className="text-5xl tracking-widest text-center">
        {palavra
          ? perdeu
            ? palavra.toUpperCase()
            : palavraOculta
          : ""}
      </div>

      {venceu && (
        <div className="text-green-600 text-2xl font-bold">
          🎉 Você venceu!
        </div>
      )}

      {perdeu && (
        <div className="text-red-600 text-2xl font-bold text-center">
          💀 Você perdeu!
          <br />
          Palavra: {palavra.toUpperCase()}
        </div>
      )}

      <button
        onClick={novoJogo}
        className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Novo Jogo
      </button>

      {palavra && (
        <div className="flex flex-wrap gap-2 max-w-xl justify-center">
          {alfabeto.map((letra) => {
            const foiUsada =
              letrasUsadas.includes(letra);

            const acertou =
              foiUsada &&
              palavra.includes(letra);

            const errou =
              foiUsada &&
              !palavra.includes(letra);

            return (
              <button
                key={letra}
                onClick={() =>
                  tentarLetra(letra)
                }
                disabled={
                  foiUsada ||
                  venceu ||
                  perdeu
                }
                className={`
                  w-10
                  h-10
                  border
                  rounded
                  font-bold
                  transition
                  ${
                    acertou
                      ? "bg-green-500 text-white"
                      : ""
                  }
                  ${
                    errou
                      ? "bg-red-500 text-white"
                      : ""
                  }
                  ${
                    !foiUsada
                      ? "hover:bg-gray-100"
                      : ""
                  }
                  disabled:cursor-not-allowed
                `}
              >
                {letra.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}