-- Create the dashboard_data table
CREATE TABLE IF NOT EXISTS dashboard_data (
    id BIGSERIAL PRIMARY KEY,
    customer_number VARCHAR(50),
    customer_name VARCHAR(255),
    business_description TEXT,
    invoice_number VARCHAR(50),
    invoice_date DATE,
    due_date DATE,
    open_amount DECIMAL(15,2),
    purchase_order VARCHAR(50),
    entity VARCHAR(10),
    aging_bucket VARCHAR(20),
    debit_credit VARCHAR(10),
    past_due INTEGER,
    over30 BOOLEAN,
    over90 BOOLEAN
);

-- Insert sample data for PPA
INSERT INTO dashboard_data (
    customer_number, customer_name, business_description, 
    invoice_number, invoice_date, due_date, open_amount,
    purchase_order, entity, aging_bucket, debit_credit,
    past_due, over30, over90
) VALUES
    ('PPA001', 'PPA Customer A', 'Manufacturing', 'INV001', '2024-01-15', '2024-02-15', 10000.00, 'PO001', 'PPA', '30-60', 'Debit', 45, true, false),
    ('PPA002', 'PPA Customer B', 'Services', 'INV002', '2023-12-01', '2024-01-01', 15000.00, 'PO002', 'PPA', '60-90', 'Debit', 60, true, false),
    ('PPA003', 'PPA Customer C', 'Retail', 'INV003', '2023-11-15', '2023-12-15', 8000.00, 'PO003', 'PPA', '90+', 'Debit', 95, true, true);

-- Insert sample data for MCS
INSERT INTO dashboard_data (
    customer_number, customer_name, business_description,
    invoice_number, invoice_date, due_date, open_amount,
    purchase_order, entity, aging_bucket, debit_credit,
    past_due, over30, over90
) VALUES
    ('MCS001', 'MCS Customer A', 'Healthcare', 'INV004', '2024-01-10', '2024-02-10', 12000.00, 'PO004', 'MCS', '30-60', 'Debit', 40, true, false),
    ('MCS002', 'MCS Customer B', 'Technology', 'INV005', '2023-12-05', '2024-01-05', 18000.00, 'PO005', 'MCS', '60-90', 'Debit', 55, true, false),
    ('MCS003', 'MCS Customer C', 'Education', 'INV006', '2023-11-20', '2023-12-20', 9500.00, 'PO006', 'MCS', '90+', 'Debit', 92, true, true);

-- Insert sample data for EPM
INSERT INTO dashboard_data (
    customer_number, customer_name, business_description,
    invoice_number, invoice_date, due_date, open_amount,
    purchase_order, entity, aging_bucket, debit_credit,
    past_due, over30, over90
) VALUES
    ('EPM001', 'EPM Customer A', 'Research', 'INV007', '2024-01-05', '2024-02-05', 11000.00, 'PO007', 'EPM', '30-60', 'Debit', 42, true, false),
    ('EPM002', 'EPM Customer B', 'Biotech', 'INV008', '2023-12-10', '2024-01-10', 16500.00, 'PO008', 'EPM', '60-90', 'Debit', 58, true, false),
    ('EPM003', 'EPM Customer C', 'Pharma', 'INV009', '2023-11-25', '2023-12-25', 8800.00, 'PO009', 'EPM', '90+', 'Debit', 91, true, true);

-- Create function to get monthly metrics
CREATE OR REPLACE FUNCTION get_monthly_metrics(p_entity text)
RETURNS TABLE (
  month_of_report text,
  over30_percentage numeric,
  over90_percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH monthly_totals AS (
    SELECT
      month_of_report,
      COUNT(*) as total_count,
      SUM(CASE WHEN over30 > 0 THEN 1 ELSE 0 END) as over30_count,
      SUM(CASE WHEN over90 > 0 THEN 1 ELSE 0 END) as over90_count
    FROM dashboard_data
    WHERE entity = p_entity
    GROUP BY month_of_report
  )
  SELECT
    month_of_report,
    ROUND((over30_count::numeric / total_count) * 100, 2) as over30_percentage,
    ROUND((over90_count::numeric / total_count) * 100, 2) as over90_percentage
  FROM monthly_totals
  ORDER BY month_of_report;
END;
$$ LANGUAGE plpgsql;

-- Create function to get performance data
CREATE OR REPLACE FUNCTION get_performance_data(p_entity text)
RETURNS TABLE (
  customer_name text,
  open_amount numeric,
  past_due integer
) AS $$
BEGIN
  RETURN QUERY
  WITH latest_month AS (
    SELECT month_of_report
    FROM dashboard_data
    WHERE entity = p_entity
    ORDER BY month_of_report DESC
    LIMIT 1
  )
  SELECT
    d.customer_name,
    d.open_amount,
    d.past_due
  FROM dashboard_data d
  JOIN latest_month lm ON d.month_of_report = lm.month_of_report
  WHERE d.entity = p_entity
    AND d.past_due > 0
  ORDER BY d.past_due DESC;
END;
$$ LANGUAGE plpgsql;

-- Create the actions_data table
CREATE TABLE IF NOT EXISTS actions_data (
    id BIGSERIAL PRIMARY KEY,
    entity VARCHAR(10) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    action_owner VARCHAR(255) NOT NULL,
    comment TEXT,
    total DECIMAL(15,2) NOT NULL DEFAULT 0,
    action_requested_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a view for sorted actions
CREATE OR REPLACE VIEW sorted_actions_data AS
SELECT * FROM actions_data
ORDER BY total DESC;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_actions_updated_at
    BEFORE UPDATE ON actions_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 