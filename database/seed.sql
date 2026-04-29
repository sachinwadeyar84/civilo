-- Civilo seed data: 10 sample vendors across categories
-- Run after schema.sql is applied

-- Clear any previous seed data (safe — only deletes our seed users)
DELETE FROM users WHERE phone LIKE '900000%';

-- ── Insert 10 vendor users ─────────────────────────────────
-- Password for all = 'password' (bcrypt hash)
INSERT INTO users (id, name, phone, email, password_hash, role) VALUES
('11111111-1111-1111-1111-111111111101', 'Ramesh Kumar',  '9000000001', 'ramesh@civilo.test',  '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111102', 'Priya Sharma',  '9000000002', 'priya@civilo.test',   '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111103', 'Anil Builders', '9000000003', 'anil@civilo.test',    '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111104', 'Suresh Painter','9000000004', 'suresh@civilo.test',  '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111105', 'Maya Designs',  '9000000005', 'maya@civilo.test',    '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111106', 'Quick Fix Plumbing','9000000006','quick@civilo.test','$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111107', 'Bright Spark Electric','9000000007','bright@civilo.test','$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111108', 'Kiran Renovations','9000000008','kiran@civilo.test','$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111109', 'Amit Civil Works','9000000009','amit@civilo.test',  '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor'),
('11111111-1111-1111-1111-111111111110', 'Designer Studio','9000000010','studio@civilo.test', '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST', 'vendor');

-- ── Insert vendor profiles (all approved + located in Bengaluru) ─
INSERT INTO vendor_profiles (id, user_id, business_name, bio, category, experience_years, service_area_km, lat, lng, kyc_status, rating_avg, rating_count) VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Ramesh Painting Works',     '8 years experience. Asian Paints & Berger certified. Specializes in interior + exterior.', 'painter', 8, 15, 12.9352, 77.6245, 'approved', 4.7, 142),
('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', 'Priya Interior Studio',      'Award-winning interior designer. 10+ years. Modern, minimalist, and Indian fusion styles.', 'interior_designer', 10, 20, 12.9276, 77.6371, 'approved', 4.9, 87),
('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111103', 'Anil Construction',          'Full-service contractor. Houses, offices, renovations. Trusted by 200+ clients.', 'contractor', 15, 25, 12.9719, 77.5937, 'approved', 4.5, 203),
('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111104', 'Suresh Quick Painters',      'Same-day service for small jobs. Texture, accent walls, and waterproofing.', 'painter', 5, 10, 12.9116, 77.6473, 'approved', 4.3, 56),
('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111105', 'Maya Designs',                'Boutique interior firm. Premium homes only. Featured in Architectural Digest India.', 'interior_designer', 12, 30, 12.9698, 77.7500, 'approved', 4.8, 94),
('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111106', 'Quick Fix Plumbing',         '24/7 emergency plumbing. Leak repair, pipe replacement, bathroom fittings.', 'plumber', 7, 12, 12.9200, 77.6300, 'approved', 4.6, 178),
('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111107', 'Bright Spark Electricals',   'Licensed electrician. Wiring, panels, smart home setup, fan + light installation.', 'electrician', 9, 15, 12.9580, 77.6190, 'approved', 4.7, 134),
('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111108', 'Kiran Renovation Experts',   'Kitchen + bathroom renovation specialists. End-to-end project management.', 'renovation_expert', 11, 20, 12.9400, 77.6100, 'approved', 4.6, 71),
('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111109', 'Amit Civil Engineering',     'Structural design + on-site supervision. RCC, foundations, load calculations.', 'civil_engineer', 13, 30, 12.9850, 77.6010, 'approved', 4.8, 45),
('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111110', 'Designer Studio Bangalore',  'Modern home interiors. 3D walkthroughs included. Free first consultation.', 'interior_designer', 6, 25, 12.9300, 77.6800, 'approved', 4.4, 38);

-- ── Insert services for each vendor ─────────────────────────
INSERT INTO services (vendor_id, title, description, unit, price_per_unit) VALUES
-- Ramesh Painting Works
('22222222-2222-2222-2222-222222222201', 'Interior wall painting',  'Includes priming + 2 coats of premium paint',           'sqft',    15.00),
('22222222-2222-2222-2222-222222222201', 'Exterior painting',        'Weather-resistant, 5-year warranty',                    'sqft',    22.00),
('22222222-2222-2222-2222-222222222201', 'Texture & accent walls',   'Designer textures, Royal-style finishing',              'sqft',    40.00),
-- Priya Interior Studio
('22222222-2222-2222-2222-222222222202', 'Full home interior',       'Complete 2-3 BHK design + execution',                   'lumpsum', 250000.00),
('22222222-2222-2222-2222-222222222202', 'Modular kitchen',          'Custom design with 10-year warranty',                   'lumpsum', 180000.00),
('22222222-2222-2222-2222-222222222202', 'Consultation only',        '2-hour on-site visit + design recommendations',         'visit',   2500.00),
-- Anil Construction
('22222222-2222-2222-2222-222222222203', 'New construction',         'Per sqft, materials + labor',                           'sqft',    1800.00),
('22222222-2222-2222-2222-222222222203', 'Site supervision',         'Daily supervision for ongoing projects',                'hour',    600.00),
-- Suresh Painter
('22222222-2222-2222-2222-222222222204', 'Quick interior repaint',   'Single room, 1 coat, same-day service',                 'sqft',    12.00),
('22222222-2222-2222-2222-222222222204', 'Waterproofing',            'Bathroom and terrace waterproofing',                    'sqft',    35.00),
-- Maya Designs
('22222222-2222-2222-2222-222222222205', 'Premium home design',      'Bespoke luxury interiors',                              'lumpsum', 500000.00),
('22222222-2222-2222-2222-222222222205', '3D walkthrough',           'Full 3D rendering before execution',                    'lumpsum', 25000.00),
-- Quick Fix Plumbing
('22222222-2222-2222-2222-222222222206', 'Leak repair',              'Same-day fix for any leak',                             'visit',   500.00),
('22222222-2222-2222-2222-222222222206', 'Bathroom fitting',         'Full bathroom plumbing setup',                          'lumpsum', 18000.00),
('22222222-2222-2222-2222-222222222206', 'Hourly plumbing',          'For misc small jobs',                                   'hour',    400.00),
-- Bright Spark Electricals
('22222222-2222-2222-2222-222222222207', 'Wiring (new home)',        'Complete electrical setup, 2-3 BHK',                    'lumpsum', 65000.00),
('22222222-2222-2222-2222-222222222207', 'Fan/light installation',   'Per fixture',                                           'visit',   350.00),
('22222222-2222-2222-2222-222222222207', 'Smart home setup',         'Alexa/Google integration, smart switches',              'lumpsum', 22000.00),
-- Kiran Renovations
('22222222-2222-2222-2222-222222222208', 'Kitchen renovation',       'Full demolition + redesign',                            'lumpsum', 280000.00),
('22222222-2222-2222-2222-222222222208', 'Bathroom renovation',      'Tiles, plumbing, fixtures, full redo',                  'lumpsum', 95000.00),
-- Amit Civil Engineering
('22222222-2222-2222-2222-222222222209', 'Structural consultation',  'Site visit + load + foundation report',                 'visit',   3500.00),
('22222222-2222-2222-2222-222222222209', 'Project supervision',      'Weekly inspection during construction',                 'hour',    800.00),
-- Designer Studio
('22222222-2222-2222-2222-222222222210', 'Living room makeover',     'Furniture, lighting, decor — turnkey',                  'lumpsum', 75000.00),
('22222222-2222-2222-2222-222222222210', 'Free consultation',        'First-time client, no charge',                          'visit',   0.00);
