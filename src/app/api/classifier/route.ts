import axios from 'axios';

export async function Classifier(document:string) {
  try {
    // Assuming document is a string or an object with the necessary data
    const response = await axios.post('http://localhost:8000/api/classifier/openai/', {
      document,
    });

    // Assuming the response.data contains the keywords
    const { keywords } = response.data;

    // Parse the string into an object
    const parsedKeywords = JSON.parse(keywords);

    // Return the parsedKeywords
    return parsedKeywords;
  } catch (error: any) {
    console.error('Error generating summary:', error.message);
    throw error; // Re-throw the error to handle it at the caller level
  }
}
