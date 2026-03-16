-- =====================================================
-- CREATE DATABASE
-- =====================================================
CREATE DATABASE IF NOT EXISTS learning_english;
USE learning_english;

-- =====================================================
-- BẢNG USERS
-- =====================================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG USER WORDS
-- =====================================================
CREATE TABLE user_words (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  english_word VARCHAR(255) NOT NULL,
  word_type ENUM('noun', 'verb', 'adj', 'adv', 'prep', 'conj', 'interj', 'phrase') NOT NULL DEFAULT 'noun',
  vietnamese_meaning TEXT NOT NULL,
  mastery_level INT DEFAULT 0,
  last_reviewed_at DATETIME,
  UNIQUE KEY unique_user_word (user_id, english_word),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_word_type (user_id, word_type),
  INDEX idx_user_mastery (user_id, mastery_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG QUIZ ATTEMPTS
-- =====================================================
CREATE TABLE quiz_attempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME,
  total_questions INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  score FLOAT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG QUIZ ITEMS
-- =====================================================
CREATE TABLE quiz_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  attempt_id INT NOT NULL,
  user_word_id INT NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  user_answer VARCHAR(255),
  is_correct BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_word_id) REFERENCES user_words(id) ON DELETE CASCADE,
  INDEX idx_attempt_id (attempt_id),
  INDEX idx_user_word_id (user_word_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA (TÙY CHỌN)
-- =====================================================
-- INSERT INTO users (username, email, password) VALUES
-- ('testuser', 'test@example.com', 'hashed_password_here');
