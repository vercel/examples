/**
Filter object keys and values into a new object.

@param object - The source object to filter properties from.
@param predicate - Predicate function that determines whether a property should be assigned to the new object.
@param keys - Property keys that should be assigned to the new object.

@example
```
import {includeKeys} from 'filter-obj';

const object = {
	foo: true,
	bar: false
};

const newObject = includeKeys(object, (key, value) => value === true);
//=> {foo: true}

const newObject2 = includeKeys(object, ['bar']);
//=> {bar: false}
```
*/
export function includeKeys<ObjectType extends Record<PropertyKey, any>>(
	object: ObjectType,
	predicate: (
		key: keyof ObjectType,
		value: ObjectType[keyof ObjectType]
	) => boolean
): Partial<ObjectType>;
export function includeKeys<
	ObjectType extends Record<PropertyKey, any>,
	IncludedKeys extends keyof ObjectType,
>(
	object: ObjectType,
	keys: readonly IncludedKeys[] | ReadonlySet<IncludedKeys>
): Pick<ObjectType, IncludedKeys>;

/**
Filter object keys and values into a new object.

@param object - The source object to filter properties from.
@param predicate - Predicate function that determines whether a property should not be assigned to the new object.
@param keys - Property keys that should not be assigned to the new object.

@example
```
import {excludeKeys} from 'filter-obj';

const object = {
	foo: true,
	bar: false
};

const newObject = excludeKeys(object, (key, value) => value === true);
//=> {bar: false}

const newObject3 = excludeKeys(object, ['bar']);
//=> {foo: true}
```
*/
export function excludeKeys<ObjectType extends Record<PropertyKey, any>>(
	object: ObjectType,
	predicate: (
		key: keyof ObjectType,
		value: ObjectType[keyof ObjectType]
	) => boolean
): Partial<ObjectType>;
export function excludeKeys<
	ObjectType extends Record<PropertyKey, any>,
	ExcludedKeys extends keyof ObjectType,
>(
	object: ObjectType,
	keys: readonly ExcludedKeys[] | ReadonlySet<ExcludedKeys>
): DistributiveOmit<ObjectType, ExcludedKeys>;

type DistributiveOmit<Value, Key extends PropertyKey> = Value extends unknown ? Omit<Value, Key> : never;
