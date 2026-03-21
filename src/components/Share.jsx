import { useState } from 'react'
import { formatLifeTime } from '../services/userService'
import './Share.css'

export default function Share({ user, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(0)

  const templates = [
    {
      emoji: '⏳',
      text: '我的生命倒计时：{time}。珍惜当下，热爱生命。 #WayBack #生命倒计时'
    },
    {
      emoji: '💫',
      text: '今日已完成生命总结，我还剩下 {time}。每一天都值得被认真对待。 #WayBack #自我成长'
    },
    {
      emoji: '🌟',
      text: '通过 WayBack，我意识到生命的宝贵。剩余 {time}，我要活得更有意义！ #WayBack #珍惜时间'
    }
  ]

  const formatTime = () => {
    if (!user) return ''
    const { years, days, hours, minutes } = formatLifeTime(user.currentLifeSeconds)
    return `${years}年${days}天${hours}时${minutes}分`
  }

  const getShareText = () => {
    const template = templates[selectedTemplate]
    return template.emoji + ' ' + template.text.replace('{time}', formatTime())
  }

  const handleShare = async () => {
    const shareText = getShareText()

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WayBack 生命倒计时',
          text: shareText,
          url: window.location.href
        })
      } catch (err) {
        // 用户取消分享
      }
    } else {
      // 复制到剪贴板
      await navigator.clipboard.writeText(shareText)
      alert('已复制到剪贴板！')
    }
  }

  return (
    <div className="share">
      <div className="share-container">
        <header className="share-header">
          <button className="close-btn" onClick={onClose}>← 返回</button>
          <h2>分享</h2>
          <div />
        </header>

        <div className="share-content">
          {/* 预览 */}
          <div className="share-preview">
            <div className="preview-card">
              <div className="preview-emoji">{templates[selectedTemplate].emoji}</div>
              <p className="preview-text">{getShareText()}</p>
            </div>
          </div>

          {/* 模板选择 */}
          <div className="template-section">
            <h3>选择分享样式</h3>
            <div className="template-list">
              {templates.map((template, index) => (
                <button
                  key={index}
                  className={`template-btn ${selectedTemplate === index ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate(index)}
                >
                  <span className="template-emoji">{template.emoji}</span>
                  <span className="template-preview">
                    {template.text.substring(0, 30)}...
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 分享按钮 */}
          <button className="share-btn" onClick={handleShare}>
            {navigator.share ? '分享到社交媒体' : '复制到剪贴板'}
          </button>

          <p className="share-note">
            分享让更多人珍惜当下的每一刻
          </p>
        </div>
      </div>
    </div>
  )
}
