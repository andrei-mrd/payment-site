import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactForm.css';

export default function ContactForm() {
  const [showPret, setShowPret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pret, setPret] = useState(null);
  const [form, setForm] = useState({
    nume: '',
    prenume: '',
    email: '',
    telefon: '',
    mesaj: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const calculeazaPret = async () => {
      if (!form.mesaj) {
        setPret(null);
        setShowPret(false);
        return;
      }
      setLoading(true);
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
    calculeazaPret();
  }, [form.mesaj]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    navigate('/plata', { state: { pret, email: form.email } });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} style={{ minHeight: 520, width: 480, maxWidth: '98vw' }}>
      <label>Nume
        <input type="text" name="nume" value={form.nume} onChange={handleChange} required />
      </label>
      <label>Prenume
        <input type="text" name="prenume" value={form.prenume} onChange={handleChange} required />
      </label>
      <label>Email
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>Număr de telefon
        <input type="tel" name="telefon" value={form.telefon} onChange={handleChange} required pattern="[0-9+ ]{10,}" />
      </label>
      <label>Mesaj
        <textarea name="mesaj" value={form.mesaj} onChange={handleChange} required rows={5} />
      </label>
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
