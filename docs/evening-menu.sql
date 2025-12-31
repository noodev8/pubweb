-- =============================================================================
-- Christmas Evening Menu Seed Data (Nags Head Garthmyl)
-- =============================================================================
-- Usage: psql -d pubweb -f evening-menu.sql
-- Venue: Nags Head Garthmyl (venue_id = 1)
-- =============================================================================

DO $$
DECLARE
  v_menu_id INTEGER;
  v_section_id INTEGER;
  v_item_id INTEGER;
BEGIN
  -- ==========================================================================
  -- CREATE MENU
  -- ==========================================================================
  INSERT INTO menus (venue_id, name, slug, description, type, is_active, sort_order)
  VALUES (1, 'Christmas Evening Menu', 'christmas-evening', 'Available Tuesday to Saturday, 6pm - 9pm', 'regular', true, 2)
  RETURNING id INTO v_menu_id;

  -- ==========================================================================
  -- NIBBLES
  -- ==========================================================================
  INSERT INTO menu_sections (menu_id, name, description, sort_order)
  VALUES (v_menu_id, 'Nibbles', NULL, 1)
  RETURNING id INTO v_section_id;

  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Belly Pork Bites', 'Jamaican jerk glaze', 7.25, ARRAY['vegetarian', 'gluten-free'], true, 1);

  -- ==========================================================================
  -- STARTERS
  -- ==========================================================================
  INSERT INTO menu_sections (menu_id, name, description, sort_order)
  VALUES (v_menu_id, 'Starters', NULL, 2)
  RETURNING id INTO v_section_id;

  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES
    (v_section_id, 'Cauliflower Fritters', 'curry mayo', 6.25, ARRAY['vegan', 'gluten-free'], true, 1),
    (v_section_id, 'Soup of the Day', 'toasted ciabatta, salted butter', 7.50, ARRAY['vegetarian', 'gluten-free'], true, 2),
    (v_section_id, 'Ham Hock Terrine', 'piccalilli, pork scratchings, pea shoots', 7.95, ARRAY['gluten-free'], true, 3),
    (v_section_id, 'Homemade Duck Liver Pate', 'homemade plum sauce', 8.95, NULL, true, 4),
    (v_section_id, 'Goats Cheese Panna Cotta', 'beetroot 3 ways, pistachio', 7.95, ARRAY['gluten-free'], true, 5),
    (v_section_id, 'Scottish Smoked Salmon', 'marie rose king prawns, wholegrain toast, crispy capers, rocket', 9.50, ARRAY['gluten-free'], true, 6),
    (v_section_id, 'Halloumi Fries', 'chipotle mayo', 7.25, ARRAY['vegetarian', 'gluten-free'], true, 7),
    (v_section_id, 'Rosemary Focaccia', 'olive oil, balsamic, marinated olives', 8.25, ARRAY['vegan', 'gluten-free'], true, 8),
    (v_section_id, 'Pan Fried Garlic Prawns', 'chorizo, sweet red peppers, toasted ciabatta', 9.75, ARRAY['gluten-free'], true, 9),
    (v_section_id, 'Baked Camembert To Share', 'balsamic, olive oil, marinated olives', 13.95, ARRAY['gluten-free'], true, 10);

  -- ==========================================================================
  -- MAINS
  -- ==========================================================================
  INSERT INTO menu_sections (menu_id, name, description, sort_order)
  VALUES (v_menu_id, 'Mains', NULL, 3)
  RETURNING id INTO v_section_id;

  -- Pan Roasted Breast of Duck (single price)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Pan Roasted Breast of Duck', 'potato fondant, butternut squash puree, winter greens, pickled blackberries', 22.95, ARRAY['gluten-free', 'dairy-free'], true, 1);

  -- Butternut Squash, Beetroot, Brie & Spinach Parcel (single price)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Butternut Squash, Beetroot, Brie & Spinach Parcel', 'puff pastry, veg gravy, roast potatoes', 16.95, NULL, true, 2);

  -- Sea Bass (with variants)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Sea Bass', 'lobster & shellfish bisque, braised fennel, potato fondant', NULL, ARRAY['gluten-free'], true, 3)
  RETURNING id INTO v_item_id;
  INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
  VALUES
    (v_item_id, 'Large', 23.95, true, true, 0),
    (v_item_id, 'Small', 19.50, false, true, 1);

  -- Traditional Roast Turkey (with variants)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Traditional Roast Turkey', 'roast, potatoes, root veg, winter veg, red wine jus, pigs in blankets, stuffing', NULL, ARRAY['gluten-free'], true, 4)
  RETURNING id INTO v_item_id;
  INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
  VALUES
    (v_item_id, 'Large', 21.95, true, true, 0),
    (v_item_id, 'Small', 15.75, false, true, 1);

  -- Linguini (with variants)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Linguini', 'roasted tomato & red pepper, parsley, capers, vegetarian parmesan', NULL, ARRAY['vegetarian', 'dairy-free'], true, 5)
  RETURNING id INTO v_item_id;
  INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
  VALUES
    (v_item_id, 'Large', 16.95, true, true, 0),
    (v_item_id, 'Small', 13.25, false, true, 1);

  -- Pan Seared Salmon Fillet (single price)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Pan Seared Salmon Fillet', 'herbed sauteed potatoes, tenderstem broccoli, chive hollandaise', 22.95, ARRAY['gluten-free'], true, 6);

  -- Slow Cooked Pork Belly (with variants)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Slow Cooked Pork Belly', 'crispy cheek, hispi cabbage, bacon mash, cider jus', NULL, NULL, true, 7)
  RETURNING id INTO v_item_id;
  INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
  VALUES
    (v_item_id, 'Large', 19.95, true, true, 0),
    (v_item_id, 'Small', 15.95, false, true, 1);

  -- Beer Battered Fish & Chips (with variants)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Beer Battered Fish & Chips', 'triple cooked chips, mushy peas, tartare sauce, lemon', NULL, ARRAY['gluten-free', 'dairy-free'], true, 8)
  RETURNING id INTO v_item_id;
  INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
  VALUES
    (v_item_id, 'Large', 21.95, true, true, 0),
    (v_item_id, 'Small', 17.75, false, true, 1);

  -- Braised Steak Monty's Ale Shortcrust Pie (single price)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Braised Steak Monty''s Ale Shortcrust Pie', 'baby onion, triple cooked chips, buttered seasonal veg, red wine gravy', 18.25, NULL, true, 9);

  -- 10oz Gammon Steak (with variants)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, '10oz Gammon Steak', 'triple cooked chips, fried egg, grilled pineapple, tomato', NULL, ARRAY['gluten-free', 'dairy-free'], true, 10)
  RETURNING id INTO v_item_id;
  INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
  VALUES
    (v_item_id, 'Large', 17.95, true, true, 0),
    (v_item_id, 'Small', 15.95, false, true, 1);

  -- ==========================================================================
  -- FROM THE GRILL
  -- ==========================================================================
  INSERT INTO menu_sections (menu_id, name, description, sort_order)
  VALUES (v_menu_id, 'From the Grill', NULL, 4)
  RETURNING id INTO v_section_id;

  -- 10oz Sirloin Steak (with variants)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, '10oz Sirloin Steak', 'tomato, mushroom, peppercorn sauce, triple cooked chips', NULL, ARRAY['gluten-free'], true, 1)
  RETURNING id INTO v_item_id;
  INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
  VALUES
    (v_item_id, 'Large', 29.95, true, true, 0),
    (v_item_id, 'Small', 23.95, false, true, 1);

  -- Local Beef Burger (single price)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Local Beef Burger', 'bacon, mature cheddar, relish, fries, onion rings', 18.25, ARRAY['dairy-free'], true, 2);

  -- Surf & Turf (single price)
  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES (v_section_id, 'Surf & Turf', '5oz sirloin, pan fried king prawns, triple cooked chips, tomato, mushroom', 26.95, ARRAY['gluten-free'], true, 3);

  -- ==========================================================================
  -- SIDES
  -- ==========================================================================
  INSERT INTO menu_sections (menu_id, name, description, sort_order)
  VALUES (v_menu_id, 'Sides', NULL, 5)
  RETURNING id INTO v_section_id;

  INSERT INTO menu_items (section_id, name, description, price, dietary_tags, is_available, sort_order)
  VALUES
    (v_section_id, 'Beer Battered Onion Rings', NULL, 4.95, ARRAY['vegetarian'], true, 1),
    (v_section_id, 'Portobello Mushrooms', NULL, 4.30, ARRAY['vegetarian', 'gluten-free'], true, 2),
    (v_section_id, 'Garlic & Herb Ciabatta', NULL, 4.35, ARRAY['vegetarian'], true, 3),
    (v_section_id, 'Cheddar Garlic & Herb Ciabatta', NULL, 4.75, ARRAY['vegetarian'], true, 4),
    (v_section_id, 'Buttered Seasonal Vegetables', NULL, 4.30, ARRAY['vegan', 'gluten-free'], true, 5),
    (v_section_id, 'Triple Cooked Chips', NULL, 5.45, ARRAY['vegan', 'gluten-free'], true, 6),
    (v_section_id, 'Fries', NULL, 4.95, ARRAY['vegan', 'gluten-free'], true, 7),
    (v_section_id, 'Bread & Butter', NULL, 2.00, ARRAY['vegetarian'], true, 8),
    (v_section_id, 'Dressed Side Salad', NULL, 4.65, ARRAY['vegan', 'gluten-free'], true, 9);

  RAISE NOTICE 'Evening Menu created with ID: %', v_menu_id;
END $$;
