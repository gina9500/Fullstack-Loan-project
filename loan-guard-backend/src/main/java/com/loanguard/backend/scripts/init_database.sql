CREATE DATABASE IF NOT EXISTS loan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loan;
-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码,需要8位英数字',
    role VARCHAR(20) DEFAULT 'corporation',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
drop table corporation_loan_application;
-- 创建企业贷款申请表
CREATE TABLE IF NOT EXISTS corporation_loan_application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL COMMENT '关联用户ID',
    ent_name VARCHAR(255) NOT NULL COMMENT '企业名称',
    uscc VARCHAR(18) NOT NULL COMMENT '统一社会信用代码,18位数字',
    company_email VARCHAR(100) NOT NULL COMMENT '企业邮箱',
    company_address VARCHAR(255) NOT NULL COMMENT '企业地址',
    repay_account_bank VARCHAR(100) NOT NULL COMMENT '还款账户银行',
    repay_account_no VARCHAR(19) NOT NULL COMMENT '还款账户号码,19位数字',
    loan_amount DECIMAL(15, 2) NOT NULL CHECK (loan_amount > 0) COMMENT '贷款申请金额,不能为负数',
    loan_term VARCHAR(20) NOT NULL COMMENT '期限',
    loan_purpose VARCHAR(255) NOT NULL COMMENT '贷款目的',
    prop_proof_type VARCHAR(100) NOT NULL COMMENT '财产证明类型',
    industry_category VARCHAR(100) NOT NULL COMMENT '所属行业',
    status VARCHAR(20) DEFAULT 'pending',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
-- 创建文件表
CREATE TABLE IF NOT EXISTS file (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL COMMENT '关联申请ID',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_path VARCHAR(255) NOT NULL COMMENT '文件路径',
    file_type VARCHAR(50) COMMENT '文件类型',
    file_size BIGINT COMMENT '文件大小',
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES corporation_loan_application(id)
);
-- 插入测试用户数据
INSERT INTO user (user_id, password, role)
VALUES ('user1', 'user1234', 'corporation'),
    ('user2', 'user1234', 'personal');
select *
from user;