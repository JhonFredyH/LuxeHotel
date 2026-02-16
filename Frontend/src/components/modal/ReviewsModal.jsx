import React from "react";
import { X, Star } from "lucide-react";

const ReviewsModal = ({ isOpen, onClose, roomName, reviews, rating, totalReviews }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col animate-slideUp">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{roomName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-gray-900">{rating}</span>
                </div>
                <span className="text-gray-500">·</span>
                <span className="text-gray-600">{totalReviews} reviews</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Reviews List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading reviews...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.guest_name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.stay_date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {review.rating_overall}
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {review.comment_title}
                    </h5>
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment_text}
                    </p>

                    {/* Traveler Type Badge */}
                    <div className="mt-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {review.traveler_type}
                      </span>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { label: 'Cleanliness', value: review.rating_cleanliness },
                        { label: 'Comfort', value: review.rating_comfort },
                        { label: 'Location', value: review.rating_location },
                        { label: 'Staff', value: review.rating_staff },
                        { label: 'Value', value: review.rating_value },
                      ].map((item) => (
                        <div key={item.label} className="text-xs">
                          <span className="text-gray-500">{item.label}:</span>
                          <span className="ml-1 font-semibold text-gray-900">{item.value}/5</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ReviewsModal;