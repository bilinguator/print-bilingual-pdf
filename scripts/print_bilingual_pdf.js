function createElement (tag, classes) {
	let newElement = document.createElement(tag);
	
	if (Array.isArray(classes)) {
		classes.forEach((item) => {
			newElement.classList.add(item);
		});
	} else {
		newElement.classList.add(classes);
	}
	
	return newElement;
}

function printBilingualPDF (text1, text2, lang1, lang2,
	mode = 'cols', cover = '', fileName = 'bilingual_book', illustrationsFolder = '/') {
	
	let articlesArrayLeft = text1.split('\n')
	let articlesArrayRight = text2.split('\n')
	
	let authorLeft = articlesArrayLeft.shift();
	let authorRight = articlesArrayRight.shift();
	
	let titleLeft = articlesArrayLeft.shift();
	let titleRight = articlesArrayRight.shift();
	let titleRestLeft = '';
	let titleRestRight = '';

	if (titleLeft.includes('<delimiter>')) {
		titleRestLeft = titleLeft.split('<delimiter>')[1];
		titleLeft = titleLeft.split('<delimiter>')[0];
	}

	if (titleRight.includes('<delimiter>')) {
		titleRestRight = titleRight.split('<delimiter>')[1];
		titleRight = titleRight.split('<delimiter>')[0];
	}

	let authorTitleTable = '<div class="author-title-table">';
	authorTitleTable += `<div lang="${lang1}" class="author-title-table-row">`
	authorTitleTable += `<p class="author">${authorLeft}</p>`;
	authorTitleTable += `<div class = "title">${titleLeft}</div></div>`;
	authorTitleTable += `<div lang="${lang2}" class="author-title-table-row">`;
	authorTitleTable += `<p class="author">${authorRight}</p>`;
	authorTitleTable += `<div class="title">${titleRight}</div></div></div>`;
	
	let printedBook = '<div class="printed-book">';
	printedBook += '<div class="printed-page cover-printed-page">';
	printedBook += `<img class="printed-book-cover" src="${cover}" /></div>`;
	printedBook += `<div class="printed-page">${authorTitleTable}</div>`;
	
	if (titleRestLeft !== '' || titleRestRight !== '') {
		printedBook += `<div lang="${lang1}" class="column column-${mode} left-column">`;
		printedBook += titleRestLeft.split('<delimiter>').join('<br>') + '</div>';
		printedBook += `<div lang="${lang2}" class="column column-${mode} right-column">`;
		printedBook += titleRestRight.split('<delimiter>').join('<br>') + '</div>';
	}

	let maxArticlesCount = Math.max(articlesArrayLeft.length, articlesArrayRight.length);

	for (let i = 0; i < maxArticlesCount; i++) {
		if (articlesArrayLeft[i].includes('<img') && articlesArrayLeft[i] == articlesArrayRight[i]) {
			let imgIndex = articlesArrayLeft[i].split('<img')[1].split('>')[0];
			printedBook += `<div class="column column-img column-img-${mode}-merged">`;
			printedBook += `<img src="${illustrationsFolder}/${imgIndex}.png"></div>`;
		
		} else if (articlesArrayLeft[i].includes('<img')) {
			let imgIndex = articlesArrayLeft[i].split('<img')[1].split('>')[0];
			printedBook += `<div class="column column-${mode} left-column column-img column-img-${mode}-separate">`;
			printedBook += `<img src="${illustrationsFolder}/${imgIndex}.png"></div>`;
			printedBook += `<div lang="${lang2}" class="column column-${mode} right-column">`;
			printedBook += articlesArrayRight[i].split('<delimiter>').join('<br>') + '</div>';
		
		} else if (articlesArrayRight[i].includes('<img')) {
			let imgIndex = articlesArrayRight[i].split('<img')[1].split('>')[0];
			printedBook += `<div lang=${lang1}" class="column column-${mode} left-column">`;
			printedBook += articlesArrayLeft[i].split('<delimiter>').join('<br>') + '</div>';
			printedBook += `<div class="column column-${mode} right-column column-img column-img-${mode}-separate">`;
			printedBook += `<img src="${illustrationsFolder}/${imgIndex}.png"></div>`;
		} else {
			let h1LeftClass = articlesArrayLeft[i].includes('<h1>') ? ' column-heading' : '';
			let h1RightClass = articlesArrayRight[i].includes('<h1>') ? ' column-heading' : '';
			printedBook += `<div lang="${lang1}" class="column column-${mode} left-column${h1LeftClass}">`;
			printedBook += articlesArrayLeft[i].split('<delimiter>').join('<br>') + '</div>';
			printedBook += `<div lang="${lang2}" class="column column-${mode} right-column${h1RightClass}">`;
			printedBook += articlesArrayRight[i].split('<delimiter>').join('<br>') + '</div>';
		}
	}

	printedBook += '</div>';
	
	let printedBookWindow = window.open();
	printedBookWindow.document.title = fileName;
	printedBookWindow.document.write(`<title>${fileName}</title>`);
	printedBookWindow.document.write(`<link rel="stylesheet" type="text/css" href="css\/printed_book.css">`);
	printedBookWindow.document.write(printedBook);
	
	printedBookWindow.document.write(`<script type="text\/javascript" src="scripts\/create_element.js"><\/script>`);
	printedBookWindow.document.write(`<script type="text\/javascript" src="scripts\/print_bilingual_pdf_${mode}.js"><\/script>`);
	printedBookWindow.document.write(`<script type="text\/javascript" src="scripts\/runnings.js"><\/script>`);
}