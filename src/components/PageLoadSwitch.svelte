<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

let enabled = $state(true);

onMount(() => {
    // Check if user has explicitly disabled it
    const disabled = localStorage.getItem("disable-preloader");
    enabled = disabled !== "true";
});

function toggle() {
    enabled = !enabled;
    if (enabled) {
        localStorage.removeItem("disable-preloader");
    } else {
        localStorage.setItem("disable-preloader", "true");
    }
}
</script>

<button aria-label="Toggle Page Loading Overlay" class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" onclick={toggle}>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300" class:opacity-100={enabled} class:opacity-0={!enabled}>
        <Icon icon="material-symbols:hourglass-top-rounded" class="text-[1.25rem]"></Icon>
    </div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300" class:opacity-100={!enabled} class:opacity-0={enabled}>
        <Icon icon="material-symbols:hourglass-disabled-rounded" class="text-[1.25rem]"></Icon>
    </div>
</button>
