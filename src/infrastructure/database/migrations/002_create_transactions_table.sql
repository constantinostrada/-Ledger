CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY,
  account_id VARCHAR(255) NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount_value NUMERIC(15, 2) NOT NULL,
  amount_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
