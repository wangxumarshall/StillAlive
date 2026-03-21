import { describe, it, expect } from 'vitest'
import { parseLLMResponse } from '../src/services/llmService'

describe('llmService', () => {
  describe('parseLLMResponse', () => {
    it('should parse valid JSON response', () => {
      const content = '{"timeDeltaSeconds": 3600, "sentiment": "positive", "analysis": "很好"}'
      const result = parseLLMResponse(content)

      expect(result.timeDeltaSeconds).toBe(3600)
      expect(result.sentiment).toBe('positive')
      expect(result.analysis).toBe('很好')
    })

    it('should handle timeDeltaSeconds out of range', () => {
      const content = '{"timeDeltaSeconds": 20000, "sentiment": "positive", "analysis": "测试"}'
      const result = parseLLMResponse(content)

      expect(result.timeDeltaSeconds).toBe(14400)
    })

    it('should handle negative timeDeltaSeconds out of range', () => {
      const content = '{"timeDeltaSeconds": -20000, "sentiment": "negative", "analysis": "测试"}'
      const result = parseLLMResponse(content)

      expect(result.timeDeltaSeconds).toBe(-14400)
    })

    it('should handle invalid sentiment', () => {
      const content = '{"timeDeltaSeconds": 100, "sentiment": "happy", "analysis": "测试"}'
      const result = parseLLMResponse(content)

      expect(result.sentiment).toBe('neutral')
    })

    it('should handle empty content', () => {
      const result = parseLLMResponse('')

      expect(result).toBeNull()
    })

    it('should handle null content', () => {
      const result = parseLLMResponse(null)

      expect(result).toBeNull()
    })

    it('should handle missing analysis field', () => {
      const content = '{"timeDeltaSeconds": 100, "sentiment": "positive"}'
      const result = parseLLMResponse(content)

      expect(result.analysis).toBe('分析结果生成中...')
    })

    it('should handle non-JSON content gracefully', () => {
      const result = parseLLMResponse('这是一段普通文本')

      expect(result.timeDeltaSeconds).toBe(0)
      expect(result.sentiment).toBe('neutral')
    })

    it('should extract JSON from text with surrounding content', () => {
      const content = '以下是分析结果：{"timeDeltaSeconds": 1800, "sentiment": "neutral", "analysis": "不错"}，希望对您有帮助'
      const result = parseLLMResponse(content)

      expect(result.timeDeltaSeconds).toBe(1800)
    })
  })
})
