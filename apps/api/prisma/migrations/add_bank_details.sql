-- Create BankDetails table
CREATE TABLE IF NOT EXISTS "BankDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "BankDetails_userId_idx" ON "BankDetails"("userId");
CREATE INDEX IF NOT EXISTS "BankDetails_isVerified_idx" ON "BankDetails"("isVerified");
CREATE UNIQUE INDEX IF NOT EXISTS "BankDetails_userId_isPrimary_key" ON "BankDetails"("userId", "isPrimary");

-- Add foreign key constraint
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
