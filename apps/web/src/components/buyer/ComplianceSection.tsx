'use client';

import { useState, useEffect } from 'react';
import complianceAPI from '@/services/compliance';
import { 
  Camera, IdCard, MapPin, Users, DollarSign, Shield, Clock, 
  CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw 
} from 'lucide-react';

export default function ComplianceSection() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState<any>({
    liveliness: null,
    aadhaar: null,
    geoAudit: null,
    familyLinks: null,
    subsidies: null,
    blacklist: null,
    reKyc: null
  });

  useEffect(() => {
    fetchAllComplianceData();
  }, []);

  const fetchAllComplianceData = async () => {
    setLoading(true);
    try {
      const [familyLinks, subsidies, blacklist, reKyc] = await Promise.all([
        complianceAPI.getFamilyLinks(),
        complianceAPI.checkSubsidies(),
        complianceAPI.checkBlacklist(),
        complianceAPI.checkReKYCTimer()
      ]);

      setComplianceData({
        familyLinks: familyLinks.data.data,
        subsidies: subsidies.data.data,
        blacklist: blacklist.data.data,
        reKyc: reKyc.data.data
      });
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'liveliness', label: 'Liveliness', icon: Camera },
    { id: 'aadhaar', label: 'Aadhaar', icon: IdCard },
    { id: 'geo-audit', label: 'Geo-Audit', icon: MapPin },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'subsidies', label: 'Subsidies', icon: DollarSign },
    { id: 'blacklist', label: 'Blacklist', icon: Shield },
    { id: 'rekyc', label: 'Re-KYC', icon: Clock },
  ];

  if (loading && !complianceData.familyLinks) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black mb-2">Government Compliance 🏛️</h1>
            <p className="text-purple-100 text-lg">Verify identity, check subsidies, and manage KYC</p>
          </div>
          <button
            onClick={fetchAllComplianceData}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
            <p className="text-2xl font-black">{complianceData.blacklist?.status === 'CLEAR' ? '✓' : '✗'}</p>
            <p className="text-xs text-purple-100">Blacklist Status</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
            <p className="text-2xl font-black">{complianceData.reKyc?.status === 'VALID' ? '✓' : '⚠'}</p>
            <p className="text-xs text-purple-100">KYC Valid</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
            <p className="text-2xl font-black">₹{(complianceData.subsidies?.totalAmount || 0).toLocaleString()}</p>
            <p className="text-xs text-purple-100">Total Subsidies</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
            <p className="text-2xl font-black">{complianceData.familyLinks?.totalMembers || 0}</p>
            <p className="text-xs text-purple-100">Family Members</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && <OverviewTab data={complianceData} />}
        {activeTab === 'liveliness' && <LivelinessTab />}
        {activeTab === 'aadhaar' && <AadhaarTab />}
        {activeTab === 'geo-audit' && <GeoAuditTab />}
        {activeTab === 'family' && <FamilyTab data={complianceData.familyLinks} />}
        {activeTab === 'subsidies' && <SubsidiesTab data={complianceData.subsidies} />}
        {activeTab === 'blacklist' && <BlacklistTab data={complianceData.blacklist} />}
        {activeTab === 'rekyc' && <ReKYCTab data={complianceData.reKyc} />}
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Blacklist Status */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            data.blacklist?.status === 'CLEAR' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Shield size={24} className={data.blacklist?.status === 'CLEAR' ? 'text-green-600' : 'text-red-600'} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Blacklist Status</h3>
            <p className={`text-sm font-bold ${
              data.blacklist?.status === 'CLEAR' ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.blacklist?.status || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* KYC Status */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            data.reKyc?.status === 'VALID' ? 'bg-green-100' : 
            data.reKyc?.status === 'EXPIRING_SOON' ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <Clock size={24} className={
              data.reKyc?.status === 'VALID' ? 'text-green-600' : 
              data.reKyc?.status === 'EXPIRING_SOON' ? 'text-yellow-600' : 'text-red-600'
            } />
          </div>
          <div>
            <h3 className="font-bold text-lg">KYC Status</h3>
            <p className={`text-sm font-bold ${
              data.reKyc?.status === 'VALID' ? 'text-green-600' : 
              data.reKyc?.status === 'EXPIRING_SOON' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {data.reKyc?.status || 'Unknown'} • {data.reKyc?.daysRemaining || 0} days
            </p>
          </div>
        </div>
      </div>

      {/* Subsidies */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Active Subsidies</h3>
            <p className="text-2xl font-black text-green-600">
              ₹{(data.subsidies?.totalAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {data.subsidies?.subsidies?.filter((s: any) => s.status === 'ACTIVE').map((subsidy: any, idx: number) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-slate-600">{subsidy.scheme}</span>
              <span className="font-bold">₹{subsidy.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Family Members */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Family Members</h3>
            <p className="text-2xl font-black text-blue-600">
              {data.familyLinks?.totalMembers || 0}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {data.familyLinks?.familyMembers?.slice(0, 3).map((member: any, idx: number) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-slate-600">{member.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                member.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {member.kycStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LivelinessTab() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkLiveliness = async () => {
    setChecking(true);
    try {
      const response = await complianceAPI.checkLiveliness(
        'session_' + Date.now(),
        'mock_photo_data'
      );
      setResult(response.data.data);
    } catch (error) {
      console.error('Liveliness check failed:', error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="text-center mb-6">
        <Camera size={64} className="mx-auto text-blue-600 mb-4" />
        <h3 className="text-2xl font-black mb-2">Liveliness Check</h3>
        <p className="text-slate-600">Verify your physical presence using AI face detection</p>
      </div>

      <button
        onClick={checkLiveliness}
        disabled={checking}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {checking ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Checking...
          </span>
        ) : (
          'Start Liveliness Check'
        )}
      </button>

      {result && (
        <div className={`mt-6 p-4 rounded-xl ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {result.success ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            <div>
              <p className="font-bold">{result.success ? 'Verification Successful' : 'Verification Failed'}</p>
              <p className="text-sm text-slate-600">Confidence: {result.confidence.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AadhaarTab() {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const verifyAadhaar = async () => {
    if (aadhaarNumber.length !== 12) {
      alert('Please enter valid 12-digit Aadhaar number');
      return;
    }

    setVerifying(true);
    try {
      const response = await complianceAPI.verifyAadhaar(aadhaarNumber);
      setResult(response.data.data);
    } catch (error) {
      console.error('Aadhaar verification failed:', error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="text-center mb-6">
        <IdCard size={64} className="mx-auto text-green-600 mb-4" />
        <h3 className="text-2xl font-black mb-2">Aadhaar Verification</h3>
        <p className="text-slate-600">Verify your Aadhaar details with UIDAI</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Aadhaar Number
        </label>
        <input
          type="text"
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
          placeholder="Enter 12-digit Aadhaar number"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-lg font-bold"
          maxLength={12}
        />
      </div>

      <button
        onClick={verifyAadhaar}
        disabled={verifying || aadhaarNumber.length !== 12}
        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {verifying ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Verifying...
          </span>
        ) : (
          'Verify Aadhaar'
        )}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="text-green-600" size={24} />
            <p className="font-bold">Aadhaar Verified Successfully</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Name:</span>
              <span className="font-bold">{result.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Aadhaar:</span>
              <span className="font-bold">xxxx-xxxx-{result.aadhaarLast4}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Address:</span>
              <span className="font-bold text-right max-w-[200px]">{result.address}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GeoAuditTab() {
  const [auditing, setAuditing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const performGeoAudit = async () => {
    setAuditing(true);
    try {
      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const response = await complianceAPI.performGeoAudit(
            position.coords.latitude,
            position.coords.longitude
          );
          setResult(response.data.data);
          setAuditing(false);
        });
      } else {
        // Fallback to mock location (Nanded)
        const response = await complianceAPI.performGeoAudit(19.1383, 77.3210);
        setResult(response.data.data);
        setAuditing(false);
      }
    } catch (error) {
      console.error('Geo-Audit failed:', error);
      setAuditing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="text-center mb-6">
        <MapPin size={64} className="mx-auto text-orange-600 mb-4" />
        <h3 className="text-2xl font-black mb-2">Geo-Audit</h3>
        <p className="text-slate-600">Verify your location matches registered address</p>
      </div>

      <button
        onClick={performGeoAudit}
        disabled={auditing}
        className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors"
      >
        {auditing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Auditing...
          </span>
        ) : (
          'Start Location Audit'
        )}
      </button>

      {result && (
        <div className={`mt-6 p-4 rounded-xl ${
          result.verified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {result.verified ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            <div>
              <p className="font-bold">{result.verified ? 'Location Verified' : 'Location Mismatch'}</p>
              <p className="text-sm text-slate-600">Distance: {result.distance} km</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="text-slate-600">Current Location</p>
              <p className="font-bold">{result.currentLocation.lat.toFixed(4)}, {result.currentLocation.lng.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-slate-600">Registered Location</p>
              <p className="font-bold">{result.registeredLocation.lat.toFixed(4)}, {result.registeredLocation.lng.toFixed(4)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FamilyTab({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {data.familyMembers?.map((member: any, idx: number) => (
        <div key={idx} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{member.name}</h4>
                <p className="text-sm text-slate-600">{member.relation}</p>
                <p className="text-xs text-slate-500 mt-1">Aadhaar: xxxx-xxxx-{member.aadhaarLast4}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              member.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {member.kycStatus}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubsidiesTab({ data }: { data: any }) {
  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Total Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <p className="text-sm text-green-100 mb-2">Total Active Subsidies</p>
        <p className="text-4xl font-black">₹{data.totalAmount.toLocaleString()}</p>
      </div>

      {/* Subsidy List */}
      {data.subsidies?.map((subsidy: any, idx: number) => (
        <div key={idx} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">{subsidy.scheme}</h4>
              <p className="text-sm text-slate-600">
                Next: {new Date(subsidy.nextDisbursement).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(subsidy.status)}`}>
              {subsidy.status}
            </span>
          </div>
          <p className="text-2xl font-black text-green-600">₹{subsidy.amount.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

function BlacklistTab({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-6">
          <Shield size={64} className={`mx-auto mb-4 ${
            data.status === 'CLEAR' ? 'text-green-600' : 'text-red-600'
          }`} />
          <h3 className="text-2xl font-black mb-2">Blacklist Status</h3>
          <p className="text-slate-600">Comprehensive verification across government databases</p>
        </div>

        {/* Verification Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-700">Verification Score</span>
            <span className="text-lg font-black text-blue-600">{data.verificationScore || 100}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${data.verificationScore || 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {data.databasesChecked || 6} of {data.totalDatabases || 6} databases checked
          </p>
        </div>

        {/* Status Indicator */}
        <div className={`p-6 rounded-xl text-center ${
          data.status === 'CLEAR' 
            ? 'bg-green-50 border-2 border-green-200' 
            : data.status === 'FLAGGED'
            ? 'bg-yellow-50 border-2 border-yellow-200'
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <p className={`text-4xl font-black mb-2 ${
            data.status === 'CLEAR' ? 'text-green-600' : 
            data.status === 'FLAGGED' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {data.status === 'CLEAR' ? '✓ CLEAR' : data.status === 'FLAGGED' ? '⚠ FLAGGED' : '✗ BLACKLISTED'}
          </p>
          <p className="text-slate-600 font-medium">{data.reason || 'No issues found'}</p>
        </div>
      </div>

      {/* Databases Checked */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h4 className="font-bold text-lg mb-4">Databases Verified</h4>
        <div className="space-y-3">
          {data.databases?.map((db: any, idx: number) => (
            <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex-1">
                <p className="font-bold text-sm">{db.name}</p>
                <p className="text-xs text-slate-600">{db.authority}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Last updated: {new Date(db.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                db.found ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {db.found ? 'FOUND' : 'CLEAR'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReKYCTab({ data }: { data: any }) {
  if (!data) return null;

  const getStatusColor = () => {
    switch (data.status) {
      case 'VALID': return 'text-green-600';
      case 'EXPIRING_SOON': return 'text-yellow-600';
      case 'EXPIRED': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-6">
          <Clock size={64} className={`mx-auto mb-4 ${getStatusColor()}`} />
          <h3 className="text-2xl font-black mb-2">Re-KYC Timer</h3>
          <p className="text-slate-600">Track your KYC validity and renewal requirements</p>
        </div>

        {/* Days Remaining */}
        <div className="text-center mb-6">
          <p className={`text-7xl font-black ${getStatusColor()}`}>
            {data.daysRemaining}
          </p>
          <p className="text-slate-600 font-medium text-lg">Days Remaining</p>
        </div>

        {/* Status Badge */}
        <div className={`p-4 rounded-xl text-center font-bold text-lg mb-6 ${
          data.status === 'VALID' ? 'bg-green-50 text-green-800' : 
          data.status === 'EXPIRING_SOON' ? 'bg-yellow-50 text-yellow-800' : 
          'bg-red-50 text-red-800'
        }`}>
          Status: {data.status}
        </div>

        {/* Completion Progress */}
        {data.completionPercentage !== undefined && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-700">KYC Completion</span>
              <span className="text-lg font-black text-blue-600">{data.completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${data.completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {data.documentsVerified} of {data.totalDocuments} documents verified
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-sm text-slate-600 mb-1">Last KYC</p>
            <p className="font-bold">{new Date(data.lastKycDate).toLocaleDateString()}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-sm text-slate-600 mb-1">Next KYC Due</p>
            <p className="font-bold">{new Date(data.nextKycDue).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Penalty Warning */}
        {data.penalty && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-bold text-red-800">Penalty Applied</p>
                <p className="text-sm text-red-700">{data.penalty.description}</p>
                <p className="text-2xl font-black text-red-600 mt-2">₹{data.penalty.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="font-bold text-lg">Recommendations</h4>
            {data.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-xl border-2 ${
                rec.priority === 'CRITICAL' ? 'bg-red-50 border-red-200' :
                rec.priority === 'HIGH' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    rec.priority === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                    rec.priority === 'HIGH' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {rec.priority}
                  </span>
                  <p className="text-sm font-medium flex-1">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.kycRequired && (
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Start KYC Renewal Process
          </button>
        )}
      </div>

      {/* KYC Documents */}
      {data.kycDocuments && data.kycDocuments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h4 className="font-bold text-lg mb-4">KYC Documents</h4>
          <div className="space-y-3">
            {data.kycDocuments.map((doc: any, idx: number) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="font-bold text-sm">{doc.type.replace('_', ' ')}</p>
                  <p className="text-xs text-slate-600">
                    Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                  </p>
                  {doc.expiryDate && (
                    <p className="text-xs text-slate-500 mt-1">
                      Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  doc.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Renewal Checklist */}
      {data.renewalChecklist && data.renewalChecklist.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg">Renewal Checklist</h4>
            <span className="text-sm text-slate-600">
              {data.completedRequired}/{data.requiredItems} required completed
            </span>
          </div>
          <div className="space-y-3">
            {data.renewalChecklist.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.completed ? 'bg-green-500' : 'bg-slate-300'
                }`}>
                  {item.completed && <CheckCircle size={16} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    item.completed ? 'text-slate-700' : 'text-slate-500'
                  }`}>
                    {item.item}
                  </p>
                  {item.required && (
                    <span className="text-xs text-red-600 font-bold">Required</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-4">
            Estimated completion time: {data.estimatedRenewalDays} days
          </p>
        </div>
      )}
    </div>
  );
}
