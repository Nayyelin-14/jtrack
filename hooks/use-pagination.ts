"use client";

import { useState, useCallback } from "react";

export function usePagination(initialPage = 1, initialTotalPages = 1) {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const next = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prev = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  const goTo = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }, [totalPages]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    totalPages,
    setPage,
    setTotalPages,
    next,
    prev,
    goTo,
    reset,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
