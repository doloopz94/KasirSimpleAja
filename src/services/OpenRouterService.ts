// OpenRouter AI Service for Promotion Generation

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface PromotionRequest {
  storeName: string;
  menuItems: Array<{
    name: string;
    price: number;
    category: string;
  }>;
  style: 'casual' | 'promo' | 'formal' | 'story' | 'facebook';
  discount?: number;
  additionalInfo?: string;
}

export interface PromotionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class OpenRouterService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = OPENROUTER_API_KEY;
    this.apiUrl = OPENROUTER_API_URL;
  }

  // Generate promotion message using AI
  async generatePromotion(request: PromotionRequest): Promise<PromotionResponse> {
    try {
      const prompt = this.buildPrompt(request);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
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
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const message = data.choices[0]?.message?.content;

      if (!message) {
        throw new Error('No message generated');
      }

      return {
        success: true,
        message: message.trim()
      };
    } catch (error) {
      console.error('OpenRouter API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Build prompt based on request
  private buildPrompt(request: PromotionRequest): string {
    const menuList = request.menuItems
      .map(item => `- ${item.name}: ${this.formatCurrency(item.price)} (${item.category})`)
      .join('\n');

    const styleGuide = {
      casual: 'Santai, akrab, seperti ngobrol dengan teman. Gunakan bahasa gaul yang sopan.',
      promo: 'Menonjolkan promo/diskon, buat urgency, gunakan kata-kata yang memotivasi untuk segera order.',
      formal: 'Profesional, sopan, cocok untuk pelanggan korporat atau acara formal.',
      story: 'Singkat, padat, cocok untuk story WhatsApp/Instagram. Maksimal 5-7 baris.',
      facebook: 'Engaging, gunakan hashtag, cocok untuk posting di Facebook. Sertakan call-to-action yang jelas.'
    };

    let prompt = `Buatkan pesan promosi untuk toko makanan "${request.storeName}" dengan style ${request.style}.

${styleGuide[request.style]}

Menu yang tersedia hari ini:
${menuList}
`;

    if (request.discount) {
      prompt += `\n\nPromo spesial: Diskon ${request.discount}% untuk pembelian hari ini!\n`;
    }

    if (request.additionalInfo) {
      prompt += `\nInformasi tambahan: ${request.additionalInfo}\n`;
    }

    prompt += `\nFormat pesan:
- Gunakan emoji yang relevan (🍽️🔥✨🎉💰📲 dll)
- Buat menarik dan persuasif
- Sertakan call-to-action
- Jangan terlalu panjang (maksimal 15-20 baris)
- Format dalam bahasa Indonesia
- Jangan gunakan markdown, gunakan plain text dengan emoji`;

    return prompt;
  }

  // Format currency
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Check if API is available
  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey !== 'YOUR_API_KEY');
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();
