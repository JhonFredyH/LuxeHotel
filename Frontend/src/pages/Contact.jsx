import { MapPinPlus, Phone, Clock } from "lucide-react";
import { useContactForm } from "../components/utils/useContactForm";
import { useState } from "react";

const Contact = () => {
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useContactForm();

  const [focusedField, setFocusedField] = useState(null);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    alert("✅ Message sent successfully!");
    resetForm();
  };

  const shouldLabelFloat = (fieldName, fieldValue) => {
    return fieldValue.trim().length > 0 || focusedField === fieldName;
  };

  return (
    <section
      className="min-h-screen bg-[#F4F1E8] px-2 sm:px-6 lg:px-8 xl:px-14 py-2 sm:py-4"
      id="contact"
    >
      <div className="max-w-3xl mb-8 sm:mb-10">
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold text-gray-800">
          Get in <span className="font-light">Touch</span>
        </h1>
        <p className="text-[clamp(1rem,2.2vw,1.25rem)] text-gray-600 leading-relaxed">
          Our concierge team is here to assist with your journey and stay.
        </p>
        <div
          className="w-60 h-0.5 bg-gradient-to-r from-[#3F6F78] to-[#6F5E4B] mt-6"
          aria-hidden="true"
        />
      </div>

      <div className="max-w-8xl mx-auto -mt-2">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start">
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 border border-gray-200">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold text-gray-800 mb-6 sm:mb-8">
              Send us a message
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="relative min-h-[70px]">
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={(e) => {
                      setFocusedField(null);
                      handleBlur(e);
                    }}
                    className={`peer w-full border-b-2 bg-transparent py-3 px-1 outline-none transition ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-teal-600"
                    }`}
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-1 transition-all duration-200 pointer-events-none ${
                      shouldLabelFloat("name", formData.name)
                        ? "-top-3 text-xs"
                        : "top-3 text-sm"
                    } ${
                      focusedField === "name" && !errors.name
                        ? "text-teal-600"
                        : errors.name
                          ? "text-red-500"
                          : "text-gray-500"
                    }`}
                  >
                    Full Name
                  </label>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="relative min-h-[70px]">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={(e) => {
                      setFocusedField(null);
                      handleBlur(e);
                    }}
                    className={`peer w-full border-b-2 bg-transparent py-3 px-1 outline-none transition ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-teal-600"
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
                        ? "text-teal-600"
                        : errors.email
                          ? "text-red-500"
                          : "text-gray-500"
                    }`}
                  >
                    Email
                  </label>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="relative min-h-[70px]">
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={(e) => {
                    setFocusedField(null);
                    handleBlur(e);
                  }}
                  className={`peer w-full border-b-2 bg-transparent py-3 px-1 outline-none transition ${
                    errors.subject
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-teal-600"
                  }`}
                />
                <label
                  htmlFor="subject"
                  className={`absolute left-1 transition-all duration-200 pointer-events-none ${
                    shouldLabelFloat("subject", formData.subject)
                      ? "-top-3 text-xs"
                      : "top-3 text-sm"
                  } ${
                    focusedField === "subject" && !errors.subject
                      ? "text-teal-600"
                      : errors.subject
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                >
                  Subject
                </label>
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              <div className="relative min-h-[70px]">
                <textarea
                  id="message"
                  rows="2"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={(e) => {
                    setFocusedField(null);
                    handleBlur(e);
                  }}
                  className={`peer w-full border-b-2 bg-transparent py-3 px-1 resize-none outline-none transition ${
                    errors.message
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-teal-600"
                  }`}
                />
                <label
                  htmlFor="message"
                  className={`absolute left-1 transition-all duration-200 pointer-events-none ${
                    shouldLabelFloat("message", formData.message)
                      ? "-top-3 text-xs"
                      : "top-3 text-sm"
                  } ${
                    focusedField === "message" && !errors.message
                      ? "text-teal-600"
                      : errors.message
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                >
                  Message
                </label>
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 rounded-[4px] hover:bg-teal-700 transition font-medium mt-4 sm:mt-6 text-[clamp(0.85rem,2vw,1rem)]"
                >
                  SEND MESSAGE
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 w-full">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 border border-gray-200">
              <div className="flex gap-4 items-center">
                <MapPinPlus className="text-[#8d7b68] w-8 h-8" />
                <div>
                  <h2 className="text-[clamp(0.85rem,1.8vw,1rem)] font-semibold text-gray-800">
                    Our Address
                  </h2>
                  <p className="text-gray-600 mt-2 text-[clamp(0.85rem,1.9vw,1rem)]">
                    123 Resort Avenue, Paradise City Coopenhage, Denmark
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 border border-gray-200">
              <div className="flex gap-4 items-start sm:items-center">
                <Phone className="text-[#8d7b68] w-8 h-8" />
                <div>
                  <h2 className="text-[clamp(0.85rem,1.8vw,1rem)] font-semibold text-gray-800">
                    Reservations
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <p className="text-gray-600 mt-2 text-[clamp(0.85rem,1.9vw,1rem)]">
                      +57 312 810 3686
                    </p>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-[clamp(0.85rem,1.9vw,1rem)] break-all">
                      <a
                        href="mailto:reservations@luxeboutique.com"
                        className="text-teal-600 font-semibold hover:underline transition"
                      >
                        reservations@luxeboutique.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 border border-gray-200">
              <div className="flex gap-4 items-center">
                <Clock className="text-[#8d7b68] w-8 h-8" />
                <div>
                  <h2 className="text-[clamp(0.85rem,1.8vw,1rem)] font-semibold text-gray-800">
                    Check-in / out
                  </h2>
                  <p className="text-gray-600 mt-2 text-[clamp(0.85rem,1.9vw,1rem)]">
                    Check-in 3:00 PM – Check-out 12:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-lg border border-gray-900">
                <iframe
                  title="map"
                  src="https://www.google.com/maps?q=Copenhague, Dinamarca&output=embed&z=10"
                  className="w-full h-[260px] sm:h-[320px] lg:h-[360px] border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
