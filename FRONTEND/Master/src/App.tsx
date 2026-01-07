import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Overview from './Overview'
import Dashboard from "./Pages/Admin/Dashboard";


const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Not Found</p>
    </div>
  );
};

const Accueil = () => <div className="text-white">Page Accueil</div>;
const Sites = () => <div className="text-white">Page Sites & Travaux</div>;
const Employes = () => <div className="text-white">Page Employés</div>;
const Materiaux = () => <div className="text-white">Page Matériaux</div>;
const Stats = () => <div className="text-white">Page Tableau de bord</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path='sites' element={<Sites />} />
          <Route path='employé' element={<Employes />} />
          <Route path='matériaux' element={<Materiaux />} />
          <Route path='dashboard' element={<Stats />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
