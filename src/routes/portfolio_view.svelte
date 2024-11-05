<!-- src/routes/portfolio_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import tableData from '../json/data_included_table.json';
	import bondsValuePieData from '../json/data_value_pie_bonds.json';
	import equityValuePieData from '../json/data_value_pie_equity.json';
	import bondsEmissionsPieData from '../json/data_emissions_pie_bonds.json';
	import equityEmissionsPieData from '../json/data_emissions_pie_equity.json';
	import techmixData from '../json/data_techexposure.json';
	import mapData from '../json/data_map.json';
	import { PieExploded } from '../js/pie_exploded.js';
	import { techexposure } from '../js/techexposure';
	import { choropleth } from '../js/map.js';

	onMount(() => {
		function fetchValuePie() {
			new PieExploded(document.querySelector('#valuePieBonds'), bondsValuePieData, undefined, {
				default_class: 'Corporate Bonds'
			});
			new PieExploded(document.querySelector('#valuePieEquity'), equityValuePieData, undefined, {
				default_class: 'Listed Equity'
			});
		}

		function fetchEmissionsPie() {
			new PieExploded(
				document.querySelector('#emissionsPieBonds'),
				bondsEmissionsPieData,
				undefined,
				{
					default_class: 'Corporate Bonds'
				}
			);
			new PieExploded(
				document.querySelector('#emissionsPieEquity'),
				equityEmissionsPieData,
				undefined,
				{
					default_class: 'Listed Equity'
				}
			);
		}

		function fetchTechmix() {
			new techexposure(document.querySelector('#techMixAllBonds'), techmixData, {
				default_class: 'Corporate Bonds'
			});
			new techexposure(document.querySelector('#techMixAllEquity'), techmixData, {
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

		fetchValuePie();
		fetchEmissionsPie();
		fetchTechmix();
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
				Value coverage of listed equity portion of the portfolio
				<div id="valuePieBonds"></div>
			</div>
			<div class="card p-4 w-full h-1/2 justify-bottom">
				Value coverage of corporate bonds' portion of the portfolio
				<div id="valuePieEquity"></div>
			</div>
		</div>
	</div>
	<div class="h-screen flex flex-row gap-x-4">
		<div class="card p-4 w-full h-full">
			<div class="flex flex-row">
				<div class="card p-4 basis-1/2 h-full justify-left">
					Emissions coverage of listed equity portion of the portfolio
					<div id="emissionsPieBonds"></div>
				</div>
				<div class="card p-4 basis-1/2 h-full justify-right">
					Emissions coverage of corporate bonds' portion of the portfolio
					<div id="emissionsPieEquity"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="h-screen flex flex-row gap-x-4">
		<div class="card p-4 w-full h-full items-center">
			<div class="flex-row">
				<h3 class="h3">Exposure to climate-relevant sectors and technologies</h3>
				<h4 class="h4">For equity and bond portions of the portfolio</h4>
				<br />
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
			<div class="flex flex-row">
				<div class="card p-4 basis-1/2 h-full justify-left">
					<div id="techMixAllBonds"></div>
				</div>
				<div class="card p-4 basis-1/2 h-full justify-right">
					<div id="techMixAllEquity"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="h-screen flex flex-row gap-x-4">
		<div class="card p-4 w-full h-full items-center">
			<div class="flex-row">
				<h3 class="h3">Regional exposure per sector or technology within sector</h3>
				<h4 class="h4">For equity and bond portions of the portfolio</h4>
				<br />
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
			<div class="flex flex-row">
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
</div>
