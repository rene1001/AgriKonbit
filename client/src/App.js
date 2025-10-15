import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import AdminGuard from './components/guards/AdminGuard';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages critiques chargées immédiatement (above the fold)
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages secondaires chargées à la demande (code splitting)
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const Users = lazy(() => import('./pages/Admin/Users'));
const AdminProducts = lazy(() => import('./pages/Admin/Products'));
const WithdrawalRequests = lazy(() => import('./pages/Admin/WithdrawalRequests'));
const WithdrawalSettings = lazy(() => import('./pages/Admin/WithdrawalSettings'));
const InvestorWithdrawals = lazy(() => import('./pages/Admin/InvestorWithdrawals'));
const PlatformFees = lazy(() => import('./pages/Admin/PlatformFees'));
const DistributeReturns = lazy(() => import('./pages/Admin/DistributeReturns'));
const PlatformTreasury = lazy(() => import('./pages/Admin/PlatformTreasury'));
const Traceability = lazy(() => import('./pages/Traceability'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const OrderTrackingDetail = lazy(() => import('./pages/OrderTrackingDetail'));
const SubmitProject = lazy(() => import('./pages/Farmer/SubmitProject'));
const MyProjects = lazy(() => import('./pages/Farmer/MyProjects'));
const ProjectManagement = lazy(() => import('./pages/Farmer/ProjectManagement'));
const ProjectsMap = lazy(() => import('./pages/ProjectsMap'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Suspense fallback={<LoadingSpinner message="Chargement de la page..." />}>
              <Routes>
              {/* Public routes - Pages critiques chargées immédiatement */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Public routes - Lazy loaded */}
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/:id" element={<ProductDetail />} />
              <Route path="/traceability/:id" element={<Traceability />} />
              <Route path="/track/:orderId" element={<OrderTracking />} />
              <Route path="/orders/:orderId/track" element={<OrderTrackingDetail />} />
              <Route path="/map" element={<ProjectsMap />} />

              {/* Protected routes - Lazy loaded */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/farmer/submit-project" element={<SubmitProject />} />
              <Route path="/farmer/my-projects" element={<MyProjects />} />
              <Route path="/farmer/projects/:id/manage" element={<ProjectManagement />} />

              {/* Admin routes - Protected with AdminGuard + Lazy loaded */}
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/users" element={<AdminGuard><Users /></AdminGuard>} />
              <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
              <Route path="/admin/withdrawal-requests" element={<AdminGuard><WithdrawalRequests /></AdminGuard>} />
              <Route path="/admin/investor-withdrawals" element={<AdminGuard><InvestorWithdrawals /></AdminGuard>} />
              <Route path="/admin/distribute-returns" element={<AdminGuard><DistributeReturns /></AdminGuard>} />
              <Route path="/admin/platform-fees" element={<AdminGuard><PlatformFees /></AdminGuard>} />
              <Route path="/admin/treasury" element={<AdminGuard><PlatformTreasury /></AdminGuard>} />
              <Route path="/admin/withdrawal-settings" element={<AdminGuard><WithdrawalSettings /></AdminGuard>} />

              {/* 404 - Lazy loaded */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
