import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_ORGANIZATIONS, CREATE_ORGANIZATION } from "../graphql/queries";
import type { Organization } from "../types/organization";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: orgData, refetch } = useQuery(GET_ORGANIZATIONS);

  const [createOrganization, { loading, error }] =
    useMutation(CREATE_ORGANIZATION);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    contactEmail: "",
  });
  const [showForm, setShowForm] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrganization({ variables: formData });
      await refetch(); // refresh org list
      setFormData({ name: "", slug: "", contactEmail: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error creating organization:", err);
    }
  };

  return (
    <div className="h-screen w-screen  flex flex-col items-center justify-center">
      <h1 className="text-2xl text-white md:text-4xl font-bold text-center m-6">
        PROJECT MANAGEMENT SYSTEM
      </h1>

      <div className="mb-6 text-center text-black ">
        <select
          className="border p-2 rounded"
          onChange={(e) => {
            const organizationId = e.target.value;
            navigate(`/projects/${organizationId}`);
          }}
        >
          <option value="">Select Organization</option>
          {orgData?.organizations.map((org: Organization) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Organization
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Add Organization
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Organization Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="slug"
                placeholder="Slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="email"
                name="contactEmail"
                placeholder="Contact Email"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm">Error: {error.message}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
