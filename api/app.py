from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

def carregar_palavras():

    with open(
        "dados/palavras.txt",
        "r",
        encoding="utf-8"
    ) as arquivo:

        return [
            linha.strip().lower()
            for linha in arquivo
            if linha.strip()
        ]

@app.route("/api/palavra")
def palavra():

    palavra_sorteada = random.choice(
        carregar_palavras()
    )

    return jsonify({
        "palavra": palavra_sorteada
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)