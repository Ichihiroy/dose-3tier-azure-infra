-- DOSE supplement data (SQL Server)

DELETE FROM order_layers;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM burger_layers;
DELETE FROM cart_items;
DELETE FROM ingredients;

-- ENERGY
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Ashwagandha', 'energy', 0.89, 'Reduces cortisol, supports energy and stress resilience', NULL, 1, 1);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Vitamin B12', 'energy', 0.45, 'Essential for cellular energy production and nerve function', NULL, 1, 2);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('CoQ10', 'energy', 1.20, 'Mitochondrial energy support and antioxidant protection', NULL, 1, 3);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Rhodiola Rosea', 'energy', 0.95, 'Adaptogen for physical and mental stamina under stress', NULL, 1, 4);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Panax Ginseng', 'energy', 1.10, 'Traditional adaptogen for sustained vitality and recovery', NULL, 1, 5);

-- FOCUS
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Lion''s Mane', 'focus', 1.10, 'Stimulates NGF production for cognitive enhancement', NULL, 1, 1);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('L-Theanine', 'focus', 0.60, 'Alpha brainwave promotion for calm, focused attention', NULL, 1, 2);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Bacopa Monnieri', 'focus', 0.75, 'Memory consolidation and learning rate enhancement', NULL, 1, 3);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Alpha-GPC', 'focus', 1.35, 'Choline precursor for acetylcholine synthesis and recall', NULL, 1, 4);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Phosphatidylserine', 'focus', 0.90, 'Cell membrane support for executive function and memory', NULL, 1, 5);

-- IMMUNITY
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Vitamin C', 'immunity', 0.35, 'Antioxidant and immune cell function support', NULL, 1, 1);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Zinc Picolinate', 'immunity', 0.50, 'Immune response regulation and wound healing', NULL, 1, 2);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Elderberry Extract', 'immunity', 0.80, 'Antiviral properties and upper respiratory support', NULL, 1, 3);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Vitamin D3 + K2', 'immunity', 0.65, 'Immune modulation, bone health and cardiovascular support', NULL, 1, 4);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Quercetin', 'immunity', 0.85, 'Flavonoid anti-inflammatory and immune system modulator', NULL, 1, 5);

-- LONGEVITY
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('NMN', 'longevity', 2.50, 'NAD+ precursor for cellular energy and aging pathways', NULL, 1, 1);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Resveratrol', 'longevity', 1.80, 'Sirtuin activation and cellular senescence reduction', NULL, 1, 2);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Omega-3', 'longevity', 0.70, 'EPA/DHA for cardiovascular and neurological health', NULL, 1, 3);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Magnesium Glycinate', 'longevity', 0.55, 'Cofactor in 300+ enzymatic processes, sleep quality', NULL, 1, 4);
INSERT INTO ingredients (name, category, price, description, image_url, is_available, sort_order) VALUES ('Spermidine', 'longevity', 3.20, 'Autophagy induction for cellular renewal and longevity', NULL, 1, 5);
