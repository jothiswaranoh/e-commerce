import { ReactNode, useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-neutral-100">
            {/* Sidebar */}
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}
            >
                <AdminHeader />

                {/* pt-28: mobile needs space for the fixed top bar (14px brand + nav strip) */}
                <main className="p-4 md:p-8 pt-28 lg:pt-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
