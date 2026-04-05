import { defineCollection, z } from 'astro:content';
import { createClient } from 'microcms-js-sdk';

console.log('環境変数の確認:', {
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKeyExists: !!import.meta.env.MICROCMS_API_KEY,
  apiKeyLength: import.meta.env.MICROCMS_API_KEY?.length,
});

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// リトライ機能付きfetch
async function fetchWithRetry<T>(fetchFn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      if (isLastAttempt) throw error;

      console.log(`リトライ ${i + 1}/${maxRetries - 1} (${delay}ms後)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries reached');
}

// microCMSのコンテンツローダー
const microCMSLoader = (endpoint: string) => {
  return async () => {
    try {
      console.log(`microCMSから${endpoint}データを取得中...`);
      const response = await fetchWithRetry(() => client.getAllContents({ endpoint }));
      console.log(`${response.length}件の${endpoint}を取得しました`);
      return response;
    } catch (error) {
      console.error(`microCMSからの${endpoint}取得に失敗:`, error);
      return [];
    }
  };
};

// 共通のフィールド
const microCMSDateFields = {
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
};

// コレクションの定義
const blogs = defineCollection({
  loader: microCMSLoader('blogs'),
  schema: z.object({
    title: z.string(),
    content: z.string(),
    ...microCMSDateFields,
  }),
});

// コレクションのエクスポート
export const collections = {
  blogs,
};
