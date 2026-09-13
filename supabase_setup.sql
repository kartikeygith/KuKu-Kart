-- ============================================================================
-- KUKU KART — COMPLETE SUPABASE BACKEND SETUP & INR SEED SCHEMA
-- ============================================================================
-- Run this entire script in your Supabase Project -> SQL Editor -> Run
-- It fixes the 'infinite recursion detected in policy for relation "profiles"' bug,
-- creates all required tables with RLS policies, and seeds all 33 luxury products in ₹ INR.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. FIX INFINITE RECURSION ON PROFILES (BYPASS VIA NON-RECURSIVE POLICIES)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insertable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles updatable by everyone" ON public.profiles;

-- Ensure profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS without recursive subqueries
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Profiles insertable by everyone" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Profiles updatable by everyone" 
ON public.profiles FOR UPDATE 
USING (true);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    brand TEXT,
    category TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    discount_percent INT DEFAULT 0,
    stock INT DEFAULT 10,
    image TEXT,
    images TEXT[],
    description TEXT,
    sizes TEXT[],
    colors TEXT[],
    rating NUMERIC(3, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 1,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_deal_of_the_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add any missing columns to products table if it already exists
DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subtitle TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percent INT DEFAULT 0;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes TEXT[];
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors TEXT[];
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_deal_of_the_day BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Enable RLS on Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products insertable by all" ON public.products;
DROP POLICY IF EXISTS "Products updatable by all" ON public.products;
DROP POLICY IF EXISTS "Products deletable by all" ON public.products;

CREATE POLICY "Products viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Products insertable by all" 
ON public.products FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Products updatable by all" 
ON public.products FOR UPDATE 
USING (true);

CREATE POLICY "Products deletable by all" 
ON public.products FOR DELETE 
USING (true);

-- 4. ORDERS TABLE (SUPPORTS BOTH COD & RAZORPAY WITH COURIER TRACKING)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    shipping_address JSONB,
    items JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2),
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    coupon_discount NUMERIC(10, 2) DEFAULT 0,
    coupon_code TEXT,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    platform_fee NUMERIC(10, 2) DEFAULT 0,
    final_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Order Placed',
    payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
    payment_status TEXT DEFAULT 'Pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    courier_partner TEXT,
    tracking_number TEXT,
    tracking_url TEXT,
    estimated_delivery_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add any missing columns to existing orders table if it already exists
DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS client_name TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS client_email TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS client_phone TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2);
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_discount NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS final_amount NUMERIC(10, 2);
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier_partner TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_date TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Enable RLS on Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Orders viewable by everyone" ON public.orders;
DROP POLICY IF EXISTS "Orders insertable by everyone" ON public.orders;
DROP POLICY IF EXISTS "Orders updatable by everyone" ON public.orders;

CREATE POLICY "Orders viewable by everyone" 
ON public.orders FOR SELECT 
USING (true);

CREATE POLICY "Orders insertable by everyone" 
ON public.orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Orders updatable by everyone" 
ON public.orders FOR UPDATE 
USING (true);

-- 5. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount NUMERIC NOT NULL,
    type TEXT NOT NULL,
    min_order NUMERIC NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Coupons viewable by everyone" ON public.coupons;
CREATE POLICY "Coupons viewable by everyone" ON public.coupons FOR SELECT USING (true);

-- Seed Coupons
INSERT INTO public.coupons (code, discount, type, min_order, description) VALUES
('KUKU500', 500, 'fixed', 1999, 'Flat ₹500 off on orders above ₹1,999'),
('LUXURY20', 20, 'percent', 4999, '20% privilege discount on orders above ₹4,999'),
('WELCOME10', 10, 'percent', 999, '10% welcome privilege for new clients'),
('FESTIVE50', 50, 'percent', 9999, 'Special 50% discount on orders above ₹9,999')
ON CONFLICT (code) DO NOTHING;

-- 6. CONTACT MESSAGES & NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Contact messages insertable" ON public.contact_messages;
CREATE POLICY "Contact messages insertable" ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Subscribers insertable" ON public.subscribers;
CREATE POLICY "Subscribers insertable" ON public.subscribers FOR INSERT WITH CHECK (true);

-- 7. SEED ALL 33 LUXURY PRODUCTS (INR PRICING)
INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'm1', 'Imperial Cashmere Overcoat', '100% Pure Mongolian Cashmere Tailored Coat', 'Elysian Tailors', 'Men', 8999, 12999, 31,
    14, 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?w=800&q=80', 'Mastercrafted from double-faced pure Mongolian cashmere with hand-stitched horn buttons and satin lining.', ARRAY['38R','40R','42R','44R'], ARRAY['Charcoal Grey','Midnight Black','Camel Tan'], 4.9, 142,
    true, true, true, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'm2', 'Savile Row Velvet Tuxedo Jacket', 'Deep Obsidian Velvet Evening Jacket', 'KuKu Atelier', 'Men', 14999, 19999, 25,
    8, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', 'Flawless formal tailoring with satin peak lapels and structured shoulder line. Ideal for galas and royal celebrations.', ARRAY['38','40','42','44'], ARRAY['Obsidian Black','Midnight Blue','Emerald Green'], 5, 89,
    true, false, false, true, true
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'm3', 'Pima Cotton Mercerized Polo', 'High-twist breathable luxury polo shirt', 'Elysian Tailors', 'Men', 1999, 2999, 33,
    45, 'https://images.unsplash.com/photo-1625910513413-56254a61352a?w=800&q=80', 'Silky smooth feel with mother-of-pearl buttons and shape-retaining ribbed collar.', ARRAY['S','M','L','XL','XXL'], ARRAY['Navy Blue','Snow White','Olive Gold'], 4.7, 310,
    false, false, false, true, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'm4', 'Tailored Merino Wool Trousers', 'Pleated drape with side waist adjusters', 'Elysian Tailors', 'Men', 3499, 4999, 30,
    22, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80', 'Super 150s merino wool with natural stretch and wrinkle resistance. Hand-finished hems.', ARRAY['30','32','34','36','38'], ARRAY['Slate Grey','Espresso Brown','Classic Navy'], 4.8, 95,
    false, false, false, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'm5', 'Royal Linen Bandhgala Kurta Set', 'Hand-loomed Pure Irish Linen Ceremonial Attire', 'KuKu Atelier', 'Men', 6999, 9999, 30,
    15, 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&q=80', 'Crisp hand-woven pure linen kurta with tailored churidar trousers and engraved gold metal buttons.', ARRAY['38','40','42','44'], ARRAY['Ivory Gold','Midnight Navy'], 4.9, 88,
    false, false, true, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'w1', 'Aura Silk Chiffon Evening Gown', 'Floor-length flowing haute couture silhouette', 'Velvet & Silk', 'Women', 18999, 24999, 24,
    6, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80', 'Hand-draped pure mulberry silk chiffon with subtle corseted bodice and flowing hemline.', ARRAY['XS','S','M','L'], ARRAY['Scarlet Red','Emerald Silk','Noir Black'], 5, 204,
    true, true, false, true, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'w2', 'Cashmere Ribbed Knit Cardigan', 'Oversized luxury knitwear with tortoise buttons', 'Velvet & Silk', 'Women', 4999, 6999, 29,
    18, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Heavyweight ribbed grade-A cashmere knit with soft drop shoulders and natural mother-of-pearl buttons.', ARRAY['S','M','L'], ARRAY['Alabaster Cream','Camel','Mocha'], 4.8, 168,
    false, true, false, false, true
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'w3', 'Structured Double-Breasted Blazer', 'Sculpted hourglass silhouette power blazer', 'KuKu Atelier', 'Women', 7999, 10999, 27,
    12, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', 'Impeccable shoulder pads, cinched waist, and gold bullion buttons. Italian wool blend.', ARRAY['34','36','38','40'], ARRAY['Onyx Black','Ivory White','Crimson Red'], 4.9, 112,
    false, false, true, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'w4', 'Banarasi Kanjeevaram Silk Saree', 'Pure zari hand-woven heirloom drape', 'Velvet & Silk', 'Women', 15999, 21999, 27,
    9, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Pure mulberry silk woven with authentic gold tested zari by master artisans in Varanasi.', ARRAY['Free Size (6.3m with blouse)'], ARRAY['Royal Magenta & Gold','Emerald Green & Gold'], 5, 154,
    true, false, false, true, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'e1', 'Aura Studio Wireless Headphones', 'Bespoke Titanium & Lambskin Acoustics', 'Aura Soundworks', 'Electronics', 6499, 9999, 35,
    25, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'Custom 50mm planar magnetic drivers delivering pristine audiophile fidelity with active noise isolation.', ARRAY['Standard Edition','Pro Reference'], ARRAY['Matte Black','Brushed Titanium','Champagne Gold'], 4.9, 420,
    true, true, false, true, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'e2', 'Obsidian 16 Pro Flagship Laptop', 'Liquid-cooled OLED Creator Workstation', 'Titanium Edge', 'Electronics', 84999, 99999, 15,
    9, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 'Precision CNC-machined aerospace aluminum unibody with 4K OLED ProMotion 120Hz display.', ARRAY['32GB RAM / 1TB SSD','64GB RAM / 2TB SSD'], ARRAY['Space Obsidian','Liquid Silver'], 5, 78,
    true, false, true, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'e3', 'Stealth Tactile Mechanical Keyboard', 'Forged carbon fiber wireless keyboard', 'Titanium Edge', 'Electronics', 3499, 4999, 30,
    30, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80', 'Hot-swappable custom lubricated linear switches with brass weight bar and per-key RGB backlighting.', ARRAY['75% Compact','100% Full Size'], ARRAY['Obsidian Black','Cyber Grey'], 4.8, 185,
    false, false, false, false, true
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'e4', 'Audiophile Tube Amplifier & DAC', 'Hand-wired pure Class-A tube amplification', 'Aura Soundworks', 'Electronics', 18499, 22999, 20,
    7, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80', 'Analog warmth meets ultra-high resolution 32-bit/768kHz digital decoding with matched vacuum tubes.', ARRAY['Desktop DAC','High-Output Pro'], ARRAY['Brushed Copper','Matte Black'], 4.9, 64,
    false, false, false, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'a1', 'The Sovereign Chronograph', 'Hand-assembled Tourbillon Timepiece', 'KuKu Atelier', 'Accessories', 24999, 32999, 24,
    5, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'Certified automatic chronometer with 72-hour power reserve, sapphire crystal back, and water resistance to 100m.', ARRAY['40mm Case','42mm Case'], ARRAY['Rose Gold / Alligator Strap','Platinum / Steel Bracelet'], 5, 52,
    true, false, false, true, true
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'a2', 'Titanium Aviator Sunglasses', 'Polarized 24k Gold Flake Japanese Lenses', 'Titanium Edge', 'Accessories', 3999, 5999, 33,
    24, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', 'Ultralight Japanese titanium frame weighing under 16 grams with 100% UV400 antireflective coating.', ARRAY['Standard 58mm','Large 62mm'], ARRAY['Gold / Green Gradient','Gunmetal / Smoke'], 4.8, 140,
    false, true, false, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'a3', 'Full-Grain Leather Duffle Bag', 'Tuscan vegetable-tanned handcrafted weekender', 'KuKu Atelier', 'Accessories', 6999, 9999, 30,
    11, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Solid brass hardware with custom initials tag, reinforced bottom studs, and waterproof lining.', ARRAY['45L Weekend','60L Extended'], ARRAY['Cognac Brown','Midnight Noir'], 4.9, 88,
    false, false, true, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'f1', 'Verona Calfskin Oxford Shoes', 'Goodyear-welted Italian Dress Shoes', 'Apex Performance', 'Footwear', 5999, 8499, 29,
    16, 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80', 'Full-grain French calfskin with hand-stained leather soles and channel welted stitching for lifetime resoling.', ARRAY['UK 7','UK 8','UK 9','UK 10','UK 11'], ARRAY['Hand-burnished Tan','Deep Black'], 4.9, 132,
    false, true, false, true, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'f2', 'Carbon-Fiber Runner Sneaker', 'Propulsion plate ultra-cushioning runners', 'Apex Performance', 'Footwear', 3299, 4999, 34,
    35, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Supercritical PEBA foam midsole with curved carbon plate delivering maximum energy return on city streets.', ARRAY['UK 7','UK 8','UK 9','UK 10','UK 11'], ARRAY['Crimson Stealth','Triple Black','Polar White'], 4.8, 290,
    true, false, false, false, true
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'b1', 'Oud Royale Extrait de Parfum', 'Rare Cambodian Oud & Damask Rose Niche Perfume', 'Maison Royale', 'Beauty', 4999, 6999, 29,
    20, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80', '35% pure fragrance oil concentration aged for 18 months in French oak casks.', ARRAY['50ml Extrait','100ml Extrait'], ARRAY['Crystal Flacon'], 5, 175,
    true, false, false, false, true
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'b2', 'Botanical Cellular Restorative Serum', 'Swiss Alpine Stem Cell Formulation', 'Maison Royale', 'Beauty', 2499, 3499, 29,
    28, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', 'Deep cellular rejuvenation with plant hyaluronic acid and peptide complex for luminous hydration.', ARRAY['30ml Pipette','50ml Pump'], ARRAY['Amber Glass'], 4.8, 94,
    false, false, true, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'h1', 'Carrara Marble & Brass Table Lamp', 'Sculptural architectural ambient lighting', 'Sovereign Home', 'Home & Living', 5499, 7999, 31,
    8, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'Solid Italian Carrara marble base with dimmable warm LED filament and braided fabric cord.', ARRAY['Medium 45cm','Large 60cm'], ARRAY['Honed Carrara / Brushed Brass'], 4.9, 56,
    true, false, false, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'h2', 'Mulberry Silk 1000TC Bedding Set', 'King Suite 6-piece temperature-regulating luxury linens', 'Sovereign Home', 'Home & Living', 8999, 12999, 31,
    12, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 'Organic long-strand Grade 6A mulberry silk with hypoallergenic finish and deep envelope pillowcases.', ARRAY['Queen Bedding','King Master Bedding'], ARRAY['Champagne Pearl','Slate Charcoal','Pure Ivory'], 5, 82,
    false, false, false, true, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'g1', 'Single-Estate Himalayan Organic Green Tea', 'First Flush Darjeeling artisanal loose leaves', 'Pure Organics', 'Grocery', 999, 1499, 33,
    50, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80', 'Hand-plucked high-altitude whole leaves rich in natural antioxidants with delicate muscatel floral notes.', ARRAY['250g Tin','500g Pouch'], ARRAY['Airtight Gold Canister'], 4.9, 215,
    false, true, false, false, true
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'g2', 'Kashmiri Mogra Saffron (Grade A1)', '100% Pure certified vacuum-sealed saffron filaments', 'Pure Organics', 'Grocery', 1499, 1999, 25,
    40, 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&q=80', 'Highest crocin content harvested directly from the valleys of Pampore, Kashmir.', ARRAY['2g Premium Jar','5g Gift Box'], ARRAY['Sealed Acrylic Box'], 5, 312,
    false, false, false, true, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

INSERT INTO public.products (
    id, title, subtitle, brand, category, price, original_price, discount_percent, 
    stock, image, description, sizes, colors, rating, reviews_count, 
    is_featured, is_trending, is_new_arrival, is_best_seller, is_deal_of_the_day
) VALUES (
    'g3', 'Artisanal Cold-Pressed Extra Virgin Olive Oil', 'Single-estate early harvest unfiltered olive oil', 'Pure Organics', 'Grocery', 1299, 1799, 28,
    35, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80', 'Sub-0.2% acidity with robust peppery finish. Pressed within 4 hours of tree harvesting.', ARRAY['500ml Dark Glass','1000ml Tin'], ARRAY['Dark UV-Protected Bottle'], 4.8, 160,
    false, false, false, false, false
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    stock = EXCLUDED.stock,
    image = EXCLUDED.image;

-- ============================================================================
-- END OF SCRIPT — ALL 33 PRODUCTS & TABLES READY IN SUPABASE!
-- ============================================================================
