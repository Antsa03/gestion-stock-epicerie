CREATE TABLE `BonEntree` (
	`id_bon_entree` integer PRIMARY KEY NOT NULL,
	`date_entree` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `BonSortie` (
	`id_bon_sortie` integer PRIMARY KEY NOT NULL,
	`date_sortie` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Entree` (
	`id_entree` integer PRIMARY KEY NOT NULL,
	`id_produit` integer NOT NULL,
	`id_bon_entree` integer NOT NULL,
	`qte_entree` integer NOT NULL,
	`id_lot` integer NOT NULL,
	FOREIGN KEY (`id_produit`) REFERENCES `Produit`(`id_produit`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`id_bon_entree`) REFERENCES `BonEntree`(`id_bon_entree`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`id_lot`) REFERENCES `Lot`(`id_lot`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Lot` (
	`id_lot` integer PRIMARY KEY NOT NULL,
	`id_produit` integer NOT NULL,
	`date_production` text NOT NULL,
	`date_peremption` text NOT NULL,
	`quantite_lot` integer NOT NULL,
	FOREIGN KEY (`id_produit`) REFERENCES `Produit`(`id_produit`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Produit` (
	`id_produit` integer PRIMARY KEY NOT NULL,
	`designation` text NOT NULL,
	`pu` real NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Sortie` (
	`id_sortie` integer PRIMARY KEY NOT NULL,
	`id_produit` integer NOT NULL,
	`id_bon_sortie` integer NOT NULL,
	`qte_sortie` integer NOT NULL,
	`id_lot` integer NOT NULL,
	`type_sortie` text NOT NULL,
	FOREIGN KEY (`id_produit`) REFERENCES `Produit`(`id_produit`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`id_bon_sortie`) REFERENCES `BonSortie`(`id_bon_sortie`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`id_lot`) REFERENCES `Lot`(`id_lot`) ON UPDATE cascade ON DELETE cascade
);
