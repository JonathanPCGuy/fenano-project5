var CatArray = [
	{
	clickCount: 0,
		name: 'Garfield',
		imgSrc: 'img/cat0.jpg',
		imgAttribution: 'http://www.google.com',
		nickNames: [
		"Gar",
		"Teresa",
		"Tammy",
		"Tassy",
		"猫猫" //interesting, this results in garbage output
		]
	},
	{
	clickCount: 0,
		name: 'Happycat',
		imgSrc: 'img/cat1.jpg',
		imgAttribution: 'http://www.google.com',
		nickNames: [
		"Happy",
		"Teresa",
		"Tammy",
		"Tassy",
		"猫猫" //interesting, this results in garbage output
		]
	},
	{
	clickCount: 0,
		name: 'Bob',
		imgSrc: 'img/cat2.jpg',
		imgAttribution: 'http://www.google.com',
		nickNames: [
		"Bob",
		"Teresa",
		"Tammy",
		"Tassy",
		"猫猫" //interesting, this results in garbage output
		]
	},
	{
	clickCount: 0,
		name: 'Sam',
		imgSrc: 'img/cat3.jpg',
		imgAttribution: 'http://www.google.com',
		nickNames: [
		"Sam",
		"Teresa",
		"Tammy",
		"Tassy",
		"猫猫" //interesting, this results in garbage output
		]
	},
	{
	clickCount: 0,
		name: 'George',
		imgSrc: 'img/cat4.jpg',
		imgAttribution: 'http://www.google.com',
		nickNames: [
		"Georgina",
		"Teresa",
		"Tammy",
		"Tassy",
		"猫猫" //interesting, this results in garbage output
		]
	},
	{
	clickCount: 0,
		name: 'Tifa',
		imgSrc: 'img/cat5.jpg',
		imgAttribution: 'http://www.google.com',
		nickNames: [
		"Tiffy",
		"Teresa",
		"Tammy",
		"Tassy",
		"猫猫" //interesting, this results in garbage output
		]
	},
	{
	clickCount: 0,
		name: 'Korra',
		imgSrc: 'img/cat6.jpg',
		imgAttribution: 'http://www.google.com',
		nickNames: [
		"Asami",
		"Teresa",
		"Tammy",
		"Tassy",
		"猫猫" //interesting, this results in garbage output
		]
	},
];



var Cat = function(data) {
	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
	this.imgSrc = ko.observable(data.imgSrc);
	this.imgAttribution = ko.observable(data.imgAttribution);
	this.nickNames = ko.observableArray(data.nickNames);
};

var ViewModel = function() {
	
	
	this.catList = ko.observableArray();
	var that = this;
	CatArray.forEach(function(cat) {
		that.catList.push(new Cat(cat));
	});
	
	this.currentCat = ko.observable(this.catList()[0]);
	
	this.loadCat = function(cat) {
		that.currentCat(cat);
	};
	
	// this with the "with" is the cat itself
	this.incrementCount = function() {
		this.clickCount(this.clickCount() + 1);
	};
	// this vs computed?
	this.catLevel = ko.computed(function() {
		if(that.currentCat().clickCount() < 10)
			return "Newborn";
		else if(that.currentCat().clickCount() >= 10 && that.currentCat().clickCount() < 20)
			return "Infant";
		else if(that.currentCat().clickCount() >= 20)
			return "Teenager";
	});
};

ko.applyBindings(new ViewModel());