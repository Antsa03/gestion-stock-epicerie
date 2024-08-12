import Produit from "./produit.type";

export default interface Lot {
  id_lot: number;
  id_produit: number;
  date_production: string;
  date_peremption: string;
  quantite_lot: number;
  produit?: Produit | null;
}
