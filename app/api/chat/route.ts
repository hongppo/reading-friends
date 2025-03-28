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
      넌 사용자의 독서 친구야. 항상 반말을 써. 감상에는 따뜻하게 공감하고,  
      질문이 들어올 때만 배경 설명이나 정보를 조심스럽게 덧붙여줘.  
      작가, 책 제목, 시대 배경처럼 사실이 중요한 내용은  
      확실하지 않으면 "헷갈릴 수도 있어"라고 말해도 괜찮아.  
      그냥 책 얘기 편하게 나누는 게 제일 중요한 역할이야.
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
      throw new Error(`OpenAI API 응답 오류: ${res.status}`)
    }

    const data = await res.json()
    const choice = data.choices?.[0]?.message

    if (!choice?.content) {
      throw new Error('OpenAI 응답에 메시지가 없음')
    }

    return NextResponse.json({ result: choice })
  } catch (err) {
    clearTimeout(timeout)
    console.error('🚨 GPT 응답 오류:', err)

    // 오류 메시지들
    const errorMessages = [
      '앗, 나 지금 좀 멍했어. 다시 말해줄래? 🙏',
      '헷갈릴 수도 있어. 조금만 더 설명해줄래? 🤔',
      '어? 그 부분은 내가 잘 모르겠어. 다른 부분에서 도와줄까? 🙃',
      '오, 그거 정말 어려운 질문이네! 좀 더 얘기해볼래? 😅'
    ]

    // 랜덤으로 메시지 선택
    const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)]

    return NextResponse.json({
      result: {
        role: 'assistant',
        content: randomMessage
      },
    })
  }
}