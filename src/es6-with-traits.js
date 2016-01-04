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
		return propertiesRequiredByInterface.every(function(p) {
			let actualType = typeString(object[p.name]);
			let isOk = actualType === p.type;

			if(!object[p.name]) {
				console.warn(`Required property '${p.name}' missing!`);
			} else if(!isOk) {
				console.warn(`Required property '${p.name}' has wrong type: ${actualType} !== ${p.type} (expected)!`);
			}

			return isOk;
		});
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
