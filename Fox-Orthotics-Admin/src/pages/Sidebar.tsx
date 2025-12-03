import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-6 flex flex-col gap-4">
      <Link to="/dashboard" className="text-lg font-semibold">
        Dashboard
      </Link>
      <Link to="/products">Products</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/users">Users</Link>
    </div>
  );
}
