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
                model: "gpt-4-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Read and extract the ingredients list from this food label image. Return ONLY the ingredients list, nothing else. If you can't find an ingredients list, say 'No ingredients list found.'"
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
                max_tokens: 500
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('OpenAI Vision API Error:', data.error);
            throw new Error(data.error.message);
        }

        const extractedText = data.choices[0].message.content;
        console.log('Extracted text:', extractedText);

        if (extractedText.includes('No ingredients list found')) {
            throw new Error('No ingredients list found in the image. Please ensure the ingredients are clearly visible.');
        }

        return extractedText.trim();
    } catch (error) {
        console.error('Text extraction error:', error);
        throw new Error(error.message || 'Failed to extract text from image. Please try again.');
    }
}

export async function cleanupOCR() {
    // No cleanup needed for OpenAI Vision API
    return true;
} 