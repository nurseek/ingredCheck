import { OPENAI_CONFIG, getOpenAIKey } from '../config';

export async function analyzeIngredients(ingredients) {
    const apiKey = getOpenAIKey();
    console.log('Starting ingredient analysis...');

    if (!apiKey) {
        throw new Error('OpenAI API key not found. Please check your .env file.');
    }

    try {
        console.log('Sending request to OpenAI...');
        
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
                        role: "system",
                        content: "You are a halal food expert. Analyze the given ingredients and determine their halal status. Consider common non-halal ingredients like alcohol, pork derivatives, and animal-derived ingredients of unknown origin. Respond with a JSON object containing 'status' (string: 'halal', 'not_halal', or 'needs_verification') and 'message' (string explaining why). Use 'needs_verification' when ingredients could be halal but require confirmation of their source."
                    },
                    {
                        role: "user",
                        content: `Analyze these ingredients for halal compliance: ${ingredients}`
                    }
                ],
                max_tokens: 500
            })
        });

        const data = await response.json();
        console.log('Received response from OpenAI');

        if (data.error) {
            console.error('OpenAI API Error:', data.error);
            throw new Error(data.error.message);
        }

        try {
            const content = data.choices[0].message.content;
            console.log('Raw content:', content);
            // Remove any markdown code blocks or extra formatting
            const cleanJson = content
                .replace(/```json\n?/g, '')  // Remove ```json
                .replace(/```\n?/g, '')      // Remove closing ```
                .trim();                     // Remove extra whitespace

            console.log('Cleaned response:', cleanJson);
            const result = JSON.parse(cleanJson);
            console.log('Analysis result:', result);
            return {
                isHalal: result.status === 'halal',
                needsVerification: result.status === 'needs_verification',
                message: result.message
            };
        } catch (e) {
            console.error('Error parsing OpenAI response:', e);
            return {
                isHalal: false,
                needsVerification: true,
                message: "Unable to determine halal status. Please consult a halal certification authority."
            };
        }
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}