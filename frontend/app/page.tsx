"use client";

import { useState } from "react";

export default function Home() {
  const [palavra, setPalavra] = useState("");
  const [letrasUsadas, setLetrasUsadas] = useState<string[]>([]);
  const [erros, setErros] = useState(0);

  async function novoJogo() {
    const resposta = await fetch(
      "http://localhost:5000/api/palavra"
    );

    const dados = await resposta.json();

    setPalavra(dados.palavra);
    setLetrasUsadas([]);
    setErros(0);
  }

  function tentarLetra(letra: string) {
    if (
      letrasUsadas.includes(letra) ||
      venceu ||
      perdeu
    ) {
      return;
    }

    setLetrasUsadas([...letrasUsadas, letra]);

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

  const venceu =
    palavra.length > 0 &&
    palavra
      .split("")
      .every((letra) =>
        letrasUsadas.includes(letra)
      );

  const perdeu = erros >= 6;

  const alfabeto =
    "abcdefghijklmnopqrstuvwxyz".split("");

  function desenharForca() {
    const partes = [
      "",
      "O",
      "O\n|",
      "O\n/|",
      "O\n/|\\",
      "O\n/|\\\n/",
      "O\n/|\\\n/ \\"
    ];

    return partes[erros];
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">

      <h1 className="text-4xl font-bold">
        Jogo da Forca
      </h1>

      <pre className="text-xl font-mono text-center">
{`
 +---+
 |   |
 ${desenharForca()}
     |
     |
=======
`}
      </pre>

      <div className="text-2xl">
        Erros: {erros}/6
      </div>

      <div className="text-5xl tracking-widest">
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
        <div className="text-red-600 text-2xl font-bold">
          💀 Você perdeu!
        </div>
      )}

      <button
        onClick={novoJogo}
        className="px-6 py-3 rounded bg-blue-600 text-white"
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