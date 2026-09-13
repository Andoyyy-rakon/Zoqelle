import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, LogOut, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-bright border-r border-outline-variant/80 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-outline-variant/60">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-family-display)' }}>
                Zoqelle
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-primary bg-primary rounded">
                Admin
              </span>
            </Link>
            <button
              className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto" aria-label="Main navigation">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-primary text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-accent-gold' : 'text-on-surface-variant/70'}`} aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-outline-variant/60 bg-surface-container/30">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
              <span>Zoqelle Bakery Admin v1.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 lg:px-8 bg-surface-bright/95 backdrop-blur border-b border-outline-variant/60">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-on-surface lg:text-2xl" style={{ fontFamily: 'var(--font-family-display)' }}>
              {location.pathname === '/' && 'Dashboard Overview'}
              {location.pathname === '/products' && 'Product Management'}
              {location.pathname === '/orders' && 'Customer Orders'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-surface-container transition-colors focus-ring"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="h-9 w-9 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-accent-gold" />
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-on-surface">
                  {profile?.name || 'Admin'}
                </span>
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-surface-bright rounded-xl border border-outline-variant shadow-lg py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-outline-variant/60">
                    <p className="text-sm font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
                      {profile?.name || 'Administrator'}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {profile?.email}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-primary bg-primary rounded-full">
                      Administrator
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}