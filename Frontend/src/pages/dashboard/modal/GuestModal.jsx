import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, CreditCard, MapPin, Calendar, FileText } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  document: "",
  documentType: "ID",
  address: "",
  city: "",
  country: "",
  dateOfBirth: "",
  notes: "",
};

const GuestModal = ({ 
  isOpen, 
  onClose, 
  isDark, 
  guest = null,
  onSubmit 
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const documentTypes = ["ID", "Passport", "Driver License", "Other"];
  const isEditMode = !!guest;

  // Cargar datos si es modo edición
  useEffect(() => {
    if (!isOpen) return;
    if (guest) {
      setFormData({
        firstName: guest.first_name || "",
        lastName: guest.last_name || "",
        email: guest.email || "",
        phone: guest.phone || "",
        document: guest.document_number || "",
        documentType: guest.document_type || "ID",
        address: guest.address || "",
        city: guest.city || "",
        country: guest.country || "",
        dateOfBirth: guest.date_of_birth || "",
        notes: guest.notes || "",
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, guest?.id]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Convertir camelCase del form → snake_case del backend
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      document_type: formData.documentType || null,
      document_number: formData.document || null,
      date_of_birth: formData.dateOfBirth || null,
      address: formData.address || null,
      city: formData.city || null,
      country: formData.country || null,
      notes: formData.notes || null,
    };

    const url = isEditMode
      ? `${API_URL}/guests/${guest.id}`
      : `${API_URL}/guests`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Error ${res.status}`);
      }

      const savedGuest = await res.json();
      onSubmit?.(savedGuest);
      onClose();
    } catch (err) {
      setError(err.message || "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
    isDark
      ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
      : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
  }`;
  const labelCls = `block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
            isDark
              ? "bg-slate-900 border border-slate-700/50"
              : "bg-white border border-slate-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-5 border-b flex items-center justify-between ${
              isDark
                ? "bg-slate-800/50 border-slate-700/50"
                : "bg-gradient-to-r from-blue-50 to-blue-100/30 border-slate-200"
            }`}
          >
            <div>
              <h2 className="text-2xl font-bold">
                {isEditMode ? "Edit Guest" : "New Guest"}
              </h2>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isEditMode ? "Update guest information" : "Complete guest details"}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)]"
          >
            <div className="space-y-5">

              {/* Error banner */}
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>First Name *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}><Mail className="w-3.5 h-3.5 inline mr-1" />Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@email.com" required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}><Phone className="w-3.5 h-3.5 inline mr-1" />Phone *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}><Calendar className="w-3.5 h-3.5 inline mr-1" />Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Identification */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Identification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Document Type *</label>
                    <select name="documentType" value={formData.documentType} onChange={handleChange} required className={inputCls}>
                      {documentTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Document Number *</label>
                    <input type="text" name="document" value={formData.document} onChange={handleChange} placeholder="123456789" required className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Street Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street, Apt 4B" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="New York" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="United States" className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={labelCls}><FileText className="w-3.5 h-3.5 inline mr-1" />Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional information about the guest..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

            </div>
          </form>

          {/* Footer */}
          <div
            className={`px-6 py-4 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 ${
              isDark
                ? "border-slate-700/50 bg-slate-800/30"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-100"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-800"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create Guest"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestModal;
