type SiteType = 'Calibrage' | 'Installation' | 'Maintenance';
type SiteStatus = 'En cours' | 'Terminé';

interface Material {
  id: string;
  name: string;
  model: string;
  supplier: string;
  price: number;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  cinScan?: File | null;
  certificates: File[];
}

interface SiteMaterial {
  materialId: string;
  quantity: number;
}

interface OtherExpense {
  id: string;
  description: string;
  amount: number;
}

interface SiteEmployee {
  employeeId: string;
  salaryPaid: number; // Avance ou salaire
}

interface VehicleInfo {
  plate: string;
  driverId: string; // ou nom
  agency: string;
  cost: number; // Carburant + Location
}

interface Site {
  id: string;
  createdAt: Date;
  type: SiteType;
  gpsLink: string;
  photos: File[];
  files: File[];
  materials: SiteMaterial[];
  otherExpenses: OtherExpense[];
  vehicle: VehicleInfo | null;
  employees: SiteEmployee[];
  status: SiteStatus;
}

export type {SiteType, SiteEmployee, SiteStatus, Site, Material, Employee, OtherExpense, VehicleInfo}