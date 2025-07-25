const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const API_KEY =
  import.meta.env.VITE_OPENAI_API_KEY || "your-openai-api-key-here";

export const sendMessageToOpenAI = async (message) => {
  if (!API_KEY || API_KEY === "your-openai-api-key-here") {
    throw new Error(
      "OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment variables."
    );
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for an events management platform. 
            Your role is to help users with:
            - Finding and discovering events
            - Event booking and registration
            - Event management and organization
            - General questions about the platform
            - Technical support
            
            Keep your responses helpful, concise, and friendly. 
            If asked about specific events or bookings, guide users to the appropriate sections of the platform.
            Always maintain a professional yet approachable tone.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);

      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your OpenAI API key configuration."
        );
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (response.status === 500) {
        throw new Error(
          "OpenAI service is temporarily unavailable. Please try again later."
        );
      } else {
        throw new Error(
          `API request failed: ${errorData.error?.message || "Unknown error"}`
        );
      }
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from OpenAI API");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);

    // Return user-friendly error messages
    if (error.message.includes("API key")) {
      throw new Error("API configuration error. Please contact support.");
    } else if (error.message.includes("Rate limit")) {
      throw new Error("Service is busy. Please try again in a moment.");
    } else if (
      error.message.includes("network") ||
      error.name === "TypeError"
    ) {
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    } else {
      throw new Error(
        "Unable to process your request right now. Please try again."
      );
    }
  }
};

// Alternative function for local testing without API key
export const getMockResponse = () => {
  const responses = [
    "I'd be happy to help you with that! Could you tell me more about what specific event information you're looking for?",
    "That's a great question! For event bookings, you can browse our Events page and click on any event that interests you.",
    "I can help you with event management! Are you looking to create a new event or manage an existing one?",
    "Our platform offers various event categories. You can filter events by date, location, or type to find exactly what you're looking for.",
    "If you're having trouble with booking an event, I recommend checking your account settings or contacting our support team.",
    "For the best event discovery experience, try using our search filters or browse by categories on the main Events page.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

// Function to validate API key
export const validateApiKey = () => {
  return API_KEY && API_KEY !== "your-openai-api-key-here";
};
