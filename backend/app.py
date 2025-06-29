from flask import Flask, request, jsonify
from flask_cors import CORS
import stripe
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

PRET_PE_CARACTER = 0.5  # lei per caracter
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')  # Cheia trebuie să fie setată în .env sau ca variabilă de mediu

@app.route('/api/calculeaza-pret', methods=['POST'])
def calculeaza_pret():
    data = request.get_json()
    mesaj = data.get('mesaj', '')
    pret = len(mesaj) * PRET_PE_CARACTER
    return jsonify({'pret': round(pret, 2)})

@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment_intent():
    data = request.get_json()
    amount = data.get('amount')
    if not amount:
        return jsonify({'error': 'Amount is required'}), 400
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(float(amount) * 100),  # Stripe folosește cei mai mici subunități (ex: bani, nu lei)
            currency='ron',
            automatic_payment_methods={"enabled": True},
        )
        return jsonify({'clientSecret': intent['client_secret']})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
