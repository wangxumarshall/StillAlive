import { useState, useEffect, useCallback } from 'react'
import { userService } from '../services/userService'

export function useUser() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初始化：加载本地存储的用户数据
  useEffect(() => {
    const loadedUser = userService.getUser()
    setUser(loadedUser)
    setIsLoading(false)
  }, [])

  // 初始化新用户
  const initializeUser = useCallback((birthDate) => {
    const newUser = userService.createUser(birthDate)
    setUser(newUser)
    return newUser
  }, [])

  // 更新用户生命秒数
  const updateLifeSeconds = useCallback((deltaSeconds) => {
    if (!user) return null
    const updatedUser = userService.updateLifeSeconds(user.id, deltaSeconds)
    setUser(updatedUser)
    return updatedUser
  }, [user])

  // 提交日记
  const submitDiary = useCallback(async (text) => {
    if (!user) return null

    // 调用 AI 分析（模拟）
    const analysis = await userService.analyzeDiary(text)

    // 更新生命秒数
    const updatedUser = userService.updateLifeSeconds(user.id, analysis.timeDeltaSeconds)

    // 保存日记记录
    userService.saveDiaryLog(user.id, {
      text,
      ...analysis,
      date: new Date().toISOString().split('T')[0]
    })

    setUser(updatedUser)
    return analysis
  }, [user])

  // 意义清单操作
  const addMeaningItem = useCallback((title) => {
    if (!user) return null
    const updatedUser = userService.addMeaningItem(user.id, title)
    setUser(updatedUser)
    return updatedUser
  }, [user])

  const completeMeaningItem = useCallback((itemId) => {
    if (!user) return null
    const updatedUser = userService.completeMeaningItem(user.id, itemId)
    setUser(updatedUser)
    return updatedUser
  }, [user])

  return {
    user,
    isLoading,
    initializeUser,
    updateLifeSeconds,
    submitDiary,
    addMeaningItem,
    completeMeaningItem
  }
}
