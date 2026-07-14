import { Link } from 'react-router-dom';

const CATEGORIES = ['National', 'Politics', 'Community', 'Culture', 'Economy'];

/** Top site navigation: logo, category links, and the Create Article / Admin Login actions. */
export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-xl font-bold text-brand">
          TUNISIA OGGI
        </Link>
        <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
          {CATEGORIES.map((category) => (
            <Link key={category} to={`/category/${category.toLowerCase()}`} className="hover:text-brand">
              {category}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/admin/articles" className="rounded border border-brand px-3 py-1.5 text-sm text-brand">
            + Create Article
          </Link>
          <Link to="/admin/login" className="rounded bg-brand px-3 py-1.5 text-sm text-white">
            Admin Login
          </Link>
        </div>
      </div>
    </header>
  );
}
