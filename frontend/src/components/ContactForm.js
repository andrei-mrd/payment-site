import React, { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  const [form, setForm] = useState({
    nume: '',
    prenume: '',
    telefon: '',
    mesaj: ''
  });
  const [pret, setPret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPret, setShowPret] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setShowPret(false);
  };

  const calculeazaPret = async () => {
    setLoading(true);
    setShowPret(false);
    try {
      const res = await fetch('http://localhost:5000/api/calculeaza-pret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesaj: form.mesaj })
      });
      const data = await res.json();
      setPret(data.pret);
      setShowPret(true);
    } catch {
      setPret(null);
      setShowPret(false);
    }
    setLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let pretFinal = pret;
    if (pret === null || !showPret) {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/calculeaza-pret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mesaj: form.mesaj })
        });
        const data = await res.json();
        pretFinal = data.pret;
        setPret(data.pret);
        setShowPret(true);
      } catch {
        pretFinal = null;
        setPret(null);
        setShowPret(false);
      }
      setLoading(false);
    }
    alert(`Formular trimis!${pretFinal !== null ? ' Prețul este: ' + pretFinal + ' lei' : ''}`);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>Nume
        <input type="text" name="nume" value={form.nume} onChange={handleChange} required />
      </label>
      <label>Prenume
        <input type="text" name="prenume" value={form.prenume} onChange={handleChange} required />
      </label>
      <label>Număr de telefon
        <input type="tel" name="telefon" value={form.telefon} onChange={handleChange} required pattern="[0-9+ ]{10,}" />
      </label>
      <label>Mesaj
        <textarea name="mesaj" value={form.mesaj} onChange={handleChange} required rows={5} />
      </label>
      <button type="button" onClick={calculeazaPret} style={{marginBottom:'0.7rem'}}>Calculează prețul</button>
      {loading && (
        <div style={{color:'#fff',marginTop:'-0.5rem',marginBottom:'0.5rem',fontWeight:'bold'}}>
          Se calculează prețul...
        </div>
      )}
      {showPret && !loading && pret !== null && (
        <div style={{color:'#fff',marginTop:'-0.5rem',marginBottom:'0.5rem',fontWeight:'bold'}}>
          Preț: {pret} lei
        </div>
      )}
      <button type="submit">Trimite</button>
    </form>
  );
}
