import './Privacy.css'

export default function Privacy({ onClose }) {
  return (
    <div className="privacy">
      <div className="privacy-container">
        <header className="privacy-header">
          <button className="close-btn" onClick={onClose}>← 返回</button>
          <h2>隐私政策</h2>
          <div />
        </header>

        <div className="privacy-content">
          <section>
            <h3>数据收集</h3>
            <p>
              WayBack 尊重您的隐私。我们仅收集提供服务所必需的数据：
            </p>
            <ul>
              <li>出生日期（用于计算生命倒计时）</li>
              <li>您主动记录的日记内容</li>
              <li>您添加的意义清单项目</li>
            </ul>
          </section>

          <section>
            <h3>数据存储</h3>
            <p>
              您的数据仅存储在您设备的本地存储中（localStorage）。
              我们不会将您的数据上传到任何服务器。
            </p>
          </section>

          <section>
            <h3>数据使用</h3>
            <p>
              我们使用本地存储的数据为您提供以下服务：
            </p>
            <ul>
              <li>生命倒计时计算</li>
              <li>日记内容的情感分析（本地模拟）</li>
              <li>意义清单管理</li>
            </ul>
          </section>

          <section>
            <h3>数据导出</h3>
            <p>
              您可以随时通过设置页面的"导出数据"功能下载您的所有数据。
            </p>
          </section>

          <section>
            <h3>联系我们</h3>
            <p>
              如果您有任何关于隐私的问题，请通过 GitHub 仓库联系我们。
            </p>
          </section>

          <p className="update-time">
            最后更新：2026年3月22日
          </p>
        </div>
      </div>
    </div>
  )
}
