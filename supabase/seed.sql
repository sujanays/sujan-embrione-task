-- Embrione Member Platform Supabase Seed Data

-- 1. Insert 6 initial approved members covering multiple domains & positions
insert into members (
  id,
  full_name,
  domain,
  position,
  srn,
  email,
  linkedin_url,
  github_url,
  branch,
  semester,
  bio,
  avatar_url,
  status,
  created_at
) values
(
  '11111111-1111-4111-8111-111111111111',
  'Aarav Sharma',
  'Web Development',
  'Head',
  'PES1UG23CS101',
  'aarav.sharma@embrione.pes.edu',
  'https://linkedin.com/in/aarav-sharma-embrione',
  'https://github.com/aaravsharma',
  'CSE',
  5,
  'Passionate full-stack developer dedicated to building responsive interfaces and distributed microservices with Next.js and Supabase for community impact.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'approved',
  now() - interval '10 days'
),
(
  '22222222-2222-4222-8222-222222222222',
  'Ananya Iyer',
  'Design',
  'Vice-Head',
  'PES1UG23CS205',
  'ananya.iyer@embrione.pes.edu',
  'https://linkedin.com/in/ananya-iyer-design',
  'https://github.com/ananyaiyer',
  'AIML',
  5,
  'Creative UI/UX designer crafting intuitive brand interactions, modern glassmorphic aesthetics, and cohesive design systems for high-impact student projects.',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'approved',
  now() - interval '8 days'
),
(
  '33333333-3333-4333-8333-333333333333',
  'Rohan Kulkarni',
  'Operations',
  'Core Member',
  'PES1UG24EC042',
  'rohan.kulkarni@embrione.pes.edu',
  'https://linkedin.com/in/rohan-kulkarni-ops',
  'https://github.com/rohankulkarni',
  'ECE',
  4,
  'Leading club operations and coordinating seamless logistics across major tech hackathons, symposiums, and engineering community workshops across PES.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'approved',
  now() - interval '6 days'
),
(
  '44444444-4444-4444-8444-444444444444',
  'Sneha Reddy',
  'Web Development',
  'Core Member',
  'PES1UG23AI089',
  'sneha.reddy@embrione.pes.edu',
  'https://linkedin.com/in/snehareddy-ai',
  'https://github.com/snehareddy',
  'AIML',
  5,
  'Architecting deep learning models and scalable web platforms. Driven by innovation, modern cloud pipelines, and open-source developer tool building.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'approved',
  now() - interval '4 days'
),
(
  '55555555-5555-4555-8555-555555555555',
  'Vikram Nair',
  'Sponsorship',
  'Head',
  'PES1UG23EE014',
  'vikram.nair@embrione.pes.edu',
  'https://linkedin.com/in/vikram-nair-pes',
  null,
  'EEE',
  6,
  'Managing external corporate partnerships, event sponsorships, and club outreach initiatives to empower student engineers with top-tier industry exposure.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'approved',
  now() - interval '2 days'
),
(
  '66666666-6666-4666-8666-666666666666',
  'Diya Menon',
  'Social Media',
  'Member',
  'PES1UG24BT019',
  'diya.menon@embrione.pes.edu',
  'https://linkedin.com/in/diya-menon-media',
  'https://github.com/dmenon',
  'Biotech',
  3,
  'Directing media campaigns, technical podcasts, and creative branding narratives to amplify Embrione''s innovative footprint across collegiate tech circles.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'approved',
  now() - interval '1 days'
)
on conflict (id) do nothing;

-- 2. Admin account setup instructions:
-- In Supabase Dashboard -> Authentication -> Users:
-- Add user: admin@embrione.pes.edu with password: EmbrioneAdmin@2026
-- Then copy the User UID and insert into admins table:
--
-- INSERT INTO admins (user_id) 
-- VALUES ('<YOUR_ADMIN_USER_UUID>')
-- ON CONFLICT (user_id) DO NOTHING;
