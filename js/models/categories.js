var Category = function(displayName, key) {
	this.displayName = displayName;
	this.key = key;	
};

var Categories = {
	getCategoryList : function() {
		var myList = [];
		myList.push(new Category('Art Galleries', 'art_gallery'));
		myList.push(new Category('Banks', 'bank'));
		myList.push(new Category('Grocery Stores', 'grocery_or_supermarket'));
		myList.push(new Category('Universities', 'university'));
		//myList.push(new Category('Everything',''));
		return myList;
	}
};