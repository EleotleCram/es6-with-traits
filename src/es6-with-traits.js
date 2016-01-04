class Base {}
const Trait = function(traitFunc) {
	traitFunc.__trait__ = true;
	let iface = getInterface(traitFunc);
	traitFunc.check = iface.check;
	traitFunc.mimics = function(...args) {
		console.warn("The method 'mimics' is deprecated, please use 'check' instead");
		return this.check(...args);
	}

	return traitFunc;
};
const withTraits = function(baseClassOrFirstTrait, ...traits) {
	let baseClass = baseClassOrFirstTrait.__trait__ ? baseClassOrFirstTrait(Base) : baseClassOrFirstTrait;
	var iface;
	let intermediateClass = class Intermediate extends baseClass {
		static check(...args) {
			return iface.check(...args);
		}
	};
	let mixinClass = traits.reduce((parentClass, trait) => trait(parentClass), intermediateClass);
	iface = getInterface(mixinClass);
	return mixinClass;
}

const getInterface = function(traitOrClass) {
	var aClass = traitOrClass.__trait__ ? traitOrClass(Base) : traitOrClass;
	var instance = new aClass();
	var prototype = Object.getPrototypeOf(instance);
	var propertyNames = Object.keys(instance)
						.concat(Object.getOwnPropertyNames(prototype)
						.concat(Object.getOwnPropertySymbols(prototype)));

	var typeString = (x) => Object.prototype.toString.call(x);

	var propertiesRequiredByInterface = [];
	for (let name of propertyNames) {
		let property = instance[name];
		if(property !== aClass) {
			propertiesRequiredByInterface.push({name, type: typeString(property)});
		}
	}

	// Check if object mimics this interface (has all the properties required by the interface)
	var check = function(object) {
		return propertiesRequiredByInterface.every((p) => typeString(object[p.name]) === p.type);
	};

	return {
		check,
	};
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
}
