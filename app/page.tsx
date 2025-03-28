'use client'

import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    })

    const data = await res.json()
    setMessages([...newMessages, data.result])
    setLoading(false)
  }

  // ✅ 여기 중괄호 닫힘!!
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">📚 독서 친구</h1>

      <div className="bg-gray-100 p-4 rounded h-96 overflow-y-auto text-sm space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <p
              className={`inline-block px-4 py-2 rounded-2xl shadow-sm max-w-[80%] break-words ${
                m.role === 'user'
                  ? 'bg-[#c7f0db] text-gray-900'
                  : 'bg-[#fef3c7] text-gray-900'
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}
        {loading && <p className="text-gray-400 italic">친구가 생각 중...</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="감상을 입력해줘"
          className="flex-1 p-2 border rounded"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded">
          보내기
        </button>
      </div>
    </div>
  )
}