'use client'

import { useState, useCallback } from 'react'
import CardList from '@/components/card-list'
import FilterSidebar, { Filters } from '@/components/filter-sidebar'
import Header from '@/components/header'
import Pagination from '@/components/pagination'

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    supertypes: [],
    cardTypes: [],
    subtypes: [],
    rarities: []
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 12

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleTotalCountChange = useCallback((count: number) => {
    setTotalCount(count)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar onFilterChange={handleFilterChange} />
          <div className="flex-1">
            <CardList 
              filters={filters} 
              page={currentPage} 
              pageSize={pageSize} 
              onTotalCountChange={handleTotalCountChange}
            />
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

