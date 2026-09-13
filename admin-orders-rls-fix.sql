-- ============================================================
-- ADMIN ORDERS RLS & DELETE FIX
-- Execute this entire script in your Supabase SQL Editor
-- ============================================================

-- Step 1: Ensure Row Level Security (RLS) is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies if they already exist to avoid errors
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

DROP POLICY IF EXISTS "Admins can view all order_items" ON order_items;
DROP POLICY IF EXISTS "Admins can delete order_items" ON order_items;
DROP POLICY IF EXISTS "Admins can update order_items" ON order_items;

-- Step 3: Create Policies for 'orders' table
-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow admins to update orders (status updates, etc.)
CREATE POLICY "Admins can update orders" ON orders
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow admins to delete orders
CREATE POLICY "Admins can delete orders" ON orders
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Step 4: Create Policies for 'order_items' table
-- Allow admins to view all order_items
CREATE POLICY "Admins can view all order_items" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow admins to delete order_items
CREATE POLICY "Admins can delete order_items" ON order_items
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Step 5: (Optional but Recommended) Enable CASCADE Delete on order_items
-- This allows deleting an order to automatically clean up all associated order items.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'order_items_order_id_fkey' AND table_name = 'order_items'
  ) THEN
    ALTER TABLE order_items DROP CONSTRAINT order_items_order_id_fkey;
    ALTER TABLE order_items 
      ADD CONSTRAINT order_items_order_id_fkey 
      FOREIGN KEY (order_id) 
      REFERENCES orders(id) 
      ON DELETE CASCADE;
  END IF;
END $$;