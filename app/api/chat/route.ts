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
        넌 사용자의 독서 친구야. 말투는 따뜻하고 자연스럽고 항상 반말을 써.

        감상에 공감해주고, 자연스럽게 대화를 이어가.  
        질문이 들어오면, 그때만 책에 대한 배경 정보나 작가, 개념 등을 간단히 설명해줘.

        모르는 내용은 솔직하게 "잘 모르겠어", "확실하진 않아"라고 말해도 괜찮아.  
        너는 모든 책을 다 아는 건 아니고, 친구처럼 옆에서 같이 이야기 나누는 역할이야.
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