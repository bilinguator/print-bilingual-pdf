let newPageNeeded = true;
let couplesSummaryHeight = 0;
let columns = document.querySelectorAll('.column');
let lang1 = document.querySelectorAll('.author-title-table-row')[0].lang;
let lang2 = document.querySelectorAll('.author-title-table-row')[1].lang;

for (let i = 0; i < columns.length; i++) {
	if (columns[i].classList.contains('right-column')) {
		let couples = document.querySelectorAll('.couple');
		let lastCouple = couples[couples.length - 1];
		lastCouple.insertAdjacentElement('beforeend', columns[i]);
	} else if (columns[i].classList.contains('left-column') || columns[i].classList.contains('column-img')) {
		let targetCouple = createElement('div', 'couple');
		columns[i].insertAdjacentElement('beforebegin', targetCouple);
		targetCouple.insertAdjacentElement('afterbegin', columns[i]);
	}
}

let couples = document.querySelectorAll('.couple');

for (let i = 0; i < couples.length; i++) {
	
	if (newPageNeeded) {
		let targetPage = createElement('div', 'printed-page');
		couples[i].insertAdjacentElement('beforebegin', targetPage);
		newPageNeeded = false;
	}
	
	let printPagesArray = document.querySelectorAll('.printed-page');
	let targetPage = printPagesArray[printPagesArray.length - 1];
	let pageClientHeight = targetPage.clientHeight;
	let pagePaddingTop = Number(window.getComputedStyle(targetPage, null).getPropertyValue('padding-top').split('px')[0]);
	let pagePaddingBottom = Number(window.getComputedStyle(targetPage, null).getPropertyValue('padding-bottom').split('px')[0]);
	let pageHeight = pageClientHeight - pagePaddingTop - pagePaddingBottom;
	
	let coupleHeight = couples[i].offsetHeight;
	let nextCoupleHeight = couples[i + 1] ? couples[i + 1].offsetHeight : undefined;
	
	if (couplesSummaryHeight + coupleHeight < pageHeight) {
		if (couples[i].innerHTML.includes('<h1>')) {
			if ((couplesSummaryHeight + coupleHeight + nextCoupleHeight) < pageHeight || couplesSummaryHeight == 0) {
				targetPage.insertAdjacentElement('beforeend', couples[i]);
				couplesSummaryHeight += coupleHeight;
			} else {
				couplesSummaryHeight = 0;
				newPageNeeded = true;
				i -= 1;
			}
		} else {
			targetPage.insertAdjacentElement('beforeend', couples[i]);
			couplesSummaryHeight += coupleHeight;
		}
	} else {
		if (couplesSummaryHeight == 0) {
			if (couples[i].children.length != 2) {
				continue;
			}

			let columnLeft = couples[i].children[0];
			let columnRight = couples[i].children[1];
			
			let cutCouple = createElement('div', Array.from(couples[i].classList).concat(['cut-couple']));
			
			let cutColumnLeft = createElement('div', Array.from(columnLeft.classList));
			cutColumnLeft.lang = columnLeft.lang;
			cutCouple.insertAdjacentElement('beforeend', cutColumnLeft);
			
			let cutColumnRight = createElement('div', Array.from(columnRight.classList));
			cutColumnRight.lang = columnRight.lang;
			cutCouple.insertAdjacentElement('beforeend', cutColumnRight);
			
			targetPage.insertAdjacentElement('beforeend', cutCouple);

			let arrayCutColumnLeft = columnLeft.innerHTML.split('<br>');
			let arrayCutColumnRight = columnRight.innerHTML.split('<br>');
			let arrayRestColumnLeft = Array();
			let arrayRestColumnRight = Array();
			let cutCoupleFitted = false;

			while (cutCoupleFitted == false && (arrayCutColumnLeft.length > 1 || arrayCutColumnRight.length > 1)) {
				if (arrayCutColumnLeft.length > arrayCutColumnRight.length) {
					arrayRestColumnLeft.unshift(arrayCutColumnLeft.pop());
				} else if (arrayCutColumnLeft.length < arrayCutColumnRight.length) {
					arrayRestColumnRight.unshift(arrayCutColumnRight.pop());
				} else {
					arrayRestColumnLeft.unshift(arrayCutColumnLeft.pop());
					arrayRestColumnRight.unshift(arrayCutColumnRight.pop());
				}

				cutColumnLeft.innerHTML = arrayCutColumnLeft.join('<br>');
				cutColumnRight.innerHTML = arrayCutColumnRight.join('<br>');
				
				if (cutCouple.offsetHeight < pageHeight) {
					cutCoupleFitted = true;
					columnLeft.innerHTML = arrayRestColumnLeft.join('<br>');
					columnRight.innerHTML = arrayRestColumnRight.join('<br>');
					couplesSummaryHeight = cutCouple.offsetHeight;
				}
			}

			i -= 1;
		} else {
			couplesSummaryHeight = 0;
			newPageNeeded = true;
			i -= 1;
		}
	}
}