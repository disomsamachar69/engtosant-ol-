import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function Home() {
  const [englishSentence, setEnglishSentence] = useState('');
  const [olchikiSentence, setOlchikiSentence] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedSentence = localStorage.getItem('currentSentence');
    if (storedSentence) {
      setEnglishSentence(storedSentence);
    } else {
      fetchNextSentence();
    }
  }, []);

  const fetchNextSentence = async () => {
    const response = await fetch('/api/get-sentence');
    const data = await response.json();
    setEnglishSentence(data.sentence);
    localStorage.setItem('currentSentence', data.sentence);
    setOlchikiSentence('');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!olchikiSentence) {
      setErrorMessage('Please type in Olchiki.');
      return;
    }

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

    if (!res.ok) {
      const errorData = await res.json();
      setErrorMessage(errorData.message || 'An error occurred.');
      return;
    }

    setOlchikiSentence('');
    setErrorMessage('');
    fetchNextSentence();
  };

  const handleSkip = () => {
    setOlchikiSentence('');
    fetchNextSentence();
  };

  const handleOlchikiChange = (e) => {
    const olchikiRegex = /^[ᱚ-᱾\s]*$/;

    if (olchikiRegex.test(e.target.value) || e.target.value === '') {
      setOlchikiSentence(e.target.value);
      setErrorMessage('');
    } else {
      setErrorMessage('Please type only in Olchiki.');
    }
  };

  return (
    <>
      <Head>
        <title>Eng to Sant</title>
        <meta name="description" content="Translate English to Olchiki" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white relative">
        <div className="absolute top-4 right-4 space-x-2">
          <button
            onClick={() => router.push('/add-sentence')}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-200"
          >
            Add New Sentence
          </button>
        </div>

        <motion.h1
          className="text-4xl font-bold mb-4 text-gray-800 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Translate into Santali (Olchiki).
        </motion.h1>

        <motion.div
          className="bg-white p-10 rounded-lg w-full max-w-3xl" // Removed 'shadow-lg' here
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg mb-4 text-gray-700">
            English Sentence: <strong className="text-blue-600">{englishSentence}</strong>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <textarea
              value={olchikiSentence}
              onChange={handleOlchikiChange} // Changed onChange to handle Olchiki input
              placeholder="Enter Olchiki translation here"
              className="border border-gray-300 rounded-lg p-3 mb-4 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleSkip}
                className="bg-gray-300 text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-200 text-lg"
              >
                Skip
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition duration-200 text-lg ml-2"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
