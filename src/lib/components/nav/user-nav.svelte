<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { User } from '$lib/types';
	import { translate } from '../../utils/translation/translate-util';

	export let locale: string;
	export let user: User;
	export let user_image_url: string | null;

	$: initials = user.display_name
		.split(' ')
		.map((name) => name[0])
		.join('');
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				{#if user_image_url}
					<Avatar.Image src={user_image_url} alt={user.display_name} />
				{:else}
					<Avatar.Image src="/avatars/user.png" alt={user.display_name} />
				{/if}
				<Avatar.Fallback>{initials}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-fit" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{user.display_name}</p>
				<p class="text-xs leading-none text-muted-foreground">{user.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item href="/users/me/edit">
				{translate(locale, 'profile')}
			</DropdownMenu.Item>
			<!--<DropdownMenu.Item href="/settings">
				Settings
				<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			-->
			{#if user.role === 'admin'}
				<DropdownMenu.Item href="/admin">
					{translate(locale, 'admin')}
				</DropdownMenu.Item>
			{/if}
			{#if user.group_id !== null}
				<DropdownMenu.Item href="/groups/edit">
					{translate(locale, 'group')}
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<form method="post" action="/?/signout" use:enhance>
			<button><DropdownMenu.Item>{translate(locale, 'logOut')}</DropdownMenu.Item></button>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
