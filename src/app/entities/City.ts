//DTO relativo ai dati di una città

export interface City {
  id: number | null;
  city: string | null;
  cap: string | null;
  region: string | null;
  province: string | null;
}
