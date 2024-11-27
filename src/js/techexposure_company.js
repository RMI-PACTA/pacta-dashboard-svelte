import * as d3 from 'd3';

export class techexposure_company {
	constructor(container, data_down, data_up, tech_order) {
		let container_div;

		if (typeof container === 'string') {
			container_div = document.querySelector(container);
		} else {
			container_div = container;
		}

		container_div.innerHTML = '';

		container_div.classList.add('techexposure_company');
		container_div.classList.add('d3chart');
		container_div.classList.add('chart_container');

		this.container = d3.select(container_div);

		// Declare the chart dimensions and margins.
		const width = 928;
		const height = 775;
		const marginTop = 40;
		const marginRight = 70;
		const marginBottom = 140;
		let marginLeft = 90;

		// Chart parameters
		const port_gap = 17; //15;
		const bar_gap = 2;

		// Labels
		let hover_over_sec = { before_sec: ' of ', after_sec: ' sector' },
			weights_title = 'Weights',
			footnote_lab = {
				befor_scen: '* Aligned to ',
				after_scen: ' scenario in year ',
				after_year: '.'
			};

		// Create the svg container
		const svg = this.container
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('style', 'max-width: 100%; height: auto;');

		const tooltip = d3
			.select(container_div)
			.append('div')
			.attr('class', 'd3tooltip')
			.style('display', 'none');

		let selected_sector = document.querySelector('#sector_selector').value,
			selected_class = document.querySelector('#asset_class_selector').value,
			scenario_source = document.querySelector('#scenario_source_selector').value,
			scenario = document.querySelector('#scenario_selector').value,
			allocation = document.querySelector('#allocation_method_selector').value;
		let selected_sector_org = data_down.filter(
			(d) => d.ald_sector_translation == selected_sector
		)[0]['ald_sector'];

		let [subdata_up, undefined] = getDataBarsAndWeights(
			data_up,
			selected_class,
			selected_sector,
			scenario_source,
			scenario,
			allocation
		);
		subdata_up = orderData(
			subdata_up,
			tech_order.filter((d) => d.sector == selected_sector)[0].tech_order
		);

		// artificially add company name translations
		data_down.forEach((item, index) => {
			data_down[index]['id_translation'] = item.id;
		});
		let [subdata_down, subdata_weights] = getDataBarsAndWeights(
			data_down,
			selected_class,
			selected_sector,
			scenario_source,
			scenario,
			allocation
		);
		subdata_down = orderData(
			subdata_down,
			tech_order.filter((d) => d.sector == selected_sector)[0].tech_order
		);

		let long_label_down = findLongestName(subdata_down, 'id');
		let long_label_up = findLongestName(subdata_up, 'id');
		let long_label = long_label_down >= long_label_up ? long_label_down : long_label_up;
		let label_width = long_label.length * 8;

		if (marginLeft < label_width) {
			let margin_left_new = label_width;
			marginLeft = margin_left_new;
		}

		// Axes
		let y = d3.scaleBand();
		let x = d3
			.scaleLinear()
			.domain([0, 1])
			.range([0, width - marginLeft - marginRight]);

		let yWeights = d3.scaleBand();

		let subgroups = d3.keys(subdata_down[0]).slice(1);

		let groups_down = d3
			.map(subdata_down, function (d) {
				return d.id;
			})
			.keys();
		let groups_up = d3
			.map(subdata_up, function (d) {
				return d.id;
			})
			.keys();

		let nr_bars = groups_up.length + groups_down.length;
		let bar_height_space = (height - marginTop - marginBottom - port_gap) / nr_bars;

		let y_labels_group_up = svg.append('g').attr('class', 'y_axis_labels_up');

		let y_labels_group_down = svg.append('g').attr('class', 'y_axis_labels_down');

		let bars_group = svg
			.append('g')
			.attr('class', 'bars_group')
			.attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

		drawStackedBarGroup(
			bars_group,
			x,
			y,
			y_labels_group_up,
			'bars_up',
			subdata_up,
			subgroups,
			groups_up,
			0,
			width - marginRight - marginLeft,
			bar_height_space,
			bar_gap,
			selected_sector_org
		);
		drawStackedBarGroup(
			bars_group,
			x,
			y,
			y_labels_group_down,
			'bars_down',
			subdata_down,
			subgroups,
			groups_down,
			groups_up.length * bar_height_space + port_gap,
			width - marginRight - marginLeft,
			bar_height_space,
			bar_gap,
			selected_sector_org
		);

		var formatter = d3.format('.0%');

		svg
			.append('g')
			.attr('class', 'xaxis_group')
			.attr('transform', 'translate(' + marginLeft + ',' + (height - marginBottom) + ')')
			.call(d3.axisBottom(x).tickFormat(formatter))
			.selectAll('text')
			.style('text-anchor', 'middle');

		var weights_strings = subdata_weights.map(function (d) {
			let weight_perc = d.port_weight * 100;
			return weight_perc.toFixed(2) + '%';
		});

		yWeights.range([0, groups_down.length * bar_height_space]).domain(groups_down);

		svg
			.append('g')
			.attr('class', 'y_axis_weights_labels')
			.attr(
				'transform',
				'translate( ' +
					(width - marginRight + 5) +
					', ' +
					(groups_up.length * bar_height_space + port_gap + marginTop) +
					' )'
			)
			.call(
				d3
					.axisRight(yWeights)
					.tickSize(0)
					.tickValues(groups_down)
					.tickFormat(function (d, i) {
						return weights_strings[i];
					})
			)
			.call((g) => g.select('.domain').remove())
			.selectAll('text')
			.attr('font-size', '1.5em');

		svg
			.append('g')
			.attr('class', 'weights_label')
			.append('text')
			.attr('x', width - marginRight + 5 + 1)
			.attr('y', groups_up.length * bar_height_space + port_gap - 5 + marginTop)
			.attr('font-size', '1.1em')
			.text(weights_title);

		// Legend
		let legend = svg
			.append('g')
			.attr('class', 'legend')
			.attr(
				'transform',
				'translate( ' + marginLeft + ',' + (height - (2 * marginBottom) / 3) + ')'
			);
		let legend_data = [];

		subgroups.forEach((item, index) => {
			legend_data[index] = {};
			legend_data[index].technology = item;
			legend_data[index].technology_translation = data_down.filter((d) => d.technology == item)[0][
				'technology_translation'
			];
			legend_data[index].class = selected_sector_org + ' ' + item;
		});

		let long_label_leg = findLongestName(legend_data, 'technology_translation');

		let label_width_leg = long_label_leg.length * 8;

		let nr_labels_in_row = Math.round((width - marginLeft - marginRight) / (label_width_leg + 45));

		if (Math.ceil(legend_data.length / nr_labels_in_row) == 1) {
			label_width_leg = Math.max(100, label_width_leg);
		}

		legend
			.selectAll('rect')
			.data(legend_data)
			.enter()
			.append('rect')
			.attr('class', (d) => d.class)
			.attr('width', 15)
			.attr('height', 15)
			.attr('x', (d, i) => (i % nr_labels_in_row) * (label_width_leg + 45))
			.attr('y', (d, i) => Math.floor(i / nr_labels_in_row) * 30);

		legend
			.selectAll('text')
			.data(legend_data)
			.enter()
			.append('text')
			.text((d) => d.technology_translation)
			.style('alignment-baseline', 'central')
			.style('text-anchor', 'start')
			.attr('font-size', '0.7em')
			.attr('x', (d, i) => (i % nr_labels_in_row) * (label_width_leg + 45) + 20)
			.attr('y', (d, i) => Math.floor(i / nr_labels_in_row) * 30 + 7);

		let footnote = svg
			.append('g')
			.attr('class', 'footnote')
			.attr(
				'transform',
				'translate(' + (width - marginRight) + ',' + (height - marginBottom / 6) + ')'
			);

		let footnote_label =
			footnote_lab.befor_scen +
			data_up.filter((d) => d.scenario != 'production').map((d) => d.scenario)[0] +
			footnote_lab.after_scen +
			data_up.map((d) => d.year)[0] +
			footnote_lab.after_year;

		footnote
			.selectAll('text')
			.data([footnote_label])
			.enter()
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'end')
			.style('alignment-baseline', 'central')
			.style('font-size', '0.9em')
			.text((d) => d);

		// Data manipulation functions
		function getPortfolioWeightsPerIdData(data) {
			let subdata_weights = [];

			data.forEach((item, index) => {
				exist_id = false;
				for (var i = 0; i < subdata_weights.length; i++) {
					var exist_id = exist_id || subdata_weights[i]['id'] == item.id_translation;
				}
				if (!exist_id) {
					subdata_weights.push({ id: item.id_translation, port_weight: item.port_weight });
				}
			});
			return subdata_weights;
		}

		function getTechnologyDataForStacking(data, data_weights) {
			var subdata_tech = [];

			data_weights.forEach((item, index) => {
				subdata_tech[index] = {};
				subdata_tech[index]['id'] = item.id;
				data
					.filter((d) => d.id_translation == item.id)
					.forEach(function (x) {
						subdata_tech[index][x.technology] = x.plan_tech_share;
					});
			});

			return subdata_tech;
		}

		function getDataBarsAndWeights(
			data,
			asset_class,
			sector,
			scenario_source,
			scenario,
			allocation
		) {
			let subdata = getSectorAssetSubsetData(
				data,
				asset_class,
				sector,
				scenario_source,
				scenario,
				allocation
			);
			var subdata_weights = getPortfolioWeightsPerIdData(subdata);
			let subdata_tech = getTechnologyDataForStacking(subdata, subdata_weights);

			return [subdata_tech, subdata_weights];
		}

		function getTechnologyTranslation(technology) {
			let idx = data_up.findIndex((d) => d.technology === technology);

			if (idx > -1) {
				return data_up[idx].technology_translation;
			} else {
				idx = data_down.findIndex((d) => d.technology === technology);
				if (idx > -1) {
					return data_down[idx].technology_translation;
				} else {
					return technology;
				}
			}
		}

		function getSectorTranslation(sector) {
			let idx = data_up.findIndex((d) => d.ald_sector === sector);

			if (idx > -1) {
				return data_up[idx].ald_sector_translation;
			} else {
				idx = data_down.findIndex((d) => d.ald_sector === sector);

				if (idx > -1) {
					return data_down[idx].ald_sector_translation;
				} else {
					return sector;
				}
			}
		}

		function getSectorAssetSubsetData(
			data,
			asset_class,
			sector,
			scenario_source,
			scenario,
			allocation
		) {
			let subdata = data
				.filter((d) => d.asset_class_translation == asset_class)
				.filter((d) => d.ald_sector_translation == sector)
				.filter((d) => d.scenario_source == scenario_source)
				.filter((d) => d.scenario == scenario)
				.filter((d) => d.allocation == allocation);

			return subdata;
		}

		function orderData(data_unordered, tech_order_sector) {
			let data_ordered = [];

			data_unordered.forEach(function (item, idx) {
				data_ordered[idx] = {};
				data_ordered[idx].id = item.id;
				tech_order_sector.forEach(function (tech) {
					if (Object.keys(item).includes(tech)) {
						data_ordered[idx][tech] = item[tech];
					}
				});
				if (Object.keys(item).length != Object.keys(data_ordered[idx]).length) {
					throw new Error('Not all technologies for the sector found in json/tech_order_in_sectors.json dataset. Please append the dataset with new technologies if needed.');
				}
 			});

			return data_ordered;
		}

		// Plotting functions
		function drawStackedBarGroup(
			bars_group,
			x,
			y,
			y_labels_group,
			bars_class_up_down,
			data,
			subgroups,
			groups,
			graph_start_height,
			graph_width,
			bar_height,
			bar_gap,
			sector
		) {
			y.range([0, groups.length * bar_height]).domain(groups);

			y_labels_group
				.attr('transform', 'translate(' + marginLeft + ',' + (marginTop + graph_start_height) + ')')
				.call(d3.axisLeft(y).tickSize(0))
				.call((g) => g.select('.domain').remove())
				.selectAll('text')
				.attr('font-size', '1.5em');

			var color = d3.scaleOrdinal(d3.schemeCategory10);

			var stackedData = d3.stack().keys(subgroups)(data);

			// Show the bars
			let bars_rect = bars_group
				.selectAll('rect')
				.selectAll('.' + bars_class_up_down)
				.data([]);
			// Enter in the stack data = loop key per key = group per group
			bars_rect.exit().attr('width', 0).remove();

			let bars_tech_groups = bars_group
				.selectAll('g')
				.selectAll('.' + bars_class_up_down)
				.data([]);
			bars_tech_groups.exit().remove();

			bars_group
				.append('g')
				.selectAll('g')
				.data(stackedData)
				.enter()
				.append('g')
				.attr('class', (d) => sector + ' ' + d.key + ' ' + bars_class_up_down)
				.attr('fill', function (d) {
					return color(d.key);
				})
				.attr('technology', function (d) {
					return getTechnologyTranslation(d.key);
				})
				.attr('sector', function (d) {
					return getSectorTranslation(sector);
				})
				.selectAll('rect')
				// enter a second time = loop subgroup per subgroup to add all rectangles
				.data(function (d) {
					return d;
				})
				.enter()
				.append('rect')
				.attr('class', bars_class_up_down)
				.attr('x', function (d) {
					return x(d[0]);
				})
				.attr('y', function (d) {
					return graph_start_height + y(d.data.id);
				})
				.attr('width', function (d) {
					return x(d[1]) - x(d[0]);
				})
				.attr('height', bar_height - bar_gap)
				.on('mouseover', mouseover)
				.on('mouseout', mouseout)
				.on('mousemove', mousemove);
		}

		// determine left margin based on company name
		function findLongestName(data, label) {
			let longest_name_length = d3.max(data, (d) => d[label].length);
			let long_test_label = new Array(longest_name_length).join('a');
			return long_test_label;
		}

		function num_format(num) {
			num = Math.round((num + Number.EPSILON) * 1000) / 10;
			if (num < 0.1) {
				return '< 0.1%';
			}
			return num + '%';
		}

		function mouseover(d) {
			var selfParent = d3.select(this.parentElement),
				tech = selfParent.attr('technology'),
				sector = selfParent.attr('sector');

			tooltip
				.html(
					tech +
						'<br>' +
						num_format(d[1] - d[0]) +
						hover_over_sec.before_sec +
						sector +
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
	}
}
