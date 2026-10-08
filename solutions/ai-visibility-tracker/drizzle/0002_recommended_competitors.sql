-- A brand the answer recommends for the user's need is a competitor by definition.
-- Applies the rule retroactively to rows extracted before it existed.
UPDATE "brand_mentions" SET "is_competitor" = true WHERE "recommended" = true AND "is_self" = false AND "is_competitor" = false;
