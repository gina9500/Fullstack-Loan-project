CREATE DATABASE IF NOT EXISTS loanguard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE loanguard;

-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建个人贷款申请表
CREATE TABLE IF NOT EXISTS individual_loan_application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address VARCHAR(255),
    occupation VARCHAR(100),
    income VARCHAR(50),
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_term INT NOT NULL,
    loan_purpose VARCHAR(255),
    property_type VARCHAR(100),
    property_documents TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 创建企业贷款申请表
CREATE TABLE IF NOT EXISTS corporation_loan_application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    business_license VARCHAR(100),
    company_email VARCHAR(100),
    company_address VARCHAR(255),
    account_bank VARCHAR(100),
    account_no VARCHAR(100),
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_term INT NOT NULL,
    loan_purpose VARCHAR(255),
    property_type VARCHAR(100),
    property_documents TEXT,
    industry_category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 创建风险评估表
CREATE TABLE IF NOT EXISTS risk_assessment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    application_type VARCHAR(20) NOT NULL, -- individual 或 corporation
    risk_level VARCHAR(20), -- low, medium, high
    assessment_details TEXT,
    suggestions TEXT,
    assessor_id VARCHAR(50),
    assess_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建文件表
CREATE TABLE IF NOT EXISTS file (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP
);