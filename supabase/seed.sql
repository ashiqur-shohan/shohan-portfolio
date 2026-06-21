-- Projects seeded from the résumé. Safe to re-run (on conflict do nothing).
insert into public.projects
  (title, slug, summary, problem, approach, outcome, tech_stack, year, featured, sort_order, published)
values
  (
    'Estate-Link — property management platform',
    'estate-link',
    'A multi-module real-estate management platform — web plus native Android and iOS — for billing, tenants, and finance.',
    'Property managers were tracking service-fee billing, tenants, members, and finances across disconnected tools, with no single system spanning web and mobile.',
    'Built a Django REST Framework API with a React web client and shipped native Android and iOS apps from the same backend — covering service-fee billing, tenant and member management, and finance tracking. Deployed to a DigitalOcean production server and both app stores.',
    'Live in production on the web, Google Play, and the Apple App Store, running real property-management workflows from a single source of truth.',
    array['Django REST Framework','React','MySQL','DigitalOcean','iOS','Android'],
    2026, true, 1, true
  ),
  (
    'Salon-ERP — salon operations & finance',
    'salon-erp',
    'A production salon ERP in daily use at Gulshan Salon, with mobile-money and bank financial reporting.',
    'A busy salon needed reliable end-of-day financial reporting across mobile financial services (bKash, Nagad) and bank reconciliation, plus dependable billing and inventory.',
    'Built and maintain a Laravel + MySQL ERP; implemented daily MFS and bank-reconciliation reports and fixed billing and inventory defects that support live day-to-day operations.',
    'Runs every day at Gulshan Salon, giving the owner accurate daily financials and smoother billing and inventory.',
    array['Laravel','PHP','MySQL'],
    2026, true, 2, true
  ),
  (
    'Regalia — clothing e-commerce',
    'regalia',
    'A clothing e-commerce platform with a custom-built admin panel for products, orders, and inventory.',
    'A clothing brand needed an online store plus an easy, code-free way to manage products, orders, and stock.',
    'Built a Laravel + MySQL storefront with a custom admin panel for product, order, and inventory management, then delivered and handed it over to the client within two weeks.',
    'Delivered end to end and handed over within two weeks, giving the client full self-serve control of their catalog and orders.',
    array['Laravel','PHP','MySQL'],
    2025, true, 3, true
  ),
  (
    'Project Management Tool — sprint & story-point tracking',
    'internal-pm-tool',
    'An internal tool for sprint planning and story-point tracking that replaced spreadsheet-based workflows.',
    'The engineering team planned sprints and tracked story points in ad-hoc spreadsheets, which were error-prone and hard to keep in sync.',
    'Built a React + Supabase (PostgreSQL) tool for sprint planning and story-point tracking, replacing the spreadsheets the team relied on.',
    'Adopted by the engineering team for sprint planning, replacing scattered spreadsheets with one shared tool.',
    array['React','Supabase','PostgreSQL'],
    2026, false, 4, true
  )
on conflict (slug) do nothing;
