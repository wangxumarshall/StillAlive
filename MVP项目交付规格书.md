# 《归途》MVP综合项目交付规格书 (v2.0)

项目代号： Project WayBack

版本： 2.0 (MVP)

核心指令： 请根据本规格书的全部内容，生成一个功能完整、可部署的微信小程序MVP版本及其所需的后端服务。此版本核心功能为：使用LLM分析用户输入的每日总结，以动态评估生命的增减。

### 1. 需求分析 (Requirements Analysis)

#### 1.1 软件需求规格说明书 (SRS)

- **1.1.1 产品概述：** 本产品是一款名为《归途》的人生意义激励与量化工具。MVP版本的核心是通过一个动态的“生命时钟”，以及每日行为记录反馈机制，激励用户关注生命质量，活在当下。
    
- **1.1.2 用户画像：** 25-45岁的都市人群，对个人成长、生命意义有思考，需要外部激励来对抗迷茫和拖延。
    
- **1.1.3 功能性需求 (Functional Requirements):**
    
    - **FR-01: 用户初始化流程 (Onboarding)**
        
        - FR-01-1: 系统必须允许首次使用的用户输入其出生年月日。
            
        - FR-01-2: 系统必须基于用户输入的出生日期和预设的平均寿命（78岁）计算出初始的生命剩余总秒数。
            
        - FR-01-3: 系统必须持久化存储用户的出生日期和生命总秒数。
            
    - **FR-02: 生命时钟展示**
        
        - FR-02-1: 系统必须在主界面以“XX年 XX天 HH:MM:SS”的格式，实时、不间断地显示生命倒计时。
            
        - FR-02-2: 倒计时必须每秒精确地减1。
            
    - **FR-03: 时间账户记录 (LLM分析版)**
        
        - FR-03-1: 系统必须提供一个文本输入界面，允许用户每日**撰写一篇关于当天的总结**（建议50字以上）。
            
        - FR-03-2: 系统必须限制用户每天只能提交一次总结。
            
        - FR-03-3: 系统必须将用户输入的文本发送给一个大型语言模型（LLM）进行分析。LLM需要根据文本内容，评估用户当天的生活状态（包括身体、心智、情感等维度），并**返回一个结构化的JSON对象，其中包含时间的增减量（秒）和一段分析理由**。
            
        - FR-03-4: 系统必须将LLM返回的时间增减量更新到用户的生命总秒数中。
            
        - FR-03-5: 系统必须在前端向用户展示LLM返回的分析理由，作为本次评估的反馈。
            
    - **FR-04: 意义清单管理**
        
        - FR-04-1: 系统必须允许用户添加、查看“此生必做”的事件列表。
            
        - FR-04-2: 系统必须允许用户将列表中的事件标记为“已完成”。
            
        - FR-04-3: 当用户完成一个事件时，系统必须给予一次性、固定值的生命时间奖励（+3天）。
            
- **1.1.4 非功能性需求 (Non-Functional Requirements):**
    
    - **NFR-01 (性能):** 主界面时钟的更新必须流畅，CPU占用率低。所有数据交互的响应时间应在1.5秒以内。
        
    - **NFR-02 (可用性):** 界面必须极简，无广告，核心操作（上滑记录）必须符合直觉。
        
    - **NFR-03 (可靠性):** 用户生命数据必须安全存储在云端，应用重启或更换设备后数据不丢失。每日记录状态必须在服务器时间零点准确重置。
        
    - **NFR-04 (AI交互):** LLM分析过程的等待时间应有明确的加载提示。LLM的分析结果必须以清晰、易于理解的方式呈现给用户。
        

#### 1.2 需求可追溯矩阵 (RTM)

|   |   |   |   |   |
|---|---|---|---|---|
|**需求ID**|**需求描述**|**设计模块**|**开发任务**|**测试用例ID**|
|FR-01|用户初始化|Onboarding 弹窗/页面|`UserSetup.js`, `api/createUser`|`TC-01-XX`|
|FR-02|生命时钟展示|主界面 (HomePage)|`LifeClock.component`, `TimerService`|`TC-02-XX`|
|FR-03|时间账户记录 (LLM版)|文本输入面板 (LogPanel)|`LogPanel.component`, `api/analyzeDay`|`TC-03-XX`|
|FR-04|意义清单管理|意义清单页面 (MeaningList)|`MeaningList.page`, `api/meaning`|`TC-04-XX`|

### 2. 方案设计 (Solution Design)

#### 2.1 UI/UX 设计

- **2.1.1 视觉风格：** 深邃、宁静、科技感。
    
- **2.1.2 色彩规范：**
    
    - 主背景: `#0C0A14` (深空黑)
        
    - 主文字/时钟: `#EAEAEA` (星光白)
        
    - 强调色/图标: `#D4AF37` (暗金色)
        
    - 积极反馈: `#7DF9FF` (冰川蓝辉光)
        
    - 消极反馈: `#4A4A4A` (深灰色)
        
- **2.1.3 字体规范：**
    
    - 倒计时数字: `Inter` 或系统无衬线字体，字重 `Light`。
        
    - 引导文字/Slogan: 系统衬线字体 (如宋体)，营造诗意。
        
- **2.1.4 布局：**
    
    - 所有核心元素垂直居中对齐。
        
    - 采用响应式布局，适配不同尺寸的手机屏幕。
        
    - 保持大量的负空间（留白），营造空灵感。
        

#### 2.2 系统架构图 (Mermaid.js 格式)

```
graph TD
    subgraph 微信小程序 (Client)
        A[用户界面 WXML/WXSS]
        B[交互逻辑 JavaScript]
        C[微信小程序API]
    end

    subgraph 云服务 (Backend)
        D[API 网关]
        E[云函数 Node.js]
        F[云数据库 Firestore]
        G[LLM API (如 Gemini)]
    end

    A -- 用户操作 --> B
    B -- 调用 --> C
    C -- HTTPS请求 (用户日记) --> D
    D -- 触发 --> E
    E -- 构造Prompt, 调用 --> G
    G -- 返回分析结果 (JSON) --> E
    E -- 解析结果, 读/写 --> F
    F -- 数据同步 --> E
    E -- 返回数据 (分析理由) --> D
    D -- 响应 --> C
    C -- 更新 --> B
    B -- 渲染 (显示分析和新时间) --> A
```

### 3. 交互设计 (Interaction Design)

- **3.1 用户流程图 (User Flow):**
    
    - `新用户` -> `打开小程序` -> `显示Onboarding引导` -> `输入生日` -> `进入主界面`
        
    - `主界面` -> `上滑` -> `拉出文本输入面板` -> `输入当日总结` -> `点击确认` -> `显示“正在分析...”加载动画` -> `面板收回` -> `时钟数字滚动更新` -> `同时弹出卡片显示LLM分析理由` -> `返回主界面`
        
    - `主界面` -> `点击意义清单入口` -> `进入清单页面` -> `添加/完成事件` -> `返回主界面`
        
- **3.2 核心交互动画详述：**
    
    - **Onboarding 数字汇聚:** 使用 `canvas` 或 `CSS` 粒子动画，从屏幕四周随机生成光点，利用 `cubic-bezier(0.4, 0, 0.2, 1)` 缓动曲线汇聚到屏幕中心，组成初始倒计时数字。
        
    - **时钟滚动更新:** 数字的每一位（年、天、时、分、秒）都封装成一个组件。更新时，该组件内的数字列表进行 `transform: translateY(-N * digit_height)` 的滚动动画，模拟老式翻页钟效果。
        
    - **时间账户面板:** 面板从底部滑出后，呈现为一个带有“记录你的一天...”占位符的文本输入区域 (`<textarea>`)。
        
    - **AI分析加载动画:** 点击确认后，按钮变为加载状态，同时面板中央出现一个由光点组成的、类似“大脑思考”的动态效果。
        
    - **结果反馈:** 分析完成后，主界面时钟更新的同时，从屏幕下方弹出一个简洁的卡片，标题是“今日回响”，内容是LLM返回的分析理由。卡片在5-7秒后自动收回。
        

### 4. 开发 (Development)

#### 4.1 前端开发 (微信小程序)

- **技术栈:** 原生微信小程序框架 (WXML, WXSS, JavaScript)
    
- **组件划分:**
    
    - `pages/index/index`: 主页面，承载生命时钟和核心交互。
        
    - `components/LifeClock/LifeClock`: 倒计时显示组件，接收总秒数，内部处理格式化和逐秒递减。
        
    - `components/Onboarding/Onboarding`: 首次加载的引导和生日输入组件。
        
    - `components/LogPanel/LogPanel`: 时间账户记录面板，包含`<textarea>`用于文本输入，并处理提交、加载中、显示结果反馈卡片的逻辑。
        
    - `pages/meaning/meaning`: 意义清单页面。
        
- **核心逻辑:**
    
    - 使用 `setInterval` 实现每秒更新时钟。
        
    - 在 `app.js` 中管理全局用户状态和登录逻辑。
        
    - 封装 `wx.request` 为统一的API服务模块。
        

#### 4.2 后端开发 (Firebase Cloud Functions)

- **技术栈:** Node.js + Firebase Admin SDK + Google AI SDK (for Gemini)
    
- **API Endpoints:**
    
    - `POST /users`: 创建用户，写入 `birthDate`，计算并写入 `initialLifeExpectancySeconds` 和 `currentLifeTotalSeconds`。
        
    - `POST /users/{userId}/analyzeDay`:
        
        1. **接收参数:** `{ "summaryText": "用户输入的日记内容" }`
            
        2. **构造Prompt:** 创建一个精心设计的Prompt，指示LLM扮演“生命导师”的角色，分析文本并返回特定格式的JSON。
            
            - **Prompt示例:**
                
                ```
                As a life mentor, analyze the following daily summary from a user of the 'The Way Back' app. Based on their physical activity, mental growth, emotional state, and meaningful interactions, evaluate its overall impact on their life's quality and length. Respond ONLY with a JSON object in the following format: {"timeDeltaSeconds": <Integer>, "analysis": "<Your analysis in Chinese>", "sentiment": "<positive|negative|neutral>"}. 'timeDeltaSeconds' should be an integer between -14400 (-4 hours) and +14400 (+4 hours).
                
                User's summary: "${summaryText}"
                ```
                
        3. **调用LLM:** 使用Google AI SDK将Prompt发送给Gemini模型。
            
        4. **解析与验证:** 解析返回的JSON字符串。验证`timeDeltaSeconds`是否为数字且在规定范围内。如果解析失败或数据无效，则返回一个默认/中性的结果（如 `timeDeltaSeconds: 0`）。
            
        5. **更新数据库:** 使用 `FieldValue.increment()` 原子性地更新 `currentLifeTotalSeconds`。
            
        6. **返回结果:** 将 `timeDeltaSeconds` 和 `analysis` 返回给前端。
            
    - `POST /users/{userId}/meaning-list`: 添加新的清单条目。
        
    - `PUT /users/{userId}/meaning-list/{itemId}`: 更新条目状态为 `completed`，并给用户增加 `259200` 秒。
        

### 5. 验证测试 (Validation & Testing)

#### 5.1 测试用例 (Test Cases)

- **5.1.1 单元测试 (Unit Tests):**
    
    - **TC-UT-01:** 测试 `calculateInitialSeconds(birthDate)` 函数，输入不同生日，验证返回的秒数是否正确。
        
    - **TC-UT-02:** 测试 `formatSeconds(totalSeconds)` 函数，输入不同秒数，验证返回的 `XX年 XX天 HH:MM:SS` 格式是否正确。
        
- **5.1.2 集成测试 (Integration Tests):**
    
    - **TC-IT-01 (LLM分析):** 测试“分析日记”流程。
        
        - **输入1 (积极):** "今天坚持健身1小时，还读完了一本书的三个章节，晚上和家人的谈心也很愉快。" -> **预期:** 后端返回正向的 `timeDeltaSeconds` 和积极的 `analysis`，数据库中用户时间增加。
            
        - **输入2 (消极):** "熬夜打游戏到凌晨三点，白天工作效率很低，还因为小事和同事吵了一架。" -> **预期:** 后端返回负向的 `timeDeltaSeconds` 和警示性的 `analysis`，数据库中用户时间减少。
            
        - **输入3 (无效/模糊):** "就那样吧。" -> **预期:** 后端返回接近0的 `timeDeltaSeconds` 和中性的 `analysis`。
            
    - **TC-IT-02 (意义清单):** 测试“完成意义事件”流程。在前端标记完成后，验证后端 `meaningList` 条目状态是否变为 `completed`，且 `currentLifeTotalSeconds` 是否增加了 `259200`。
        
- **5.1.3 系统测试 (System Tests):**
    
    - **TC-ST-01:** 模拟一个完整的新用户生命周期。从首次打开、输入生日、连续三天记录不同类型的日记文本、添加并完成一个意义事件，验证整个流程无数据错误或应用崩溃。
        
- **5.1.4 用户验收测试 (UAT) Checklist:**
    
    - [ ] Onboarding 流程是否清晰易懂？
        
    - [ ] 主界面的倒计时是否给人带来适度的紧迫感，而非过度焦虑？
        
    - [ ] 上滑记录的操作是否流畅自然？
        
    - [ ] 提交一天记录后的动画反馈是否令人愉悦且有成就感？
        
    - [ ] 整个应用的视觉风格是否符合“宁静”和“深邃”的定位？
        
    - [ ] LLM的分析反馈是否感觉“智能”和“贴切”？
        
    - [ ] AI给出的生命时间增减，体感上是否公平合理？
