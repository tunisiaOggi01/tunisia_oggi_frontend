import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/home/HomePage';
import { CategoryPage } from './pages/category/CategoryPage';
import { ArticleDetailPage } from './pages/article-detail/ArticleDetailPage';
import { AdminLoginPage } from './pages/admin-login/AdminLoginPage';
import { AdminRegisterPage } from './pages/admin-register/AdminRegisterPage';
import { AdminForgotPasswordPage } from './pages/admin-forgot-password/AdminForgotPasswordPage';
import { AdminResetPasswordPage } from './pages/admin-reset-password/AdminResetPasswordPage';
import { AdminDashboardPage } from './pages/admin-dashboard/AdminDashboardPage';
import { AdminCompleteProfilePage } from './pages/admin-complete-profile/AdminCompleteProfilePage';
import { AdminArticlesPage } from './pages/admin-articles/AdminArticlesPage';
import { AdminCategoriesPage } from './pages/admin-categories/AdminCategoriesPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { DirectoryPage } from './pages/directory/DirectoryPage';
import { SubmitListingPage } from './pages/directory/SubmitListingPage';
import { ListingDetailPage } from './pages/directory/listing-detail/ListingDetailPage';
import { MyListingsPage } from './pages/my-listings/MyListingsPage';
import { AdminAdsPage } from './pages/admin-ads/AdminAdsPage';
import { AdminNewsletterPage } from './pages/admin-newsletter/AdminNewsletterPage';
import { SearchPage } from './pages/search/SearchPage';
import { RequireAuth } from './components/admin/RequireAuth';
import { HeardAboutModal } from './components/common/HeardAboutModal';
import { useAuth } from './context/AuthContext';

const AUTH_ROUTES = ['/admin/login', '/admin/register', '/admin/forgot-password', '/admin/reset-password', '/admin/complete-profile'];

export default function App() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [showHeard, setShowHeard] = useState(false);
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (user && user.profileCompleted && !user.heardAbout) {
      setShowHeard(true);
    }
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/article/:slug" element={<ArticleDetailPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
          <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
          <Route path="/admin/complete-profile" element={<AdminCompleteProfilePage />} />
          <Route path="/admin" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
          <Route path="/admin/articles" element={<RequireAuth><AdminArticlesPage /></RequireAuth>} />
          <Route path="/admin/categories" element={<RequireAuth><AdminCategoriesPage /></RequireAuth>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/directory/add" element={<SubmitListingPage />} />
          <Route path="/directory/:id" element={<ListingDetailPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/admin/ads" element={<RequireAuth><AdminAdsPage /></RequireAuth>} />
          <Route path="/admin/newsletter" element={<RequireAuth><AdminNewsletterPage /></RequireAuth>} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {showHeard && <HeardAboutModal onClose={() => setShowHeard(false)} />}
    </div>
  );
}
