<!-- src/routes/portfolio_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import tableData from '../json/data_included_table.json';
	import bondsPie from '../json/data_value_pie_bonds.json';
	import equityPie from '../json/data_value_pie_equity.json';
	import mapData from '../json/data_map.json';
	import { PieExploded } from '../js/PieExploded2.js';
	import { choropleth } from '../js/map.js'

	onMount(() => {
		function fetchCompanyBubble() {
			new PieExploded(document.querySelector('#bubbleBonds'), bondsPie, undefined, {
				default_class: 'Corporate Bonds'
			});
			new PieExploded(document.querySelector('#bubbleEquity'), equityPie, undefined, {
				default_class: 'Listed Equity'
			});
		}

		function fetchMap() {
			new choropleth(document.querySelector('#mapBonds'), mapData, undefined, {
				default_class: 'Corporate Bonds'
			});
			new choropleth(document.querySelector('#mapEquity'), mapData, undefined, {
				default_class: 'Listed Equity'
			});
		}

		fetchCompanyBubble();
		fetchMap();
	});
</script>

<div class="gap-x-4 p-4">
	<h2 class="h2">Overview of the current state of the portfolio</h2>
	<div class="h-screen flex flex-row gap-x-4">
		<div class="card p-4 w-1/2 h-full items-center justify-left">
			<h3 class="h3">Asset classes covered by the analysis</h3>
			<br />
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
				invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
				et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
				Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
				diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
				gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
			<br />
			<!-- Responsive Container (recommended) -->
			<div class="table-container">
				<!-- Native Table Element -->
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Asset Class</th>
							<th>Portfolio value invested (M USD)</th>
							<th>Portfolio value invested (%)</th>
							<th>Included in the analysis</th>
							<th>Value breakout per means of investment</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each tableData as row, i}
							<tr>
								<td>{row['Asset Class']}</td>
								<td>{row['Portfolio value invested (M USD)']}</td>
								<td>{row['Portfolio value invested (%)']}</td>
								<td>{row['Included in the analysis']}</td>
								<td>{row['Value breakout per means of investment']}</td>
								<td>{row['_']}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<th colspan="3">This is where we could write a footer.</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
		<div class="card p-4 w-1/2 h-full items-center justify-right">
			<h3 class="h3">Portfolio value and emissions covered by PACTA sectors</h3>
			<br />
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
				invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
				et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
				Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
				diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
				gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
			<div class="card p-4 w-full h-1/2 justify-top">
				Coverage of listed equity portion of the portfolio
				<div id="bubbleBonds"></div>
			</div>
			<div class="card p-4 w-full h-1/2 justify-bottom">
				Coverage of corporate bonds' portion of the portfolio
				<div id="bubbleEquity"></div>
			</div>
		</div>
	</div>
	<div >
		<div class="card p-4 w-full h-full items-center">
			<h3 class="h3">Regional exposure per sector or technology within sector</h3>
			<h4 class="h4">For equity and bond portions of the portfolio</h4>
			<br />
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
				invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
				et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
				Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
				diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
				gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
			<div class="card p-4 basis-1/2 h-full justify-left">
				Coverage of listed equity portion of the portfolio
				<div id="mapBonds"></div>
			</div>
			<div class="card p-4 basis-1/2 h-full justify-right">
				Coverage of corporate bonds' portion of the portfolio
				<div id="mapEquity"></div>
			</div>
		</div>
	</div>
</div>
