<!-- src/routes/portfolio_view.svelte -->
<div class="gap-x-4 p-4">
	<h2 class="h2">Overview of the current state of the portfolio</h2>
	<div class="h-screen flex gap-x-4">
		<div class="card p-4 w-1/2 h-full items-center justify-left">
			<h3 class="h3">Asset classes covered by the analysis</h3>
			<br />
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
				invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
				et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
				Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
				diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
				gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
			<br />
			<!-- Responsive Container (recommended) -->
			<div class="table-container">
				<!-- Native Table Element -->
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Asset Class</th>
							<th>Portfolio value invested (M USD)</th>
							<th>Portfolio value invested (%)</th>
							<th>Included in the analysis</th>
						</tr>
					</thead>
					<tbody> </tbody>
					<tfoot>
						<tr>
							<th colspan="3">Test</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
		<div class="card p-4 w-1/2 h-full items-center justify-right">
			<h3 class="h3">Portfolio value and emissions covered by PACTA sectors</h3>
			<br />
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
				invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
				et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
				Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
				diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
				gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
		</div>
	</div>
</div>
