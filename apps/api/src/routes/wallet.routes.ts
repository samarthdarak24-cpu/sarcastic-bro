import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get wallet details
router.get('/', WalletController.getWallet);

// Get wallet transactions
router.get('/transactions', WalletController.getTransactions);

// Create order for adding funds
router.post('/add-funds/create-order', WalletController.createAddFundsOrder);

// Verify payment and add funds
router.post('/add-funds/verify', WalletController.verifyAndAddFunds);

// Withdraw funds
router.post('/withdraw', WalletController.withdrawFunds);

export default router;
