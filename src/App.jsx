import { BookUser } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import ContactsTable from "./components/ContactsTable";
import AddContact from "./components/AddContact";
import EditContact from "./components/EditContact";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Top Nav */}
        <header className="bg-white border-b px-6 py-4 flex items-center space-x-2 shadow-sm">
          <BookUser className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold tracking-wide text-gray-800">
            Contact Manager
          </h1>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Blue Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-10 shadow-md rounded-b-lg">
                  <h2 className="text-3xl font-bold tracking-tight">Your Contacts</h2>
                  <p className="text-sm text-blue-100 mt-1">
                    Manage your personal and business connections
                  </p>
                </div>

                {/* Toolbar */}
                <div className="bg-gradient-to-b from-blue-50 to-white py-12">
                  <div className="max-w-5xl mx-auto mb-8">
                    <div className="flex justify-between items-center bg-white shadow px-6 py-4 rounded-lg">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search contacts by name, email, or phone..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      />
                      <Link
                        to="/add"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
                      >
                        + Add Contact
                      </Link>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="mt-10">
                    <ContactsTable searchTerm={searchTerm} />
                  </div>
                </div>
              </>
            }
          />
          <Route path="/add" element={<AddContact />} />
          <Route path="/edit/:id" element={<EditContact />} />
        </Routes>
      </div>
    </Router>
  );
}
