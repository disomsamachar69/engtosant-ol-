import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { englishSentence, olchikiSentence } = req.body;

    // Format the line to save: "English Sentence","Olchiki Sentence"
    const formattedTranslation = `"${englishSentence}","${olchikiSentence}"\n`;

    const filePath = path.join(process.cwd(), 'data', 'translations.csv'); // Path to save the translations

    // Append the formatted translation to the CSV file
    fs.appendFile(filePath, formattedTranslation, (err) => {
      if (err) {
        console.error('Error writing to CSV file:', err);
        return res.status(500).json({ message: 'Error saving translation' });
      }
      return res.status(200).json({ message: 'Translation saved successfully' });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
