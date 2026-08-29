import "./styles/tokens.css";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
      <CookieBanner />
    </AuthProvider>
  );
}
