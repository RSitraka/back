import React, { useState } from 'react';
import {
  Home, MapPin, Users, Hammer, BarChart3, Plus, Trash2,
  Upload, Truck, Save, ChevronRight
} from 'lucide-react';
import type {SiteType, SiteEmployee, SiteStatus, Site, Material, Employee, OtherExpense, VehicleInfo} from "./Utils/interface"

const initialMaterials: Material[] = [
  { id: '1', name: 'Marteau Piqueur', model: 'X200', supplier: 'BricoPro', price: 150 },
  { id: '2', name: 'Câble RJ45 (m)', model: 'Cat6', supplier: 'ElecWorld', price: 2 },
  { id: '3', name: 'Routeur Industriel', model: 'Cisco', supplier: 'NetStore', price: 500 },
];

const initialEmployees: Employee[] = [
  { id: '1', firstName: 'Jean', lastName: 'Dupont', address: 'Tana', phone: '0340000000', certificates: [] },
  { id: '2', firstName: 'Marie', lastName: 'Curie', address: 'Antsirabe', phone: '0320000000', certificates: [] },
];

const initialSites: Site[] = [
  {
    id: '1',
    createdAt: new Date(),
    type: 'Installation',
    gpsLink: 'https://maps.google.com/?q=-18.8792,47.5079',
    photos: [],
    files: [],
    materials: [{ materialId: '2', quantity: 100 }, { materialId: '3', quantity: 1 }],
    otherExpenses: [{ id: 'ex1', description: 'Repas équipe', amount: 50 }],
    vehicle: { plate: '1234 TBA', driverId: 'Paul', agency: 'RentCar', cost: 200 },
    employees: [{ employeeId: '1', salaryPaid: 100 }],
    status: 'En cours'
  },
  {
    id: '2',
    createdAt: new Date(),
    type: 'Installation',
    gpsLink: 'https://maps.google.com/?q=-18.8792,47.5079',
    photos: [],
    files: [],
    materials: [{ materialId: '2', quantity: 100 }, { materialId: '3', quantity: 1 }],
    otherExpenses: [{ id: 'ex1', description: 'Repas équipe', amount: 50 }],
    vehicle: { plate: '1234 TBA', driverId: 'Paul', agency: 'RentCar', cost: 200 },
    employees: [{ employeeId: '1', salaryPaid: 100 }],
    status: 'En cours'
  }
];

// --- COMPOSANTS UTILITAIRES ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={` rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }: { status: SiteStatus }) => {
  const color = status === 'En cours' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
};

// --- APPLICATION PRINCIPALE ---

export default function Overview() {
  const [activeTab, setActiveTab] = useState<'home' | 'sites' | 'employees' | 'materials' | 'dashboard'>('home');

  // États Globaux
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // --- LOGIQUE DE CALCUL ---
  const calculateSiteTotal = (site: Site) => {
    let total = 0;
    // Matériels
    site.materials.forEach(sm => {
      const mat = materials.find(m => m.id === sm.materialId);
      if (mat) total += mat.price * sm.quantity;
    });
    // Dépenses autres
    site.otherExpenses.forEach(exp => total += exp.amount);
    // Véhicule
    if (site.vehicle) total += site.vehicle.cost;
    // Salaires
    site.employees.forEach(se => total += se.salaryPaid);

    return total;
  };

  const calculateBreakdown = (site: Site) => {
    let matCost = 0;
    let salCost = 0;

    site.materials.forEach(sm => {
      const mat = materials.find(m => m.id === sm.materialId);
      if (mat) matCost += mat.price * sm.quantity;
    });

    site.employees.forEach(se => salCost += se.salaryPaid);

    return { matCost, salCost };
  };

  // --- VUES (COMPONENTS) ---

  const SidebarItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center w-full p-4 transition-colors ${activeTab === id
          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );

  // 1. VUE ACCUEIL
  const HomeView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sites Actuels (En cours)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.filter(s => s.status === 'En cours').map(site => (
          <Card key={site.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Badge status={site.status} />
              <span className="text-sm text-gray-400">{site.type}</span>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Site #{site.id}</h3>
              <a href={site.gpsLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> Localisation
              </a>
            </div>
            <div className="flex justify-between items-end border-t pt-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Dépenses Totales</p>
                <p className="text-2xl font-bold text-blue-600">{calculateSiteTotal(site).toLocaleString()} Ar</p>
              </div>
              <button onClick={() => setActiveTab('sites')} className="text-sm text-gray-600 hover:text-blue-600 flex items-center">
                Détails <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </Card>
        ))}
        {sites.filter(s => s.status === 'En cours').length === 0 && (
          <p className="text-gray-500 italic">Aucun site en cours actuellement.</p>
        )}
      </div>
    </div>
  );

  // 2. VUE GESTION SITES (Formulaire Complexe)
  const SiteManager = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentSite, setCurrentSite] = useState<Partial<Site>>({
      type: 'Installation',
      status: 'En cours',
      materials: [],
      otherExpenses: [],
      employees: [],
      photos: [],
      files: []
    });

    const handleSaveSite = () => {
      if (!currentSite.gpsLink) return alert("Localisation requise");

      const newSite = {
        ...currentSite,
        id: currentSite.id || Date.now().toString(),
        createdAt: currentSite.createdAt || new Date(),
        materials: currentSite.materials || [],
        otherExpenses: currentSite.otherExpenses || [],
        employees: currentSite.employees || [],
        photos: currentSite.photos || [],
        files: currentSite.files || [],
      } as Site;

      if (currentSite.id) {
        setSites(sites.map(s => s.id === currentSite.id ? newSite : s));
      } else {
        setSites([...sites, newSite]);
      }
      setIsEditing(false);
      setCurrentSite({ type: 'Installation', status: 'En cours', materials: [], otherExpenses: [], employees: [], photos: [], files: [] });
    };

    const addMaterialToSite = (matId: string, qty: number) => {
      const existing = currentSite.materials?.find(m => m.materialId === matId);
      let newMats = [];
      if (existing) {
        newMats = currentSite.materials!.map(m => m.materialId === matId ? { ...m, quantity: m.quantity + qty } : m);
      } else {
        newMats = [...(currentSite.materials || []), { materialId: matId, quantity: qty }];
      }
      setCurrentSite({ ...currentSite, materials: newMats });
    };

    if (isEditing) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{currentSite.id ? 'Modifier le Site' : 'Nouveau Site'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded">Annuler</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Info de base */}
            <Card>
              <h3 className="font-bold mb-4 text-blue-600">Informations Générales</h3>
              <div className="space-y-4">
                <select
                  className="w-full border p-2 rounded"
                  value={currentSite.type}
                  onChange={e => setCurrentSite({ ...currentSite, type: e.target.value as SiteType })}
                >
                  <option>Calibrage</option>
                  <option>Installation</option>
                  <option>Maintenance</option>
                </select>
                <input
                  type="text"
                  placeholder="Lien GPS Coordonnées"
                  className="w-full border p-2 rounded"
                  value={currentSite.gpsLink || ''}
                  onChange={e => setCurrentSite({ ...currentSite, gpsLink: e.target.value })}
                />
                <select
                  className="w-full border p-2 rounded"
                  value={currentSite.status}
                  onChange={e => setCurrentSite({ ...currentSite, status: e.target.value as SiteStatus })}
                >
                  <option>En cours</option>
                  <option>Terminé</option>
                </select>
              </div>
            </Card>

            {/* Véhicule */}
            <Card>
              <h3 className="font-bold mb-4 text-blue-600 flex items-center"><Truck className="w-4 h-4 mr-2" /> Véhicule</h3>
              <div className="space-y-2">
                <input placeholder="Immatriculation" className="w-full border p-2 rounded"
                  value={currentSite.vehicle?.plate || ''}
                  onChange={e => setCurrentSite({ ...currentSite, vehicle: { ...currentSite.vehicle!, plate: e.target.value } })}
                />
                <input placeholder="Chauffeur" className="w-full border p-2 rounded"
                  value={currentSite.vehicle?.driverId || ''}
                  onChange={e => setCurrentSite({ ...currentSite, vehicle: { ...currentSite.vehicle!, driverId: e.target.value } })}
                />
                <input placeholder="Agence" className="w-full border p-2 rounded"
                  value={currentSite.vehicle?.agency || ''}
                  onChange={e => setCurrentSite({ ...currentSite, vehicle: { ...currentSite.vehicle!, agency: e.target.value } })}
                />
                <input type="number" placeholder="Coût (Carburant + Loc)" className="w-full border p-2 rounded"
                  value={currentSite.vehicle?.cost || 0}
                  onChange={e => setCurrentSite({ ...currentSite, vehicle: { ...currentSite.vehicle!, cost: parseFloat(e.target.value) } })}
                />
              </div>
            </Card>

            {/* Matériels */}
            <Card className="lg:col-span-2">
              <h3 className="font-bold mb-4 text-blue-600 flex items-center"><Hammer className="w-4 h-4 mr-2" /> Matériels Utilisés</h3>
              <div className="flex gap-2 mb-4">
                <select id="matSelect" className="border p-2 rounded flex-1">
                  {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.price} Ar)</option>)}
                </select>
                <input id="qtyInput" type="number" placeholder="Qté" className="border p-2 rounded w-24" />
                <button
                  onClick={() => {
                    const sel = document.getElementById('matSelect') as HTMLSelectElement;
                    const qty = document.getElementById('qtyInput') as HTMLInputElement;
                    addMaterialToSite(sel.value, parseInt(qty.value));
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >Ajouter</button>
              </div>
              <ul className="space-y-2">
                {currentSite.materials?.map((sm, idx) => {
                  const mat = materials.find(m => m.id === sm.materialId);
                  return (
                    <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{mat?.name} (x{sm.quantity})</span>
                      <span className="font-bold text-gray-700">{((mat?.price || 0) * sm.quantity).toLocaleString()} Ar</span>
                    </li>
                  )
                })}
              </ul>
            </Card>

            {/* Employés & Salaires */}
            <Card className="lg:col-span-2">
              <h3 className="font-bold mb-4 text-blue-600 flex items-center"><Users className="w-4 h-4 mr-2" /> Employés & Salaires</h3>
              <div className="flex gap-2 mb-4">
                <select id="empSelect" className="border p-2 rounded flex-1">
                  {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
                <input id="salaryInput" type="number" placeholder="Montant payé / Avance" className="border p-2 rounded w-48" />
                <button
                  onClick={() => {
                    const sel = document.getElementById('empSelect') as HTMLSelectElement;
                    const sal = document.getElementById('salaryInput') as HTMLInputElement;
                    const newEmps = [...(currentSite.employees || []), { employeeId: sel.value, salaryPaid: parseFloat(sal.value) }];
                    setCurrentSite({ ...currentSite, employees: newEmps });
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >Lier</button>
              </div>
              <ul className="space-y-2">
                {currentSite.employees?.map((se, idx) => {
                  const emp = employees.find(e => e.id === se.employeeId);
                  return (
                    <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{emp?.firstName} {emp?.lastName}</span>
                      <span className="font-bold text-gray-700">{se.salaryPaid.toLocaleString()} Ar</span>
                    </li>
                  )
                })}
              </ul>
            </Card>

            {/* Autres Dépenses */}
            <Card>
              <h3 className="font-bold mb-4 text-blue-600">Autres Dépenses (Batellage, etc.)</h3>
              <div className="flex gap-2 mb-2">
                <input id="otherDesc" placeholder="Description" className="border p-2 flex-1 rounded" />
                <input id="otherAmount" type="number" placeholder="Montant" className="border p-2 w-32 rounded" />
                <button onClick={() => {
                  const desc = document.getElementById('otherDesc') as HTMLInputElement;
                  const amt = document.getElementById('otherAmount') as HTMLInputElement;
                  const newExp = [...(currentSite.otherExpenses || []), { id: Date.now().toString(), description: desc.value, amount: parseFloat(amt.value) }];
                  setCurrentSite({ ...currentSite, otherExpenses: newExp });
                }} className="bg-blue-600 text-white px-3 rounded">+</button>
              </div>
              <ul className="text-sm">
                {currentSite.otherExpenses?.map(exp => (
                  <li key={exp.id} className="flex justify-between py-1 border-b">
                    <span>{exp.description}</span>
                    <span>{exp.amount} Ar</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Uploads */}
            <Card>
              <h3 className="font-bold mb-4 text-blue-600">Fichiers & Photos</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Photos</label>
                  <input type="file" multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  <p className="text-xs text-gray-400 mt-1">{currentSite.photos?.length || 0} photos actuelles</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Documents (PDF)</label>
                  <input type="file" multiple accept=".pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>
            </Card>

          </div>

          <div className="flex justify-end p-4 bg-gray-100 rounded-lg sticky bottom-4">
            <div className="text-right mr-6">
              <span className="text-sm text-gray-500">Total estimé</span>
              <p className="text-2xl font-bold text-blue-700">
                {currentSite.id || currentSite.materials ? calculateSiteTotal(currentSite as Site).toLocaleString() : 0} Ar
              </p>
            </div>
            <button onClick={handleSaveSite} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg flex items-center">
              <Save className="w-5 h-5 mr-2" /> Enregistrer le Site
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Sites</h2>
          <button onClick={() => { setCurrentSite({}); setIsEditing(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Créer un Site
          </button>
        </div>
        <div className=" rounded shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Dépenses Totales</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(site => (
                <tr key={site.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{site.type}</td>
                  <td className="p-4"><Badge status={site.status} /></td>
                  <td className="p-4 font-bold text-blue-600">{calculateSiteTotal(site).toLocaleString()} Ar</td>
                  <td className="p-4">
                    <button onClick={() => { setCurrentSite(site); setIsEditing(true); }} className="text-blue-600 hover:underline mr-4">Modifier/Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 3. VUE EMPLOYÉS
  const EmployeeManager = () => {
    const [newEmp, setNewEmp] = useState<Partial<Employee>>({});

    const addEmployee = () => {
      if (!newEmp.firstName || !newEmp.lastName) return;
      setEmployees([...employees, {
        id: Date.now().toString(),
        certificates: [],
        ...newEmp
      } as Employee]);
      setNewEmp({});
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Employés</h2>

        {/* Ajout Rapide */}
        <Card className="bg-blue-50 border-blue-100">
          <h3 className="font-bold text-blue-800 mb-4">Ajouter un employé</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Nom" className="p-2 rounded border" value={newEmp.lastName || ''} onChange={e => setNewEmp({ ...newEmp, lastName: e.target.value })} />
            <input placeholder="Prénom" className="p-2 rounded border" value={newEmp.firstName || ''} onChange={e => setNewEmp({ ...newEmp, firstName: e.target.value })} />
            <input placeholder="Téléphone" className="p-2 rounded border" value={newEmp.phone || ''} onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })} />
            <input placeholder="Adresse" className="p-2 rounded border md:col-span-2" value={newEmp.address || ''} onChange={e => setNewEmp({ ...newEmp, address: e.target.value })} />
            <div className="flex items-center">
              <label className=" px-3 py-2 border rounded cursor-pointer hover:bg-gray-50 text-sm flex items-center w-full">
                <Upload className="w-4 h-4 mr-2" /> Scan CIN
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={addEmployee} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">Enregistrer</button>
          </div>
        </Card>

        {/* Liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map(emp => (
            <Card key={emp.id} className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{emp.firstName} {emp.lastName}</p>
                <p className="text-sm text-gray-500">{emp.phone}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">CIN OK</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{emp.certificates.length} Certificats</span>
                  <button className="text-xs text-blue-600 hover:underline flex items-center"><Plus className="w-3 h-3" /> Certif.</button>
                </div>
              </div>
              <button onClick={() => setEmployees(employees.filter(e => e.id !== emp.id))} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // 4. VUE MATÉRIELS
  const MaterialManager = () => {
    const [newMat, setNewMat] = useState<Partial<Material>>({});

    const addMat = () => {
      if (!newMat.name || !newMat.price) return;
      setMaterials([...materials, { id: Date.now().toString(), ...newMat } as Material]);
      setNewMat({});
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Stock & Matériels</h2>

        <div className="flex gap-4 items-end  p-4 rounded shadow">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-gray-500">Nom</label>
            <input className="w-full border p-2 rounded" value={newMat.name || ''} onChange={e => setNewMat({ ...newMat, name: e.target.value })} />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-gray-500">Modèle</label>
            <input className="w-full border p-2 rounded" value={newMat.model || ''} onChange={e => setNewMat({ ...newMat, model: e.target.value })} />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-gray-500">Fournisseur</label>
            <input className="w-full border p-2 rounded" value={newMat.supplier || ''} onChange={e => setNewMat({ ...newMat, supplier: e.target.value })} />
          </div>
          <div className="w-32 space-y-2">
            <label className="text-xs font-bold text-gray-500">Prix (Ar)</label>
            <input type="number" className="w-full border p-2 rounded" value={newMat.price || ''} onChange={e => setNewMat({ ...newMat, price: parseFloat(e.target.value) })} />
          </div>
          <button onClick={addMat} className="bg-blue-600 text-white px-4 py-2 rounded h-10 mb-0.5 hover:bg-blue-700">Ajouter</button>
        </div>

        <div className=" rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">Modèle</th>
                <th className="p-3">Fournisseur</th>
                <th className="p-3 text-right">Prix Unitaire</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(m => (
                <tr key={m.id} className="border-t">
                  <td className="p-3">{m.name}</td>
                  <td className="p-3 text-gray-500">{m.model}</td>
                  <td className="p-3 text-gray-500">{m.supplier}</td>
                  <td className="p-3 text-right font-bold">{m.price.toLocaleString()} Ar</td>
                  <td className="p-3 text-center">
                    <button onClick={() => setMaterials(materials.filter(mat => mat.id !== m.id))} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 5. VUE DASHBOARD
  const Dashboard = () => {
    // Calculs globaux
    const totalExpense = sites.reduce((acc, site) => acc + calculateSiteTotal(site), 0);
    const breakdown = sites.reduce((acc, site) => {
      const bd = calculateBreakdown(site);
      return { mat: acc.mat + bd.matCost, sal: acc.sal + bd.salCost };
    }, { mat: 0, sal: 0 });

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-600 text-white border-none">
            <p className="opacity-80 mb-1">Dépenses Totales (Mois)</p>
            <h3 className="text-3xl font-bold">{totalExpense.toLocaleString()} Ar</h3>
          </Card>
          <Card>
            <p className="text-gray-500 mb-1">Coût Matériels</p>
            <h3 className="text-2xl font-bold text-gray-800">{breakdown.mat.toLocaleString()} Ar</h3>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="bg-blue-500 h-2 rounded" style={{ width: `${(breakdown.mat / totalExpense) * 100}%` }}></div>
            </div>
          </Card>
          <Card>
            <p className="text-gray-500 mb-1">Salaires & RH</p>
            <h3 className="text-2xl font-bold text-gray-800">{breakdown.sal.toLocaleString()} Ar</h3>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="bg-green-500 h-2 rounded" style={{ width: `${(breakdown.sal / totalExpense) * 100}%` }}></div>
            </div>
          </Card>
        </div>

        {/* Liste de tous les sites triés */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Historique des Sites</h3>
          <div className=" rounded shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm uppercase text-gray-500">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sites.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(site => (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{site.createdAt.toLocaleDateString()}</td>
                    <td className="p-4 font-medium">{site.type}</td>
                    <td className="p-4"><Badge status={site.status} /></td>
                    <td className="p-4 text-right font-bold text-gray-800">{calculateSiteTotal(site).toLocaleString()} Ar</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">SUPER<span className="text-gray-800">ADMIN</span></h1>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem id="home" label="Accueil" icon={Home} />
          <SidebarItem id="sites" label="Sites & Travaux" icon={MapPin} />
          <SidebarItem id="employees" label="Employés" icon={Users} />
          <SidebarItem id="materials" label="Matériels" icon={Hammer} />
          <SidebarItem id="dashboard" label="Tableau de Bord" icon={BarChart3} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">A</div>
            <div>
              <p className="font-bold text-gray-800">Admin</p>
              <p className="text-xs">Connecté</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 p-4 rounded shadow">
          <h1 className="font-bold text-blue-600">SUPERADMIN</h1>
          <button className="text-gray-600"><BarChart3 /></button>
        </div>

        {activeTab === 'home' && <HomeView />}
        {activeTab === 'sites' && <SiteManager />}
        {activeTab === 'employees' && <EmployeeManager />}
        {activeTab === 'materials' && <MaterialManager />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}