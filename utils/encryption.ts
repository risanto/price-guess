import CryptoJS from "crypto-js";

// Define a secret key for encryption (use a strong key in production)
const SECRET_KEY = "hsb1023"; // Change this to a more secure key

// Encrypt user points and expiry date
export function encryptUserPoints(points: number, expiryDate: Date) {
  const data = {
    points,
    expiryDate: expiryDate.toISOString(), // Convert expiry date to ISO string for storage
  };

  // Convert data to a JSON string
  const jsonData = JSON.stringify(data);

  // Encrypt the JSON string using AES encryption
  const encryptedData = CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();

  return encryptedData;
}

// Decrypt the encrypted data and check expiry
export function decryptUserPoints(encryptedData: string) {
  // Decrypt the data
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  if (!decryptedData) {
    return null; // Invalid decryption
  }

  // Parse the decrypted JSON string back to an object
  const { points, expiryDate } = JSON.parse(decryptedData);

  // Check if the data is expired
  if (new Date(expiryDate) < new Date()) {
    return null; // Expired, return null
  }

  return points; // Return the user points if not expired
}
