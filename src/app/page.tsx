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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>

      <div>
        <p>Search</p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onSearchChange}
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
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
                <th>Degree</th>
                <th>Specialties</th>
                <th>Years of Experience</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate) => (
                <tr key={advocate.phoneNumber}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s) => (
                      <div key={s}>{s}</div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
