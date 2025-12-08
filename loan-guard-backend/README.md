# 贷款风险评估系统后端项目（chenjinjin 20251117~20251219）######

## 1. 项目简介

基于 SpringBoot+Mybatis+MySQL 框架开发的贷款风险评估系统后端服务，
提供个人贷款（只做跳转）和企业贷款的申请类型。系统支持用户登录、企业贷款信息填写、
财务数据文件上传、信息确认以及贷款风险评估结果等功能。

## 2. 技术栈

- **后端框架**：Spring Boot 3.5.7
- **ORM 框架**：MyBatis 3.0.5
- **数据库**：MySQL
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

## 4. 核心功能及实现

# 4.1. 用户认证功能

实现方式：通过 UserController 的 login 方法（/api/user/login）处理登录请求

业务流程：
验证用户名和密码参数
调用 UserService.auth 方法验证用户
验证通过后将用户 ID 存入 Session
返回 ResponseResult 封装的登录结果
数据访问：UserMapper.findByUserId 根据用户 ID 查询用户信息

# 4.2. 企业贷款申请功能

    1. 表单数据检查：
        CorporationLoanController.checkLoanApplication（/api/loan/corporation/check）

    验证统一社会信用代码格式（18 位英数字，不能纯数字或纯字母）
    验证还款账户号码（19 位数字）
    验证贷款金额（非负数）
    根据贷款类型验证期限（信用贷款不超过 5 年，税贷不超过 2 年）
    返回验证结果和表单数据

    2. 财务文件处理：
    支持上传 JSON 格式的财务证明文件
    通过 extractFinancialData 方法解析 JSON 内容,存到"C:\\uploads\\financial_files"路径
    将提取的财务数据添加到返回响应中

    3. 贷款申请保存：
        CorporationLoanController.saveLoanApplication（/api/loan/corporation/confirm）

    从 Session 获取当前登录用户 ID
    调用 CorporationLoanService.saveLoanApplication 保存申请
    创建 CorporationLoan 实体并设置相关字段
    通过 CorporationLoanMapper.insert 保存到数据库
    返回保存结果

### 5. 数据库表设计

1. user - 用户信息表
2. corporation_loan_application - 企业贷款申请表

# 数据库初始化

数据库脚本：init_database.sql

# Swagger 接口文档

http://localhost:8080/swagger-ui/index.html

# 编译项目

mvn clean install
