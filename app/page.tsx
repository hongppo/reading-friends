'use client'

import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // 메시지가 추가되면 자동으로 스크롤 내려주기
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) throw new Error('API 응답 오류')

      const data = await res.json()

      if (!data.result) throw new Error('응답 데이터 없음')

      setMessages([...newMessages, data.result])
    } catch (error) {
      console.error('🚨 오류 발생:', error)
      const errorMessages = [
        '앗, 나 지금 좀 멍했어. 다시 말해줄래? 🙏',
        '헷갈릴 수도 있어. 조금만 더 설명해줄래? 🤔',
        '어? 그 부분은 내가 잘 모르겠어. 다른 부분에서 도와줄까? 🙃',
        '오, 그거 정말 어려운 질문이네! 좀 더 얘기해볼래? 😅'
      ]

      const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)]

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: randomMessage
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">📚 독서 친구</h1>

      <div className="bg-gray-100 p-4 rounded h-96 overflow-y-auto text-sm space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm max-w-[80%] whitespace-pre-wrap text-left ${
                m.role === 'user'
                  ? 'bg-[#c7f0db] text-gray-900'
                  : 'bg-[#fef3c7] text-gray-900'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 italic">친구가 생각 중...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="감상을 입력해줘"
          rows={2}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          className="flex-1 p-2 border rounded resize-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          보내기
        </button>
      </div>
    </div>
  )
}