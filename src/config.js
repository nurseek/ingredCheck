export const OPENAI_CONFIG = {
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 500
};

// Add your API key in a .env file, not here
export const getOpenAIKey = () => {
    // More detailed debugging
    console.log('All env variables:', Object.keys(import.meta.env));
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        console.error('API Key not found in environment variables');
    } else {
        console.log('API Key found with length:', apiKey.length);
        console.log('API Key starts with:', apiKey.substring(0, 3) + '...');
    }
    return apiKey;
}; 