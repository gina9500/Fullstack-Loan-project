# 贷款风险评估系统后端项目（chenjinjin 20251117~20251219）######

## 1. 项目简介

基于 SpringBoot+Mybatis+MySQL 框架开发的贷款风险评估系统后端服务，
提供个人贷款（只做跳转）和企业贷款的申请类型。系统支持用户登录、企业贷款信息填写、
财务数据文件上传、信息确认以及贷款风险评估结果等功能。

## 2. 技术栈

- **后端框架**：Spring Boot 3.5.7
- **ORM 框架**：MyBatis 3.0.5
- **数据库**：MySQL
- **开发语言**：Java 17
- **辅助工具**：Lombok

## 3. 项目结构

loan-guard-backend/
├── src/
│ ├── main/
│ │ ├── java/com/loanguard/backend/
│ │ │ ├── LoanGuardBackendApplication.java # 应用程序入口
│ │ │ ├── controller/ # 控制器层
│ │ │ │ ├── CorporationLoanController.java # 企业贷款申请控制器
│ │ │ │ └── UserController.java # 用户控制器
│ │ │ ├── mapper/ # 数据访问层
│ │ │ │ ├── CorporationLoanMapper.java
│ │ │ │ └── UserMapper.java
│ │ │ ├── model/ # 数据模型层
│ │ │ │ ├── CorporationLoan.java
│ │ │ │ └── User.java
│ │ │ ├── scripts/ # 数据库脚本
│ │ │ │ └── init_database.sql
│ │ │ └── service/ # 业务逻辑层
│ │ │ ├── CorporationLoanService.java
│ │ │ └── UserService.java
│ │ └── resources/
│ │ ├── application.properties # 应用配置文件
│ │ └── mapper/ # MyBatis 映射文件
│ │ ├── CorporationLoanMapper.xml
│ │ └── UserMapper.xml
│ └── test/ # 测试代码
├── pom.xml # Maven 配置文件
└── README.md # 项目说明文档

## 4. 主要功能模块

### 4.1 用户管理模块

- 用户登录验证

### 4.2 贷款申请模块

- 企业贷款申请：支持企业基本信息录入、财务数据上传等
- 个人贷款申请：只做跳转

## 5. API 接口说明

### 5.1 用户相关接口

| `/api/users/login` | POST | 用户登录

### 5.2 企业贷款申请接口

| `/api/loan/infoSubmit` | POST | 创建企业贷款申请

### 6. 数据库表设计

1. user - 用户信息表
2. corporation_loan_application - 企业贷款申请表
3. file - 文件信息表

# 数据库初始化

数据库脚本：init_database.sql

# 编译项目

mvn clean install
