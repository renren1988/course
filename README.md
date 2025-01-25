course-scheduler/
├── src/
│   ├── pages/             # 页面级HTML文件
│   │   ├── scheduling.html     # 排课主页面
│   │   ├── view-schedule.html  # 查看课表页面
│   │   └── manage.html         # 管理页面
│   │
│   ├── assets/
│   │   ├── styles/        # 全局样式
│   │   │   ├── base.css       # 基础样式
│   │   │   ├── scheduling.css # 排课页专用样式
│   │   │   └── manage.css     # 管理页专用样式
│   │   │
│   │   └── scripts/
│   │       ├── app/           # 应用核心逻辑
│   │       │   ├── modules/       # 可复用模块
│   │       │   │   ├── ScheduleManager.js
│   │       │   │   └── DateUtils.js
│   │       │   │
│   │       │   ├── pages/         # 页面入口文件
│   │       │   │   ├── scheduling.js     # 排课页逻辑
│   │       │   │   ├── view-schedule.js  # 查看页逻辑
│   │       │   │   └── manage.js         # 管理页逻辑
│   │       │   │
│   │       │   └── shared/        # 公共工具
│   │       │       └── storage.js
│   │       │
│   │       └── vendors/     # 第三方库
│   │           └── chart.js
│   │
│   └── images/          # 图片资源
│
├── package.json
└── vite.config.js       # 构建配置（可选）