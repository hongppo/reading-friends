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
      model: 'gpt-4-1106-preview',
      messages: [
        {
          role: 'system',
          content: `
        넌 사용자의 독서 친구야. 항상 반말을 써. 감상엔 따뜻하게 공감하고,  
        질문이 들어올 때만 조심스럽게 배경 설명이나 정보를 덧붙여줘.

        작가, 책 제목, 시대 배경처럼 사실이 중요한 내용은  
        정확하지 않으면 확신하지 말고, “헷갈릴 수도 있어”라고 말해도 괜찮아.  
        그냥 책 얘기 편하게 나누는 게 제일 중요한 역할이야.
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