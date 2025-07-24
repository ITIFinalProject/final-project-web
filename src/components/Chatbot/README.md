# AI Chatbot Setup Guide

## Overview

This chatbot is integrated into your events platform and provides AI-powered assistance to users. It uses OpenAI's GPT-3.5-turbo model to answer questions about events, bookings, and platform usage.

## Features

- 🤖 **AI-Powered Responses**: Uses OpenAI GPT-3.5-turbo for intelligent conversations
- 🎨 **Modern Design**: Follows your project's color scheme and design patterns
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Chat**: Instant messaging with typing indicators
- 🔒 **Error Handling**: Graceful fallbacks and user-friendly error messages
- 🎯 **Context-Aware**: Tailored for event management queries

## Setup Instructions

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key (you won't be able to see it again)

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace `your-openai-api-key-here` with your actual API key:
   ```env
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Install Dependencies

Make sure you have all required dependencies installed:

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

## Usage

### For Users

- Click the chat bubble in the bottom-right corner to open the chatbot
- Type your questions about events, bookings, or platform features
- The AI will provide helpful responses based on the context

### For Developers

The chatbot is automatically included in the main App component. Key files:

- `/src/components/Chatbot/Chatbot.jsx` - Main chatbot component
- `/src/components/Chatbot/Chatbot.css` - Chatbot styles
- `/src/services/openaiService.js` - OpenAI API integration

## Customization

### Modifying AI Behavior

Edit the system prompt in `/src/services/openaiService.js`:

```javascript
{
  role: 'system',
  content: `Your custom instructions here...`
}
```

### Styling

The chatbot uses CSS custom properties from your project's design system. Modify `/src/components/Chatbot/Chatbot.css` to customize the appearance.

### API Configuration

Adjust the OpenAI API parameters in `/src/services/openaiService.js`:

- `model`: Change the AI model (e.g., 'gpt-4', 'gpt-3.5-turbo')
- `max_tokens`: Limit response length
- `temperature`: Control creativity (0-1)

## Fallback Mode

If no API key is configured, the chatbot will use mock responses for testing purposes. This allows you to test the UI without setting up the OpenAI API immediately.

## Error Handling

The chatbot includes comprehensive error handling for:

- Invalid API keys
- Rate limiting
- Network issues
- API service outages

## Security Notes

- Never commit your `.env` file to version control
- The API key is only used client-side for this demo
- For production, consider using a backend proxy for API calls
- Implement rate limiting to prevent API abuse

## Troubleshooting

### Common Issues

1. **"API configuration error"**: Check that your API key is correctly set in the `.env` file
2. **"Rate limit exceeded"**: You've hit OpenAI's usage limits, wait or upgrade your plan
3. **Network errors**: Check your internet connection and OpenAI service status

### Testing Without API Key

The chatbot will work in mock mode without an API key, providing predefined responses for testing the UI and functionality.

## Future Enhancements

- Voice input/output
- Multi-language support
- Integration with your events database
- User session persistence
- Advanced conversation memory
