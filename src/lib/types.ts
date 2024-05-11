export type UserRole = 'admin' | 'user';

export type User = {
	id: string;
	email: string;
	role: UserRole;
	type: string;
	display_name: string;
	description: string;
	image: string | null;
	region: string | null;
	job: string | null;
	is_looking_for_group: boolean;
	age: number;
	group_id: string | null;
};

export type MapPin = {
	lng: number;
	lat: number;
};

export type UserWithPin = User & { pin: MapPin | null };

export type HowToDifficulty = 'easy' | 'medium' | 'hard';

export type HowToDuration = 'short' | 'medium' | 'long';

export type HowTo = {
	id: string;
	user_id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	difficulty: HowToDifficulty;
	duration: HowToDuration;
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
	user_id: string;
	title: string;
	description: string;
	tags: string[];
	image: string;
	date: string;
	location: string;
};

export type GroupStage = 'noGroup' | 'lookingFor' | 'belongsTo';

export type AuthorizedEmail = {
	email: string;
}