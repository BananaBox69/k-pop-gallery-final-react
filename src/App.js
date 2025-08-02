import React from 'react';
import { AppProvider } from './context/AppProvider';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import { FilterProvider } from './hooks/useFilters';
import { UIProvider } from './context/UIProvider'; // Import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from './views/Gallery';
import Admin from './views/Admin';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <CartProvider>
          <FilterProvider>
            <UIProvider> {/* Wrap app here */}
              <Router>
                <Routes>
                  <Route path="/" element={<Gallery />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Router>
            </UIProvider>
          </FilterProvider>
        </CartProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;