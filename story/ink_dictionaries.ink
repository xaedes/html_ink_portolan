
// returns an invalid dictionary id.
EXTERNAL Dictionary_invalid() 

// returns whether the given id is valid or not.
EXTERNAL Dictionary_isInvalid(dictionary) 

// make a new empty dictionary.
// returns id to the new dictionary.
EXTERNAL Dictionary_new() 

// returns whether the given dictionary exists
EXTERNAL Dictionary_exist(dictionary)

// make a copy of the given dictionary.
// returns id to the new dictionary.
EXTERNAL Dictionary_copy(dictionary) 

// make a reference to the given dictionary.
// increases reference count to the given dictionary.
// returns id to the referenced dictionary
EXTERNAL Dictionary_ref(dictionary)  

// release the dictionary.
// decreases reference count to the dictionary.
// when reference count reaches zero, the dictionary will be released from memory.
// returns the remaining reference count
EXTERNAL Dictionary_release(dictionary)

// returns reference count to the dictionary.
EXTERNAL Dictionary_referenceCount(dictionary)

// returns a key from the list of dictionary keys.
EXTERNAL Dictionary_getKey(dictionary, index)

// returns whether the dictionary contains the given key.
EXTERNAL Dictionary_has(dictionary, key)

// returns the item value for a given key from the dictionary.
EXTERNAL Dictionary_get(dictionary, key)

// set item value in dictionary.
EXTERNAL Dictionary_set(dictionary, key, value)

// remove the item with the given key from the dictionary. 
// returns size of the dictionary after removal.
EXTERNAL Dictionary_remove(dictionary, key)

// removes all items from the dictionary. 
EXTERNAL Dictionary_clear(dictionary)

// returns the size of the dictionary.
EXTERNAL Dictionary_size(dictionary)

// returns the first key where the item equals the value, or notfound.
EXTERNAL Dictionary_find(dictionary, value, notfound)

// returns inverse dictionary with values as keys and keys as values.
// the new entries are inserted in the same order as the original dictionary,
// possibly overwriting duplicate keys.
EXTERNAL Dictionary_inverse(dictionary) 


=== ink_dictionaries_demo(->next) ===
~ temp dct_invalid = Dictionary_invalid()
~ temp is_dct_invalid = Dictionary_isInvalid(dct_invalid)

dct_invalid: {dct_invalid}

is_dct_invalid({dct_invalid}): {is_dct_invalid}

~ temp dct_int_to_str = Dictionary_new()
~ Dictionary_set(dct_int_to_str, 1, "one")
~ Dictionary_set(dct_int_to_str, 2, "two")
~ Dictionary_set(dct_int_to_str, 3, "three")

~ temp dct_str_to_int = Dictionary_inverse(dct_int_to_str)


->loop(next, dct_int_to_str, dct_str_to_int, 0)

= loop(->next, dct_i2s, dct_s2i, idx)
{idx < Dictionary_size(dct_i2s):
  ~ temp key_i2s = Dictionary_getKey(dct_i2s, idx)
  dct_i2s\[{key_i2s}\] : {Dictionary_get(dct_i2s, key_i2s)}

  ~ temp key_s2i = Dictionary_getKey(dct_s2i, idx)
  dct_s2i\[{key_s2i}\] : {Dictionary_get(dct_s2i, key_s2i)}

  -> loop(next, dct_i2s, dct_s2i, idx + 1)
}

->next
