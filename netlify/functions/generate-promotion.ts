// Netlify Function - AI Promotion Generator Proxy
// This protects the OpenRouter API key from being exposed in client-side code

import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { storeName, menuItems, style, discount, additionalInfo } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!storeName || !menuItems || !style) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('OpenRouter API key not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'AI service not configured' })
      };
    }

    // Build prompt
    const menuList = menuItems
      .map((item: any) => `- ${item.name}: ${formatCurrency(item.price)} (${item.category})`)
      .join('\n');

    const styleGuide: Record<string, string> = {
      casual: 'Santai, akrab, seperti ngobrol dengan teman. Gunakan bahasa gaul yang sopan.',
      promo: 'Menonjolkan promo/diskon, buat urgency, gunakan kata-kata yang memotivasi untuk segera order.',
      formal: 'Profesional, sopan, cocok untuk pelanggan korporat atau acara formal.',
      story: 'Singkat, padat, cocok untuk story WhatsApp/Instagram. Maksimal 5-7 baris.',
      facebook: 'Engaging, gunakan hashtag, cocok untuk posting di Facebook. Sertakan call-to-action yang jelas.'
    };

    let prompt = `Buatkan pesan promosi untuk toko makanan "${storeName}" dengan style ${style}.

${styleGuide[style] || styleGuide.casual}

Menu yang tersedia hari ini:
${menuList}
`;

    if (discount) {
      prompt += `\n\nPromo spesial: Diskon ${discount}% untuk pembelian hari ini!\n`;
    }

    if (additionalInfo) {
      prompt += `\nInformasi tambahan: ${additionalInfo}\n`;
    }

    prompt += `\nFormat pesan:
- Gunakan emoji yang relevan (🍽️🔥✨🎉💰📲 dll)
- Buat menarik dan persuasif
- Sertakan call-to-action
- Jangan terlalu panjang (maksimal 15-20 baris)
- Format dalam bahasa Indonesia
- Jangan gunakan markdown, gunakan plain text dengan emoji`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': event.headers.origin || 'https://dapurku.netlify.app',
        'X-Title': 'DapurKu - Promotion Generator'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: 'Anda adalah copywriter profesional yang ahli membuat pesan promosi makanan yang menarik dan persuasif dalam bahasa Indonesia. Buat pesan yang engaging, gunakan emoji yang tepat, dan sesuaikan dengan style yang diminta.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: errorData.error?.message || 'AI service error' 
        })
      };
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content;

    if (!message) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No message generated' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: message.trim()
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      })
    };
  }
};

// Helper function
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
