// function reverseString(str) {
//   // Step 1: Split the string into an array of characters
//   const strArray = str.split('')

//   // Step 2: Reverse the array of characters
//   const reversedArray = strArray.reverse()

//   // Step 3: Join the reversed array back into a string
//   const reversedStr = reversedArray.join('')

//   return reversedStr
// }

// // Example usage
// console.log(reverseString('hello')) // Output: "olleh"

// function isPalindrome(str) {
//     // Remove all non-alphanumeric characters and convert to lowercase
//     const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');

//     // Reverse the cleaned string
//     const reversedStr = cleanedStr.split('').reverse().join('');

//     // Check if the cleaned string is the same as the reversed string
//     return cleanedStr === reversedStr;
// }

// // Example usage
// console.log(isPalindrome("mom"));       // Output: false
// console.log(isPalindrome("a Peopel"));    // Output: false
// console.log(isPalindrome("A man, a plan, a canal: Panama")); // Output: true
// console.log(isPalindrome("Racecar"));     // Output: true


// function findMissingNumbers(arr) {
//   // Find the minimum and maximum values in the array
//   const min = Math.min(...arr);
//   const max = Math.max(...arr);
  
//   const missingNumbers = [];

//   // Loop through the range from min to max
//   for (let i = min; i <= max; i++) {
//     // If the current number is not in the array, add it to the missing numbers array
//     if (!arr.includes(i)) {
//       missingNumbers.push(i);
//     }
//   }

//   return missingNumbers;
// }

// // Example usage
// const numbers = [1, 2, 5];
// const missingNumbers = findMissingNumbers(numbers);
// console.log(missingNumbers.join(', ')); // Output: "3, 4"



// Function to find the intersection of two arrays without repetition
// function intersectArrays1(arr1,arr2){
//     const set1 = new Set(arr1)
//     const set2 = new Set(arr2);
//     const intersection = [...set1].filter(x => set2.has(x));
//     return intersection;
// }
// const array1 = [1, 2, 3, 4, 5];
// const array2 = [4, 5, 6, 7, 8, 5];

// const result = intersectArrays(array1, array2);
// console.log(result); // Output: [4, 5]

// //user input way
// const readline = require('readline');

// // Create an interface for reading input from the user
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Function to find the intersection of two arrays without repetition
// function intersectArrays(arr1, arr2) {
//   // Convert both arrays to Sets to remove duplicates
//   const set1 = new Set(arr1);
//   const set2 = new Set(arr2);

//   // Find the intersection of the two sets
//   const intersection = [...set1].filter(item => set2.has(item));

//   return intersection;
// }

// // Function to get user input
// function getUserInput(question) {
//   return new Promise((resolve) => {
//     rl.question(question, (answer) => {
//       resolve(answer);
//     });
//   });
// }

// // Main function to execute the input prompts and process the arrays
// async function main() {
//   try {
//     const input1 = await getUserInput("Enter the first array (comma-separated values): ");
//     const input2 = await getUserInput("Enter the second array (comma-separated values): ");

//     // Convert the input strings to arrays
//     const array1 = input1.split(',').map(item => item.trim());
//     const array2 = input2.split(',').map(item => item.trim());

//     // Call the function with user input
//     const result = intersectArrays(array1, array2);
//     console.log(`Intersection of the arrays: ${result.join(', ')}`); // Output the result

//   } finally {
//     rl.close(); // Close the readline interface
//   }
// }

// main(); // Run the main function
function getDaysBetweenDates(date1, date2) {
  // Convert both dates to milliseconds
  const date1Ms = new Date(date1).getTime()
  const date2Ms = new Date(date2).getTime()

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date2Ms - date1Ms)

  // Convert milliseconds to days
  const daysDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24))

  return daysDifference
}

// Example usage
const date1 = '2024-08-01'
const date2 = '2024-09-23'

const result = getDaysBetweenDates(date1, date2)
console.log(`Number of days between ${date1} and ${date2} is: ${result}`)
