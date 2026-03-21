import { useState, useEffect } from 'react'
import { getMeaningItems, completeMeaningItem, addMeaningItem as addItem } from '../services/userService'
import './MeaningList.css'

export default function MeaningList({ onClose, user }) {
  const [items, setItems] = useState([])
  const [newItemTitle, setNewItemTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // 加载清单
  useEffect(() => {
    if (user) {
      const userItems = getMeaningItems(user.id)
      setItems(userItems)
    }
  }, [user])

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return

    setIsAdding(true)
    addItem(user.id, newItemTitle.trim())

    // 刷新列表
    const updatedItems = getMeaningItems(user.id)
    setItems(updatedItems)
    setNewItemTitle('')
    setIsAdding(false)
  }

  const handleComplete = (itemId) => {
    completeMeaningItem(user.id, itemId)

    // 刷新列表
    const updatedItems = getMeaningItems(user.id)
    setItems(updatedItems)
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length

  return (
    <div className="meaning-list" role="main" aria-label="意义清单">
      <div className="meaning-container">
        {/* 头部 */}
        <header className="meaning-header">
          <button className="close-btn" onClick={onClose} aria-label="返回主页">← 返回</button>
          <h2>意义清单</h2>
          <div className="stats" aria-label={`完成进度：${completedCount}/${totalCount}`}>
            {completedCount}/{totalCount}
          </div>
        </header>

        {/* 进度 */}
        {totalCount > 0 && (
          <div className="progress-section" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={totalCount}>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className="progress-hint">
              完成 {completedCount} 项，获得 +{completedCount * 3} 天
            </p>
          </div>
        )}

        {/* 添加新项 */}
        <div className="add-section">
          <input
            type="text"
            className="add-input"
            placeholder="添加你的'此生必做'..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            aria-label="添加新事项"
          />
          <button
            className="add-btn"
            onClick={handleAddItem}
            disabled={!newItemTitle.trim() || isAdding}
            aria-label="添加"
          >
            +
          </button>
        </div>

        {/* 清单列表 */}
        <div className="items-list" role="list" aria-label="意义清单列表">
          {items.length === 0 ? (
            <div className="empty-state" role="status">
              <div className="empty-icon" aria-hidden="true">⭐</div>
              <p>还没有意义清单</p>
              <p className="hint">添加你此生必做的事情</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className={`item-card ${item.completed ? 'completed' : ''}`}
                role="listitem"
              >
                <button
                  className="checkbox"
                  onClick={() => !item.completed && handleComplete(item.id)}
                  disabled={item.completed}
                  aria-label={item.completed ? '已完成' : '标记为完成'}
                >
                  {item.completed ? '✓' : ''}
                </button>

                <div className="item-content">
                  <p className="item-title">{item.title}</p>
                  {item.completed && item.completedAt && (
                    <p className="completed-date">
                      已完成 · {new Date(item.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {!item.completed && (
                  <div className="reward-badge">
                    +3天
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 说明 */}
        <div className="info-section">
          <p>每完成一项意义清单，将获得 <span className="highlight">+3天</span> 生命奖励</p>
        </div>
      </div>
    </div>
  )
}
