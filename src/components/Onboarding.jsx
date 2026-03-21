import { useState } from 'react'
import './Onboarding.css'

export default function Onboarding({ onComplete }) {
  const [birthDate, setBirthDate] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!birthDate) {
      setError('请输入您的出生日期')
      return
    }

    const birth = new Date(birthDate)
    const now = new Date()

    if (isNaN(birth.getTime())) {
      setError('请输入有效的日期格式')
      return
    }

    if (birth >= now) {
      setError('出生日期不能是今天或未来')
      return
    }

    const age = (now - birth) / (365.25 * 24 * 60 * 60 * 1000)
    if (age < 16 || age > 80) {
      setError('我们服务 16-80 岁的用户')
      return
    }

    setIsSubmitting(true)

    // 延迟一下，模拟仪式感
    setTimeout(() => {
      onComplete(birthDate)
    }, 800)
  }

  // 计算预计可以活到的年龄显示
  const getLifePreview = () => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    if (isNaN(birth.getTime())) return null

    const lifeYears = 78 - Math.floor((new Date() - birth) / (365.25 * 24 * 60 * 60 * 1000))
    if (lifeYears <= 0) return null

    return (
      <div className="life-preview">
        <span className="preview-label">预计剩余</span>
        <span className="preview-value">{lifeYears} 年</span>
      </div>
    )
  }

  return (
    <div className="onboarding">
      <div className="onboarding-content">
        <div className="logo">
          <h1 className="title">WayBack</h1>
          <p className="subtitle">归途</p>
        </div>

        <div className="welcome-text">
          <p>欢迎来到 WayBack</p>
          <p className="description">
            我们无法决定生命的长度，但可以决定生命的质量。
            让我们一起珍惜当下的每一刻。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="birthday-form">
          <div className="form-group">
            <label htmlFor="birthdate">您的出生日期</label>
            <input
              type="date"
              id="birthdate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            {getLifePreview()}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || !birthDate}
          >
            {isSubmitting ? '开启旅程...' : '开启生命倒计时'}
          </button>
        </form>

        <p className="privacy-note">
          您的数据仅存储在本地，我们尊重您的隐私
        </p>
      </div>

      {/* 背景粒子效果 */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${Math.random() * 5}s`,
            '--x': `${Math.random() * 100}%`,
            '--duration': `${5 + Math.random() * 5}s`
          }} />
        ))}
      </div>
    </div>
  )
}
