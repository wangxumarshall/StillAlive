import { useState, useEffect, useRef } from 'react'
import { formatLifeTime } from '../services/userService'
import './LifeClock.css'

export default function LifeClock({ user, onOpenDiary, onOpenMeaningList }) {
  const [timeLeft, setTimeLeft] = useState(null)
  const [prevTime, setPrevTime] = useState(null)

  // 每秒更新倒计时
  useEffect(() => {
    if (!user) return

    const calculateTimeLeft = () => {
      return user.currentLifeSeconds
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setPrevTime(timeLeft)
      setTimeLeft(prev => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [user])

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0')
  }

  if (!user || timeLeft === null) {
    return (
      <div className="life-clock loading">
        <div className="pulse">加载中...</div>
      </div>
    )
  }

  const { years, days, hours, minutes, seconds } = formatLifeTime(timeLeft)

  return (
    <div className="life-clock">
      <div className="clock-container">
        {/* 头部 */}
        <header className="clock-header">
          <h1 className="app-title">WayBack</h1>
          <p className="app-tagline">珍惜当下的每一刻</p>
        </header>

        {/* 生命时钟 */}
        <div className="countdown-display">
          <div className="countdown-unit">
            <div className="countdown-value">
              <span className="digit">{formatNumber(years)}</span>
            </div>
            <span className="unit-label">年</span>
          </div>

          <span className="separator">.</span>

          <div className="countdown-unit">
            <div className="countdown-value">
              <span className="digit">{formatNumber(days)}</span>
            </div>
            <span className="unit-label">天</span>
          </div>

          <span className="separator time-separator">:</span>

          <div className="countdown-unit">
            <div className="countdown-value">
              <span className="digit">{formatNumber(hours)}</span>
            </div>
            <span className="unit-label">时</span>
          </div>

          <span className="separator">:</span>

          <div className="countdown-unit">
            <div className="countdown-value">
              <span className="digit">{formatNumber(minutes)}</span>
            </div>
            <span className="unit-label">分</span>
          </div>

          <span className="separator">:</span>

          <div className="countdown-unit">
            <div className="countdown-value">
              <span className="digit seconds">{formatNumber(seconds)}</span>
            </div>
            <span className="unit-label">秒</span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (years / 78) * 100)}%` }}
            />
          </div>
          <p className="progress-text">
            已度过 {78 - years} 年，剩余 {years} 年
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="action-buttons">
          <button className="action-btn diary-btn" onClick={onOpenDiary}>
            <span className="btn-icon">📝</span>
            <span className="btn-text">今日总结</span>
          </button>

          <button className="action-btn meaning-btn" onClick={onOpenMeaningList}>
            <span className="btn-icon">⭐</span>
            <span className="btn-text">意义清单</span>
          </button>
        </div>

        {/* 底部提示 */}
        <footer className="clock-footer">
          <p>每一次记录，都是对生命的尊重</p>
        </footer>
      </div>

      {/* 背景星空效果 */}
      <div className="stars">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              '--delay': `${Math.random() * 3}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--size': `${2 + Math.random() * 3}px`
            }}
          />
        ))}
      </div>
    </div>
  )
}
