var Category = function(displayName, key, iconPrefix) {
	this.displayName = displayName;
	this.key = key;	
	this.iconPrefix = iconPrefix;
};

var Categories = {
	getCategoryList : function() {
		var myList = [];
		myList.push(new Category('Art Galleries', 'art_gallery', 'art'));
		myList.push(new Category('Banks', 'bank', 'bank'));
		myList.push(new Category('Grocery Stores', 'grocery_or_supermarket', 'grocery'));
		myList.push(new Category('Universities', 'university', 'university'));
		//myList.push(new Category('Everything',''));
		return myList;
	}
};