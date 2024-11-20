export function createErrorMessageDiv() {
	let errorMessageDiv = document.createElement('div');
	errorMessageDiv.setAttribute('role', 'alert');
	let errorTitle = document.createElement('div');
	errorTitle.classList = 'bg-red-500 text-white font-bold rounded-t px-4 py-2';
	errorTitle.appendChild(document.createTextNode('Something went wrong'));
	let errorMessage = document.createElement('div');
	errorMessage.classList =
		'border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700';
	errorMessage.appendChild(
		document.createTextNode('An error occurred while generating this plot.')
	);
	errorMessageDiv.appendChild(errorTitle);
	errorMessageDiv.appendChild(errorMessage);

	return errorMessageDiv;
}