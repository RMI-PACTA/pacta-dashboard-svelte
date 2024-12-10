<!-- src/routes/company_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import techOrder from '../json/tech_order_in_sectors.json';
	import { ExposureStatsTile } from '../js/exposure_stats.js';
	import { company_bubble } from '../js/company_bubble.js';
	import { techexposure_company } from '../js/techexposure_company.js';
	import { createErrorMessageDiv } from '../js/createErrorMessageDiv.js';
	import * as d3 from 'd3';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	onMount(async () => {
		const exposureStatsDataResponse = await fetch('data/data_exposure_stats.json');
		let exposureStatsData = await exposureStatsDataResponse.json();

		const companyBubbleDataResponse = await fetch('data/data_company_bubble.json');
		let companyBubbleData = await companyBubbleDataResponse.json();

		const companyTechmixDataResponse = await fetch('data/data_techexposure_company_companies.json');
		let companyTechmixData = await companyTechmixDataResponse.json();

		const portfolioTechmixDataResponse = await fetch(
			'data/data_techexposure_company_portfolio.json'
		);
		let portfolioTechmixData = await portfolioTechmixDataResponse.json();

		function fetchExposureStats() {
			try {
				new ExposureStatsTile(document.querySelector('#exposure-stats'), exposureStatsData);
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
		<div class="intro-text p-8">
			<h2 class="h3 text-center">Please select a sector and an asset class for the analysis</h2>
			<br />
			<p>
				The <strong>company-level analysis</strong> focuses on identifying the companies within your
				portfolio with the greatest impact on the overall climate alignment results for the
				<strong>Automotive</strong> and the <strong>Power</strong> Sectors on your listed equity and
				corporate bond investments.
				<br /><br />
				To view the company-level results, select the appropriate options from the drop-down menus below
				and click <kbd class="kbd">Go!</kbd>. If no results appear after clicking
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
	<div class="analysis p-8 grid">
		<div class="analysis-intro grid sm:grid-cols-12 p-4">
			<div class="analysis-intro-text sm:col-span-9 p-2">
				<h3 class="h3">Company-level analysis</h3>
				<p>
					This section allows you to drill down into specific companies and evaluate their role in
					driving or hindering progress towards low-carbon solutions. It highlights leaders and
					laggards in adopting low-carbon technologies, providing key insights for engagement
					strategies, investment decisions, and managing transition risks. This analysis supports
					climate-related decisions, such as investment selection, engagement, or exclusion, and
					helps shape targeted climate strategies.
					<br /><br />
				</p>
			</div>
			<div class="analysis-intro-stats sm:col-span-3">
				<div class="exposure-stats" id="exposure-stats"></div>
			</div>
		</div>
		<div class="analysis-content grid sm:grid-cols-12 p-4" id="analysis-content">
			<div class="analysis-plots sm:col-span-10 grid sm:grid-cols-6" id="analysis-plots">
				<div class="plot-bubble-card-box sm:col-span-3 p-2">
					<div class="plot-bubble-box sm:col-span-3 card p-8">
						<div class="bubble-explanation">
							<Accordion>
								<AccordionItem>
									<svelte:fragment slot="iconClosed">
										<i class="fa-xl fa-solid fa-circle-xmark"></i>
									</svelte:fragment>
									<svelte:fragment slot="iconOpen">
										<i class="fa-xl fa-solid fa-circle-info"></i>
									</svelte:fragment>
									<svelte:fragment slot="summary">
										<h4 class="h4">Company Exposure to Low- and High-Carbon Technologies</h4>
									</svelte:fragment>
									<svelte:fragment slot="content">
										<p>
											This chart illustrates the current and future technology exposure and future
											plans for climate alignment of companies in the sector. Companies on the left
											have higher exposure to high-carbon technologies, while those on the right are
											more aligned with low-carbon solutions.
											<br /><br />
											It also compares each company's plans for expanding low-carbon technologies against
											the selected climate scenario. Companies lower on the chart have smaller planned
											investments in low-carbon tech, while those higher up have larger planned expansions.
											<br /><br />
											The size of the dots reflects each company's influence on the portfolio’s overall
											climate alignment, with larger dots representing companies with greater weight.
										</p>
									</svelte:fragment>
								</AccordionItem>
							</Accordion>
						</div>
						<div class="bubble-plot" id="bubble-plot"></div>
					</div>
				</div>
				<div class="plot-techmix-card-box sm:col-span-3 p-2">
					<div class="plot-techmix sm:col-span-3 card p-8">
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
										<h4 class="h4">Future technology mix</h4>
									</svelte:fragment>
									<svelte:fragment slot="content">
										<p>
											This section presents the <strong>most significant companies</strong> in your
											portfolio, based on their weight, within the <strong>Power</strong> and
											<strong>Automotive</strong>
											sectors. For each company, we show its future <strong>technology mix</strong>.
											<br /> <br />
											By understanding the <strong>technology breakdown</strong> of these key
											companies, you can assess how their planned production activities contribute
											to the overall
											<strong>climate alignment</strong>
											of the portfolio. This analysis supports
											<strong>transition risk management</strong>
											and helps inform <strong>engagement strategies</strong> for companies that may
											need to accelerate their transition to low-carbon solutions.
										</p>
									</svelte:fragment>
								</AccordionItem>
							</Accordion>
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
				<div class="analysis-parameters sm:col-span-2 card p-8">
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
