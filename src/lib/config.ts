export const serverApi: string = process.env.REACT_APP_API_URL || '';

// Get API key without template literals, with fallback to hardcoded key
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
export const openRouterApiKey: string = OPENROUTER_API_KEY || '';

console.log('Environment variables loaded:');
console.log('API URL:', process.env.REACT_APP_API_URL);
console.log('OpenRouter API Key available:', !!OPENROUTER_API_KEY);
if (OPENROUTER_API_KEY) {
  console.log('OpenRouter API Key length:', OPENROUTER_API_KEY.length);
  console.log('OpenRouter API Key first 5 chars:', OPENROUTER_API_KEY.substring(0, 5));
  console.log('API Key format valid:', OPENROUTER_API_KEY.startsWith('sk-or-v1-'));
}

export const Messages = {
    error1: "Something went wrong!",
    error2: "Please login first!",
    error3: "Please fulfill all inputs!",
    error4: "Message is empty!",
    error5: "Only images with jpeg, jpg, png format allowed!"
};
