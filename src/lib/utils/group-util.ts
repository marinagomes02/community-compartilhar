import { Responsibilities } from "@/types";

export function getResponsibilityFromKey(key: string) {
    switch (key) {
        case "EmotionalPsicologicalSupport":
            return Responsibilities["EmotionalPsicologicalSupport"];
        case "FinancialSupport":
            return Responsibilities["FinancialSupport"];
        case "SocialSupport":
            return Responsibilities["SocialSupport"];
        case "ChildrenCare":
            return Responsibilities["ChildrenCare"];
        case "Employment":
            return Responsibilities["Employment"];
        case "PortugueseTeaching":
            return Responsibilities["PortugueseTeaching"];
        case "Housing":
            return Responsibilities["Housing"];
        case "MobilizeCommunity":
            return Responsibilities["MobilizeCommunity"];
        case "Translation":
            return Responsibilities["Translation"];
        default:
            return "";
    }    
}

export function toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }