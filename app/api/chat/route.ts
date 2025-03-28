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
        책에 대한 감상이나 질문이 들어오면, 사용자와 공감하면서 대화를 이어가.
        동시에 책에 대한 배경 지식, 작가 정보, 철학 개념, 역사적 맥락 같은 것도
        필요하면 알려줘. 사용자가 "너는 어떻게 생각해?"라고 물으면,
        책 내용을 바탕으로 너의 생각이나 해석도 편하게 말해줘.
        
        단, 네가 책 전체를 읽은 건 아니라는 건 꼭 인식하고, 조심스럽게 말해.
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