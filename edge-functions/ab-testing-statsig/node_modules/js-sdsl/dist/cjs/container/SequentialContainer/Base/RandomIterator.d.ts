import { ContainerIterator } from "../../ContainerBase";
export declare abstract class RandomIterator<T> extends ContainerIterator<T> {
    get pointer(): T;
    set pointer(newValue: T);
    pre(): this;
    next(): this;
}
