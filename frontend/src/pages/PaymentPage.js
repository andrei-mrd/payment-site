import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import './PaymentPage.css';
import { useNavigate, useLocation } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51RfHWL2KexBaBHroc5ABfxIycnqsFNwCzsALGbNFOtKplCFD0YCYRxKWlZaSQYa6KYQQ0MkUg2zNqYU3EJ19gM4M00dhoHdoee'); // Înlocuiește cu cheia ta publică Stripe

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [nume, setNume] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const suma = location.state && location.state.pret !== undefined ? location.state.pret : '-';
  const email = location.state && location.state.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const response = await fetch('http://localhost:5000/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 100 })
    });
    const { clientSecret, error: backendError } = await response.json();
    if (backendError) {
      setError(backendError);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: nume,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      setSuccess(true);
      // Trimit email de confirmare
      if (email) {
        fetch('http://localhost:5000/api/send-success-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }).then(res => res.json()).then(data => {
          if (!data.success) {
            setError('Plata a fost efectuată, dar emailul nu a putut fi trimis.');
          }
        }).catch(() => {
          setError('Plata a fost efectuată, dar emailul nu a putut fi trimis.');
        });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{
        textAlign:'center',
        fontSize:'2.1rem',
        fontWeight:900,
        marginBottom:32,
        color:'#a100ff',
        border:'2.5px solid #a100ff',
        borderRadius:'18px',
        background:'#f3e6ff',
        padding:'18px 0',
        letterSpacing:'1px',
        boxShadow:'0 2px 12px 0 rgba(143,0,255,0.10)'
      }}>
        Suma de plată: {suma} lei
      </div>
      <form onSubmit={handleSubmit} className="payment-container">
        <h2>Plată cu cardul</h2>
        <div className="input-group">
          <label>Nume complet</label>
          <input type="text" value={nume} onChange={e => setNume(e.target.value)} required placeholder="Nume complet" />
        </div>
        <div className="input-group">
          <label>Număr card</label>
          <CardNumberElement className="stripe-input" options={{ showIcon: true }} />
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Data expirare</label>
            <CardExpiryElement className="stripe-input" />
          </div>
          <div className="input-group">
            <label>CVC</label>
            <CardCvcElement className="stripe-input" />
          </div>
        </div>
        <button type="submit" disabled={!stripe || loading} style={{ marginTop: 24, fontSize: '1.2rem', padding: '16px 0' }}>
          {loading ? 'Se procesează...' : `Plătește suma de ${suma} lei`}
        </button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>Plata a fost efectuată cu succes!</div>}
      </form>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <button type="button" className="back-landing-btn" onClick={() => navigate('/')}>Revenire la pagina principală</button>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <div className="App">
      <header className="App-header">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </header>
    </div>
  );
}
