// Exemplu de funcție pentru apel API
export async function fetchData(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('Eroare la preluarea datelor');
  return response.json();
}
