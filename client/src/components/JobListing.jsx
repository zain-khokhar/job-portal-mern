import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const JobListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fade, setFade] = useState(true);

  // Safely resolve and format a job's posted date from various possible fields
  const getPostedDate = (job) => {
    if (!job) return null;
    const raw = job.postedDate || job.postedAt || job.createdAt || job.date || null;
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString();
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        // Ensure a stable, most-recent-first order regardless of backend
        const toTime = (job) => {
          const raw = job.postedDate || job.postedAt || job.createdAt || job.date || null;
          const d = raw ? new Date(raw) : null;
          return d && !isNaN(d.getTime()) ? d.getTime() : 0;
        };
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => toTime(b) - toTime(a))
          : [];
        setJobs(sorted);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Do not use static mock data; show empty state instead
        setJobs([]);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const results = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Job Cards Grid */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!isLoading && filteredJobs.length === 0 && (
          <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-600">
            No jobs found. Try adjusting your search.
          </div>
        )}
        <AnimatePresence>
          {filteredJobs.map((job) => (
            <motion.div
              key={job._id || job.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-full" />
                  <span className="px-3 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-full">
                    {job.jobType || job.type || 'N/A'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <p className="text-gray-500 mb-2">{job.location}</p>
                <p className="text-gray-500 mb-4">{job.salaryRange || job.salary || 'Salary: N/A'}</p>
                <div className="flex items-center justify-end text-sm">
                  <span className="text-gray-500">Posted: {getPostedDate(job) || 'N/A'}</span>
                </div>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default JobListing;