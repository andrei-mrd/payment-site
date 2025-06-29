from flask import Flask, request, jsonify
from flask_cors import CORS
import stripe
import os
from dotenv import load_dotenv
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)

load_dotenv()

# Configurare Flask-Mail
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])
mail = Mail(app)

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

@app.route('/api/send-success-email', methods=['POST'])
def send_success_email():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    try:
        msg = Message('Plata a fost realizată cu succes', recipients=[email])
        msg.body = 'Vă mulțumim pentru plata efectuată! Comanda dvs. a fost procesată cu succes.'
        mail.send(msg)
        return jsonify({'success': True})
    except Exception as e:
        print("Eroare la trimiterea emailului:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
