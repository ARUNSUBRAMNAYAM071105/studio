import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, or } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Define the structure of a Remedy document
type Remedy = {
  diseaseName: string;
  remedyName: string;
  remedyType: string; // e.g., 'chemical', 'bio-pesticide', 'natural'
  unit: string; // e.g., 'liter', 'kg', 'gallon'
  avgCost: number;
  region: string;
};

/**
 * Retrieves a list of remedies for a given disease and region from Firestore.
 * It will look for remedies that match the disease and are available in either the specified region or a "Global" region.
 * @param diseaseName - The name of the disease to find remedies for.
 * @param region - The farmer's region to find localized costs.
 * @returns A promise that resolves to an array of Remedy objects.
 */
export async function getRemedies(diseaseName: string, region: string): Promise<Omit<Remedy, 'diseaseName' | 'region'>[]> {
  const remediesCol = collection(db, "remedies");
  
  // Create a query to find remedies matching the disease and either the specific region or "Global"
  const q = query(
    remediesCol,
    where("diseaseName", "==", diseaseName),
    or(
        where("region", "==", region),
        where("region", "==", "Global")
    )
  );

  const querySnapshot = await getDocs(q);
  
  const remedies: Omit<Remedy, 'diseaseName' | 'region'>[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    remedies.push({
      remedyName: data.remedyName,
      remedyType: data.remedyType,
      unit: data.unit,
      avgCost: data.avgCost,
    });
  });

  return remedies;
}
