import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function AddSentence() {
  const [englishSentence, setEnglishSentence] = useState('');
  const [olchikiSentence, setOlchikiSentence] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Add success message state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!englishSentence || !olchikiSentence) {
      setErrorMessage('Please fill in both fields.');
      setSuccessMessage(''); // Clear success message if error occurs
      return;
    }

    const res = await fetch('/api/add-sentence', {
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
      setSuccessMessage(''); // Clear success message if error occurs
      return;
    }

    // Clear inputs and messages
    setEnglishSentence('');
    setOlchikiSentence('');
    setErrorMessage('');
    setSuccessMessage('Sentence added successfully!'); // Set success message
  };

  const handleOlchikiChange = (e) => {
    const olchikiRegex = /^[ᱚ-᱾\s]*$/;

    if (olchikiRegex.test(e.target.value)) {
      setOlchikiSentence(e.target.value);
      setErrorMessage('');
    } else {
      setErrorMessage('Please type only in Olchiki.');
    }
  };

  const handleEnglishChange = (e) => {
    setEnglishSentence(e.target.value);
    setErrorMessage('');
  };

  return (
    <>
      <Head>
        <title>Eng to Sant</title>
        <meta name="description" content="Add new English to Olchiki sentence translation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white relative">
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
          >
            Back to Home
          </button>
        </div>

        <motion.h1
          className="text-5xl font-bold mb-8 text-gray-800 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Add New Sentence
        </motion.h1>

        <motion.div
          className="bg-white p-10 rounded-lg w-full max-w-3xl" // Removed 'shadow-lg' here
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col">
            <textarea
              value={englishSentence}
              onChange={handleEnglishChange}
              placeholder="Enter English sentence"
              className="border border-gray-300 rounded-lg p-3 mb-4 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <textarea
              value={olchikiSentence}
              onChange={handleOlchikiChange}
              placeholder="Enter Olchiki translation here"
              className="border border-gray-300 rounded-lg p-3 mb-4 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>} {/* Success message */}
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition duration-200 text-lg"
            >
              Submit
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
