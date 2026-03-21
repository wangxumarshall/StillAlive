import { useState, useEffect } from 'react'
import { getMeaningItems, getDiaryLogs } from '../services/userService'
import './Achievements.css'

// 成就定义
const ACHIEVEMENTS = [
  {
    id: 'first_diary',
    name: { zh: '第一次记录', en: 'First Entry' },
    description: { zh: '完成第一篇日记', en: 'Complete your first diary' },
    icon: '📝',
    condition: (stats) => stats.diaryCount >= 1
  },
  {
    id: 'streak_3',
    name: { zh: '连续3天', en: '3 Day Streak' },
    description: { zh: '连续3天记录日记', en: 'Write diary for 3 consecutive days' },
    icon: '🔥',
    condition: (stats) => stats.streak >= 3
  },
  {
    id: 'streak_7',
    name: { zh: '坚持一周', en: 'Week Warrior' },
    description: { zh: '连续7天记录日记', en: 'Write diary for 7 consecutive days' },
    icon: '💪',
    condition: (stats) => stats.streak >= 7
  },
  {
    id: 'meaning_first',
    name: { zh: '梦想起航', en: 'Dream Start' },
    description: { zh: '添加第一个意义清单', en: 'Add your first meaning item' },
    icon: '⭐',
    condition: (stats) => stats.meaningCount >= 1
  },
  {
    id: 'meaning_complete',
    name: { zh: '梦想成真', en: 'Dream Fulfilled' },
    description: { zh: '完成第一个意义清单', en: 'Complete your first meaning item' },
    icon: '🏆',
    condition: (stats) => stats.meaningCompleted >= 1
  },
  {
    id: 'meaning_5',
    name: { zh: '成就达人', en: 'Achiever' },
    description: { zh: '完成5个意义清单', en: 'Complete 5 meaning items' },
    icon: '🌟',
    condition: (stats) => stats.meaningCompleted >= 5
  },
  {
    id: 'time_positive',
    name: { zh: '时间赢家', en: 'Time Winner' },
    description: { zh: '通过日记获得额外时间', en: 'Gain extra time through diary' },
    icon: '⏰',
    condition: (stats) => stats.timeGained > 0
  },
  {
    id: 'share',
    name: { zh: '分享达人', en: 'Sharer' },
    description: { zh: '首次分享生命倒计时', en: 'Share your life countdown' },
    icon: '📤',
    condition: (stats) => stats.shared
  }
]

export default function Achievements({ user, onClose }) {
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState(null)

  const lang = localStorage.getItem('wayback_language') || 'zh'

  useEffect(() => {
    if (user) {
      // 计算统计数据
      const meaningItems = getMeaningItems(user.id)
      const diaryLogs = getDiaryLogs(user.id)

      // 计算连续天数
      let streak = 0
      if (diaryLogs.length > 0) {
        const dates = [...new Set(diaryLogs.map(d => d.date))].sort().reverse()
        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        for (let i = 0; i < dates.length; i++) {
          const logDate = new Date(dates[i])
          logDate.setHours(0, 0, 0, 0)

          const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24))

          if (diffDays === i || diffDays === i - 1) {
            streak++
          } else {
            break
          }
        }
      }

      const userStats = {
        diaryCount: diaryLogs.length,
        meaningCount: meaningItems.length,
        meaningCompleted: meaningItems.filter(m => m.completed).length,
        streak,
        timeGained: diaryLogs.filter(d => d.timeDeltaSeconds > 0).length,
        shared: false // 可以通过 localStorage 跟踪
      }

      setStats(userStats)

      // 计算已解锁的成就
      const unlocked = ACHIEVEMENTS.filter(a => a.condition(userStats))
        .map(a => a.id)

      setAchievements(unlocked)
    }
  }, [user])

  const getAchievementName = (achievement) => {
    return achievement.name[lang] || achievement.name.zh
  }

  const getAchievementDesc = (achievement) => {
    return achievement.description[lang] || achievement.description.zh
  }

  const unlockedCount = achievements.length
  const totalCount = ACHIEVEMENTS.length

  return (
    <div className="achievements">
      <div className="achievements-container">
        <header className="achievements-header">
          <button className="close-btn" onClick={onClose}>← 返回</button>
          <h2>成就</h2>
          <div />
        </header>

        <div className="achievements-content">
          {/* 进度 */}
          <div className="achievements-progress">
            <div className="progress-circle">
              <span className="progress-number">{unlockedCount}</span>
              <span className="progress-total">/{totalCount}</span>
            </div>
            <p className="progress-label">
              {lang === 'zh' ? '已解锁成就' : 'Achievements Unlocked'}
            </p>
          </div>

          {/* 成就列表 */}
          <div className="achievements-list">
            {ACHIEVEMENTS.map(achievement => {
              const isUnlocked = achievements.includes(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    {achievement.icon}
                  </div>
                  <div className="achievement-info">
                    <h3>{getAchievementName(achievement)}</h3>
                    <p>{getAchievementDesc(achievement)}</p>
                  </div>
                  {isUnlocked && (
                    <div className="achievement-check">✓</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
