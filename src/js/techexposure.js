// src/js./techexposure.js
import * as d3 from 'd3';
import '../css/plot_styles.css';

export class techexposure {
	constructor(container, data, asset_class, benchmark, tech_order) {
		let container_div;

		if (typeof container === 'string') {
			container_div = document.querySelector(container);
		} else {
			container_div = container;
		}

		container_div.innerHTML = '';

		container_div.classList.add('d3chart');
		container_div.classList.add('techexposure_chart');
		container_div.classList.add('chart_container');

		this.container = d3.select(container_div);

		// Declare the chart dimensions and margins.
		const width = 600;
		const height = 700;
		const marginTop = 20;
		const marginRight = 170;
		const marginBottom = 60;
		const marginLeft = 90;
		const bar_width = 30;
		const bar_gap = 12;
		const sector_gap = 10;
		const portfolio_label_offset = 25;
		const legend_labels_offset = 50;

		// Labels
		let port_label = 'This portfolio',
			comp_label = 'Benchmark*',
			hover_over_asset = ' of assets under management<br>',
			hover_over_sec = { before_sec: ' of ', after_sec: ' sector' },
			hover_over_low_carbon = { before_sec: 'Low-carbon ', after_sec: ' technologies' },
			lowCarbonLabel = { top: 'Low-carbon technologies', bottom: 'within a sector' };

		// Create the svg container
		const svg = this.container
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('style', 'max-width: 100%; height: auto;');

		// Filter the data
		let equity_market = 'Global Market';
		let subdata = data
			.filter((d) => d.asset_class_translation == asset_class)
			.filter((d) => d.equity_market_translation == equity_market)
			.filter((d) => (d.this_portfolio == true) | (d.portfolio_name == benchmark));

		// Sort data based on exposure and filter out sectors that do not exist in the portfolio
		let subdata_port_sorted = subdata
			.filter((d) => d.this_portfolio)
			.sort(function (x, y) {
				return d3.descending(x.cumsum + x.plan_carsten, y.cumsum + y.plan_carsten);
			});
		let sectors_sorted = d3.map(subdata_port_sorted, (d) => d.ald_sector_translation).keys();
		subdata = subdata.filter((d) => sectors_sorted.includes(d.ald_sector_translation));
		let subdata_sorted = [];
		sectors_sorted.forEach(function (item) {
			let subdata_sector = subdata.filter((d) => d.ald_sector_translation == item);
			subdata_sector.forEach(function (obj) {
				subdata_sorted.push(obj);
			});
		});

		let max_techshare_perc_aum =
			d3.max(subdata_sorted.map((d) => d.cumsum + d.plan_carsten)) * 1.05;

		// Define axes
		let y_sector = d3
			.scaleBand()
			.range([marginTop, height - marginBottom])
			.domain(sectors_sorted);

		let y_port = d3
			.scaleBand()
			.range([0, (bar_width + bar_gap) * 2])
			.domain([true, false]);

		let x = d3
			.scaleLinear()
			.range([0, width - marginRight - marginLeft])
			.domain([0, max_techshare_perc_aum])
			.nice();

		// Stacked bars
		svg
			.append('g')
			.attr('class', 'bars_group')
			.attr('transform', 'translate(' + marginLeft + ',0)')
			.selectAll('rect')
			.data(subdata_sorted)
			.enter()
			.append('rect')
			.attr('height', bar_width)
			.attr('class', 'bar')
			.attr('class', (d) => d.ald_sector + ' ' + d.technology)
			.attr('transform', (d) => 'translate(0,' + y_sector(d.ald_sector_translation) + ')')
			.attr('class', (d) => d.ald_sector + ' ' + d.technology)
			.attr('y', (d) => y_port(d.this_portfolio))
			.attr('x', (d) => x(d.cumsum))
			.attr('width', (d) => x(d.plan_carsten))
			.on('mouseover', mouseover)
			.on('mouseout', mouseout)
			.on('mousemove', mousemove);

		// Green bars
		svg
			.append('g')
			.attr('class', 'green_group')
			.attr('transform', 'translate(' + marginLeft + ',0)')
			.selectAll('rect')
			.data(subdata_sorted)
			.enter()
			.append('rect')
			.attr('class', 'green_bar')
			.attr('height', 5)
			.attr('fill', 'green')
			.attr('transform', (d) => 'translate(0,' + y_sector(d.ald_sector_translation) + ')')
			.attr('y', (d) => y_port(d.this_portfolio) + bar_width + 2)
			.attr('x', (d) => x(d.cumsum))
			.attr('width', (d) => x(d.plan_carsten))
			.attr('visibility', (d) => (d.green ? 'visible' : 'hidden'))
			.on('mouseover', mouseover_green)
			.on('mouseout', mouseout)
			.on('mousemove', mousemove);

		// Labels for sectors
		svg
			.append('g')
			.attr('class', 'sector_labels')
			.attr('transform', 'translate(' + marginLeft + ', 0)')
			.selectAll('.sector_label')
			.data(sectors_sorted)
			.enter()
			.append('text')
			.attr('class', 'sector_label')
			.style('alignment-baseline', 'bottom')
			.style('text-anchor', 'middle')
			.attr('fill', 'black')
			.attr('font-size', '10')
			.attr(
				'transform',
				(d) =>
					'translate(0,' +
					y_sector(d) +
					') ' +
					'translate(-5,' +
					(bar_width + bar_gap / 2) +
					') rotate(-90)'
			)
			.text((d) => d);

		// Bar labels
		svg
			.append('g')
			.attr('class', 'port_labels')
			.attr('transform', 'translate(' + marginLeft + ', 0)')
			.selectAll('.portfolio_label')
			.data(
				sectors_sorted
					.map((d) => {
						return [
							{ ald_sector_translation: d, this_portfolio: true },
							{ ald_sector_translation: d, this_portfolio: false }
						];
					})
					.flat()
			)
			.enter()
			.append('text')
			.attr('class', 'portfolio_label')
			.style('alignment-baseline', 'central')
			.style('text-anchor', 'end')
			.attr('fill', 'black')
			.attr('font-size', '0.7em')
			.text((d) => (d.this_portfolio ? port_label : comp_label))
			.attr(
				'transform',
				(d) =>
					'translate(-' + portfolio_label_offset + ',' + y_sector(d.ald_sector_translation) + ')'
			)
			.attr('y', (d) => y_port(d.this_portfolio) + bar_width / 2);

		// x-axis
		if (max_techshare_perc_aum >= 0.04) {
			svg
				.append('g')
				.attr('class', 'axis')
				.attr(
					'transform',
					'translate(' + marginLeft + ',' + (height - marginTop - marginBottom + 20) + ')'
				)
				.call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.0%')));
		} else {
			svg
				.append('g')
				.attr('class', 'axis')
				.attr(
					'transform',
					'translate(' + marginLeft + ',' + (height - marginTop - marginBottom + 20) + ')'
				)
				.call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.2%')));
		}

		// Footnote Benchmark
		let footnote = '*' + benchmark;
		svg
			.append('g')
			.attr('class', 'footnote')
			.attr(
				'transform',
				'translate(' + (width - marginRight) + ',' + (height - marginBottom / 4) + ')'
			)
			.selectAll(null)
			.data([footnote])
			.enter()
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'middle')
			.style('alignment-baseline', 'central')
			.style('font-size', '0.7em')
			.text((d) => d);

		// Legend
		let legend_data_unordered = subdata_sorted
			.filter((d) => d.sector_prcnt > 0)
			.map((d) =>
				(({ ald_sector, technology, ald_sector_translation, technology_translation }) => ({
					ald_sector,
					technology,
					ald_sector_translation,
					technology_translation
				}))(d)
			)
			.filter(
				(v, i, a) =>
					a.findIndex((t) => t.ald_sector === v.ald_sector && t.technology === v.technology) === i
			);

		let legend_data = orderLegendData(legend_data_unordered, tech_order);

		let unique_sectors = d3.map(legend_data, (d) => d.ald_sector_translation).keys();
		let sector_gap_legend = 25;

		legend_data.forEach((item) => {
			item['sector_shift'] = unique_sectors.indexOf(item.ald_sector_translation);
		});

		let tech_in_prev_sectors = [];
		tech_in_prev_sectors[0] = 0;
		for (var i = 1; i < unique_sectors.length; i++) {
			tech_in_prev_sectors[i] =
				tech_in_prev_sectors[i - 1] +
				legend_data.filter((obj) => obj.ald_sector_translation === unique_sectors[i - 1]).length;
		}

		let legend_group = svg
			.append('g')
			.attr('class', 'legend_group')
			.attr('transform', 'translate(' + (width - marginLeft - 55) + ',' + marginTop + ')');

		legend_group
			.selectAll('rect')
			.data(legend_data)
			.enter()
			.append('rect')
			.attr('width', 12)
			.attr('height', 12)
			.attr('class', (d) => d.ald_sector + ' ' + d.technology)
			.attr('x', 0)
			.attr('y', (d, i) => i * 17 + d.sector_shift * sector_gap_legend + 20);

		legend_group
			.selectAll('text')
			.data(legend_data)
			.enter()
			.append('text')
			.text((d) => d.technology_translation)
			.style('alignment-baseline', 'central')
			.style('text-anchor', 'start')
			.attr('font-size', '0.7em')
			.attr('x', 25)
			.attr('y', (d, i) => i * 17 + 6 + d.sector_shift * sector_gap_legend + 20);

		legend_group
			.append('g')
			.attr('class', 'sector_labels_legend')
			.selectAll('text')
			.data(unique_sectors)
			.enter()
			.append('text')
			.text((d) => d)
			.style('alignment-baseline', 'central')
			.style('text-anchor', 'start')
			.attr('font-size', '0.7em')
			.attr('x', 0)
			.attr('y', (d, i) => tech_in_prev_sectors[i] * 17 + 6 + i * sector_gap_legend);

		let green_legend_group = svg.append('g').attr('class', 'legend_group');

		// if there are any green bars, add green bar explanation to legend
		if (subdata_sorted.find((datapoint) => datapoint.green == true) != undefined) {
			let legend_green_rect = [
				{
					class: 'green',
					sector_shift: legend_data[legend_data.length - 1].sector_shift + 1
				}
			];
			let legend_green_text = [
				{
					text: lowCarbonLabel.top,
					sector_shift: legend_data[legend_data.length - 1].sector_shift + 1
				},
				{
					text: lowCarbonLabel.bottom,
					sector_shift: legend_data[legend_data.length - 1].sector_shift + 1
				}
			];

			// calculate how many rectangles are already in the legend
			let number_rectangles_tech =
				tech_in_prev_sectors[tech_in_prev_sectors.length - 1] +
				legend_data.filter(
					(obj) => obj.ald_sector_translation === unique_sectors[unique_sectors.length - 1]
				).length;
			green_legend_group.attr(
				'transform',
				'translate(' +
					(width - marginLeft - 55) +
					',' +
					(5 + number_rectangles_tech * 17 + marginTop) +
					')'
			);

			green_legend_group
				.selectAll('rect')
				.data(legend_green_rect)
				.enter()
				.append('rect')
				.attr('width', 12)
				.attr('height', 12)
				.attr('class', (d) => d.class)
				.attr('fill', 'green')
				.attr('x', 0)
				.attr('y', (d, i) => i * 17 + d.sector_shift * sector_gap_legend + 20);

			green_legend_group
				.selectAll('text')
				.data(legend_green_text)
				.enter()
				.append('text')
				.text((d) => d.text)
				.style('alignment-baseline', 'top')
				.style('text-anchor', 'start')
				.attr('font-size', '0.7em')
				.attr('x', 25)
				.attr('y', (d, i) => i * 14 + 5 + d.sector_shift * sector_gap_legend + 20);
		}

		// Hover-overs
		const tooltip = d3
			.select(container_div)
			.append('div')
			.attr('class', 'd3tooltip')
			.style('display', 'none');

		function num_format(num) {
			num = Math.round((num + Number.EPSILON) * 1000) / 10;
			if (num < 0.1) {
				return '< 0.1%';
			}
			return num + '%';
		}

		function mouseover(d) {
			tooltip
				.html(
					tech_id2name(d.technology) +
						'<br>' +
						num_format(d.plan_carsten) +
						hover_over_asset +
						num_format(d.sector_prcnt) +
						hover_over_sec.before_sec +
						d.ald_sector +
						hover_over_sec.after_sec
				)
				.style('display', 'inline-block');
		}

		function mouseover_green(d) {
			tooltip
				.html(
					hover_over_low_carbon.before_sec +
						tech_id2name(d.ald_sector) +
						hover_over_low_carbon.after_sec +
						'<br>' +
						num_format(d.green_sum) +
						hover_over_asset +
						num_format(d.green_prcnt) +
						hover_over_sec.before_sec +
						d.ald_sector +
						hover_over_sec.after_sec
				)
				.style('display', 'inline-block');
		}

		function mousemove(d) {
			tooltip.style('left', d3.event.pageX + 10 + 'px').style('top', d3.event.pageY - 20 + 'px');
		}

		function mouseout(d) {
			tooltip.style('display', 'none');
		}

		function orderLegendData(legend_data_unordered, tech_order) {
			let chart_sectors = d3.map(legend_data_unordered, (d) => d.ald_sector).keys();
			let chart_technologies = d3.map(legend_data_unordered, (d) => d.technology).keys();

			let legend_data = [];

			chart_sectors.forEach(function (item) {
				let techs_ordered = tech_order.filter((d) => d.sector == item)[0].tech_order;

				techs_ordered.forEach(function (tech) {
					if (chart_technologies.includes(tech)) {
						let idx = legend_data_unordered.findIndex(
							(d) => d.ald_sector == item && d.technology == tech
						);
						legend_data.push(legend_data_unordered[idx]);
					}
				});
			});

			if (legend_data_unordered.length > legend_data.length) {
				console.warn(
					'Not all sector/technology pairs from the data were found in sector_order variable. The legend shown is incomplete. Please, amend the tech_order_in_sectors.json file. '
				);
			}

			return legend_data;
		}

		function tech_id2name(tech_id) {
			switch (tech_id) {
				case 'Electric':
					return 'Electric';
				case 'Hybrid':
					return 'Hybrid';
				case 'ICE':
					return 'ICE';
				case 'FuelCell':
					return 'Fuel Cell';
				case 'Freight':
					return 'Freight';
				case 'Mix':
					return 'Mix';
				case 'Passenger':
					return 'Passenger';
				case 'Grinding':
					return 'Grinding';
				case 'Integrated facility':
					return 'Integrated facility';
				case 'Coal':
					return 'Coal';
				case 'Gas':
					return 'Gas';
				case 'Oil':
					return 'Oil';
				case 'CoalCap':
					return 'Coal Power';
				case 'GasCap':
					return 'Gas Power';
				case 'HydroCap':
					return 'Hydro Power';
				case 'NuclearCap':
					return 'Nuclear Power';
				case 'OilCap':
					return 'Oil Power';
				case 'RenewablesCap':
					return 'Renewables Power';
				case 'Ac-Electric Arc Furnace':
					return 'Ac-Electric Arc Furnace';
				case 'Bof Shop':
					return 'Bof Shop';
				case 'Dc-Electric Arc Furnace':
					return 'Dc-Electric Arc Furnace';
				case 'Open Hearth Meltshop':
					return 'Open Hearth Meltshop';
				default:
					return tech_id;
			}
		}
	}
}
