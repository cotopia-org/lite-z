import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OrgPaginationProps {
  currentPage: number; // Current active page
  totalItems: number; // Total number of pages
  perPage: number; // Number of items per page
  onPageChange: (page: number) => void; // Function to handle page changes
}

export default function OrgPagination({
  currentPage,
  totalItems,
  perPage,
  onPageChange,
}: OrgPaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage); // Calculate total pages

  // Helper function to render pagination links
  const renderPageNumbers = () => {
    const pages = [];

    // Display the first page and the last page always
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        pages[pages.length - 1].key !== "ellipsis" &&
        Math.abs(i - currentPage) === 3
      ) {
        // Add ellipsis if the current gap is too large
        pages.push(
          <PaginationItem key='ellipsis'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
