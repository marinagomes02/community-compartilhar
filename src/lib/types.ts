export type UserRole = 'admin' | 'user';

export type User = {
	id: string;
	email: string;
	role: UserRole;
	display_name: string;
	about_me: string;
	image: string | null;
	region: string | null;
	job: string | null;
	sponsorship_state: SponsorshipState;
	birth_date: string;
	group_id: string | null;
	phone_number: string | null;
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

export type AuthorizedEmail = {
	email: string;
}

export type CommunityLink = {
	community_link: string
}

export type SponsorshipState = 'no_group' | 'looking_for_group' | 'has_group'

export type EditUserData = {
	display_name: string;
	about_me: string;
	motivation: string;
	image_url: string | null;
	image: File | null;
	region: string;
	phone_number: string;
	job: string;
	birth_date: string | null;
	show_link: boolean;
	completed_course: boolean;
	sponsorship_state: SponsorshipState;
}

export type UserWithImage = {
	id: string;
	email: string;
	role: UserRole;
	display_name: string;
	about_me: string;
	image_url: string | null;
	region: string;
	job: string;
	sponsorship_state: SponsorshipState;
	birth_date: string | null;
	group_id: string | null;
	phone_number: string;
	pin: MapPin | null;
}

export type ProfilePreviewDataWithImage = {
	id: string;
	display_name: string;
	image_url: string | null;
	region: string;
	image: string;
}

export type ProfileDataWithImage = {
	display_name: string;
	about_me: string;
	motivation: string;
	image_url: string | null;
	region: string;
	phone_number: string;
	job: string;
	birth_date: string | null;
	show_link: boolean;
	completed_course: boolean;
	sponsorship_state: SponsorshipState;
	email: string;
}

export type GroupData = {
	id: string;
	name: string;
	region: string;
	is_complete: boolean;
	is_current_sponsor: boolean;
	leader: string;
	members: string;
}
