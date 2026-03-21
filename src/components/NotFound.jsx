import './NotFound.css'

export default function NotFound({ onGoHome }) {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>页面未找到</h1>
        <p>抱歉，您访问的页面不存在</p>
        <button onClick={onGoHome} className="home-btn">
          返回首页
        </button>
      </div>
    </div>
  )
}
