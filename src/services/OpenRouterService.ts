// OpenRouter AI Service for Promotion Generation
// Now uses Netlify Function as proxy to protect API key

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
  customModel?: string;
  testMode?: boolean;
}

export interface PromotionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class OpenRouterService {
  // Call Netlify Function instead of direct API
  async generatePromotion(request: PromotionRequest): Promise<PromotionResponse> {
    try {
      const response = await fetch('/.netlify/functions/generate-promotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      
      if (!data.success || !data.message) {
        throw new Error(data.error || 'No message generated');
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('AI generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Check if service is available
  isAvailable(): boolean {
    // Service is available if Netlify Function is deployed
    return true;
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();
