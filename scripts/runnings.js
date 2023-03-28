let printPages = document.querySelectorAll('.printed-page');

for (let i = 2; i < printPages.length; i++) {
	let runningTitle = createElement('p', 'running-title');
	if (i % 2 == 0) {
		runningTitle.innerText = document.querySelectorAll('.title')[0].innerText;
	} else {
		runningTitle.innerText = document.querySelectorAll('.title')[1].innerText;
	}
	printPages[i].insertAdjacentElement('afterbegin', runningTitle);
	
	let pageNumber = createElement('p', 'page-number');
	pageNumber.innerText = i;
	printPages[i].insertAdjacentElement('beforeend', pageNumber);
}

let lastPrintPage = printPages[printPages.length - 1];
let lastPage = createElement('div', ['printed-page', 'last-printed-page']);
lastPrintPage.insertAdjacentElement('afterend', lastPage);