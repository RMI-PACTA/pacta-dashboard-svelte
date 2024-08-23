<!-- src/routes/sector_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import techmix_future_data from '../json/data_techexposure_future.json';
	import traj_data from '../json/data_trajectory_alignment.json';
	import emissions_data from '../json/data_emissions.json';
	import { techexposure_future } from '../js/techexposure_future.js';
	import { trajectory_alignment } from '../js/trajectory_alignment.js';
	import { time_line } from '../js/time_line.js';

	onMount(() => {
		function fetchFutureTechmix() {
			new techexposure_future(
				document.querySelector('#techmix-plot'),
				techmix_future_data,
				undefined,
				{
					default_class: 'Corporate Bonds'
				}
			);
		}

		function fetchTrajectoryAlignmentData() {
			new trajectory_alignment(document.querySelector('#trajectory-plot1'), traj_data, undefined, {
				default_tech: 'Coal Power'
			});
			new trajectory_alignment(document.querySelector('#trajectory-plot2'), traj_data, undefined, {
				default_tech: 'Gas Power'
			});
		}

		function fetchEmissionsData() {
			new time_line(document.querySelector('#emission-intensity-plot'), emissions_data);
		}

		function addEventListeners() {
			const asset_class_selector = document.querySelector('#asset_class_selector');
			asset_class_selector.addEventListener('change', function () {
				const selects = document.querySelectorAll(
					'.techexposure_class_selector, .time_line_class_selector'
				);
				selects.forEach((d) => {
					d.value = this.value;
					d.dispatchEvent(new Event('change'));
				});
			});
			const benchmark_selector = document.querySelector('#benchmark_selector');
			benchmark_selector.addEventListener('change', function () {
				const selects = document.querySelectorAll(
					'.trajectory_alignment_benchmark_selector, .techexposure_benchmark_selector'
				);
				selects.forEach((d) => {
					d.value = this.value;
					d.dispatchEvent(new Event('change'));
				});
			});
			const scenario_source_selector = document.querySelector('#scenario_source_selector');
			scenario_source_selector.addEventListener('change', function () {
				const selects = document.querySelectorAll('.trajectory_alignment_source_selector');
				selects.forEach((d) => {
					d.value = this.value;
					d.dispatchEvent(new Event('change'));
				});
			});
			const scenario_selector = document.querySelector('#scenario_selector');
			scenario_selector.addEventListener('change', function () {
				const selects = document.querySelectorAll('.techexposure_scenario_selector');
				selects.forEach((d) => {
					d.value = this.value;
					d.dispatchEvent(new Event('change'));
				});
			});
		}

		fetchFutureTechmix();
		fetchTrajectoryAlignmentData();
		fetchEmissionsData();
		addEventListeners();
	});
</script>

<div class="content p-8 bg-amber-300">
	<div class="buttons-sector-asset-class p-4 bg-purple-300 flex space-x-2 justify-center">
		<select class="select max-w-48 variant-outline-surface" id="sector_selector">
			<option value="Automotive">Automotive</option>
			<option value="Power">Power</option>
		</select>
		<select class="select max-w-48 variant-outline-surface" id="asset_class_selector">
			<option value="Corporate Bonds">Corporate Bonds</option>
			<option value="Listed Equity">Listed Equity</option>
		</select>
		<button class="btn variant-outline-surface" id="go_button">Go!</button>
	</div>
	<div class="analysis p-4 bg-cyan-300 grid">
		<div class="analysis-intro grid sm:grid-cols-12 p-4 bg-purple-300">
			<div class="analysis-intro-text sm:col-span-9 bg-orange-300">
				<h3 class="h3">Current state and future predictions for a sector</h3>
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
			<div class="analysis-intro-stats sm:col-span-3 bg-green-300">Intro stats</div>
		</div>
		<div class="analysis-content grid sm:grid-cols-12 p-4 bg-teal-300">
			<div class="analysis-plots sm:col-span-10 p-4 bg-yellow-300">
				<div class="plot-trajectory-box grid p-4 bg-orange-300">
					<div class="trajectory-explanation bg-cyan-300">
						<h4 class="h4">Production volume alignment over time for technologies in the sector</h4>
						<p>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
							accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
							sanctus est Lorem ipsum dolor sit amet.
						</p>
					</div>
					<div class="trajectory-plots-box grid sm:grid-cols-6 bg-teal-300">
						<div class="trajectory-plot sm:col-span-3 bg-teal-300" id="trajectory-plot1"></div>
						<div class="trajectory-plot sm:col-span-3 bg-teal-300" id="trajectory-plot2"></div>
						<div class="trajectory-plot sm:col-span-3 bg-teal-300" id="trajectory-plot3"></div>
						<div class="trajectory-plot sm:col-span-3 bg-teal-300" id="trajectory-plot4"></div>
						<div class="trajectory-plot sm:col-span-3 bg-teal-300" id="trajectory-plot5"></div>
						<div class="trajectory-plot sm:col-span-3 bg-teal-300" id="trajectory-plot6"></div>
					</div>
				</div>
				<div class="other-sector-plots-box grid sm:grid-cols-6 p-4 bg-purple-300">
					<div class="techmix-plot-box sm:col-span-3 bg-teal-300">
						<div class="techmix-explanation">
							<h4 class="h4">Technology mix for a sector</h4>
							<p>
								Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
								tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
								eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
								takimata sanctus est Lorem ipsum dolor sit amet.
							</p>
						</div>
						<div class="techmix-plot" id="techmix-plot"></div>
					</div>
					<div class="emission-intensity-plot-box sm:col-span-3 bg-teal-300">
						<div class="techmix-explanation">
							<h4 class="h4">Emission intensity for a sector</h4>
								<p>
									Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
									tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
									eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
									takimata sanctus est Lorem ipsum dolor sit amet.
								</p>
						</div>
						<div class="techmix-plot" id="emission-intensity-plot"></div>
					</div>
				</div>
			</div>
			<div class="analysis-parameters sm:col-span-2 bg-red-300 p-4">
				<h4 class="h4">Parameters (not working now)</h4>
				<br />
				<label class="label">
					<span>Scenario source</span>
					<select class="select variant-outline-surface" id="scenario_source_selector">
						<option value="GECO2023">GECO2023</option>
						<option value="WEO2023">WEO2023</option>
						<option value="ISF2023">ISF2023</option>
					</select>
				</label>
				<label class="label">
					<span>Scenario</span>
					<select class="select variant-outline-surface" id="scenario_selector">
						<option value="GECO2023: 1.5C">GECO2023: 1.5C</option>
						<option value="GECO2023: NDC-LTS">GECO2023: NDC-LTS</option>
						<option value="GECO2023: Reference">GECO2023: Reference</option>
						<option value="WEO2023: APS">WEO2023: APS</option>
						<option value="WEO2023: NZE: 2050">WEO2023: NZE: 2050</option>
						<option value="WEO2023: STEPS">WEO2023: STEPS</option>
						<option value="ISF2023: 1.5°C">ISF2023: 1.5°C</option>
					</select>
				</label>
				<label class="label">
					<span>Allocation method</span>
					<select class="select variant-outline-surface" id="asset_class_selector">
						<option value="Portfolio weight">Portfolio weight</option>
						<option value="Ownership weight">Ownership weight</option>
					</select>
				</label>
				<label class="label">
					<span>Equity market</span>
					<select class="select variant-outline-surface" id="scenario_source_selector">
						<option value="Global Market">Global Market</option>
						<option value="Developed Market">Developed Market</option>
						<option value="Emerging Market">Emerging Market</option>
					</select>
				</label>
				<label class="label">
					<span>Benchmark</span>
					<select class="select variant-outline-surface" id="benchmark_selector">
						<option value="iShares Global Corp Bond UCITS ETF"
							>iShares Global Corp Bond UCITS ETF</option
						>
						<option value="iShares Core S&P 500 ETF">iShares Core S&P 500 ETF</option>
						<option value="iShares MSCI ACWI ETF">iShares MSCI ACWI ETF</option>
						<option value="iShares MSCI Emerging Markets ETF"
							>iShares MSCI Emerging Markets ETF</option
						>
						<option value="iShares MSCI World ETF">iShares MSCI World ETF</option>
					</select>
				</label>
			</div>
		</div>
	</div>
</div>

<div class="gap-x-4 p-4">
	<h2 class="h2">Current state and future predictions for a sector</h2>
	<p>
		Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
		ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
		dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
		sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
		invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
		justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
		ipsum dolor sit amet.
	</p>
	<br />
	<div class="h-screen flex gap-x-4">
		<div class="container">
			<div class="selectors card p-4">
				<h3 class="h3">Select parameters for the analysis</h3>

				<label class="label">
					<span>Asset Class</span>
					<select class="select variant-outline-surface" id="asset_class_selector">
						<option value="Corporate Bonds">Corporate Bonds</option>
						<option value="Listed Equity">Listed Equity</option>
					</select>
				</label>

				<label class="label">
					<span>Benchmark</span>
					<select class="select variant-outline-surface" id="benchmark_selector">
						<option value="iShares Global Corp Bond UCITS ETF"
							>iShares Global Corp Bond UCITS ETF</option
						>
						<option value="iShares Core S&P 500 ETF">iShares Core S&P 500 ETF</option>
						<option value="iShares MSCI ACWI ETF">iShares MSCI ACWI ETF</option>
						<option value="iShares MSCI Emerging Markets ETF"
							>iShares MSCI Emerging Markets ETF</option
						>
						<option value="iShares MSCI World ETF">iShares MSCI World ETF</option>
					</select>
				</label>

				<label class="label">
					<span>Scenario source</span>
					<select class="select variant-outline-surface" id="scenario_source_selector">
						<option value="GECO2023">GECO2023</option>
						<option value="WEO2023">WEO2023</option>
						<option value="ISF2023">ISF2023</option>
					</select>
				</label>

				<label class="label">
					<span>Scenario</span>
					<select class="select variant-outline-surface" id="scenario_selector">
						<option value="GECO2023: 1.5C">GECO2023: 1.5C</option>
						<option value="GECO2023: NDC-LTS">GECO2023: NDC-LTS</option>
						<option value="GECO2023: Reference">GECO2023: Reference</option>
						<option value="WEO2023: APS">WEO2023: APS</option>
						<option value="WEO2023: NZE: 2050">WEO2023: NZE: 2050</option>
						<option value="WEO2023: STEPS">WEO2023: STEPS</option>
						<option value="ISF2023: 1.5°C">ISF2023: 1.5°C</option>
					</select>
				</label>
			</div>
			<div class="tech_mix card p-4">
				<h3 class="h3">Future Technology Mix</h3>
				<div id="techmixplot1"></div>
				<div id="techmixplot2"></div>
			</div>
			<div class="emission_intensity card p-4">
				<h3 class="h3">Emission Intensity</h3>
				<div id="emissionsplot"></div>
			</div>
			<div class="volume_trajectory card p-4">
				<h3 class="h3">
					Production volume alignment over time for technologies in the Power sector
				</h3>
				<div class="d3chart" id="trajplot1"></div>
				<div class="d3chart" id="trajplot2"></div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr 1fr;
		grid-auto-flow: row;
		gap: 0.5rem;
		grid-template-areas:
			'selectors tech_mix tech_mix emission_intensity emission_intensity'
			'selectors tech_mix tech_mix emission_intensity emission_intensity'
			'selectors volume_trajectory volume_trajectory volume_trajectory volume_trajectory'
			'selectors volume_trajectory volume_trajectory volume_trajectory volume_trajectory';
	}

	.selectors {
		grid-area: selectors;
	}

	.tech_mix {
		grid-area: tech_mix;
	}

	.emission_intensity {
		grid-area: emission_intensity;
	}

	.volume_trajectory {
		grid-area: volume_trajectory;
	}
</style>
