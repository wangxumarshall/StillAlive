import { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import LifeClock from './components/LifeClock'
import DiaryPanel from './components/DiaryPanel'
import MeaningList from './components/MeaningList'
import Settings from './components/Settings'
import { useUser } from './hooks/useUser'

function App() {
  const { user, isLoading, initializeUser } = useUser()
  const [currentView, setCurrentView] = useState('clock') // clock, diary, meaningList, settings

  // 检查是否需要 onboarding
  useEffect(() => {
    if (!isLoading && !user) {
      setCurrentView('onboarding')
    }
  }, [user, isLoading])

  const handleOnboardingComplete = (birthDate) => {
    initializeUser(birthDate)
    setCurrentView('clock')
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center" style={{ height: '100vh' }}>
        <div className="loading-spinner">
          <div className="pulse">加载中...</div>
        </div>
      </div>
    )
  }

  // 渲染对应视图
  const renderView = () => {
    switch (currentView) {
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />

      case 'diary':
        return (
          <DiaryPanel
            onClose={() => setCurrentView('clock')}
            user={user}
          />
        )

      case 'meaningList':
        return (
          <MeaningList
            onClose={() => setCurrentView('clock')}
            user={user}
          />
        )

      case 'settings':
        return (
          <Settings
            onClose={() => setCurrentView('clock')}
          />
        )

      case 'clock':
      default:
        return (
          <LifeClock
            user={user}
            onOpenDiary={() => setCurrentView('diary')}
            onOpenMeaningList={() => setCurrentView('meaningList')}
            onOpenSettings={() => setCurrentView('settings')}
          />
        )
    }
  }

  return (
    <div className="app">
      {renderView()}
    </div>
  )
}

export default App
