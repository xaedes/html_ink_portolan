function InkDictionary(id_)
{
    let id = id_;
    this.items = new Map();

    this._refCount = 1;

    this.incRefCount = function() {
        this._refCount++;
        return this._refCount;
    };
    this.decRefCount = function() {
        this._refCount--;
        return this._refCount;
    };
    this.getRefCount = function() {
        return this._refCount;
    };
    this.getId = function() {
        return id;
    };
    this.copyFrom = function(inkDictionary) {
        this.items.clear();
        for (const [key, value] of inkDictionary.items.entries())
        {
            this.items.set(key, value);
        }
        return this;
    };

}
function InkDictionaries()
{
    this._nextId = 1;
    
    // makes and returns the next dictionary id.
    this.nextId = function()
    {
        let result = this._nextId;
        this._nextId++;
        return "dct_" + result;
    };


    this.dictionaries = {};

    // get or create an dictionary with the given id.
    // returns the dictionary of type InkDictionary.
    this.getDictionary = function(dict_id)
    {
        if (!this.exists(dict_id))
        {
            this.dictionaries[dict_id] = new InkDictionary(dict_id);
        }
        return this.dictionaries[dict_id];
    };

    this.bindToInk = function(inkStory)
    {
        let PURE = true;
        let ACTION = false;

        inkStory.BindExternalFunction("Dictionary_invalid",        this.invalidId.bind(this),              PURE);
        inkStory.BindExternalFunction("Dictionary_isInvalid",      this.isInvalidId.bind(this),            PURE);
        inkStory.BindExternalFunction("Dictionary_new",            this.newDictionary.bind(this),          ACTION);
        inkStory.BindExternalFunction("Dictionary_exist",          this.exists.bind(this),                 PURE);
        inkStory.BindExternalFunction("Dictionary_copy",           this.copyDictionary.bind(this),         ACTION);
        inkStory.BindExternalFunction("Dictionary_ref",            this.referenceDictionary.bind(this),    ACTION);
        inkStory.BindExternalFunction("Dictionary_release",        this.releaseDictionary.bind(this),      ACTION);
        inkStory.BindExternalFunction("Dictionary_referenceCount", this.referencesOfDictionary.bind(this), PURE);
        inkStory.BindExternalFunction("Dictionary_getKey",         this.getDictionaryKey.bind(this),       PURE);
        inkStory.BindExternalFunction("Dictionary_has",            this.hasDictionaryItem.bind(this),      PURE);
        inkStory.BindExternalFunction("Dictionary_get",            this.getDictionaryItem.bind(this),      PURE);
        inkStory.BindExternalFunction("Dictionary_set",            this.setDictionaryItem.bind(this),      ACTION);
        inkStory.BindExternalFunction("Dictionary_remove",         this.removeDictionaryItem.bind(this),   ACTION);
        inkStory.BindExternalFunction("Dictionary_clear",          this.clearDictionary.bind(this),        ACTION);
        inkStory.BindExternalFunction("Dictionary_size",           this.getSizeOfDictionary.bind(this),    PURE);
        inkStory.BindExternalFunction("Dictionary_find",           this.findInDictionary.bind(this),       PURE);
        inkStory.BindExternalFunction("Dictionary_inverse",        this.inverseOfDictionary.bind(this),    ACTION);
        return this;
    };

// functions bindable to ink:

    // returns an invalid dictionary id.
    this.invalidId = function()
    {
        return "invalid";
    };

    // returns whether the given id is valid or not.
    this.isInvalidId = function(dict_id)
    {
        return this.invalidId() == dict_id;
    };

    // make a new empty dictionary.
    // returns id to the new dictionary.
    this.newDictionary = function()
    {
        let id = this.nextId();
        let dict = this.getDictionary(id);
        return dict.getId();
    };

    // returns whether the given dictionary exists
    this.exists = function(dict_id)
    {
        return (dict_id in this.dictionaries ? true : false);
    };

    // make a copy of the given dictionary.
    // returns id to the new dictionary.
    this.copyDictionary = function(dict_id)
    {
        let source = this.getDictionary(dict_id);
        let copy_id = this.newDictionary();
        this.dictionaries[copy_id].copyFrom(source);
        return copy_id;
    };

    // make a reference to the given dictionary.
    // increases reference count to the given dictionary.
    // returns id to the referenced dictionary
    this.referenceDictionary = function(dict_id)
    {
        let dict = this.getDictionary(dict_id);
        dict.incRefCount();
        return dict_id;
    };

    // release the dictionary.
    // decreases reference count to the dictionary.
    // when reference count reaches zero, the dictionary will be released from memory.
    // returns the remaining reference count
    this.releaseDictionary = function(dict_id)
    {
        let refCount = 0;
        if (this.exists(dict_id))
        {
            refCount = this.dictionaries[dict_id].decRefCount();
            if (refCount <= 0)
            {
                delete this.dictionaries[dict_id];
            }
        }
        return refCount;
    };

    // returns reference count to the dictionary.
    this.referencesOfDictionary = function(dict_id)
    {
        let refCount = 0;
        if (this.exists(dict_id))
        {
            refCount = this.dictionaries[dict_id].getRefCount();
        }
        return refCount;
    };

    // returns a key from the list of dictionary keys.
    this.getDictionaryKey = function(dict_id, index, default_value="")
    {
        if (!this.exists(dict_id)) return default_value;
        let dict = this.getDictionary(dict_id);
        if (index >= dict.items.size) return default_value;
        let entries = Array.from(dict.items.entries());
        let key = entries[index][0];
        return key;
    };

    // returns the item value for a given key from the dictionary.
    this.hasDictionaryItem = function(dict_id, key)
    {
        if (!this.exists(dict_id)) return false;
        let dict = this.getDictionary(dict_id);
        return dict.items.has(key);
    };

    // returns the item value for a given key from the dictionary.
    this.getDictionaryItem = function(dict_id, key, default_value="")
    {
        if (!this.exists(dict_id)) return default_value;
        let dict = this.getDictionary(dict_id);
        if (!dict.items.has(key)) return default_value;
        return dict.items.get(key);
    };

    // set item value in dictionary.
    this.setDictionaryItem = function(dict_id, key, value)
    {
        let dict = this.getDictionary(dict_id);
        dict.items.set(key, value);
        return true;
    };

    // remove the item with the given key from the dictionary. 
    // returns size of the dictionary after removal.
    this.removeDictionaryItem = function(dict_id, key)
    {
        if (!this.exists(dict_id)) return;
        let dict = this.getDictionary(dict_id);
        dict.items.delete(key);
        return dict.items.size;
    };

    // removes all items from the dictionary.
    this.clearDictionary = function(dict_id)
    {
        if (!this.exists(dict_id)) return;
        let dict = this.getDictionary(dict_id);
        dict.items.clear();
    };

    // returns the size of the dictionary.
    this.getSizeOfDictionary = function(dict_id)
    {
        if (!this.exists(dict_id)) return 0;
        let dict = this.getDictionary(dict_id);
        return dict.items.size;
    };

    // returns the first key where the item equals the value, or notfound.
    this.findInDictionary = function(dict_id, find_value, notfound)
    {
        if (!this.exists(dict_id)) return notfound;
        let dict = this.getDictionary(dict_id);
        for (const [key, value] of dict.items.entries())
        {
            if(value === find_value)
            {
                return key;
            }
        }
        return notfound;
    };

    // returns inverse dictionary with values as keys and keys as values.
    // the new entries are inserted in the same order as the original dictionary,
    // possibly overwriting duplicate keys.
    this.inverseOfDictionary = function(dict_id)
    {
        let new_id = this.newDictionary();
        if (this.exists(dict_id))
        {
            let new_dict = this.getDictionary(new_id);
            let dict = this.getDictionary(dict_id);
            for (const [key, value] of dict.items.entries())
            {
                new_dict.items.set(value, key);
            }
        }
        return new_id;
    }

}