import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'Guest';

  return (
    <div className="dashboard-root">
      <Sidebar role={role} />
      
      <div className="dashboard-main" style={{ paddingTop: '72px' }}>
        <div className="scanlines" />
        
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
