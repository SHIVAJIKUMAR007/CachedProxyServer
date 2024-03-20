class LinkNode <K,T>{
    key:K|null;
    data: T|null;
    prev: LinkNode<K,T> | null;
    next: LinkNode<K,T> | null;

    constructor(key:K|null,data: T|null) {
        this.key=key;
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}


export class LRUCache<K,T>{
    private capacity : number;
    private cache: Map<K,LinkNode<K,T>>;
    private head:LinkNode<K,T>;
    private tail: LinkNode<K,T>;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map<K, LinkNode<K,T>>();
        this.head = new LinkNode<K,T>(null,null);
        this.tail = new LinkNode<K,T>(null,null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    removeNode(node:LinkNode<K,T>|null){
        if(!node) return;
        let nextNode:LinkNode<K,T>|null = node.next;
        let prevNode:LinkNode<K,T>|null = node.prev;
        if(prevNode) prevNode.next = nextNode;
        if(nextNode) nextNode.prev = prevNode;
    }

    addAfterHead(key:K|null,value:T|null):LinkNode<K,T>{
        let newNode = new LinkNode(key,value);
        let headNext:LinkNode<K,T>|null = this.head.next;
        if(headNext) headNext.prev = newNode;
        newNode.next = headNext;
        this.head.next = newNode;
        newNode.prev=this.head;
        return newNode;
    }
    

    get(key:K) {
        if(this.cache.has(key) && this.cache.get(key) != undefined){
            let ThisNode:LinkNode<K,T> | undefined = this.cache.get(key);
            if(ThisNode) {
                this.addAfterHead(ThisNode.key,ThisNode.data);
                this.removeNode(ThisNode);
                return ThisNode.data;
            }
            else{
                return undefined;
            }
        }else{
            return undefined;
        }
    }

    put(key:K,value:T){
        if(this.cache.has(key)){
            let ThisNode:LinkNode<K,T> | undefined = this.cache.get(key);
            if(ThisNode) {
                this.cache.set(key,this.addAfterHead(key,value));
                this.removeNode(ThisNode);
                console.log("already in cache just updated the result.");
            }
        }
        else if(this.cache.size<this.capacity){
            this.cache.set(key,this.addAfterHead(key,value));
            console.log("cache space was available");
        }else{
            let nodeToRemove:LinkNode<K,T>|null = this.tail.prev;
            console.log("cache is full need to eviction key: "+ nodeToRemove?.key);
            if(nodeToRemove !=null && nodeToRemove.key !=null ) this.cache.delete(nodeToRemove.key);
            this.removeNode(nodeToRemove);
            this.cache.set(key,this.addAfterHead(key,value));
        }
    }

}