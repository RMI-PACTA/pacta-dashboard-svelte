<!-- src/routes/portfolio_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import tableData from '../data/data_included_table.json';
	import bondsValuePieData from '../data/data_value_pie_bonds.json';
	import equityValuePieData from '../data/data_value_pie_equity.json';
	import bondsEmissionsPieData from '../data/data_emissions_pie_bonds.json';
	import equityEmissionsPieData from '../data/data_emissions_pie_equity.json';
	import techmixData from '../data/data_techexposure.json';
	import techOrder from '../data/tech_order_in_sectors.json';
	import mapData from '../data/data_map.json';
	import { PieExploded } from '../js/pie_exploded.js';
	import { techexposure } from '../js/techexposure';
	import { choropleth } from '../js/map.js';

	onMount(() => {
		function fetchValuePie() {
			new PieExploded(
				document.querySelector('#valuePieBonds'),
				bondsValuePieData,
				'USD',
				"of assets' value covered by PACTA sectors"
			);
			new PieExploded(
				document.querySelector('#valuePieEquity'),
				equityValuePieData,
				'USD',
				"of assets' value covered by PACTA sectors"
			);
		}

		function fetchEmissionsPie() {
			new PieExploded(
				document.querySelector('#emissionsPieBonds'),
				bondsEmissionsPieData,
				'tonnes CO<sub>2</sub> emissions',
				"of assets' emissions covered by PACTA sectors"
			);
			new PieExploded(
				document.querySelector('#emissionsPieEquity'),
				equityEmissionsPieData,
				'tonnes CO<sub>2</sub> emissions',
				"of assets' emissions covered by PACTA sectors"
			);
		}

		function fetchTechmix() {
			new techexposure(
				document.querySelector('#techMixAllBonds'),
				techmixData,
				'Corporate Bonds',
				'iShares Global Corp Bond UCITS ETF',
				techOrder
			);
			new techexposure(
				document.querySelector('#techMixAllEquity'),
				techmixData,
				'Listed Equity',
				'iShares MSCI World ETF',
				techOrder
			);
		}

		function fetchMap() {
			new choropleth(document.querySelector('#mapBonds'), mapData, undefined, {
				default_class: 'Corporate Bonds'
			});
			new choropleth(document.querySelector('#mapEquity'), mapData, undefined, {
				default_class: 'Listed Equity'
			});
		}

		fetchValuePie();
		fetchEmissionsPie();
		fetchTechmix();
		fetchMap();
	});
</script>

<div class="content p-8 bg-amber-300" id="content-portfolio-view">
	<div class="analysis p-4 bg-cyan-300">
		<div class="analysis-intro grid sm:grid-cols-12 p-4 bg-purple-300">
			<div class="analysis-intro-text sm:col-span-12 bg-orange-300">
				<h3 class="h3">Overview of the current state of the portfolio</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula quam sed mollis
					scelerisque. Donec sit amet purus in nibh consequat pretium. Aenean suscipit, ligula et
					cursus auctor, justo enim ornare ipsum, quis aliquet augue dui nec mauris. Nam eu ipsum
					felis. Etiam eu lorem ac magna facilisis tempus. In at quam lorem. Maecenas consequat vel
					tortor nec eleifend. Sed tempor fermentum tincidunt. Vivamus magna diam, hendrerit ac est
					et, vulputate mollis orci. Quisque ut elit vitae enim hendrerit pulvinar vel et libero.
					Duis et tincidunt erat. Nunc in tempus leo. Donec imperdiet ut ante in fermentum.
				</p>
			</div>
		</div>
		<div class="analysis-content grid sm:grid-cols-12 p-2 bg-teal-300">
			<div class="analysis-table sm:col-span-12 bg-orange-300"></div>
			<div class="analysis-table-explanation sm:col-span-12 bg-orange-300">
				<h4 class="h4">Asset classes covered by the analysis</h4>
				<p>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
					invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
					accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
					sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
					elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
					diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
					gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
				</p>
			</div>
			<div class="table-box sm:col-span-12">
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
		<div class="analysis-pie-box sm:col-span-12 bg-orange-300">
			<div class="analysis-pies-explanation sm:col-span-12 bg-teal-300">
				<h4 class="h4">Portfolio value and emissions covered by PACTA sectors</h4>
				<p>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
					invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
					accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
					sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
					elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
					diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
					gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
				</p>
			</div>
			<div class="analysis-pies-box grid sm:grid-cols-12 bg-green-300">
				<div class="pies-bonds-text sm:col-span-6 bg-blue-300">
					<h5 class="h5">Corporate bonds portion of the portfolio</h5>
				</div>
				<div class="pies-equity-text sm:col-span-6 bg-purple-300">
					<h5 class="h5">Listed equity portion of the portfolio</h5>
				</div>
				<div class="pie-value-bonds sm:col-span-6 bg-blue-300" id="valuePieBonds"></div>
				<div class="pie-value-equity sm:col-span-6 bg-purple-300" id="valuePieEquity"></div>
				<div class="pie-emissions-bonds sm:col-span-6 bg-blue-300" id="emissionsPieBonds"></div>
				<div class="pie-emissions-equity sm:col-span-6 bg-purple-300" id="emissionsPieEquity"></div>
			</div>
		</div>
		<div class="analysis-exposure-box sm:col-span-12 bg-orange-300">
			<div class="analysis-exposures-explanation sm:col-span-12 bg-teal-300">
				<h4 class="h4">Exposure to climate-relevant sectors and technologies</h4>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula quam sed mollis
					scelerisque. Donec sit amet purus in nibh consequat pretium. Aenean suscipit, ligula et
					cursus auctor, justo enim ornare ipsum, quis aliquet augue dui nec mauris. Nam eu ipsum
					felis. Etiam eu lorem ac magna facilisis tempus. In at quam lorem. Maecenas consequat vel
					tortor nec eleifend. Sed tempor fermentum tincidunt. Vivamus magna diam, hendrerit ac est
					et, vulputate mollis orci. Quisque ut elit vitae enim hendrerit pulvinar vel et libero.
					Duis et tincidunt erat. Nunc in tempus leo. Donec imperdiet ut ante in fermentum. Lorem
					ipsum dolor sit amet, consectetur adipiscing elit. Morbi hendrerit, eros in tempor
					malesuada, quam ex semper ex, vitae vulputate est est quis eros. Aenean fringilla vehicula
					libero in bibendum. Nullam vel malesuada urna. Quisque volutpat sapien a consequat
					maximus. Morbi nisi dolor, mollis ac tellus quis, facilisis egestas tellus. Aliquam
					ultricies condimentum nulla quis mollis. Sed consectetur vel lectus in vulputate. Cras vel
					pretium ex. In vehicula neque et eros accumsan sagittis. Ut varius feugiat volutpat.
				</p>
			</div>
			<div class="analysis-exosures-box grid sm:grid-cols-12 bg-green-300">
				<div class="exposures-bonds-text sm:col-span-6 bg-blue-300">
					<h5 class="h5">Corporate bonds portion of the portfolio</h5>
				</div>
				<div class="exposures-equity-text sm:col-span-6 bg-purple-300">
					<h5 class="h5">Listed equity portion of the portfolio</h5>
				</div>
				<div class="exposures-bonds sm:col-span-6 bg-blue-300" id="techMixAllBonds"></div>
				<div class="exposures-equity sm:col-span-6 bg-purple-300" id="techMixAllEquity"></div>
			</div>
		</div>
		<div class="analysis-map-box sm:col-span-12 bg-orange-300">
			<div class="analysis-map-explanation sm:col-span-12 bg-teal-300">
				<h4 class="h4">Regional exposure per sector or technology within sector</h4>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula quam sed mollis
					scelerisque. Donec sit amet purus in nibh consequat pretium. Aenean suscipit, ligula et
					cursus auctor, justo enim ornare ipsum, quis aliquet augue dui nec mauris. Nam eu ipsum
					felis. Etiam eu lorem ac magna facilisis tempus. In at quam lorem. Maecenas consequat vel
					tortor nec eleifend. Sed tempor fermentum tincidunt. Vivamus magna diam, hendrerit ac est
					et, vulputate mollis orci. Quisque ut elit vitae enim hendrerit pulvinar vel et libero.
				</p>
			</div>
			<div class="analysis-map-box grid sm:grid-cols-12 bg-green-300">
				<div class="map-bonds-text sm:col-span-6 bg-blue-300">
					<h5 class="h5">Corporate bonds portion of the portfolio</h5>
				</div>
				<div class="map-equity-text sm:col-span-6 bg-purple-300">
					<h5 class="h5">Listed equity portion of the portfolio</h5>
				</div>
				<div class="map-bonds sm:col-span-6 bg-blue-300" id="mapBonds"></div>
				<div class="map-equity sm:col-span-6 bg-purple-300" id="mapEquity"></div>
			</div>
		</div>
	</div>
</div>
