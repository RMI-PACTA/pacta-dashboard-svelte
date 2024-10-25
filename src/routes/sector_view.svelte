<!-- src/routes/sector_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import techmix_data from '../json/data_techmix_sector.json';
	import traj_data from '../json/data_trajectory_alignment.json';
	import emissions_data from '../json/data_emissions.json';
	import { techexposure_future } from '../js/techexposure_future.js';
	import { techmix_sector } from '../js/techmix_sector.js';
	import { trajectory_alignment } from '../js/trajectory_alignment.js';
	import { time_line } from '../js/time_line.js';
	import * as d3 from 'd3';
	import { union } from 'd3-array';

	onMount(() => {
		function fetchTechmix() {
			new techmix_sector(document.querySelector('#techmix-plot'), techmix_data);
		}

		function fetchTrajectoryAlignment() {
			new trajectory_alignment(document.querySelector('#trajectory-plot'), traj_data);
		}

		function fetchEmissionIntensityPlot() {
			new time_line(document.querySelector('#emission-intensity-plot'), emissions_data);
		}

		function setValuesSectorSelectors() {
			const sectorSelectorLanding = document.querySelector('#sector_selector_landing');
			const sectorSelector = document.querySelector('#sector_selector');

			let sectorsVolTraj = new Set(d3.map(traj_data, (d) => d.ald_sector).keys());
			let sectorsTechmix = new Set(d3.map(techmix_data, (d) => d.ald_sector).keys());
			let sectorsEmissions = new Set(d3.map(emissions_data, (d) => d.sector).keys());
			let sectors = Array.from(sectorsVolTraj.union(sectorsTechmix).union(sectorsEmissions));

			sectorSelectorLanding.length = 0;
			sectorSelector.length = 0;
			sectors.forEach((sector) => sectorSelectorLanding.add(new Option(sector, sector)));
			sectors.forEach((sector) => sectorSelector.add(new Option(sector, sector)));
		};

		function setValuesAssetClassSelector() {
			const assetClassSelectorLanding = document.querySelector('#asset_class_selector_landing');
			const assetClassSelector = document.querySelector('#asset_class_selector');

			let classesVolTraj = new Set(d3.map(traj_data, (d) => d.asset_class).keys());
			let classesTechmix = new Set(d3.map(techmix_data, (d) => d.asset_class).keys());
			let classesEmissions = new Set(d3.map(emissions_data, (d) => d.asset_class).keys());
			let assetClasses = Array.from(classesVolTraj.union(classesTechmix).union(classesEmissions));

			assetClassSelectorLanding.length = 0;
			assetClassSelector.length = 0;
			assetClasses.forEach((assetClass) => assetClassSelectorLanding.add(new Option(assetClass, assetClass)));
			assetClasses.forEach((assetClass) => assetClassSelector.add(new Option(assetClass, assetClass)));
		};

		function updateScenarioSelector() {
			let selectedClass = document.querySelector('#asset_class_selector').value;
			let selectedSector = document.querySelector('#sector_selector').value;
			let selectedSource = document.querySelector('#scenario_source_selector').value;
			let selectedScenario = document.querySelector('#scenario_selector').value;
			let filteredTechmixData = techmix_data
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.scenario_source == selectedSource);
			let scenarios = d3.map(filteredTechmixData, (d) => d.scenario).keys();
			const scenarioSelector = document.querySelector('#scenario_selector');
			scenarioSelector.length = 0;
			scenarios.forEach((scenario) => scenarioSelector.add(new Option(scenario, scenario)));
			scenarioSelector.options[Math.max(0, scenarios.indexOf(selectedScenario))].selected =
				'selected';
		}

		function updateBenchmarkSelector() {
			let selectedBenchmark = document.querySelector('#benchmark_selector').value;

			let selectedClass = document.querySelector('#asset_class_selector').value;
			let selectedSector = document.querySelector('#sector_selector').value;
			let selectedMarket = document.querySelector('#equity_market_selector').value;

			let filteredTechmixData = techmix_data
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.equity_market == selectedMarket)
				.filter(d => !(d.this_portfolio));
			let benchmarksTechmix = new Set(d3.map(filteredTechmixData, (d) => d.portfolio_name).keys());

			let filteredVolTrajData = traj_data
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.equity_market == selectedMarket)
				.filter(d => (d.this_benchmark));
			let benchmarksVolTraj = new Set(d3.map(filteredVolTrajData, (d) => d.portfolio_name).keys());

			let benchmarks = Array.from(benchmarksTechmix.union(benchmarksVolTraj));

			const benchmarkSelector = document.querySelector('#benchmark_selector');
			benchmarkSelector.length = 0;
			benchmarks.forEach((benchmark) => benchmarkSelector.add(new Option(benchmark, benchmark)));
			benchmarkSelector.options[Math.max(0, benchmarks.indexOf(selectedBenchmark))].selected =
				'selected';
		}

		function addEventListeners() {
			const go_button_landing = document.querySelector('#go_button_landing');
			const asset_class_selector = document.querySelector('#asset_class_selector');
			const sector_selector = document.querySelector('#sector_selector');
			go_button_landing.addEventListener('click', function () {
				let chosenAssetClass = document.querySelector('#asset_class_selector_landing').value;
				let chosenSector = document.querySelector('#sector_selector_landing').value;
				asset_class_selector.value = chosenAssetClass;
				sector_selector.value = chosenSector;
				document.querySelector('#content-landing-page').classList.toggle('hidden');
				document.querySelector('#content-sector-view').classList.toggle('hidden');
				fetchTrajectoryAlignment();
				fetchTechmix();
				fetchEmissionIntensityPlot();
			});

			sector_selector.addEventListener('change', function () {
				updateBenchmarkSelector();
				fetchTrajectoryAlignment();
				fetchTechmix();
				fetchEmissionIntensityPlot();
			});

			asset_class_selector.addEventListener('change', function () {
				updateBenchmarkSelector();
				fetchTrajectoryAlignment();
				fetchTechmix();
				fetchEmissionIntensityPlot();
			});
			const benchmark_selector = document.querySelector('#benchmark_selector');
			benchmark_selector.addEventListener('change', function () {
				fetchTrajectoryAlignment();
				fetchTechmix();
			});
			const scenario_source_selector = document.querySelector('#scenario_source_selector');
			scenario_source_selector.addEventListener('change', function () {
				updateScenarioSelector();
				fetchTrajectoryAlignment();
				fetchTechmix();
			});
			const scenario_selector = document.querySelector('#scenario_selector');
			scenario_selector.addEventListener('change', function () {
				fetchTechmix();
			});
			const equity_market_selector = document.querySelector('#equity_market_selector');
			equity_market_selector.addEventListener('change', function () {
				updateBenchmarkSelector();
				fetchTrajectoryAlignment();
				fetchTechmix();
				fetchEmissionIntensityPlot();
			});
			const allocation_method_selector = document.querySelector('#allocation_method_selector');
			allocation_method_selector.addEventListener('change', function () {
				fetchTrajectoryAlignment();
				fetchEmissionIntensityPlot();
			});
		}

		setValuesSectorSelectors();
		setValuesAssetClassSelector();
		updateScenarioSelector();
		updateBenchmarkSelector();
		addEventListeners();
		fetchTechmix();
		fetchTrajectoryAlignment();
		fetchEmissionIntensityPlot();
	});
</script>

<div class="content p-8 bg-amber-300" id="content-landing-page">
	<div class="intro-text p-4 bg-teal-300">
		<h2 class="h3 text-center">Please select a sector and an asset class for the analysis</h2>
		<br />
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula quam sed mollis
			scelerisque. Donec sit amet purus in nibh consequat pretium. Aenean suscipit, ligula et cursus
			auctor, justo enim ornare ipsum, quis aliquet augue dui nec mauris. Nam eu ipsum felis. Etiam
			eu lorem ac magna facilisis tempus. In at quam lorem. Maecenas consequat vel tortor nec
			eleifend. Sed tempor fermentum tincidunt. Vivamus magna diam, hendrerit ac est et, vulputate
			mollis orci. Quisque ut elit vitae enim hendrerit pulvinar vel et libero. Duis et tincidunt
			erat. Nunc in tempus leo. Donec imperdiet ut ante in fermentum. Lorem ipsum dolor sit amet,
			consectetur adipiscing elit. Morbi hendrerit, eros in tempor malesuada, quam ex semper ex,
			vitae vulputate est est quis eros. Aenean fringilla vehicula libero in bibendum. Nullam vel
			malesuada urna. Quisque volutpat sapien a consequat maximus. Morbi nisi dolor, mollis ac
			tellus quis, facilisis egestas tellus. Aliquam ultricies condimentum nulla quis mollis. Sed
			consectetur vel lectus in vulputate. Cras vel pretium ex. In vehicula neque et eros accumsan
			sagittis. Ut varius feugiat volutpat.
		</p>
	</div>
	<div class="buttons-sector-asset-class p-4 bg-purple-300 flex space-x-2 justify-center">
		<select class="select max-w-48 variant-outline-surface" id="sector_selector_landing">
			<option value="Not_selected">Please select</option>
		</select>
		<select class="select max-w-48 variant-outline-surface" id="asset_class_selector_landing">
			<option value="Not_selected">Please select</option>
		</select>
		<button class="btn variant-outline-surface" id="go_button_landing">Go!</button>
	</div>
</div>

<div class="content p-8 bg-amber-300 hidden" id="content-sector-view">
	<div class="buttons-sector-asset-class p-4 bg-purple-300 flex space-x-2 justify-center">
		<select class="select max-w-48 variant-outline-surface" id="sector_selector">
			<option value="Not_selected">Please select</option>
		</select>
		<select class="select max-w-48 variant-outline-surface" id="asset_class_selector">
			<option value="Not_selected">Please select</option>
		</select>
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
					<div class="trajectory-plot" id="trajectory-plot"></div>
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
						<div class="emission-intensity-explanation">
							<h4 class="h4">Emission intensity for a sector</h4>
							<p>
								Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
								tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
								eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
								takimata sanctus est Lorem ipsum dolor sit amet.
							</p>
						</div>
						<div class="emission-intensity-plot" id="emission-intensity-plot"></div>
					</div>
				</div>
			</div>
			<div class="analysis-parameters sm:col-span-2 bg-red-300 p-4">
				<h4 class="h4">Parameters</h4>
				<br />
				<label class="label">
					<span>Scenario source</span>
					<select class="select variant-outline-surface" id="scenario_source_selector">
						<option value="WEO2023">WEO2023</option>
						<option value="GECO2023">GECO2023</option>
						<option value="ISF2023">ISF2023</option>
					</select>
				</label>
				<label class="label">
					<span id="scenario-label">Scenario &#9432</span>
					<div class="hide dashboard-tooltip card p-4 shadow-xl">
						Applies to the technology mix plot.
					</div>
					<select class="select variant-outline-surface" id="scenario_selector">
						<option value="Not_selected">Please select</option>
					</select>
				</label>
				<label class="label">
					<span>Allocation method</span>
					<select class="select variant-outline-surface" id="allocation_method_selector">
						<option value="Portfolio Weight">Portfolio Weight</option>
						<option value="Ownership Weight">Ownership Weight</option>
					</select>
				</label>
				<label class="label">
					<span>Equity market</span>
					<select class="select variant-outline-surface" id="equity_market_selector">
						<option value="Global Market">Global Market</option>
						<option value="Developed Market">Developed Market</option>
						<option value="Emerging Market">Emerging Market</option>
					</select>
				</label>
				<label class="label">
					<span id="benchmark-label">Benchmark &#9432</span>
					<div class="hide dashboard-tooltip card p-4 shadow-xl">
						Applies to the production volume alignment and the technology mix plots.
					</div>
					<select class="select variant-outline-surface" id="benchmark_selector">
						<option value="Not_selected">Please select</option>
					</select>
				</label>
			</div>
		</div>
	</div>
</div>

<style>
	.hide {
		display: none;
	}

	#scenario-label:hover + .hide {
		display: inline-block;
	}

	#benchmark-label:hover + .hide {
		display: inline-block;
	}
</style>
