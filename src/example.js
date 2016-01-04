// Add the root project directory to the app module search path:
require('app-module-path').addPath(__dirname);

let {Trait, withTraits} = require('es6-with-traits');

class Animal {}
let Flying = Trait(function(parentClass) {
	return class Flying extends parentClass {
		constructor(...args) {
			super(...args);
			this.wings = ["left wing", "right wing"];
		}
		fly() {
			console.log("flap flap with the " + this.wings.join(" and "));
		}
	};
});
let Walking = Trait(function(parentClass) {
	return class Walking extends parentClass {
		constructor(...args) {
			super(...args);
			this.legs = this.legs || []; // there must be legs, by default we don't know how many

			// Also to be researched (as an alternative to the above):
			// Legged.check(this);
		}
		walk() {
			console.log("walking on legs " + this.legs.join(" and "));
		}
	};
});
let Biped = Trait(function(parentClass) {
	return class Biped extends parentClass {
		constructor(...args) {
			super(...args);
			this.legs = ["left leg", "right leg"];
		}
	};
});
let Quadruped = Trait(function(parentClass) {
	return class Quadruped extends parentClass {
		constructor(...args) {
			super(...args);
			this.legs = ["front left leg", "front right leg", "rear left leg", "rear right leg"];
		}
	};
});

class Dog extends withTraits(Animal, Quadruped, Walking) {}
class Bird extends withTraits(Animal, Biped, Walking, Flying) {}
let dog = new Dog();
console.log("dog.walk():");
dog.walk();

let bird = new Bird();
console.log("bird.walk():");
bird.walk();
console.log("bird.fly():");
bird.fly();

console.log("Does a dog walk?", Walking.check(dog)); // => true
console.log("Does a dog fly?", Flying.check(dog)); // => false

var duck = {
	legs: [],
	walk: function() {},
	fly: function() {}
};

console.log("Is a duck a bird?", Bird.check(duck)); // => true

// Of course, not everything is perfect (yet):
console.log("Is a bird a Quadruped?", Quadruped.check(bird)); // => true
console.log("Is a dog a Biped?", Biped.check(dog)); // => true
