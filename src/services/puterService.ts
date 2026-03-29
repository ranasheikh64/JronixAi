import puter from '@heyputer/puter.js';

/**
 * Jronix AI Service - Powered by JronixAI
 */

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatWithAI = async (messages: Message[], model: string = 'gpt-4o-mini'): Promise<string> => {
  try {
    const response = await puter.ai.chat(messages, { model });

    if (typeof response === 'string') {
      return response;
    }

    // @ts-ignore
    const content = response?.message?.content || response?.toString();

    if (Array.isArray(content)) {
      return content.map(c => {
        if (typeof c === 'string') return c;
        if ('text' in (c as any)) return (c as any).text;
        return '';
      }).join('');
    }

    return (content as any) || "Sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error('Puter AI Error:', error);
    let detail = error?.message || '';
    if (!detail) {
      try {
        detail = JSON.stringify(error, null, 2);
      } catch (e) {
        detail = error?.toString() || 'Unknown error';
      }
    }
    throw new Error(`Failed to communicate with AI service: ${detail}`);
  }
};

export const generateImage = async (prompt: string, options: any = {}): Promise<string> => {
  try {
    const imgElement = await puter.ai.txt2img(prompt, {
      model: options.model || 'gpt-image-1',
      quality: options.quality || 'medium',
      ratio: options.ratio || { w: 1, h: 1 }
    });
    return imgElement.src;
  } catch (error) {
    console.error('Puter Image Gen Error:', error);
    throw error;
  }
};

export const analyzeImage = async (file: File | string): Promise<string> => {
  try {
    const text = await puter.ai.img2txt(file);
    return text || "No clear text or context extracted from image.";
  } catch (error) {
    console.error('Puter Image Analysis Error:', error);
    throw error;
  }
};

export const saveToKV = async (key: string, value: any) => {
  try {
    await puter.kv.set(key, JSON.stringify(value));
  } catch (error) {
    console.error('Puter KV Set Error:', error);
  }
};

export const getFromKV = async (key: string) => {
  try {
    const value = await puter.kv.get(key);
    return value ? JSON.parse(value as string) : null;
  } catch (error) {
    console.error('Puter KV Get Error:', error);
    return null;
  }
};
