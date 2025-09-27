import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, FormGroup, Input, Select, Textarea } from '../../components/admin/common/FormComponents';
import { Table, SearchBar, Pagination } from '../../components/admin/common/TableComponents';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiBriefcase, FiDollarSign, FiCalendar } from 'react-icons/fi';
import adminData from '../../data/adminData';

const JobForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
const [company, setCompany] = useState("");
const [location, setLocation] = useState("");
const [jobType, setJobType] = useState("");   // full-time, part-time, contract
const [salaryRange, setSalaryRange] = useState("");
const [experience, setExperience] = useState("");
const [deadline, setDeadline] = useState("");
const [description, setDescription] = useState("");
const [requirements, setRequirements] = useState("");
// new job submit logic
const handleSubmit = async () => {
  // Simple validation
  if (!title.trim() || !company.trim() || !location.trim() || !jobType.trim()) {
    alert("Please fill all required fields: Title, Company, Location, Job Type");
    return;
  }

  const jobData = {
    title,
    company,
    location,
    jobType,
    salaryRange,
    experience,
    deadline,
    description,
    requirements
  };

  try {
    const response = await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Job saved successfully:', result);
      alert("Job saved successfully!");
      // Refresh the jobs list
      window.dispatchEvent(new CustomEvent('jobsUpdated'));
      onClose();
    } else {
      console.error('Failed to save job');
      alert("Failed to save job");
    }
  } catch (error) {
    console.error('Error saving job:', error);
    alert("Error saving job");
  }
};

  return (
   <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
  <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormGroup label="Job Title">
      <Input 
        placeholder="e.g., Senior React Developer"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </FormGroup>

    <FormGroup label="Company">
      <Input 
        placeholder="e.g., Tech Corp"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
    </FormGroup>

    <FormGroup label="Location">
      <Input 
        placeholder="e.g., Remote, New York"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </FormGroup>

    <FormGroup label="Job Type">
      <Select 
        options={[
          { value: 'full-time', label: 'Full-time' },
          { value: 'part-time', label: 'Part-time' },
          { value: 'contract', label: 'Contract' }
        ]}
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
      />
    </FormGroup>

    <FormGroup label="Salary Range">
      <Input 
        placeholder="e.g., $100,000 - $130,000"
        value={salaryRange}
        onChange={(e) => setSalaryRange(e.target.value)}
      />
    </FormGroup>

    <FormGroup label="Experience">
      <Input 
        placeholder="e.g., 3+ years"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />
    </FormGroup>

    <FormGroup label="Application Deadline" className="md:col-span-2">
      <Input 
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
    </FormGroup>

    <FormGroup label="Job Description" className="md:col-span-2">
      <Textarea 
        rows={4} 
        placeholder="Enter detailed job description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </FormGroup>

    <FormGroup label="Requirements" className="md:col-span-2">
      <Textarea 
        rows={4} 
        placeholder="Enter job requirements..."
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
      />
    </FormGroup>
  </div>

  <div className="flex justify-end space-x-3 mt-6">
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
    <button variant="primary" onClick={handleSubmit}>Save Job</button>
    {/* <Button  variant="primary" >Save Job</Button> */}
  </div>
</div>

  );
};

const ManageJobs = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobsPerPage = 5;

  // delete job function
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;

  try {
    const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert("Job deleted successfully!");
      // Update frontend state after deletion
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } else {
      alert("Failed to delete job");
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    alert("Error deleting job");
  }
};
// <----------delete job function ends here------->


  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      
      // Transform the data to match the table structure
      const transformedJobs = data.map(job => ({
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.jobType,
        salary: job.salaryRange,
        status: job.status || 'Active',
        deadline: new Date(job.deadline).toLocaleDateString(),
        applications: job.applications?.length || 0
      }));
      
      setJobs(transformedJobs);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
      // Fallback to mock data if API fails
      setJobs(adminData.recentJobs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const columns = [
    { 
      key: 'title', 
      header: 'Job Title',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-sm text-gray-500">{row.company}</div>
        </div>
      )
    },
    { 
      key: 'details', 
      header: 'Details',
      render: (row) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-500 mb-1">
            <FiMapPin className="h-4 w-4 mr-1" />
            {row.location}
          </div>
          <div className="flex items-center text-gray-500 mb-1">
            <FiBriefcase className="h-4 w-4 mr-1" />
            {row.type}
          </div>
          <div className="flex items-center text-gray-500">
            <FiDollarSign className="h-4 w-4 mr-1" />
            {row.salary}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className="flex flex-col items-start">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-2">
            {row.status}
          </span>
          <span className="flex items-center text-sm text-gray-500">
            <FiCalendar className="h-4 w-4 mr-1" />
            {row.deadline}
          </span>
        </div>
      )
    },
    { 
      key: 'applications', 
      header: 'Applications',
      render: (row) => (
        <div className="text-center">
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            {row.applications}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit job:', row);
            }}
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button
  variant="danger"
  size="sm"
  onClick={(e) => {
    e.stopPropagation();
    handleDelete(row.id); // pass the job id
  }}
>
  <FiTrash2 className="h-4 w-4" />
</Button>

        </div>
      ),
    },
  ];

  // Calculate pagination
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // Add event listener for job updates
  useEffect(() => {
    const handleJobsUpdated = () => {
      fetchJobs();
    };

    window.addEventListener('jobsUpdated', handleJobsUpdated);
    return () => window.removeEventListener('jobsUpdated', handleJobsUpdated);
  }, [fetchJobs]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Jobs</h1>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <FiPlus className="h-5 w-5 mr-2" />
          Add New Job
        </Button>
      </div>

      {showForm ? (
        <JobForm onClose={() => setShowForm(false)} />
      ) : (
     <Card>
  <div className="mb-4">
    <SearchBar
      value={search}
      onChange={setSearch}
      placeholder="Search jobs..."
    />
  </div>

  {isLoading ? (
    <div className="text-center py-4">Loading jobs...</div>
  ) : error ? (
    <div className="text-center py-4 text-red-600">
      Error: {error}. Showing mock data instead.
    </div>
  ) : (
    <>
      <Table
        columns={columns}
        data={currentJobs}
        onRowClick={(job) => console.log('Job clicked:', job)}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  )}
</Card>

      )}
    </div>
  );
};

export default ManageJobs;
