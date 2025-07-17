import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  template: string;
  testCases: { input: string; expectedOutput: string }[];
  solution?: string;
  points: number;
}

interface ProblemContextType {
  problems: Problem[];
  getProblemById: (id: string) => Problem | undefined;
  createProblem: (problem: Omit<Problem, 'id'>) => Promise<void>;
  updateProblem: (id: string, problem: Partial<Problem>) => Promise<void>;
  deleteProblem: (id: string) => Promise<void>;
  categories: string[];
  runTests: (problemId: string, code: string) => Promise<{ passed: boolean; results: any[]; output: string }>;
  fetchProblems: () => Promise<void>;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export function ProblemProvider({ children }: { children: React.ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { user } = useAuth();

  const initializeDefaultProblems = async () => {
    try {
      // Check if problems already exist
      const problemsCollection = collection(db, 'problems');
      const problemsSnapshot = await getDocs(problemsCollection);
      
      if (problemsSnapshot.empty) {
        // Add default JavaScript problems
        const defaultProblems = [
          {
            title: "Two Sum",
            difficulty: 'Easy' as const,
            category: "Arrays",
            description: "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
            template: 'function twoSum(nums, target) {\n    // Your code here\n    // Return array of two indices\n}',
            examples: [
              { 
                input: '[2,7,11,15], 9', 
                output: '[0,1]', 
                explanation: 'nums[0] + nums[1] = 2 + 7 = 9' 
              }
            ],
            constraints: ['2 ≤ nums.length ≤ 10^4', '-10^9 ≤ nums[i] ≤ 10^9', 'Only one valid answer exists'],
            testCases: [
              { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
              { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
              { input: '[3,3], 6', expectedOutput: '[0,1]' }
            ],
            points: 10
          },
          {
            title: "Reverse String",
            difficulty: 'Easy' as const,
            category: "Strings",
            description: "Write a function that reverses a string. The input string is given as an array of characters.",
            template: 'function reverseString(s) {\n    // Your code here\n    // Modify s in-place\n}',
            examples: [
              { 
                input: '["h","e","l","l","o"]', 
                output: '["o","l","l","e","h"]', 
                explanation: 'Reverse the array of characters in-place' 
              }
            ],
            constraints: ['1 ≤ s.length ≤ 10^5', 's[i] is a printable ascii character'],
            testCases: [
              { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
              { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' }
            ],
            points: 5
          },
          {
            title: "Valid Parentheses",
            difficulty: 'Easy' as const,
            category: "Stack",
            description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            template: 'function isValid(s) {\n    // Your code here\n    // Return true if valid, false otherwise\n}',
            examples: [
              { 
                input: '"()"', 
                output: 'true', 
                explanation: 'The parentheses are properly matched' 
              },
              { 
                input: '"()[]{}"', 
                output: 'true', 
                explanation: 'All brackets are properly matched' 
              },
              { 
                input: '"(]"', 
                output: 'false', 
                explanation: 'Mismatched bracket types' 
              }
            ],
            constraints: ['1 ≤ s.length ≤ 10^4', 's consists of parentheses only'],
            testCases: [
              { input: '"()"', expectedOutput: 'true' },
              { input: '"()[]{}"', expectedOutput: 'true' },
              { input: '"(]"', expectedOutput: 'false' },
              { input: '"([)]"', expectedOutput: 'false' },
              { input: '"{[]}"', expectedOutput: 'true' }
            ],
            points: 15
          },
          {
            title: "Maximum Subarray",
            difficulty: 'Medium' as const,
            category: "Dynamic Programming",
            description: "Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.",
            template: 'function maxSubArray(nums) {\n    // Your code here\n    // Return the maximum sum\n}',
            examples: [
              { 
                input: '[-2,1,-3,4,-1,2,1,-5,4]', 
                output: '6', 
                explanation: '[4,-1,2,1] has the largest sum = 6' 
              }
            ],
            constraints: ['1 ≤ nums.length ≤ 10^5', '-10^4 ≤ nums[i] ≤ 10^4'],
            testCases: [
              { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
              { input: '[1]', expectedOutput: '1' },
              { input: '[5,4,-1,7,8]', expectedOutput: '23' }
            ],
            points: 25
          },
          {
            title: "Binary Tree Inorder Traversal",
            difficulty: 'Medium' as const,
            category: "Trees",
            description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
            template: 'function inorderTraversal(root) {\n    // Your code here\n    // Return array of values in inorder\n}',
            examples: [
              { 
                input: '[1,null,2,3]', 
                output: '[1,3,2]', 
                explanation: 'Inorder traversal: left, root, right' 
              }
            ],
            constraints: ['The number of nodes is in range [0, 100]', '-100 ≤ Node.val ≤ 100'],
            testCases: [
              { input: '[1,null,2,3]', expectedOutput: '[1,3,2]' },
              { input: '[]', expectedOutput: '[]' },
              { input: '[1]', expectedOutput: '[1]' }
            ],
            points: 30
          },
          {
            title: "Merge Two Sorted Lists",
            difficulty: 'Easy' as const,
            category: "Linked Lists",
            description: "You are given the heads of two sorted linked lists. Merge the two lists into one sorted list.",
            template: 'function mergeTwoLists(list1, list2) {\n    // Your code here\n    // Return the merged sorted list\n}',
            examples: [
              { 
                input: '[1,2,4], [1,3,4]', 
                output: '[1,1,2,3,4,4]', 
                explanation: 'Merge both sorted lists' 
              }
            ],
            constraints: ['The number of nodes in both lists is in range [0, 50]', '-100 ≤ Node.val ≤ 100'],
            testCases: [
              { input: '[1,2,4], [1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
              { input: '[], []', expectedOutput: '[]' },
              { input: '[], [0]', expectedOutput: '[0]' }
            ],
            points: 20
          },
          {
            title: "Climbing Stairs",
            difficulty: 'Easy' as const,
            category: "Dynamic Programming",
            description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?",
            template: 'function climbStairs(n) {\n    // Your code here\n    // Return number of ways\n}',
            examples: [
              { 
                input: '2', 
                output: '2', 
                explanation: 'Two ways: 1+1 or 2' 
              },
              { 
                input: '3', 
                output: '3', 
                explanation: 'Three ways: 1+1+1, 1+2, or 2+1' 
              }
            ],
            constraints: ['1 ≤ n ≤ 45'],
            testCases: [
              { input: '2', expectedOutput: '2' },
              { input: '3', expectedOutput: '3' },
              { input: '4', expectedOutput: '5' }
            ],
            points: 15
          },
          {
            title: "Best Time to Buy and Sell Stock",
            difficulty: 'Easy' as const,
            category: "Arrays",
            description: "You are given an array prices where prices[i] is the price of a stock on the ith day. Find the maximum profit you can achieve.",
            template: 'function maxProfit(prices) {\n    // Your code here\n    // Return maximum profit\n}',
            examples: [
              { 
                input: '[7,1,5,3,6,4]', 
                output: '5', 
                explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5' 
              }
            ],
            constraints: ['1 ≤ prices.length ≤ 10^5', '0 ≤ prices[i] ≤ 10^4'],
            testCases: [
              { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
              { input: '[7,6,4,3,1]', expectedOutput: '0' }
            ],
            points: 15
          },
          {
            title: "Longest Common Prefix",
            difficulty: 'Easy' as const,
            category: "Strings",
            description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
            template: 'function longestCommonPrefix(strs) {\n    // Your code here\n    // Return the longest common prefix\n}',
            examples: [
              { 
                input: '["flower","flow","flight"]', 
                output: '"fl"', 
                explanation: 'The common prefix is "fl"' 
              }
            ],
            constraints: ['1 ≤ strs.length ≤ 200', '0 ≤ strs[i].length ≤ 200'],
            testCases: [
              { input: '["flower","flow","flight"]', expectedOutput: '"fl"' },
              { input: '["dog","racecar","car"]', expectedOutput: '""' }
            ],
            points: 10
          },
          {
            title: "3Sum",
            difficulty: 'Medium' as const,
            category: "Arrays",
            description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
            template: 'function threeSum(nums) {\n    // Your code here\n    // Return array of triplets\n}',
            examples: [
              { 
                input: '[-1,0,1,2,-1,-4]', 
                output: '[[-1,-1,2],[-1,0,1]]', 
                explanation: 'The distinct triplets that sum to 0' 
              }
            ],
            constraints: ['3 ≤ nums.length ≤ 3000', '-10^5 ≤ nums[i] ≤ 10^5'],
            testCases: [
              { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
              { input: '[0,1,1]', expectedOutput: '[]' },
              { input: '[0,0,0]', expectedOutput: '[[0,0,0]]' }
            ],
            points: 35
          },
          {
            title: "Container With Most Water",
            difficulty: 'Medium' as const,
            category: "Two Pointers",
            description: "You are given an integer array height. Find two lines that together with the x-axis form a container that holds the most water.",
            template: 'function maxArea(height) {\n    // Your code here\n    // Return maximum area\n}',
            examples: [
              { 
                input: '[1,8,6,2,5,4,8,3,7]', 
                output: '49', 
                explanation: 'The maximum area is between indices 1 and 8' 
              }
            ],
            constraints: ['n == height.length', '2 ≤ n ≤ 10^5', '0 ≤ height[i] ≤ 10^4'],
            testCases: [
              { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
              { input: '[1,1]', expectedOutput: '1' }
            ],
            points: 30
          },
          {
            title: "Generate Parentheses",
            difficulty: 'Medium' as const,
            category: "Backtracking",
            description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
            template: 'function generateParenthesis(n) {\n    // Your code here\n    // Return array of valid combinations\n}',
            examples: [
              { 
                input: '3', 
                output: '["((()))","(()())","(())()","()(())","()()()"]', 
                explanation: 'All valid combinations for n=3' 
              }
            ],
            constraints: ['1 ≤ n ≤ 8'],
            testCases: [
              { input: '3', expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]' },
              { input: '1', expectedOutput: '["()"]' }
            ],
            points: 40
          },
          {
            title: "Palindrome Number",
            difficulty: 'Easy' as const,
            category: "Math",
            description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
            template: 'function isPalindrome(x) {\n    // Your code here\n    // Return true if palindrome, false otherwise\n}',
            examples: [
              { 
                input: '121', 
                output: 'true', 
                explanation: '121 reads the same backward as forward' 
              },
              { 
                input: '-121', 
                output: 'false', 
                explanation: 'From left to right, it reads -121. From right to left, it becomes 121-' 
              }
            ],
            constraints: ['-2^31 ≤ x ≤ 2^31 - 1'],
            testCases: [
              { input: '121', expectedOutput: 'true' },
              { input: '-121', expectedOutput: 'false' },
              { input: '10', expectedOutput: 'false' }
            ],
            points: 10
          },
          {
            title: "Roman to Integer",
            difficulty: 'Easy' as const,
            category: "Hash Table",
            description: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Convert a roman numeral to an integer.",
            template: 'function romanToInt(s) {\n    // Your code here\n    // Return the integer value\n}',
            examples: [
              { 
                input: '"III"', 
                output: '3', 
                explanation: 'III = 3' 
              },
              { 
                input: '"LVIII"', 
                output: '58', 
                explanation: 'L = 50, V= 5, III = 3' 
              }
            ],
            constraints: ['1 ≤ s.length ≤ 15', 's contains only characters (I, V, X, L, C, D, M)'],
            testCases: [
              { input: '"III"', expectedOutput: '3' },
              { input: '"LVIII"', expectedOutput: '58' },
              { input: '"MCMXC"', expectedOutput: '1990' }
            ],
            points: 12
          },
          {
            title: "Merge Intervals",
            difficulty: 'Medium' as const,
            category: "Intervals",
            description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
            template: 'function merge(intervals) {\n    // Your code here\n    // Return merged intervals\n}',
            examples: [
              { 
                input: '[[1,3],[2,6],[8,10],[15,18]]', 
                output: '[[1,6],[8,10],[15,18]]', 
                explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6]' 
              }
            ],
            constraints: ['1 ≤ intervals.length ≤ 10^4', 'intervals[i].length == 2'],
            testCases: [
              { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
              { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' }
            ],
            points: 30
          },
          // New problems start here
          {
            title: "Fibonacci Number",
            difficulty: 'Easy' as const,
            category: "Dynamic Programming",
            description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.",
            template: 'function fib(n) {\n    // Your code here\n    // Return the nth Fibonacci number\n}',
            examples: [
              { input: '2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
              { input: '3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.' },
              { input: '4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' }
            ],
            constraints: ['0 <= n <= 30'],
            testCases: [
              { input: '2', expectedOutput: '1' },
              { input: '5', expectedOutput: '5' },
              { input: '10', expectedOutput: '55' }
            ],
            points: 10
          },
          {
            title: "Single Number",
            difficulty: 'Easy' as const,
            category: "Bit Manipulation",
            description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
            template: 'function singleNumber(nums) {\n    // Your code here\n    // Return the single number\n}',
            examples: [
              { input: '[2,2,1]', output: '1', explanation: '1 appears only once.' },
              { input: '[4,1,2,1,2]', output: '4', explanation: '4 appears only once.' }
            ],
            constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'Each element in the array appears twice except for one element which appears only once.'],
            testCases: [
              { input: '[2,2,1]', expectedOutput: '1' },
              { input: '[4,1,2,1,2]', expectedOutput: '4' },
              { input: '[1]', expectedOutput: '1' }
            ],
            points: 15
          },
          {
            title: "Majority Element",
            difficulty: 'Easy' as const,
            category: "Arrays",
            description: "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.",
            template: 'function majorityElement(nums) {\n    // Your code here\n    // Return the majority element\n}',
            examples: [
              { input: '[3,2,3]', output: '3', explanation: '3 appears 2 times which is > 3/2.' },
              { input: '[2,2,1,1,1,2,2]', output: '2', explanation: '2 appears 4 times which is > 7/2.' }
            ],
            constraints: ['n == nums.length', '1 <= n <= 5 * 10^4', '-10^9 <= nums[i] <= 10^9'],
            testCases: [
              { input: '[3,2,3]', expectedOutput: '3' },
              { input: '[2,2,1,1,1,2,2]', expectedOutput: '2' },
              { input: '[6,5,5]', expectedOutput: '5' }
            ],
            points: 15
          },
          {
            title: "Linked List Cycle",
            difficulty: 'Easy' as const,
            category: "Linked Lists",
            description: "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.",
            template: 'function hasCycle(head) {\n    // Your code here\n    // Return true if there is a cycle, false otherwise\n}',
            examples: [
              { input: '[3,2,0,-4] with pos = 1', output: 'true', explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).' }
            ],
            constraints: ['The number of the nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index in the linked-list.'],
            testCases: [
              { input: '[3,2,0,-4], 1', expectedOutput: 'true' },
              { input: '[1,2], 0', expectedOutput: 'true' },
              { input: '[1], -1', expectedOutput: 'false' }
            ],
            points: 20
          },
          {
            title: "Symmetric Tree",
            difficulty: 'Easy' as const,
            category: "Trees",
            description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
            template: 'function isSymmetric(root) {\n    // Your code here\n    // Return true if the tree is symmetric, false otherwise\n}',
            examples: [
              { input: '[1,2,2,3,4,4,3]', output: 'true', explanation: 'The tree is symmetric.' },
              { input: '[1,2,2,null,3,null,3]', output: 'false', explanation: 'The tree is not symmetric.' }
            ],
            constraints: ['The number of nodes in the tree is in the range [1, 1000].', '-100 <= Node.val <= 100'],
            testCases: [
              { input: '[1,2,2,3,4,4,3]', expectedOutput: 'true' },
              { input: '[1,2,2,null,3,null,3]', expectedOutput: 'false' }
            ],
            points: 20
          },
          {
            title: "Product of Array Except Self",
            difficulty: 'Medium' as const,
            category: "Arrays",
            description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
            template: 'function productExceptSelf(nums) {\n    // Your code here\n    // Return the new array\n}',
            examples: [
              { input: '[1,2,3,4]', output: '[24,12,8,6]', explanation: 'Result array.' },
              { input: '[-1,1,0,-3,3]', output: '[0,0,9,0,0]', explanation: 'Result array.' }
            ],
            constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.'],
            testCases: [
              { input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]' },
              { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]' }
            ],
            points: 30
          },
          {
            title: "Kth Smallest Element in a BST",
            difficulty: 'Medium' as const,
            category: "Trees",
            description: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
            template: 'function kthSmallest(root, k) {\n    // Your code here\n    // Return the kth smallest value\n}',
            examples: [
              { input: '[3,1,4,null,2], 1', output: '1', explanation: 'The smallest element is 1.' },
              { input: '[5,3,6,2,4,null,null,1], 3', output: '3', explanation: 'The 3rd smallest element is 3.' }
            ],
            constraints: ['The number of nodes in the tree is n.', '1 <= k <= n <= 10^4', '0 <= Node.val <= 10^4'],
            testCases: [
              { input: '[3,1,4,null,2], 1', expectedOutput: '1' },
              { input: '[5,3,6,2,4,null,null,1], 3', expectedOutput: '3' }
            ],
            points: 35
          },
          {
            title: "Coin Change",
            difficulty: 'Medium' as const,
            category: "Dynamic Programming",
            description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
            template: 'function coinChange(coins, amount) {\n    // Your code here\n    // Return the fewest number of coins\n}',
            examples: [
              { input: '[1,2,5], 11', output: '3', explanation: '11 = 5 + 5 + 1' },
              { input: '[2], 3', output: '-1', explanation: 'Cannot make up the amount.' }
            ],
            constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
            testCases: [
              { input: '[1,2,5], 11', expectedOutput: '3' },
              { input: '[2], 3', expectedOutput: '-1' },
              { input: '[1], 0', expectedOutput: '0' }
            ],
            points: 40
          },
          {
            title: "Number of Islands",
            difficulty: 'Medium' as const,
            category: "Graphs",
            description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
            template: 'function numIslands(grid) {\n    // Your code here\n    // Return the number of islands\n}',
            examples: [
              { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: 'A single island.' }
            ],
            constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
            testCases: [
              { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
              { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' }
            ],
            points: 35
          },
          {
            title: "Group Anagrams",
            difficulty: 'Medium' as const,
            category: "Hash Table",
            description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
            template: 'function groupAnagrams(strs) {\n    // Your code here\n    // Return the grouped anagrams\n}',
            examples: [
              { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Grouped by anagrams.' }
            ],
            constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
            testCases: [
              { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
              { input: '[""]', expectedOutput: '[[""]]' },
              { input: '["a"]', expectedOutput: '[["a"]]' }
            ],
            points: 30
          },
          {
            title: "Median of Two Sorted Arrays",
            difficulty: 'Hard' as const,
            category: "Binary Search",
            description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
            template: 'function findMedianSortedArrays(nums1, nums2) {\n    // Your code here\n    // Return the median\n}',
            examples: [
              { input: '[1,3], [2]', output: '2.00000', explanation: 'merged array = [1,2,3] and median is 2.' },
              { input: '[1,2], [3,4]', output: '2.50000', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' }
            ],
            constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
            testCases: [
              { input: '[1,3], [2]', expectedOutput: '2' },
              { input: '[1,2], [3,4]', expectedOutput: '2.5' }
            ],
            points: 50
          },
          {
            title: "Trapping Rain Water",
            difficulty: 'Hard' as const,
            category: "Two Pointers",
            description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            template: 'function trap(height) {\n    // Your code here\n    // Return the amount of trapped water\n}',
            examples: [
              { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The trapped water is 6 units.' },
              { input: '[4,2,0,3,2,5]', output: '9', explanation: 'The trapped water is 9 units.' }
            ],
            constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
            testCases: [
              { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
              { input: '[4,2,0,3,2,5]', expectedOutput: '9' }
            ],
            points: 55
          },
          {
            title: "Word Ladder",
            difficulty: 'Hard' as const,
            category: "Graphs",
            description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter, and every si is in wordList. Return the length of the shortest transformation sequence, or 0 if no such sequence exists.",
            template: 'function ladderLength(beginWord, endWord, wordList) {\n    // Your code here\n    // Return the length of the shortest transformation\n}',
            examples: [
              { input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'One shortest transformation is "hit" -> "hot" -> "dot" -> "dog" -> "cog".' }
            ],
            constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000', 'wordList[i].length == beginWord.length', 'beginWord, endWord, and wordList[i] consist of lowercase English letters.', 'beginWord != endWord', 'All the strings in wordList are unique.'],
            testCases: [
              { input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', expectedOutput: '5' },
              { input: '"hit", "cog", ["hot","dot","dog","lot","log"]', expectedOutput: '0' }
            ],
            points: 60
          },
          {
            title: "Largest Rectangle in Histogram",
            difficulty: 'Hard' as const,
            category: "Stack",
            description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
            template: 'function largestRectangleArea(heights) {\n    // Your code here\n    // Return the area of the largest rectangle\n}',
            examples: [
              { input: '[2,1,5,6,2,3]', output: '10', explanation: 'The largest rectangle is shown in the red area, which has an area = 10 units.' }
            ],
            constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
            testCases: [
              { input: '[2,1,5,6,2,3]', expectedOutput: '10' },
              { input: '[2,4]', expectedOutput: '4' }
            ],
            points: 65
          },
          {
            title: "Regular Expression Matching",
            difficulty: 'Hard' as const,
            category: "Dynamic Programming",
            description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
            template: 'function isMatch(s, p) {\n    // Your code here\n    // Return true if the pattern matches the string\n}',
            examples: [
              { input: '"aa", "a"', output: 'false', explanation: '"a" does not match the entire string "aa".' },
              { input: '"aa", "a*"', output: 'true', explanation: '\'*\' means zero or more of the preceding element, \'a\'. Therefore, by repeating \'a\' once, it becomes "aa".' },
              { input: '"ab", ".*"', output: 'true', explanation: '".*" means "zero or more of any character".' }
            ],
            constraints: ['1 <= s.length <= 20', '1 <= p.length <= 30', 's contains only lowercase English letters.', 'p contains only lowercase English letters, \'.\', and \'*\'.', 'It is guaranteed for each appearance of the character \'*\', there will be a previous valid character to match.'],
            testCases: [
              { input: '"aa", "a"', expectedOutput: 'false' },
              { input: '"aa", "a*"', expectedOutput: 'true' },
              { input: '"ab", ".*"', expectedOutput: 'true' }
            ],
            points: 70
          }
        ];

        // Add each problem to Firestore
        for (const problem of defaultProblems) {
          await addDoc(collection(db, 'problems'), problem);
        }
        
        console.log('Default problems added to Firestore');
      }
    } catch (error) {
      console.error('Error initializing default problems:', error);
    }
  };
  const fetchProblems = async () => {
    try {
      await initializeDefaultProblems();
      const problemsCollection = collection(db, 'problems');
      const problemsSnapshot = await getDocs(problemsCollection);
      const problemsList = problemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Problem[];
      setProblems(problemsList);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProblems();
    }
  }, [user]);

  const getProblemById = (id: string) => {
    return problems.find(problem => problem.id === id);
  };

  const createProblem = async (problemData: Omit<Problem, 'id'>) => {
    try {
      await addDoc(collection(db, 'problems'), problemData);
      await fetchProblems();
    } catch (error) {
      console.error('Error creating problem:', error);
      throw error;
    }
  };

  const updateProblem = async (id: string, updates: Partial<Problem>) => {
    try {
      await updateDoc(doc(db, 'problems', id), updates);
      await fetchProblems();
    } catch (error) {
      console.error('Error updating problem:', error);
      throw error;
    }
  };

  const deleteProblem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'problems', id));
      await fetchProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
      throw error;
    }
  };

  const runTests = async (problemId: string, code: string): Promise<{ passed: boolean; results: any[]; output: string }> => {
    const problem = getProblemById(problemId);
    if (!problem) {
      return { passed: false, results: [], output: 'Problem not found' };
    }

    try {
      const results = [];
      let allPassed = true;
      let output = '';

      for (let i = 0; i < problem.testCases.length; i++) {
        const testCase = problem.testCases[i];
        
        try {
          let parsedInput;
          try {
            // This logic needs to be more robust to handle different input types
            if (testCase.input.includes('[') || testCase.input.includes('{')) {
               parsedInput = JSON.parse(`[${testCase.input}]`);
            } else {
               // Handle simple primitives like numbers and strings
               const inputs = testCase.input.split(',').map(s => s.trim());
               parsedInput = inputs.map(val => {
                 if (!isNaN(Number(val))) return Number(val);
                 if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1);
                 return val;
               });
            }
          } catch {
            parsedInput = [testCase.input];
          }

          const userFunction = new Function('return ' + code)();
          const result = userFunction(...parsedInput);
          
          let expectedOutput;
          try {
            expectedOutput = JSON.parse(testCase.expectedOutput);
          } catch {
            expectedOutput = testCase.expectedOutput;
            // Coerce to number if possible for comparison
            if (!isNaN(Number(expectedOutput))) {
              expectedOutput = Number(expectedOutput);
            }
          }

          const passed = JSON.stringify(result) === JSON.stringify(expectedOutput);
          
          results.push({
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: JSON.stringify(result),
            passed
          });

          if (!passed) {
            allPassed = false;
          }

          output += `Test ${i + 1}: ${passed ? 'PASSED' : 'FAILED'}\n`;
          if (!passed) {
            output += `  Input: ${testCase.input}\n`;
            output += `  Expected: ${testCase.expectedOutput}\n`;
            output += `  Got: ${JSON.stringify(result)}\n`;
          }
        } catch (error: any) {
          allPassed = false;
          results.push({
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: `Error: ${error.message}`,
            passed: false
          });
          output += `Test ${i + 1}: ERROR - ${error.message}\n`;
        }
      }

      return { passed: allPassed, results, output };
    } catch (error: any) {
      return { 
        passed: false, 
        results: [], 
        output: `Execution Error: ${error.message}` 
      };
    }
  };

  const categories = [...new Set(problems.map(p => p.category))];

  return (
    <ProblemContext.Provider value={{ 
      problems, 
      getProblemById, 
      createProblem, 
      updateProblem, 
      deleteProblem, 
      categories, 
      runTests,
      fetchProblems
    }}>
      {children}
    </ProblemContext.Provider>
  );
}

export function useProblem() {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error('useProblem must be used within a ProblemProvider');
  }
  return context;
}
