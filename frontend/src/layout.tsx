import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import "@/styles/index.css"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </div>
    </div>
  );
}
