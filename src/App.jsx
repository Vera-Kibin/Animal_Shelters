import "./styles/tokens.css";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
