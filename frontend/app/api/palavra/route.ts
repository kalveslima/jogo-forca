import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const caminho = path.join(
      process.cwd(),
      "dados",
      "palavras.txt"
    );

    const conteudo = await readFile(
      caminho,
      "utf-8"
    );

    const palavras = conteudo
      .split("\n")
      .map((linha) => linha.trim())
      .filter((linha) => linha.length > 0);

    const palavra =
      palavras[
        Math.floor(
          Math.random() * palavras.length
        )
      ];

    return NextResponse.json({
      palavra,
    });
  } catch (erro) {
    return NextResponse.json(
      {
        erro: "Erro ao ler palavras",
      },
      { status: 500 }
    );
  }
}