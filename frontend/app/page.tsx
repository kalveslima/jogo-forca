"use client";

import { useState } from "react";

export default function Home() {
  const [palavra, setPalavra] = useState("");
  const [letrasUsadas, setLetrasUsadas] = useState<string[]>([]);

  async function novoJogo() {
    const resposta = await fetch(
      "http://localhost:5000/api/palavra"
    );

    const dados = await resposta.json();

    setPalavra(dados.palavra);
    setLetrasUsadas([]);
  }

  function tentarLetra(letra: string) {
    if (letrasUsadas.includes(letra)) {
      return;
    }

    setLetrasUsadas([...letrasUsadas, letra]);
  }

  const palavraOculta = palavra
    .split("")
    .map((letra) =>
      letrasUsadas.includes(letra)
        ? letra.toUpperCase()
        : "_"
    )
    .join(" ");

  const alfabeto = "abcdefghijklmnopqrstuvwxyz".split("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-4xl font-bold">
        Jogo da Forca
      </h1>

      <div className="text-5xl tracking-widest">
        {palavra ? palavraOculta : ""}
      </div>

      <button
        onClick={novoJogo}
        className="px-6 py-3 rounded bg-blue-600 text-white"
      >
        Novo Jogo
      </button>

      {palavra && (
        <div className="flex flex-wrap gap-2 max-w-xl justify-center">
          {alfabeto.map((letra) => (
            <button
              key={letra}
              onClick={() => tentarLetra(letra)}
              disabled={letrasUsadas.includes(letra)}
              className="
                w-10
                h-10
                border
                rounded
                hover:bg-gray-100
                disabled:bg-gray-300
                disabled:cursor-not-allowed
              "
            >
              {letra.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}