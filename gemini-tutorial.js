// 1. インストールしたライブラリを読み込む（Pythonの import と同じ）
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()

// --- ここにAPIキーを入れてください ---
// ※注意: このファイルは絶対にGitにコミットしないでください！
const API_KEY = process.env.GEMINI_API_KEY

async function main() {
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
      
      冷蔵庫にある食材: [豚肉, キムチ, 卵]
      
      出力フォーマット:
      料理名:
      調理時間:
      一言コメント:
    `;

    // 5. AIに送信して、答えが返ってくるのを待つ (await)
    // Pythonと違い、Node.jsではネットワーク通信の時に必ず 'await' をつけます
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. 結果を表示する
    console.log("\n--- 🎉 AIからの提案 ---");
    console.log(text);
    console.log("-----------------------");

  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
  }
}

// 関数を実行する
main();