// src/main.jsx
/* eslint-disable react/prop-types */
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetail from './components/recipe/RecipeDetail';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css'
import PWABadge from './PWABadge';

// Layout component dengan navbar
function Layout({ children, showNavbar = true }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show navbar when needed */}
      {showNavbar && (
        <>
          <DesktopNavbar />
          <MobileNavbar />
        </>
      )}
      
      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      <PWABadge />
    </div>
  );
}

// Wrapper untuk halaman dengan layout
function withLayout(Component, showNavbar = true) {
  return function WrappedComponent(props) {
    return (
      <Layout showNavbar={showNavbar}>
        <Component {...props} />
      </Layout>
    );
  };
}

export function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <Routes>
        {/* Halaman dengan navbar */}
        <Route path="/" element={withLayout(HomePage)()} />
        <Route path="/home" element={withLayout(HomePage)()} />
        <Route path="/makanan" element={withLayout(MakananPage)()} />
        <Route path="/minuman" element={withLayout(MinumanPage)()} />
        <Route path="/profile" element={withLayout(ProfilePage)()} />
        
        {/* Halaman detail resep dengan navbar */}
        <Route 
          path="/recipe/:recipeId" 
          element={withLayout(RecipeDetailWrapper)()} 
        />
        
        {/* Halaman tanpa navbar */}
        <Route 
          path="/create-recipe" 
          element={withLayout(CreateRecipePage, false)()} 
        />
        <Route 
          path="/edit-recipe/:recipeId" 
          element={withLayout(EditRecipePageWrapper, false)()} 
        />
        
        {/* Fallback route */}
        <Route path="*" element={withLayout(NotFoundPage)()} />
      </Routes>
    </Router>
  );
}

// Wrapper components untuk handle props
function RecipeDetailWrapper() {
  // Extract recipeId dari URL params
  const { recipeId } = useParams();
  
  const handleBack = () => {
    window.history.back();
  };

  const handleEditRecipe = (recipeId) => {
    // Navigate to edit page
    window.location.href = `/edit-recipe/${recipeId}`;
  };

  return (
    <RecipeDetail
      recipeId={recipeId}
      onBack={handleBack}
      onEdit={handleEditRecipe}
    />
  );
}

function EditRecipePageWrapper() {
  const { recipeId } = useParams();
  
  const handleBack = () => {
    window.history.back();
  };

  const handleEditSuccess = () => {
    alert('Resep berhasil diperbarui!');
    // Redirect back to recipe detail or previous page
    window.history.back();
  };

  return (
    <EditRecipePage
      recipeId={recipeId}
      onBack={handleBack}
      onSuccess={handleEditSuccess}
    />
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Halaman tidak ditemukan</p>
        <a 
          href="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);