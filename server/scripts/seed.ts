import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db';
import { Chapter } from '../models/chapter.model';
import { Topic } from '../models/topic.model';
import { Problem, ProblemDifficulty } from '../models/problem.model';
import { logger } from '../utils/logger';

dotenv.config();

interface SeedProblem {
  title: string;
  slug: string;
  description: string;
  difficulty: ProblemDifficulty;
  order: number;
  resources: {
    youtubeUrl: string | null;
    practiceUrl: string | null;
    articleUrl: string | null;
  };
}

interface SeedTopic {
  title: string;
  slug: string;
  description: string;
  order: number;
  problems: SeedProblem[];
}

interface SeedChapter {
  title: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  topics: SeedTopic[];
}

const dsaCatalogData: SeedChapter[] = [
  {
    title: 'Arrays',
    slug: 'arrays',
    description: 'Master array manipulations, two-pointer techniques, sliding windows, and prefix sums.',
    order: 1,
    isActive: true,
    topics: [
      {
        title: 'Two Pointers & Traversal',
        slug: 'two-pointers-and-traversal',
        description: 'Techniques using multiple pointers moving in tandem or opposite directions.',
        order: 1,
        problems: [
          {
            title: 'Two Sum',
            slug: 'two-sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/two-sum/',
              articleUrl: 'https://en.wikipedia.org/wiki/Subset_sum_problem',
            },
          },
          {
            title: '3Sum',
            slug: '3sum',
            description: 'Find all unique triplets in the array which gives the sum of zero.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/3sum/',
              articleUrl: null,
            },
          },
          {
            title: 'Trapping Rain Water',
            slug: 'trapping-rain-water',
            description: 'Compute how much water an elevation map can trap after raining using two pointers.',
            difficulty: 'Hard',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/trapping-rain-water/',
              articleUrl: null,
            },
          },
        ],
      },
      {
        title: 'Sliding Window',
        slug: 'sliding-window',
        description: 'Optimize subarray and subsegment search problems using expandable and shrinkable windows.',
        order: 2,
        problems: [
          {
            title: 'Best Time to Buy and Sell Stock',
            slug: 'best-time-to-buy-and-sell-stock',
            description: 'Find the maximum profit you can achieve from buying on one day and selling on another.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
              articleUrl: null,
            },
          },
          {
            title: 'Maximum Subarray',
            slug: 'maximum-subarray',
            description: 'Find the contiguous subarray which has the largest sum using Kadane Algorithm.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/maximum-subarray/',
              articleUrl: null,
            },
          },
          {
            title: 'Sliding Window Maximum',
            slug: 'sliding-window-maximum',
            description: 'Find the maximum element in each sliding window of size k moving across an array.',
            difficulty: 'Hard',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/sliding-window-maximum/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Strings',
    slug: 'strings',
    description: 'Core string parsing, anagram detection, palindromes, and substring patterns.',
    order: 2,
    isActive: true,
    topics: [
      {
        title: 'Basic String Manipulation',
        slug: 'basic-string-manipulation',
        description: 'Fundamental string reversals, validations, and character frequency counts.',
        order: 1,
        problems: [
          {
            title: 'Valid Palindrome',
            slug: 'valid-palindrome',
            description: 'Verify if a string reads the same forward and backward after removing non-alphanumeric characters.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/valid-palindrome/',
              articleUrl: null,
            },
          },
          {
            title: 'Longest Substring Without Repeating Characters',
            slug: 'longest-substring-without-repeating-characters',
            description: 'Find the length of the longest substring without duplicate characters.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
              articleUrl: null,
            },
          },
        ],
      },
      {
        title: 'String Matching & Anagrams',
        slug: 'string-matching-and-anagrams',
        description: 'Substrings, anagram comparisons, and frequency hashing.',
        order: 2,
        problems: [
          {
            title: 'Valid Anagram',
            slug: 'valid-anagram',
            description: 'Determine if two strings are anagrams of each other.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/valid-anagram/',
              articleUrl: null,
            },
          },
          {
            title: 'Longest Palindromic Substring',
            slug: 'longest-palindromic-substring',
            description: 'Return the longest contiguous palindromic substring.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
              articleUrl: null,
            },
          },
          {
            title: 'Minimum Window Substring',
            slug: 'minimum-window-substring',
            description: 'Find the minimum window in s which will contain all the characters in t.',
            difficulty: 'Hard',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/minimum-window-substring/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Linked Lists',
    slug: 'linked-lists',
    description: 'Pointer manipulation, cycle detection, list merging, and sentinel nodes.',
    order: 3,
    isActive: true,
    topics: [
      {
        title: 'Singly Linked Lists',
        slug: 'singly-linked-lists',
        description: 'Basic traversals, element removals, and in-place list reversals.',
        order: 1,
        problems: [
          {
            title: 'Reverse Linked List',
            slug: 'reverse-linked-list',
            description: 'Reverse a singly linked list iteratively and recursively.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/reverse-linked-list/',
              articleUrl: null,
            },
          },
          {
            title: 'Middle of the Linked List',
            slug: 'middle-of-the-linked-list',
            description: 'Find the middle node of a linked list using the fast and slow pointer technique.',
            difficulty: 'Easy',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/',
              articleUrl: null,
            },
          },
          {
            title: 'Add Two Numbers',
            slug: 'add-two-numbers',
            description: 'Add two numbers represented by linked lists stored in reverse order.',
            difficulty: 'Medium',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/add-two-numbers/',
              articleUrl: null,
            },
          },
        ],
      },
      {
        title: 'Cycle Detection & Fast/Slow Pointers',
        slug: 'cycle-detection',
        description: "Floyd's cycle-finding algorithm and list merging strategies.",
        order: 2,
        problems: [
          {
            title: 'Linked List Cycle',
            slug: 'linked-list-cycle',
            description: 'Determine if the linked list has a cycle using constant memory.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/linked-list-cycle/',
              articleUrl: null,
            },
          },
          {
            title: 'Merge k Sorted Lists',
            slug: 'merge-k-sorted-lists',
            description: 'Merge k sorted linked lists and return it as one sorted list.',
            difficulty: 'Hard',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Stacks',
    slug: 'stacks',
    description: 'LIFO data structure applications, parentheses parsing, and monotonic stacks.',
    order: 4,
    isActive: true,
    topics: [
      {
        title: 'Stack Fundamentals & Monotonic Stack',
        slug: 'monotonic-stack',
        description: 'Using monotonic increasing and decreasing stacks to solve range queries in linear time.',
        order: 1,
        problems: [
          {
            title: 'Valid Parentheses',
            slug: 'valid-parentheses',
            description: 'Determine if input string containing brackets is valid.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/valid-parentheses/',
              articleUrl: null,
            },
          },
          {
            title: 'Daily Temperatures',
            slug: 'daily-temperatures',
            description: 'Find how many days you have to wait until a warmer temperature.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/daily-temperatures/',
              articleUrl: null,
            },
          },
          {
            title: 'Largest Rectangle in Histogram',
            slug: 'largest-rectangle-in-histogram',
            description: 'Find the area of the largest rectangle in a histogram using a monotonic stack.',
            difficulty: 'Hard',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Queues',
    slug: 'queues',
    description: 'FIFO data structures, circular queues, and double-ended queues (deques).',
    order: 5,
    isActive: true,
    topics: [
      {
        title: 'Queue Design & Applications',
        slug: 'queue-design-and-applications',
        description: 'Implement and utilize queues for ordered streaming and BFS foundations.',
        order: 1,
        problems: [
          {
            title: 'Implement Queue using Stacks',
            slug: 'implement-queue-using-stacks',
            description: 'Implement a first-in-first-out (FIFO) queue using only two standard stacks.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/',
              articleUrl: null,
            },
          },
          {
            title: 'Design Circular Queue',
            slug: 'design-circular-queue',
            description: 'Design a circular queue data structure using a fixed-size buffer.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/design-circular-queue/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Trees',
    slug: 'trees',
    description: 'Binary trees, binary search trees (BST), balanced trees, and tree traversals.',
    order: 6,
    isActive: true,
    topics: [
      {
        title: 'Binary Tree Traversals',
        slug: 'binary-tree-traversals',
        description: 'Pre-order, in-order, post-order, and level-order (BFS) traversals.',
        order: 1,
        problems: [
          {
            title: 'Maximum Depth of Binary Tree',
            slug: 'maximum-depth-of-binary-tree',
            description: 'Find the maximum depth (height) of a binary tree.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
              articleUrl: null,
            },
          },
          {
            title: 'Invert Binary Tree',
            slug: 'invert-binary-tree',
            description: 'Invert a binary tree so that all left and right subtrees are swapped.',
            difficulty: 'Easy',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/invert-binary-tree/',
              articleUrl: null,
            },
          },
          {
            title: 'Binary Tree Level Order Traversal',
            slug: 'binary-tree-level-order-traversal',
            description: 'Return the level order traversal of binary tree node values.',
            difficulty: 'Medium',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
              articleUrl: null,
            },
          },
        ],
      },
      {
        title: 'Binary Search Trees (BST)',
        slug: 'binary-search-trees',
        description: 'Properties of BST, validation, searching, and lowest common ancestors.',
        order: 2,
        problems: [
          {
            title: 'Validate Binary Search Tree',
            slug: 'validate-binary-search-tree',
            description: 'Determine if a binary tree is a valid binary search tree.',
            difficulty: 'Medium',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
              articleUrl: null,
            },
          },
          {
            title: 'Lowest Common Ancestor of a Binary Search Tree',
            slug: 'lowest-common-ancestor-of-a-binary-search-tree',
            description: 'Find the lowest common ancestor node of two given nodes in a BST.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
              articleUrl: null,
            },
          },
          {
            title: 'Binary Tree Maximum Path Sum',
            slug: 'binary-tree-maximum-path-sum',
            description: 'Find the maximum path sum of any non-empty path in a binary tree.',
            difficulty: 'Hard',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Graphs',
    slug: 'graphs',
    description: 'Adjacency representations, BFS, DFS, connectivity, and topological sorting.',
    order: 7,
    isActive: true,
    topics: [
      {
        title: 'Graph Traversal (BFS & DFS)',
        slug: 'graph-traversal',
        description: 'Explore connected components, islands, and cycles in graphs.',
        order: 1,
        problems: [
          {
            title: 'Number of Islands',
            slug: 'number-of-islands',
            description: 'Count the number of islands in a 2D binary grid using breadth-first or depth-first search.',
            difficulty: 'Medium',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/number-of-islands/',
              articleUrl: null,
            },
          },
          {
            title: 'Clone Graph',
            slug: 'clone-graph',
            description: 'Return a deep copy of a connected undirected graph.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/clone-graph/',
              articleUrl: null,
            },
          },
          {
            title: 'Word Ladder',
            slug: 'word-ladder',
            description: 'Find the length of the shortest transformation sequence from beginWord to endWord using BFS.',
            difficulty: 'Hard',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/word-ladder/',
              articleUrl: null,
            },
          },
        ],
      },
      {
        title: 'Topological Sort & Dependency Resolution',
        slug: 'topological-sort',
        description: "Ordering vertices in Directed Acyclic Graphs (DAGs) using Kahn's algorithm or DFS.",
        order: 2,
        problems: [
          {
            title: 'Course Schedule',
            slug: 'course-schedule',
            description: 'Determine if you can finish all courses given prerequisite dependencies.',
            difficulty: 'Medium',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/course-schedule/',
              articleUrl: null,
            },
          },
          {
            title: 'Course Schedule II',
            slug: 'course-schedule-ii',
            description: 'Return the ordering of courses you should take to finish all courses.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/course-schedule-ii/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    description: 'Logarithmic search techniques on sorted arrays, rotated arrays, and solution spaces.',
    order: 8,
    isActive: true,
    topics: [
      {
        title: 'Binary Search Fundamentals',
        slug: 'binary-search-fundamentals',
        description: 'Boundary checks, lower/upper bounds, and searching rotated spaces.',
        order: 1,
        problems: [
          {
            title: 'Binary Search',
            slug: 'binary-search',
            description: 'Given an array of integers nums which is sorted in ascending order, search target in O(log n).',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/binary-search/',
              articleUrl: null,
            },
          },
          {
            title: 'Search in Rotated Sorted Array',
            slug: 'search-in-rotated-sorted-array',
            description: 'Search for target in an array sorted in ascending order that has been rotated at an unknown pivot.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
              articleUrl: null,
            },
          },
          {
            title: 'Find Minimum in Rotated Sorted Array',
            slug: 'find-minimum-in-rotated-sorted-array',
            description: 'Find the minimum element in an array sorted in ascending order and rotated.',
            difficulty: 'Medium',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
              articleUrl: null,
            },
          },
          {
            title: 'Median of Two Sorted Arrays',
            slug: 'median-of-two-sorted-arrays',
            description: 'Find the median of two sorted arrays of size m and n with overall run time complexity O(log (m+n)).',
            difficulty: 'Hard',
            order: 4,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Recursion',
    slug: 'recursion',
    description: 'Base cases, recursive trees, backtracking, and combination exploration.',
    order: 9,
    isActive: true,
    topics: [
      {
        title: 'Backtracking & State Exploration',
        slug: 'backtracking-and-state-exploration',
        description: 'Explore all permutations, combinations, and puzzle constraint satisfaction.',
        order: 1,
        problems: [
          {
            title: 'Subsets',
            slug: 'subsets',
            description: 'Return all possible power set subsets of an integer array with unique elements.',
            difficulty: 'Medium',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/subsets/',
              articleUrl: null,
            },
          },
          {
            title: 'Permutations',
            slug: 'permutations',
            description: 'Given an array nums of distinct integers, return all the possible permutations.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/permutations/',
              articleUrl: null,
            },
          },
          {
            title: 'N-Queens',
            slug: 'n-queens',
            description: 'Place n queens on an n x n chessboard such that no two queens attack each other.',
            difficulty: 'Hard',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/n-queens/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Dynamic Programming',
    slug: 'dynamic-programming',
    description: 'Overlapping subproblems, optimal substructure, memoization, and tabulation.',
    order: 10,
    isActive: true,
    topics: [
      {
        title: '1D Dynamic Programming',
        slug: '1d-dynamic-programming',
        description: 'Transition equations, state recurrence, and space optimization in one dimension.',
        order: 1,
        problems: [
          {
            title: 'Climbing Stairs',
            slug: 'climbing-stairs',
            description: 'Count distinct ways to climb n steps where each time you can climb 1 or 2 steps.',
            difficulty: 'Easy',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/climbing-stairs/',
              articleUrl: null,
            },
          },
          {
            title: 'House Robber',
            slug: 'house-robber',
            description: 'Determine the maximum amount of money you can rob tonight without alerting the police.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/house-robber/',
              articleUrl: null,
            },
          },
          {
            title: 'Coin Change',
            slug: 'coin-change',
            description: 'Compute the fewest number of coins that you need to make up that amount.',
            difficulty: 'Medium',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/coin-change/',
              articleUrl: null,
            },
          },
        ],
      },
      {
        title: '2D Dynamic Programming',
        slug: '2d-dynamic-programming',
        description: 'Grid paths, string alignments, knapsack problems, and matrix DP.',
        order: 2,
        problems: [
          {
            title: 'Unique Paths',
            slug: 'unique-paths',
            description: 'Find number of possible unique paths from top-left to bottom-right in an m x n grid.',
            difficulty: 'Medium',
            order: 1,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/unique-paths/',
              articleUrl: null,
            },
          },
          {
            title: 'Longest Common Subsequence',
            slug: 'longest-common-subsequence',
            description: 'Find the length of the longest common subsequence between two strings.',
            difficulty: 'Medium',
            order: 2,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/longest-common-subsequence/',
              articleUrl: null,
            },
          },
          {
            title: 'Edit Distance',
            slug: 'edit-distance',
            description: 'Find the minimum number of operations required to convert word1 to word2.',
            difficulty: 'Hard',
            order: 3,
            resources: {
              youtubeUrl: null,
              practiceUrl: 'https://leetcode.com/problems/edit-distance/',
              articleUrl: null,
            },
          },
        ],
      },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting idempotent DSA catalog seeding...');
    await connectDB();

    let chaptersUpserted = 0;
    let topicsUpserted = 0;
    let problemsUpserted = 0;

    for (const chapterData of dsaCatalogData) {
      const { topics, ...chapterFields } = chapterData;

      // Idempotently upsert Chapter by slug
      const chapter = await Chapter.findOneAndUpdate(
        { slug: chapterFields.slug },
        { $set: chapterFields },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      chaptersUpserted++;

      for (const topicData of topics) {
        const { problems, ...topicFields } = topicData;

        // Idempotently upsert Topic by (chapterId, slug)
        const topic = await Topic.findOneAndUpdate(
          { chapterId: chapter._id, slug: topicFields.slug },
          { $set: { ...topicFields, chapterId: chapter._id } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        topicsUpserted++;

        for (const problemFields of problems) {
          // Idempotently upsert Problem by (topicId, slug)
          await Problem.findOneAndUpdate(
            { topicId: topic._id, slug: problemFields.slug },
            { $set: { ...problemFields, topicId: topic._id } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          problemsUpserted++;
        }
      }
    }

    logger.info('✅ DSA Catalog seeding completed successfully!');
    logger.info(`   - Chapters upserted: ${chaptersUpserted}`);
    logger.info(`   - Topics upserted: ${topicsUpserted}`);
    logger.info(`   - Problems upserted: ${problemsUpserted}`);
  } catch (error) {
    logger.error('❌ Error seeding DSA catalog:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

// Execute if run directly from CLI
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
