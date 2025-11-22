'use server';

export default async function callMyApi(userInput: string) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    require('dotenv').config();
    const API_KEY = process.env.GEMINI_API_KEY;
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
          以下の食材を使って、独り暮らしの男性でも簡単に作れる「元気が出る丼もの」のレシピを1つだけ考えてください。
          Markdown形式で出力してください。
          冷蔵庫にある食材: [${userInput}]
          
          出力フォーマット:
          ## 料理名
          ### 調理時間
          ### 調理手順
          ### 一言コメント

          ** 【最重要ルール】 **
          食材として判断できない単語や、料理に無関係な単語は無視し、使用可能な食材のみでレシピを構成してください。

          ** 使用可能な食材が極端に少ない場合（例：塩、米のみの入力）や、調理が不可能な食材のみである場合は、レシピを生成せず、以下のメッセージのみ出力してください: **
          大変申し訳ありません。ご提示の食材だけではレシピの作成が困難です。もう少し食材を追加していただけませんか？

          ** 食材として判断できない単語や料理に無関係な単語のみが入力された場合は、レシピを生成せず、以下のメッセージのみ出力してください: **
          大変申し訳ありません。ご提示の食材でレシピを作成することはできません。
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        // レスポンスが空でないかチェック
        if (!response || !response.text) {
            console.error("Empty response from Gemini API:", response);
            return {
                success: false,
                message: "APIからレスポンスが返されませんでした",
                timestamp: new Date().toISOString()
            };
        }

        const recipe = response.text();

        return {
            success: true,
            message: recipe,
            timestamp: new Date().toLocaleString('ja-jp')
        };

    } catch (e: any) {
        console.error("Error details:", e);
        const errorMessage = e?.message || "予期せぬエラーが発生しました";
        return {
            success: false,
            message: errorMessage,
            timestamp: new Date().toLocaleString('ja-jp')
        };
    }
}