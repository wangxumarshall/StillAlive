// LLM 服务 - 真实 API 集成
// 使用方式：在 userService.js 中替换 analyzeDiary 函数

// 配置 - 用户需要在环境变量或设置中提供 API key
const API_CONFIG = {
  // 可以使用 Gemini, OpenAI, Claude 等
  provider: 'gemini', // 或 'openai', 'claude'
  apiKey: import.meta.env.VITE_LLM_API_KEY || '',
  model: 'gemini-2.0-flash' // 或 'gpt-4', 'claude-3-sonnet'
}

/**
 * 使用真实 LLM 分析日记
 * @param {string} text - 用户日记内容
 * @returns {Promise<object>} 分析结果
 */
export async function analyzeDiaryWithLLM(text) {
  const { provider, apiKey, model } = API_CONFIG

  if (!apiKey) {
    console.warn('LLM API key 未配置，使用模拟响应')
    return null
  }

  const prompt = buildPrompt(text)

  try {
    switch (provider) {
      case 'gemini':
        return await callGemini(prompt, apiKey, model)
      case 'openai':
        return await callOpenAI(prompt, apiKey, model)
      case 'claude':
        return await callClaude(prompt, apiKey, model)
      default:
        console.warn('未知的 LLM provider')
        return null
    }
  } catch (error) {
    console.error('LLM 调用失败:', error)
    return null
  }
}

function buildPrompt(text) {
  return `角色：生命导师。根据以下用户日记，评估其身体、心智、情感状态，并以简洁JSON形式回答：{"timeDeltaSeconds":<整数>,"sentiment":"<positive|negative|neutral>","analysis":"<中文分析>"}。timeDeltaSeconds 范围[-14400,14400]。
用户日记："${text}"`
}

async function callGemini(prompt, apiKey, model) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    }
  )

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text

  return parseLLMResponse(content)
}

async function callOpenAI(prompt, apiKey, model) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: '你是一个生命导师，请用JSON格式回复。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  })

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  return parseLLMResponse(content)
}

async function callClaude(prompt, apiKey, model) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  })

  const data = await response.json()
  const content = data.content?.[0]?.text

  return parseLLMResponse(content)
}

export function parseLLMResponse(content) {
  if (!content) return null

  try {
    // 尝试提取 JSON
    const jsonMatch = content.match(/\{[^}]+\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])

      // 验证和规范化结果
      return {
        timeDeltaSeconds: Math.max(-14400, Math.min(14400, parseInt(result.timeDeltaSeconds) || 0)),
        sentiment: ['positive', 'negative', 'neutral'].includes(result.sentiment) ? result.sentiment : 'neutral',
        analysis: result.analysis || '分析结果生成中...'
      }
    }
  } catch (e) {
    console.error('解析 LLM 响应失败:', e)
  }

  // 解析失败时返回默认值
  return {
    timeDeltaSeconds: 0,
    sentiment: 'neutral',
    analysis: '暂时无法分析您的记录，请稍后重试。'
  }
}

export const llmService = {
  analyzeDiaryWithLLM,
  API_CONFIG
}
