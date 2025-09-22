import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

export default function AddContact() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "", // backend expects avatar
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Please enter a name.";
    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format.";
    if (!form.phone) newErrors.phone = "Phone is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setForm({ ...form, avatar: objectUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8080/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        navigate("/"); // go back to contacts page
      } else {
        const msg = await res.text();
        alert("Error saving contact: " + msg);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Contacts
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Add New Contact</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        {/* Section Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Contact Information
        </h3>

        {/* Photo Upload */}
        <div className="flex items-center space-x-6">
          {/* Avatar circle */}
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-gray-400 text-sm">No photo</span>
            )}
          </div>

          {/* Upload button */}
          <div>
            <label className="block">
              <span className="sr-only">Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photoUpload"
              />
              <label
                htmlFor="photoUpload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 shadow"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </label>
            </label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${
              errors.name
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="e.g. Jessica Wang"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${
              errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="e.g. jessica@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${
              errors.phone
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="e.g. +1 (555) 321-0987"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
          >
            Save Contact
          </button>
        </div>
      </form>
    </div>
  );
}
