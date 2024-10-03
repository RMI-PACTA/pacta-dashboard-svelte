// src/js./trajectory_alignment.js
import * as d3 from 'd3';
import { rollups } from 'd3-array';
import '../css/plot_styles.css';

export class trajectory_alignment {
	constructor(container, data) {

		class trajectory_alignment_per_technology {
			constructor(containerTech, dataTech, selected_benchmark) {

				let containerTechSelected = d3.select(containerTech);

				const svg = containerTechSelected
					.append('svg')
					.attr('width', width)
					.attr('height', height)
					.attr('viewBox', [0, 0, width, height])
					.attr('preserveAspectRatio', 'xMinYMin meet')
					.attr('style', 'max-width: 100%; height: auto;');
				
				// Declare the x scale
				const x = d3
				.scaleTime()
				.range([0, width])
				.clamp(true)
				.domain(d3.extent(dataTech, (d) => d.date));

				let y = d3
				.scaleLinear()
				.range([height, 0])
				.clamp(true);
			
				svg
				.append('svg:defs')
				.append('svg:marker')
				.attr('id', 'arrow')
				.attr('viewBox', '0 0 10 10')
				.attr('refX', 5)
				.attr('refY', 5)
				.attr('markerWidth', 6)
				.attr('markerHeight', 6)
				.attr('orient', 'auto-start-reverse')
				.append('svg:path')
				.attr('d', 'M 0 0 L 10 5 L 0 10 z');

				let production_data = dataTech.filter((d) => !d.benchmark && d.scenario == 'production');
					if (production_data.length == 0) {
						containerTech.querySelector('svg').innerHTML = '';
						return;
					}

				let benchmark_data = dataTech.filter(d => d.portfolio_name_translation == selected_benchmark);
				if (benchmark_data.length == 0) {
					console.log(
						'No benchmark data available for selected combination of benchmark, allocation method, equity market and scenario source. Try changing the selection.'
					);
				}

				let areadata = dataTech.filter((d) => !d.benchmark);
				dataTech = dataTech.filter(
					(d) => !d.benchmark || d.portfolio_name_translation == selected_benchmark
				);
				if (subddataTechata.length == 0) {
					containerTech.querySelector('svg').innerHTML = '';
					return;
				}

				let production_line_grp = svg.append('g').attr('class', 'production_line_grp');

				let xaxis_grp = svg
					.append('g')
					.attr('class', 'xaxis')
					.attr('transform', 'translate(0,' + height + ')');
				let yaxis_grp = svg.append('g').attr('class', 'yaxis');

				let yaxislabel_grp = svg.append('g').attr('class', 'yaxislabel');

				let area_paths_grp = svg.append('g').attr('class', 'area_paths');

				let benchmark_line_grp = svg.append('g').attr('class', 'benchmark_line_grp');

// 			let unit = d3.map(production_data, (d) => d.unit_translation).keys()[0];

// 			var sumstat = d3
// 				.nest()
// 				.key((d) => d.scenario)
// 				.entries(areadata)
// 				.sort((d) => d.key == 'production');

// 			let descending = direction(selected_tech_org);

// 			function format_axis(value_var) {
// 				if (value_var == 'ratio') {
// 					return d3.format('.0%');
// 				} else if (value_var == 'prcnt_chg') {
// 					return d3.format('.0%');
// 				} else {
// 					return d3.format('.2s');
// 				}
// 			}

// 			let benchmark_extent;
// 			let scale_factor;
// 			if (benchmark_data.length > 0) {
// 				scale_factor = production_data[0].value / benchmark_data[0].value;
// 				benchmark_extent = d3.extent(benchmark_data, (d) => d[value_var] * scale_factor);
// 			} else {
// 				benchmark_extent = null;
// 			}
// 			let production_extent = d3.extent(production_data, (d) => d[value_var]);
// 			let areadata_extent = d3.extent(areadata, (d) => d[value_var]);
// 			y.domain(d3.extent([benchmark_extent, production_extent, areadata_extent].flat())).nice();

// 			const num_of_years =
// 				1 + Math.abs(x.domain().reduce((a, b) => a.getFullYear() - b.getFullYear()));

// 			areas
// 			let area_paths = chart_group.select('g.area_paths');
// 			area_paths.selectAll('*').remove();

// 			if (descending) {
// 				sumstat.sort((a, b) =>
// 					b.values.filter((d) => d.year == end_year)[0].value >
// 					a.values.filter((d) => d.year == end_year)[0].value
// 						? 1
// 						: -1
// 				);
// 			} else {
// 				sumstat.sort((a, b) =>
// 					b.values.filter((d) => d.year == end_year)[0].value >
// 					a.values.filter((d) => d.year == end_year)[0].value
// 						? -1
// 						: 1
// 				);
// 			}

// 			var area = d3
// 				.area()
// 				.x((d) => x(d.date))
// 				.y0(descending ? height : 0)
// 				.y1((d) => y(d[value_var]));
// 			area_paths_grp
// 				.append('rect')
// 				.attr('class', 'worse')
// 				.attr('x', 0)
// 				.attr('y', 0)
// 				.attr('width', width)
// 				.attr('height', height)
// 				.style('fill', color('worse'));

// 			area_paths = area_paths_grp
// 				.selectAll('.area')
// 				.data(sumstat.filter((d) => d.key != 'production'));

// 			area_paths
// 				.enter()
// 				.append('path')
// 				.attr('class', (d) => 'area ' + d.key)
// 				.attr('d', (d) => area(d.values))
// 				.style('fill', (d) => color(d.key));

// 			axes
// 			let tick_labels = d3
// 				.map(subdata, (d) => d.year)
// 				.keys()
// 				.slice(0, Math.min(num_of_years, 5) + 1);
// 			tick_labels[0] = '31-Dec-' + tick_labels[0] + '*';
// 			xaxis_grp.call(
// 				d3
// 					.axisBottom(x)
// 					.ticks(Math.min(num_of_years, 5))
// 					.tickFormat((d, i) => tick_labels[i])
// 			);
// 			yaxis_grp.call(d3.axisLeft(y).ticks(8).tickFormat(format_axis(value_var)));

// 			y-axis label
// 			yaxislabel_grp.selectAll('text').remove();

// 			yaxislabel_grp
// 				.append('text')
// 				.attr('class', 'yaxislabel')
// 				.attr('transform', 'rotate(-90)')
// 				.attr('y', 0 - margin.left)
// 				.attr('x', 0 - height / 2)
// 				.attr('dy', '1em')
// 				.style('text-anchor', 'middle')
// 				.style('alignment-baseline', 'bottom')
// 				.text(selected_tech + ytitle + unit);

// 			production line
// 			let production_line = d3
// 				.line()
// 				.x((d) => x(d.date))
// 				.y((d) => y(+d[value_var]));
// 			production_line_grp.selectAll('path').remove();
// 			production_line_grp.selectAll('.dot').remove();

// 			production_line_grp
// 				.append('path')
// 				.attr('class', 'production_line')
// 				.attr('stroke-width', 1.5)
// 				.attr('fill', 'none')
// 				.attr('stroke', 'black')
// 				.attr('d', (d) => production_line(production_data));

// 			let dots_production = production_line_grp
// 				.selectAll('.dot')
// 				.data(production_data)
// 				.enter()
// 				.append('circle')
// 				.attr('class', 'dot')
// 				.attr('r', 2.5)
// 				.style('stroke', '#000')
// 				.style('fill', '#000')
// 				.attr('cx', (d) => x(d.date))
// 				.attr('cy', (d) => y(+d[value_var]))
// 				.on('mouseover', mouseover)
// 				.on('mousemove', mousemove)
// 				.on('mouseout', mouseout);
			}
		}

		let container_div;

		if (typeof container === 'string') {
			container_div = document.querySelector(container);
		} else {
			container_div = container;
		}

		container_div.innerHTML = '';

		d3.select(container_div).attr('chart_type', 'trajectory_alignment');
	
		container_div.classList.add('d3chart');
		container_div.classList.add('trajectory_alignment_chart');
		d3.select(container_div).attr('constructor_name', 'trajectory_alignment');
		container_div.classList.add('chart_container');

		this.container = d3.select(container_div);

		// Declare the chart dimensions and margins.
		const width = 1200;
		const height = 650;
		const marginTop = 50;
		const marginRight = 50;
		const marginBottom = 200;
		const marginLeft = 200;

		// Create the svg container
		const svg = this.container
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('style', 'max-width: 100%; height: auto;');

 		const scenarios_to_include = [
						'STEPS',
						'APS',
						'SDS',
						'NZE_2050',
						'CurPol',
						'NDC-LTS',
						'1.5C-Unif',
						'ETP_SDS',
						'NZE',
						'IPR FPS 2021',
						'1.5C',
						'NDC_LTS',
						'Reference',
						'1.5\xb0C'
					];
 			let ytitle = ' production in ',
 			portfolio_label = 'Portfolio',
 			benchmark_label = 'Benchmark',
 			label_dots_legend = { top: 'Yearly production', bottom: 'volume' },
 			footnote = '* start date of the analysis',
 			hoverover_value_label = '(Planned) yearly production: ';

// 		settings
// 		const margin = { top: 20, right: 180, bottom: 80, left: 70 };
// 		let width = ttl_width - margin.left - margin.right;
// 		let height = ttl_height - margin.top - margin.bottom;

 		// parse year to date
 		data.forEach((d) => (d.date = d3.timeParse('%Y')(d.year)));
	
		// filter data
		let selected_class = document.querySelector('#asset_class_selector').value,
			selected_sector = document.querySelector('#sector_selector').value,
			selected_source = document.querySelector('#scenario_source_selector').value,
			selected_benchmark = document.querySelector('#benchmark_selector').value,
			selected_allocation = document.querySelector('#allocation_method_selector').value,
 			selected_market = document.querySelector('#equity_market_selector').value;

 		let subdata = data
		.filter((d) => d.asset_class == selected_class)
		.filter((d) => d.ald_sector == selected_sector)
		.filter((d) => d.scenario_source == selected_source)
		.filter((d) => d.this_portfolio | (d.portfolio_name == selected_benchmark))
		.filter((d) => d.allocation_translation == selected_allocation)
		.filter((d) => d.equity_market_translation == selected_market)

		let end_year = d3.max(
			d3
				.map(
					subdata.filter((d) => d.scenario == 'production'),
					(d) => d.year
				)
			.keys()
		); // set the end_year to last year of production data

		subdata = subdata.filter((d) => d.year <= end_year);

 		if (subdata.length == 0) {
			container_div.querySelector('svg').innerHTML = '';
			return;
 		}

		const tooltip = d3
			.select(container_div)
			.append('div')
			.attr('class', 'd3tooltip')
			.style('display', 'none');

		let legend_order = getLegendOrder(selected_source);
		let color = getColourScale(selected_source);

		let technologyPlotsGroupDiv = document.createElement('div');
		technologyPlotsGroupDiv.classList = 'volume-trajectory-plots grid sm:grid-cols-12 p-4';
		document.querySelector('svg').appendChild(technologyPlotsGroupDiv);
		d3.select(technologyPlotsGroupDiv)
					.append('g')
					.attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

		let technology = 'NuclearCap';
		let technologyDiv = document.createElement('div');
		technologyDiv.id = 'subchartDiv1';
		technologyDiv.classList = 'sm:col-span-4';
		technologyPlotsGroupDiv.appendChild(technologyDiv);

		let subdataTech = subdata.filter(d => d.technology == technology);

		new trajectory_alignment_per_technology(document.querySelector('#subchartDiv1'), subdataTech, selected_benchmark);

		
// 		let legend_grp = chart_group
// 			.append('g')
// 			.attr('transform', 'translate(' + (width + 10) + ',0)')
// 			.attr('class', 'legend_grp');

// 		let footnote_group = chart_group
// 			.append('g')
// 			.attr('class', 'footnote')
// 			.attr(
// 				'transform',
// 				'translate(' + (width + margin.left) + ',' + (height + margin.bottom / 2) + ')'
// 			);

// 		function filter_data_class_tech(data) {
// 			let selected_class = class_selector.value;
// 			let selected_tech = tech_selector.value;

// 			let subdata = data.filter((d) => d.asset_class_translation == selected_class);
// 			subdata = subdata.filter(
// 				(d) => scenarios_to_include.concat('production').indexOf(d.scenario) >= 0
// 			);
// 			subdata = subdata.filter((d) => d.technology_translation == selected_tech);

// 			return subdata;
// 		}

		function mouseover(d) {
			tooltip
				.html(
					portfolio_label +
						'<br>' +
						hoverover_value_label +
						d3.format('.2f')(d.value) +
						' ' +
						d.unit_translation
				)
				.style('display', 'inline-block')
				.style('left', d3.event.pageX + 10 + 'px')
				.style('top', d3.event.pageY - 20 + 'px');
		}

		function mousemove() {
			tooltip.style('left', d3.event.pageX + 10 + 'px').style('top', d3.event.pageY - 20 + 'px');
		}

		function mouseout() {
			tooltip.style('display', 'none');
		}

// 		function update() {

// 			legend
// 			let box_height = 30;
// 			let box_width = 75;

// 			let legend_data = sumstat.filter((d) => d.key != 'production');
// 			legend_data = [{ key: 'worse' }].concat(legend_data);

// 			legend_data.sort((a, b) => legend_order.indexOf(a.key) - legend_order.indexOf(b.key));

// 			legend_grp.selectAll('*').remove();

// 			let legend_box = legend_grp.selectAll(null).data(legend_data);
// 			legend_box
// 				.enter()
// 				.append('rect')
// 				.attr('x', 0)
// 				.attr('y', (d, i) => i * box_height)
// 				.attr('width', box_width)
// 				.attr('height', box_height)
// 				.style('fill', (d) => color(d.key));

// 			legend_box
// 				.enter()
// 				.append('text')
// 				.attr('x', box_width + 8)
// 				.attr('y', (d, i) => i * box_height)
// 				.style('display', (d, i) => (i == 0 ? 'none' : 'inline'))
// 				.style('text-anchor', 'start')
// 				.style('alignment-baseline', 'central')
// 				.style('font-size', '0.8em')
// 				.text((d) => d.key);

// 			legend_box
// 				.enter()
// 				.append('line')
// 				.attr('x1', 0)
// 				.attr('y1', (d, i) => i * box_height)
// 				.attr('x2', box_width + 3)
// 				.attr('y2', (d, i) => i * box_height)
// 				.attr('marker-end', 'url(#arrow)')
// 				.style('stroke', 'black')
// 				.style('stroke-width', 1)
// 				.style('display', (d, i) => (i == 0 ? 'none' : 'inline'));

// 			legend_box
// 				.data([portfolio_label, benchmark_label])
// 				.enter()
// 				.append('text')
// 				.attr('transform', 'translate(0,' + legend_data.length * box_height + ')')
// 				.attr('x', 31)
// 				.attr('y', (d, i) => i * box_height + box_height / 2)
// 				.style('text-anchor', 'start')
// 				.style('alignment-baseline', 'central')
// 				.style('font-size', '0.8em')
// 				.text((d) => d);

// 			legend_box
// 				.data([portfolio_label, benchmark_label])
// 				.enter()
// 				.append('line')
// 				.attr('transform', 'translate(0,' + legend_data.length * box_height + ')')
// 				.attr('x1', 0)
// 				.attr('y1', (d, i) => i * box_height + box_height / 2)
// 				.attr('x2', 26)
// 				.attr('y2', (d, i) => i * box_height + box_height / 2)
// 				.style('stroke', 'black')
// 				.style('stroke-width', 1.5)
// 				.style('stroke-dasharray', (d, i) => (i == 0 ? 'none' : '2,2'));

// 			legend_box
// 				.data([portfolio_label, benchmark_label])
// 				.enter()
// 				.append('circle')
// 				.attr('transform', 'translate(0,' + legend_data.length * box_height + ')')
// 				.attr('r', 2.5)
// 				.style('stroke', '#000')
// 				.style('fill', '#000')
// 				.attr('cx', 13)
// 				.attr('cy', (d, i) => i * box_height + box_height / 2);

// 			legend_box
// 				.data([1])
// 				.enter()
// 				.append('circle')
// 				.attr('transform', 'translate(0,' + (legend_data.length + 1) * box_height + ')')
// 				.attr('r', 2.5)
// 				.style('stroke', '#000')
// 				.style('fill', '#000')
// 				.attr('cx', 13)
// 				.attr('cy', box_height + box_height / 2);

// 			let label_dots_legend_data = [label_dots_legend.top, label_dots_legend.bottom];

// 			legend_box
// 				.data(label_dots_legend_data)
// 				.enter()
// 				.append('text')
// 				.attr('transform', 'translate(0,' + (legend_data.length + 1) * box_height + ')')
// 				.attr('x', 31)
// 				.attr('y', (d, i) => box_height + box_height / 2 + i * (box_height / 2))
// 				.style('text-anchor', 'start')
// 				.style('alignment-baseline', 'central')
// 				.style('font-size', '0.8em')
// 				.text((d) => d);

// 			benchmark line
// 			benchmark_line_grp.selectAll('path').remove();
// 			benchmark_line_grp.selectAll('.dot').remove();

// 			if (benchmark_data.length > 0) {
// 				let benchmark_line = d3
// 					.line()
// 					.x((d) => x(d.date))
// 					.y((d) => y(+d[value_var] * scale_factor));
// 				benchmark_line_grp
// 					.append('path')
// 					.attr('class', 'benchmark_line')
// 					.attr('stroke-width', 1.5)
// 					.attr('fill', 'none')
// 					.attr('stroke', 'black')
// 					.style('stroke-dasharray', '2,2')
// 					.attr('d', (d) => benchmark_line(benchmark_data));

// 				let dots_benchmark = benchmark_line_grp
// 					.selectAll('.dot')
// 					.data(benchmark_data)
// 					.enter()
// 					.append('circle')
// 					.attr('class', 'dot')
// 					.attr('r', 2.5)
// 					.style('stroke', '#000')
// 					.style('fill', '#000')
// 					.attr('cx', (d) => x(d.date))
// 					.attr('cy', (d) => y(+d[value_var] * scale_factor));
// 			}

// 			footnote_group
// 				.selectAll(null)
// 				.data([footnote])
// 				.enter()
// 				.append('text')
// 				.attr('x', 0)
// 				.attr('y', 0)
// 				.style('text-anchor', 'end')
// 				.style('alignment-baseline', 'central')
// 				.style('font-size', '0.7em')
// 				.text((d) => d);
//		}

	function getColourScale(scenario_source) {
		switch(scenario_source) {
			case 'GECO2021':
				return d3
					.scaleOrdinal()
					.domain(['production', '1.5C-Unif', 'NDC-LTS', 'CurPol', 'worse'])
					.range(['black', '#709458', '#8db96e', '#FDF28D', '#e07b73']);
				break
			case 'WEO2021':
				return d3
				.scaleOrdinal()
				.domain(['production', 'NZE_2050', 'SDS', 'APS', 'STEPS', 'worse'])
				.range(['black', '#9cab7c', '#c3d69b', '#FFFFCC', '#fde291', '#e07b73']);
				break;
			case 'GECO2022':
				return d3
				.scaleOrdinal()
				.domain(['production', '1.5C', 'NDC_LTS', 'Reference', 'worse'])
				.range(['black', '#9cab7c', '#c3d69b', '#FFFFCC', '#e07b73']);
				break;
			case 'ISF2021':
				return d3
				.scaleOrdinal()
				.domain(['production', 'NZE', 'worse'])
				.range(['black', '#9cab7c', '#e07b73']);
				break;
			case 'WEO2022':
				return d3
				.scaleOrdinal()
				.domain(['production', 'NZE_2050', 'APS', 'STEPS', 'worse'])
				.range(['black', '#9cab7c', '#FFFFCC', '#fde291', '#e07b73']);
				break;
			case 'GECO2023':
				return d3
				.scaleOrdinal()
				.domain(['production', '1.5C', 'NDC-LTS', 'Reference', 'worse'])
				.range(['black', '#9cab7c', '#c3d69b', '#FFFFCC', '#e07b73']);
				break;
			case 'ISF2023':
				return d3
				.scaleOrdinal()
				.domain(['production', '1.5\xb0C', 'worse'])
				.range(['black', '#9cab7c', '#e07b73']);
				break;
			case 'WEO2023':
				return d3.scaleOrdinal()
				.domain(["production", "NZE_2050", "APS", "STEPS", "worse"])
				.range(["black", "#9cab7c", "#FFFFCC", "#fde291", "#e07b73"]);
			break;
			default:
				return d3.scaleOrdinal()
				.domain(["production", "ETP_SDS", "NZE", "IPR FPS 2021", "worse"])
				.range(["black", "#9cab7c", "#9cab7c", "#9cab7c", "#e07b73"])
		}
	}

	function getLegendOrder(scenarioSource) {
		let legendOrder;
		if (scenarioSource == 'GECO2021') {
			legendOrder = ['worse', 'CurPol', 'NDC-LTS', '1.5C-Unif'];
		} else if (scenarioSource == 'WEO2021') {
			legendOrder = ['worse', 'STEPS', 'APS', 'SDS', 'NZE_2050'];
		} else if (scenarioSource == 'GECO2022') {
			legendOrder = ['worse', 'Reference', 'NDC_LTS', '1.5C'];
		} else if (scenarioSource == 'ISF2021') {
			legendOrder = ['worse', 'NZE'];
		} else if (scenarioSource == 'WEO2022') {
			legendOrder = ['worse', 'STEPS', 'APS', 'NZE_2050'];
		} else if (scenarioSource == 'WEO2023') {
			legendOrder = ['worse', 'STEPS', 'APS', 'NZE_2050'];
		} else if (scenarioSource == 'GECO2023') {
			legendOrder = ['worse', 'Reference', 'NDC-LTS', '1.5C'];
		} else if (scenarioSource == 'ISF2023') {
			legendOrder = ['worse', '1.5\xb0C'];
		} else {
			legendOrder = ['worse', 'IPR FPS 2021', 'NZE', 'ETP_SDS'];
		}
		return legendOrder
	}
		// TODO: refactor to shorter
		function direction(tech) {
				switch (tech) {
					case 'Oil':
						return true;
						break;
					case 'Coal':
						return true;
						break;
					case 'Gas':
						return true;
						break;
					case 'Electric':
						return false;
						break;
					case 'Hybrid':
						return false;
						break;
					case 'ICE':
						return true;
						break;
					case 'CoalCap':
						return true;
						break;
					case 'GasCap':
						return true;
						break;
					case 'HydroCap':
						return false;
						break;
					case 'NuclearCap':
						return false;
						break;
					case 'OilCap':
						return true;
						break;
					case 'RenewablesCap':
						return false;
						break;
					case 'FuelCell':
						return false;
						break;
					default:
						console.log('undefined tech:', tech);
				}
			}
	}
}
