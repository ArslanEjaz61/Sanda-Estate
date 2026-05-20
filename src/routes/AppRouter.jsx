import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import PropertiesPage from '../pages/PropertiesPage'
import PropertyDetailPage from '../pages/PropertyDetailPage'
import AreasPage from '../pages/AreasPage'
import AreaDetailPage from '../pages/AreaDetailPage'
import ContactPage from '../pages/ContactPage'
import PrivacyPage from '../pages/PrivacyPage'
import TermsPage from '../pages/TermsPage'
import NotFoundPage from '../pages/NotFoundPage'

// Admin
import AdminLogin from '../admin/AdminLogin'
import AdminRoute from '../admin/AdminRoute'
import AdminLayout from '../admin/AdminLayout'
import Dashboard from '../admin/Dashboard'
import PropertyList from '../admin/PropertyList'
import PropertyForm from '../admin/PropertyForm'
import ContactList from '../admin/ContactList'
import AreaList from '../admin/AreaList'
import AreaForm from '../admin/AreaForm'
import TeamList from '../admin/TeamList'
import TeamForm from '../admin/TeamForm'
import Settings from '../admin/Settings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/areas/:slug" element={<AreaDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<PropertyList />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/edit/:id" element={<PropertyForm />} />
          <Route path="areas" element={<AreaList />} />
          <Route path="areas/new" element={<AreaForm />} />
          <Route path="areas/edit/:id" element={<AreaForm />} />
          <Route path="team" element={<TeamList />} />
          <Route path="team/new" element={<TeamForm />} />
          <Route path="team/edit/:id" element={<TeamForm />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
