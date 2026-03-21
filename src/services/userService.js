// 用户服务 - 模拟后端 API
// MVP 阶段使用 localStorage 存储数据

const STORAGE_KEYS = {
  USER: 'wayback_user',
  DIARY_LOGS: 'wayback_diary_logs',
  MEANING_LIST: 'wayback_meaning_list'
}

// 常量
const LIFE_EXPECTANCY_YEARS = 78 // 预期寿命
const SECONDS_PER_DAY = 86400
const COMPLETION_REWARD_SECONDS = 259200 // 3天 = 259200秒

/**
 * 计算初始生命秒数
 * @param {string} birthDate - 出生日期 YYYY-MM-DD
 * @returns {number} 生命秒数
 */
export function calculateLifeSeconds(birthDate) {
  const birth = new Date(birthDate)
  const now = new Date()

  // 计算年龄（年）
  let ageYears = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    ageYears--
  }

  // 剩余年
  const remainingYears = Math.max(0, LIFE_EXPECTANCY_YEARS - ageYears)

  // 转换为秒
  return Math.floor(remainingYears * 365.25 * 24 * 60 * 60)
}

/**
 * 格式化生命秒数为可读格式
 * @param {number} seconds - 秒数
 * @returns {object} { years, days, hours, minutes, seconds }
 */
export function formatLifeTime(seconds) {
  const years = Math.floor(seconds / (365.25 * 24 * 60 * 60))
  const remainingAfterYears = seconds % Math.floor(365.25 * 24 * 60 * 60)

  const days = Math.floor(remainingAfterYears / (24 * 60 * 60))
  const remainingAfterDays = remainingAfterYears % (24 * 60 * 60)

  const hours = Math.floor(remainingAfterDays / (60 * 60))
  const remainingAfterHours = remainingAfterDays % (60 * 60)

  const minutes = Math.floor(remainingAfterHours / 60)
  const secs = remainingAfterHours % 60

  return { years, days, hours, minutes, seconds: secs }
}

// ==================== 用户操作 ====================

/**
 * 创建新用户
 */
export function createUser(birthDate) {
  const user = {
    id: generateId(),
    birthDate,
    createdAt: new Date().toISOString(),
    currentLifeSeconds: calculateLifeSeconds(birthDate),
    dailyLogCount: 0,
    lastLogDate: null
  }

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  return user
}

/**
 * 获取当前用户
 */
export function getUser() {
  const userData = localStorage.getItem(STORAGE_KEYS.USER)
  return userData ? JSON.parse(userData) : null
}

/**
 * 更新用户生命秒数
 */
export function updateLifeSeconds(userId, deltaSeconds) {
  const user = getUser()
  if (!user || user.id !== userId) return null

  // 限制 delta 范围 [-14400, 14400] (±4小时)
  const clampedDelta = Math.max(-14400, Math.min(14400, deltaSeconds))

  user.currentLifeSeconds = Math.max(0, user.currentLifeSeconds + clampedDelta)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

  return user
}

// ==================== 日记操作 ====================

/**
 * 分析日记（模拟 LLM 响应）
 */
export async function analyzeDiary(text) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 简单的情感分析模拟
  const positiveKeywords = ['好', '开心', '快乐', '学习', '锻炼', '成长', '进步', '收获', '满足', '感恩', '努力', '坚持']
  const negativeKeywords = ['累', '烦', '焦虑', '难过', '失望', '压力', '困', '疲惫', '迷茫', '郁闷']

  let positiveCount = 0
  let negativeCount = 0

  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) positiveCount++
  })

  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) negativeCount++
  })

  let sentiment = 'neutral'
  let timeDeltaSeconds = 0
  let analysis = ''

  if (positiveCount > negativeCount) {
    sentiment = 'positive'
    timeDeltaSeconds = Math.min(14400, positiveCount * 1800) // 最多4小时
    analysis = generatePositiveAnalysis(positiveCount)
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative'
    timeDeltaSeconds = -Math.min(14400, negativeCount * 1800)
    analysis = generateNegativeAnalysis(negativeCount)
  } else {
    sentiment = 'neutral'
    timeDeltaSeconds = 0
    analysis = '今天你的记录平淡而真实。保持记录的习惯，就是对生命的尊重。'
  }

  return {
    timeDeltaSeconds,
    sentiment,
    analysis
  }
}

function generatePositiveAnalysis(count) {
  const analyses = [
    '看到你今天的积极状态，真为你高兴！保持这种正能量，你的生命会更有质量。',
    '美好的一天给你带来了积极的能量。珍惜当下，继续前行！',
    '你的努力和开心都在这个记录里。每一天都是生命的礼物。',
    '积极面对生活的你，真的很棒！让这样的日子越来越多。'
  ]
  return analyses[Math.min(count - 1, analyses.length - 1)]
}

function generateNegativeAnalysis(count) {
  const analyses = [
    '今天可能有点艰难，但请记得，黑夜之后一定是黎明。',
    '生活中总会有不如意的时刻，这很正常。重要的是我们如何面对。',
    '即使今天感觉不好，你依然在记录、在反思。这本身就很勇敢。',
    '别忘了照顾好自己。每一天都值得被认真对待。'
  ]
  return analyses[Math.min(count - 1, analyses.length - 1)]
}

/**
 * 保存日记记录
 */
export function saveDiaryLog(userId, log) {
  const logs = getDiaryLogs()
  logs.push({
    id: generateId(),
    userId,
    ...log,
    createdAt: new Date().toISOString()
  })
  localStorage.setItem(STORAGE_KEYS.DIARY_LOGS, JSON.stringify(logs))

  // 更新用户的日记计数
  const user = getUser()
  if (user) {
    user.dailyLogCount++
    user.lastLogDate = log.date
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  return logs
}

/**
 * 获取日记记录
 */
export function getDiaryLogs(userId) {
  const logs = localStorage.getItem(STORAGE_KEYS.DIARY_LOGS)
  const allLogs = logs ? JSON.parse(logs) : []
  return userId ? allLogs.filter(log => log.userId === userId) : allLogs
}

// ==================== 意义清单操作 ====================

/**
 * 添加意义清单项
 */
export function addMeaningItem(userId, title) {
  const items = getMeaningItems()
  items.push({
    id: generateId(),
    userId,
    title,
    completed: false,
    createdAt: new Date().toISOString()
  })
  localStorage.setItem(STORAGE_KEYS.MEANING_LIST, JSON.stringify(items))
  return getUser()
}

/**
 * 完成意义清单项
 */
export function completeMeaningItem(userId, itemId) {
  const items = getMeaningItems()
  const item = items.find(i => i.id === itemId)

  if (item && !item.completed) {
    item.completed = true
    item.completedAt = new Date().toISOString()

    // 奖励秒数
    const user = getUser()
    if (user) {
      user.currentLifeSeconds += COMPLETION_REWARD_SECONDS
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    }

    localStorage.setItem(STORAGE_KEYS.MEANING_LIST, JSON.stringify(items))
  }

  return getUser()
}

/**
 * 获取意义清单
 */
export function getMeaningItems(userId) {
  const items = localStorage.getItem(STORAGE_KEYS.MEANING_LIST)
  const allItems = items ? JSON.parse(items) : []
  return userId ? allItems.filter(item => item.userId === userId) : allItems
}

// ==================== 工具函数 ====================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 导出服务对象
export const userService = {
  createUser,
  getUser,
  updateLifeSeconds,
  analyzeDiary,
  saveDiaryLog,
  getDiaryLogs,
  addMeaningItem,
  completeMeaningItem,
  getMeaningItems,
  calculateLifeSeconds,
  formatLifeTime
}
