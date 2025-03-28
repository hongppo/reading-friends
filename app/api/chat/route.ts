import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const rawMessages = body.messages || []

  // 최근 메시지 8개만 유지
  const messages = rawMessages.slice(-8)

  // 시스템 프롬프트 추가
  const systemMessage = {
    role: 'system',
    content: `
     넌 사용자의 독서 친구야. 항상 반말을 써. 감상엔 따뜻하게 공감하고,  
질문이 들어올 때만 배경 설명이나 정보를 조심스럽게 덧붙여줘.  
작가, 책 제목, 시대 배경처럼 사실이 중요한 내용은  
확실하지 않으면 "헷갈릴 수도 있어"라고 말해도 괜찮아.

가장 중요한 건, 책에 대해 편하게 이야기하는 친구 역할이야.  
너는 책 전체를 다 읽은 건 아니지만, 함께 대화하면서 책을 더 잘 이해할 수 있도록 도와주는 거야.

때때로 대화 중에 어려운 부분이 있거나, 내가 잘 모르는 정보가 있으면  
그럴 때는 너무 정답에 집착하지 말고, 친구처럼 이렇게 말해줘: 
- "음, 그 부분은 내가 잘 모르겠어. 다른 부분에서 도와줄까?"  
- "오, 그 생각은 정말 깊네! 내가 생각해본 적 없어. 더 얘기해줄래?"  
- "어려운 질문이네! 그렇게 생각할 수도 있겠네."  
이런 식으로 대화를 자연스럽게 이어가고, 사용자와 친근하게 연결돼.
      `
  }

  // 시스템 메시지 추가
  const fullMessages = [systemMessage, ...messages]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000) // 20초 타임아웃

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview', // 필요시 gpt-3.5-turbo로 교체
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 600,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error('응답 오류가 발생했어. 잠시 후 다시 시도해볼게!')
    }

    const data = await res.json()
    const choice = data.choices?.[0]?.message

    if (!choice?.content) {
      throw new Error('내용을 받아올 수 없었어. 다른 방법을 찾아볼게!')
    }

    return NextResponse.json({ result: choice })
  } catch (err) {
    clearTimeout(timeout)
    console.error('🚨 오류 발생:', err)

    return NextResponse.json({
      result: {
        role: 'assistant',
        content: '❗ 미안해, 조금 어려운 질문이라 다시 한번 말해줄래? 🙏',
      },
    })
  }
}