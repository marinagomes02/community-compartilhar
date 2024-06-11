import { mapGroupPinSchema, mapPinSchema, removeMapGroupPinSchema, removeMapPinSchema } from '$lib/schemas/map-pin';
import type { GroupWithPin, UserWithImage, UserWithPin } from '$lib/types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ parent }) => {
	const { supabase, session, user } = await parent();

	let userWithPin: UserWithPin | undefined;
	let groupWithPin: GroupWithPin | undefined;
	let groupsData: any[] = [];
	let usersData: any[] = [];

	if (session && user) {
		const { data: pinData } = await supabase
			.from('map_pins')
			.select('lng, lat')
			.eq('user_id', user.id)
			.single();
		userWithPin = {
			...user,
			pin: pinData,
		};

		const { data: groupPinData } = await supabase
			.from('groups_view')
			.select('*, members: profiles!inner(id, email), pin:map_pins( lng, lat )')
			.eq('members.id', user.id)
			.single();
		groupWithPin = groupPinData;

		const { data: groupsAuthorizedData } = await supabase
			.from('groups_view')
			.select('*, pin:map_pins( lng, lat ), members_count:profiles!inner(count), show_links:profiles!inner(email, show_link, phone_number)')
			.or('is_authorized.eq.true, id.eq.' + user.group_id);
		groupsData = groupsAuthorizedData ?? [];
	}

	const { data: usersWithPinData } = await supabase
		.from('profiles')
		.select('*, pin:map_pins( lng, lat )');
	usersData = usersWithPinData ?? [];

	let image_url
	let userDataWithImage: UserWithImage
	let usersDataWithImages: UserWithImage[] = []

	for (let userData of usersData) {
		image_url = userData.image ? supabase.storage.from('users-avatars').getPublicUrl(userData.image).data.publicUrl : null;
		userDataWithImage = {...userData, image_url: image_url}
		if (userDataWithImage.pin === null || 
			userDataWithImage.pin.lat === undefined || 
			userDataWithImage.pin.lng === undefined) {
				userDataWithImage.pin = null
		}
		usersDataWithImages.push(userDataWithImage)
	};

	const userPinForm = await superValidate(
		{
			lng: userWithPin?.pin?.lng ?? -8.25249540399156,
			lat: userWithPin?.pin?.lat ?? 39.2790849431385,
			owner_type: 'user'
		},
		zod(mapPinSchema)
	);

	const groupPinForm = await superValidate(
		{
			lng: groupWithPin?.pin?.lng ?? -8.25249540399156,
			lat: groupWithPin?.pin?.lat ?? 39.2790849431385,
			group_id: groupWithPin?.id ?? null,
		},
		zod(mapGroupPinSchema)
	);
	
	return {
		user: userWithPin,
		group: groupWithPin,
		users: usersDataWithImages ?? [],
		groups: groupsData ?? [],
		userPinForm,
		groupPinForm,
		removeMapPinForm: await superValidate(zod(removeMapPinSchema), {
			id: "remove-user-map-pin",
		}),
		removeGroupMapPinForm: await superValidate(
			{ group_id: groupWithPin?.id ?? null },
		zod(removeMapGroupPinSchema)),
	};
};
