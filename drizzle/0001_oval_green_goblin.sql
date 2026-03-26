CREATE TABLE `simulacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cursoId` varchar(64) NOT NULL,
	`dadosJson` text NOT NULL,
	`mediaFinal` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `simulacoes_id` PRIMARY KEY(`id`)
);
