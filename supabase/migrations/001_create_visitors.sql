CREATE TABLE IF NOT EXISTS visitors (
  id         BIGSERIAL PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  count      BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visitors_key_idx ON visitors(key);

CREATE OR REPLACE FUNCTION increment_visitor(p_key TEXT)
RETURNS BIGINT AS $$
DECLARE
  new_count BIGINT;
BEGIN
  INSERT INTO visitors (key, count, updated_at)
  VALUES (p_key, 1, NOW())
  ON CONFLICT (key)
  DO UPDATE SET
    count = visitors.count + 1,
    updated_at = NOW()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;
