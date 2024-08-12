import Lot from "./lot.type";
import Produit from "./produit.type";

interface Entree {
  id_entree: number;
  id_produit: number;
  id_bon_entree: number;
  qte_entree: number;
  id_lot: number;
  lot: Lot | null; // Make lot nullable
  produit: Produit | null; // Make produit nullable
}

export default interface BonEntree {
  id_bon_entree: number;
  date_entree: string | null;
  entrees: Entree[];
}
