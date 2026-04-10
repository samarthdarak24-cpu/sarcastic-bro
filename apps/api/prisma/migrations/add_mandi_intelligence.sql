-- Add Mandi Intelligence Tables

-- Market Events Table
CREATE TABLE IF NOT EXISTS market_events (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  affected_regions TEXT NOT NULL, -- JSON array
  affected_crops TEXT NOT NULL, -- JSON array
  price_impact DECIMAL(5,2) NOT NULL,
  source VARCHAR(100) NOT NULL,
  metadata TEXT, -- JSON object
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_severity (severity),
  INDEX idx_created_at (created_at)
);

-- Price Predictions Table
CREATE TABLE IF NOT EXISTS price_predictions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crop VARCHAR(100) NOT NULL,
  market VARCHAR(100) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  predicted_price_24h DECIMAL(10,2) NOT NULL,
  predicted_price_7d DECIMAL(10,2) NOT NULL,
  change_percent_24h DECIMAL(5,2) NOT NULL,
  change_percent_7d DECIMAL(5,2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  confidence_score INT NOT NULL,
  factors TEXT, -- JSON array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_crop (crop),
  INDEX idx_market (market),
  INDEX idx_created_at (created_at)
);

-- User Subscriptions Table (for notifications)
CREATE TABLE IF NOT EXISTS mandi_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_type VARCHAR(50) NOT NULL, -- 'region' or 'crop'
  subscription_value VARCHAR(100) NOT NULL,
  notify_on_severity VARCHAR(20) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_subscription (user_id, subscription_type, subscription_value),
  INDEX idx_user_id (user_id),
  INDEX idx_active (is_active)
);

-- Price History Table
CREATE TABLE IF NOT EXISTS mandi_price_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commodity VARCHAR(100) NOT NULL,
  market VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  change_percent DECIMAL(5,2) DEFAULT 0,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_commodity (commodity),
  INDEX idx_market (market),
  INDEX idx_recorded_at (recorded_at)
);
