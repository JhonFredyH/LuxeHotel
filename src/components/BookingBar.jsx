import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingBar = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [errors, setErrors] = useState({ checkIn: false, checkOut: false });

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const incrementAdults = () => setAdults((prev) => Math.min(prev + 1, 10));
  const decrementAdults = () => setAdults((prev) => Math.max(prev - 1, 1));
  const incrementChildren = () => setChildren((prev) => Math.min(prev + 1, 10));
  const decrementChildren = () => setChildren((prev) => Math.max(prev - 1, 0));

  const handleCheckRates = () => {
    if (!checkIn || !checkOut) {
      setErrors({ checkIn: !checkIn, checkOut: !checkOut });
      return;
    }

    navigate(
      `/check-rates?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&adults=${adults}&children=${children}`,
    );
  };

  return (
    <section className="bg-[#FAF8F3] shadow-lg -mt-24 sm:-mt-32 md:-mt-44 lg:-mt-56 relative z-20 mx-4 sm:mx-6 md:mx-8 lg:mx-auto lg:max-w-[92%] 2xl:max-w-[90%] rounded-lg border border-gray-200">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.2fr_auto] items-end gap-4 lg:gap-5">
          {/* Check-in */}
          <div className="w-full">
            <label className="block text-sm lg:text-sm font-medium text-[#2D2D2D] uppercase tracking-wider mb-2">
              Check-In
            </label>
            <div className="relative min-h-[44px]">
              <DatePicker
                selected={checkIn}
                onChange={(date) => {
                  setCheckIn(date);
                  setErrors((prev) => ({
                    ...prev,
                    checkIn: false,
                    checkOut: !checkOut,
                  }));
                }}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                placeholderText="Select date"
                dateFormat="MMM d, yyyy"
                className={`w-full px-0 py-2 border-0 border-b-2 ${
                  errors.checkIn ? "border-red-500" : "border-gray-300"
                } focus:border-[#5a8a95] focus:outline-none transition-colors text-base lg:text-lg bg-transparent cursor-pointer`}
                calendarClassName="custom-calendar"
                wrapperClassName="w-full"
              />
              <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              {errors.checkIn && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  Please select check-in date
                </p>
              )}
            </div>
          </div>

          {/* Check-out */}
          <div className="w-full">
            <label className="block text-sm lg:text-sm font-medium text-[#2D2D2D] uppercase tracking-wider mb-2">
              Check-Out
            </label>
            <div className="relative min-h-[44px]">
              <DatePicker
                selected={checkOut}
                onChange={(date) => {
                  setCheckOut(date);
                  setErrors((prev) => ({
                    ...prev,
                    checkOut: false,
                    checkIn: !checkIn,
                  }));
                }}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || new Date()}
                placeholderText="Select date"
                dateFormat="MMM d, yyyy"
                className={`w-full px-0 py-2 border-0 border-b-2 ${
                  errors.checkOut ? "border-red-500" : "border-gray-300"
                } focus:border-[#5a8a95] focus:outline-none transition-colors text-base lg:text-lg bg-transparent cursor-pointer`}
                calendarClassName="custom-calendar"
                wrapperClassName="w-full"
              />

              <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              {errors.checkOut && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  Please select check-out date
                </p>
              )}
            </div>
          </div>

          {/* Guests Dropdown */}
          <div
            className="w-full relative"
            ref={dropdownRef}
          >
            <label className="block text-sm lg:text-sm font-medium text-[#2D2D2D] uppercase tracking-wider mb-2">
              Guests
            </label>
            <div
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-[#5a8a95] cursor-pointer flex items-center justify-between bg-transparent min-h-[44px]"
            >
              <span className="text-[clamp(0.9rem,2vw,1.1rem)]">
                {adults} Adult{adults !== 1 ? "s" : ""}, {children} Children
              </span>
              {showGuestDropdown ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Dropdown Panel */}
            {showGuestDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#fdfcf0] border border-gray-200 rounded-lg shadow-xl z-50 p-4 animate-slideDown">
                {/* Adults */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-base font-medium text-gray-800">
                    Adults
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementAdults}
                      disabled={adults === 1}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-[#5a8a95] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-lg font-medium transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-lg">
                      {adults}
                    </span>
                    <button
                      onClick={incrementAdults}
                      disabled={adults === 10}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-[#5a8a95] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-lg font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-800">
                    Children
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementChildren}
                      disabled={children === 0}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-[#5a8a95] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-lg font-medium transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-lg">
                      {children}
                    </span>
                    <button
                      onClick={incrementChildren}
                      disabled={children === 10}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-[#5a8a95] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-lg font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckRates}
            className="w-full sm:col-span-2 xl:col-span-1 xl:w-auto px-8 py-3 rounded-[3px] font-bold bg-transparent border-2 border-[#2C5F5D] text-[#2C5F5D] uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap text-base xl:min-w-[160px] mt-1 xl:mt-0 relative overflow-hidden group hover:border-[#C9A961] hover:text-white"
          >
            <span className="absolute top-0 left-0 w-0 h-full bg-[#C9A961] transition-all duration-300 ease-out group-hover:w-full"></span>
            <span className="relative z-10">Check Rates</span>
          </button>
        </div>

        {/* Additional information */}
        <p className="text-center text-[clamp(0.8rem,2vw,1rem)] text-gray-500 mt-5 sm:mt-6 font-bold">
          Best rate guaranteed · Free cancellation up to 12 hours
        </p>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        /* Custom DatePicker Styles */
        :global(.react-datepicker) {
          font-family: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        :global(.react-datepicker__header) {
          background-color: #5a8a95;
          border-bottom: none;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          padding-top: 1rem;
        }

        :global(.react-datepicker__current-month) {
          color: white;
          font-weight: 600;
          font-size: 1rem;
        }

        :global(.react-datepicker__day-name) {
          color: white;
          font-weight: 500;
          width: 2.5rem;
          line-height: 2.5rem;
        }

        :global(.react-datepicker__day) {
          width: 2.5rem;
          line-height: 2.5rem;
          margin: 0.2rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        :global(.react-datepicker__day:hover) {
          background-color: #e0f2f1;
          border-radius: 0.5rem;
        }

        :global(.react-datepicker__day--selected) {
          background-color: #5a8a95;
          color: white;
          font-weight: 600;
        }

        :global(.react-datepicker__day--keyboard-selected) {
          background-color: #7ba8b3;
          color: white;
        }

        :global(.react-datepicker__day--in-range) {
          background-color: #b8d4d9;
          color: #1f2937;
        }

        :global(.react-datepicker__day--in-selecting-range) {
          background-color: #d1e7eb;
        }

        :global(.react-datepicker__day--range-start),
        :global(.react-datepicker__day--range-end) {
          background-color: #5a8a95 !important;
          color: white !important;
          font-weight: 600;
        }

        :global(.react-datepicker__day--disabled) {
          color: #d1d5db;
          cursor: not-allowed;
        }

        :global(.react-datepicker__day--disabled:hover) {
          background-color: transparent;
        }

        :global(.react-datepicker__navigation) {
          top: 1rem;
        }

        :global(.react-datepicker__navigation-icon::before) {
          border-color: white;
          border-width: 2px 2px 0 0;
        }

        :global(.react-datepicker__navigation:hover *::before) {
          border-color: #f0f9ff;
        }

        :global(.react-datepicker__month) {
          margin: 1rem;
        }

        :global(.react-datepicker__triangle) {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default BookingBar;
