let newPageNeeded = true;
let isSecondHeading = false;
let columnsSummaryHeight = 0;
let columns = document.querySelectorAll('.column');
let lang1 = document.querySelectorAll('.author-title-table-row')[0].lang;
let lang2 = document.querySelectorAll('.author-title-table-row')[1].lang;

for (let i = 0; i < columns.length; i++) {
	if (columns[i].innerHTML == '') {
		columns[i].remove();
		continue;
	}
	
	let printPagesArray = document.querySelectorAll('.printed-page');
	let targetPage = printPagesArray[printPagesArray.length - 1];
	let pageClientHeight = targetPage.clientHeight;

	if (newPageNeeded) {
		targetPage = createElement('div', 'printed-page');
		columns[i].insertAdjacentElement('beforebegin', targetPage);
		newPageNeeded = false;
	}
	
	let pagePaddingTop = Number(window.getComputedStyle(targetPage, null).getPropertyValue('padding-top').split('px')[0]);
	let pagePaddingBottom = Number(window.getComputedStyle(targetPage, null).getPropertyValue('padding-bottom').split('px')[0]);
	let pageHeight = pageClientHeight - pagePaddingTop - pagePaddingBottom;
	
	let columnHeight = columns[i].offsetHeight;
	let nextColumnHeight = columns[i + 1] ? columns[i + 1].offsetHeight : undefined;
	let nextMoreColumnHeight = columns[i + 2] ? columns[i + 2].offsetHeight : undefined;
	
	if (columnsSummaryHeight + columnHeight < pageHeight) {
		if (columns[i].innerHTML.includes('<h1>') && isSecondHeading === false &&
		(columnsSummaryHeight + columnHeight + nextColumnHeight + nextMoreColumnHeight) > pageHeight) {
			columnsSummaryHeight = 0;
			newPageNeeded = true;
			i -= 1;
		} else {
			targetPage.insertAdjacentElement('beforeend', columns[i]);
			columnsSummaryHeight += columnHeight;
			
			if (columns[i].innerHTML.includes('<h1>') && isSecondHeading == false) {
				isSecondHeading = true;
			} else {
				isSecondHeading = false;
			}
		}

	} else {
		if (columnsSummaryHeight == 0) {
			let cutColumn = createElement('div', Array.from(columns[i].classList));
			cutColumn.lang = columns[i].lang;
			let arrayCutColumn = columns[i].innerHTML.split('<br>');
			let arrayRestColumn = Array();
			let cutColumnFitted = false;
			targetPage.insertAdjacentElement('beforeend', cutColumn);

			while (cutColumnFitted == false && arrayCutColumn.length > 1) {
				arrayRestColumn.unshift(arrayCutColumn.pop());
				cutColumn.innerHTML = arrayCutColumn.join('<br>');

				if (cutColumn.offsetHeight < pageHeight) {
					cutColumnFitted = true;
					columns[i].innerHTML = arrayRestColumn.join('<br>');
					columnsSummaryHeight = cutColumn.offsetHeight;
				}
			}

			if (!cutColumnFitted) {
				let wordsCutColumn = arrayCutColumn[0].split(' ');
				arrayRestColumn.unshift('');

				while (cutColumnFitted == false && wordsCutColumn.length > 1) {
					arrayRestColumn[0] = wordsCutColumn.pop() + ' ' + arrayRestColumn[0];
					cutColumn.innerHTML = wordsCutColumn.join(' ');

					if (cutColumn.offsetHeight < pageHeight) {
						cutColumnFitted = true;
						columns[i].innerHTML = arrayRestColumn.join('<br>');
						columnsSummaryHeight = cutColumn.offsetHeight;
					}
				}
			}

			i -= 1;
		} else {
			columnsSummaryHeight = 0;
			newPageNeeded = true;
			i -= 1;
			isSecondHeading = false;
		}
	}
}