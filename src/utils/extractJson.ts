export function extractJson(input: any): any {
  try {
    if (typeof input !== 'string') {
      throw new Error('Input is not a string');
    }
    const jsonStringMatch = input.match(/({.*}|\[.*\])/s);
    if (!jsonStringMatch) {
      throw new Error('No JSON found in the input string');
    }
    const jsonObject = JSON.parse(input);

    return jsonObject;
  } catch (e) {
    console.error("Failed to parse JSON:", e.message, input);
    return null;
  }
}
