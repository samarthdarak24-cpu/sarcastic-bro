'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertCircle, FileText, DollarSign } from 'lucide-react';

interface SubsidyEligibility {
  pmKisan: boolean;
  cropInsurance: boolean;
  soilHealthCard: boolean;
  drip: boolean;
}

export const SubsidyChecker: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [formData, setFormData] = useState({
    cropType: 'wheat',
    landHolding: 1,
    income: 200000,
    state: 'Maharashtra',
  });

  const [eligibility, setEligibility] = useState<SubsidyEligibility | null>(
    null
  );
  const [totalBenefit, setTotalBenefit] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'landHolding' || name === 'income' ? parseFloat(value) : value,
    }));
  };

  const checkEligibility = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subsidy/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId,
          ...formData,
        }),
      });

      const data = await response.json();
      setEligibility(data.details);
      setTotalBenefit(data.totalBenefit);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    } finally {
      setLoading(false);
    }
  };

  const subsidySchemes = [
    {
      id: 'pmKisan',
      name: 'PM-KISAN Scheme',
      description: 'Direct benefit transfer of ₹6000 per year',
      amount: 6000,
    },
    {
      id: 'cropInsurance',
      name: 'Crop Insurance',
      description: 'Pradhan Mantri Fasal Bima Yojana',
      amount: 2000,
    },
    {
      id: 'soilHealthCard',
      name: 'Soil Health Card',
      description: 'Free soil testing and recommendations',
      amount: 0,
    },
    {
      id: 'drip',
      name: 'Drip Irrigation Subsidy',
      description: 'Pradhan Mantri Krishi Sinchayee Yojana',
      amount: 50000,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Government Subsidy Checker</h2>

      {/* Input Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Type
            </label>
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="cotton">Cotton</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="corn">Corn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Land Holding (hectares)
            </label>
            <input
              type="number"
              name="landHolding"
              value={formData.landHolding}
              onChange={handleInputChange}
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Income (₹)
            </label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>
        </div>

        <button
          onClick={checkEligibility}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Checking...' : 'Check Eligibility'}
        </button>
      </div>

      {/* Results */}
      {eligibility && (
        <>
          {/* Total Benefit */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">
                Total Potential Benefit
              </span>
            </div>
            <p className="text-3xl font-bold text-green-600">₹{totalBenefit}</p>
          </div>

          {/* Eligible Schemes */}
          <div className="space-y-3">
            {subsidySchemes.map((scheme) => {
              const isEligible =
                eligibility[scheme.id as keyof SubsidyEligibility];
              return (
                <div
                  key={scheme.id}
                  className={`border rounded-lg p-4 ${
                    isEligible
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isEligible ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <h3 className="font-semibold text-gray-900">
                          {scheme.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {scheme.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{scheme.amount}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          isEligible
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {isEligible ? 'Eligible' : 'Not Eligible'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Apply Button */}
          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            Apply for Eligible Schemes
          </button>
        </>
      )}
    </div>
  );
};
