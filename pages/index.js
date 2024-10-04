import { useState, useEffect } from 'react';

export default function Home() {
  const [englishSentence, setEnglishSentence] = useState('');
  const [olchikiSentence, setOlchikiSentence] = useState('');

  useEffect(() => {
    // Fetch an English sentence from the server
    fetch('/api/get-sentence')
      .then((response) => response.json())
      .then((data) => {
        setEnglishSentence(data.sentence);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the translation to the server
    const res = await fetch('/api/submit-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        englishSentence,
        olchikiSentence,
      }),
    });

    if (res.ok) {
      // Clear the Olchiki input and load a new sentence
      setOlchikiSentence('');
      const data = await fetch('/api/get-sentence').then((res) => res.json());
      setEnglishSentence(data.sentence);
    }
  };

  if (!englishSentence) {
    return <div>No more sentences to translate!</div>;
  }

  return (
    <div>
      <h1>Translate English to Olchiki</h1>
      <div>
        <p>English Sentence: {englishSentence}</p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={olchikiSentence}
            onChange={(e) => setOlchikiSentence(e.target.value)}
            placeholder="Enter Olchiki translation here"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
