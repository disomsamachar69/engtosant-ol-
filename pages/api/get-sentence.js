import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default function handler(req, res) {
  const englishFilePath = path.join(process.cwd(), 'data', 'sentences.csv');
  const translatedFilePath = path.join(process.cwd(), 'data', 'translated.csv');

  // Read the translated sentences
  let translatedList = [];
  try {
    const translatedSentences = fs.readFileSync(translatedFilePath, 'utf-8');
    const { data: translatedData } = Papa.parse(translatedSentences, { header: true });
    translatedList = translatedData.map(row => row.english_sentence.trim());
  } catch (error) {
    console.error('Error reading translated sentences:', error);
  }

  // Read the English sentences
  let availableSentences = [];
  try {
    const englishSentences = fs.readFileSync(englishFilePath, 'utf-8');
    const { data } = Papa.parse(englishSentences, { header: false });
    
    // Filter out already translated sentences
    availableSentences = data.filter(row => !translatedList.includes(row[0]));
  } catch (error) {
    console.error('Error reading English sentences:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }

  if (availableSentences.length === 0) {
    return res.status(404).json({ message: 'No more sentences to translate!' });
  }

  // Randomly select a sentence
  const randomIndex = Math.floor(Math.random() * availableSentences.length);
  const selectedSentence = availableSentences[randomIndex][0];

  return res.status(200).json({ sentence: selectedSentence });
}
