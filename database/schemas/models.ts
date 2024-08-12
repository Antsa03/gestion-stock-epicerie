import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// Modèle Produit
export const Produit = sqliteTable("Produit", {
  id_produit: integer("id_produit").primaryKey(),
  designation: text("designation").notNull(),
  pu: real("pu").notNull(),
  stock: integer("stock").default(0).notNull(),
});

// Modèle Entree
export const Entree = sqliteTable("Entree", {
  id_entree: integer("id_entree").primaryKey(),
  id_produit: integer("id_produit")
    .notNull()
    .references(() => Produit.id_produit, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  id_bon_entree: integer("id_bon_entree")
    .notNull()
    .references(() => BonEntree.id_bon_entree, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  qte_entree: integer("qte_entree").notNull(),
  id_lot: integer("id_lot")
    .notNull()
    .references(() => Lot.id_lot, { onDelete: "cascade", onUpdate: "cascade" }),
});

// Modèle BonEntree
export const BonEntree = sqliteTable("BonEntree", {
  id_bon_entree: integer("id_bon_entree").primaryKey(),
  date_entree: text("date_entree").notNull(),
});

// Modèle Sortie
export const Sortie = sqliteTable("Sortie", {
  id_sortie: integer("id_sortie").primaryKey(),
  id_produit: integer("id_produit")
    .notNull()
    .references(() => Produit.id_produit, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  id_bon_sortie: integer("id_bon_sortie")
    .notNull()
    .references(() => BonSortie.id_bon_sortie, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  qte_sortie: integer("qte_sortie").notNull(),
  id_lot: integer("id_lot")
    .notNull()
    .references(() => Lot.id_lot, { onDelete: "cascade", onUpdate: "cascade" }),
  type_sortie: text("type_sortie").notNull(),
});

// Modèle BonSortie
export const BonSortie = sqliteTable("BonSortie", {
  id_bon_sortie: integer("id_bon_sortie").primaryKey(),
  date_sortie: text("date_sortie").notNull(),
});

// Modèle Lot
export const Lot = sqliteTable("Lot", {
  id_lot: integer("id_lot").primaryKey(),
  id_produit: integer("id_produit")
    .notNull()
    .references(() => Produit.id_produit, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  date_production: text("date_production").notNull(),
  date_peremption: text("date_peremption").notNull(),
  quantite_lot: integer("quantite_lot").notNull(),
});

// Define the relationships
export const ProduitRelations = relations(Produit, ({ many }) => ({
  entrees: many(Entree),
  sorties: many(Sortie),
  lots: many(Lot),
}));

export const EntreeRelations = relations(Entree, ({ one }) => ({
  produit: one(Produit, {
    fields: [Entree.id_produit],
    references: [Produit.id_produit],
  }),
  bon_entree: one(BonEntree, {
    fields: [Entree.id_bon_entree],
    references: [BonEntree.id_bon_entree],
  }),
  lot: one(Lot, { fields: [Entree.id_lot], references: [Lot.id_lot] }),
}));

export const BonEntreeRelations = relations(BonEntree, ({ many }) => ({
  entrees: many(Entree),
}));

export const SortieRelations = relations(Sortie, ({ one }) => ({
  produit: one(Produit, {
    fields: [Sortie.id_produit],
    references: [Produit.id_produit],
  }),
  bon_sortie: one(BonSortie, {
    fields: [Sortie.id_bon_sortie],
    references: [BonSortie.id_bon_sortie],
  }),
  lot: one(Lot, { fields: [Sortie.id_lot], references: [Lot.id_lot] }),
}));

export const BonSortieRelations = relations(BonSortie, ({ many }) => ({
  sorties: many(Sortie),
}));

export const LotRelations = relations(Lot, ({ one, many }) => ({
  produit: one(Produit, {
    fields: [Lot.id_produit],
    references: [Produit.id_produit],
  }),
  entrees: many(Entree),
  sorties: many(Sortie),
}));
