import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { API_BASE } from "../Api";

export default function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [existingAvatarUrl, setExistingAvatarUrl] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/contacts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({ name: data.name || "", email: data.email || "", phone: data.phone || "" });
        setExistingAvatarUrl(data.avatarUrl || ""); // ✅ backend returns avatarUrl
        setPreview(data.avatarUrl || "");
      });
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePhotoChange = (file) => {
    if (!file) return;
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(file.type)) {
      setErrors((er) => ({ ...er, avatar: "Unsupported file type. Use JPG, PNG, or WebP." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((er) => ({ ...er, avatar: "File size must be 5 MB or less." }));
      return;
    }
    setErrors((er) => ({ ...er, avatar: undefined }));
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setAvatarFile(new File([], "")); // signal removal
    setPreview("");
    setExistingAvatarUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    if (avatarFile) fd.append("avatar", avatarFile);
    if (avatarFile && avatarFile.size === 0) fd.append("avatar", avatarFile); // removal

    const res = await fetch(`${API_BASE}/contacts/${id}`, { method: "PUT", body: fd });
    if (res.ok) {
      alert("Contact updated successfully");
      navigate("/");
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Failed to update contact.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Contacts
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Edit Contact</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>

        {/* Photo */}
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-full" />
            ) : existingAvatarUrl ? (
              <img src={existingAvatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-gray-400 text-sm">
                {(form.name || "No").split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase()}
              </span>
            )}
            {(preview || existingAvatarUrl) && (
              <button
                type="button"
                title="Remove"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 shadow">
            <Upload className="w-4 h-4 mr-2" /> Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              className="hidden"
            />
          </label>
          {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${
              errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${
              errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="you@company.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${
              errors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <Link to="/" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
