# es6-with-traits
A traits mechanism for ES6 with support for "methodical interface checking"

## Usage

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

	console.log("Does a dog walk?", Walking.mimics(dog)); // => true
	console.log("Does a dog fly?", Flying.mimics(dog)); // => false
