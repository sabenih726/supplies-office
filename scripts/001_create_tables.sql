-- Create items table for office supplies inventory
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requests table for employee requests
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name TEXT NOT NULL,
  department TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample office supplies data
INSERT INTO items (name, category, stock, unit) VALUES
('Kertas A4', 'Stationery', 100, 'rim'),
('Pulpen Biru', 'Stationery', 50, 'pcs'),
('Pulpen Hitam', 'Stationery', 45, 'pcs'),
('Spidol Whiteboard', 'Stationery', 20, 'pcs'),
('Stapler', 'Office Equipment', 15, 'pcs'),
('Isi Stapler', 'Stationery', 30, 'box'),
('Penghapus', 'Stationery', 25, 'pcs'),
('Penggaris', 'Stationery', 20, 'pcs'),
('Map Plastik', 'Filing', 40, 'pcs'),
('Amplop Coklat', 'Filing', 35, 'pcs');
