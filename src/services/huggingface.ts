const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY || '';
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.3';

const SYSTEM_PROMPT = `Tu es Velvet AI, un assistant de voyage ferroviaire français amical et professionnel. Tu aides les utilisateurs à trouver des trains, prédire les prix et planifier leurs voyages. Tu travailles pour Velvet, une compagnie de train à grande vitesse en France.

Règles importantes:
- Réponds TOUJOURS en français
- Sois concis et utile
- Utilise des emojis pour rendre les réponses plus visuelles (🚄, 💰, ⏰, etc.)
- Quand tu montres des résultats de trains, formate-les clairement
- Donne des conseils sur le meilleur moment pour acheter
- Sois enthousiaste à propos des voyages en train

Exemples de réponses:
- Pour une recherche: "Voilà ce que j'ai trouvé pour toi ! 🚄"
- Pour un conseil prix: "Mon conseil 💡 : attends quelques jours, les prix ont tendance à baisser le mardi."
- Pour une confirmation: "Parfait ! Je t'ai trouvé le meilleur train. 🎯"`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendChatMessage(
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> {
  const messages: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  // Format for Mistral Instruct
  const prompt = formatMessagesForMistral(messages);

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('HuggingFace API Error:', errorData);

      // Handle model loading
      if (response.status === 503) {
        return "Je me prépare... 🚄 Réessaie dans quelques secondes, je charge mes horaires !";
      }

      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      return cleanResponse(data[0].generated_text);
    }

    if (data.generated_text) {
      return cleanResponse(data.generated_text);
    }

    return "Désolé, je n'ai pas pu traiter ta demande. Peux-tu reformuler ? 🤔";
  } catch (error) {
    console.error('Chat error:', error);
    return "Oups ! J'ai eu un petit problème de connexion. Réessaie dans un instant ! 🔄";
  }
}

function formatMessagesForMistral(messages: Message[]): string {
  let prompt = '<s>';

  for (const msg of messages) {
    if (msg.role === 'system') {
      prompt += `[INST] ${msg.content} [/INST]`;
    } else if (msg.role === 'user') {
      prompt += `[INST] ${msg.content} [/INST]`;
    } else if (msg.role === 'assistant') {
      prompt += ` ${msg.content}</s>`;
    }
  }

  return prompt;
}

function cleanResponse(text: string): string {
  // Remove any remaining instruction tokens
  let cleaned = text
    .replace(/\[INST\]/g, '')
    .replace(/\[\/INST\]/g, '')
    .replace(/<s>/g, '')
    .replace(/<\/s>/g, '')
    .trim();

  // Remove any system prompt repetition
  const systemPhrases = ['Tu es Velvet AI', 'Règles importantes', 'Exemples de réponses'];
  for (const phrase of systemPhrases) {
    const index = cleaned.indexOf(phrase);
    if (index > 0) {
      cleaned = cleaned.substring(0, index).trim();
    }
  }

  return cleaned || "Comment puis-je t'aider avec ton voyage aujourd'hui ? 🚄";
}

// Helper to detect if user is asking about trains
export function detectTrainQuery(message: string): {
  isTrainQuery: boolean;
  origin?: string;
  destination?: string;
} {
  const lowerMessage = message.toLowerCase();

  const cities = ['paris', 'bordeaux', 'nantes', 'rennes', 'lyon', 'marseille', 'lille'];
  const trainKeywords = ['train', 'billet', 'voyage', 'aller', 'partir', 'horaire', 'prix'];

  const foundCities = cities.filter(city => lowerMessage.includes(city));
  const hasTrainKeyword = trainKeywords.some(kw => lowerMessage.includes(kw));

  // Check for route pattern like "paris bordeaux" or "paris → bordeaux"
  const routePattern = /(\w+)\s*(?:→|->|vers|à|pour)\s*(\w+)/i;
  const match = lowerMessage.match(routePattern);

  if (match) {
    return {
      isTrainQuery: true,
      origin: match[1],
      destination: match[2],
    };
  }

  return {
    isTrainQuery: foundCities.length >= 2 || (foundCities.length >= 1 && hasTrainKeyword),
    origin: foundCities[0],
    destination: foundCities[1],
  };
}
