<!-- src/routes/portfolio_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import techOrder from '../json/tech_order_in_sectors.json';
	import { PieExploded } from '../js/pie_exploded.js';
	import { techexposure } from '../js/techexposure';
	import { tabulateIntoIncludedTable } from '../js/included_table.js';
	import { createErrorMessageDiv } from '../js/createErrorMessageDiv.js';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	onMount(async () => {
		const tableDataResponse = await fetch('data/data_included_table.json');
		let tableData = await tableDataResponse.json();

		const bondsValuePieDataResponse = await fetch('data/data_value_pie_bonds.json');
		let bondsValuePieData = await bondsValuePieDataResponse.json();

		const equityValuePieDataResponse = await fetch('data/data_value_pie_equity.json');
		let equityValuePieData = await equityValuePieDataResponse.json();

		const bondsEmissionsPieDataResponse = await fetch('data/data_emissions_pie_bonds.json');
		let bondsEmissionsPieData = await bondsEmissionsPieDataResponse.json();

		const equityEmissionsPieDataResponse = await fetch('data/data_emissions_pie_equity.json');
		let equityEmissionsPieData = await equityEmissionsPieDataResponse.json();

		const techmixDataResponse = await fetch('data/data_techexposure.json');
		let techmixData = await techmixDataResponse.json();

		function fetchValuePie() {
			try {
				new PieExploded(
					document.querySelector('#valuePieBonds'),
					bondsValuePieData,
					'USD',
					"of assets' value covered by PACTA sectors",
					'Corporate bonds portion of the portfolio [% market value]'
				);
			} catch (err) {
				console.error('Error fetching value pie for bonds', err);
				document.querySelector('#valuePieBonds').innerHTML = '';
				document.querySelector('#valuePieBonds').appendChild(createErrorMessageDiv());
			}
			try {
				new PieExploded(
					document.querySelector('#valuePieEquity'),
					equityValuePieData,
					'USD',
					"of assets' value covered by PACTA sectors",
					'Listed equity portion of the portfolio [% market value]'
				);
			} catch (err) {
				console.error('Error fetching value pie for equity', err);
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
					"of assets' emissions covered by PACTA sectors",
					'Corporate bonds portion of the portfolio [% CO2 emissions]'
				);
			} catch (err) {
				console.error('Error fetching emissions pie for bonds', err);
				document.querySelector('#emissionsPieBonds').innerHTML = '';
				document.querySelector('#emissionsPieBonds').appendChild(createErrorMessageDiv());
			}
			try {
				new PieExploded(
					document.querySelector('#emissionsPieEquity'),
					equityEmissionsPieData,
					'tonnes CO<sub>2</sub> emissions',
					"of assets' emissions covered by PACTA sectors",
					'Listed equity portion of the portfolio [% CO2 emissions]'
				);
			} catch (err) {
				console.error('Error fetching emissions pie for equity', err);
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
				console.error('Error fetching techmix for bonds', err);
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
				console.error('Error fetching techmix for equity', err);
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
				};
				tabulateIntoIncludedTable(tableData, '#includedTable', opts_table);
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
		<div class="analysis-intro grid sm:grid-cols-12">
			<div class="analysis-intro-text sm:col-span-12 p-4">
				<h3 class="h3">Portfolio-Level Overview</h3>
				<br />
				<p>
					This section provides an overview of your portfolio's exposure to key climate-relevant
					sectors, asset classes, and emissions. It answers essential questions about the scope of
					the PACTA analysis, helping you assess the breadth and depth of climate-related metrics
					across your portfolio.
					<br /> <br />
					You can hover over the graphs to get more in-depth insights of your portfolio-level analysis.
					<br /> <br />
					Key features in this section:
				</p>
				<br />
				<ul class="list-disc">
					<li>
						<strong>Scope of Analysis</strong>: Understand which holdings are included in the
						assessment and if it is a direct or indirect investment.
					</li>
					<li>
						<strong>Sector Coverage</strong>: First overview of the exposure to climate-relevant
						sectors and their technologies, as a share of the AUM (assets under management) of the
						portfolio
					</li>
					<li>
						<strong>Emissions Coverage</strong>: Get an estimate of how much of your portfolio’s
						emissions are addressed in the analysis, as well as an overview of your portfolio
						absolute emissions.
					</li>
				</ul>
				<br />
			</div>
		</div>
		<div class="analysis-content grid sm:grid-cols-12 p-4">
			<div class="analysis-table-explanation sm:col-span-12 card p-8">
				<Accordion>
					<AccordionItem>
						<svelte:fragment slot="lead">(icon)</svelte:fragment>
						<svelte:fragment slot="summary">
							<h4 class="h4">Asset classes covered by the analysis</h4>
						</svelte:fragment>
						<svelte:fragment slot="content">
							<p>
								This analysis focuses on asset classes with a direct and measurable impact on the
								real economy, specifically investments in <strong>listed equities</strong> and
								<strong>corporate bonds</strong> on the secondary market. These asset classes
								represent the most accessible and reliable data sources for understanding portfolio
								alignment with climate transition goals.
								<br /> <br />
								From the total market value of the portfolio, <strong>[X]%</strong> is allocated to
								equity investments, and <strong>[Y]%</strong> is allocated to corporate bonds.
							</p>
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
				<div class="table-box sm:col-span-12">
					<div class="table table-hover" id="includedTable"></div>
				</div>
			</div>
		</div>
		<div class="analysis-pie grid sm:grid-cols-12 p-4">
			<div class="analysis-pie-box sm:col-span-12 card p-8">
				<div class="analysis-pies-explanation sm:col-span-12">
					<Accordion>
						<AccordionItem>
							<svelte:fragment slot="lead">(icon)</svelte:fragment>
							<svelte:fragment slot="summary">
								<h4 class="h4">
									Sector Coverage by Assets Under Management and Absolute CO<sub>2</sub> Emissions
								</h4>
							</svelte:fragment>
							<svelte:fragment slot="content">
								<p>
									The <strong>PACTA for Investors</strong> analysis focuses on listed equity and
									corporate bond holdings in key climate-relevant sectors, including
									<strong
										>oil and gas, coal, automotive, power generation, cement, steel, and aviation</strong
									>, and <strong>aviation</strong>. These sectors meet three criteria: they are
									major contributors to global GHG emissions, have available scenario benchmarks for
									transition expectations, and provide sufficient data for analysis.
									<br /> <br />
									Sectors like <strong>agriculture, forestry, aluminum, paper, and glass</strong>
									are excluded due to limited asset-level or scenario data.
									<br /><br />
									While the PACTA analysis centers on sectoral alignment through production capacity,
									estimating
									<strong>absolute CO2 emissions</strong> associated with a portfolio can provide
									additional insights into the relative importance of each sector in the
									decarbonization of the portfolio.
									<br /><br />
									The charts below provide an overview of the portfolio’s exposure to
									<strong>PACTA sectors</strong>, as well as the
									<strong> emissions</strong> associated with those sectors.
								</p>
							</svelte:fragment>
						</AccordionItem>
					</Accordion>
				</div>
				<div class="analysis-pies-box grid sm:grid-cols-12 card p-4">
					<div class="pie-value-bonds sm:col-span-6" id="valuePieBonds"></div>
					<div class="pie-value-equity sm:col-span-6" id="valuePieEquity"></div>
					<div class="pie-emissions-bonds sm:col-span-6" id="emissionsPieBonds"></div>
					<div class="pie-emissions-equity sm:col-span-6" id="emissionsPieEquity"></div>
				</div>
				Comparing these charts allows you to assess the relative climate relevance of different sectors
				in your portfolio. For example, while
				<strong>PACTA sectors</strong> may represent
				<strong>[X]%</strong>
				of the equity portfolio's market value and <strong>[Y]%</strong> of the corporate bond
				portfolio's market value, they are responsible for <strong>[Z]%</strong> and
				<strong>[W]%</strong>
				of the portfolio's <strong>absolute CO<sub>2</sub> emissions</strong> in equity and corporate
				bonds, respectively.
			</div>
		</div>
		<div class="analysis-exposures grid sm:grid-cols-12 p-4">
			<div class="analysis-exposure-box sm:col-span-12 card p-8">
				<div class="analysis-exposures-explanation sm:col-span-12">
					<Accordion>
						<AccordionItem>
							<svelte:fragment slot="lead">(icon)</svelte:fragment>
							<svelte:fragment slot="summary">
								<h4 class="h4">Exposure to climate-relevant sectors and technologies</h4>
							</svelte:fragment>
							<svelte:fragment slot="content">
								<p>
									Within each climate-relevant sector, different technologies play varying roles in
									the transition to a low-carbon economy. Understanding your portfolio’s exposure to
									the sector and the associated technologies is critical for assessing both <strong
										>transition risks</strong
									>
									and <strong>investment opportunities</strong> in the context of climate change.
									<br />
									The following chart visualizes the portfolio's exposure to the different sectors and
									technologies, compared to the relevant benchmarks.
								</p>
							</svelte:fragment>
						</AccordionItem>
					</Accordion>
				</div>
				<div class="analysis-exosures-box grid sm:grid-cols-12 p-4">
					<div class="exposures-bonds sm:col-span-6" id="techMixAllBonds"></div>
					<div class="exposures-equity sm:col-span-6" id="techMixAllEquity"></div>
				</div>
			</div>
		</div>
	</div>
</div>
