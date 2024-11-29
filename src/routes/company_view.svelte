<!-- src/routes/company_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import exposure_stats_data from '../json/data_exposure_stats.json';
	import companyBubbleData from '../json/data_company_bubble.json';
	import companyTechmixData from '../json/data_techexposure_company_companies.json';
	import portfolioTechmixData from '../json/data_techexposure_company_portfolio.json';
	import techOrder from '../json/tech_order_in_sectors.json';
	import { ExposureStatsTile } from '../js/exposure_stats.js';
	import { company_bubble } from '../js/company_bubble.js';
	import { techexposure_company } from '../js/techexposure_company.js';
	import { createErrorMessageDiv } from '../js/createErrorMessageDiv.js';
	import * as d3 from 'd3';
	import { union } from 'd3-array';

	onMount(() => {
		function fetchExposureStats() {
			try {
				new ExposureStatsTile(document.querySelector('#exposure-stats'), exposure_stats_data);
			} catch {
				document.querySelector('#exposure-stats').innerHTML = '';
				document.querySelector('#exposure-stats').appendChild(createErrorMessageDiv());
			}
		}

		function fetchCompanyBubble() {
			try {
				new company_bubble(document.querySelector('#bubble-plot'), companyBubbleData);
			} catch {
				document.querySelector('#bubble-plot').innerHTML = '';
				document.querySelector('#bubble-plot').appendChild(createErrorMessageDiv());
			}
		}

		function fetchCompanyTechmix() {
			try {
				new techexposure_company(
					document.querySelector('#techmix-plot'),
					companyTechmixData,
					portfolioTechmixData,
					techOrder
				);
			} catch {
				document.querySelector('#techmix-plot').innerHTML = '';
				document.querySelector('#techmix-plot').appendChild(createErrorMessageDiv());
			}
		}

		function setValuesSectorSelectors() {
			const sectorSelectorLanding = document.querySelector('#sector_selector_landing');
			const sectorSelector = document.querySelector('#sector_selector');

			let sectorsBubble = new Set(d3.map(companyBubbleData, (d) => d.ald_sector).keys());
			let sectorsTechmix = new Set(d3.map(portfolioTechmixData, (d) => d.ald_sector).keys());
			let sectorsTechmixComp = new Set(d3.map(companyTechmixData, (d) => d.ald_sector).keys());
			let sectors = Array.from(sectorsBubble.union(sectorsTechmix).union(sectorsTechmixComp));

			sectorSelectorLanding.length = 0;
			sectorSelector.length = 0;
			sectors.forEach((sector) => sectorSelectorLanding.add(new Option(sector, sector)));
			sectors.forEach((sector) => sectorSelector.add(new Option(sector, sector)));
		}

		function setValuesAssetClassSelector() {
			const assetClassSelectorLanding = document.querySelector('#asset_class_selector_landing');
			const assetClassSelector = document.querySelector('#asset_class_selector');

			let classesBubble = new Set(d3.map(companyBubbleData, (d) => d.asset_class).keys());
			let classesTechmix = new Set(d3.map(portfolioTechmixData, (d) => d.asset_class).keys());
			let sectorsTechmixComp = new Set(d3.map(companyTechmixData, (d) => d.asset_class).keys());
			let assetClasses = Array.from(classesBubble.union(classesTechmix).union(sectorsTechmixComp));

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

			let filteredTechmixData = portfolioTechmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);

			let filteredTechmixCompData = companyTechmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);

			let filteredBubbleData = companyBubbleData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);

			let check = [filteredTechmixData, filteredTechmixCompData, filteredBubbleData].some(
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

			let filteredTechmixData = portfolioTechmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let scenarioSourcesTechMix = new Set(
				d3.map(filteredTechmixData, (d) => d.scenario_source).keys()
			);

			let filteredTechmixCompData = companyTechmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let scenarioSourcesCompTechMix = new Set(
				d3.map(filteredTechmixCompData, (d) => d.scenario_source).keys()
			);

			let filteredBubbleData = companyBubbleData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let scenarioSourcesBubble = new Set(
				d3.map(filteredBubbleData, (d) => d.scenario_source).keys()
			);

			let scenarioSources = Array.from(
				scenarioSourcesTechMix.union(scenarioSourcesCompTechMix).union(scenarioSourcesBubble)
			);

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

			let filteredTechmixData = portfolioTechmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.scenario_source == selectedSource);
			let scenariosTechMix = new Set(d3.map(filteredTechmixData, (d) => d.scenario).keys());

			let filteredTechmixCompData = companyTechmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.scenario_source == selectedSource);
			let scenariosCompTechMix = new Set(d3.map(filteredTechmixCompData, (d) => d.scenario).keys());

			let filteredBubbleData = companyBubbleData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector)
				.filter((d) => d.scenario_source == selectedSource);
			let scenariosBubble = new Set(d3.map(filteredBubbleData, (d) => d.scenario).keys());

			let scenarios = Array.from(
				scenariosTechMix.union(scenariosCompTechMix).union(scenariosBubble)
			);

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

			let filteredTechmixData = portfolioTechmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let allocationsTechMix = new Set(d3.map(filteredTechmixData, (d) => d.allocation).keys());

			let filteredTechmixCompData = companyTechmixData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let allocationsCompTechMix = new Set(
				d3.map(filteredTechmixCompData, (d) => d.allocation).keys()
			);

			let filteredBubbleData = companyBubbleData
				.filter((d) => d.asset_class == selectedClass)
				.filter((d) => d.ald_sector == selectedSector);
			let allocationsBubble = new Set(d3.map(filteredBubbleData, (d) => d.allocation).keys());

			let allocationMethods = Array.from(
				allocationsTechMix.union(allocationsCompTechMix).union(allocationsBubble)
			);

			if (allocationMethods.length != 0) {
				showAnalysisHideAlertParameters();
				const allocationMethodSelector = document.querySelector('#allocation_method_selector');
				allocationMethodSelector.length = 0;
				allocationMethods.forEach((allocation) =>
					allocationMethodSelector.add(
						new Option(capitalizeFirstLetter(allocation.replace('_', ' ')), allocation)
					)
				);
				allocationMethodSelector.options[
					Math.max(0, allocationMethods.indexOf(selectedAllocation))
				].selected = 'selected';
			} else {
				handleNoDataParameterSelection();
			}
		}

		function capitalizeFirstLetter(val) {
			return String(val).charAt(0).toUpperCase() + String(val).slice(1);
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
				document.querySelector('#content-company-view').classList.toggle('hidden');
				fetchExposureStats();
				if (checkDataAvailability()) {
					showAnalysisHideAlert();
					fetchCompanyBubble();
					fetchCompanyTechmix();
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
					fetchCompanyBubble();
					fetchCompanyTechmix();
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
					fetchCompanyBubble();
					fetchCompanyTechmix();
				} else {
					handleNoDataForAssetSectorCombination();
				}
			});
			const scenario_source_selector = document.querySelector('#scenario_source_selector');
			scenario_source_selector.addEventListener('change', function () {
				updateScenarioSelector();
				fetchCompanyBubble();
				fetchCompanyTechmix();
			});
			const scenario_selector = document.querySelector('#scenario_selector');
			scenario_selector.addEventListener('change', function () {
				fetchCompanyBubble();
				fetchCompanyTechmix();
			});
			const allocation_method_selector = document.querySelector('#allocation_method_selector');
			allocation_method_selector.addEventListener('change', function () {
				fetchCompanyBubble();
				fetchCompanyTechmix();
			});
		}

		setValuesSectorSelectors();
		setValuesAssetClassSelector();
		updateScenarioSourceSelector();
		updateScenarioSelector();
		updateAllocationMethodSelector();
		addEventListeners();
		fetchExposureStats();
		fetchCompanyBubble();
		fetchCompanyTechmix();
	});
</script>

<div class="content p-8" id="content-landing-page">
	<div class="intro-box card">
		<div class="intro-text p-4">
			<h2 class="h3 text-center">Please select a sector and an asset class for the analysis</h2>
			<br />
			<p>
				The <strong>company-level analysis</strong> focuses on identifying the companies within your
				portfolio with the greatest impact on the overall climate alignment results for the
				Automotive and the Power Sectors. This section allows you to drill down into specific
				companies and evaluate their role in driving or hindering progress towards low-carbon
				solutions. By understanding which companies are leaders or laggards in their transition to
				low-carbon technologies, this section provides valuable information for shaping engagement
				strategies, making investment decisions, and managing transition risks.
				<br /><br />
				To view the company-level results, select the appropriate options from the drop-down menus below
				and click <strong>Go!</strong>. If no results appear after clicking <strong>Go!</strong>, it
				likely means your portfolio does not have exposure to the selected sector or financial
				asset.
			</p>
		</div>
		<div class="buttons-sector-asset-class p-4 flex space-x-2 justify-center">
			<select class="select max-w-48 variant-outline-surface" id="sector_selector_landing">
				<option value="Not_selected">Please select</option>
			</select>
			<select class="select max-w-48 variant-outline-surface" id="asset_class_selector_landing">
				<option value="Not_selected">Please select</option>
			</select>
			<button class="btn variant-filled-surface" id="go_button_landing">Go!</button>
		</div>
	</div>
</div>

<div class="content p-8 hidden" id="content-company-view">
	<div class="buttons-sector-asset-class p-4 flex space-x-2 justify-center">
		<select class="select max-w-48 variant-outline-surface" id="sector_selector">
			<option value="Not_selected">Please select</option>
		</select>
		<select class="select max-w-48 variant-outline-surface" id="asset_class_selector">
			<option value="Not_selected">Please select</option>
		</select>
	</div>
	<div class="analysis p-4 grid">
		<div class="analysis-intro grid sm:grid-cols-12 p-4">
			<div class="analysis-intro-text sm:col-span-9 p-2">
				<h3 class="h3">Company-level analysis</h3>
				<p>
					The <strong>company-level analysis</strong> focuses on identifying the companies within
					your portfolio with the greatest impact on the overall climate alignment results for the
					Automotive and the Power Sectors. This section allows you to drill down into specific
					companies and evaluate their role in driving or hindering progress towards low-carbon
					solutions. By understanding which companies are leaders or laggards in their transition to
					low-carbon technologies, this section provides valuable information for shaping engagement
					strategies, making investment decisions, and managing transition risks.
					<br /><br />
					Key features in this section:
					<br /><br />
				</p>
				<ul class="list-disc">
					<li>
						<strong>Critical Players</strong>: Identify the most influential companies in your
						portfolio’s alignment with climate goals.
					</li>
					<li>
						<strong>Leaders and Laggards</strong>: Discover which companies are at the forefront of
						adopting low-carbon alternatives and which are lagging behind.
					</li>
				</ul>
				<br />
				<p>
					This analysis supports climate-related decision-making, such as engagement, investment
					selection, or exclusion, and can be used to guide the development of targeted climate
					strategies.
				</p>
			</div>
			<div class="analysis-intro-stats sm:col-span-3">
				<div class="exposure-stats" id="exposure-stats"></div>
			</div>
		</div>
		<div class="analysis-content grid sm:grid-cols-12 p-4" id="analysis-content">
			<div class="analysis-plots sm:col-span-10 grid sm:grid-cols-6" id="analysis-plots">
				<div class="plot-bubble-card-box sm:col-span-3 p-2">
					<div class="plot-bubble-box sm:col-span-3 card p-4">
						<div class="bubble-explanation">
							<h4 class="h4">
								Companies' expected alignment in low-carbon vs. current exposure to high-carbon
								technologies
							</h4>
							<p>
								This chart illustrates the current technology exposure and forward-looking plans for
								climate alignment of companies within the Power and Automotive sectors. These
								sectors feature a competitive landscape in which <strong
									>low-carbon technologies</strong
								>
								are increasingly replacing <strong>high-carbon alternatives</strong>.
							</p>
							<br /><br />
							<ul class="list-disc">
								<li>
									Companies positioned towards the
									<strong>left</strong> of the chart have a higher current exposure to
									<strong>high-carbon technologies</strong>.
								</li>
								<li>
									Companies towards the <strong>right</strong> are more aligned with
									<strong>low-carbon technologies</strong>.
								</li>
							</ul>
							<br />
							<p></p>
							This chart also compares each company's<strong
								>planned build-out of low-carbon technologies</strong
							>
							to the requirements of the selected climate scenario.
							<ul class="list-disc">
								<li>
									Companies positioned in the
									<strong>lower</strong> part of the graph have lower planned expansions of
									<strong>low-carbon technologies</strong>.
								</li>
								<li>
									Companies <strong>higher up</strong> are planning more significant investments in
									<strong>low-carbon technologies.</strong>.
								</li>
							</ul>
							<br />
							<p>
								The
								<strong>size of the data points</strong> on the chart indicates the
								<strong>importance</strong>
								of each company within the portfolio, based on its portfolio weight.
								<strong>Larger dots</strong> represent companies that have a greater influence on the
								portfolio's overall climate alignment.
							</p>
						</div>
						<div class="bubble-plot" id="bubble-plot"></div>
					</div>
				</div>
				<div class="plot-techmix-card-box sm:col-span-3 p-2">
					<div class="plot-techmix sm:col-span-3 card p-4">
						<div class="techmix-explanation">
							<h4 class="h4">
								Expected technology mix in 5 years for portfolio, scenario and key companies within
								portfolio
							</h4>
							<p>
								This section highlights the <strong>most significant companies</strong> in your
								portfolio, based on their weight, within the <strong>Power</strong> and
								<strong>Automotive</strong>
								sectors. For each company, we show its current <strong>technology mix</strong> in
								production, comparing it to the
								<strong>portfolio's future technology exposure</strong>
								and <strong>aligned exposure</strong> based on the selected climate scenario.
								<br /> <br />
								By understanding the <strong>technology breakdown</strong> of these key companies,
								you can assess how their current and planned production activities contribute to the
								overall <strong>climate alignment</strong> of the portfolio. This analysis supports
								<strong>transition risk management</strong>
								and helps inform <strong>engagement strategies</strong> for companies that may need to
								accelerate their transition to low-carbon solutions.
							</p>
						</div>
						<div class="techmix-plot" id="techmix-plot"></div>
					</div>
				</div>
			</div>
			<div
				class="alert-message sm:col-span-10 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 hidden"
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
				<div class="analysis-parameters sm:col-span-2 card p-4">
					<h4 class="h4">Parameters</h4>
					<br />
					<label class="label">
						<span>Scenario source</span>
						<select class="select variant-outline-surface" id="scenario_source_selector">
							<option value="Not_selected">Please select</option>
						</select>
					</label>
					<label class="label">
						<span>Scenario</span>
						<select class="select variant-outline-surface" id="scenario_selector">
							<option value="Not_selected">Please select</option>
						</select>
					</label>
					<label class="label">
						<span>Allocation method</span>
						<select class="select variant-outline-surface" id="allocation_method_selector">
							<option value="Not_selected">Please select</option>
						</select>
					</label>
				</div>
			</div>
		</div>
	</div>
</div>

<div
	class="alert-message bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 hidden"
	role="alert"
	id="alert-message"
>
	<p class="font-bold">No data found for this asset class / sector combination</p>
	<p class="text-sm">Please make a different selecion.</p>
</div>
