import { useState } from "react";
import { validateField } from "../components/utils/contactValidation";
import penthouse_3 from "../assets/imagenes/room/pentHouse_3.png";
import gmail from "../assets/imagenes/icon/google.svg";
import apple from "../assets/imagenes/icon/apple.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const INITIAL_REGISTER_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  document: "",
  documentType: "ID",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
};

const INITIAL_LOGIN_DATA = { email: "", password: "" };

const Login = () => {
  const [activeTab, setActiveTab] = useState("guest");
  const [focusedField, setFocusedField] = useState(null);

  // Login state
  const [loginData, setLoginData] = useState(INITIAL_LOGIN_DATA);
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginApiError, setLoginApiError] = useState(null);

  // Register state
  const [registerData, setRegisterData] = useState(INITIAL_REGISTER_DATA);
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleSocialLogin = (provider) =>
    alert(`Login con ${provider} próximamente`);

  const shouldLabelFloat = (fieldName, fieldValue) =>
    fieldValue?.trim?.()?.length > 0 || focusedField === fieldName;

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name])
      setLoginErrors((prev) => ({ ...prev, [name]: null }));
    setLoginApiError(null);
  };

  const handleLoginBlur = (name, value) => {
    const key =
      name === "email"
        ? "registerEmail"
        : name === "password"
          ? "loginPassword"
          : name;
    const error = validateField(key, value);
    setLoginErrors((prev) => ({ ...prev, [name]: error }));
    setFocusedField(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateField("registerEmail", loginData.email);
    const passErr = validateField("loginPassword", loginData.password);
    if (emailErr || passErr) {
      setLoginErrors({ email: emailErr, password: passErr });
      return;
    }
    setLoginLoading(true);
    setLoginApiError(null);

    const credentials = {
      email: loginData.email,
      password: loginData.password,
    };

    try {
      // 1. Try guest login first
      const guestRes = await fetch(`${API_URL}/guests/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (guestRes.ok) {
        const data = await guestRes.json();
        localStorage.setItem("guest_token", data.access_token);
        localStorage.setItem("user_role", "guest");
        setLoginData(INITIAL_LOGIN_DATA);
        // FIX: guests go to their reservations, not admin dashboard
        window.location.href = "/guest/reservations";
        return;
      }

      // 2. Fallback: try admin login
      const adminRes = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const adminData = await adminRes.json();
      if (!adminRes.ok)
        throw new Error(adminData.detail || "Invalid email or password.");

      localStorage.setItem("token", adminData.access_token);
      localStorage.setItem("user_role", adminData.role || "admin");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setLoginApiError(err.message || "Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Register handlers
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (registerErrors[name])
      setRegisterErrors((prev) => ({ ...prev, [name]: null }));

    // FIX: re-validate confirmPassword live when password changes
    if (name === "password" && registerData.confirmPassword) {
      const match = value === registerData.confirmPassword
        ? ""
        : "Passwords do not match.";
      setRegisterErrors((prev) => ({ ...prev, confirmPassword: match }));
    }
  };

  const handleRegisterBlur = (name, value) => {
    setFocusedField(null);

    // FIX: validate confirmPassword on blur instead of skipping it
    if (name === "confirmPassword") {
      if (!value?.trim()) {
        setRegisterErrors((prev) => ({ ...prev, confirmPassword: "Please confirm your password." }));
      } else if (value !== registerData.password) {
        setRegisterErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
      } else {
        setRegisterErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
      return;
    }

    const key =
      name === "email"
        ? "registerEmail"
        : name === "password"
          ? "registerPassword"
          : name;

    const error = validateField(key, value);
    setRegisterErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    let valid = true;

    const checks = [
      ["firstName", "firstName"],
      ["lastName", "lastName"],
      ["email", "registerEmail"],
      ["phone", "phone"],
      ["document", "document"],
      ["password", "registerPassword"],
    ];

    checks.forEach(([field, key]) => {
      const error = validateField(key, registerData[field]);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    });

    if (!registerData.confirmPassword?.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
      valid = false;
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setRegisterErrors(newErrors);
    return valid;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setRegisterLoading(true);
    setRegisterError(null);

    const payload = {
      first_name: registerData.firstName,
      last_name: registerData.lastName,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      confirm_password: registerData.confirmPassword,
      document_type: registerData.documentType || null,
      document_number: registerData.document || null,
      date_of_birth: registerData.dateOfBirth || null,
    };

    try {
      const res = await fetch(`${API_URL}/guests/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Error ${res.status}`);
      }
      setRegisterSuccess(true);
      setRegisterData(INITIAL_REGISTER_DATA);
      setRegisterErrors({});
    } catch (err) {
      setRegisterError(err.message || "Unexpected error. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const tabConfig = {
    guest: {
      title: "Welcome Back",
      description: "Please enter your details to access your reservation.",
    },
    staff: {
      title: "Create Account",
      description: "Register your details to manage your reservations.",
    },
  };

  const inputCls = (field, errMap) =>
    `w-full bg-transparent border-b-2 py-3 px-1 outline-none transition ${
      errMap[field]
        ? "border-red-500 focus:border-red-500"
        : focusedField === field
          ? "border-[#5a8a95]"
          : "border-gray-300"
    }`;

  const labelCls = (field, value, errMap) =>
    `absolute left-1 transition-all duration-200 pointer-events-none ${
      shouldLabelFloat(field, value) ? "-top-3 text-xs" : "top-3 text-sm"
    } ${errMap[field] ? "text-red-500" : focusedField === field ? "text-[#5a8a95]" : "text-gray-500"}`;

  const submitBtn = (loading, text, loadingText) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-transparent border-2 border-[#2C5F5D] text-[#2C5F5D] font-semibold rounded-md tracking-wider uppercase transition-all duration-300 shadow-md relative overflow-hidden group hover:border-[#C9A961] hover:text-white disabled:opacity-50"
    >
      <span className="absolute top-0 left-0 w-0 h-full bg-[#C9A961] transition-all duration-300 ease-out group-hover:w-full"></span>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {loading ? loadingText : text}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c5c5c5]">
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#fdfcf0] rounded-lg overflow-hidden shadow-lg">

          {/* Left image */}
          <div className="w-full">
            <img
              src={penthouse_3}
              alt="Luxury Penthouse"
              className="w-full h-[760px] object-cover rounded-l-lg"
            />
          </div>

          {/* Right panel */}
          <div className="flex flex-col overflow-y-auto max-h-[760px]">

            {/* Tab switcher */}
            <div className="relative mt-10 px-8">
              <div className="flex justify-center gap-20">
                {["guest", "staff"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setRegisterSuccess(false);
                      setRegisterError(null);
                      setRegisterErrors({});
                      setLoginApiError(null);
                      setLoginErrors({});
                    }}
                    className={`relative pb-4 text-sm font-semibold tracking-wide transition-colors ${
                      activeTab === tab
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab === "guest" ? "LOGIN" : "REGISTER"}
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

            {/* Login form */}
            {activeTab === "guest" && (
              <div className="px-8 mt-6 pb-8">
                {loginApiError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 text-center" role="alert">
                      {loginApiError}
                    </p>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} noValidate className="space-y-6 mt-4">
                  <div className="relative min-h-[70px]">
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      onFocus={() => setFocusedField("login-email")}
                      onBlur={(e) => handleLoginBlur("email", e.target.value)}
                      required
                      aria-invalid={!!loginErrors.email}
                      className={inputCls("login-email", loginErrors)}
                    />
                    <label className={labelCls("login-email", loginData.email, loginErrors)}>
                      Email Address
                    </label>
                    {loginErrors.email && (
                      <p role="alert" className="mt-1 text-xs text-red-600">{loginErrors.email}</p>
                    )}
                  </div>

                  <div className="relative min-h-[70px]">
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      onFocus={() => setFocusedField("login-password")}
                      onBlur={(e) => handleLoginBlur("password", e.target.value)}
                      required
                      aria-invalid={!!loginErrors.password}
                      className={inputCls("login-password", loginErrors)}
                    />
                    <label className={labelCls("login-password", loginData.password, loginErrors)}>
                      Password
                    </label>
                    {loginErrors.password && (
                      <p role="alert" className="mt-1 text-xs text-red-600">{loginErrors.password}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-[#8b7355] hover:text-[#6d5a43] font-medium transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" id="keepSignedIn" className="w-4 h-4 text-[#8b7355] border-gray-300 rounded" />
                    <label htmlFor="keepSignedIn" className="ml-2 text-sm text-gray-600">
                      Keep me signed in for 30 days
                    </label>
                  </div>

                  {submitBtn(loginLoading, "SIGN IN", "SIGNING IN...")}
                </form>

                <div className="flex items-center justify-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="mx-4 text-sm text-gray-500">OR CONTINUE WITH</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div className="flex justify-center items-center gap-4">
                  {[
                    { src: gmail, alt: "Gmail", label: "Google" },
                    { src: apple, alt: "Apple", label: "Apple" },
                  ].map(({ src, alt, label }) => (
                    <button
                      key={label}
                      onClick={() => handleSocialLogin(label)}
                      className="flex items-center justify-center gap-2 border border-gray-300 hover:border-[#C9A961] px-8 py-3 rounded-lg transition-all flex-1 relative overflow-hidden group"
                    >
                      <span className="absolute top-0 left-0 w-0 h-full bg-[#C9A961] transition-all duration-300 ease-out group-hover:w-full"></span>
                      <img src={src} alt={alt} className="w-5 h-5 relative z-10" />
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveTab("staff")}
                      className="font-semibold text-gray-900 hover:text-[#8b7355] transition-colors"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Register form */}
            {activeTab === "staff" && (
              <div className="px-8 mt-6 pb-8">
                {registerSuccess && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md text-center">
                    <p className="text-emerald-700 font-medium">✓ Registration successful!</p>
                    <p className="text-sm text-emerald-600 mt-1">
                      Your profile has been created. You can now sign in.
                    </p>
                    <button
                      onClick={() => { setActiveTab("guest"); setRegisterSuccess(false); }}
                      className="mt-3 text-sm font-semibold text-[#2C5F5D] hover:text-[#C9A961] transition-colors"
                    >
                      Go to login →
                    </button>
                  </div>
                )}

                {registerError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 text-center" role="alert">{registerError}</p>
                  </div>
                )}

                {!registerSuccess && (
                  <form onSubmit={handleRegisterSubmit} noValidate className="space-y-5">

                    {/* First + Last name */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "firstName", label: "First Name *" },
                        { name: "lastName",  label: "Last Name *"  },
                      ].map(({ name, label }) => (
                        <div key={name} className="relative min-h-[70px]">
                          <input
                            type="text"
                            name={name}
                            value={registerData[name]}
                            onChange={handleRegisterChange}
                            onFocus={() => setFocusedField(name)}
                            onBlur={(e) => handleRegisterBlur(name, e.target.value)}
                            required
                            aria-invalid={!!registerErrors[name]}
                            className={inputCls(name, registerErrors)}
                          />
                          <label className={labelCls(name, registerData[name], registerErrors)}>
                            {label}
                          </label>
                          {registerErrors[name] && (
                            <p role="alert" className="mt-1 text-xs text-red-600">{registerErrors[name]}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Email */}
                    <div className="relative min-h-[70px]">
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        onFocus={() => setFocusedField("reg-email")}
                        onBlur={(e) => handleRegisterBlur("email", e.target.value)}
                        required
                        aria-invalid={!!registerErrors.email}
                        className={inputCls("email", registerErrors)}
                      />
                      <label className={labelCls("reg-email", registerData.email, registerErrors)}>
                        Email Address *
                      </label>
                      {registerErrors.email && (
                        <p role="alert" className="mt-1 text-xs text-red-600">{registerErrors.email}</p>
                      )}
                    </div>

                    {/* Password + Confirm */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative min-h-[70px]">
                        <input
                          type="password"
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          onFocus={() => setFocusedField("reg-password")}
                          onBlur={(e) => handleRegisterBlur("password", e.target.value)}
                          required
                          aria-invalid={!!registerErrors.password}
                          className={inputCls("password", registerErrors)}
                        />
                        <label className={labelCls("reg-password", registerData.password, registerErrors)}>
                          Password *
                        </label>
                        {registerErrors.password && (
                          <p role="alert" className="mt-1 text-xs text-red-600">{registerErrors.password}</p>
                        )}
                      </div>

                      <div className="relative min-h-[70px]">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          onFocus={() => setFocusedField("confirmPassword")}
                          onBlur={(e) => handleRegisterBlur("confirmPassword", e.target.value)}
                          required
                          aria-invalid={!!registerErrors.confirmPassword}
                          className={inputCls("confirmPassword", registerErrors)}
                        />
                        <label className={labelCls("confirmPassword", registerData.confirmPassword, registerErrors)}>
                          Confirm Password *
                        </label>
                        {registerErrors.confirmPassword && (
                          <p role="alert" className="mt-1 text-xs text-red-600">{registerErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="relative min-h-[70px]">
                      <input
                        type="tel"
                        name="phone"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={(e) => handleRegisterBlur("phone", e.target.value)}
                        required
                        aria-invalid={!!registerErrors.phone}
                        className={inputCls("phone", registerErrors)}
                      />
                      <label className={labelCls("phone", registerData.phone, registerErrors)}>
                        Phone *
                      </label>
                      {registerErrors.phone && (
                        <p role="alert" className="mt-1 text-xs text-red-600">{registerErrors.phone}</p>
                      )}
                    </div>

                    {/* Document type + number */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative min-h-[70px]">
                        <select
                          name="documentType"
                          value={registerData.documentType}
                          onChange={handleRegisterChange}
                          onFocus={() => setFocusedField("documentType")}
                          onBlur={() => setFocusedField(null)}
                          className={`${inputCls("documentType", registerErrors)} text-gray-700`}
                        >
                          {["ID", "Passport", "Driver License", "Other"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <label className="-top-3 text-xs absolute left-1 text-gray-500 pointer-events-none">
                          Document Type
                        </label>
                      </div>

                      <div className="relative min-h-[70px]">
                        <input
                          type="text"
                          name="document"
                          value={registerData.document}
                          onChange={handleRegisterChange}
                          onFocus={() => setFocusedField("document")}
                          onBlur={(e) => handleRegisterBlur("document", e.target.value)}
                          aria-invalid={!!registerErrors.document}
                          className={inputCls("document", registerErrors)}
                        />
                        <label className={labelCls("document", registerData.document, registerErrors)}>
                          Document Number
                        </label>
                        {registerErrors.document && (
                          <p role="alert" className="mt-1 text-xs text-red-600">{registerErrors.document}</p>
                        )}
                      </div>
                    </div>

                    {/* Date of birth */}
                    <div className="relative min-h-[70px]">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={registerData.dateOfBirth}
                        onChange={handleRegisterChange}
                        onFocus={() => setFocusedField("dateOfBirth")}
                        onBlur={() => setFocusedField(null)}
                        className={inputCls("dateOfBirth", registerErrors)}
                      />
                      <label className="-top-3 text-xs absolute left-1 text-gray-500 pointer-events-none">
                        Date of Birth
                      </label>
                    </div>

                    {submitBtn(registerLoading, "CREATE ACCOUNT", "REGISTERING...")}

                    <p className="text-center text-sm text-gray-600">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("guest")}
                        className="font-semibold text-gray-900 hover:text-[#8b7355] transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
