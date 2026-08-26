import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostProduct from './pages/PostProduct';
import EditProduct from './pages/EditProduct';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import OrderPlaced from './pages/OrderPlaced';
import { useAuth } from './context/Authcontext';

function App() {

  const { user } = useAuth();

  return (
    <>
      {
        user ? <Navbar /> : null
      }
      
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/post" element={<ProtectedRoute><PostProduct /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chat/:productId/:otherUserId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/order-placed" element={<ProtectedRoute><OrderPlaced /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;