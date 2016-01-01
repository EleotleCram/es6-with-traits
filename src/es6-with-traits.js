class Base {}
const Trait = function(traitFunc) {
	traitFunc.__trait__ = true;
	return traitFunc;
};
const withTraits = function(baseClassOrFirstTrait, ...traits) {
	var baseClass = baseClassOrFirstTrait.__trait__ ? baseClassOrFirstTrait(Base) : baseClassOrFirstTrait;
	return traits.reduce((parentClass, trait) => trait(parentClass), baseClass);
}

if (typeof module !== 'undefined') {
	module.exports = {
		Trait: Trait,
		withTraits: withTraits
	};
}

if (require.main === module) {
	class Animal {}
	let Flying = Trait(function(parentClass) {
		return class Flying extends parentClass {
			constructor(...args) {
				super(...args);
				this.wings = ["left wing", "right wing"];
			}
			fly() {
				console.log("flap flap with the " + this.wings.join("and"));
			}
		};
	});
	let Walking = Trait(function(parentClass) {
		return class Walking extends parentClass {
			constructor(...args) {
				super(...args);
				this.legs = []; // there must be legs, we don't know how many

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

	// @TODO why does it work for Walking, Biped, but not for Biped, Walking ?
	class Dog extends withTraits(Animal, Quadruped, Walking) {}
	class Bird extends withTraits(Animal, Walking, Biped, Flying) {}

	let dog = new Dog();
	dog.walk();
	let bird = new Bird();
	bird.walk();
	bird.fly();
}
