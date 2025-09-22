import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2} from "lucide-react";


export default function ContactsTable() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch from backend
  useEffect(() => {
    fetch(
      `http://localhost:8080/api/contacts?page=${currentPage - 1}&size=${pageSize}`
    )
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.content || []);          // paginated contacts
        setTotalPages(data.totalPages || 1);      // total pages
        setTotalResults(data.totalElements || 0); // total count
      })
      .catch((err) => console.error("Error fetching contacts:", err));
  }, [currentPage, pageSize]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === contacts.length) {
      setSelected([]);
    } else {
      setSelected(contacts.map((c) => c.id));
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelected([]); // clear selection when changing pages
    }
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
          className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
            selected.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
          disabled={selected.length === 0}
        >
          <Pencil className="w-4 h-4" />
          <span>Edit</span>
        </button>

        <button
          className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
            selected.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          disabled={selected.length === 0}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === contacts.length && contacts.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-2 text-gray-700 text-left whitespace-nowrap">
                <span className="inline-flex items-center space-x-1">
                  <span>Contact</span>
                  <ChevronUp className="w-3 h-3 text-gray-400" />
                  <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                </span>
              </th>
              <th className="px-4 py-2 text-gray-700 text-left whitespace-nowrap">
                Email
              </th>
              <th className="px-4 py-2 text-gray-700 text-left whitespace-nowrap">
                Phone
              </th>
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
                      src={contact.avatar || `https://i.pravatar.cc/40?u=${contact.id}`}
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
                  <td className="px-4 py-2 text-gray-600">{contact.phone}</td>
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        {/* Left side: results count */}
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalResults)} of {totalResults} results
        </span>

        {/* Right side: controls */}
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
              setCurrentPage(1); // reset to page 1
            }}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
