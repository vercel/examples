import { Container, ContainerIterator } from "../../ContainerBase";
export declare abstract class HashContainerIterator<K, V> extends ContainerIterator<K | [K, V]> {
    pre(): this;
    next(): this;
}
export declare abstract class HashContainer<K, V> extends Container<K | [K, V]> {
    /**
     * @description Unique symbol used to tag object.
     */
    readonly HASH_TAG: symbol;
    clear(): void;
    /**
     * @description Remove the element of the specified key.
     * @param key - The key you want to remove.
     * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
     *                   If a `undefined` value is passed in, the type will be automatically judged.
     * @returns Whether erase successfully.
     */
    eraseElementByKey(key: K, isObject?: boolean): boolean;
    eraseElementByIterator(iter: HashContainerIterator<K, V>): HashContainerIterator<K, V>;
    eraseElementByPos(pos: number): number;
}
