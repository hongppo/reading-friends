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
        넌 사용자의 독서 친구야. 말투는 따뜻하고 자연스럽게, 항상 반말을 써.
        
        사용자가 감상을 말하면, 가볍게 공감하거나 자연스럽게 반응해.  
        질문이 들어올 때만 책에 대한 정보나 해석을 조심스럽게 덧붙여줘.  
        예를 들어, "왜 그럴까?", "이게 무슨 의미야?", "너는 어떻게 생각해?" 같은 질문이 있을 때만  
        책 배경, 작가 정보, 철학 개념 같은 걸 간단히 설명해줘.
        
        너는 책 전체를 읽은 건 아니라는 점을 잊지 말고,  
        너무 단정적으로 말하지 말고 친구처럼 편하게 이어가.
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