import { BookUser } from "lucide-react";
import ContactsTable from "./components/ContactsTable";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Nav */}
      <header className="bg-white border-b px-6 py-4 flex items-center space-x-2 shadow-sm">
        <BookUser className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-semibold tracking-wide text-gray-800">
          Contact Manager
        </h1>
      </header>

      {/* Blue Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-10 shadow-md rounded-b-lg">
        <h2 className="text-3xl font-bold tracking-tight">Your Contacts</h2>
        <p className="text-sm text-blue-100 mt-1">
          Manage your personal and business connections
        </p>
      </div>

      {/* Gradient Background Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        {/* Search + Add Contact */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex justify-between items-center bg-white shadow px-6 py-4 rounded-lg">
            <input
              type="text"
              placeholder="Search contacts by name, email, or phone..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition">
              + Add Contact
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-10">
          <ContactsTable />
        </div>
      </div>
    </div>
  );
}
