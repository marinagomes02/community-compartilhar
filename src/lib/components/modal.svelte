<script lang="ts">
	import { X } from "lucide-svelte";
    import Button from "./ui/button/button.svelte";

	export let openModal: boolean; 
    export let header, body: string;

	let dialog: HTMLDialogElement;

	$: if (dialog && openModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (openModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|stopPropagation class="w-full justify-center items-center">
        <div class="flex items-center p-4 justify-between border-b rounded-t dark:border-gray-600 md:p-5"> 
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {header}
            </h3>
            <Button
                variant="ghost"
                size="sm_icon"
                class="text-gray-500 dark:text-gray-400"
                on:click={() => {dialog.close()}}
            >
                <X></X>
            </Button>
        </div>
        <div class="p-4 md:p-5 space-y-4 w-full border-b dark:border-gray-600"> 
            <p>{body}</p>
        </div>
        <div class="flex flex-row justify-between p-4 md:p-5">
            <Button 
                variant="outline"
                on:click={() => {dialog.close()}}
            >
                Cancelar
            </Button>
            <Button 
                variant="default"
                href="groups/create"
            >
                Criar grupo de patrocínio
            </Button>
        </div>
    </div>
</dialog>

<style>
    dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        width: 60%;
        border-radius: var(--radius);
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>