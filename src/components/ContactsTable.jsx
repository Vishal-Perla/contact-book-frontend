import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ContactsTable() {
  const [contacts] = useState([
    { id: 1, name: "Vishal Perla", email: "vishal@example.com", phone: "+1 555-123-4567", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "Shraddheya Tarekar", email: "shraddheya@example.com", phone: "+1 555-987-6543", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "Sunny Reddy", email: "sunny@example.com", phone: "+1 555-222-3333", avatar: "https://i.pravatar.cc/40?img=3" },
  ]);

  const [selected, setSelected] = useState([]);

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

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-5xl mx-auto">
      {/* Info Bar */}
      <div className="flex justify-between items-center px-2 py-3 border-b mb-3 text-sm">
        <span className="text-gray-600">
          {contacts.length} contacts | {selected.length} selected
        </span>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              selected.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
            disabled={selected.length === 0}
          >
            Edit
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              selected.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            disabled={selected.length === 0}
          >
            Delete
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
                  checked={selected.length === contacts.length}
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
                <span className="inline-flex items-center space-x-1">
                  <span>Email</span>
                  <ChevronUp className="w-3 h-3 text-gray-400" />
                  <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                </span>
              </th>
              <th className="px-4 py-2 text-gray-700 text-left whitespace-nowrap">
                <span className="inline-flex items-center space-x-1">
                  <span>Phone</span>
                  <ChevronUp className="w-3 h-3 text-gray-400" />
                  <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                </span>
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
                      src={contact.avatar}
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
    </div>
  );
}
