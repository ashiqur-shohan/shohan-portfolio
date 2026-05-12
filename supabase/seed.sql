-- ─────────────────────────────────────────────────────────────
-- Shohan Portfolio — Seed Data (Placeholder)
-- Run after migrations. Replace with real content via admin panel.
-- ─────────────────────────────────────────────────────────────

-- Profile (singleton)
insert into profile (
  full_name, headline, bio, location,
  availability_status, availability_message,
  email_public, social_links
) values (
  'Ashiqur Rahman Shohan',
  'Software Engineer & DevOps Engineer',
  'I build reliable backends, RESTful/GraphQL APIs, and deployment pipelines. B.Sc. in Statistics from the University of Chittagong. Passionate about clean code, automation, and developer experience.',
  'Dhaka, Bangladesh',
  'open',
  'Available for freelance and full-time opportunities.',
  'hello@shohan.dev',
  '{
    "github": "https://github.com/ashiqurrahman-shohan",
    "linkedin": "https://linkedin.com/in/ashiqurrahman-shohan",
    "twitter": "https://twitter.com/shohan_dev"
  }'::jsonb
);

-- Skills — Languages
insert into skills (name, category, proficiency, icon_slug, sort_order) values
  ('Python',     'language', 5, 'python',     1),
  ('JavaScript', 'language', 5, 'javascript', 2),
  ('PHP',        'language', 4, 'php',         3),
  ('TypeScript', 'language', 4, 'typescript', 4),
  ('C',          'language', 3, 'c',           5),
  ('C++',        'language', 3, 'cplusplus',  6);

-- Skills — Frameworks
insert into skills (name, category, proficiency, icon_slug, sort_order) values
  ('Next.js',   'framework', 5, 'nextdotjs', 10),
  ('React',     'framework', 5, 'react',     11),
  ('Django',    'framework', 5, 'django',    12),
  ('FastAPI',   'framework', 5, 'fastapi',   13),
  ('Laravel',   'framework', 4, 'laravel',   14);

-- Skills — Databases
insert into skills (name, category, proficiency, icon_slug, sort_order) values
  ('PostgreSQL', 'database', 5, 'postgresql', 20),
  ('MySQL',      'database', 4, 'mysql',      21),
  ('Supabase',   'database', 4, 'supabase',   22);

-- Skills — DevOps / Cloud
insert into skills (name, category, proficiency, icon_slug, sort_order) values
  ('GitHub Actions', 'devops', 5, 'githubactions', 30),
  ('Docker',         'devops', 4, 'docker',         31),
  ('Linux',          'devops', 4, 'linux',           32),
  ('Nginx',          'devops', 3, 'nginx',           33);

-- Skills — Tools
insert into skills (name, category, proficiency, icon_slug, sort_order) values
  ('Git',    'tool', 5, 'git',    40),
  ('GitHub', 'tool', 5, 'github', 41),
  ('VSCode', 'tool', 5, 'visualstudiocode', 42);

-- Experience (placeholders)
insert into experiences (
  company, role, start_date, end_date, current, location,
  description, highlights, sort_order
) values
  (
    'Acme Corp',
    'Backend Engineer',
    '2023-01-01', null, true,
    'Remote',
    'Building scalable REST APIs and microservices with Django and FastAPI.',
    '["Reduced API latency by 40% through query optimisation", "Implemented CI/CD pipeline with GitHub Actions + Docker", "Led migration from monolith to microservices for 3 core services"]'::jsonb,
    1
  ),
  (
    'Startup XYZ',
    'Full Stack Developer',
    '2021-06-01', '2022-12-31', false,
    'Dhaka, Bangladesh',
    'Full-stack development with Laravel and React for a SaaS product.',
    '["Built multi-tenant billing system integrated with Stripe", "Improved page load time by 60% with SSR migration", "Mentored 2 junior developers"]'::jsonb,
    2
  );

-- Education
insert into education (
  institution, degree, field_of_study,
  start_date, end_date, description
) values (
  'University of Chittagong',
  'Bachelor of Science',
  'Statistics',
  '2016-01-01',
  '2020-12-31',
  'Studied statistical theory, probability, data analysis, and research methodology. Applied statistical modelling to real-world datasets.'
);

-- Projects (placeholders)
insert into projects (
  slug, title, summary, content,
  tech_stack, live_url, repo_url,
  status, featured, sort_order
) values
  (
    'replog',
    'Replog',
    'A developer-focused activity tracker and log aggregator.',
    '# Replog\n\nReplog is a lightweight activity tracker designed for developers who want to log their daily work, track GitHub contributions, and reflect on progress.\n\n## Problem\nKeeping a consistent work journal is hard. Most tools are too heavy or too generic.\n\n## Solution\nA fast, keyboard-first web app that lets developers log entries, tag by project, and export reports.\n\n## Stack\n- **Backend:** FastAPI + PostgreSQL\n- **Frontend:** Next.js 16 + Tailwind\n- **Infra:** Docker Compose + GitHub Actions',
    ARRAY['Next.js', 'FastAPI', 'PostgreSQL', 'Docker', 'GitHub Actions'],
    'https://replog.shohan.dev',
    'https://github.com/ashiqurrahman-shohan/replog',
    'shipped', true, 1
  ),
  (
    'portfolio',
    'This Portfolio',
    'My personal portfolio and CMS — built with Next.js 16, Supabase, and Tailwind v4.',
    '# Portfolio\n\nThis site itself is a project. It''s a Next.js 16 app with a fully admin-editable content layer backed by Supabase.\n\n## Features\n- Every section editable from the admin panel\n- Dark-first design system\n- Blog with Tiptap rich-text editor\n- SEO-optimised with dynamic OG images',
    ARRAY['Next.js 16', 'Supabase', 'Tailwind v4', 'shadcn/ui', 'TypeScript'],
    'https://shohan.dev',
    'https://github.com/ashiqurrahman-shohan/shohan-portfolio',
    'in_progress', true, 2
  ),
  (
    'placeholder-project',
    'Project Coming Soon',
    'A new project under active development. Check back soon.',
    null,
    ARRAY['TBD'],
    null, null,
    'concept', false, 3
  );

-- Blog post (placeholder)
insert into blog_posts (
  slug, title, excerpt, content,
  tags, reading_time_minutes,
  status, published_at
) values (
  'hello-world',
  'Hello World — Starting My Engineering Blog',
  'An introduction to what I''ll be writing about: backend engineering, DevOps, and the tools I find most useful.',
  '# Hello World

Welcome to my engineering blog. I''m Ashiqur Rahman Shohan — a Software Engineer and DevOps Engineer based in Bangladesh.

## What I''ll Write About

- **Backend engineering**: Django, FastAPI, Laravel patterns and performance tips
- **DevOps**: CI/CD, Docker, GitHub Actions, infrastructure as code
- **Developer experience**: tools, workflows, and productivity
- **Projects**: behind-the-scenes on the things I build

Stay tuned for the first real post.',
  ARRAY['meta', 'engineering'],
  2,
  'published',
  now()
);

-- Now entry
insert into now_entries (content, is_current) values (
  '## What I''m doing now

- Building and shipping this portfolio
- Deepening expertise in FastAPI and async Python
- Exploring Kubernetes and infrastructure-as-code (Terraform)
- Reading: *Designing Data-Intensive Applications* by Martin Kleppmann

*Last updated: May 2026 — from Dhaka, Bangladesh*',
  true
);

-- Uses items
insert into uses_items (category, name, description, url, sort_order) values
  ('Editor',    'VS Code',          'Primary editor with Vim keybindings', 'https://code.visualstudio.com', 1),
  ('Editor',    'Neovim',           'For quick terminal edits',             'https://neovim.io',              2),
  ('Terminal',  'Windows Terminal', 'With custom theme',                   null,                             10),
  ('Terminal',  'Git Bash',         'POSIX shell on Windows',              null,                             11),
  ('Hardware',  'ThinkPad',         'Primary dev machine',                 null,                             20),
  ('Browser',   'Arc',              'Primary browser',                     'https://arc.net',                30);

-- Colophon items
insert into colophon_items (layer, name, version, url, notes, sort_order) values
  ('framework',  'Next.js',        '16',  'https://nextjs.org',        'App Router + RSC',         1),
  ('framework',  'Tailwind CSS',   'v4',  'https://tailwindcss.com',   'CSS-first config',          2),
  ('framework',  'shadcn/ui',      null,  'https://ui.shadcn.com',     'Accessible primitives',     3),
  ('database',   'Supabase',       null,  'https://supabase.com',      'Postgres + Auth + Storage', 4),
  ('hosting',    'Vercel',         null,  'https://vercel.com',        'Edge deployment',           5),
  ('ci',         'GitHub Actions', null,  'https://github.com/features/actions', null,             6),
  ('monitoring', 'Vercel Analytics', null, 'https://vercel.com/analytics', null,                   7);

-- Site settings
insert into site_settings (
  theme_default, accent_color,
  og_default_image
) values (
  'dark', 'teal',
  '/og-default.png'
);
