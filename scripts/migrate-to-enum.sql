-- Create the ProductCategory enum if it doesn't exist
CREATE TYPE "ProductCategory" AS ENUM ('MEN', 'WOMEN', 'KIDS', 'ACCESSORIES', 'JACKETS');

-- Add a new temporary column with the enum type
ALTER TABLE "Product" ADD COLUMN "category_new" "ProductCategory";

-- Update the new column with converted values from the old column
UPDATE "Product" 
SET "category_new" = CASE 
    WHEN "category" = 'MEN' THEN 'MEN'::"ProductCategory"
    WHEN "category" = 'WOMEN' THEN 'WOMEN'::"ProductCategory"
    WHEN "category" = 'KIDS' THEN 'KIDS'::"ProductCategory"
    WHEN "category" = 'ACCESSORIES' THEN 'ACCESSORIES'::"ProductCategory"
    WHEN "category" = 'JACKETS' THEN 'JACKETS'::"ProductCategory"
    ELSE 'ACCESSORIES'::"ProductCategory" -- default fallback
END;

-- Make the new column NOT NULL
ALTER TABLE "Product" ALTER COLUMN "category_new" SET NOT NULL;

-- Drop the old column
ALTER TABLE "Product" DROP COLUMN "category";

-- Rename the new column to the original name
ALTER TABLE "Product" RENAME COLUMN "category_new" TO "category";

-- Create the ProductSize enum if it doesn't exist
CREATE TYPE "ProductSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');
