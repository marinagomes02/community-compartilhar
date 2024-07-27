import type { BadgeType } from "@/types";
import { getBadgeTypeFromString } from "@/utils/badge-util";

export async function getUserBadgesById(user_id: string, supabase: any) {
    const { data: badgesData, error: supabaseError } = await supabase
        .from('user_badges')
        .select('badge')
        .eq('user_id', user_id)
        .order('badge', { ascending: true });

    if (supabaseError) {
        console.error('Error fetching badges:', supabaseError);
        return null;
    }

    return badgesData.map((el: any) => getBadgeTypeFromString(el.badge));
}

export async function createUserBadgeById(user_id: string, badge: BadgeType, supabase: any) {
    const { data, error } = await supabase
        .from('user_badges')
        .upsert({user_id, badge}, { onConflict: 'user_id, badge'});
        
    if (error) {
        console.error('Error creating badge:', error);
        return;
    }

    return data;
}

export async function removeUserBadgeById(user_id: string, badge: BadgeType, supabase: any) {
    const { data, error } = await supabase
        .from('user_badges')
        .delete()
        .eq('user_id', user_id)
        .eq('badge', badge);

    if (error) {
        console.error('Error removing badge:', error);
        return;
    }

    return data;
}

export async function removeUserBadgeByEmail(email: string, badge: BadgeType, supabase: any) {
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

    if (userError) {
        console.error('Error fetching user:', userError);
        return;
    }

    const { data, error } = await supabase
        .from('user_badges')
        .delete()
        .eq('user_id', user.id)
        .eq('badge', badge);

    if (error) {
        console.error('Error removing badge:', error);
        return;
    }

    return data;
}