###### 贷款风险评估系统前端项目（chenjinjin 20251117~20251219）

## 1.项目简介

基于 React 框架开发，提供个人贷款和企业贷款两种申请类型。
系统支持用户登录、企业贷款信息填写、文件上传、信息确认以及贷款风险结果等功能。

## 2.技术栈

- **前端框架**: React
- **路由管理**: React Router
- **构建工具**: Vite

## 3.功能模块

# 3.1. 登录模块

- 个人/企业登录

# 3.2. 贷款申请模块

- **个人贷款申请**: 提供个人用户贷款信息界面（只做跳转用）
- **企业贷款申请**: 提供企业用户贷款信息填写界面，包括企业基本信息、贷款信息等

# 3.3. 表单组件

- **InputField**: 通用输入框组件
- **SelectField**: 下拉选择框组件
- **FileUploadField**: 文件上传组件

# 3.4. 信息确认模块

- 贷款信息填写与确认
- 数据完整性检查

# 3.5. 结果展示模块

- 贷款风险评估信息显示

## 6.页面

login 登录页面
personal-loan-application 个人贷款申请页面
corporation-loan-application 企业贷款申请页面
loan-information-confirmation 贷款信息确认页面
loan-result 贷款结果页面

## 7.核心 API 接口

submitPersonalLoan(applicationData): 提交个人贷款申请
submitCorporationLoan(applicationData): 提交企业贷款申请
checkDataIntegrity(data): 检查数据完整性
confirmLoanApplication(applicationId): 确认贷款申请

## 8.项目编译启动

# 构建生产版本

npm run build

# 安装依赖

npm install

# 开发环境运行

npm run dev
