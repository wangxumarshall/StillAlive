import { useState } from 'react'
import { userService } from '../services/userService'
import './DiaryPanel.css'

export default function DiaryPanel({ onClose, user }) {
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')

  // 检查今天是否已经提交过
  const today = new Date().toISOString().split('T')[0]
  const hasSubmittedToday = user?.lastLogDate === today

  const handleSubmit = async () => {
    if (text.length < 50) {
      setError('请输入至少50个字')
      return
    }

    setError('')
    setIsAnalyzing(true)

    try {
      const result = await userService.analyzeDiary(text)
      setAnalysis(result)

      // 更新用户数据
      const updatedUser = userService.updateLifeSeconds(user.id, result.timeDeltaSeconds)
      userService.saveDiaryLog(user.id, {
        text,
        ...result,
        date: today
      })

      // 延迟关闭，让用户看到分析结果
      setTimeout(() => {
        // 3秒后自动返回
      }, 5000)
    } catch (err) {
      setError('分析失败，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '🌟'
      case 'negative': return '💪'
      default: return '✨'
    }
  }

  return (
    <div className="diary-panel" role="main" aria-label="今日总结">
      <div className="diary-container">
        {/* 头部 */}
        <header className="diary-header">
          <button className="close-btn" onClick={onClose} aria-label="返回主页">← 返回</button>
          <h2>今日总结</h2>
          <div /> {/* 占位保持布局 */}
        </header>

        {hasSubmittedToday && !analysis ? (
          <div className="already-submitted" role="status" aria-live="polite">
            <div className="check-icon" aria-hidden="true">✓</div>
            <p>你今天已经提交过日记了</p>
            <p className="hint">明天再来吧，保持记录的习惯</p>
            <button className="back-btn" onClick={onClose}>返回时钟</button>
          </div>
        ) : analysis ? (
          <div className="analysis-result" role="alert" aria-live="polite">
            <div className={`sentiment-badge ${analysis.sentiment}`} aria-label={`情绪：${analysis.sentiment}`}>
              <span className="emoji" aria-hidden="true">{getSentimentEmoji(analysis.sentiment)}</span>
              <span className="label">
                {analysis.sentiment === 'positive' ? '积极' :
                  analysis.sentiment === 'negative' ? '需要鼓励' : '平淡'}
              </span>
            </div>

            <div className="time-delta">
              <span className="delta-value">
                {analysis.timeDeltaSeconds >= 0 ? '+' : ''}
                {Math.floor(analysis.timeDeltaSeconds / 3600)}小时
                {Math.floor((analysis.timeDeltaSeconds % 3600) / 60)}分钟
              </span>
              <span className="delta-label">
                {analysis.timeDeltaSeconds >= 0 ? '生命奖励' : '生命调整'}
              </span>
            </div>

            <div className="analysis-text">
              <p>{analysis.analysis}</p>
            </div>

            <button className="confirm-btn" onClick={onClose}>
              收下这份反馈
            </button>
          </div>
        ) : (
          <>
            {/* 输入区域 */}
            <div className="input-section">
              <p className="prompt">
                记录今天让你印象深刻的事情，\n无论是好是坏，都是生命的馈赠。
              </p>

              <textarea
                className="diary-input"
                placeholder="今天发生了什么让你印象深刻的事？..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                maxLength={1000}
              />

              <div className="input-footer">
                <span className={`char-count ${text.length >= 50 ? 'valid' : ''}`}>
                  {text.length}/50 字
                </span>
              </div>

              {error && <p className="error-hint">{error}</p>}
            </div>

            {/* 提交按钮 */}
            <button
              className={`submit-btn ${isAnalyzing ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={isAnalyzing || text.length < 50}
            >
              {isAnalyzing ? (
                <span className="loading-text">
                  <span className="loading-dots">生命导师思考中</span>
                </span>
              ) : (
                '提交今日总结'
              )}
            </button>

            <p className="note">
              积极日记会获得时间奖励，消极日记会适当扣减\n每天仅可提交一次
            </p>
          </>
        )}
      </div>

      {/* 加载动画 */}
      {isAnalyzing && (
        <div className="thinking-animation">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="thinking-particle"
              style={{
                '--delay': `${i * 0.15}s`,
                '--angle': `${i * 45}deg`
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
