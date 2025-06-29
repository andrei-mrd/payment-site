from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PRET_PE_CARACTER = 0.5  # lei per caracter

@app.route('/api/calculeaza-pret', methods=['POST'])
def calculeaza_pret():
    data = request.get_json()
    mesaj = data.get('mesaj', '')
    pret = len(mesaj) * PRET_PE_CARACTER
    return jsonify({'pret': round(pret, 2)})

if __name__ == '__main__':
    app.run(debug=True)
