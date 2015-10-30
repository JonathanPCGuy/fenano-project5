var Category = function(displayName, key) {
	this.displayName = displayName;
	this.key = key;	
};

var Categories = {
	getCategoryList : function() {
		var myList = [];
		myList.push(new Category('Banks', 'bank'));
		myList.push(new Category('Bars', 'bar'));
		myList.push(new Category('Pharmacies', 'pharmacy'));
		myList.push(new Category('Dentists', 'dentist'));
		//myList.push(new Category('Everything',''));
		return myList;
	}
};