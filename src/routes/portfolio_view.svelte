<!-- src/routes/portfolio_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import tableData from '../json/data_included_table.json';
	import bondsValuePieData from '../json/data_value_pie_bonds.json';
	import equityValuePieData from '../json/data_value_pie_equity.json';
	import bondsEmissionsPieData from '../json/data_emissions_pie_bonds.json';
	import equityEmissionsPieData from '../json/data_emissions_pie_equity.json';
	import techmixData from '../json/data_techexposure.json';
	import techOrder from '../json/tech_order_in_sectors.json';
	import { PieExploded } from '../js/pie_exploded.js';
	import { techexposure } from '../js/techexposure';
	import { tabulateIntoIncludedTable } from '../js/included_table.js';

	onMount(() => {
		function fetchValuePie() {
			try {
				new PieExploded(
					document.querySelector('#valuePieBonds'),
					bondsValuePieData,
					'USD',
					"of assets' value covered by PACTA sectors"
				);
			} catch (err) {
				document.querySelector('#valuePieBonds').innerHTML = '';
				document.querySelector('#valuePieBonds').appendChild(createErrorMessageDiv());
			}
			try {
				new PieExploded(
					document.querySelector('#valuePieEquity'),
					equityValuePieData,
					'USD',
					"of assets' value covered by PACTA sectors"
				);
			} catch (err) {
				document.querySelector('#valuePieEquity').innerHTML = '';
				document.querySelector('#valuePieEquity').appendChild(createErrorMessageDiv());
			}
		}

		function fetchEmissionsPie() {
			try {
				new PieExploded(
					document.querySelector('#emissionsPieBonds'),
					bondsEmissionsPieData,
					'tonnes CO<sub>2</sub> emissions',
					"of assets' emissions covered by PACTA sectors"
				);
			} catch (err) {
				document.querySelector('#emissionsPieBonds').innerHTML = '';
				document.querySelector('#emissionsPieBonds').appendChild(createErrorMessageDiv());
			}
			try {
				new PieExploded(
					document.querySelector('#emissionsPieEquity'),
					equityEmissionsPieData,
					'tonnes CO<sub>2</sub> emissions',
					"of assets' emissions covered by PACTA sectors"
				);
			} catch (err) {
				document.querySelector('#emissionsPieEquity').innerHTML = '';
				document.querySelector('#emissionsPieEquity').appendChild(createErrorMessageDiv());
			}
		}

		function fetchTechmix() {
			try {
				new techexposure(
					document.querySelector('#techMixAllBonds'),
					techmixData,
					'Corporate Bonds',
					'iShares Global Corp Bond UCITS ETF',
					techOrder
				);
			} catch (err) {
				document.querySelector('#techMixAllBonds').innerHTML = '';
				document.querySelector('#techMixAllBonds').appendChild(createErrorMessageDiv());
			}
			try {
				new techexposure(
					document.querySelector('#techMixAllEquity'),
					techmixData,
					'Listed Equity',
					'iShares MSCI World ETF',
					techOrder
				);
			} catch (err) {
				document.querySelector('#techMixAllEquity').innerHTML = '';
				document.querySelector('#techMixAllEquity').appendChild(createErrorMessageDiv());
			}
		}

		function fetchTable() {
			try {
				let opts_table = {
				columnsText: [1, 6],
				columnsNumeric: [2, 5],
				columnsPercent: [3],
				columnsShortText: [4],
				columnValueBreakdown: 5,
				columnToMergeHeaderWithContent: 5,
				columnToMergeHeaderNoContent: 6
				}
				tabulateIntoIncludedTable(tableData, '#includedTable', opts_table)
			} catch {
				document.querySelector('#includedTable').innerHTML = '';
				document.querySelector('#includedTable').appendChild(createErrorMessageDiv());
			}
		}

		fetchTable();
		fetchValuePie();
		fetchEmissionsPie();
		fetchTechmix();
	});
</script>

<div class="content p-8" id="content-portfolio-view">
	<div class="analysis">
		<div class="analysis-intro grid sm:grid-cols-12 p-4">
			<div class="analysis-intro-text sm:col-span-12">
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
		<div class="analysis-content grid sm:grid-cols-12 p-4">
			<div class="analysis-table sm:col-span-12"></div>
			<div class="analysis-table-explanation sm:col-span-12">
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
				<div class="table table-hover" id="includedTable">
				</div>	
			</div>
		</div>
		<div class="analysis-pie-box sm:col-span-12">
			<div class="analysis-pies-explanation sm:col-span-12">
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
			<div class="analysis-pies-box grid sm:grid-cols-12">
				<div class="pies-bonds-text sm:col-span-6">
					<h5 class="h5">Corporate bonds portion of the portfolio</h5>
				</div>
				<div class="pies-equity-text sm:col-span-6">
					<h5 class="h5">Listed equity portion of the portfolio</h5>
				</div>
				<div class="pie-value-bonds sm:col-span-6" id="valuePieBonds"></div>
				<div class="pie-value-equity sm:col-span-6" id="valuePieEquity"></div>
				<div class="pie-emissions-bonds sm:col-span-6" id="emissionsPieBonds"></div>
				<div class="pie-emissions-equity sm:col-span-6" id="emissionsPieEquity"></div>
			</div>
		</div>
		<div class="analysis-exposure-box sm:col-span-12">
			<div class="analysis-exposures-explanation sm:col-span-12">
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
			<div class="analysis-exosures-box grid sm:grid-cols-12">
				<div class="exposures-bonds-text sm:col-span-6">
					<h5 class="h5">Corporate bonds portion of the portfolio</h5>
				</div>
				<div class="exposures-equity-text sm:col-span-6">
					<h5 class="h5">Listed equity portion of the portfolio</h5>
				</div>
				<div class="exposures-bonds sm:col-span-6" id="techMixAllBonds"></div>
				<div class="exposures-equity sm:col-span-6" id="techMixAllEquity"></div>
			</div>
		</div>
	</div>
</div>
