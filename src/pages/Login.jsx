import { useState } from "react";
import { useLoginForm } from "../components/utils/useLoginForm";

import penthouse_3 from "../assets/imagenes/room/pentHouse_3.png";
import gmail from "../assets/imagenes/icon/google.svg";
import apple from "../assets/imagenes/icon/apple.png";

const Login = () => {
  const [activeTab, setActiveTab] = useState("guest");
  const [focusedField, setFocusedField] = useState(null);
  const { formData, errors, handleChange, handleSubmit } = useLoginForm();

  const onSubmit = (data) => {
    console.log("Login:", { ...data, userType: activeTab });
    alert("Login OK");
  };

  const handleSocialLogin = (provider) => {
    alert(`Login with ${provider}`);
  };

  const shouldLabelFloat = (fieldName, fieldValue) => {
    return fieldValue.trim().length > 0 || focusedField === fieldName;
  };

  const tabConfig = {
    guest: {
      title: "Welcome Back",
      description: "Please enter your details to access your reservation.",
    },
    staff: {
      title: "Staff Access",
      description: "Enter your staff credentials to access the portal.",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c5c5c5]">
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#fdfcf0] rounded-lg overflow-hidden shadow-lg">
          <div className="w-full">
            <img
              src={penthouse_3}
              alt="Luxury Penthouse"
              className="w-full h-[760px] object-cover rounded-l-lg"
            />
          </div>

          <div>
            <div className="relative mt-10 px-8">
              <div className="flex justify-center gap-20">
                {["guest", "staff"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-4 text-sm font-semibold tracking-wide transition-colors ${
                      activeTab === tab
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab === "guest" ? "GUEST LOGIN" : "STAFF PORTAL"}
                  </button>
                ))}
              </div>

              <div className="relative h-0.5 bg-gray-200 -mt-0.5">
                <div
                  className={`absolute h-full bg-[#5a8a95] transition-all duration-300 ease-in-out ${
                    activeTab === "guest"
                      ? "left-0 w-[calc(50%-40px)]"
                      : "left-[calc(50%+40px)] w-[calc(50%-40px)]"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center mt-8">
              <h1 className="text-center text-3xl font-semibold">
                {tabConfig[activeTab].title}
              </h1>
              <p className="text-center mt-4 text-gray-600">
                {tabConfig[activeTab].description}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative mt-10 mx-8 min-h-[70px]">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`peer w-full bg-transparent border-b-2 py-3 px-1 outline-none transition ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#5a8a95]"
                  }`}
                />
                <label
                  htmlFor="email"
                  className={`absolute left-1 transition-all duration-200 pointer-events-none ${
                    shouldLabelFloat("email", formData.email)
                      ? "-top-3 text-xs"
                      : "top-3 text-sm"
                  } ${
                    focusedField === "email" && !errors.email
                      ? "text-[#5a8a95]"
                      : errors.email
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  Email Address
                </label>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative mt-5 mx-8 min-h-[70px]">
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`peer w-full bg-transparent border-b-2 py-3 px-1 outline-none transition ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#5a8a95]"
                  }`}
                />
                <label
                  htmlFor="password"
                  className={`absolute left-1 transition-all duration-200 pointer-events-none ${
                    shouldLabelFloat("password", formData.password)
                      ? "-top-3 text-xs"
                      : "top-3 text-sm"
                  } ${
                    focusedField === "password" && !errors.password
                      ? "text-[#5a8a95]"
                      : errors.password
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  Password
                </label>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end mx-8 mt-2">
                <a
                  href="#"
                  className="text-sm text-[#8b7355] hover:text-[#6d5a43] font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <div className="flex items-center mx-8 mt-6">
                <input
                  type="checkbox"
                  id="keepSignedIn"
                  className="w-4 h-4 text-[#8b7355] border-gray-300 rounded focus:ring-[#8b7355]"
                />
                <label
                  htmlFor="keepSignedIn"
                  className="ml-2 text-sm text-gray-600"
                >
                  Keep me signed in for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="mt-8 mx-8 w-[calc(100%-4rem)] py-3 bg-transparent border-2 border-[#2C5F5D] text-[#2C5F5D] font-semibold rounded-md tracking-wider uppercase transition-all duration-300 shadow-md relative overflow-hidden group hover:border-[#C9A961] hover:text-white"
              >
                <span className="absolute top-0 left-0 w-0 h-full bg-[#C9A961] transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="relative z-10">SIGN IN</span>
              </button>
            </form>

            <div className="flex items-center justify-center my-8 mx-8">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center items-center gap-4 mx-8">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center justify-center gap-2 border border-gray-300 hover:border-[#C9A961] px-8 py-3 rounded-lg transition-all flex-1 relative overflow-hidden group"
              >
                <span className="absolute top-0 left-0 w-0 h-full bg-[#C9A961] transition-all duration-300 ease-out group-hover:w-full"></span>
                <img
                  src={gmail}
                  alt="Gmail"
                  className="w-5 h-5 relative z-10"
                />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Google
                </span>
              </button>
              <button
                onClick={() => handleSocialLogin("Apple")}
                className="flex items-center justify-center gap-2 border border-gray-300 hover:border-[#C9A961] px-8 py-3 rounded-lg transition-all flex-1 relative overflow-hidden group"
              >
                <span className="absolute top-0 left-0 w-0 h-full bg-[#C9A961] transition-all duration-300 ease-out group-hover:w-full"></span>
                <img
                  src={apple}
                  alt="Apple"
                  className="w-5 h-5 relative z-10"
                />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Apple
                </span>
              </button>
            </div>

            <div className="text-center mt-8 mb-8">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="font-semibold text-gray-900 hover:text-[#8b7355] transition-colors"
                >
                  Join Loyalty Program
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;