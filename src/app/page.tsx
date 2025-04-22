"use client";

import { useEffect, useState } from "react";
import type { Advocate } from "@/types/advocate";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      searchTerm,
      page: String(currentPage),
      limit: "10",
    });

    fetch(`/api/advocates?${params.toString()}`)
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setTotalPages(jsonResponse.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load advocates");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchTerm, currentPage]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">Solace Advocates</h1>

      <div className="mb-4">
        <label htmlFor="search" className="block text-lg mb-2">Search</label>
        <input
          id="search"
          value={searchTerm}
          onChange={onSearchChange}
          className="p-2 w-full border rounded-md shadow-sm"
          placeholder="Search for advocates"
        />
      </div>

      {loading && <p className="text-gray-500">Loading advocates...</p>}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && filteredAdvocates?.length === 0 && (
        <p className="text-gray-600">No advocates found.</p>
      )}

      {!loading && !error && advocates?.length > 0 && filteredAdvocates.length > 0 && (
        <>
          <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">First Name</th>
                <th className="px-4 py-2 text-left">Last Name</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-left">Degree</th>
                <th className="px-4 py-2 text-left">Specialties</th>
                <th className="px-4 py-2 text-left">Years of Experience</th>
                <th className="px-4 py-2 text-left">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate) => (
                <tr key={advocate.phoneNumber} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{advocate.firstName}</td>
                  <td className="px-4 py-2">{advocate.lastName}</td>
                  <td className="px-4 py-2">{advocate.city}</td>
                  <td className="px-4 py-2">{advocate.degree}</td>
                  <td className="px-4 py-2">
                    {advocate.specialties.map((s) => (
                      <div key={s}>{s}</div>
                    ))}
                  </td>
                  <td className="px-4 py-2">{advocate.yearsOfExperience}</td>
                  <td className="px-4 py-2">{advocate.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
