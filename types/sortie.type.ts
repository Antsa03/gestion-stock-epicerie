import Produit from "./produit.type";

interface Sortie {
  id_sortie: number;
  id_produit: number;
  id_bon_sortie: number;
  qte_sortie: number;
  id_lot: number;
  type_sortie: string;
  produit: Produit | null;
}
export default interface BonSortie {
  id_bon_sortie: number;
  date_sortie: string | null;
  sorties: Sortie[];
}
