import React, { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  const [form, setForm] = useState({
    nume: '',
    prenume: '',
    telefon: '',
    mesaj: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Aici poți adăuga logica de trimitere
    alert('Formular trimis!');
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
      <button type="submit">Trimite</button>
    </form>
  );
}
