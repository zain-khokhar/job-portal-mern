import React from 'react';

export const Card = ({ title, children }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};

export const FormGroup = ({ label, error, children }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export const Input = ({ type = "text", error, ...props }) => {
  return (
    <input
      type={type}
      {...props}
      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
        ${error 
          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
    />
  );
};

export const Select = ({ options, error, ...props }) => {
  return (
    <select
      {...props}
      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md sm:text-sm
        ${error
          ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const Textarea = ({ error, ...props }) => {
  return (
    <textarea
      {...props}
      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
        ${error
          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
    />
  );
};

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  isLoading,
  children,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${props.className || ''}
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};