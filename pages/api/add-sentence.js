import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { englishSentence, olchikiSentence } = req.body;

    if (!englishSentence || !olchikiSentence) {
      return res.status(400).json({ message: 'Both sentences are required.' });
    }

    // Construct the line to write to the new CSV file
    const newLine = `"${englishSentence}","${olchikiSentence}"\n`;

    // Define the path to the new CSV file
    const filePath = path.join(process.cwd(), 'data', 'add_new.csv');

    // Append the new line to the new CSV file
    fs.appendFile(filePath, newLine, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to save the sentence.' });
      }

      res.status(200).json({ message: 'Sentence added successfully!' });
    });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
