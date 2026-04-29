-- Civilo extras: photos, land developers, admin, pending vendors

-- ── Update vendor photos ───────────────────────────────────
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800' WHERE id = '22222222-2222-2222-2222-222222222201';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800' WHERE id = '22222222-2222-2222-2222-222222222202';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800' WHERE id = '22222222-2222-2222-2222-222222222203';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800' WHERE id = '22222222-2222-2222-2222-222222222204';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800' WHERE id = '22222222-2222-2222-2222-222222222205';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800' WHERE id = '22222222-2222-2222-2222-222222222206';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800' WHERE id = '22222222-2222-2222-2222-222222222207';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800' WHERE id = '22222222-2222-2222-2222-222222222208';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800' WHERE id = '22222222-2222-2222-2222-222222222209';
UPDATE vendor_profiles SET cover_photo_url = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800' WHERE id = '22222222-2222-2222-2222-222222222210';

-- ── Land developer vendors ─────────────────────────────────
INSERT INTO users (id, name, phone, email, password_hash, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Skyline Developers', '9000000011', 'skyline@civilo.test', '$2b$10$dummyhashforseeddata00000000000000000000000000000000000', 'vendor'),
('11111111-1111-1111-1111-111111111112', 'Greenfield Estates', '9000000012', 'greenfield@civilo.test', '$2b$10$dummyhashforseeddata00000000000000000000000000000000000', 'vendor');

INSERT INTO vendor_profiles (id, user_id, business_name, bio, category, experience_years, service_area_km, lat, lng, kyc_status, rating_avg, rating_count, cover_photo_url) VALUES
('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111111', 'Skyline Developers', 'Premium gated community developer. 50+ projects across Bengaluru. RERA approved.', 'land_developer', 18, 50, 12.9716, 77.5946, 'approved', 4.9, 287, 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'),
('22222222-2222-2222-2222-222222222212', '11111111-1111-1111-1111-111111111112', 'Greenfield Estates', 'Plotted developments and villa projects in north Bengaluru. Loan assistance provided.', 'land_developer', 14, 60, 13.0500, 77.6000, 'approved', 4.7, 156, 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800');

INSERT INTO services (vendor_id, title, description, unit, price_per_unit) VALUES
('22222222-2222-2222-2222-222222222211', 'Premium villa plot', 'Gated community, all amenities, 2400 sqft', 'lumpsum', 8500000.00),
('22222222-2222-2222-2222-222222222211', 'Apartment booking', '2/3 BHK in upcoming tower', 'sqft', 9500.00),
('22222222-2222-2222-2222-222222222212', 'Residential plot', 'BMRDA approved, ready for construction', 'sqft', 4500.00),
('22222222-2222-2222-2222-222222222212', 'Site visit', 'Free with developer guide', 'visit', 0.00);

-- ── Admin user (password: admin123) ────────────────────────
INSERT INTO users (id, name, phone, email, password_hash, role) VALUES
('33333333-3333-3333-3333-333333333333', 'Admin User', '9999000001', 'admin@civilo.com', '$2b$10$iNB4wwMQ65GjmBT5OHvFyumuaDVFvY6zH5/cblXZ7lxPzXK9ZrdT6', 'admin');

-- ── Pending vendors (need admin approval) ──────────────────
INSERT INTO users (id, name, phone, email, password_hash, role) VALUES
('11111111-1111-1111-1111-111111111201', 'Rajesh New Painters', '9000000201', 'rajesh@test.com', '$2b$10$dummyhashforseeddata00000000000000000000000000000000000', 'vendor'),
('11111111-1111-1111-1111-111111111202', 'Modern Designs Co', '9000000202', 'modern@test.com', '$2b$10$dummyhashforseeddata00000000000000000000000000000000000', 'vendor'),
('11111111-1111-1111-1111-111111111203', 'BuildRight Construction', '9000000203', 'buildright@test.com', '$2b$10$dummyhashforseeddata00000000000000000000000000000000000', 'vendor');

INSERT INTO vendor_profiles (id, user_id, business_name, bio, category, experience_years, lat, lng, kyc_status, cover_photo_url) VALUES
('22222222-2222-2222-2222-222222222301', '11111111-1111-1111-1111-111111111201', 'Rajesh New Painters', 'New painting business, applying for verification. Specializes in textured walls.', 'painter', 3, 12.94, 77.62, 'pending', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800'),
('22222222-2222-2222-2222-222222222302', '11111111-1111-1111-1111-111111111202', 'Modern Designs Co', 'Recently established interior design studio. Focused on minimalist Scandinavian style.', 'interior_designer', 5, 12.95, 77.63, 'pending', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800'),
('22222222-2222-2222-2222-222222222303', '11111111-1111-1111-1111-111111111203', 'BuildRight Construction', 'Family contracting business going digital. 20 years tradition.', 'contractor', 20, 12.93, 77.61, 'pending', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800');
