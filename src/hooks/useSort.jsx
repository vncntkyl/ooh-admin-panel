import { useState, useEffect } from "react";

// Custom hook for sorting an array of objects based on a given key
const useSort = (initialArray, initialSortKey) => {
  const [array, setArray] = useState(initialArray);
  const [sortKey, setSortKey] = useState(initialSortKey);

  useEffect(() => {
    if (!array) return;
    console.log(array);
    // Function to sort the array based on the current sort key

    const sortedArray = [...array];
    // Update the state with the sorted array
    setArray(sortedArray);
  }, [array, sortKey]);

  // Function to update the sort key
  const sort = (newSortKey) => {
    setSortKey(newSortKey);
  };

  return [array, sort];
};

export default useSort;
