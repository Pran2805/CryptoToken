import React from 'react';

interface ResultMessageProps {
  type: 'success' | 'error';
  children: React.ReactNode;
}

const ResultMessage: React.FC<ResultMessageProps> = ({ type, children }) => {
  return (
    <div className={`result-${type} animate__animated animate__fadeInUp`}>
      {children}
    </div>
  );
};

export default ResultMessage;