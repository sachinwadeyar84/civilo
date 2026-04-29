-- Civilo: admin user + pending vendor applications
-- Password for admin@civilo.com is: admin123

-- Admin user
INSERT INTO users (id, name, phone, email, password_hash, role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 'Admin User',
 '9999999991',
 'admin@civilo.com',
 '$2b$10$riE0ipGmB0b.BQ43C53egO.JhG7y9DmmMTKYWqEfhwjZWjR7PeTQa',
 'admin')
ON CONFLICT (phone) DO UPDATE
  SET role = 'admin',
      password_hash = EXCLUDED.password_hash,
      email = EXCLUDED.email;

-- Pending vendor users
INSERT INTO users (id, name, phone, email, password_hash, role) VALUES
('33333333-3333-3333-3333-333333333301', 'Vikram Verma',     '9000000021', 'vikram@civilo.test',  '$2b$10$dummy', 'vendor'),
('33333333-3333-3333-3333-333333333302', 'New Wave Interiors','9000000022', 'newwave@civilo.test', '$2b$10$dummy', 'vendor'),
('33333333-3333-3333-3333-333333333303', 'Mahesh Plumbing',  '9000000023', 'mahesh@civilo.test',  '$2b$10$dummy', 'vendor')
ON CONFLICT (phone) DO NOTHING;

-- Pending vendor profiles (kyc_status = 'pending')
INSERT INTO vendor_profiles (id, user_id, business_name, bio, category, experience_years, lat, lng, kyc_status, cover_photo_url) VALUES
('44444444-4444-4444-4444-444444444401',
 '33333333-3333-3333-3333-333333333301',
 'Verma Builders',
 'Newly applied. Specializes in residential construction, 6 years experience.',
 'contractor', 6, 12.94, 77.62, 'pending',
 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'),
('44444444-4444-4444-4444-444444444402',
 '33333333-3333-3333-3333-333333333302',
 'New Wave Interiors',
 'Modern, minimalist interiors for young homeowners. Just starting out.',
 'interior_designer', 4, 12.93, 77.61, 'pending',
 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800'),
('44444444-4444-4444-4444-444444444403',
 '33333333-3333-3333-3333-333333333303',
 'Mahesh Plumbing Co',
 'Family business, 25 years in the trade. Trusted by 500+ households.',
 'plumber', 25, 12.95, 77.63, 'pending',
 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800')
ON CONFLICT (id) DO NOTHING;
