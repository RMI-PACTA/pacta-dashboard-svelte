<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import PactaIntro from './pacta_intro.svelte';
	import ExecutiveSummary from './executive_summary.svelte';
	import PortfolioView from './portfolio_view.svelte';
	import SectorView from './sector_view.svelte';
	import CompanyView from './company_view.svelte';
	// Tab Group
	let tabSet: number = 0;
</script>

<TabGroup>
	<Tab bind:group={tabSet} name="pacta_intro" value={0}>PACTA Intro</Tab>
	<Tab bind:group={tabSet} name="executive_summary" value={1}>Executive Summary</Tab>
	<Tab bind:group={tabSet} name="portfolio_view" value={2}>Portfolio-level Overview</Tab>
	<Tab bind:group={tabSet} name="sector_view" value={3}>Sector-level Analysis</Tab>
	<Tab bind:group={tabSet} name="company_view" value={4}>Company-level Analysis</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<PactaIntro />
		{:else if tabSet === 1}
			<ExecutiveSummary />
		{:else if tabSet === 2}
			<PortfolioView />
		{:else if tabSet === 3}
			<SectorView />
		{:else if tabSet === 4}
			<CompanyView />
		{:else}
			<p>Tab not found</p>
		{/if}
	</svelte:fragment>
</TabGroup>
