-- DOSE supplement data (PostgreSQL)

DELETE FROM order_layers;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM burger_layers;
DELETE FROM cart_items;
DELETE FROM ingredients;

INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES
  -- ENERGY
  ('Ashwagandha',    'energy',    0.89, 'Reduces cortisol, supports energy and stress resilience',             NULL, true, 1),
  ('Vitamin B12',    'energy',    0.45, 'Essential for cellular energy production and nerve function',          NULL, true, 2),
  ('CoQ10',          'energy',    1.20, 'Mitochondrial energy support and antioxidant protection',              NULL, true, 3),
  ('Rhodiola Rosea', 'energy',    0.95, 'Adaptogen for physical and mental stamina under stress',               NULL, true, 4),
  ('Panax Ginseng',  'energy',    1.10, 'Traditional adaptogen for sustained vitality and recovery',            NULL, true, 5),
  -- FOCUS
  ('Lion''s Mane',       'focus', 1.10, 'Stimulates NGF production for cognitive enhancement',                 NULL, true, 1),
  ('L-Theanine',         'focus', 0.60, 'Alpha brainwave promotion for calm, focused attention',                NULL, true, 2),
  ('Bacopa Monnieri',    'focus', 0.75, 'Memory consolidation and learning rate enhancement',                   NULL, true, 3),
  ('Alpha-GPC',          'focus', 1.35, 'Choline precursor for acetylcholine synthesis and recall',             NULL, true, 4),
  ('Phosphatidylserine', 'focus', 0.90, 'Cell membrane support for executive function and memory',              NULL, true, 5),
  -- IMMUNITY
  ('Vitamin C',         'immunity', 0.35, 'Antioxidant and immune cell function support',                       NULL, true, 1),
  ('Zinc Picolinate',   'immunity', 0.50, 'Immune response regulation and wound healing',                       NULL, true, 2),
  ('Elderberry Extract','immunity', 0.80, 'Antiviral properties and upper respiratory support',                  NULL, true, 3),
  ('Vitamin D3 + K2',   'immunity', 0.65, 'Immune modulation, bone health and cardiovascular support',          NULL, true, 4),
  ('Quercetin',         'immunity', 0.85, 'Flavonoid anti-inflammatory and immune system modulator',            NULL, true, 5),
  -- LONGEVITY
  ('NMN',                'longevity', 2.50, 'NAD+ precursor for cellular energy and aging pathways',            NULL, true, 1),
  ('Resveratrol',        'longevity', 1.80, 'Sirtuin activation and cellular senescence reduction',             NULL, true, 2),
  ('Omega-3',            'longevity', 0.70, 'EPA/DHA for cardiovascular and neurological health',               NULL, true, 3),
  ('Magnesium Glycinate','longevity', 0.55, 'Cofactor in 300+ enzymatic processes, sleep quality',              NULL, true, 4),
  ('Spermidine',         'longevity', 3.20, 'Autophagy induction for cellular renewal and longevity',          NULL, true, 5);
