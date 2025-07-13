import admin from '../src/lib/firebase-admin';

const problems = [
  {
    problem_name: 'Container With Most Water',
    content: 'Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.',
    instruction: 'Implement a function `max_area(height: List[int]) -> int` that returns the maximum amount of water a container can store by choosing two lines from the input list.',
    input_format: 'A list of n non-negative integers, where 2 <= n <= 10^5 and each element is between 0 and 10^4.',
    output_format: 'An integer representing the maximum amount of water the container can contain.',
    constraints: [
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    examples: [
      {
        input: '[1, 8, 6, 2, 5, 4, 8, 3, 7]',
        output: '49'
      }
    ],
    hints: [
      'Use two pointers starting from both ends.',
      'Move the pointer pointing to the shorter line inward.',
      'Keep track of the maximum area encountered.'
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(1)'
    },
    solution_code: "def max_area(height):\n    l = 0\n    r = len(height) - 1\n    max_height = 0\n\n    while l < r:\n        left = height[l]\n        right = height[r]\n\n        current_height = min(left, right) * (r - l)\n        max_height = max(max_height, current_height)\n\n        if left < right:\n            while (l < r) and (left >= height[l]):\n                l += 1\n        else:\n            while (l < r) and (right >= height[r]):\n                r -= 1\n\n    return max_height",
    tags: ['arrays', 'two-pointers'],
    difficulty: 'medium',
  },
  {
    problem_name: 'Two Sum',
    content: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    instruction: 'You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    input_format: 'An array of integers `nums` and an integer `target`.',
    output_format: 'A list containing the indices of the two numbers.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]'
      }
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      'Can we use a hash map to speed things up?',
      'The hash map stores the elements and their indices. For each element, check if the complement (target - element) exists in the map.'
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(N)'
    },
    solution_code: 'def two_sum(nums, target):\n    hash_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hash_map:\n            return [hash_map[complement], i]\n        hash_map[num] = i',
    tags: ['arrays', 'hash-table'],
    difficulty: 'easy',
  },
  {
    problem_name: 'Valid Parentheses',
    content: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    instruction: 'An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.',
    input_format: 'A string `s`.',
    output_format: '`true` if the string is valid, otherwise `false`.',
    constraints: [
      '1 <= s.length <= 10^4',
      's` consists of parentheses only \'()[]{}\'.'
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
       {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    hints: [
      'Use a stack to keep track of opening brackets.',
      'When an opening bracket is encountered, push it onto the stack.',
      'When a closing bracket is encountered, check if the stack is empty or if the top of the stack is the corresponding opening bracket. If not, the string is invalid.'
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(N)'
    },
    solution_code: 'def is_valid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else \'#\'\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack',
    tags: ['strings', 'stack'],
    difficulty: 'easy',
  }
];

const db = admin.firestore();

async function seedFirestore() {
  const problemsCollection = db.collection('problems');
  console.log('Starting to seed problems...');

  for (const problem of problems) {
    try {
      // Check if a problem with the same name already exists
      const snapshot = await problemsCollection.where('problem_name', '==', problem.problem_name).get();
      if (snapshot.empty) {
        await problemsCollection.add(problem);
        console.log(`Added problem: "${problem.problem_name}"`);
      } else {
        console.log(`Problem "${problem.problem_name}" already exists. Skipping.`);
      }
    } catch (error) {
      console.error(`Error adding problem "${problem.problem_name}":`, error);
    }
  }

  console.log('Seeding finished.');
}

seedFirestore().catch(console.error);
