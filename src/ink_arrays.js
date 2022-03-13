function InkArray(id_)
{
    let id = id_;
    this.items = new Array();

    let refCount = 1;
    this.incRefCount = function() {
        refCount++;
        return refCount;
    };
    this.decRefCount = function() {
        refCount--;
        return refCount;
    };
    this.getRefCount = function() {
        return refCount;
    };
    this.getId = function() {
        return id;
    };
    this.copyFrom = function(inkArray) {
        this.items = Array.from(inkArray.items);
        return this;
    };
}
function InkArrays()
{
    this._nextId = 1;
    
    // makes and returns the next array id.
    this.nextId = function()
    {
        let result = this._nextId;
        this._nextId++;
        return "arr_" + result;
    };


    this.arrays = {};

    // get or create an array with the given id.
    // returns the array of type InkArray.
    this.getArray = function(array_id)
    {
        if (!this.exists(array_id))
        {
            this.arrays[array_id] = new InkArray(array_id);
        }
        return this.arrays[array_id];
    };

    this.bindToInk = function(inkStory)
    {
        let PURE = true;
        let ACTION = false;

        inkStory.BindExternalFunction("Array_invalid",        this.invalidId.bind(this),         PURE);
        inkStory.BindExternalFunction("Array_isInvalid",      this.isInvalidId.bind(this),       PURE);
        inkStory.BindExternalFunction("Array_new",            this.newArray.bind(this),          ACTION);
        inkStory.BindExternalFunction("Array_exist",          this.exists.bind(this),            PURE);
        inkStory.BindExternalFunction("Array_copy",           this.copyArray.bind(this),         ACTION);
        inkStory.BindExternalFunction("Array_ref",            this.referenceArray.bind(this),    ACTION);
        inkStory.BindExternalFunction("Array_release",        this.releaseArray.bind(this),      ACTION);
        inkStory.BindExternalFunction("Array_referenceCount", this.referencesOfArray.bind(this), PURE);
        inkStory.BindExternalFunction("Array_get",            this.getArrayItem.bind(this),      PURE);
        inkStory.BindExternalFunction("Array_set",            this.setArrayItem.bind(this),      ACTION);
        inkStory.BindExternalFunction("Array_remove",         this.removeArrayItem.bind(this),   ACTION);
        inkStory.BindExternalFunction("Array_clear",          this.clearArray.bind(this),        ACTION);
        inkStory.BindExternalFunction("Array_size",           this.getSizeOfArray.bind(this),    PURE);
        inkStory.BindExternalFunction("Array_find",           this.findInArray.bind(this),       PURE);
        inkStory.BindExternalFunction("Array_pushBack",       this.pushBackArray.bind(this),     ACTION);
        return this;
    };

// functions bindable to ink:

    // returns an invalid array id.
    this.invalidId = function()
    {
        return "invalid";
    };

    // returns whether the given id is valid or not.
    this.isInvalidId = function(array_id)
    {
        return this.invalidId() == array_id;
    };

    // make a new empty array.
    // returns id to the new array.
    this.newArray = function()
    {
        let id = this.nextId();
        let array = this.getArray(id);
        return array.getId();
    };

    // returns whether the given array exists
    this.exists = function(array_id)
    {
        return (array_id in this.arrays ? true : false);
    };

    // make a copy of the given array.
    // returns id to the new array.
    this.copyArray = function(array_id)
    {
        let source = this.getArray(array_id);
        let copy_id = this.newArray();
        this.arrays[copy_id].copyFrom(source);
        return copy_id;
    };

    // make a reference to the given array.
    // increases reference count to the given array.
    // returns id to the referenced array
    this.referenceArray = function(array_id)
    {
        let array = this.getArray(array_id);
        array.incRefCount();
        return array_id;
    };

    // release the array.
    // decreases reference count to the array.
    // when reference count reaches zero, the array will be released from memory.
    // returns the remaining reference count
    this.releaseArray = function(array_id)
    {
        let refCount = 0;
        if (this.exists(array_id))
        {
            refCount = this.arrays[array_id].decRefCount();
            if (refCount <= 0)
            {
                delete this.arrays[array_id];
            }
        }
        return refCount;
    };

    // returns reference count to the array.
    this.referencesOfArray = function(array_id)
    {
        let refCount = 0;
        if (this.exists(array_id))
        {
            refCount = this.arrays[array_id].getRefCount();
        }
        return refCount;
    };

    // returns the item value for a given index from the array.
    this.getArrayItem = function(array_id, index, default_value="")
    {
        if (!this.exists(array_id)) return default_value;
        let array = this.getArray(array_id);
        if (!(index in array.items)) return default_value;
        return array.items[index];
    };

    // set item value in array.
    this.setArrayItem = function(array_id, index, value)
    {
        let array = this.getArray(array_id);
        array.items[index] = value;
        return true;
    };

    // remove the item with the given index from the array.
    // returns size of the array after removal.
    this.removeArrayItem = function(array_id, index)
    {
        if (!this.exists(array_id)) return 0;
        let array = this.getArray(array_id);
        array.items.splice(index, 1);
        return array.items.length;
    };

    // removes all items from the array.
    this.clearArray = function(array_id)
    {
        if (!this.exists(array_id)) return;
        let array = this.getArray(array_id);
        array.items.length = 0;
    };

    // returns the size of the array.
    this.getSizeOfArray = function(array_id)
    {
        if (!this.exists(array_id)) return 0;
        let array = this.getArray(array_id);
        return array.items.length;
    };

    // returns the first index where the item equals the value, or size of array if not found.
    this.findInArray = function(array_id, value)
    {
        if (!this.exists(array_id)) return -1;
        let array = this.getArray(array_id);
        for (let i=0; i<array.items.length; ++i)
        {
            if(array.items[i] === value)
            {
                return i;
            }
        }
        return array.items.length;
    };

    // appends the value to the array.
    // returns the new size of the array.
    this.pushBackArray = function(array_id, value)
    {
        let array = this.getArray(array_id);
        let idx = array.items.length;
        array.items.push(value);
        return idx;
    };

}