import { initContainer } from "../ContainerBase";
import { HashContainer, HashContainerIterator } from "./Base";
declare class HashSetIterator<K, V> extends HashContainerIterator<K, V> {
    get pointer(): K;
    copy(): HashSetIterator<K, V>;
    equals(iter: HashSetIterator<K, V>): boolean;
}
export type { HashSetIterator };
declare class HashSet<K> extends HashContainer<K, undefined> {
    constructor(container?: initContainer<K>);
    begin(): HashSetIterator<K, undefined>;
    end(): HashSetIterator<K, undefined>;
    rBegin(): HashSetIterator<K, undefined>;
    rEnd(): HashSetIterator<K, undefined>;
    front(): K | undefined;
    back(): K | undefined;
    /**
     * @description Insert element to set.
     * @param key - The key want to insert.
     * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
     *                   If a `undefined` value is passed in, the type will be automatically judged.
     * @returns The size of container after inserting.
     */
    insert(key: K, isObject?: boolean): number;
    getElementByPos(pos: number): K;
    /**
     * @description Check key if exist in container.
     * @param key - The element you want to search.
     * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
     *                   If a `undefined` value is passed in, the type will be automatically judged.
     * @returns An iterator pointing to the element if found, or super end if not found.
     */
    find(key: K, isObject?: boolean): HashSetIterator<K, undefined>;
    forEach(callback: (element: K, index: number, container: HashSet<K>) => void): void;
    [Symbol.iterator](): Generator<K, void, unknown>;
}
export default HashSet;
