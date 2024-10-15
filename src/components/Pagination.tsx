import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  pages.push(1);

  if (currentPage > 4) {
    pages.push('...');
  }

  let startPage = Math.max(2, currentPage - 2);
  let endPage = Math.min(currentPage + 2, totalPages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push('...');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <div className="flex justify-center space-x-2 mt-6">
      <button
        className="px-4 py-2 border rounded-lg bg-gray-200"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          className={`px-4 py-2 border rounded-lg ${
            page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      <button
        className="px-4 py-2 border rounded-lg bg-gray-200"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
