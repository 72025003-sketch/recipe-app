'use server'

export async function callMyApi(userInput: string) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    require('dotenv').config()
    const API_KEY = process.env.GEMINI_API_KEY
    try {
        console.log("🍳 Geminiシェフを呼び出しています...");
    
        // 2. APIキーを使って認証する
        const genAI = new GoogleGenerativeAI(API_KEY);
    
        // 3. モデルを選ぶ
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
        // 4. プロンプト（指示書）を準備する
        // ここでは料理アプリっぽく、食材を渡してみます
        const prompt = `
          以下の食材を使って、独り暮らしの男性でも簡単に作れる
          「元気が出る丼もの」のレシピを1つだけ考えてください。
          
          冷蔵庫にある食材: [${userInput}]
          
          出力フォーマット:
          料理名:
          調理時間:
          一言コメント:
        `;
    
        // 5. AIに送信して、答えが返ってくるのを待つ (await)
        // Pythonと違い、Node.jsではネットワーク通信の時に必ず 'await' をつけます
        const result = await model.generateContent(prompt);
    
        // 6. 結果を表示する
        return {
            success: true,
            message: result,
            timestamp: new Date().toISOString()
        };
    
      } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "予期せぬエラーが発生しました",
            timestamp: new Date().toISOString()
        }
      }
}