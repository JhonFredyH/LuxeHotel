import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, CreditCard, MapPin, Calendar, FileText } from "lucide-react";

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
  guest = null, // Si existe, es modo edición
  onSubmit 
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const documentTypes = ["ID", "Passport", "Driver License", "Other"];

  // Cargar datos si es modo edición
  useEffect(() => {
    if (!isOpen) return;
    
    if (guest) {
      setFormData({
        firstName: guest.firstName || "",
        lastName: guest.lastName || "",
        email: guest.email || "",
        phone: guest.phone || "",
        document: guest.document || "",
        documentType: guest.documentType || "ID",
        address: guest.address || "",
        city: guest.city || "",
        country: guest.country || "",
        dateOfBirth: guest.dateOfBirth || "",
        notes: guest.notes || "",
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, guest?.id]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  const isEditMode = !!guest;

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
              <p
                className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                {isEditMode 
                  ? "Update guest information"
                  : "Complete guest details"}
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
              {/* Personal Information Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@email.com"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5 inline mr-1" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                        isDark
                          ? "bg-slate-800 border-slate-600 text-slate-200"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Document Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Identification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Document Type *
                    </label>
                    <select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                        isDark
                          ? "bg-slate-800 border-slate-600 text-slate-200"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}
                    >
                      {documentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Document Number *
                    </label>
                    <input
                      type="text"
                      name="document"
                      value={formData.document}
                      onChange={handleChange}
                      placeholder="123456789"
                      required
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                        isDark
                          ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                          : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </h3>

                <div className="space-y-3">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, Apt 4B"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                        isDark
                          ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                          : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="United States"
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1" />
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional information about the guest..."
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors resize-none ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
                      : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                  }`}
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
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm hover:shadow-md"
            >
              {isEditMode ? "Save Changes" : "Create Guest"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestModal;
