# 模板仓库架构方案

## 整体架构（两层）

```
┌────────────────────────────────────────────────────────────┐
│                         CLI 层                              │
│                                                            │
│  职责：                                                     │
│  1. 拉取模板注册表，展示可用模板列表                           │
│  2. 根据用户选择的模板，读取其 manifest.json                  │
│  3. 基于 manifest 动态生成交互式问题                          │
│  4. 收集用户输入，校验，生成标准化配置对象                      │
│  5. 调用执行层                                              │
└──────────────────────────┬─────────────────────────────────┘
                           │ 
                           │  { templateId, config }
                           ▼
┌────────────────────────────────────────────────────────────┐
│                        执行层                               │
│                                                            │
│  职责：                                                     │
│  1. 下载/拷贝模板到临时目录                                   │
│  2. 读取模板内的 template.config.js                         │
│  3. 执行模板引擎处理（变量替换、条件渲染）                      │
│  4. 执行文件操作（增删改、重命名）                             │
│  5. 清理临时文件，输出最终目录                                │
└────────────────────────────────────────────────────────────┘
```

---

## 模板仓库结构

```
my-templates/
├── registry.json                 # 模板注册表
└── templates/
    ├── vue-admin/
    │   ├── manifest.json         # 模板元信息 + 配置项声明
    │   ├── template.config.js    # 模板处理逻辑（可选）
    │   └── template/             # 实际模板文件
    │       ├── package.json.ejs
    │       ├── src/
    │       └── ...
    ├── react-app/
    │   ├── manifest.json
    │   ├── template.config.js
    │   └── template/
    └── ...
```

---

## 核心文件规范

### 1. registry.json — 模板注册表

```json
{
  "templates": [
    {
      "id": "vue-admin",
      "name": "Vue 后台管理模板",
      "description": "基于 Vue3 + Vite + Element Plus",
      "version": "1.0.0"
    },
    {
      "id": "react-app",
      "name": "React 应用模板",
      "description": "基于 React 18 + Vite",
      "version": "1.0.0"
    }
  ]
}
```

### 2. manifest.json — 模板配置声明

每个模板必须有，用于告诉 CLI 需要收集哪些配置：

```json
{
  "id": "vue-admin",
  "name": "Vue 后台管理模板",
  "version": "1.0.0",
  "prompts": [
    {
      "name": "projectName",
      "type": "text",
      "message": "项目名称",
      "default": "my-project",
      "required": true
    },
    {
      "name": "useTypeScript",
      "type": "confirm",
      "message": "是否使用 TypeScript",
      "default": true
    },
    {
      "name": "cssPreprocessor",
      "type": "select",
      "message": "CSS 预处理器",
      "options": [
        { "label": "None", "value": "none" },
        { "label": "Sass", "value": "sass" },
        { "label": "Less", "value": "less" }
      ],
      "default": "sass"
    },
    {
      "name": "features",
      "type": "multiselect",
      "message": "选择需要的功能",
      "options": [
        { "label": "ESLint", "value": "eslint" },
        { "label": "Prettier", "value": "prettier" },
        { "label": "Husky", "value": "husky" },
        { "label": "Mock Server", "value": "mock" }
      ],
      "default": ["eslint", "prettier"]
    }
  ]
}
```

### 3. template.config.js — 模板处理逻辑

可选文件，只有需要复杂处理时才用：

```javascript
/**
 * 模板处理配置
 * 接收用户配置，返回处理指令
 */
export default function (config) {
  const { projectName, useTypeScript, cssPreprocessor, features } = config

  return {
    // 模板变量，用于 EJS 渲染
    templateVars: {
      projectName,
      useTypeScript,
      cssPreprocessor,
      hasEslint: features.includes('eslint'),
      hasPrettier: features.includes('prettier'),
      hasHusky: features.includes('husky'),
      hasMock: features.includes('mock')
    },

    // 文件操作
    fileOperations: [
      // 条件删除
      !useTypeScript && { action: 'delete', pattern: 'tsconfig*.json' },
      !useTypeScript && { action: 'delete', pattern: '**/*.ts' },
      
      cssPreprocessor === 'none' && { action: 'delete', pattern: 'src/styles/**/*.scss' },
      cssPreprocessor === 'none' && { action: 'delete', pattern: 'src/styles/**/*.less' },
      cssPreprocessor === 'sass' && { action: 'delete', pattern: '**/*.less' },
      cssPreprocessor === 'less' && { action: 'delete', pattern: '**/*.scss' },

      !features.includes('eslint') && { action: 'delete', pattern: '.eslintrc.*' },
      !features.includes('prettier') && { action: 'delete', pattern: '.prettierrc.*' },
      !features.includes('husky') && { action: 'delete', pattern: '.husky/**' },
      !features.includes('mock') && { action: 'delete', pattern: 'mock/**' },

      // 文件重命名
      !useTypeScript && { action: 'rename', from: '**/*.ts.ejs', to: '**/*.js.ejs' }
    ].filter(Boolean),

    // 依赖处理
    dependencies: {
      add: [
        cssPreprocessor === 'sass' && 'sass',
        cssPreprocessor === 'less' && 'less',
      ].filter(Boolean),
      remove: [
        !useTypeScript && 'typescript',
        !features.includes('eslint') && 'eslint',
      ].filter(Boolean)
    }
  }
}
```

---

## 数据流

```
1. 用户执行 CLI
   │
   ▼
2. CLI 拉取 registry.json，展示模板列表
   │
   ▼
3. 用户选择模板（如 vue-admin）
   │
   ▼
4. CLI 拉取该模板的 manifest.json
   │
   ▼
5. CLI 根据manifest.prompts 生成交互式问题
   │
   ▼
6. 用户完成所有配置输入
   │
   ▼
7. CLI 生成标准化配置对象：
   {
     "templateId": "vue-admin",
     "config": {
       "projectName": "my-app",
       "useTypeScript": true,
       "cssPreprocessor": "sass",
       "features": ["eslint", "prettier"]
     }
   }
   │
   ▼
8. 执行层下载模板到临时目录
   │
   ▼
9. 执行层读取 template.config.js，传入 config，获取处理指令
   │
   ▼
10. 执行层按指令处理：
    - EJS 模板渲染
    - 文件增删
    - 依赖调整
   │
   ▼
11. 输出到目标目录，完成
```

---

## 关键设计决策

| 决策 | 说明 |
|------|------|
| **manifest 声明式配置** | CLI 不需要知道每个模板的具体配置，完全由 manifest 驱动 |
| **template.config.js 处理逻辑** | 复杂逻辑封装在模板内部，但统一由执行层调用，而非模板自己执行 |
| **EJS 作为模板引擎** | 成熟稳定，支持条件渲染、循环等 |
| **处理指令标准化** | template.config.js 返回标准化的指令对象，执行层统一解释执行 |
| **模板与逻辑分离** | template/ 目录只放模板文件，逻辑在 template.config.js |
