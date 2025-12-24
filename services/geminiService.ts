
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Question, QuestionType, Difficulty, GradingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuestions = async (
  topic: string,
  difficulty: Difficulty,
  types: QuestionType[],
  count: number = 3
): Promise<Question[]> => {
  const prompt = `作为一个资深教育专家，请围绕知识点“${topic}”生成${count}道难度为“${difficulty}”的题目。
  题目类型需包含以下内容：${types.join(', ')}。
  如果题目需要配图（如几何图形、科学实验图、流程图等），请设置 needsImage 为 true，并提供详细的 imagePrompt (英文描述，用于绘图模型)。
  请确保所有文字内容使用简体中文。`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: Object.values(QuestionType) },
            content: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            needsImage: { type: Type.BOOLEAN },
            imagePrompt: { type: Type.STRING },
          },
          required: ["id", "type", "content", "answer", "explanation", "needsImage"]
        }
      }
    }
  });

  try {
    const questions = JSON.parse(response.text || '[]');
    return questions;
  } catch (e) {
    console.error("Failed to parse questions", e);
    return [];
  }
};

export const generateQuestionImage = async (imagePrompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A clean, minimalist educational illustration for a school textbook: ${imagePrompt}. White background, 2D flat style, professional, no text labels.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed", error);
    return null;
  }
};

export const gradeHomework = async (base64Image: string): Promise<GradingResult> => {
  const prompt = `你是一个专业的老师。请批改这张图片中的学生作业。
  1. 识别图片中的所有题目和学生的回答。
  2. 判断对错，并给出具体反馈和正确的解答。
  3. 给出总分（满分100）和整体评价。
  请务必使用简体中文。`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          totalPoints: { type: Type.NUMBER },
          overallFeedback: { type: Type.STRING },
          details: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionNumber: { type: Type.NUMBER },
                isCorrect: { type: Type.BOOLEAN },
                feedback: { type: Type.STRING },
                correction: { type: Type.STRING }
              },
              required: ["questionNumber", "isCorrect", "feedback"]
            }
          }
        },
        required: ["score", "totalPoints", "overallFeedback", "details"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
