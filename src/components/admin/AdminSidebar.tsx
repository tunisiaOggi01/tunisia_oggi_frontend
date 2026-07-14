import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/categories', label: 'Categories' },
];

/** Left nav for the admin CMS: Articles / Categories, highlighting the active route. */
export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 border-r border-gray-200 p-6">
      <p className="font-serif text-lg font-bold text-brand">Tunisia Oggi</p>
      <p className="text-xs text-gray-500">Tunisia Oggi CMS</p>
      <nav className="mt-8 space-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block rounded px-3 py-2 text-sm ${
              location.pathname === link.to ? 'bg-brand/10 font-semibold text-brand' : 'text-gray-600'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
