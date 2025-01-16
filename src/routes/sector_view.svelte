<!-- src/routes/sector_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import { ExposureStatsTile } from '../js/exposure_stats.js';
	import { techmix_sector } from '../js/techmix_sector.js';
	import { trajectory_alignment } from '../js/trajectory_alignment.js';
	import { time_line } from '../js/time_line.js';
	import { createErrorMessageDiv } from '../js/createErrorMessageDiv.js';
	import * as d3 from 'd3';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	onMount(async () => {
		const exposureStatsDataResponse = await fetch('data/data_exposure_stats.json');
		let exposureStatsData = await exposureStatsDataResponse.json();

		const techmixDataResponse = await fetch('data/data_techmix_sector.json');
		let techmixData = await techmixDataResponse.json();

		const trajDataResponse = await fetch('data/data_trajectory_alignment.json');
		let trajData = await trajDataResponse.json();

		const emissionsDataResponse = await fetch('data/data_emissions.json');
		let emissionsData = await emissionsDataResponse.json();

		function fetchExposureStats() {
			try {
				new ExposureStatsTile(document.querySelector('#exposure-stats'), exposureStatsData);
			} catch (err) {
				console.error('Error fetching exposure stats: ', err);
				document.querySelector('#exposure-stats').innerHTML = '';
				document.querySelector('#exposure-stats').appendChild(createErrorMessageDiv());
			}
		}

		function fetchTechmix() {
			try {
				new techmix_sector(document.querySelector('#techmix-plot'), techmixData);
			} catch (err) {
				console.error('Error fetching techmix: ', err);
				document.querySelector('#techmix-plot').innerHTML = '';
				document.querySelector('#techmix-plot').appendChild(createErrorMessageDiv());
			}
		}

		function fetchTrajectoryAlignmentIfApplicable() {
			try {
				const volTrajectorySectors = ['Power', 'Automotive', 'Oil&Gas', 'Coal'];
				let chosenSector = document.querySelector('#sector_selector').value;
				if (volTrajectorySectors.includes(chosenSector)) {
					document.querySelector('#trajectory-box').classList.remove('hidden');
					new trajectory_alignment(document.querySelector('#trajectory-plot'), trajData);
				} else {
					document.querySelector('#trajectory-box').classList.add('hidden');
				}
			} catch (err) {
				console.error('Error fetching trajectory alignment: ', err);
				document.querySelector('#trajectory-box').innerHTML = '';
				document.querySelector('#trajectory-box').appendChild(createErrorMessageDiv());
			}
		}

		function fetchEmissionIntensityPlot() {
			try {
				new time_line(document.querySelector('#emission-intensity-plot'), emissionsData);
			} catch (err) {
				console.error('Error fetching emission intensity plot: ', err);
				document.querySelector('#emission-intensity-plot').innerHTML = '';
				document.querySelector('#emission-intensity-plot').appendChild(createErrorMessageDiv());
			}
		}

		function setValuesSectorSelectors() {
			const sectorSelectorLanding = document.querySelector('#sector_selector_landing');
			const sectorSelector = document.querySelector('#sector_selector');

			let sectorsVolTraj = new Set(d3.map(trajData, (d) => d.ald_sector).keys());
			let sectorsTechmix = new Set(d3.map(techmixData, (d) => d.ald_sector).keys());
			let sectorsEmissions = new Set(d3.map(emissionsData, (d) => d.sector).keys());
			let sectors = Array.from(sectorsVolTraj.union(sectorsTechmix).union(sectorsEmissions));

			sectorSelectorLanding.length = 0;
			sectorSelector.length = 0;
			sectors.forEach((sector) => sectorSelectorLanding.add(new Option(sector, sector)));
			sectors.forEach((sector) => sectorSelector.add(new Option(sector, sector)));
		}

		function setValuesAssetClassSelector() {
			const assetClassSelectorLanding = document.querySelector('#asset_class_selector_landing');
			const assetClassSelector = document.querySelector('#asset_class_selector');

			let classesVolTraj = new Set(d3.map(trajData, (d) => d.asset_class).keys());
			let classesTechmix = new Set(d3.map(techmixData, (d) => d.asset_class).keys());
			let classesEmissions = new Set(d3.map(emissionsData, (d) => d.asset_class).keys());
			let assetClasses = Array.from(classesVolTraj.union(classesTechmix).union(classesEmissions));

			assetClassSelectorLanding.length = 0;
			assetClassSelector.length = 0;
			assetClasses.forEach((assetClass) =>
				assetClassSelectorLanding.add(new Option(assetClass, assetClass))
			);
			assetClasses.forEach((assetClass) =>
				assetClassSelector.add(new Option(assetClass, assetClass))
			);
		}

		function checkDataAvailability() {
			let selectedClass = document.querySelector('#asset_class_selector').value;
			let selectedSector = document.querySelector('#sector_selector').value;

			let filteredTechmixData = techmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);

			let filteredVolTrajData = trajData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);

			let filteredEmissionsData = emissionsData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.sector == selectedSector);

			let check = [filteredTechmixData, filteredVolTrajData, filteredEmissionsData].some(
				(x) => x.length != 0
			);

			return check;
		}

		function handleNoDataForAssetSectorCombination() {
			document.querySelector('#analysis-content').classList.add('hidden');
			document.querySelector('#alert-message').classList.remove('hidden');
		}

		function showAnalysisHideAlert() {
			document.querySelector('#analysis-content').classList.remove('hidden');
			document.querySelector('#alert-message').classList.add('hidden');
		}

		function handleNoDataParameterSelection() {
			document.querySelector('#analysis-plots').classList.add('hidden');
			document.querySelector('#alert-message-parameters').classList.remove('hidden');
		}

		function showAnalysisHideAlertParameters() {
			document.querySelector('#analysis-plots').classList.remove('hidden');
			document.querySelector('#alert-message-parameters').classList.add('hidden');
		}

		function updateScenarioSourceSelector() {
			let selectedSource = document.querySelector('#scenario_source_selector').value;

			let selectedClass = document.querySelector('#asset_class_selector').value;
			let selectedSector = document.querySelector('#sector_selector').value;

			let filteredTechmixData = techmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let scenarioSourcesTechMix = new Set(
				d3.map(filteredTechmixData, (d) => d.scenario_source).keys()
			);

			let filteredVolTrajData = trajData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let scenarioSourcesVolTraj = new Set(
				d3.map(filteredVolTrajData, (d) => d.scenario_source).keys()
			);

			let scenarioSources = Array.from(scenarioSourcesTechMix.union(scenarioSourcesVolTraj));

			if (scenarioSources.length != 0) {
				showAnalysisHideAlertParameters();
				const scenarioSourceSelector = document.querySelector('#scenario_source_selector');
				scenarioSourceSelector.length = 0;
				scenarioSources.forEach((source) => scenarioSourceSelector.add(new Option(source, source)));
				scenarioSourceSelector.options[
					Math.max(0, scenarioSources.indexOf(selectedSource))
				].selected = 'selected';
			} else {
				handleNoDataParameterSelection();
			}
		}

		function updateScenarioSelector() {
			let selectedClass = document.querySelector('#asset_class_selector').value;
			let selectedSector = document.querySelector('#sector_selector').value;
			let selectedSource = document.querySelector('#scenario_source_selector').value;
			let selectedScenario = document.querySelector('#scenario_selector').value;
			let filteredTechmixData = techmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.scenario_source == selectedSource);
			let scenarios = d3.map(filteredTechmixData, (d) => d.scenario).keys();

			if (scenarios.length != 0) {
				showAnalysisHideAlertParameters();
				const scenarioSelector = document.querySelector('#scenario_selector');
				scenarioSelector.length = 0;
				scenarios.forEach((scenario) => scenarioSelector.add(new Option(scenario, scenario)));
				scenarioSelector.options[Math.max(0, scenarios.indexOf(selectedScenario))].selected =
					'selected';
			} else {
				handleNoDataParameterSelection();
			}
		}

		function updateAllocationMethodSelector() {
			let selectedAllocation = document.querySelector('#allocation_method_selector').value;

			let selectedClass = document.querySelector('#asset_class_selector').value;
			let selectedSector = document.querySelector('#sector_selector').value;

			let filteredEmissionsData = emissionsData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.sector == selectedSector);
			let allocationsEmissions = new Set(
				d3.map(filteredEmissionsData, (d) => d.allocation_translation).keys()
			);

			let filteredVolTrajData = trajData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let allocationsVolTraj = new Set(
				d3.map(filteredVolTrajData, (d) => d.allocation_translation).keys()
			);

			let allocationMethods = Array.from(allocationsEmissions.union(allocationsVolTraj));

			if (allocationMethods.length != 0) {
				showAnalysisHideAlertParameters();
				const allocationMethodSelector = document.querySelector('#allocation_method_selector');
				allocationMethodSelector.length = 0;
				allocationMethods.forEach((allocation) =>
					allocationMethodSelector.add(new Option(allocation, allocation))
				);
				allocationMethodSelector.options[
					Math.max(0, allocationMethods.indexOf(selectedAllocation))
				].selected = 'selected';
			} else {
				handleNoDataParameterSelection();
			}
		}

		function updateEquityMarketSelector() {
			let selectedMarket = document.querySelector('#equity_market_selector').value;

			let selectedClass = document.querySelector('#asset_class_selector').value;
			let selectedSector = document.querySelector('#sector_selector').value;

			let filteredTechmixData = techmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let equityMarketsTechMix = new Set(
				d3.map(filteredTechmixData, (d) => d.equity_market).keys()
			);

			let filteredVolTrajData = trajData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let equityMarketsVolTraj = new Set(
				d3.map(filteredVolTrajData, (d) => d.equity_market_translation).keys()
			);

			let equityMarkets = Array.from(equityMarketsTechMix.union(equityMarketsVolTraj));

			if (equityMarkets.length != 0) {
				showAnalysisHideAlertParameters();
				const equityMarketSelector = document.querySelector('#equity_market_selector');
				equityMarketSelector.length = 0;
				equityMarkets.forEach((market) => equityMarketSelector.add(new Option(market, market)));
				equityMarketSelector.options[Math.max(0, equityMarkets.indexOf(selectedMarket))].selected =
					'selected';
			} else {
				handleNoDataParameterSelection();
			}
		}

		function updateBenchmarkSelector() {
			let selectedBenchmark = document.querySelector('#benchmark_selector').value;

			let selectedClass = document.querySelector('#asset_class_selector').value;
			let selectedSector = document.querySelector('#sector_selector').value;
			let selectedMarket = document.querySelector('#equity_market_selector').value;

			let filteredTechmixData = techmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.equity_market == selectedMarket)
				.filter((d) => !d.this_portfolio);
			let benchmarksTechmix = new Set(d3.map(filteredTechmixData, (d) => d.portfolio_name).keys());

			let filteredVolTrajData = trajData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.equity_market == selectedMarket)
				.filter((d) => d.this_benchmark);
			let benchmarksVolTraj = new Set(d3.map(filteredVolTrajData, (d) => d.portfolio_name).keys());

			let benchmarks = Array.from(benchmarksTechmix.union(benchmarksVolTraj));

			if (benchmarks.length != 0) {
				showAnalysisHideAlertParameters();
				const benchmarkSelector = document.querySelector('#benchmark_selector');
				benchmarkSelector.length = 0;
				benchmarks.forEach((benchmark) => benchmarkSelector.add(new Option(benchmark, benchmark)));
				benchmarkSelector.options[Math.max(0, benchmarks.indexOf(selectedBenchmark))].selected =
					'selected';
			} else {
				handleNoDataParameterSelection();
			}
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
				fetchExposureStats();
				if (checkDataAvailability()) {
					showAnalysisHideAlert();
					updateScenarioSourceSelector();
					updateScenarioSelector();
					updateAllocationMethodSelector();
					updateEquityMarketSelector();
					updateBenchmarkSelector();
					fetchTrajectoryAlignmentIfApplicable();
					fetchTechmix();
					fetchEmissionIntensityPlot();
				} else {
					handleNoDataForAssetSectorCombination();
				}
			});

			sector_selector.addEventListener('change', function () {
				fetchExposureStats();
				if (checkDataAvailability()) {
					showAnalysisHideAlert();
					updateScenarioSourceSelector();
					updateScenarioSelector();
					updateEquityMarketSelector();
					updateBenchmarkSelector();
					fetchTrajectoryAlignmentIfApplicable();
					fetchTechmix();
					fetchEmissionIntensityPlot();
				} else {
					handleNoDataForAssetSectorCombination();
				}
			});

			asset_class_selector.addEventListener('change', function () {
				fetchExposureStats();
				if (checkDataAvailability()) {
					showAnalysisHideAlert();
					updateScenarioSourceSelector();
					updateScenarioSelector();
					updateAllocationMethodSelector();
					updateEquityMarketSelector();
					updateBenchmarkSelector();
					fetchTrajectoryAlignmentIfApplicable();
					fetchTechmix();
					fetchEmissionIntensityPlot();
				} else {
					handleNoDataForAssetSectorCombination();
				}
			});
			const benchmark_selector = document.querySelector('#benchmark_selector');
			benchmark_selector.addEventListener('change', function () {
				fetchTrajectoryAlignmentIfApplicable();
				fetchTechmix();
			});
			const scenario_source_selector = document.querySelector('#scenario_source_selector');
			scenario_source_selector.addEventListener('change', function () {
				updateScenarioSelector();
				fetchTrajectoryAlignmentIfApplicable();
				fetchTechmix();
				fetchEmissionIntensityPlot();
			});
			const scenario_selector = document.querySelector('#scenario_selector');
			scenario_selector.addEventListener('change', function () {
				fetchTechmix();
				fetchEmissionIntensityPlot();
			});
			const equity_market_selector = document.querySelector('#equity_market_selector');
			equity_market_selector.addEventListener('change', function () {
				updateBenchmarkSelector();
				fetchTrajectoryAlignmentIfApplicable();
				fetchTechmix();
				fetchEmissionIntensityPlot();
			});
			const allocation_method_selector = document.querySelector('#allocation_method_selector');
			allocation_method_selector.addEventListener('change', function () {
				fetchTrajectoryAlignmentIfApplicable();
				fetchEmissionIntensityPlot();
			});
		}

		setValuesSectorSelectors();
		setValuesAssetClassSelector();
		fetchExposureStats();
		if (checkDataAvailability()) {
			addEventListeners();
		} else {
			handleNoDataForAssetSectorCombination();
		}
	});
</script>

<div class="content p-8" id="content-landing-page">
	<div class="intro-box card">
		<div class="intro-text p-8">
			<h2 class="h3 text-center">Please select a sector and an asset class for the analysis</h2>
			<br />
			<p>
				The <strong>sector-level analysis</strong> provides a detailed look at your listed equity
				and corporate bond holding’s exposure to key technologies relevant for the climate
				transition in the analysed sector.
				<br /><br />

				To view the sector-level results, select the appropriate options from the drop-down menus
				below and click <kbd class="kbd">Go!</kbd>. If no results appear after clicking
				<kbd class="kbd">Go!</kbd>, it likely means your portfolio does not have exposure to the
				selected sector or financial asset.
			</p>
		</div>
		<div class="buttons-sector-asset-class p-4 flex space-x-2 justify-center">
			<select class="select max-w-48 variant-outline-surface" id="sector_selector_landing">
				<option value="Not_selected">Please select</option>
			</select>
			<select class="select max-w-48 variant-outline-surface" id="asset_class_selector_landing">
				<option value="Not_selected">Please select</option>
			</select>
			<button class="btn variant-filled-secondary" id="go_button_landing">Go!</button>
		</div>
	</div>
</div>

<div class="content p-8 hidden" id="content-sector-view">
	<div class="buttons-sector-asset-class p-4 flex space-x-2 justify-center">
		<select class="select max-w-48 variant-outline-surface" id="sector_selector">
			<option value="Not_selected">Please select</option>
		</select>
		<select class="select max-w-48 variant-outline-surface" id="asset_class_selector">
			<option value="Not_selected">Please select</option>
		</select>
	</div>
	<div class="analysis p-8">
		<div class="analysis-intro grid sm:grid-cols-12 p-2">
			<div class="analysis-intro-text sm:col-span-9">
				<h3 class="h3">Sector-level analysis</h3>
				<br />
				This section presents by sector and asset class, how the aggregated production plans of companies
				within the portfolio align with climate goals in terms of technology share, and future build
				out of low carbon technologies or future phase down of high carbon technologies. For sectors
				without technology roadmaps, you will obtain the 5-year emission intensity projections for your
				portfolio, compared to scenario targets. By evaluating sector-level alignment with climate scenarios,
				this section helps you understand your portfolio's positioning in key sectors for the global
				transition to a low-carbon economy.
				<br /><br />
			</div>
			<div class="analysis-intro-stats sm:col-span-3 p-0">
				<div class="exposure-stats" id="exposure-stats"></div>
			</div>
		</div>
		<div class="analysis-content grid sm:grid-cols-12" id="analysis-content">
			<div class="analysis-plots sm:col-span-10" id="analysis-plots">
				<div class="plot-trajectory-card-box p-2 sm:col-span-10">
					<div class="plot-trajectory-box grid card p-8" id="trajectory-box">
						<div class="trajectory-explanation">
							<Accordion>
								<AccordionItem>
									<svelte:fragment slot="iconClosed">
										<i class="fa-xl fa-solid fa-circle-xmark"></i>
									</svelte:fragment>
									<svelte:fragment slot="iconOpen">
										<i class="fa-xl fa-solid fa-circle-info"></i>
									</svelte:fragment>
									<svelte:fragment slot="summary">
										<h4 class="h4">Future production plans</h4>
									</svelte:fragment>
									<svelte:fragment slot="content">
										<p>
											The charts below present the portfolio alignment with various climate
											transition scenarios by technology, based on the <strong
												>production plans</strong
											>
											of the companies in the portfolio. This analysis applies to sectors with well-defined
											technology decarbonization roadmaps, including
											<strong>power, fossil fuels,</strong>
											and <strong>automotive</strong>. The analysis looks at a
											<strong>5-year horizon</strong>, comparing companies’ planned production
											trajectories with those outlined in climate scenarios. The results are
											benchmarked against market indices to help assess potential risks and
											opportunities for alignment with climate goals.
											<br />
											Note that the scenarios vary in their assumptions about the pace of technological
											change, ranging from rapid to gradual shifts. For more details, refer to the
											<a
												class="anchor"
												href="https://pacta.rmi.org/wp-content/uploads/2024/11/202410_P4I_scenario_document.pdf"
												>PACTA for Investors Scenario Document</a
											>.
										</p>
									</svelte:fragment>
								</AccordionItem>
							</Accordion>
						</div>
						<div class="trajectory-plot" id="trajectory-plot"></div>
					</div>
				</div>
				<div class="other-sector-plots-box grid sm:grid-cols-6">
					<div class="techmix-plot-card-box p-2 sm:col-span-3">
						<div class="techmix-plot-box sm:col-span-3 card p-8">
							<div class="techmix-explanation">
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="iconClosed">
											<i class="fa-xl fa-solid fa-circle-xmark"></i>
										</svelte:fragment>
										<svelte:fragment slot="iconOpen">
											<i class="fa-xl fa-solid fa-circle-info"></i>
										</svelte:fragment>
										<svelte:fragment slot="summary">
											<h4 class="h4">Current and Future technology breakdown</h4>
										</svelte:fragment>
										<svelte:fragment slot="content">
											<p>
												In sectors with established low-carbon alternatives, it is valuable to
												examine how the <strong>technology mix</strong> evolves over the next five years.
												This comparison helps gauge how the portfolio’s technology distribution aligns
												with future decarbonization goals. In the long term, low-carbon technologies
												will play a more critical role than high carbon technologies.
											</p>
										</svelte:fragment>
									</AccordionItem>
								</Accordion>
							</div>
							<div class="techmix-plot" id="techmix-plot"></div>
						</div>
					</div>
					<div class="emission-intensity-card-box p-2 sm:col-span-3">
						<div class="emission-intensity-plot-box sm:col-span-3 card p-8">
							<div class="emission-intensity-explanation">
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="iconClosed">
											<i class="fa-xl fa-solid fa-circle-xmark"></i>
										</svelte:fragment>
										<svelte:fragment slot="iconOpen">
											<i class="fa-xl fa-solid fa-circle-info"></i>
										</svelte:fragment>
										<svelte:fragment slot="summary">
											<h4 class="h4">Alignment of emission intensities</h4>
										</svelte:fragment>
										<svelte:fragment slot="content">
											<p>
												The emission intensities metric tracks changes in <strong
													>emissions intensity</strong
												>
												over time, comparing the current trajectory of the portfolio with the emission
												reduction paths outlined in climate scenarios. It's a key measure for sectors
												like cement, steel, and aviation, where decarbonization relies on improving efficiency
												and investing in R&D. This metric helps investors understand how companies are
												progressing toward carbon neutrality and assess their potential for future alignment
												with decarbonization goals.
												<br />
											</p>
										</svelte:fragment>
									</AccordionItem>
								</Accordion>
							</div>
							<div class="emission-intensity-plot" id="emission-intensity-plot"></div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="alert-message sm:col-span-10 bg-warning-300 border-t border-b border-warning-700 text-warning-900 px-4 py-3 hidden"
				role="alert"
				id="alert-message-parameters"
			>
				<p class="font-bold">No data found for the parameter selection</p>
				<p class="text-sm">
					Please make a different selecion in the parameters panel or change the asset class or
					sector.
				</p>
			</div>
			<div class="parameters-box p-2 sm:col-span-2">
				<div class="analysis-parameters sm:col-span-2 p-8 card">
					<h4 class="h4">Parameters</h4>
					<br />
					<label class="label">
						<span id="scenario-source-label">Scenario source &#9432</span>
						<div class="hide dashboard-tooltip card p-4 shadow-xl">
							Applies to the technology mix and production volume alignment plots.
						</div>
						<select class="select variant-outline-surface" id="scenario_source_selector">
							<option value="Not_selected">Please select</option>
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
						<span id="allocation-method-label">Allocation method &#9432</span>
						<div class="hide dashboard-tooltip card p-4 shadow-xl">
							Applies to the production volume alignment and emission intensity plots.
						</div>
						<select class="select variant-outline-surface" id="allocation_method_selector">
							<option value="Not_selected">Please select</option>
						</select>
					</label>
					<label class="label">
						<span id="equity-market-label">Equity market &#9432</span>
						<div class="hide dashboard-tooltip card p-4 shadow-xl">
							Applies to the production volume alignment and the technology mix plots.
						</div>
						<select class="select variant-outline-surface" id="equity_market_selector">
							<option value="Not_selected">Please select</option>
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
</div>

<div
	class="alert-message bg-warning-300 border-t border-b border-warning-700 text-warning-900 px-4 py-3 hidden"
	role="alert"
	id="alert-message"
>
	<p class="font-bold">No data found for this asset class / sector combination</p>
	<p class="text-sm">Please make a different selecion.</p>
</div>

<style>
	.hide {
		display: none;
	}

	#scenario-source-label:hover + .hide {
		display: inline-block;
	}

	#scenario-label:hover + .hide {
		display: inline-block;
	}

	#allocation-method-label:hover + .hide {
		display: inline-block;
	}

	#equity-market-label:hover + .hide {
		display: inline-block;
	}

	#benchmark-label:hover + .hide {
		display: inline-block;
	}
</style>
