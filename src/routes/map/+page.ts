import { mapPinSchema, removeMapPinSchema } from '$lib/schemas/map-pin';
import type { UserWithImage, UserWithPin } from '$lib/types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ parent }) => {
	const { supabase, session, user } = await parent();

	let userWithPin: UserWithPin | undefined;
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
	}

	const { data: usersData } = await supabase.from('profiles').select('*, pin:map_pins( lng, lat )');
	const { data: groupsData } = await supabase.from('groups').select('*, pin:map_pins( lng, lat ), members_count:profiles(count)');

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
	}

	const form = await superValidate(
		{
			lng: userWithPin?.pin?.lng ?? -8.25249540399156,
			lat: userWithPin?.pin?.lat ?? 39.2790849431385,
			owner_type: 'user'
		},
		zod(mapPinSchema)
	);

	return {
		user: userWithPin,
		users: usersDataWithImages ?? [],
		groups: groupsData ?? [],
		form,
		removeMapPinForm: await superValidate(zod(removeMapPinSchema), {
			id: "user-unregister",
		}),
	};
};
