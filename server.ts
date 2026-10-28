import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini AI SDK
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoint: Generate custom spot trivia and mini-quiz
  app.post('/api/gemini/quiz', async (req, res) => {
    try {
      const { spotName, spotCategory, description } = req.body;

      if (!apiKey) {
        return res.status(503).json({
          error: 'API key not configured',
          fallback: true,
        });
      }

      const prompt = `あなたは街歩きイベントや社内フェスティバルの案内ナビゲーターです。
参加者が以下のスタンプスポットで合言葉を入力してスタンプを獲得しました。
このスポットに関する「思わず誰かに話したくなる楽しい豆知識」1つと、それにまつわる「3択ミニクイズ」を日本語で作成してください。

【スポット情報】
- スポット名: ${spotName || '街角の憩いスポット'}
- カテゴリ: ${spotCategory || '街歩き名所'}
- 説明: ${description || '地域の人気スポット'}

親しみやすく、大人も子供もワクワクするトーンで作成してください。`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: '回答は必ず指定されたJSONスキーマに従ってください。解説は優しく楽しく100文字以内でまとめてください。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trivia: {
                type: Type.STRING,
                description: 'スポットやそのジャンルにまつわる興味深い豆知識（120文字程度）',
              },
              quizQuestion: {
                type: Type.STRING,
                description: '豆知識やテーマに関する3択クイズの問題文',
              },
              quizOptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3つの選択肢の配列（正解1つ、不正解2つ）',
              },
              correctIndex: {
                type: Type.INTEGER,
                description: '正解の選択肢のインデックス（0, 1, 2のいずれか）',
              },
              explanation: {
                type: Type.STRING,
                description: '正解の理由とちょっとした褒め言葉（80文字程度）',
              },
            },
            required: ['trivia', 'quizQuestion', 'quizOptions', 'correctIndex', 'explanation'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }

      const parsedData = JSON.parse(responseText.trim());
      return res.json(parsedData);
    } catch (err: any) {
      console.error('Error generating trivia with Gemini:', err);
      return res.status(500).json({
        error: err.message || 'Failed to generate trivia',
        fallback: true,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve static in production or attach Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
