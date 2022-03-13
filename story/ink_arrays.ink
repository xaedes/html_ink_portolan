
// returns an invalid array id.
EXTERNAL Array_invalid() 

// returns whether the given id is valid or not.
EXTERNAL Array_isInvalid(array) 

// make a new empty array.
// returns id to the new array.
EXTERNAL Array_new() 

// returns whether the given array exists
EXTERNAL Array_exist(array)

// make a copy of the given array.
// returns id to the new array.
EXTERNAL Array_copy(array) 

// make a reference to the given array.
// increases reference count to the given array.
// returns id to the referenced array
EXTERNAL Array_ref(array)  

// release the array.
// decreases reference count to the array.
// when reference count reaches zero, the array will be released from memory.
// returns the remaining reference count
EXTERNAL Array_release(array)

// returns reference count to the array.
EXTERNAL Array_referenceCount(array)

// returns the item value for a given index from the array.
EXTERNAL Array_get(array, index)

// set item value in array.
EXTERNAL Array_set(array, index, value)

// remove the item with the given index from the array. 
// returns size of the array after removal.
EXTERNAL Array_remove(array, index)

// removes all items from the array. 
EXTERNAL Array_clear(array)

// returns the size of the array.
EXTERNAL Array_size(array)

// returns the first index where the item equals the value, or size of array if not found.
EXTERNAL Array_find(array, value)

// appends the value to the array.
// returns the new size of the array.
EXTERNAL Array_pushBack(array, value)

=== ink_arrays_demo(->next) ===
~ temp arr_invalid = Array_invalid()
~ temp is_arr_invalid = Array_isInvalid(arr_invalid)

arr_invalid: {arr_invalid}

is_arr_invalid({arr_invalid}): {is_arr_invalid}

~ temp arr_foo = Array_new()
~ Array_pushBack(arr_foo, 1)
~ Array_pushBack(arr_foo, 2)
~ Array_pushBack(arr_foo, 3)
~ temp idx_4 = Array_pushBack(arr_foo, 4)
~ Array_pushBack(arr_foo, "one")
~ Array_pushBack(arr_foo, "two")
~ Array_pushBack(arr_foo, "three")

~ Array_remove(arr_foo, idx_4)
~ temp idx_one = Array_find(arr_foo, "one")

idx_one: {idx_one}

->loop(next, arr_foo, 0)

= loop(->next,arr_foo,idx)
{idx < Array_size(arr_foo):
  
  arr_foo\[{idx}\] : {Array_get(arr_foo, idx)}

  -> loop(next, arr_foo, idx + 1)
}

->next
