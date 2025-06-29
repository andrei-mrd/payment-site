import React from 'react';
import ContactForm from '../components/ContactForm';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="landing-desc">Descoperă serviciile noastre moderne și bucură-te de o experiență digitală de excepție!</p>
        <ContactForm />
      </header>
    </div>
  );
}

export default LandingPage;
