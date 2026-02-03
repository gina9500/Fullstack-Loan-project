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

    3. 贷款申请DB存储：
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

###### JWT认证（chenjinjin 20260121~20260303） ADD######

### 1.自定义的JWT认证流程：

# 1.1 用户登录的流程：适用于登录接口（/api/user/login）

用户发送登录请求到 /api/user/login，UserController接收请求，验证参数
调用UserService.auth()方法验证用户名和密码
验证通过后，调用JwtUtils.generateToken()生成Token
返回Token给客户端

# 1.2 API请求的认证流程：适用于除登录外的API接口（/api/loan/）

客户端发送API请求，在请求头中携带token
请求到达WebConfig配置的拦截器，拦截所有以/api/开头的请求，排除登录接口/api/user/login
JwtInterceptor拦截请求，获取Token，验证Token的有效性
验证通过后，将用户信息设置到请求属性中
继续处理请求，控制器可以通过SessionUtils获取用户信息

# 1.3 核心组件

1.JWT工具类 (JwtUtils)
功能：实现JWT Token的生成、解析和验证。

2.JWT配置属性 (JwtProperties)
功能：从application.properties中读取JWT配置。

3.JWT拦截器 (JwtInterceptor)
功能：拦截所有API请求，验证Token的有效性。

4.配置文件 (application.properties)
功能：存储JWT相关配置，如密钥和过期时间。

5.web配置类 (WebConfig)
功能：配置拦截器链，将JwtInterceptor添加到拦截器列表中。

# 2.单点登录（No11）

### 2.1 功能

实现用户在多个客户端（如浏览器）登录后，在其他客户端登录时自动退出当前客户端

业务流程：
用户在浏览器A登录 -> TokenStore保存TokenA -> 用户在浏览器B登录 -> TokenStore保存TokenB ->
浏览器A发送请求 -> TokenStore验证失败 -> 返回单点登录错误

### 2.2 核心组件

TokenStore.java - 用于存储和管理用户的有效Token，实现单点登录功能
JwtUtils.java - #getClaimsFromToken 从Token中提取用户信息
UserController - #login 登录时保存Token到TokenStore
JwtInterceptor.java - #preHandle 检查Token是否为当前有效Token（单点登录验证）

系统通过TokenStore组件实现单点登录，维护一个用户与当前有效Token的映射关系
用户每次登录生成新Token并覆盖旧Token，请求验证时检查Token是否为当前有效Token

# 3.身份证OCR自动识别

核心实现：

用户上传身份证正反面图片
后端通过PersonalLoanController.recognizeIdCard接口（/api/loan/personal/ocr）处理
调用百度OCR API进行文字识别
识别结果自动填充到前端表单

识别内容：
身份证正面：姓名、身份证号码、出生日期、身份证有效期等
身份证反面：身份证有效期

技术细节：
使用IdCardOcrService.java封装OCR识别逻辑
支持JPG格式图片
对识别结果进行格式处理
提供多重身份识别号提取机制，确保识别准确性

# 4.贷款申请提交功能

核心实现：

用户确认表单信息后提交
后端通过PersonalLoanController.submitPersonalLoan接口（/api/loan/personal/submit）处理
调用PersonalLoanService.submitPersonalLoan保存申请

处理流程：
检查用户是否已存在贷款申请记录（根据用户ID查询，不存在则创建，存在则更新）
生成唯一11位预约号（规则：年份后两位 + 月份 + 日期 + 5位随机数）
保存/更新到personal_loan_application表
返回提交结果和预约号
