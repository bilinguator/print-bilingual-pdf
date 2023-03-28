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
