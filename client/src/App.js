import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import AdminGuard from './components/guards/AdminGuard';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Users from './pages/Admin/Users';
import AdminProducts from './pages/Admin/Products';
import Traceability from './pages/Traceability';
import OrderTracking from './pages/OrderTracking';
import SubmitProject from './pages/Farmer/SubmitProject';
import MyProjects from './pages/Farmer/MyProjects';
import ProjectsMap from './pages/ProjectsMap';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<ProductDetail />} />
            <Route path="/traceability/:id" element={<Traceability />} />
            <Route path="/track/:orderId" element={<OrderTracking />} />
            <Route path="/map" element={<ProjectsMap />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/farmer/submit-project" element={<SubmitProject />} />
            <Route path="/farmer/my-projects" element={<MyProjects />} />

            {/* Admin routes - Protected with AdminGuard */}
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/users" element={<AdminGuard><Users /></AdminGuard>} />
            <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
