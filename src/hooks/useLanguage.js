import { useState, useEffect } from 'react'

const LANGUAGES = {
  zh: {
    name: '中文',
    code: 'zh'
  },
  en: {
    name: 'English',
    code: 'en'
  }
}

export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('wayback_language')
    return saved || 'zh'
  })

  useEffect(() => {
    localStorage.setItem('wayback_language', language)
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh')
  }

  return {
    language,
    setLanguage,
    toggleLanguage,
    languages: LANGUAGES
  }
}

// 翻译文本
const translations = {
  zh: {
    // Onboarding
    welcome: '欢迎来到 WayBack',
    subtitle: '我们无法决定生命的长度，但可以决定生命的质量。让我们一起珍惜当下的每一刻。',
    birthdateLabel: '您的出生日期',
    submitBtn: '开启生命倒计时',
    submittingBtn: '开启旅程...',
    privacyNote: '您的数据仅存储在本地，我们尊重您的隐私',
    ageError: '我们服务 16-80 岁的用户',
    invalidDate: '请输入有效的日期格式',
    futureDate: '出生日期不能是今天或未来',

    // LifeClock
    appTitle: 'WayBack',
    appTagline: '珍惜当下的每一刻',
    years: '年',
    days: '天',
    hours: '时',
    minutes: '分',
    seconds: '秒',
    diaryBtn: '今日总结',
    meaningListBtn: '意义清单',
    footerText: '每一次记录，都是对生命的尊重',
    lifeProgress: '已度过 {past} 年，剩余 {remaining} 年',

    // Diary
    diaryTitle: '今日总结',
    diaryPrompt: '记录今天让你印象深刻的事情，无论是好是坏，都是生命的馈赠。',
    diaryPlaceholder: '今天发生了什么让你印象深刻的事？',
    submitDiary: '提交今日总结',
    analyzing: '生命导师思考中',
    note: '积极日记会获得时间奖励，消极日记会适当扣减。每天仅可提交一次',
    alreadySubmitted: '你今天已经提交过日记了',
    alreadySubmittedHint: '明天再来吧，保持记录的习惯',
    analysisTitle: '今日回响',

    // MeaningList
    meaningListTitle: '意义清单',
    addPlaceholder: '添加你的"此生必做"...',
    emptyTitle: '还没有意义清单',
    emptyHint: '添加你此生必做的事情',
    completed: '已完成',
    reward: '+3天',
    rewardTotal: '完成 {count} 项，获得 +{days} 天',

    // Settings
    settingsTitle: '设置',
    dataManagement: '数据管理',
    exportData: '导出数据',
    exportHint: '导出您的所有数据为 JSON 文件',
    clearData: '清除所有数据',
    clearHint: '清除后无法恢复，请先导出备份',
    about: '关于',
    version: 'WayBack 归途 v1.0.0',
    aboutDescription: '生命倒计时，珍惜当下的每一刻。我们无法决定生命的长度，但可以决定生命的质量。',

    // Privacy
    privacyTitle: '隐私政策',
    dataCollection: '数据收集',
    dataCollectionText: 'WayBack 尊重您的隐私。我们仅收集提供服务所必需的数据：',
    dataStorage: '数据存储',
    dataStorageText: '您的数据仅存储在您设备的本地存储中（localStorage）。我们不会将您的数据上传到任何服务器。',
    dataUsage: '数据使用',
    dataUsageText: '我们使用本地存储的数据为您提供以下服务：',
    dataExport: '数据导出',
    dataExportText: '您可以随时通过设置页面的"导出数据"功能下载您的所有数据。',
    contact: '联系我们',
    contactText: '如果您有任何关于隐私的问题，请通过 GitHub 仓库联系我们。',

    // Share
    shareTitle: '分享',
    sharePreview: '选择分享样式',
    shareBtn: '分享到社交媒体',
    shareNote: '分享让更多人珍惜当下的每一刻',

    // Common
    back: '返回',
    confirm: '确认',
    cancel: '取消'
  },
  en: {
    // Onboarding
    welcome: 'Welcome to WayBack',
    subtitle: "We can't decide the length of life, but we can decide its quality. Let's cherish every moment together.",
    birthdateLabel: 'Your birth date',
    submitBtn: 'Start Life Countdown',
    submittingBtn: 'Starting journey...',
    privacyNote: 'Your data is stored locally. We respect your privacy.',
    ageError: 'We serve users aged 16-80',
    invalidDate: 'Please enter a valid date',
    futureDate: 'Birth date cannot be today or in the future',

    // LifeClock
    appTitle: 'WayBack',
    appTagline: 'Cherish every moment',
    years: 'Y',
    days: 'D',
    hours: 'H',
    minutes: 'M',
    seconds: 'S',
    diaryBtn: 'Today\'s Summary',
    meaningListBtn: 'Meaning List',
    footerText: 'Every record is a respect for life',
    lifeProgress: 'Lived {past} years, {remaining} remaining',

    // Diary
    diaryTitle: 'Today\'s Summary',
    diaryPrompt: 'Record what impressed you today. Good or bad, it\'s a gift of life.',
    diaryPlaceholder: 'What impressed you today?',
    submitDiary: 'Submit Today\'s Summary',
    analyzing: 'Life mentor is thinking...',
    note: 'Positive journals get time rewards, negative ones may reduce time. Once per day.',
    alreadySubmitted: 'You already submitted today',
    alreadySubmittedHint: 'Come back tomorrow. Keep the habit!',
    analysisTitle: 'Today\'s Reflection',

    // MeaningList
    meaningListTitle: 'Meaning List',
    addPlaceholder: 'Add your "must-do" in this life...',
    emptyTitle: 'No items yet',
    emptyHint: 'Add what you must do in this life',
    completed: 'Completed',
    reward: '+3 days',
    rewardTotal: 'Completed {count} items, +{days} days',

    // Settings
    settingsTitle: 'Settings',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    exportHint: 'Export all your data as JSON file',
    clearData: 'Clear All Data',
    clearHint: 'Cannot be recovered. Please export first.',
    about: 'About',
    version: 'WayBack v1.0.0',
    aboutDescription: 'Life countdown, cherish every moment. We can\'t decide life\'s length, but we can decide its quality.',

    // Privacy
    privacyTitle: 'Privacy Policy',
    dataCollection: 'Data Collection',
    dataCollectionText: 'WayBack respects your privacy. We only collect data necessary for the service:',
    dataStorage: 'Data Storage',
    dataStorageText: 'Your data is stored only in your device\'s local storage. We never upload your data to any server.',
    dataUsage: 'Data Usage',
    dataUsageText: 'We use locally stored data to provide:',
    dataExport: 'Data Export',
    dataExportText: 'You can export all your data anytime via Settings > Export Data.',
    contact: 'Contact',
    contactText: 'For privacy questions, contact us via GitHub.',

    // Share
    shareTitle: 'Share',
    sharePreview: 'Choose share style',
    shareBtn: 'Share to Social Media',
    shareNote: 'Share to inspire others to cherish every moment',

    // Common
    back: 'Back',
    confirm: 'Confirm',
    cancel: 'Cancel'
  }
}

export function t(key, params = {}) {
  const lang = localStorage.getItem('wayback_language') || 'zh'
  let text = translations[lang]?.[key] || translations['zh'][key] || key

  // 替换参数
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param])
  })

  return text
}
