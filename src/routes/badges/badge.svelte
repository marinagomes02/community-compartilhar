<script lang="ts">
	import type { BadgeType } from "@/types";
	import { getColorFromTypeBackground, getColorFromTypeBackgroundLight, getColorFromTypeNormal } from "@/utils/badge-util";

    export let title: string;
    export let icon_url: string;
    export let badgeType: BadgeType;

</script>

<div class="hexagon hexagon-border {getColorFromTypeBackground(badgeType)}">
    <div class="hexagon hexagon-white-border">
        <div class="hexagon hexagon-inside {getColorFromTypeBackgroundLight(badgeType)} flex-col pt-1">
            <img
                src={icon_url}
                alt="group-profile"
                class="h-8 w-8 p-1"
            />
            <div class="align-center {getColorFromTypeNormal(badgeType)} h-5 w-full flex justify-center items-center">
                <span class="text-xxs font-semibold text-center">{title}</span>
            </div>
        </div>
    </div>
</div>

<style>
    :global(.hexagon) {
        position: relative;
        clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    :global(.hexagon-border) {
        width: 95px;
        height: 91px;
        margin-right: 8px;
        margin-bottom: 6px;
    }
    :global(.hexagon-white-border) {
        width: 88px;
        height: 84px;
        z-index: 1;
        background-color: white;
    }
    :global(.hexagon-inside) {
        width: 84px;
        height: 79px;
        z-index: 2;
        justify-content: flex-start;
    }
    :global(.icon-border) {
        border: 1px solid;
        padding: 3px;
    }
    :global(.text-xxs) {
        font-size: 10px;
    }
</style>