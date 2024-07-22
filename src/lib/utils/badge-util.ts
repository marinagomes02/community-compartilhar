import { BadgeType } from "@/types";
import { translate } from "./translation/translate-util";

export function getColorFromTypeBackground(badgeType: BadgeType): string {
    switch (badgeType) {
        case BadgeType.Certified:
            return 'bg-red-100';
        case BadgeType.GroupLeader:
            return 'bg-blue-100';
        case BadgeType.MapPin:
            return 'bg-bgreen-100';
        case BadgeType.Sponsor:
            return 'bg-byellow-100';
        case BadgeType.GroupMember:
            return 'bg-purple-100';
        case BadgeType.ProfileFilled:
            return 'bg-orange-100';
        default:
            return 'bg-gray-100';
    }
}

export function getColorFromTypeBackgroundLight(badgeType: BadgeType): string {
    switch (badgeType) {
        case BadgeType.Certified:
            return 'bg-red-200';
        case BadgeType.GroupLeader:
            return 'bg-blue-200';
        case BadgeType.MapPin:
            return 'bg-bgreen-200';
        case BadgeType.Sponsor:
            return 'bg-byellow-200';
        case BadgeType.GroupMember:
            return 'bg-purple-200';
        case BadgeType.ProfileFilled:
            return 'bg-orange-200';
        default:
            return 'bg-gray-200';
    }
}

export function getColorFromTypeNormal(badgeType: BadgeType): string {
    switch (badgeType) {
        case BadgeType.Certified:
            return 'bg-red-400';
        case BadgeType.GroupLeader:
            return 'bg-blue-400';
        case BadgeType.MapPin:
            return 'bg-bgreen-400';
        case BadgeType.Sponsor:
            return 'bg-byellow-400';
        case BadgeType.GroupMember:
            return 'bg-purple-400';
        case BadgeType.ProfileFilled:
            return 'bg-orange-400';
        default:
            return 'bg-gray-400';
    }
}

export function getBadgeTypeFromString(badgeType: string): BadgeType | null{
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

export function getBadgeTitleFromType(badgeType: BadgeType, locale: string): string {
    switch (badgeType) {
        case BadgeType.Certified:
            return translate(locale, "badge.certified");
        case BadgeType.GroupLeader:
            return translate(locale, "badge.groupLeader");
        case BadgeType.GroupMember:
            return translate(locale, "badge.groupMember");
        case BadgeType.Sponsor:
            return translate(locale, "badge.sponsor");
        case BadgeType.MapPin:
            return translate(locale, "badge.mapPin");
        case BadgeType.ProfileFilled:
            return translate(locale, "badge.profileFilled");
    }
}

export function getBadgeIconFromType(badgeType: BadgeType): string {
    switch (badgeType) {
        case BadgeType.Certified:
            return '/badges/certified.png';
        case BadgeType.GroupLeader:
            return '/badges/leader.png';
        case BadgeType.GroupMember:
            return '/badges/group-member.png';
        case BadgeType.Sponsor:
            return '/badges/sponsor.png';
        case BadgeType.MapPin:
            return '/badges/map-pin.png';
        case BadgeType.ProfileFilled:
            return '/badges/profile-filled.png';
    }
}