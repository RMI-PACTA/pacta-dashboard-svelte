<!-- src/routes/company_view.svelte -->
<script>
	import { onMount } from 'svelte';
	import companyBubbleData from '../json/data_company_bubble.json';
	import companyTechmixData from '../json/data_techexposure_company_companies.json';
	import portfolioTechmixData from '../json/data_techexposure_company_portfolio.json'
	import { company_bubble } from '../js/company_bubble.js';
	import { techexposure_company } from '../js/techexposure_company.js';

	onMount(() => {
		function fetchCompanyBubble() {
			new company_bubble(document.querySelector('#bubble-plot'), companyBubbleData, undefined, {
				bkg_fill: false
			});
		}
		function fetchCompanyTechmix() {
			new techexposure_company(document.querySelector('#techmix-plot'), companyTechmixData, undefined, {}, portfolioTechmixData);
		}
		function addEventListeners() {
			const go_button = document.querySelector('#go_button');
			// TODO: wire these up correctly. Doesn't make sense to spend too much time on this
			// now since we'll remove the selectors from inside the plot anyway.
			go_button.addEventListener('click', function () {
				const sector_selector = document.querySelector('#sector_selector');
				const asset_class_selector = document.querySelector('#asset_class_selector');
				const selects_asset = document.querySelectorAll(
					'companybubble_class_selector, .techexposure_class_selector'
				);
				const selects_sector = document.querySelectorAll(
					'.companybubble_group_selector, .techexposure_group_selector'
				);
				selects_asset.forEach((d) => {
					d.value = asset_class_selector.value;
					d.dispatchEvent(new Event('change'));
				});
				selects_sector.forEach((d) => {
					d.value = sector_selector.value;
					d.dispatchEvent(new Event('change'));
				});
			});
		}

		fetchCompanyBubble();
		fetchCompanyTechmix();
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
				<h3 class="h3">Current state and future predictions for companies in a sector</h3>
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
			<div class="analysis-plots sm:col-span-9 p-4 bg-yellow-300">
				<div class="plot-bubble-box grid sm:grid-cols-6 p-4 bg-orange-300">
					<div class="bubble-explanation sm:col-span-2 bg-cyan-300">
						<h4 class="h4">
							Companies’ expected alignment in low-carbon vs. high-carbon technologies
						</h4>
						<p>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
							accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
							sanctus est Lorem ipsum dolor sit amet.
						</p>
					</div>
					<div class="bubble-plot sm:col-span-4 bg-teal-300" id="bubble-plot"></div>
				</div>
				<div class="plot-techmix grid sm:grid-cols-6 p-4 bg-orange-300">
					<div class="techmix-explanation sm:col-span-2 bg-cyan-300">
						<h4 class="h4">
							Expected Technology Mix in 5 years for portfolio, scneario and selected companies
						</h4>
						<p>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
							accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
							sanctus est Lorem ipsum dolor sit amet.
						</p>
					</div>
					<div class="techmix-plot sm:col-span-4 bg-teal-300" id="techmix-plot"></div>
				</div>
			</div>
			<div class="analysis-parameters sm:col-span-3 bg-red-300 p-4">
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
			</div>
		</div>
	</div>
</div>
