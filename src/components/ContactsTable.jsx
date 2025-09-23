import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../Api";

export default function ContactsTable({ searchTerm }) {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [query, setQuery] = useState(searchTerm || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // keep prop in sync
  useEffect(() => setQuery(searchTerm || ""), [searchTerm]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch
  useEffect(() => {
    const url = `${API_BASE}/contacts?q=${encodeURIComponent(
      debouncedQuery
    )}&page=${currentPage - 1}&size=${pageSize}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setContacts(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalResults(data.totalElements || 0);
      })
      .catch((err) => console.error("fetch contacts error", err));
  }, [debouncedQuery, currentPage, pageSize]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === contacts.length) setSelected([]);
    else setSelected(contacts.map((c) => c.id));
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setSelected([]);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setCurrentPage(1);
  };

  const handleEdit = () => {
    if (selected.length === 1) navigate(`/edit/${selected[0]}`);
    else alert("Please select exactly one contact to edit.");
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_BASE}/contacts/${id}`, { method: "DELETE" });
    if (res.status === 204) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setTotalResults((n) => Math.max(0, n - 1));
      alert("Contact deleted successfully.");
    } else {
      alert("Error deleting contact.");
    }
    setConfirmingDelete(null);
    setSelected([]);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-5xl mx-auto">
      {/* Info Bar */}
      <div className="flex justify-between items-center px-2 py-3 border-b mb-3 text-sm">
        <span className="text-gray-600">
          {totalResults} contacts | {selected.length} selected
        </span>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
              selected.length !== 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
            disabled={selected.length !== 1}
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              if (selected.length === 1) {
                const contact = contacts.find((c) => c.id === selected[0]);
                setConfirmingDelete(contact);
              } else {
                alert("Please select exactly one contact to delete.");
              }
            }}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
              selected.length !== 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            disabled={selected.length !== 1}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {debouncedQuery && contacts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p>No contacts found for “{debouncedQuery}”.</p>
          <button
            onClick={clearSearch}
            className="text-blue-600 hover:underline mt-2"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === contacts.length && contacts.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 text-gray-700">Contact</th>
                <th className="px-4 py-2 text-gray-700">Email</th>
                <th className="px-4 py-2 text-gray-700">Phone</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((contact, i) => (
                  <tr
                    key={contact.id}
                    className={`border-t ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                      />
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 flex items-center space-x-2">
                      <img
                        src={
                          contact.avatarUrl
                            ? `${API_BASE.replace("/api", "")}${contact.avatarUrl}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=E5E7EB&color=4B5563`
                        }
                       alt={contact.name}
                       className="w-8 h-8 rounded-full border"
                      />
                      <span>{contact.name}</span>
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {contact.phone}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-400 italic"
                  >
                    No contacts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalResults)} of {totalResults}{" "}
          results
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next →
          </button>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Delete Confirmation */}
      {confirmingDelete && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Delete <span className="font-bold">{confirmingDelete.name}</span>?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmingDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmingDelete.id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
