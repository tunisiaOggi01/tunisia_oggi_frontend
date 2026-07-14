import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/home/HomePage';
import { CategoryPage } from './pages/category/CategoryPage';
import { ArticleDetailPage } from './pages/article-detail/ArticleDetailPage';
import { AdminLoginPage } from './pages/admin-login/AdminLoginPage';
import { AdminArticlesPage } from './pages/admin-articles/AdminArticlesPage';
import { AdminCategoriesPage } from './pages/admin-categories/AdminCategoriesPage';
import { RequireAuth } from './components/admin/RequireAuth';

/** Router shell: layout chrome (Navbar/Footer) wraps every route. */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/article/:slug" element={<ArticleDetailPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/articles" element={<RequireAuth><AdminArticlesPage /></RequireAuth>} />
          <Route path="/admin/categories" element={<RequireAuth><AdminCategoriesPage /></RequireAuth>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
