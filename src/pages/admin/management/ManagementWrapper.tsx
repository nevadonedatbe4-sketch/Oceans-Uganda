import { Outlet } from 'react-router-dom';
import ManagementSubNav from './components/ManagementSubNav';

export default function ManagementWrapper() {
  return (
    <div className="flex h-full -m-6 overflow-hidden">
      <ManagementSubNav />
      <div className="flex-1 overflow-y-auto p-6 bg-[#f7f5f0]">
        <Outlet />
      </div>
    </div>
  );
}
