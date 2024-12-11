<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import PactaIntro from './about.svelte';
	import PortfolioView from './portfolio_view.svelte';
	import SectorView from './sector_view.svelte';
	import CompanyView from './company_view.svelte';
	// Tab Group
	let tabSet: number = 1;
</script>

<span>
<svelte:fragment slot="header">
<TabGroup>
	<Tab bind:group={tabSet} name="about" value={0}>About PACTA</Tab>
	<Tab bind:group={tabSet} name="portfolio_view" value={1}>Portfolio-level Overview</Tab>
	<Tab bind:group={tabSet} name="sector_view" value={2}>Sector-level Analysis</Tab>
	<Tab bind:group={tabSet} name="company_view" value={3}>Company-level Analysis</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<PactaIntro />
		{:else if tabSet === 1}
			<PortfolioView />
		{:else if tabSet === 2}
			<SectorView />
		{:else if tabSet === 3}
			<CompanyView />
		{:else}
			<p>Tab not found</p>
		{/if}
	</svelte:fragment>
</TabGroup>
</svelte:fragment>
</span>
