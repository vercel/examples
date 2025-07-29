/// <reference types="node" />
import ClusterSubscriber from "./ClusterSubscriber";
import Cluster from "./index";
/**
 * Redis differs between "normal" and sharded PubSub. If using the "normal" PubSub feature, exactly one
 * ClusterSubscriber exists per cluster instance. This works because the Redis cluster bus forwards m
 * messages between shards. However, this has scalability limitations, which is the reason why the sharded
 * PubSub feature was added to Redis. With sharded PubSub, each shard is responsible for its own messages.
 * Given that, we need at least one ClusterSubscriber per master endpoint/node.
 *
 * This class leverages the previously exising ClusterSubscriber by adding support for multiple such subscribers
 * in alignment to the master nodes of the cluster. The ClusterSubscriber class was extended in a non-breaking way
 * to support this feature.
 */
export default class ClusterSubscriberGroup {
    private cluster;
    private shardedSubscribers;
    private clusterSlots;
    private subscriberToSlotsIndex;
    private channels;
    /**
     * Register callbacks
     *
     * @param cluster
     */
    constructor(cluster: Cluster);
    /**
     * Get the responsible subscriber.
     *
     * Returns null if no subscriber was found
     *
     * @param slot
     */
    getResponsibleSubscriber(slot: number): ClusterSubscriber;
    /**
     * Adds a channel for which this subscriber group is responsible
     *
     * @param channels
     */
    addChannels(channels: (string | Buffer)[]): number;
    /**
     * Removes channels for which the subscriber group is responsible by optionally unsubscribing
     * @param channels
     */
    removeChannels(channels: (string | Buffer)[]): number;
    /**
     * Disconnect all subscribers
     */
    stop(): void;
    /**
     * Start all not yet started subscribers
     */
    start(): void;
    /**
     * Add a subscriber to the group of subscribers
     *
     * @param redis
     */
    private _addSubscriber;
    /**
     * Removes a subscriber from the group
     * @param redis
     */
    private _removeSubscriber;
    /**
     * Refreshes the subscriber-related slot ranges
     *
     * Returns false if no refresh was needed
     *
     * @param cluster
     */
    private _refreshSlots;
    /**
     * Resubscribes to the previous channels
     *
     * @private
     */
    private _resubscribe;
    /**
     * Deep equality of the cluster slots objects
     *
     * @param other
     * @private
     */
    private _slotsAreEqual;
}
