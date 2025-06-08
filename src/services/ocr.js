import { getOpenAIKey } from '../config';

export async function initializeOCR() {
    // No initialization needed for OpenAI Vision API
    return true;
}

export async function performOCR(imageSource) {
    try {
        console.log('Starting OpenAI Vision text extraction...');
        
        const apiKey = getOpenAIKey();
        if (!apiKey) {
            throw new Error('OpenAI API key not found');
        }

        // Convert base64 URL to base64 string
        const base64Image = imageSource.split(',')[1];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "You are a multilingual food label expert. Look at this food product image and follow these steps:\n" +
                                      "1. First, confirm if you can see any text in the image (respond with 'YES' or 'NO')\n" +
                                      "2. If YES, identify the language(s) present\n" +
                                      "3. Find and extract the ingredients list in its ORIGINAL LANGUAGE - DO NOT TRANSLATE\n" +
                                      "4. Format your response exactly like this example:\n" +
                                      "TEXT_VISIBLE: YES\n" +
                                      "LANGUAGES: Kazakh, Russian\n" +
                                      "ORIGINAL_TEXT: [the ingredients list exactly as shown in the image, no translation]\n" +
                                      "If you can't find ingredients, still provide the first two pieces of information."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('OpenAI Vision API Error:', data.error);
            throw new Error(data.error.message);
        }

        const response_text = data.choices[0].message.content;
        console.log('Raw GPT Response:', response_text);

        // Parse the structured response
        const textVisible = response_text.match(/TEXT_VISIBLE: (YES|NO)/i)?.[1];
        const languages = response_text.match(/LANGUAGES: ([^\n]+)/)?.[1];
        const originalText = response_text.match(/ORIGINAL_TEXT: ([^\n]+)/)?.[1];

        console.log('Parsed Response:', {
            textVisible,
            languages,
            originalText
        });

        if (!textVisible || textVisible.toUpperCase() === 'NO') {
            throw new Error('No readable text found in the image. Please ensure the image is clear and well-lit.');
        }

        if (!originalText) {
            throw new Error(`Text is visible in ${languages || 'unknown'} language(s), but no ingredients list was found. Please ensure you're uploading a food label with ingredients.`);
        }

        return originalText.trim();
    } catch (error) {
        console.error('Text extraction error:', error);
        throw new Error(error.message || 'Failed to extract text from image. Please try again.');
    }
}

export async function cleanupOCR() {
    // No cleanup needed for OpenAI Vision API
    return true;
} 