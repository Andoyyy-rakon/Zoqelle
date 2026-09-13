import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import ZoqelleLogo from '../assets/ZoqelleLogo.png'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-1 py-2 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors focus-ring ${
    isActive
      ? 'text-primary after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[1.5px] after:bg-accent-gold'
      : 'text-on-surface-variant hover:text-primary'
  }`;

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      toast.success('Signed out. See you soon!');
      navigate('/');
    } catch (err) {
      toast.error((err as Error).message);
    }
    setMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-outline-variant/70 bg-surface-bright/95 backdrop-blur-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 md:px-6">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 shrink-0 focus-ring"
          style={{ fontFamily: 'var(--font-family-display)' }}
        >
          {/* <CakeSlice className="h-5 w-5 text-accent-gold" strokeWidth={1.75} /> */}
          <img
          src={ZoqelleLogo}
          alt="Zoqelle Logo"
          className="h-auto w-8 sm:w-9 md:w-10 object-contain md:pb-3 pb-1"
  />
          <span className="text-[22px] font-semibold tracking-tight text-primary">Zoqelle</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-[13px] font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring"
              >
                <User className="h-[15px] w-[15px]" strokeWidth={1.75} />
                Profile
              </Link>
              <Link
                to="/orders"
                className="text-[13px] font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring"
              >
                Orders
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-[13px] font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring"
              >
                <LogOut className="h-[15px] w-[15px]" strokeWidth={1.75} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[13px] font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-on-primary transition-colors focus-ring"
                style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
              >
                Register
              </Link>
            </>
          )}

          <NavLink
            to="/cart"
            className={({ isActive }) => `relative flex items-center focus-ring ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
            aria-label="Cart"
          >
            <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.75} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center text-[10px] font-bold text-on-primary rounded-full"
                style={{ backgroundColor: 'var(--color-accent-gold)' }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </NavLink>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 text-on-surface-variant md:hidden hover:bg-surface-container transition-colors focus-ring"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-outline-variant/70 bg-surface-bright px-4 py-4 md:hidden animate-slide-down">
          <NavLink to="/" end className="px-2 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/shop" className="px-2 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink
            to="/cart"
            className="flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.75} />
            Cart
            {totalItems > 0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center text-xs font-bold text-on-primary rounded-full"
                style={{ backgroundColor: 'var(--color-accent-gold)' }}
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </NavLink>

          {user ? (
            <>
              <NavLink to="/profile" className="px-2 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring" onClick={() => setMenuOpen(false)}>
                Profile
              </NavLink>
              <NavLink to="/orders" className="px-2 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring" onClick={() => setMenuOpen(false)}>
                My Orders
              </NavLink>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-2 py-2.5 text-left text-sm font-medium text-on-surface-variant hover:text-primary focus-ring"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="px-2 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring" onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="px-2 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors focus-ring" onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}