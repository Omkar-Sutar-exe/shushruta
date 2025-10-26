import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AdminLayout from "../layout";
import { updatePersonalInformationFetch } from "../../shop/dashboardUser/FetchApi";
import { sendOtp, verifyOtp } from "../../shop/dashboardUser/FetchApi";

const EditProfileComponent = () => {
  const history = useHistory();
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpState, setOtpState] = useState({
    otp: "",
    sending: false,
    verifying: false,
    otpSent: false,
    phoneVerified: false
  });

  useEffect(() => {
    // Get hospital information from localStorage
    const currentUser = JSON.parse(localStorage.getItem("jwt"));
    if (currentUser && currentUser.user) {
      setHospitalInfo(currentUser.user);
      setFormData({
        name: currentUser.user.name || "",
        phoneNumber: currentUser.user.phoneNumber || "",
      });
      setOtpState(prev => ({
        ...prev,
        phoneVerified: currentUser.user.phoneVerified || false
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Hospital name is required");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    // Basic phone number validation
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!hospitalInfo || !hospitalInfo._id) {
      setError("User not found");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await updatePersonalInformationFetch({
        uId: hospitalInfo._id,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      });

      if (response && response.success) {
        setMessage("Profile updated successfully!");
        
        // Update localStorage with new information
        const currentUser = JSON.parse(localStorage.getItem("jwt"));
        if (currentUser && currentUser.user) {
          currentUser.user.name = formData.name;
          currentUser.user.phoneNumber = formData.phoneNumber;
          // Reset phone verification if phone number changed
          if (hospitalInfo.phoneNumber !== formData.phoneNumber) {
            currentUser.user.phoneVerified = false;
          }
          localStorage.setItem("jwt", JSON.stringify(currentUser));
        }

        // Update local state
        setHospitalInfo({
          ...hospitalInfo,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          phoneVerified: hospitalInfo.phoneNumber === formData.phoneNumber ? hospitalInfo.phoneVerified : false,
        });

        // Redirect to hospital details after a short delay
        setTimeout(() => {
          history.push("/admin/dashboard/hospital-details");
        }, 1500);
      } else {
        const errorMsg = response && response.error ? response.error : "Failed to update profile";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!hospitalInfo || !hospitalInfo._id) {
      setError("User not found");
      return;
    }
    if (!formData.phoneNumber) {
      setError("Please enter a phone number first");
      return;
    }
    
    setOtpState(prev => ({ ...prev, sending: true }));
    setError("");
    setMessage("");

    try {
      const res = await sendOtp({ uId: hospitalInfo._id });
      if (res && res.success) {
        setMessage("OTP sent successfully");
        setOtpState(prev => ({ ...prev, sending: false, otpSent: true }));
      } else if (res && res.otp) {
        setMessage(`OTP (dev): ${res.otp}`);
        setOtpState(prev => ({ ...prev, sending: false, otpSent: true }));
      } else {
        const errorMsg = res && res.error ? res.error : "Failed to send OTP";
        setError(errorMsg);
        setOtpState(prev => ({ ...prev, sending: false }));
      }
    } catch (err) {
      setError("Network error sending OTP");
      setOtpState(prev => ({ ...prev, sending: false }));
      console.error("sendOtp error", err);
    }
  };

  const handleVerifyOtp = async () => {
    if (!hospitalInfo || !hospitalInfo._id) {
      setError("User not found");
      return;
    }
    if (!otpState.otp) {
      setError("Please enter OTP");
      return;
    }
    if (otpState.otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setOtpState(prev => ({ ...prev, verifying: true }));
    setError("");
    setMessage("");

    try {
      const res = await verifyOtp({ uId: hospitalInfo._id, otp: otpState.otp });
      if (res && res.success) {
        // Update localStorage with verified status
        const currentUser = JSON.parse(localStorage.getItem("jwt"));
        if (currentUser && currentUser.user) {
          currentUser.user.phoneVerified = true;
          localStorage.setItem("jwt", JSON.stringify(currentUser));
        }
        setMessage("Phone verified successfully!");
        setOtpState(prev => ({ 
          ...prev, 
          verifying: false, 
          phoneVerified: true,
          otp: ""
        }));
        setHospitalInfo(prev => ({ ...prev, phoneVerified: true }));
      } else {
        const errorMsg = res && res.error ? res.error : "Verification failed";
        setError(errorMsg);
        setOtpState(prev => ({ ...prev, verifying: false }));
      }
    } catch (err) {
      setError("Network error verifying OTP");
      setOtpState(prev => ({ ...prev, verifying: false }));
      console.error("verifyOtp error", err);
    }
  };

  return (
    <Fragment>
      <div className="m-4 md:m-8">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Hospital Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Hospital Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                  error && error.includes("name") 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter hospital name"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold mb-2">
                Phone Number *
              </label>
              <div className="flex space-x-2">
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                    error && error.includes("phone") 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter phone number (e.g., +1234567890 or 1234567890)"
                  required
                />
                {formData.phoneNumber && !otpState.phoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpState.sending}
                    className={`px-4 py-3 rounded-lg text-white font-semibold transition duration-200 ${
                      otpState.sending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                  >
                    {otpState.sending ? "Sending..." : otpState.otpSent ? "Resend" : "Send OTP"}
                  </button>
                )}
                {otpState.phoneVerified && (
                  <div className="flex items-center px-4 py-3 text-green-600 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Enter your phone number and click "Send OTP" to verify
              </p>
            </div>

            {/* OTP Verification Section */}
            {otpState.otpSent && !otpState.phoneVerified && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Verify Phone Number</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      value={otpState.otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtpState(prev => ({ ...prev, otp: value }));
                      }}
                      placeholder="Enter OTP"
                      maxLength="6"
                      className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpState.verifying || !otpState.otp || otpState.otp.length !== 6}
                    className={`w-full px-4 py-3 rounded-lg text-white font-semibold transition duration-200 ${
                      otpState.verifying || !otpState.otp || otpState.otp.length !== 6
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {otpState.verifying ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-medium">{message}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => history.push("/admin/dashboard/hospital-details")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

const EditProfile = () => {
  return <AdminLayout children={<EditProfileComponent />} />;
};

export default EditProfile;
