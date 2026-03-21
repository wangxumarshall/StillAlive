import { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import LifeClock from './components/LifeClock'
import DiaryPanel from './components/DiaryPanel'
import MeaningList from './components/MeaningList'
import Settings from './components/Settings'
import Privacy from './components/Privacy'
import Share from './components/Share'
import Loading from './components/Loading'
import NotFound from './components/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import { useUser } from './hooks/useUser'

function AppContent() {
  const { user, isLoading, initializeUser } = useUser()
  const [currentView, setCurrentView] = useState('clock') // clock, diary, meaningList, settings, privacy, share

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

  const handleGoHome = () => {
    setCurrentView('clock')
  }

  if (isLoading) {
    return <Loading message="加载中..." />
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
            onOpenPrivacy={() => setCurrentView('privacy')}
          />
        )

      case 'privacy':
        return (
          <Privacy
            onClose={() => setCurrentView('settings')}
          />
        )

      case 'share':
        return (
          <Share
            user={user}
            onClose={() => setCurrentView('clock')}
          />
        )

      case 'clock':
        return (
          <LifeClock
            user={user}
            onOpenDiary={() => setCurrentView('diary')}
            onOpenMeaningList={() => setCurrentView('meaningList')}
            onOpenSettings={() => setCurrentView('settings')}
            onOpenShare={() => setCurrentView('share')}
          />
        )

      default:
        return <NotFound onGoHome={handleGoHome} />
    }
  }

  return (
    <div className="app">
      {renderView()}
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App
