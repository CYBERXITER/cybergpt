
/**
 * Convert a file to base64 format for sending in the prompt
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Extract text from a PDF file
 * Note: This is a simple placeholder. For production, you would use a proper PDF parsing library
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // In a real implementation, you would use a library like pdf.js
  // For now, we'll just return a placeholder message
  return `PDF content from ${file.name} would be processed here.`;
};
