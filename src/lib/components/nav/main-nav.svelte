<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { translate } from '../../utils/translation/translate-util';

	export let locale;
</script>

<div class="mr-4 hidden md:flex">
	<a href="/" class="mr-6 flex items-center gap-x-2">
		<img src="/favicon.png" alt="logo" class="h-7 w-7" />
		<span class="font-bold"> ComPartilhar </span>
	</a>
	<nav class="flex items-center space-x-6 text-sm font-medium">
		<!--<a
		href="/how-to"
		class={cn(
			'transition-colors hover:text-foreground/80',
			$page.url.pathname.startsWith('/how-to') ? 'text-foreground' : 'text-foreground/60'
			)}
			>
			How To
			</a>
			<a
			href="/events"
			class={cn(
				'transition-colors hover:text-foreground/80',
				$page.url.pathname.startsWith('/events') ? 'text-foreground' : 'text-foreground/60'
				)}
				>
				Events
				</a> -->
		<a
			href="/map"
			class={cn(
				'transition-colors hover:text-foreground/80',
				$page.url.pathname.startsWith('/map') ? 'text-foreground' : 'text-foreground/60'
			)}
		>
			{translate(locale, 'mainNav.map')}
		</a>
		<a
			href="/users"
			class={cn(
				'transition-colors hover:text-foreground/80',
				$page.url.pathname.startsWith('/users') && !$page.url.pathname.includes('edit') ? 'text-foreground' : 'text-foreground/60'
			)}
		>
			{translate(locale, 'mainNav.members')}
		</a>
		<a
			href="/groups"
			class={cn(
				'transition-colors hover:text-foreground/80',
				$page.url.pathname.startsWith('/groups') ? 'text-foreground' : 'text-foreground/60'
			)}
		>
			{translate(locale, 'mainNav.groups')}
		</a>
		<a
			href="/academy"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/academy') ? 'text-foreground' : 'text-foreground/60'
				)}
		>
			{translate(locale, 'tutorials')}
		</a>
	</nav>
</div>
