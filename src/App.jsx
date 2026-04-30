import shelters from "./data/shelters.json";
// import Header from "./components/Header.jsx";
import ShelterList from "./components/ShelterList.jsx";
import MapPanel from "./components/MapPanel.jsx";
// import Footer from "./components/Footer.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* <Header /> */}
      <main className="main-layout">
        <ShelterList shelters={shelters} />
        <MapPanel />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
