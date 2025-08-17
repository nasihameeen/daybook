
'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';

interface UserProfile {
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  dateOfBirth: string;
  nationality: string;
  profilePicture?: string;
  isFirstLogin: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  // Address fields (Saudi SPL format)
  buildingNumber: string;
  streetName: string;
  district: string;
  city: string;
  postalCode: string;
  additionalNumber: string;
  // Bank details
  bankName: string;
  accountNumber: string;
  ibanNumber: string;
}

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showMobileVerification, setShowMobileVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verification codes
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [mobileVerificationCode, setMobileVerificationCode] = useState('');
  
  // Password reset form
  const [passwordResetForm, setPasswordResetForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // User profile data
  const [profile, setProfile] = useState<UserProfile>({
    email: 'john.smith@company.com',
    mobile: '+966-555-0123',
    firstName: '',
    lastName: '',
    employeeId: 'EMP-2024-001',
    department: '',
    designation: '',
    dateOfJoining: '2024-01-15',
    dateOfBirth: '',
    nationality: '',
    isFirstLogin: true,
    isEmailVerified: false,
    isMobileVerified: false,
    // Address fields
    buildingNumber: '',
    streetName: '',
    district: '',
    city: '',
    postalCode: '',
    additionalNumber: '',
    // Bank details
    bankName: '',
    accountNumber: '',
    ibanNumber: ''
  });

  const [editProfile, setEditProfile] = useState({ ...profile });

  useEffect(() => {
    const hasCompletedProfile = localStorage.getItem('profileCompleted');
    if (!hasCompletedProfile && profile.isFirstLogin) {
      setIsFirstLogin(true);
      setIsEditMode(true);
    } else {
      setIsFirstLogin(false);
    }
  }, [profile.isFirstLogin]);

  const departments = [
    'Accounting & Finance',
    'Human Resources',
    'Information Technology',
    'Operations',
    'Sales & Marketing',
    'Administration',
    'Procurement',
    'Legal & Compliance'
  ];

  const designations = [
    'Junior Executive',
    'Executive',
    'Senior Executive',
    'Assistant Manager',
    'Manager',
    'Senior Manager',
    'Deputy General Manager',
    'General Manager'
  ];

  const saudiCities = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran',
    'Tabuk', 'Buraidah', 'Khamis Mushait', 'Abha', 'Najran', 'Jazan',
    'Yanbu', 'Al Jubail', 'Hafar Al-Batin', 'Sakaka', 'Arar', 'Taif'
  ];

  const saudiBanks = [
    'Al Rajhi Bank', 'National Commercial Bank (NCB)', 'Riyad Bank',
    'Banque Saudi Fransi', 'Arab National Bank', 'Saudi Investment Bank',
    'Saudi British Bank (SABB)', 'Bank AlJazira', 'Bank Albilad',
    'Alinma Bank', 'Saudi National Bank'
  ];

  const handleProfilePictureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Profile picture must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setEditProfile({ ...editProfile, profilePicture: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    if (!editProfile.firstName || !editProfile.lastName || !editProfile.department || 
        !editProfile.designation || !editProfile.dateOfBirth || !editProfile.nationality) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setProfile({ ...editProfile, isFirstLogin: false });
      setIsEditMode(false);
      setIsFirstLogin(false);
      localStorage.setItem('profileCompleted', 'true');
      setIsLoading(false);
      alert('Profile updated successfully!');
    }, 1500);
  };

  const handlePasswordReset = async () => {
    if (!passwordResetForm.currentPassword || !passwordResetForm.newPassword || !passwordResetForm.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordResetForm.newPassword !== passwordResetForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordResetForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setShowPasswordReset(false);
      setPasswordResetForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsLoading(false);
      alert('Password reset successfully!');
    }, 1500);
  };

  const sendEmailVerification = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Verification code sent to your email!');
    }, 1000);
  };

  const sendMobileVerification = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);  
      alert('Verification code sent to your mobile!');
    }, 1000);
  };

  const verifyEmail = async () => {
    if (!emailVerificationCode || emailVerificationCode.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setProfile({ ...profile, isEmailVerified: true });
      setShowEmailVerification(false);
      setEmailVerificationCode('');
      setIsLoading(false);
      alert('Email verified successfully!');
    }, 1000);
  };

  const verifyMobile = async () => {
    if (!mobileVerificationCode || mobileVerificationCode.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setProfile({ ...profile, isMobileVerified: true });
      setShowMobileVerification(false);
      setMobileVerificationCode('');
      setIsLoading(false);
      alert('Mobile number verified successfully!');
    }, 1000);
  };

  const handleCancel = () => {
    if (isFirstLogin) {
      alert('Please complete your profile setup before continuing');
      return;
    }
    setEditProfile({ ...profile });
    setIsEditMode(false);
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-20 px-4 min-h-screen bg-gray-50">
        <div className="space-y-6">
          {/* First Login Welcome */}
          {isFirstLogin && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-settings-line text-blue-600 text-lg"></i>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-blue-900">Welcome! Complete Your Profile</h2>
                  <p className="text-sm text-blue-700 mt-1">
                    Please complete your profile information and verify your contact details.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {profile.profilePicture || editProfile.profilePicture ? (
                  <img 
                    src={editProfile.profilePicture || profile.profilePicture} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {profile.firstName ? `${profile.firstName[0]}${profile.lastName[0]}` : 'JS'}
                    </span>
                  </div>
                )}
                {isEditMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <i className="ri-camera-line text-white text-xs"></i>
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {profile.firstName && profile.lastName 
                    ? `${profile.firstName} ${profile.lastName}` 
                    : 'Complete Your Profile'
                  }
                </h1>
                <p className="text-sm text-gray-600">{profile.designation || 'Not specified'}</p>
                <p className="text-sm text-gray-600">{profile.department || 'Not specified'}</p>
              </div>
              {!isFirstLogin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    {isEditMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureSelect}
            className="hidden"
          />

          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              {isFirstLogin && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  Setup Required
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editProfile.firstName}
                      onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.firstName || 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editProfile.lastName}
                      onChange={(e) => setEditProfile({ ...editProfile, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.lastName || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  {isEditMode ? (
                    <input
                      type="date"
                      value={editProfile.dateOfBirth}
                      onChange={(e) => setEditProfile({ ...editProfile, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality *
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editProfile.nationality}
                      onChange={(e) => setEditProfile({ ...editProfile, nationality: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter nationality"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.nationality || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                  {profile.employeeId}
                  <span className="ml-2 text-xs text-gray-500">(Managed by Administrator)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  {isEditMode ? (
                    <select
                      value={editProfile.department}
                      onChange={(e) => setEditProfile({ ...editProfile, department: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.department || 'Not specified'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation *
                  </label>
                  {isEditMode ? (
                    <select
                      value={editProfile.designation}
                      onChange={(e) => setEditProfile({ ...editProfile, designation: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Designation</option>
                      {designations.map((designation) => (
                        <option key={designation} value={designation}>{designation}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.designation || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Joining
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                  {profile.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString() : 'Not specified'}
                  <span className="ml-2 text-xs text-gray-500">(Managed by Administrator)</span>
                </div>
              </div>
            </div>

            {isEditMode && (
              <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFirstLogin ? 'Required' : 'Cancel'}
                </button>
                <button
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                    {profile.email}
                    <span className="ml-2 text-xs text-gray-500">(Managed by Administrator)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {profile.isEmailVerified ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                        <i className="ri-shield-check-line mr-1"></i>
                        Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowEmailVerification(true)}
                        className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full hover:bg-orange-200 transition-colors"
                      >
                        Verify Email
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                    {profile.mobile}
                    <span className="ml-2 text-xs text-gray-500">(Managed by Administrator)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {profile.isMobileVerified ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                        <i className="ri-shield-check-line mr-1"></i>
                        Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowMobileVerification(true)}
                        className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full hover:bg-orange-200 transition-colors"
                      >
                        Verify Mobile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information (Saudi SPL Format) */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
            <p className="text-sm text-gray-600 mb-4">Address format as per Saudi Post requirements</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Building Number
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editProfile.buildingNumber}
                      onChange={(e) => setEditProfile({ ...editProfile, buildingNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1234"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.buildingNumber || 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Number
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editProfile.additionalNumber}
                      onChange={(e) => setEditProfile({ ...editProfile, additionalNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 5678"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.additionalNumber || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Name
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editProfile.streetName}
                    onChange={(e) => setEditProfile({ ...editProfile, streetName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., King Fahd Road"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.streetName || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editProfile.district}
                    onChange={(e) => setEditProfile({ ...editProfile, district: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Al Olaya"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.district || 'Not provided'}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  {isEditMode ? (
                    <select
                      value={editProfile.city}
                      onChange={(e) => setEditProfile({ ...editProfile, city: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select City</option>
                      {saudiCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.city || 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editProfile.postalCode}
                      onChange={(e) => setEditProfile({ ...editProfile, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 12345"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.postalCode || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                {isEditMode ? (
                  <select
                    value={editProfile.bankName}
                    onChange={(e) => setEditProfile({ ...editProfile, bankName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Bank</option>
                    {saudiBanks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.bankName || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editProfile.accountNumber}
                    onChange={(e) => setEditProfile({ ...editProfile, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter account number"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.accountNumber ? `****${profile.accountNumber.slice(-4)}` : 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IBAN Number
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editProfile.ibanNumber}
                    onChange={(e) => setEditProfile({ ...editProfile, ibanNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SA00 0000 0000 0000 0000 0000"
                    maxLength={24}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.ibanNumber || 'Not provided'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              {isFirstLogin && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  Password Reset Required
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Password</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {isFirstLogin ? 'Reset your temporary password' : 'Last changed 30 days ago'}
                  </p>
                </div>
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isFirstLogin 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFirstLogin ? 'Reset Now' : 'Reset Password'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-600 mt-1">Managed by system administrator</p>
                </div>
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                  Contact Admin
                </span>
              </div>
            </div>
          </div>

          {/* App Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <span className="text-sm font-medium text-gray-900">2 minutes ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Support</span>
                <span className="text-sm font-medium text-blue-600">Contact IT Team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Verification Modal */}
        {showEmailVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Verify Email Address</h2>
                <button
                  onClick={() => setShowEmailVerification(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <i className="ri-close-line text-gray-500"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <i className="ri-mail-line text-4xl text-blue-500 mb-2"></i>
                  <p className="text-sm text-gray-600">
                    We'll send a verification code to<br />
                    <strong>{profile.email}</strong>
                  </p>
                </div>

                <button
                  onClick={sendEmailVerification}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter 6-digit code
                  </label>
                  <input
                    type="text"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={verifyEmail}
                  disabled={isLoading || emailVerificationCode.length !== 6}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Verification Modal */}
        {showMobileVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Verify Mobile Number</h2>
                <button
                  onClick={() => setShowMobileVerification(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <i className="ri-close-line text-gray-500"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <i className="ri-smartphone-line text-4xl text-green-500 mb-2"></i>
                  <p className="text-sm text-gray-600">
                    We'll send a verification code to<br />
                    <strong>{profile.mobile}</strong>
                  </p>
                </div>

                <button
                  onClick={sendMobileVerification}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send SMS Code'}
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter 6-digit code
                  </label>
                  <input
                    type="text"
                    value={mobileVerificationCode}
                    onChange={(e) => setMobileVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={verifyMobile}
                  disabled={isLoading || mobileVerificationCode.length !== 6}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Mobile'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Reset Password</h2>
                <button
                  onClick={() => setShowPasswordReset(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <i className="ri-close-line text-gray-500"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordResetForm.currentPassword}
                    onChange={(e) => setPasswordResetForm({ ...passwordResetForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordResetForm.newPassword}
                    onChange={(e) => setPasswordResetForm({ ...passwordResetForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordResetForm.confirmPassword}
                    onChange={(e) => setPasswordResetForm({ ...passwordResetForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordReset(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <TabBar />
    </>
  );
}
