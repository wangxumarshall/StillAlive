import { useState } from 'react'
import { getUser, getDiaryLogs, getMeaningItems } from '../services/userService'
import './Settings.css'

export default function Settings({ onClose, onOpenPrivacy }) {
  const [message, setMessage] = useState('')

  const handleExport = () => {
    const user = getUser()
    if (!user) return

    const diaryLogs = getDiaryLogs(user.id)
    const meaningItems = getMeaningItems(user.id)

    const exportData = {
      user: {
        id: user.id,
        birthDate: user.birthDate,
        currentLifeSeconds: user.currentLifeSeconds,
        createdAt: user.createdAt
      },
      diaryLogs,
      meaningItems,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wayback-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    setMessage('数据导出成功！')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleClear = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="settings">
      <div className="settings-container">
        <header className="settings-header">
          <button className="close-btn" onClick={onClose}>← 返回</button>
          <h2>设置</h2>
          <div />
        </header>

        <div className="settings-content">
          {/* 数据管理 */}
          <section className="settings-section">
            <h3>数据管理</h3>

            <button className="settings-btn export-btn" onClick={handleExport}>
              <span className="btn-icon">📤</span>
              <span>导出数据</span>
            </button>

            <p className="hint">
              导出您的所有数据为 JSON 文件
            </p>

            <button className="settings-btn danger-btn" onClick={handleClear}>
              <span className="btn-icon">🗑️</span>
              <span>清除所有数据</span>
            </button>

            <p className="hint danger">
              清除后无法恢复，请先导出备份
            </p>
          </section>

          {message && <p className="success-message">{message}</p>}

          {/* 关于 */}
          <section className="settings-section">
            <h3>关于</h3>
            <div className="about-info">
              <p>WayBack 归途 v1.0.0</p>
              <p className="description">
                生命倒计时，珍惜当下的每一刻。
                我们无法决定生命的长度，但可以决定生命的质量。
              </p>
              <button className="privacy-link" onClick={onOpenPrivacy}>
                隐私政策
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
