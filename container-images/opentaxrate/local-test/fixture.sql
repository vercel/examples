-- Synthetic test data, not real tax rates. Modeled on OpenTaxRate's own
-- address-rates test: one Wyoming street range where 150 Main St, Cheyenne
-- 82001 sits in an area with a 4% state + 1% county + 2% city rate (7%).
INSERT INTO sales_tax_data_releases (state, kind, file, rows) VALUES
  ('WY', 'rates', 'WYR-fixture', 3),
  ('WY', 'boundaries', 'WYB-fixture', 1);
INSERT INTO sales_tax_areas (id, state, county, place, districts) VALUES
  (56999002, 'WY', '021', '13900', '');
INSERT INTO sales_tax_street_ranges
  (state, street_key, street, suffix, house_low, house_high, parity, city, zip5, plus4, starts_on, ends_on, area_id) VALUES
  ('WY', 'MAIN', 'MAIN ST', 'ST', 100, 198, 'B', 'CHEYENNE', '82001', '1234', '2020-01-01', '9999-12-31', 56999002);
INSERT INTO sales_tax_jurisdiction_rates (state, type, code, rate, starts_on, ends_on) VALUES
  ('WY', '45', '56', 0.04, '2020-01-01', '9999-12-31'),
  ('WY', '00', '021', 0.01, '2020-01-01', '9999-12-31'),
  ('WY', '01', '13900', 0.02, '2020-01-01', '9999-12-31');
