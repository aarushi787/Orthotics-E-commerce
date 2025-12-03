import Sidebar from "./Sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
    </div>
  );
}
