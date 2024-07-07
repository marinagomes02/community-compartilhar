import type { UserNotification } from "@/types";
import { writable } from "svelte/store";

export const user_notifications = writable<UserNotification[]>([]);
