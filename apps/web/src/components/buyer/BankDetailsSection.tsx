'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Edit2,
  Shield,
  Lock,
} from 'lucide-react';

interface BankDetails {
  id?: string;
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: 'SAVINGS' | 'CURRENT';
  isVerified: boolean;
  isPrimary: boolean;
}

interface BankDetailsSectionProps {
  userId: string;
  onUpdate?: () => void;
}

export default function BankDetailsSection({ userId, onUpdate }: BankDetailsSectionProps) {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'SAVINGS',
    isVerified: false,
    isPrimary: true,
  });

  const [existingDetails, setExistingDetails] = useState<BankDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBankDetails();
  }, [userId]);

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/buyer/bank-details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setExistingDetails(data.data);
          setBankDetails({
            ...data.data,
            confirmAccountNumber: data.data.accountNumber,
          });
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to fetch bank details:', error);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!bankDetails.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!bankDetails.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(bankDetails.accountNumber)) {
      newErrors.accountNumber = 'Account number must be 9-18 digits';
    }

    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }

    if (!bankDetails.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Invalid IFSC code format (e.g., SBIN0001234)';
    }

    if (!bankDetails.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!bankDetails.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/buyer/bank-details`,
        {
          method: existingDetails ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountHolderName: bankDetails.accountHolderName,
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifscCode.toUpperCase(),
            bankName: bankDetails.bankName,
            branchName: bankDetails.branchName,
            accountType: bankDetails.accountType,
            isPrimary: bankDetails.isPrimary,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(existingDetails ? 'Bank details updated successfully!' : 'Bank details added successfully!');
        setExistingDetails(data.data);
        setIsEditing(false);
        if (onUpdate) onUpdate();
        
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrors({ submit: data.message || 'Failed to save bank details' });
      }
    } catch (error) {
      console.error('Failed to save bank details:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
    setSuccessMessage('');
  };

  const handleCancel = () => {
    if (existingDetails) {
      setBankDetails({
        ...existingDetails,
        confirmAccountNumber: existingDetails.accountNumber,
      });
      setIsEditing(false);
    }
    setErrors({});
    setSuccessMessage('');
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return 'X'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Bank Details</h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage your bank account information for secure payments and withdrawals
            </p>
          </div>
          {existingDetails && !isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Edit2 className="h-4 w-4" />
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="font-semibold text-emerald-800">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-rose-200 bg-rose-50 p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            <p className="font-semibold text-rose-800">{errors.submit}</p>
          </div>
        </motion.div>
      )}

      {/* View Mode */}
      {existingDetails && !isEditing && (
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Account Holder Name
              </p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {existingDetails.accountHolderName}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Account Number
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-400" />
                <p className="text-lg font-black text-slate-900">
                  {maskAccountNumber(existingDetails.accountNumber)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                IFSC Code
              </p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {existingDetails.ifscCode}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Bank Name
              </p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {existingDetails.bankName}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Branch Name
              </p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {existingDetails.branchName}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Account Type
              </p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {existingDetails.accountType}
              </p>
            </div>
          </div>

          {existingDetails.isVerified && (
            <div className="mt-6 rounded-[20px] border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <p className="font-semibold text-emerald-800">
                  Bank account verified and active
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit/Add Mode */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-6">
            {/* Security Notice */}
            <div className="rounded-[20px] border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">Secure Information</p>
                  <p className="mt-1 text-sm text-blue-700">
                    Your bank details are encrypted and stored securely. We never share this information with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Account Holder Name */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                  placeholder="Enter full name as per bank records"
                  className={`w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition-colors ${
                    errors.accountHolderName
                      ? 'border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
                {errors.accountHolderName && (
                  <p className="mt-2 text-sm text-rose-600">{errors.accountHolderName}</p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="Enter account number"
                  maxLength={18}
                  className={`w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition-colors ${
                    errors.accountNumber
                      ? 'border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
                {errors.accountNumber && (
                  <p className="mt-2 text-sm text-rose-600">{errors.accountNumber}</p>
                )}
              </div>

              {/* Confirm Account Number */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Account Number *
                </label>
                <input
                  type="text"
                  value={bankDetails.confirmAccountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="Re-enter account number"
                  maxLength={18}
                  className={`w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition-colors ${
                    errors.confirmAccountNumber
                      ? 'border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
                {errors.confirmAccountNumber && (
                  <p className="mt-2 text-sm text-rose-600">{errors.confirmAccountNumber}</p>
                )}
              </div>

              {/* IFSC Code */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., SBIN0001234"
                  maxLength={11}
                  className={`w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition-colors ${
                    errors.ifscCode
                      ? 'border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
                {errors.ifscCode && (
                  <p className="mt-2 text-sm text-rose-600">{errors.ifscCode}</p>
                )}
              </div>

              {/* Account Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Account Type *
                </label>
                <select
                  value={bankDetails.accountType}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target.value as 'SAVINGS' | 'CURRENT' })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="SAVINGS">Savings Account</option>
                  <option value="CURRENT">Current Account</option>
                </select>
              </div>

              {/* Bank Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="e.g., State Bank of India"
                  className={`w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition-colors ${
                    errors.bankName
                      ? 'border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
                {errors.bankName && (
                  <p className="mt-2 text-sm text-rose-600">{errors.bankName}</p>
                )}
              </div>

              {/* Branch Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Branch Name *
                </label>
                <input
                  type="text"
                  value={bankDetails.branchName}
                  onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })}
                  placeholder="e.g., Mumbai Main Branch"
                  className={`w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition-colors ${
                    errors.branchName
                      ? 'border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
                {errors.branchName && (
                  <p className="mt-2 text-sm text-rose-600">{errors.branchName}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {existingDetails ? 'Update Details' : 'Save Details'}
                  </>
                )}
              </button>

              {existingDetails && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Footer */}
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-600">
          © 2026 FarmGuard Technologies. All rights reserved.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Your financial information is protected with bank-level encryption
        </p>
      </div>
    </div>
  );
}
