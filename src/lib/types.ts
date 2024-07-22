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
	sponsorship_state_old: SponsorshipState;
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
	sponsorship_state: SponsorshipState;
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
	user_badges: BadgeType[];
}

export type EditGroupDataForm = {
	id: number;
	name: string;
	region: string;
	is_complete: boolean;
	is_current_sponsor: boolean;
	leader: string;
	members: string;
	current_members: string;
}

export type GroupData = {
	id: string;
	name: string;
	region: string;
	is_complete: boolean;
	is_current_sponsor: boolean;
	leader: string;
	is_authorized: boolean;
	members: GroupMemberData[];
}

export type GroupMemberData = {
	id: string;
	email: string;
	completed_course: boolean;
}

export type GroupWithPin = GroupData & { pin: MapPin | null };

export type GroupDataMap = {
	id: string;
	name: string;
	region: string;
	is_complete: boolean;
	is_current_sponsor: boolean;
	leader: string;
	pin: MapPin | null;
	members_count: number[];
	show_links: GroupMemberShowLink[];
}

export type GroupMemberShowLink = {
	email: string;
	show_link: boolean;
	phone_number: string;
}

export type GroupRequestData = {
	id: string;
	name: string;
	region: string;
	is_complete: boolean;
	is_current_sponsor: boolean;
	leader: string;
	is_authorized: boolean;
	members: GroupMemberData[];
	created_at: string;
}

export type JoinGroupRequestData = {
	id: string;
	user_id: string;
	user_data: JoinGroupUserData;
	created_at: string;
	max_dist: number;
	available_period: number;
	possible_regions: string[];
	responsibilities: Responsibilities[];
	possible_group_id: string;
}

export type JoinGroupUserData = {
	display_name: string;
}

export enum Responsibilities {
	EmotionalPsicologicalSupport = 'Apoio Emocional e Psicológico',
	FinancialSupport = 'Apoio Financeiro',
	SocialSupport = 'Apoio Social',
	ChildrenCare = 'Cuidado de Crianças',
	Employment = 'Emprego',
	PortugueseTeaching = 'Ensino da Língua Portuguesa',	
	Housing = 'Habitação',
	Translation = 'Tradução',
	MobilizeCommunity = "Sensibilização/Movimentação da comunidade local",
}

export type PossibleGroupData = {
	id: string;
	region: string, 
	created_at: string,
	is_validated: string,
	members_count: any[],
}

export type UserNotification = {
	id: string;
	message: string;
	created_at: string;
	is_read: boolean;
	about_user_id: string | null;
	about_group_id: string | null;
	about_user_image_url: string | null;
	type: NotificationType;
}

export enum NotificationType {
	UserLookingForGroup = 'new_user_looking_for_group',
	GroupLookingForMember = 'group_looking_for_member',
	NewUserInRegion = 'new_user_in_region',
	NewGroupInRegion = 'new_group_in_region',
	NewBadgeGroupLeader = 'new_badge_group_leader',
	NewBadgeGroupMember = 'new_badge_group_member',
	NewBadgeSponsor = 'new_badge_sponsor',
	NewBadgeCertified = 'new_badge_certified',	
	NewBadgeMapPin = 'new_badge_map_pin',
	NewBadgeProfileFilled = 'new_badge_profile_filled',
}

export type UserListData = {
	id: string;
	display_name: string;
	email: string;
}

export type NearbyUser = {
	id: string;
	distance: number;
	image_url: string | null;
	name: string;
}

export enum BadgeType {
	GroupLeader = 'group_leader',
	GroupMember = 'group_member',
	Sponsor = 'sponsor',
	Certified = 'certified',
	MapPin = 'map_pin',
	ProfileFilled = 'profile_filled',
}
