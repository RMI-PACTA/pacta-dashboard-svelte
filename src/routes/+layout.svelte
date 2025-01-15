<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	//fonts
	import '@fontsource/roboto/400.css';
	import '@fontsource/roboto/700.css';

	async function downloadArchive() {
		try {
			const response = await fetch('data/archive.zip');

			if (!response.ok) {
				throw new Error(`Failed to fetch: ${response.statusText}`);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'archive.zip';
			a.click();
			window.URL.revokeObjectURL(url); // Clean up
		} catch (error) {
			console.error('Error downloading archive:', error);
			alert('Failed to download the archive. Please try again.');
		}
	}
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar
			class="app-bar-custom"
			gridColumns="grid-cols-3"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
		>
			<svelte:fragment slot="lead">
				<img class="w-[128px]" src="logo.png" alt="RMI Logo" />
			</svelte:fragment>
			<h1 class="text-xl app-bar-custom">PACTA Climate Alignment Tool</h1>
			<svelte:fragment slot="trail">
				<span class="btn-icon variant-filled">
					<a
						href="https://github.com/RMI-PACTA/pacta-dashboard-svelte"
						target="_blank"
						rel="noreferrer"
						title="GitHub"
					>
						<i class="fab fa-xl fa-github"></i>
					</a>
				</span>
				<span class="btn-icon variant-filled">
					<button on:click={downloadArchive} title="Save data">
						<i class="fas fa-xl fa-floppy-disk"></i>
					</button>
					<div class="card p-4 variant-filled-primary" data-popup="popupHover">
						<p>Save Data</p>
						<div class="arrow variant-filled-primary" />
					</div>
				</span>
				<span class="btn-icon variant-filled">
					<a
						href="https://rmi.gitbook.io/pacta-knowledge-hub"
						target="_blank"
						rel="noreferrer"
						title="PACTA Knowledge Hub"
					>
						<i class="fas fa-xl fa-question"></i>
					</a>
				</span>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
