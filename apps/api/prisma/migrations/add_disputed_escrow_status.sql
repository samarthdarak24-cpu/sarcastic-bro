-- Add DISPUTED status to EscrowStatus enum
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'DISPUTED';

-- Add dispute-related fields to EscrowTransaction if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='EscrowTransaction' AND column_name='disputeReason') THEN
        ALTER TABLE "EscrowTransaction" ADD COLUMN "disputeReason" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='EscrowTransaction' AND column_name='disputedAt') THEN
        ALTER TABLE "EscrowTransaction" ADD COLUMN "disputedAt" TIMESTAMP(3);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='EscrowTransaction' AND column_name='resolvedAt') THEN
        ALTER TABLE "EscrowTransaction" ADD COLUMN "resolvedAt" TIMESTAMP(3);
    END IF;
END $$;
