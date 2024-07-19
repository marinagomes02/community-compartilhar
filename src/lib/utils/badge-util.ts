import { BadgeType } from "@/types";

export function getColorFromType(badgeType: BadgeType): string {
    switch (badgeType) {
        case BadgeType.Certified:
            return 'bg-red-100 text-red-800';
        case BadgeType.GroupLeader:
            return 'bg-blue-100 text-blue-800';
        case BadgeType.GroupMember:
            return 'bg-green-100 text-green-800';
        case BadgeType.Sponsor:
            return 'bg-yellow-100 text-yellow-800';
        case BadgeType.MapPin:
            return 'bg-purple-100 text-purple-800';
        case BadgeType.ProfileFilled:
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export function getBadgeTypeFromString(badgeType: string): BadgeType | null {
    switch (badgeType) {
        case 'certified':
            return BadgeType.Certified;
        case 'group_leader':
            return BadgeType.GroupLeader;
        case 'group_member':
            return BadgeType.GroupMember;
        case 'sponsor':
            return BadgeType.Sponsor;
        case 'map_pin':
            return BadgeType.MapPin;
        case 'profile_filled':
            return BadgeType.ProfileFilled;
        default:
            return null;
    }
}