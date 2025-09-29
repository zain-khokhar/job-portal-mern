import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const JobApplicationModal = ({ isOpen, onClose, jobDetails }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Application</h2>
            <p className="text-gray-500 mt-1">Please review the job details below</p>
          </div>

          {/* Job Details Form */}
          <form className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={jobDetails?.company || ''}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                value={jobDetails?.title || ''}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={jobDetails?.location || ''}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none"
              />
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                value={jobDetails?.salary || ''}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none"
              />
            </div>

            {/* Message (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter (Optional)
              </label>
              <textarea
                rows="3"
                placeholder="Add a brief message to your application..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobApplicationModal;