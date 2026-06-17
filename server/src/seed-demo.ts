/**
 * Seed script – inserts 10 rich sample saved problems for the demo account.
 * Run with:  npx tsx src/seed-demo.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from './lib/prisma.js';

const DEMO_EMAIL = 'demo@algoanalyze.ai';

const samples = [
  /* ─────────────── 1. Two Sum ─────────────── */
  {
    title: 'Two Sum',
    problemStatement:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}`,
    sampleInput: 'nums = [2,7,11,15], target = 9',
    expectedOutput: '[0,1]',
    pattern: 'Hash Map',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    explanation: {
      problemSummary:
        'Find and return the indices of the two elements in the array that add up to the given target. Exactly one valid answer always exists.',
      questionExplanation:
        'We need two indices i and j such that nums[i] + nums[j] = target. The brute force checks all pairs, but we can do better.\n\nThe key insight is: if nums[i] + nums[j] = target, then nums[j] = target - nums[i]. So for every element we visit, we just need to ask "have I seen its complement before?" A hash map answers that in O(1).',
      hinglishExplanation:
        'Hum ek hash map banate hain. Har element ke liye pehle check karo ki uska complement (target - nums[i]) map mein pehle se hai ya nahi. Agar hai, toh dono indices return karo. Nahi hai toh current element ko map mein daalo aur aage badho.',
      bruteForceApproach:
        'Use two nested loops: for each pair (i, j) where j > i, check if nums[i] + nums[j] equals target. Return [i, j] when found.\nTime: O(n²) | Space: O(1)\n\nProblem: Too slow for large inputs — 10,000 elements means up to 50 million checks.',
      betterApproach:
        'Sort the array and use two pointers (lo, hi). Move lo right when sum < target, move hi left when sum > target.\nTime: O(n log n) | Space: O(1)\n\nProblem: Sorting loses original indices, so you must store them separately — adds complexity.',
      optimizedApproach:
        'Single-pass hash map:\n1. Create an empty map: { value → index }\n2. For each index i, compute complement = target - nums[i]\n3. If complement is already in the map, return [map[complement], i]\n4. Else store map[nums[i]] = i and continue\n\nTime: O(n) — one pass, each map operation is O(1) amortized\nSpace: O(n) — map stores at most n entries\n\nThis is optimal because we must read all elements in the worst case.',
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 2, annotation: 'Initialize empty hash map',
        variables: { i: '-', complement: '-', map: '{}' },
        dataStructureState: { type: 'array', values: [2, 7, 11, 15], highlight: [] },
      },
      {
        stepNumber: 2, line: 4, annotation: 'i=0: nums[0]=2, complement = 9-2 = 7. Is 7 in map? No.',
        variables: { i: 0, 'nums[i]': 2, complement: 7, map: '{}' },
        dataStructureState: { type: 'array', values: [2, 7, 11, 15], highlight: [0] },
      },
      {
        stepNumber: 3, line: 5, annotation: 'Store map[2] = 0. Map now has one entry.',
        variables: { i: 0, 'nums[i]': 2, complement: 7, map: '{2→0}' },
        dataStructureState: { type: 'array', values: [2, 7, 11, 15], highlight: [0] },
      },
      {
        stepNumber: 4, line: 4, annotation: 'i=1: nums[1]=7, complement = 9-7 = 2. Is 2 in map? YES! Found at index 0.',
        variables: { i: 1, 'nums[i]': 7, complement: 2, map: '{2→0}' },
        dataStructureState: { type: 'array', values: [2, 7, 11, 15], highlight: [0, 1] },
      },
      {
        stepNumber: 5, line: 5, annotation: 'Return [map.get(2), 1] = [0, 1]. Both indices found in a single pass!',
        variables: { result: '[0, 1]', 'nums[0]+nums[1]': '2+7=9', target: 9 },
        dataStructureState: { type: 'array', values: [2, 7, 11, 15], highlight: [0, 1] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 3, variables: { i: 0, 'nums[i]': 2, complement: 7 }, output: '', explanation: 'complement=7 not in map → store map[2]=0' },
      { step: 2, line: 3, variables: { i: 1, 'nums[i]': 7, complement: 2 }, output: '[0,1]', explanation: 'complement=2 IS in map at index 0 → return [0,1] ✓' },
    ],
    bugsOrWarnings: [],
    edgeCases: [
      'Two identical numbers: nums=[3,3], target=6 → [0,1]. Map stores 3→0 first, then finds it on second 3.',
      'Negative numbers: nums=[-1,-2,-3,-4,-5], target=-8 → [2,4] — works perfectly with negatives.',
      'Large array: O(n) handles 10⁵ elements in milliseconds vs O(n²) brute force timing out.',
      'Target is 0: nums=[-5,5], target=0 → [0,1] — works since we store negatives in map.',
    ],
    similarProblems: ['Three Sum', 'Four Sum', 'Two Sum II (Sorted Array)', 'Subarray Sum Equals K', 'Max Number of K-Sum Pairs'],
    quizQuestions: [
      {
        question: 'What is the time complexity of the hash map solution and why?',
        options: ['O(n²) — two nested loops', 'O(n log n) — requires sorting', 'O(n) — one pass with O(1) map lookups', 'O(1) — constant time'],
        correctAnswer: 'O(n) — one pass with O(1) map lookups',
        explanation: 'We iterate the array exactly once (O(n)). Each insertion and lookup in a hash map is O(1) amortized. Total: O(n).',
      },
      {
        question: 'Why do we store the index (not just the value) in the hash map?',
        options: ['To check if a value exists', 'To retrieve the index of the complement when found', 'To count duplicates', 'The problem requires it'],
        correctAnswer: 'To retrieve the index of the complement when found',
        explanation: 'The problem asks for indices, not values. When we find complement in the map, we need its index — which is what map.get(complement) returns.',
      },
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 2. Valid Parentheses ─────────────── */
  {
    title: 'Valid Parentheses',
    problemStatement:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
    code: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (!map[ch]) { stack.push(ch); continue; }
    if (stack.pop() !== map[ch]) return false;
  }
  return stack.length === 0;
}`,
    sampleInput: 's = "()[]{}"',
    expectedOutput: 'true',
    pattern: 'Stack',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    explanation: {
      problemSummary:
        'Validate that every opening bracket has a corresponding closing bracket of the same type and in the correct nested order.',
      questionExplanation:
        'The key observation is that parentheses must be closed in LIFO order — the most recently opened bracket must be closed first. This is exactly what a stack provides.\n\nAlgorithm:\n• Push opening brackets onto the stack\n• For closing brackets, the top of the stack MUST be the matching opener\n• If it is not, or the stack is empty, return false\n• After processing all characters, the stack must be empty (no unmatched openers)',
      hinglishExplanation:
        'Jab koi opening bracket aaye (like "(", "{", "[") toh use stack mein push karo. Jab koi closing bracket aaye, toh stack ka top dekho — agar woh matching opener hai toh pop karo, nahi toh string invalid hai. Aakhir mein stack empty hona chahiye.',
      bruteForceApproach:
        'Repeatedly scan the string and replace matched pairs ("()", "[]", "{}") with empty string until no change occurs.\nTime: O(n²) — each pass is O(n) and we may need O(n) passes\nSpace: O(n) — string copies\n\nProblem: Very slow and creates many intermediate strings.',
      betterApproach:
        'Count opening and closing brackets separately. But this breaks for mixed types — "(]" would incorrectly pass a simple counter check.',
      optimizedApproach:
        'Single-pass stack approach:\n1. Create a closing→opening map: { ")":"(", "}":"{", "]":"[" }\n2. For each character:\n   a. If opening bracket → push onto stack\n   b. If closing bracket → pop from stack, check it matches the expected opener\n   c. If no match → return false immediately\n3. Return stack.length === 0\n\nTime: O(n) — each character processed once\nSpace: O(n) — worst case all openers on stack (e.g., "(((((")',
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 2, annotation: 'Start with an empty stack. Input: "()[]{}"',
        variables: { ch: '-', stack: '[]' },
        dataStructureState: { type: 'stack', values: [], highlight: [] },
      },
      {
        stepNumber: 2, line: 4, annotation: "ch='(': opening bracket → push onto stack",
        variables: { ch: '(', action: 'push', stack: '["("]' },
        dataStructureState: { type: 'stack', values: ['('], highlight: [0] },
      },
      {
        stepNumber: 3, line: 5, annotation: "ch=')': closing bracket. map[')']='('. Pop stack → '('. Matches! Continue.",
        variables: { ch: ')', 'map[ch]': '(', 'stack.pop()': '(', match: 'YES' },
        dataStructureState: { type: 'stack', values: [], highlight: [] },
      },
      {
        stepNumber: 4, line: 4, annotation: "ch='[': opening bracket → push onto stack",
        variables: { ch: '[', action: 'push', stack: '["["]' },
        dataStructureState: { type: 'stack', values: ['['], highlight: [0] },
      },
      {
        stepNumber: 5, line: 5, annotation: "ch=']': closing bracket. map[']']='['. Pop stack → '['. Matches! Continue.",
        variables: { ch: ']', 'map[ch]': '[', 'stack.pop()': '[', match: 'YES' },
        dataStructureState: { type: 'stack', values: [], highlight: [] },
      },
      {
        stepNumber: 6, line: 4, annotation: "ch='{': opening bracket → push onto stack",
        variables: { ch: '{', action: 'push', stack: '["{"]' },
        dataStructureState: { type: 'stack', values: ['{'], highlight: [0] },
      },
      {
        stepNumber: 7, line: 5, annotation: "ch='}': closing bracket. map['}']=''. Pop stack → '{'. Matches! Stack empty.",
        variables: { ch: '}', 'map[ch]': '{', 'stack.pop()': '{', match: 'YES' },
        dataStructureState: { type: 'stack', values: [], highlight: [] },
      },
      {
        stepNumber: 8, line: 7, annotation: 'All characters processed. Stack is empty → return true ✓',
        variables: { 'stack.length': 0, result: 'true' },
        dataStructureState: { type: 'stack', values: [], highlight: [] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 4, variables: { ch: '(', stack: '["("]' }, output: '', explanation: "Opening bracket → push '('" },
      { step: 2, line: 5, variables: { ch: ')', 'stack.pop()': '(', 'map[")"]': '(' }, output: '', explanation: "Pop '(', matches map[')']='(' → continue" },
      { step: 3, line: 4, variables: { ch: '[', stack: '["["]' }, output: '', explanation: "Opening bracket → push '['" },
      { step: 4, line: 5, variables: { ch: ']', 'stack.pop()': '[', 'map["]"]': '[' }, output: '', explanation: "Pop '[', matches → continue" },
      { step: 5, line: 4, variables: { ch: '{', stack: '["{"]' }, output: '', explanation: "Opening bracket → push '{'" },
      { step: 6, line: 5, variables: { ch: '}', 'stack.pop()': '{', 'map["}"]': '{' }, output: 'true', explanation: "Pop '{', matches → stack empty → return true ✓" },
    ],
    bugsOrWarnings: [
      { title: 'Empty string edge case', severity: 'Low', explanation: 'An empty string returns true because stack.length === 0. This is mathematically correct (vacuously valid) but confirm with the problem definition.', fix: 'Add if (s.length === 0) return true; at the start if needed for clarity.' },
    ],
    edgeCases: [
      'Empty string "" → true (stack is empty, vacuously valid)',
      'Only openers "(((" → false (stack has 3 unmatched brackets)',
      'Mismatched types "([)]" → false (stack top is "[" when ")" arrives)',
      'Single character "(" → false (stack non-empty at end)',
      'Long balanced "((({{{[[[]]]}}}))})" → true',
    ],
    similarProblems: ['Minimum Remove to Make Valid Parentheses', 'Longest Valid Parentheses', 'Generate Parentheses', 'Score of Parentheses'],
    quizQuestions: [
      {
        question: 'What happens with input "([)]"? Why does it fail?',
        options: [
          'Returns true — all brackets are paired',
          'Returns false — when ")" arrives, the stack top is "[" not "("',
          'Throws an error — invalid character',
          'Returns false — unequal count of brackets',
        ],
        correctAnswer: 'Returns false — when ")" arrives, the stack top is "[" not "("',
        explanation: 'After pushing "(" and "[", the stack top is "[". When ")" arrives, map[")"]="(" but stack.pop()="[". They don\'t match → return false.',
      },
      {
        question: 'Why must we check stack.length === 0 at the end?',
        options: [
          'To handle the case where the string has no brackets',
          'To catch unmatched opening brackets like "((("',
          'To reset the stack for next use',
          'It is redundant — not necessary',
        ],
        correctAnswer: 'To catch unmatched opening brackets like "((("',
        explanation: 'The string "(((" never triggers the closing-bracket path, so no false is returned during the loop. Only the final empty-stack check catches this case.',
      },
    ],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 3. Binary Search ─────────────── */
  {
    title: 'Binary Search',
    problemStatement:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.',
    code: `function search(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    sampleInput: 'nums = [-1,0,3,5,9,12], target = 9',
    expectedOutput: '4',
    pattern: 'Binary Search',
    difficulty: 'Easy',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    explanation: {
      problemSummary:
        'Search for a target value in a sorted array and return its index. If not found, return -1. Must run in O(log n).',
      questionExplanation:
        'Since the array is sorted, we can exploit the ordering: if nums[mid] < target, the target must be in the right half; if nums[mid] > target, it must be in the left half. We repeatedly halve the search space until we find the target or exhaust all elements.\n\nThe invariant is: target, if it exists, is always within [lo, hi].',
      hinglishExplanation:
        'Array sorted hai toh hum middle element ko target se compare karte hain. Agar equal ho toh mil gaya. Agar mid element chhota ho toh target right half mein hai (lo = mid+1). Agar bada ho toh left half mein hai (hi = mid-1). Yeh process repeat karte hain jab tak lo <= hi ho.',
      bruteForceApproach:
        'Linear scan: iterate from index 0 to n-1 and return the index where nums[i] === target.\nTime: O(n) | Space: O(1)\n\nProblem: Doesn\'t use the sorted property at all — wasteful. O(log n) is required.',
      betterApproach:
        'Using JavaScript\'s built-in Array.indexOf() or findIndex() — also O(n) internally, doesn\'t satisfy the O(log n) requirement.',
      optimizedApproach:
        'Classic binary search with lo/hi pointers:\n1. lo = 0, hi = n-1\n2. While lo ≤ hi:\n   a. mid = lo + (hi-lo)/2 (avoids overflow)\n   b. If nums[mid] === target → return mid\n   c. If nums[mid] < target → lo = mid + 1 (search right half)\n   d. If nums[mid] > target → hi = mid - 1 (search left half)\n3. Return -1 (target not found)\n\nEach iteration halves the search space → O(log n) iterations\nSpace: O(1) — only three pointer variables',
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 2, annotation: 'Init: lo=0, hi=5. Full array is the search space.',
        variables: { lo: 0, hi: 5, mid: '-', target: 9 },
        dataStructureState: { type: 'array', values: [-1, 0, 3, 5, 9, 12], highlight: [] },
      },
      {
        stepNumber: 2, line: 4, annotation: 'mid = 0 + (5-0)/2 = 2. nums[2]=3. 3 < 9 → search right half.',
        variables: { lo: 0, hi: 5, mid: 2, 'nums[mid]': 3, target: 9 },
        dataStructureState: { type: 'array', values: [-1, 0, 3, 5, 9, 12], highlight: [2] },
      },
      {
        stepNumber: 3, line: 6, annotation: 'lo = mid+1 = 3. New search space: indices 3 to 5.',
        variables: { lo: 3, hi: 5, mid: 2, action: 'lo = mid+1 = 3' },
        dataStructureState: { type: 'array', values: [-1, 0, 3, 5, 9, 12], highlight: [3, 4, 5] },
      },
      {
        stepNumber: 4, line: 4, annotation: 'mid = 3 + (5-3)/2 = 4. nums[4]=9. 9 === target! Found!',
        variables: { lo: 3, hi: 5, mid: 4, 'nums[mid]': 9, target: 9 },
        dataStructureState: { type: 'array', values: [-1, 0, 3, 5, 9, 12], highlight: [4] },
      },
      {
        stepNumber: 5, line: 5, annotation: 'Return index 4. Found target 9 at index 4 in just 2 iterations!',
        variables: { result: 4, iterations: 2 },
        dataStructureState: { type: 'array', values: [-1, 0, 3, 5, 9, 12], highlight: [4] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 4, variables: { lo: 0, hi: 5, mid: 2, 'nums[2]': 3 }, output: '', explanation: '3 < 9 → lo = 3, discard left half' },
      { step: 2, line: 4, variables: { lo: 3, hi: 5, mid: 4, 'nums[4]': 9 }, output: '4', explanation: '9 === target → return index 4 ✓' },
    ],
    bugsOrWarnings: [
      { title: 'Integer Overflow Risk', severity: 'Low', explanation: 'Using mid = (lo + hi) / 2 can overflow in languages with fixed 32-bit integers when lo and hi are both large (e.g., near INT_MAX).', fix: 'Always use mid = lo + Math.floor((hi - lo) / 2) — this is safe in all cases.', suggestedCode: 'const mid = lo + Math.floor((hi - lo) / 2);' },
    ],
    edgeCases: [
      'Target at index 0: immediately found when first mid === 0',
      'Target at last index: lo keeps increasing until it reaches the last element',
      'Target not in array: lo eventually exceeds hi, loop ends, return -1',
      'Single element array nums=[5], target=5 → 0; target=3 → -1',
      'All same elements: only works if target equals that element',
    ],
    similarProblems: ['Search in Rotated Sorted Array', 'Find First and Last Position of Element', 'Search Insert Position', 'Find Peak Element', 'Koko Eating Bananas'],
    quizQuestions: [
      {
        question: 'Why do we use mid = lo + (hi - lo) / 2 instead of (lo + hi) / 2?',
        options: ['Faster arithmetic', 'Prevents integer overflow when lo and hi are large', 'Handles negative indices', 'No practical difference in JavaScript'],
        correctAnswer: 'Prevents integer overflow when lo and hi are large',
        explanation: 'If lo=2×10⁹ and hi=2×10⁹, then lo+hi overflows a 32-bit integer. lo+(hi-lo)/2 = lo + half the distance, which always stays in range.',
      },
      {
        question: 'After how many iterations does binary search on an array of 1,000,000 elements give up?',
        options: ['1,000,000', '500,000', '~20', '~1,000'],
        correctAnswer: '~20',
        explanation: 'log₂(1,000,000) ≈ 20. Binary search halves the space each step, so it needs at most ⌈log₂(n)⌉ iterations regardless of array size.',
      },
    ],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 4. Merge Intervals ─────────────── */
  {
    title: 'Merge Intervals',
    problemStatement:
      'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    code: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      result.push(intervals[i]);
    }
  }
  return result;
}`,
    sampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
    expectedOutput: '[[1,6],[8,10],[15,18]]',
    pattern: 'Sorting + Greedy',
    difficulty: 'Medium',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    explanation: {
      problemSummary:
        'Combine all overlapping intervals into as few non-overlapping intervals as possible.',
      questionExplanation:
        'Two intervals [a,b] and [c,d] overlap if c ≤ b (the second starts before the first ends). Their merge is [a, max(b,d)].\n\nAfter sorting by start time, any overlapping interval must be adjacent in the sorted order — because if interval X overlaps with interval Z, and X comes first, then any interval Y between them that doesn\'t overlap X would separate X from Z, contradicting transitivity of overlap. So we only ever need to check consecutive intervals.',
      hinglishExplanation:
        'Pehle intervals ko start time ke hisaab se sort karo. Fir ek ek karke check karo: agar current interval ka start ≤ last merged interval ka end, toh overlap hai → merge karo. Nahi toh naya interval result mein add karo.',
      bruteForceApproach:
        'For every pair of intervals, check if they overlap and merge if so. Repeat until no merges happen.\nTime: O(n²) per pass × O(n) passes = O(n³)\nSpace: O(n)\n\nExtremely slow. Not acceptable.',
      betterApproach:
        'Sort intervals by start. Use a stack — push first interval, for each subsequent check if it overlaps with stack top.\nTime: O(n log n) | Space: O(n)\nThis is essentially the same as our optimized approach but framed with a stack.',
      optimizedApproach:
        'Sort by start time, then single greedy pass:\n1. Sort intervals by start: O(n log n)\n2. Initialize result with first interval\n3. For each subsequent interval:\n   - If intervals[i][0] ≤ result.last[1]: overlap → update end to max(result.last[1], intervals[i][1])\n   - Else: no overlap → push as new interval\n4. Return result\n\nWhy greedy works: after sorting, if current interval doesn\'t overlap with last result, it won\'t overlap with anything before that either (they all end earlier).',
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 2, annotation: 'Sort by start time: [[1,3],[2,6],[8,10],[15,18]] — already sorted.',
        variables: { action: 'sort complete' },
        dataStructureState: { type: 'array', values: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'], highlight: [] },
      },
      {
        stepNumber: 2, line: 3, annotation: 'Init result with first interval [1,3].',
        variables: { result: '[[1,3]]', i: 1 },
        dataStructureState: { type: 'array', values: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'], highlight: [0] },
      },
      {
        stepNumber: 3, line: 6, annotation: 'i=1: [2,6]. Does 2 ≤ 3? YES → overlap! Merge to [1, max(3,6)] = [1,6].',
        variables: { i: 1, current: '[2,6]', last: '[1,3]', overlap: true, merged: '[1,6]' },
        dataStructureState: { type: 'array', values: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'], highlight: [0, 1] },
      },
      {
        stepNumber: 4, line: 6, annotation: 'i=2: [8,10]. Does 8 ≤ 6? NO → no overlap. Push [8,10] as new interval.',
        variables: { i: 2, current: '[8,10]', last: '[1,6]', overlap: false },
        dataStructureState: { type: 'array', values: ['[1,6]', '[8,10]', '[15,18]'], highlight: [1] },
      },
      {
        stepNumber: 5, line: 6, annotation: 'i=3: [15,18]. Does 15 ≤ 10? NO → no overlap. Push [15,18] as new interval.',
        variables: { i: 3, current: '[15,18]', last: '[8,10]', overlap: false },
        dataStructureState: { type: 'array', values: ['[1,6]', '[8,10]', '[15,18]'], highlight: [2] },
      },
      {
        stepNumber: 6, line: 11, annotation: 'Done! 4 intervals merged into 3 non-overlapping intervals.',
        variables: { result: '[[1,6],[8,10],[15,18]]' },
        dataStructureState: { type: 'array', values: ['[1,6]', '[8,10]', '[15,18]'], highlight: [0, 1, 2] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 3, variables: { result: '[[1,3]]' }, output: '', explanation: 'Initialize result with first interval' },
      { step: 2, line: 6, variables: { i: 1, 'intervals[1]': '[2,6]', 'last[1]': 3, '2≤3': true }, output: '', explanation: 'Overlap → last[1] = max(3,6) = 6. result = [[1,6]]' },
      { step: 3, line: 6, variables: { i: 2, 'intervals[2]': '[8,10]', 'last[1]': 6, '8≤6': false }, output: '', explanation: 'No overlap → push [8,10]. result = [[1,6],[8,10]]' },
      { step: 4, line: 6, variables: { i: 3, 'intervals[3]': '[15,18]', 'last[1]': 10, '15≤10': false }, output: '[[1,6],[8,10],[15,18]]', explanation: 'No overlap → push [15,18]. Final result ✓' },
    ],
    bugsOrWarnings: [
      { title: 'Touching intervals treated as overlapping', severity: 'Low', explanation: 'Intervals [1,2] and [2,3] will be merged to [1,3] because 2 ≤ 2. This is correct per the problem statement but worth noting.', fix: 'If you want strictly overlapping (not touching), change the condition to intervals[i][0] < last[1].' },
    ],
    edgeCases: [
      'Single interval [[5,10]] → [[5,10]] — no merging needed',
      'All intervals overlap [[1,10],[2,8],[3,7]] → [[1,10]]',
      'No intervals overlap [[1,2],[3,4],[5,6]] → [[1,2],[3,4],[5,6]]',
      'Touching intervals [[1,2],[2,3]] → [[1,3]] (2 ≤ 2 is true)',
      'One interval contained in another [[1,10],[2,5]] → [[1,10]]',
    ],
    similarProblems: ['Insert Interval', 'Non-overlapping Intervals', 'Meeting Rooms', 'Meeting Rooms II', 'Minimum Number of Arrows to Burst Balloons'],
    quizQuestions: [
      {
        question: 'Why must we sort by start time before the greedy scan?',
        options: ['For the output to be sorted', 'So overlapping intervals are guaranteed to be adjacent, enabling a single O(n) pass', 'To remove duplicates', 'Sorting is not required'],
        correctAnswer: 'So overlapping intervals are guaranteed to be adjacent, enabling a single O(n) pass',
        explanation: 'Without sorting, an interval at position 5 could overlap with one at position 1, requiring checking all pairs. Sorting guarantees if [a,b] and [c,d] overlap (c≤b), they are adjacent in the sorted order.',
      },
      {
        question: 'How do we handle the case where interval B is completely inside interval A (e.g., [1,10] and [3,7])?',
        options: ['Push both to result', 'The max() handles it: max(10,7)=10 so end stays 10', 'Return an error', 'Remove interval A'],
        correctAnswer: 'The max() handles it: max(10,7)=10 so end stays 10',
        explanation: "last[1] = Math.max(last[1], intervals[i][1]) = max(10, 7) = 10. The outer interval's end is preserved correctly.",
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 5. Climbing Stairs ─────────────── */
  {
    title: 'Climbing Stairs',
    problemStatement:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    code: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev = 1, curr = 2;
  for (let i = 3; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
    sampleInput: 'n = 5',
    expectedOutput: '8',
    pattern: 'Dynamic Programming (Fibonacci)',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    explanation: {
      problemSummary:
        'Count the number of distinct ways to climb n stairs when you can take 1 or 2 steps at a time.',
      questionExplanation:
        'Think about the last step taken to reach stair n:\n• If the last step was 1: you were on stair n-1, and there are ways(n-1) paths to reach n-1\n• If the last step was 2: you were on stair n-2, and there are ways(n-2) paths to reach n-2\n\nSo ways(n) = ways(n-1) + ways(n-2) — this is the Fibonacci recurrence!\n\nBase cases: ways(1)=1 (only "1"), ways(2)=2 ("1+1" or "2")',
      hinglishExplanation:
        'Agar n seedhi par khade ho, toh ya toh n-1 wali seedhi se ek kadam aaye ya n-2 wali seedhi se do kadam. Toh total tarike = ways(n-1) + ways(n-2). Yeh Fibonacci sequence hai! Hum sirf do variables (prev, curr) rakh ke O(1) space mein solve karte hain.',
      bruteForceApproach:
        'Recursive solution: climbStairs(n) = climbStairs(n-1) + climbStairs(n-2)\nTime: O(2ⁿ) — exponential, recomputes same subproblems many times\nSpace: O(n) — call stack depth\n\nFor n=50, this makes 2⁵⁰ ≈ 1 quadrillion calls. Completely unusable.',
      betterApproach:
        'Top-down DP with memoization: cache results in a map.\nTime: O(n) | Space: O(n) for the memo table + call stack\n\nBetter than pure recursion but still uses O(n) space.',
      optimizedApproach:
        'Bottom-up DP with space optimization:\n1. Base cases: if n ≤ 2 return n\n2. Use prev=ways(1)=1, curr=ways(2)=2\n3. For i from 3 to n: next = prev + curr; prev = curr; curr = next\n4. Return curr\n\nWe only ever need the last two values, so we store just two variables instead of a full DP table.\nTime: O(n) | Space: O(1)',
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 2, annotation: 'n=5. Since n>2, we use the rolling Fibonacci approach.',
        variables: { n: 5, prev: 1, curr: 2 },
        dataStructureState: { type: 'array', values: [1, 2, '?', '?', '?'], highlight: [0, 1] },
      },
      {
        stepNumber: 2, line: 5, annotation: 'i=3: next = prev+curr = 1+2 = 3. 3 ways to climb 3 stairs.',
        variables: { i: 3, prev: 1, curr: 2, next: 3 },
        dataStructureState: { type: 'array', values: [1, 2, 3, '?', '?'], highlight: [2] },
      },
      {
        stepNumber: 3, line: 6, annotation: 'Shift: prev=2, curr=3. Window moves forward.',
        variables: { i: 3, prev: 2, curr: 3 },
        dataStructureState: { type: 'array', values: [1, 2, 3, '?', '?'], highlight: [1, 2] },
      },
      {
        stepNumber: 4, line: 5, annotation: 'i=4: next = prev+curr = 2+3 = 5. 5 ways to climb 4 stairs.',
        variables: { i: 4, prev: 2, curr: 3, next: 5 },
        dataStructureState: { type: 'array', values: [1, 2, 3, 5, '?'], highlight: [3] },
      },
      {
        stepNumber: 5, line: 5, annotation: 'i=5: next = 3+5 = 8. 8 ways to climb 5 stairs.',
        variables: { i: 5, prev: 3, curr: 5, next: 8 },
        dataStructureState: { type: 'array', values: [1, 2, 3, 5, 8], highlight: [4] },
      },
      {
        stepNumber: 6, line: 8, annotation: 'Return curr=8. The 5 stairs can be climbed in 8 distinct ways! ✓',
        variables: { result: 8 },
        dataStructureState: { type: 'array', values: [1, 2, 3, 5, 8], highlight: [0, 1, 2, 3, 4] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 3, variables: { prev: 1, curr: 2 }, output: '', explanation: 'ways(1)=1, ways(2)=2 — base cases' },
      { step: 2, line: 5, variables: { i: 3, next: 3, prev: 2, curr: 3 }, output: '', explanation: 'ways(3) = 1+2 = 3' },
      { step: 3, line: 5, variables: { i: 4, next: 5, prev: 3, curr: 5 }, output: '', explanation: 'ways(4) = 2+3 = 5' },
      { step: 4, line: 5, variables: { i: 5, next: 8, prev: 5, curr: 8 }, output: '8', explanation: 'ways(5) = 3+5 = 8 ✓' },
    ],
    bugsOrWarnings: [],
    edgeCases: [
      'n=1 → 1 way: only "take 1 step"',
      'n=2 → 2 ways: "1+1" or "2"',
      'Large n: this solution handles it efficiently but for very large n in languages with 32-bit ints, the Fibonacci number may overflow — use BigInt or modular arithmetic as needed.',
    ],
    similarProblems: ['House Robber', 'Min Cost Climbing Stairs', 'Jump Game', 'Jump Game II', 'Fibonacci Number', 'Tribonacci Number'],
    quizQuestions: [
      {
        question: 'The sequence of ways(1)=1, ways(2)=2, ways(3)=3, ways(4)=5 … looks like which famous sequence?',
        options: ['Arithmetic sequence', 'Geometric sequence', 'Fibonacci sequence (offset by one)', 'Pascal\'s triangle row'],
        correctAnswer: 'Fibonacci sequence (offset by one)',
        explanation: 'The Fibonacci sequence is 1,1,2,3,5,8,13… Our sequence is 1,2,3,5,8,13… — identical but shifted: ways(n) = Fibonacci(n+1).',
      },
      {
        question: 'Why can we reduce space from O(n) to O(1)?',
        options: [
          'We sorted the input',
          'ways(n) only depends on the previous two values, not the entire DP table',
          'We used recursion',
          'The problem has no overlapping subproblems',
        ],
        correctAnswer: 'ways(n) only depends on the previous two values, not the entire DP table',
        explanation: 'Since ways(n) = ways(n-1) + ways(n-2), we only need the last two computed values at any point — two variables suffice instead of an n-element array.',
      },
    ],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 6. Linked List Cycle ─────────────── */
  {
    title: 'Linked List Cycle Detection',
    problemStatement:
      'Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle if some node can be reached again by continuously following the next pointer. Return true if there is a cycle, or false otherwise.',
    code: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    sampleInput: 'head = [3,2,0,-4], pos = 1 (tail connects to node at index 1)',
    expectedOutput: 'true',
    pattern: "Floyd's Tortoise and Hare",
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    explanation: {
      problemSummary:
        'Detect whether a singly linked list contains a cycle using constant extra space.',
      questionExplanation:
        "Floyd's Cycle Detection Algorithm uses two pointers moving at different speeds:\n• Slow pointer: moves 1 node at a time\n• Fast pointer: moves 2 nodes at a time\n\nIf there is no cycle, fast will reach null and we return false.\nIf there IS a cycle, fast will eventually lap slow (like a faster runner on a circular track), and slow === fast at some meeting point inside the cycle.\n\nProof: once both pointers enter the cycle, the gap between them decreases by 1 each step, so they must meet within at most (cycle_length) steps.",
      hinglishExplanation:
        'Ek tortoise (slow) aur ek hare (fast) linked list mein dono same jagah se start karte hain. Slow ek node aage jaata hai, fast do nodes. Agar cycle nahi hai toh fast null pe pahunch jaayega. Agar cycle hai toh fast slow ko cycle ke andar hi catch kar lega — jaise ek circular track pe ek fast runner ek slow runner ko overtake karta hai.',
      bruteForceApproach:
        'Store every visited node in a Set. For each node, check if it is already in the Set before marking it.\nTime: O(n) | Space: O(n)\n\nWorks correctly but uses O(n) extra space — fails the follow-up constraint.',
      betterApproach:
        'Modify node values by stamping them with a visited marker. Destroys the list structure — not acceptable in practice.',
      optimizedApproach:
        "Floyd's Two-Pointer (Tortoise and Hare):\n1. Initialize slow = fast = head\n2. Loop while fast ≠ null and fast.next ≠ null:\n   a. slow = slow.next (1 step)\n   b. fast = fast.next.next (2 steps)\n   c. If slow === fast → cycle detected → return true\n3. Return false\n\nTime: O(n) — at most n steps until meeting or reaching null\nSpace: O(1) — only two pointers\n\nThis is optimal: you cannot do better than O(n) time (must read all nodes) or O(1) space (two pointers are minimal).",
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 2, annotation: 'Both slow and fast start at node 3 (head). List: 3→2→0→-4→(back to 2)',
        variables: { slow: 'node(3)', fast: 'node(3)' },
        dataStructureState: { type: 'linked-list', values: [3, 2, 0, -4], highlight: [0] },
      },
      {
        stepNumber: 2, line: 4, annotation: 'Step 1: slow→2 (1 step), fast→0 (2 steps). No meeting yet.',
        variables: { slow: 'node(2)', fast: 'node(0)', 'slow===fast': false },
        dataStructureState: { type: 'linked-list', values: [3, 2, 0, -4], highlight: [1, 2] },
      },
      {
        stepNumber: 3, line: 4, annotation: 'Step 2: slow→0 (1 step), fast→-4→2 (2 steps, wraps through cycle).',
        variables: { slow: 'node(0)', fast: 'node(2)', 'slow===fast': false },
        dataStructureState: { type: 'linked-list', values: [3, 2, 0, -4], highlight: [2, 1] },
      },
      {
        stepNumber: 4, line: 4, annotation: 'Step 3: slow→-4 (1 step), fast→0→-4 (2 steps). slow === fast at node(-4)!',
        variables: { slow: 'node(-4)', fast: 'node(-4)', 'slow===fast': true },
        dataStructureState: { type: 'linked-list', values: [3, 2, 0, -4], highlight: [3] },
      },
      {
        stepNumber: 5, line: 6, annotation: 'Cycle detected! Return true. Both pointers met inside the cycle. ✓',
        variables: { result: 'true', meetingNode: '-4' },
        dataStructureState: { type: 'linked-list', values: [3, 2, 0, -4], highlight: [1, 2, 3] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 4, variables: { slow: 'node(2)', fast: 'node(0)' }, output: '', explanation: 'slow moves 1 step, fast moves 2 steps. No meet.' },
      { step: 2, line: 4, variables: { slow: 'node(0)', fast: 'node(2)' }, output: '', explanation: 'fast cycles back through -4 to 2. No meet yet.' },
      { step: 3, line: 4, variables: { slow: 'node(-4)', fast: 'node(-4)' }, output: 'true', explanation: 'slow === fast at node(-4) → cycle confirmed ✓' },
    ],
    bugsOrWarnings: [
      { title: 'Null check order matters', severity: 'Medium', explanation: 'We must check fast !== null BEFORE fast.next !== null. If fast is null, accessing fast.next throws a NullPointerException.', fix: 'Always use: while (fast !== null && fast.next !== null) — short-circuit evaluation handles this correctly.' },
    ],
    edgeCases: [
      'Empty list (head=null) → false: loop condition fails immediately',
      'Single node with no cycle → false: fast.next is null on first check',
      'Single node pointing to itself (cycle of length 1) → true: slow meets fast on second iteration',
      'Two nodes with cycle → true: detected in 1-2 steps',
      'Very long cycle: still O(n) — fast catches up within one full cycle traversal',
    ],
    similarProblems: ['Linked List Cycle II (find cycle start)', 'Find the Duplicate Number', 'Happy Number', 'Middle of the Linked List'],
    quizQuestions: [
      {
        question: "Why does Floyd's algorithm guarantee the pointers will meet if a cycle exists?",
        options: [
          'Fast always reaches the end faster',
          'In a cycle, the relative gap between fast and slow decreases by 1 each step, so they must eventually meet',
          'They start at the same node',
          'The list length is always even',
        ],
        correctAnswer: 'In a cycle, the relative gap between fast and slow decreases by 1 each step, so they must eventually meet',
        explanation: 'Within the cycle: let gap = distance from slow to fast. Each step, slow advances 1 and fast advances 2, so gap increases by 1... but since it\'s a cycle of length L, this is equivalent to gap decreasing by (L-1). They meet when gap = 0 (mod L).',
      },
      {
        question: 'What is the space advantage of this algorithm over the hash set approach?',
        options: ['Same space — O(n)', 'O(log n) vs O(n)', 'O(1) vs O(n) — constant vs linear space', 'O(n) vs O(n²)'],
        correctAnswer: 'O(1) vs O(n) — constant vs linear space',
        explanation: "Floyd's algorithm uses exactly 2 pointer variables regardless of list size. The hash set approach stores up to n node references.",
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 7. Maximum Subarray ─────────────── */
  {
    title: "Maximum Subarray (Kadane's Algorithm)",
    problemStatement:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
    code: `function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    expectedOutput: '6',
    pattern: "Dynamic Programming / Kadane's",
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    explanation: {
      problemSummary:
        'Find the contiguous subarray (containing at least one number) with the largest sum and return that sum.',
      questionExplanation:
        "Kadane's key insight: at each index i, we decide whether to:\na) Extend the existing subarray: currentSum + nums[i]\nb) Start a fresh subarray from i: nums[i]\n\nWe pick whichever is larger. If the running sum is negative, it's always better to start fresh — a negative prefix only drags the sum down.\n\nWe also maintain maxSum as the global maximum seen so far.",
      hinglishExplanation:
        'Har element pe ek decision: kya pichli subarray extend karein ya naya subarray shuru karein? Agar currentSum + nums[i] > nums[i] toh extend karo, nahi toh nums[i] se naya shuru karo. Yeh greedy choice se hum ek hi pass mein answer nikaaltein hain.',
      bruteForceApproach:
        'Try all possible subarrays: for every pair (i,j), compute the sum of nums[i..j] and track maximum.\nTime: O(n²) — O(n) pairs, each sum computed in O(1) with prefix sums, but still O(n²) pairs\nSpace: O(1)\n\nFor n=10⁵, this is 5×10⁹ operations — too slow.',
      betterApproach:
        'Divide and conquer: split array at midpoint, find max subarray in left half, right half, and crossing the midpoint.\nTime: O(n log n) | Space: O(log n)\n\nBetter than O(n²) but Kadane\'s is still faster.',
      optimizedApproach:
        "Kadane's algorithm:\n1. Initialize currentSum = maxSum = nums[0]\n2. For each element nums[i] starting at i=1:\n   a. currentSum = max(nums[i], currentSum + nums[i])\n      → start fresh if current prefix is harmful\n   b. maxSum = max(maxSum, currentSum)\n      → update global maximum\n3. Return maxSum\n\nTime: O(n) — single pass\nSpace: O(1) — two variables\n\nThis is provably optimal: we must read all n elements in the worst case.",
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 3, annotation: 'Init: maxSum = currentSum = nums[0] = -2.',
        variables: { maxSum: -2, currentSum: -2, i: 0 },
        dataStructureState: { type: 'array', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [0] },
      },
      {
        stepNumber: 2, line: 5, annotation: 'i=1, nums[1]=1. max(1, -2+1=-1) = 1. Fresh start! maxSum=max(-2,1)=1.',
        variables: { i: 1, 'nums[i]': 1, currentSum: 1, maxSum: 1 },
        dataStructureState: { type: 'array', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [1] },
      },
      {
        stepNumber: 3, line: 5, annotation: 'i=2, nums[2]=-3. max(-3, 1-3=-2) = -2. Extend. maxSum stays 1.',
        variables: { i: 2, 'nums[i]': -3, currentSum: -2, maxSum: 1 },
        dataStructureState: { type: 'array', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [2] },
      },
      {
        stepNumber: 4, line: 5, annotation: 'i=3, nums[3]=4. max(4, -2+4=2) = 4. Fresh start from index 3! maxSum=4.',
        variables: { i: 3, 'nums[i]': 4, currentSum: 4, maxSum: 4 },
        dataStructureState: { type: 'array', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [3] },
      },
      {
        stepNumber: 5, line: 5, annotation: 'i=4, nums[4]=-1. max(-1, 4-1=3) = 3. Extend. maxSum stays 4.',
        variables: { i: 4, 'nums[i]': -1, currentSum: 3, maxSum: 4 },
        dataStructureState: { type: 'array', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [3, 4] },
      },
      {
        stepNumber: 6, line: 5, annotation: 'i=5, nums[5]=2. max(2, 3+2=5) = 5. Extend. maxSum=5.',
        variables: { i: 5, 'nums[i]': 2, currentSum: 5, maxSum: 5 },
        dataStructureState: { type: 'array', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [3, 4, 5] },
      },
      {
        stepNumber: 7, line: 5, annotation: 'i=6, nums[6]=1. max(1, 5+1=6) = 6. Extend. maxSum=6! Best so far.',
        variables: { i: 6, 'nums[i]': 1, currentSum: 6, maxSum: 6 },
        dataStructureState: { type: 'array', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [3, 4, 5, 6] },
      },
      {
        stepNumber: 8, line: 7, annotation: 'Final maxSum = 6. Optimal subarray is [4,-1,2,1] at indices 3-6. ✓',
        variables: { result: 6, subarray: '[4,-1,2,1]' },
        dataStructureState: { type: 'array', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [3, 4, 5, 6] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 5, variables: { i: 1, 'nums[i]': 1, currentSum: 1, maxSum: 1 }, output: '', explanation: 'Fresh start: 1 > -2+1=-1. maxSum updated to 1.' },
      { step: 2, line: 5, variables: { i: 2, 'nums[i]': -3, currentSum: -2, maxSum: 1 }, output: '', explanation: 'Extend: max(-3, 1-3=-2)=-2. maxSum unchanged.' },
      { step: 3, line: 5, variables: { i: 3, 'nums[i]': 4, currentSum: 4, maxSum: 4 }, output: '', explanation: 'Fresh start: 4 > -2+4=2. New subarray begins here. maxSum=4.' },
      { step: 4, line: 5, variables: { i: 5, 'nums[i]': 2, currentSum: 5, maxSum: 5 }, output: '', explanation: 'Extend: 3+2=5 > 2. maxSum=5.' },
      { step: 5, line: 5, variables: { i: 6, 'nums[i]': 1, currentSum: 6, maxSum: 6 }, output: '6', explanation: 'Extend: 5+1=6. maxSum=6 — final answer ✓' },
    ],
    bugsOrWarnings: [
      { title: 'Incorrect initialization with 0', severity: 'High', explanation: 'Many incorrect implementations start maxSum = 0. This fails for all-negative arrays like [-3,-1,-4] — the correct answer is -1 but 0 would be returned.', fix: 'Always initialize maxSum = currentSum = nums[0], not 0.', suggestedCode: 'let maxSum = nums[0];\nlet currentSum = nums[0];' },
    ],
    edgeCases: [
      'All negative numbers [-3,-1,-4,-2] → -1 (least negative)',
      'Single element [5] → 5',
      'All positive [1,2,3] → 6 (entire array)',
      'Alternating pos/neg [1,-1,1,-1,1] → 1 (each single element)',
    ],
    similarProblems: ['Maximum Product Subarray', 'Best Time to Buy and Sell Stock', 'Maximum Sum Circular Subarray', 'Minimum Subarray Sum (k-sized)'],
    quizQuestions: [
      {
        question: 'Why does initializing maxSum = 0 instead of nums[0] cause a bug?',
        options: [
          'It makes the loop slower',
          'For all-negative arrays, 0 would be returned instead of the maximum (least negative) element',
          'It causes an infinite loop',
          'It is actually the correct initialization',
        ],
        correctAnswer: 'For all-negative arrays, 0 would be returned instead of the maximum (least negative) element',
        explanation: 'With nums=[-3,-1,-2], the correct answer is -1. But if maxSum starts at 0, currentSum never exceeds 0, and maxSum stays 0 — a wrong answer.',
      },
      {
        question: "What does currentSum = Math.max(nums[i], currentSum + nums[i]) decide?",
        options: [
          'Whether nums[i] is the largest element',
          'Whether to start a fresh subarray at i or extend the previous subarray',
          'The position of the maximum element',
          'Whether to include nums[i] in the result',
        ],
        correctAnswer: 'Whether to start a fresh subarray at i or extend the previous subarray',
        explanation: 'If currentSum is negative, then currentSum + nums[i] < nums[i], so starting fresh (just nums[i]) is better. Otherwise, extending is better.',
      },
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 8. Reverse Linked List ─────────────── */
  {
    title: 'Reverse a Linked List',
    problemStatement:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    code: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;  // save forward link
    curr.next = prev;        // reverse the pointer
    prev = curr;             // advance prev
    curr = next;             // advance curr
  }
  return prev;               // prev is now the new head
}`,
    sampleInput: 'head = [1,2,3,4,5]',
    expectedOutput: '[5,4,3,2,1]',
    pattern: 'Linked List / In-place Pointer Manipulation',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    explanation: {
      problemSummary:
        'Reverse all the next pointers of a singly linked list in-place so the tail becomes the new head.',
      questionExplanation:
        'The challenge is that once we set curr.next = prev (reversing the pointer), we lose the reference to the rest of the list. So we must save the forward reference BEFORE reversing.\n\nThree-pointer technique:\n• prev: the node that curr.next should point to after reversal\n• curr: the node being processed\n• next: temp storage for curr.next before we overwrite it\n\nWe move all three forward each iteration until curr reaches null.',
      hinglishExplanation:
        'Hum teen pointers use karte hain: prev (null se start), curr (head se start), aur next (temp). Har step mein:\n1. next = curr.next (save karo forward link)\n2. curr.next = prev (pointer ulta karo)\n3. prev = curr (prev aage badhao)\n4. curr = next (curr aage badhao)\nJab curr null ho jaaye, prev naya head hai.',
      bruteForceApproach:
        'Collect all node values into an array, reverse the array, then assign values back to list nodes.\nTime: O(n) | Space: O(n)\n\nWorks but uses O(n) extra space unnecessarily. Also reuses existing nodes rather than truly reversing pointers.',
      betterApproach:
        'Recursive reversal: recurse to end of list, then reverse pointers on the way back up.\nTime: O(n) | Space: O(n) — O(n) call stack depth\n\nElegant but uses O(n) stack space and can stack overflow for very long lists (n > 10⁵).',
      optimizedApproach:
        'Iterative in-place reversal:\n1. prev = null, curr = head\n2. While curr ≠ null:\n   a. next = curr.next (save)\n   b. curr.next = prev (reverse)\n   c. prev = curr (shift prev)\n   d. curr = next (shift curr)\n3. Return prev (new head)\n\nTime: O(n) — each node visited once\nSpace: O(1) — only 3 pointer variables\n\nThis is optimal on both dimensions.',
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 2, annotation: 'Initial state: prev=null, curr=node(1). List: 1→2→3→4→5',
        variables: { prev: 'null', curr: 'node(1)' },
        dataStructureState: { type: 'linked-list', values: [1, 2, 3, 4, 5], highlight: [0] },
      },
      {
        stepNumber: 2, line: 5, annotation: 'Save next=node(2). Reverse: node(1).next = null. prev=node(1), curr=node(2).',
        variables: { next: 'node(2)', 'curr.next': 'null → reversed!', prev: 'node(1)', curr: 'node(2)' },
        dataStructureState: { type: 'linked-list', values: [1, 2, 3, 4, 5], highlight: [0, 1] },
      },
      {
        stepNumber: 3, line: 5, annotation: 'Save next=node(3). Reverse: node(2).next = node(1). prev=node(2), curr=node(3).',
        variables: { next: 'node(3)', 'curr.next': 'node(1) → reversed!', prev: 'node(2)', curr: 'node(3)' },
        dataStructureState: { type: 'linked-list', values: [2, 1, 3, 4, 5], highlight: [0, 1, 2] },
      },
      {
        stepNumber: 4, line: 5, annotation: 'Save next=node(4). Reverse: node(3).next = node(2). prev=node(3), curr=node(4).',
        variables: { prev: 'node(3)', curr: 'node(4)' },
        dataStructureState: { type: 'linked-list', values: [3, 2, 1, 4, 5], highlight: [0, 1, 2, 3] },
      },
      {
        stepNumber: 5, line: 5, annotation: 'Save next=node(5). Reverse: node(4).next = node(3). prev=node(4), curr=node(5).',
        variables: { prev: 'node(4)', curr: 'node(5)' },
        dataStructureState: { type: 'linked-list', values: [4, 3, 2, 1, 5], highlight: [0, 1, 2, 3, 4] },
      },
      {
        stepNumber: 6, line: 5, annotation: 'Save next=null. Reverse: node(5).next = node(4). prev=node(5), curr=null.',
        variables: { prev: 'node(5)', curr: 'null' },
        dataStructureState: { type: 'linked-list', values: [5, 4, 3, 2, 1], highlight: [0, 1, 2, 3, 4] },
      },
      {
        stepNumber: 7, line: 9, annotation: 'curr is null — loop ends. Return prev = node(5) — new head. ✓',
        variables: { result: 'node(5) → 5→4→3→2→1' },
        dataStructureState: { type: 'linked-list', values: [5, 4, 3, 2, 1], highlight: [0] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 5, variables: { prev: 'null', curr: 'node(1)', next: 'node(2)' }, output: '', explanation: 'node(1).next = null. prev→1, curr→2' },
      { step: 2, line: 5, variables: { prev: 'node(1)', curr: 'node(2)', next: 'node(3)' }, output: '', explanation: 'node(2).next = node(1). prev→2, curr→3' },
      { step: 3, line: 5, variables: { prev: 'node(2)', curr: 'node(3)', next: 'node(4)' }, output: '', explanation: 'node(3).next = node(2). prev→3, curr→4' },
      { step: 4, line: 5, variables: { prev: 'node(3)', curr: 'node(4)', next: 'node(5)' }, output: '', explanation: 'node(4).next = node(3). prev→4, curr→5' },
      { step: 5, line: 5, variables: { prev: 'node(4)', curr: 'node(5)', next: 'null' }, output: '5→4→3→2→1', explanation: 'node(5).next = node(4). curr=null → return prev = node(5) ✓' },
    ],
    bugsOrWarnings: [
      { title: 'Forgetting to save next before reversing', severity: 'High', explanation: 'If you write curr.next = prev before saving next = curr.next, you permanently lose the reference to the rest of the list — no recovery possible.', fix: 'Always save: const next = curr.next; BEFORE curr.next = prev;', suggestedCode: 'const next = curr.next;  // Save FIRST\ncurr.next = prev;       // THEN reverse' },
    ],
    edgeCases: [
      'Empty list (head=null) → return null immediately (loop never executes)',
      'Single node → returns the same node (1 iteration: next=null, node.next=null, prev=node, curr=null)',
      'Two nodes [1,2] → [2,1]: straightforward 2-iteration case',
    ],
    similarProblems: ['Reverse Linked List II (partial reversal)', 'Palindrome Linked List', 'Rotate List', 'Swap Nodes in Pairs'],
    quizQuestions: [
      {
        question: 'Why must we save curr.next into a temp variable before reversing curr.next = prev?',
        options: [
          'To track the previous node',
          'Once curr.next is overwritten to prev, we permanently lose the reference to the rest of the list',
          'To improve performance',
          'JavaScript requires it',
        ],
        correctAnswer: 'Once curr.next is overwritten to prev, we permanently lose the reference to the rest of the list',
        explanation: 'curr.next = prev changes the pointer. If we haven\'t saved the original curr.next, we have no way to continue traversing — the remaining nodes become unreachable.',
      },
      {
        question: 'After the loop ends, why do we return prev instead of curr?',
        options: ['curr is always null at loop end', 'prev points to the original tail, which is the new head', 'Both are the same', 'curr points to the reversed list'],
        correctAnswer: 'prev points to the original tail, which is the new head',
        explanation: 'When curr becomes null (end of original list), prev is the last non-null node we processed — the original tail. Since all pointers are now reversed, this original tail is the new head of the reversed list.',
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 9. Number of Islands ─────────────── */
  {
    title: 'Number of Islands',
    problemStatement:
      "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    code: `function numIslands(grid: string[][]): number {
  let count = 0;
  function dfs(r: number, c: number) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0'; // mark as visited
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);
  }
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') { dfs(r, c); count++; }
    }
  }
  return count;
}`,
    sampleInput: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
    expectedOutput: '3',
    pattern: 'Graph DFS (Flood Fill)',
    difficulty: 'Medium',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    explanation: {
      problemSummary:
        'Count the number of connected components of land cells in a binary grid, where connectivity is 4-directional (up, down, left, right).',
      questionExplanation:
        'This is a classic connected-components problem on a grid graph.\n\nEach "1" cell is a graph node. Two cells are connected if they are adjacent (not diagonal). We need to count how many connected components exist.\n\nDFS flood-fill approach:\n• When we find an unvisited land cell, we\'ve found a new island → count++\n• We immediately DFS into all 4 neighbors, marking each cell "0" as we visit it\n• This prevents double-counting the same island\n• The outer double loop ensures we visit every cell exactly once overall',
      hinglishExplanation:
        'Hum grid ko ek graph ki tarah treat karte hain. Jab bhi koi "1" cell mile, ek naya island mila — count badhao. Fir DFS se poore island ke saare cells ko "0" mark karo taaki dubara count na ho. Outer loop se har cell ek hi baar process hoti hai.',
      bruteForceApproach:
        'For each unvisited "1", do a BFS/DFS to mark the island, then count. This is what we\'re already doing — there\'s no simpler brute force since we must visit all cells.',
      betterApproach:
        'BFS instead of DFS: use a queue to explore each island level by level. Avoids deep recursion for very large islands.\nTime: O(m×n) | Space: O(min(m,n)) — queue size bounded by the perimeter of an island.',
      optimizedApproach:
        'Union-Find (Disjoint Set Union):\n1. Initialize each "1" cell as its own component\n2. For each "1" cell, union it with right and bottom neighbors if they are "1"\n3. Count total distinct roots\n\nTime: O(m×n × α(mn)) where α is nearly O(1) inverse Ackermann\nSpace: O(m×n)\n\nIn practice, DFS is simpler to code and equally fast. Use Union-Find when you need to answer multiple queries.',
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 8, annotation: 'Start scanning grid. r=0, c=0: grid[0][0]="1" → found island #1!',
        variables: { r: 0, c: 0, count: 1, 'grid[0][0]': '"1"' },
        dataStructureState: { type: 'array', values: ['[1,1,0,0,0]', '[1,1,0,0,0]', '[0,0,1,0,0]', '[0,0,0,1,1]'], highlight: [0] },
      },
      {
        stepNumber: 2, line: 5, annotation: 'DFS from (0,0): mark (0,0)="0", recurse into 4 neighbors. Flood-fills entire island 1.',
        variables: { visited: '(0,0),(0,1),(1,0),(1,1)', 'island #1': 'top-left 2x2 block' },
        dataStructureState: { type: 'array', values: ['[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,1,0,0]', '[0,0,0,1,1]'], highlight: [0, 1] },
      },
      {
        stepNumber: 3, line: 8, annotation: 'Continue scanning. (2,2)="1" → found island #2!',
        variables: { r: 2, c: 2, count: 2, 'grid[2][2]': '"1"' },
        dataStructureState: { type: 'array', values: ['[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,1,0,0]', '[0,0,0,1,1]'], highlight: [2] },
      },
      {
        stepNumber: 4, line: 5, annotation: 'DFS from (2,2): marks (2,2)="0". All 4 neighbors are "0" or out of bounds. Island #2 = single cell.',
        variables: { visited: '(2,2)', 'island #2': 'single cell' },
        dataStructureState: { type: 'array', values: ['[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,0,1,1]'], highlight: [2] },
      },
      {
        stepNumber: 5, line: 8, annotation: 'Continue scanning. (3,3)="1" → found island #3!',
        variables: { r: 3, c: 3, count: 3, 'grid[3][3]': '"1"' },
        dataStructureState: { type: 'array', values: ['[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,0,1,1]'], highlight: [3] },
      },
      {
        stepNumber: 6, line: 5, annotation: 'DFS from (3,3): marks (3,3) and (3,4) as visited. Island #3 = two cells.',
        variables: { visited: '(3,3),(3,4)', 'island #3': 'two cells horizontal' },
        dataStructureState: { type: 'array', values: ['[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,0,0,0]'], highlight: [3] },
      },
      {
        stepNumber: 7, line: 12, annotation: 'Grid fully scanned. Total islands = 3 ✓',
        variables: { result: 3 },
        dataStructureState: { type: 'array', values: ['[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,0,0,0]', '[0,0,0,0,0]'], highlight: [] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 9, variables: { r: 0, c: 0, 'grid[r][c]': '"1"', count: 1 }, output: '', explanation: 'First land found → DFS flood-fills top-left 2×2 block. count=1.' },
      { step: 2, line: 9, variables: { r: 2, c: 2, 'grid[r][c]': '"1"', count: 2 }, output: '', explanation: 'Second isolated land cell found. DFS marks (2,2). count=2.' },
      { step: 3, line: 9, variables: { r: 3, c: 3, 'grid[r][c]': '"1"', count: 3 }, output: '3', explanation: 'Third island: (3,3) and (3,4) connected. DFS marks both. Final count=3 ✓' },
    ],
    bugsOrWarnings: [
      { title: 'Grid mutation without copy', severity: 'Low', explanation: 'We mark cells as "0" directly in the input grid to track visited cells. This mutates the original input.', fix: 'If the caller expects the original grid intact, make a deep copy first: const grid = input.map(row => [...row]);', suggestedCode: 'const grid = input.map(row => [...row]); // shallow copy each row' },
      { title: 'Stack overflow on large islands', severity: 'Medium', explanation: 'For a grid entirely filled with "1"s (e.g., 300×300), the DFS recursion depth can reach 90,000 — causing a stack overflow in JavaScript.', fix: 'Convert DFS to iterative using an explicit stack, or use BFS with a queue.', suggestedCode: '// BFS alternative:\nconst queue = [[r, c]];\nwhile (queue.length) {\n  const [row, col] = queue.shift()!;\n  // mark and enqueue neighbors\n}' },
    ],
    edgeCases: [
      'All water (all "0"s) → 0 islands',
      'All land (all "1"s) → 1 island (entire grid connected)',
      'Single cell "1" → 1 island',
      'Single row grid → each run of "1"s is a separate island',
      'Diagonally adjacent "1"s → counted as separate islands (only 4-directional connectivity)',
    ],
    similarProblems: ['Max Area of Island', 'Surrounded Regions', 'Pacific Atlantic Water Flow', 'Number of Provinces (graph version)', 'Making a Large Island'],
    quizQuestions: [
      {
        question: "Why do we set grid[r][c] = '0' when visiting a cell?",
        options: [
          "To count water cells separately",
          "To mark the cell as visited so DFS doesn't revisit it, preventing double-counting the same island",
          "To delete the island from the grid",
          "It's a required step in BFS only",
        ],
        correctAnswer: "To mark the cell as visited so DFS doesn't revisit it, preventing double-counting the same island",
        explanation: "Without marking, DFS from (0,0) could follow the path (0,0)→(0,1)→(0,0)→... in an infinite loop. Setting to '0' ensures each cell is processed exactly once.",
      },
      {
        question: 'Why is the time complexity O(m×n) even though we do DFS for each island?',
        options: [
          'Each DFS is O(m+n)',
          'Each cell is visited at most once: either the outer loop skips it (already "0") or the DFS marks it "0" immediately',
          'DFS has O(1) time complexity',
          'We only DFS from corner cells',
        ],
        correctAnswer: 'Each cell is visited at most once: either the outer loop skips it (already "0") or the DFS marks it "0" immediately',
        explanation: 'Once a cell is set to "0", no future DFS or outer-loop iteration will process it again. So total work across all DFS calls is O(m×n) — each of the m×n cells is processed exactly once.',
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },

  /* ─────────────── 10. LCS ─────────────── */
  {
    title: 'Longest Common Subsequence',
    problemStatement:
      'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguously.',
    code: `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  return dp[m][n];
}`,
    sampleInput: 'text1 = "abcde", text2 = "ace"',
    expectedOutput: '3',
    pattern: '2D Dynamic Programming',
    difficulty: 'Medium',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    explanation: {
      problemSummary:
        'Find the length of the longest subsequence that appears in both strings, where a subsequence preserves relative order but need not be contiguous.',
      questionExplanation:
        'Define dp[i][j] = length of LCS of text1[0..i-1] and text2[0..j-1].\n\nRecurrence:\n• If text1[i-1] === text2[j-1]: the characters match! We can extend the LCS of the previous prefixes: dp[i][j] = dp[i-1][j-1] + 1\n• If they don\'t match: the LCS either doesn\'t include text1[i-1] (→ dp[i-1][j]) or doesn\'t include text2[j-1] (→ dp[i][j-1]). Take the max.\n\nBase case: dp[0][j] = dp[i][0] = 0 (empty string has LCS of 0 with anything).\n\nFill the table row by row. dp[m][n] is the answer.',
      hinglishExplanation:
        'dp[i][j] ka matlab hai: text1 ke pehle i characters aur text2 ke pehle j characters mein LCS ki length. Agar dono ke last characters match karte hain toh dp[i][j] = dp[i-1][j-1] + 1. Nahi match karte toh max(dp[i-1][j], dp[i][j-1]) lete hain — matlab ek character skip karo kisi bhi string se.',
      bruteForceApproach:
        'Generate all 2^m subsequences of text1, check each against text2.\nTime: O(2^m × n) — completely infeasible for strings longer than 20 characters.',
      betterApproach:
        'Top-down recursion with memoization: lcs(i,j) = result of the same recurrence, cached in a 2D memo array.\nTime: O(m×n) | Space: O(m×n) for memo + O(m+n) call stack',
      optimizedApproach:
        'Bottom-up 2D DP (tabulation) — no recursion overhead:\n1. Create (m+1)×(n+1) table initialized to 0\n2. Fill row by row using the recurrence above\n3. Answer is dp[m][n]\n\nTime: O(m×n) | Space: O(m×n)\n\nFurther optimization: use rolling 2-row array to reduce space to O(n), since dp[i][j] only depends on dp[i-1][j-1], dp[i-1][j], dp[i][j-1].',
    },
    visualizationSteps: [
      {
        stepNumber: 1, line: 3, annotation: 'Init (6×4) dp table with zeros. Rows = ""+abcde, Cols = ""+ace.',
        variables: { m: 5, n: 3, table: '6×4 all zeros' },
        dataStructureState: { type: 'dp', values: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], highlight: [] },
      },
      {
        stepNumber: 2, line: 6, annotation: 'i=1 (text1[0]="a"), j=1 (text2[0]="a"): MATCH! dp[1][1] = dp[0][0]+1 = 1.',
        variables: { i: 1, j: 1, 'text1[0]': 'a', 'text2[0]': 'a', 'dp[1][1]': 1 },
        dataStructureState: { type: 'dp', values: [[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], highlight: [1] },
      },
      {
        stepNumber: 3, line: 6, annotation: 'i=2 (text1[1]="b"), j=2 (text2[1]="c"): NO match. dp[2][2]=max(dp[1][2],dp[2][1])=max(1,1)=1.',
        variables: { i: 2, j: 2, 'text1[1]': 'b', 'text2[1]': 'c', 'dp[2][2]': 1 },
        dataStructureState: { type: 'dp', values: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]], highlight: [2] },
      },
      {
        stepNumber: 4, line: 6, annotation: 'i=3 (text1[2]="c"), j=2 (text2[1]="c"): MATCH! dp[3][2] = dp[2][1]+1 = 2.',
        variables: { i: 3, j: 2, 'text1[2]': 'c', 'text2[1]': 'c', 'dp[3][2]': 2 },
        dataStructureState: { type: 'dp', values: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,0,0,0],[0,0,0,0]], highlight: [3] },
      },
      {
        stepNumber: 5, line: 6, annotation: 'i=5 (text1[4]="e"), j=3 (text2[2]="e"): MATCH! dp[5][3] = dp[4][2]+1 = 3.',
        variables: { i: 5, j: 3, 'text1[4]': 'e', 'text2[2]': 'e', 'dp[5][3]': 3 },
        dataStructureState: { type: 'dp', values: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]], highlight: [5] },
      },
      {
        stepNumber: 6, line: 13, annotation: 'Return dp[5][3] = 3. LCS is "ace" (length 3). ✓',
        variables: { result: 3, LCS: '"ace"' },
        dataStructureState: { type: 'dp', values: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]], highlight: [5] },
      },
    ],
    dryRunTable: [
      { step: 1, line: 6, variables: { i: 1, j: 1, 'text1[0]': 'a', 'text2[0]': 'a' }, output: '', explanation: 'Match "a"="a": dp[1][1] = dp[0][0]+1 = 1' },
      { step: 2, line: 6, variables: { i: 1, j: 2, 'text1[0]': 'a', 'text2[1]': 'c' }, output: '', explanation: 'No match: dp[1][2]=max(dp[0][2],dp[1][1])=max(0,1)=1' },
      { step: 3, line: 6, variables: { i: 3, j: 2, 'text1[2]': 'c', 'text2[1]': 'c' }, output: '', explanation: 'Match "c"="c": dp[3][2]=dp[2][1]+1=1+1=2' },
      { step: 4, line: 6, variables: { i: 5, j: 3, 'text1[4]': 'e', 'text2[2]': 'e' }, output: '3', explanation: 'Match "e"="e": dp[5][3]=dp[4][2]+1=2+1=3. LCS="ace" ✓' },
    ],
    bugsOrWarnings: [
      { title: 'Off-by-one in string indexing', severity: 'Medium', explanation: 'dp[i][j] represents the LCS of text1[0..i-1] and text2[0..j-1]. So when comparing characters, we use text1[i-1] and text2[j-1], NOT text1[i] and text2[j].', fix: 'Always use text1[i-1] === text2[j-1] inside the i,j loop.', suggestedCode: 'if (text1[i-1] === text2[j-1]) {  // i-1, not i!\n  dp[i][j] = dp[i-1][j-1] + 1;\n}' },
    ],
    edgeCases: [
      'One empty string: LCS = 0 (all dp[0][j] = dp[i][0] = 0)',
      'Identical strings "abc","abc" → LCS = 3 (entire string)',
      'No common characters "abc","xyz" → LCS = 0',
      'One string is a subsequence of other "ace","abcde" → LCS = 3 ("ace")',
    ],
    similarProblems: ['Edit Distance (Levenshtein)', 'Shortest Common Supersequence', 'Longest Palindromic Subsequence', 'Distinct Subsequences', 'Delete Operation for Two Strings'],
    quizQuestions: [
      {
        question: 'What does dp[i][j] represent in this algorithm?',
        options: [
          'The index of the last matching character',
          'The LCS length of text1[0..i-1] and text2[0..j-1]',
          'Whether characters at position i and j match',
          'The total number of subsequences',
        ],
        correctAnswer: 'The LCS length of text1[0..i-1] and text2[0..j-1]',
        explanation: 'dp[i][j] encodes the optimal solution for the subproblem of considering only the first i characters of text1 and first j characters of text2. The final answer is dp[m][n].',
      },
      {
        question: "When text1[i-1] !== text2[j-1], why do we take max(dp[i-1][j], dp[i][j-1])?",
        options: [
          'To handle the base case',
          'Because neither character is in the LCS at this position — we skip one of them and take the better option',
          'To avoid going out of bounds',
          'It is the sum, not the max',
        ],
        correctAnswer: 'Because neither character is in the LCS at this position — we skip one of them and take the better option',
        explanation: "If the characters don't match, we can't include both in the LCS. We try excluding text1[i-1] (→ dp[i-1][j]) or excluding text2[j-1] (→ dp[i][j-1]) and take whichever gives a longer subsequence.",
      },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

async function main() {
  const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!user) {
    console.error(`Demo user not found (${DEMO_EMAIL}). Log in with demo credentials first.`);
    process.exit(1);
  }

  console.log(`Found demo user: ${user.name} (${user.id})`);

  const deleted = await prisma.savedProblem.deleteMany({ where: { userId: user.id } });
  console.log(`Cleared ${deleted.count} existing saved problems.`);

  for (const sample of samples) {
    await prisma.savedProblem.create({
      data: {
        userId: user.id,
        title: sample.title,
        problemStatement: sample.problemStatement,
        code: sample.code,
        sampleInput: sample.sampleInput,
        expectedOutput: sample.expectedOutput,
        pattern: sample.pattern,
        difficulty: sample.difficulty,
        timeComplexity: sample.timeComplexity,
        spaceComplexity: sample.spaceComplexity,
        explanation: sample.explanation as any,
        visualizationSteps: sample.visualizationSteps as any,
        dryRunTable: sample.dryRunTable as any,
        bugsOrWarnings: sample.bugsOrWarnings as any,
        edgeCases: sample.edgeCases as any,
        similarProblems: sample.similarProblems as any,
        quizQuestions: sample.quizQuestions as any,
        createdAt: sample.createdAt,
      },
    });
    console.log(`  ✓ Seeded: ${sample.title} (${sample.visualizationSteps.length} viz steps)`);
  }

  console.log(`\nDone! Seeded ${samples.length} problems with full visualizations.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
