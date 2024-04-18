// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { Session, SupabaseClient, type User } from '@supabase/supabase-js';
import { Database } from 'src/lib/supabase';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			session: Session | null;
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
