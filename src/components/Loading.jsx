import './Loading.css'

export default function Loading({ message = '加载中...' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading-spinner">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      <p className="loading-message">{message}</p>
    </div>
  )
}
