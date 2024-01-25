export type UserRole = 'admin' | 'user';

export type UserType = 'default' | 'morador' | 'tecnico' | 'multiplicador' | 'parceiro' | 'balcao';

export type User = {
	id: string;
	role: UserRole;
	type: UserType;
	displayName: string;
	description: string;
	image: string;
};

export type UserPin = {
	lat: number;
	lng: number;
};

export type HowToDiffulty = 'easy' | 'medium' | 'hard';

export type HowTo = {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	difficulty: HowToDiffulty;
	duration: number;
	steps: HowToStep[];
};

type HowToStep = {
	title: string;
	description: string;
	image: string;
};

export type Doc = {
	slug: string;
	title: string;
};

export type DocGroup = {
	slug: string;
	title: string;
	docs: Doc[];
};

export type Event = {
	id: string;
	title: string;
	description: string;
	image: string;
	date: string;
};
