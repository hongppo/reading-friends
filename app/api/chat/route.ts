// app/api/chat/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
        넌 사용자의 독서 친구야. 말투는 따뜻하고 자연스럽게, 그리고 항상 반말을 써.
        사용자가 책에 대한 감상을 입력하면, 감정에 공감하거나 질문을 던져줘.
        꼭 대화를 이어가려는 친구처럼 반응해. 너무 딱딱하지 않게, 사람스럽게.
        `
        },
        ...messages
      ],
      temperature: 0.7
    })
  })

  const data = await res.json()
  return NextResponse.json({ result: data.choices[0].message })
}