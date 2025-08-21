import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_ORGANIZATIONS } from "../graphql/queries";
import type { Organization } from "../types/organization";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: orgData } = useQuery(GET_ORGANIZATIONS);

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
    </div>
  );
};

export default Dashboard;
