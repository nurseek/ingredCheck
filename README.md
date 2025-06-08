# Halal Check

A Vue.js application that helps users check if food products are halal by analyzing ingredient labels using AI. Upload a photo of food ingredients, and get instant analysis of halal status.

## Features

- **AI-Powered Image Analysis**: Uses OpenAI's Vision API to extract text from food labels
- **Multilingual Support**: Works with ingredients in Kazakh, Russian, and English
- **Smart Classification**: Three-tier verification system:
  - ✓ Halal - Confirmed permissible ingredients
  - ? Needs Verification - Requires further investigation
  - ✗ Not Halal - Contains non-permissible ingredients
- **User-Friendly Interface**: Modern, responsive design with clear visual feedback
- **Real-time Processing**: Instant ingredient analysis and results

## Technical Stack

- **Frontend**: Vue.js 3 with Composition API
- **AI Services**: 
  - OpenAI Vision API for text extraction
  - GPT-4 for ingredient analysis
- **Build System**: Vite
- **Styling**: Custom CSS with modern design principles

## Implementation Details

The application uses a composable architecture with key services:

- `useImageUpload`: Handles image selection and preview
- `openai.js`: Manages OpenAI API integration for ingredient analysis
- Custom error handling and user feedback system
- Environment-based configuration for API keys

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/halal-check.git
```

2. Install dependencies:
```bash
cd halal-check
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your OpenAI API key to .env file
```

4. Start development server:
```bash
npm run dev
```

## Security Considerations

- Secure API key management through environment variables
- Client-side image processing
- Input validation for uploaded files

## License

MIT License - see the [LICENSE](LICENSE) file for details

---

Built with Vue.js and OpenAI
