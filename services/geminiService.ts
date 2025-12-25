
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchQuestions(count: number = 10): Promise<Question[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tạo ${count} câu hỏi trắc nghiệm tiếng Việt chương trình lớp 1-5. 
    Mỗi câu trả về JSON gồm: question, options (4 lựa chọn), correctIndex (0-3), explanation, grade.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            grade: { type: Type.INTEGER }
          },
          required: ["question", "options", "correctIndex", "explanation", "grade"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Parse error:", error);
    return [];
  }
}

export async function generateIllustration(prompt: string): Promise<string> {
  const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await imageAi.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ text: `A 3D stylized educational illustration for children about: ${prompt}. High quality, vibrant colors, soft lighting, 3D render style.` }],
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "";
}

export async function callRelative(question: string, options: string[]): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Hãy đóng vai một người thân (có thể là mẹ, bố, anh trai hoặc chú hàng xóm vui tính) đang nghe điện thoại trợ giúp của người chơi trong chương trình "Ai thông minh hơn học sinh lớp 5". 
    Câu hỏi là: "${question}"
    Các lựa chọn là: ${options.join(", ")}
    Hãy trả lời một cách tự nhiên, hài hước, hơi ngập ngừng một chút nhưng cuối cùng hãy đưa ra gợi ý về đáp án đúng. Giữ câu trả lời ngắn gọn dưới 80 từ.`,
  });

  return response.text || "Alo alo? Sóng yếu quá, tôi nghĩ là đáp án B đó...";
}
