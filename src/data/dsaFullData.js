// src/data/dsaFullData.js
// Complete 90-Day DSA Learning System Dataset

export const DSA_PHASES = [
  {
    id: 'phase-1',
    title: 'Phase 1 — Fundamentals',
    dayRange: 'Days 1–20',
    description: 'Master core complexity, foundational arrays, strings, bit manipulation, and linked lists.',
    tracks: [
      {
        id: 'days-1-3',
        title: 'Days 1–3 — Algorithmic Thinking & Complexity',
        duration: '3 Days',
        subtracks: [
          {
            id: 'algo-basics',
            title: 'Basics of Algorithms',
            concepts: [
              { id: 'c-algo-def', name: 'What is an algorithm?', learn: 'Definition of an algorithm, input-output properties, correctness, and efficiency metrics.' },
              { id: 'c-time-comp', name: 'Time Complexity Basics', learn: 'Understanding operation counting, worst-case, average-case, and best-case performance.' },
              { id: 'c-space-comp', name: 'Space Complexity & Memory', learn: 'Auxiliary space vs Total space complexity, stack frames in recursion, heap memory allocation.' }
            ]
          },
          {
            id: 'big-o-notation',
            title: 'Big-O Notation',
            concepts: [
              { id: 'c-bigo-o1', name: 'O(1) — Constant Time', learn: 'Array indexing, basic math operations, direct stack push/pop.' },
              { id: 'c-bigo-logn', name: 'O(log n) — Logarithmic Time', learn: 'Binary search, divide & conquer problem halving.' },
              { id: 'c-bigo-n', name: 'O(n) — Linear Time', learn: 'Single loops, array traversals, simple linear search.' },
              { id: 'c-bigo-n2', name: 'O(n²) — Quadratic Time', learn: 'Nested loops, bubble sort, pairwise element comparisons.' },
              { id: 'c-bigo-cheat', name: 'Big-O Cheat Sheet & Rules', learn: 'Comparing O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!). Dropping constant terms and non-dominant terms.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Big-O Notation Complete Guide', type: 'GitHub', link: 'https://github.com/jwasham/coding-interview-university#algorithmic-complexity--big-o--asymptotic-analysis', desc: 'Detailed breakdown of time & space complexities.' },
            { title: 'Asymptotic Analysis & Big O Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=g2o22C3CRfU', desc: 'FreeCodeCamp complete video lecture on complexity analysis.' }
          ],
          preference2: [
            { title: 'Big-O CheatSheet Visual Map', type: 'Article', link: 'https://www.bigocheatsheet.com/', desc: 'Graphical breakdown of common data structure operations.' },
            { title: 'MIT 6.006 Algorithmic Thinking Class', type: 'YouTube', link: 'https://www.youtube.com/watch?v=ZaKxUqgCEwU', desc: 'MIT OpenCourseWare Intro to Algorithms.' }
          ],
          preference3: [
            { title: 'GeeksforGeeks Time & Space Complexity', type: 'Article', link: 'https://www.geeksforgeeks.org/time-complexity-and-space-complexity/', desc: 'Detailed mathematical proofs and examples.' }
          ]
        }
      },
      {
        id: 'days-4-7',
        title: 'Days 4–7 — Arrays',
        duration: '4 Days',
        subtracks: [
          {
            id: 'array-basics',
            title: 'Basics',
            concepts: [
              { id: 'c-arr-intro', name: 'Array Introduction & Memory Layout', learn: 'Contiguous memory allocation, static vs dynamic arrays, element access in O(1).' },
              { id: 'c-arr-traversal', name: 'Traversal', learn: 'Looping forward and backward through arrays, multi-dimensional array iteration.' },
              { id: 'c-arr-insertion', name: 'Insertion', learn: 'Inserting at start O(n), middle O(n), and end O(1) amortized.' },
              { id: 'c-arr-deletion', name: 'Deletion', learn: 'Deleting elements and shifting remaining elements left.' },
              { id: 'c-arr-searching', name: 'Searching', learn: 'Linear search vs sorted binary search.' },
              { id: 'c-arr-updating', name: 'Updating', learn: 'Modifying array values by index in constant time O(1).' }
            ]
          },
          {
            id: 'array-advanced',
            title: 'Advanced Techniques',
            concepts: [
              { id: 'c-prefix-sum', name: 'Prefix Sum Array', learn: 'Precomputing cumulative sums to answer range sum queries in O(1) time.' },
              { id: 'c-kadane', name: 'Kadane\'s Algorithm', learn: 'Finding contiguous subarray with maximum sum in linear time O(n).' },
              { id: 'c-sliding-win-intro', name: 'Sliding Window Technique', learn: 'Maintaining a window of elements to solve subarray/substring problems efficiently.' }
            ]
          },
          {
            id: 'array-practice',
            title: 'Practice Problems',
            concepts: [
              { id: 'c-arr-p1', name: 'Two Sum (LeetCode #1)', learn: 'Use HashMap or Two Pointers to find pair with target sum.' },
              { id: 'c-arr-p2', name: 'Best Time to Buy & Sell Stock (LeetCode #121)', learn: 'Track minimum price and maximum profit in a single pass.' },
              { id: 'c-arr-p3', name: 'Contains Duplicate (LeetCode #217)', learn: 'Use HashSet to detect duplicates in O(n) time.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Array Data Structure Repository', type: 'GitHub', link: 'https://github.com/youngyangyang04/leetcode-master', desc: 'Carl Striver array technique guides and code templates.' },
            { title: 'Arrays & Subarrays Deep Dive', type: 'YouTube', link: 'https://www.youtube.com/watch?v=N0MgLVcefcg', desc: 'Complete Array & Kadane algorithm breakdown.' }
          ],
          preference2: [
            { title: 'NeetCode Array & Hashing Roadmap', type: 'Practice', link: 'https://neetcode.io/roadmap', desc: 'Curated list of array interview problems.' }
          ],
          preference3: [
            { title: 'Striver A2Z DSA Sheet — Arrays', type: 'Practice', link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2', desc: 'Step-by-step array problem sheet.' }
          ]
        }
      },
      {
        id: 'days-8-10',
        title: 'Days 8–10 — Strings',
        duration: '3 Days',
        subtracks: [
          {
            id: 'string-ops',
            title: 'Basic Operations',
            concepts: [
              { id: 'c-str-reversal', name: 'Reversal', learn: 'Reversing strings in-place or returning new strings using two pointers.' },
              { id: 'c-str-palindrome', name: 'Palindrome Checking', learn: 'Verifying symmetrical strings ignoring non-alphanumeric characters.' },
              { id: 'c-str-freq', name: 'Frequency Count', learn: 'Counting character occurrences using array hashing [26] or HashMaps.' }
            ]
          },
          {
            id: 'string-problems',
            title: 'Common Patterns',
            concepts: [
              { id: 'c-str-anagram', name: 'Valid Anagram (LeetCode #242)', learn: 'Character count comparison or array sorting.' },
              { id: 'c-str-subseq', name: 'Substrings vs Subsequences', learn: 'Contiguous vs non-contiguous ordered character groups.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'String Algorithm CheatSheet', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm', desc: 'String pattern techniques and algorithms.' },
            { title: 'String Manipulation Video Course', type: 'YouTube', link: 'https://www.youtube.com/watch?v=UqQ5U8f0tS4', desc: 'Top string interview algorithms.' }
          ],
          preference2: [
            { title: 'LeetCode String Tagged Problems', type: 'Practice', link: 'https://leetcode.com/tag/string/', desc: 'All LeetCode string problems sorted by difficulty.' }
          ],
          preference3: [
            { title: 'GeeksforGeeks String Data Structure', type: 'Article', link: 'https://www.geeksforgeeks.org/string-data-structure/', desc: 'Detailed string operations and built-in methods.' }
          ]
        }
      },
      {
        id: 'days-11-14',
        title: 'Days 11–14 — Bit Manipulation Techniques',
        duration: '4 Days',
        subtracks: [
          {
            id: 'bit-ops',
            title: 'Core Operators',
            concepts: [
              { id: 'c-bit-and-or', name: 'AND (&) & OR (|)', learn: 'Masking bits, setting specific bits, and checking parity.' },
              { id: 'c-bit-xor', name: 'XOR (^) Operator', learn: 'Properties: a ^ a = 0, a ^ 0 = a. Self-inverting properties.' },
              { id: 'c-bit-shift', name: 'Shift Operators (<< , >>)', learn: 'Left shift (multiply by 2) and Right shift (divide by 2).' }
            ]
          },
          {
            id: 'bit-techniques',
            title: 'Techniques & Tricks',
            concepts: [
              { id: 'c-bit-count-set', name: 'Count Set Bits (Brian Kernighan)', learn: 'n & (n - 1) clears the lowest set bit in O(k) steps.' },
              { id: 'c-bit-unique', name: 'Find Unique Element (Single Number)', learn: 'Using XOR to cancel paired duplicates.' },
              { id: 'c-bit-power-2', name: 'Check Power of 2', learn: '(n > 0) && ((n & (n - 1)) == 0).' },
              { id: 'c-bit-masking', name: 'Bitmasking Basics', learn: 'Representing subset state combinations as integer bitfields.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Bit Hacks & Tricks GitHub Repo', type: 'GitHub', link: 'https://github.com/graphicsfuzz/bit-manipulation-tricks', desc: 'Bitwise tricks cheat sheet.' },
            { title: 'Bit Manipulation Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=PyFN_IyFAmE', desc: 'Detailed video on bitwise algorithms.' }
          ],
          preference2: [
            { title: 'Striver Bit Manipulation Series', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rnubhA_0EwYwXU9jZ9B05p', desc: 'Complete bitwise tutorial playlist.' }
          ],
          preference3: [
            { title: 'LeetCode Bit Manipulation Study Plan', type: 'Practice', link: 'https://leetcode.com/studyplan/bit-manipulation/', desc: 'Curated LeetCode bit problems.' }
          ]
        }
      },
      {
        id: 'days-15-20',
        title: 'Days 15–20 — Linked List',
        duration: '6 Days',
        subtracks: [
          {
            id: 'll-types',
            title: 'Types of Linked Lists',
            concepts: [
              { id: 'c-ll-singly', name: 'Singly Linked List', learn: 'Node structure (val, next), pointer traversal, memory dynamic allocation.' },
              { id: 'c-ll-doubly', name: 'Doubly Linked List', learn: 'Two pointer nodes (prev, next), two-way traversal, deletion in O(1).' }
            ]
          },
          {
            id: 'll-algorithms',
            title: 'Core Algorithms',
            concepts: [
              { id: 'c-ll-middle', name: 'Middle Element (Fast & Slow Pointers)', learn: 'Slow moves 1 step, Fast moves 2 steps. When Fast reaches end, Slow is at middle.' },
              { id: 'c-ll-floyd', name: 'Detect Loop (Floyd\'s Cycle Finding)', learn: 'If Fast and Slow pointers meet, a cycle exists in the Linked List.' },
              { id: 'c-ll-reversal', name: 'Reversal using Pointers', learn: 'Iterative 3-pointer reversal (prev, curr, next) and recursive reversal.' },
              { id: 'c-ll-dummy', name: 'Dummy Node Technique', learn: 'Simplifying edge cases when inserting/deleting at the head of a list.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Linked List Implementation Guide', type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/linked-list', desc: 'Clean JavaScript implementation with tests.' },
            { title: 'Linked List Deep Dive Video', type: 'YouTube', link: 'https://www.youtube.com/watch?v=Hj_rA0dhr2I', desc: 'Visual step-by-step linked list tutorial.' }
          ],
          preference2: [
            { title: 'NeetCode Linked List Problems', type: 'Practice', link: 'https://neetcode.io/practice', desc: 'Top 10 essential Linked List problems.' }
          ],
          preference3: [
            { title: 'GeeksforGeeks Linked List Tutorial', type: 'Article', link: 'https://www.geeksforgeeks.org/data-structures/linked-list/', desc: 'Complete conceptual articles.' }
          ]
        }
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Phase 2 — Core DSA',
    dayRange: 'Days 21–50',
    description: 'Master stacks, queues, hash tables, heaps, recursion, backtracking, and fundamental sorting.',
    tracks: [
      {
        id: 'days-21-25',
        title: 'Days 21–25 — Stacks',
        duration: '5 Days',
        subtracks: [
          {
            id: 'stack-impl',
            title: 'Implementation',
            concepts: [
              { id: 'c-stack-array', name: 'Array Implementation', learn: 'LIFO principle, push O(1), pop O(1), peek O(1), stack overflow handling.' },
              { id: 'c-stack-ll', name: 'Linked List Implementation', learn: 'Inserting and removing from head in O(1) constant time without capacity bounds.' }
            ]
          },
          {
            id: 'stack-apps',
            title: 'Applications',
            concepts: [
              { id: 'c-stack-paren', name: 'Parentheses Checker (Valid Parentheses)', learn: 'Pushing opening brackets, matching closing brackets using stack.' },
              { id: 'c-stack-infix', name: 'Infix to Postfix / Prefix Conversion', learn: 'Operator precedence stack evaluation.' },
              { id: 'c-stack-nge', name: 'Next Greater Element (Monotonic Stack)', learn: 'Maintaining decreasing monotonic stack to find next greater element in O(n).' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Monotonic Stack & Queue Guide', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm/blob/master/data_structure/%E5%8D%95%E8%B0%83%E6%A0%85.md', desc: 'Monotonic stack templates.' },
            { title: 'Stacks & Monotonic Stacks Lecture', type: 'YouTube', link: 'https://www.youtube.com/watch?v=Dq_ObZwTY_U', desc: 'Striver Next Greater Element tutorial.' }
          ],
          preference2: [
            { title: 'LeetCode Stack Tagged Problems', type: 'Practice', link: 'https://leetcode.com/tag/stack/', desc: 'Essential stack practice problems.' }
          ],
          preference3: [
            { title: 'GeeksforGeeks Stack Data Structure', type: 'Article', link: 'https://www.geeksforgeeks.org/stack-data-structure/', desc: 'Articles and examples.' }
          ]
        }
      },
      {
        id: 'days-26-30',
        title: 'Days 26–30 — Queues',
        duration: '5 Days',
        subtracks: [
          {
            id: 'queue-types',
            title: 'Types of Queues',
            concepts: [
              { id: 'c-queue-std', name: 'Standard Queue (FIFO)', learn: 'Enqueue O(1), Dequeue O(1), Front/Rear pointers.' },
              { id: 'c-queue-circular', name: 'Circular Queue', learn: 'Reusing array space using modulo arithmetic (rear + 1) % size.' },
              { id: 'c-queue-deque', name: 'Deque (Double-Ended Queue)', learn: 'Inserting & deleting from both front and back in O(1).' }
            ]
          },
          {
            id: 'queue-apps',
            title: 'Applications',
            concepts: [
              { id: 'c-queue-sliding-max', name: 'Sliding Window Maximum (Monotonic Deque)', learn: 'Maintaining indices of elements in decreasing order inside Deque.' },
              { id: 'c-queue-scheduling', name: 'Scheduling Algorithms', learn: 'Round-robin task queues, buffer management, BFS graph traversal queue.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Queue & Deque Implementations', type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/queue', desc: 'JavaScript queue implementation.' },
            { title: 'Sliding Window Maximum with Deque', type: 'YouTube', link: 'https://www.youtube.com/watch?v=CZQGRp93K4g', desc: 'NeetCode sliding window max tutorial.' }
          ],
          preference2: [
            { title: 'LeetCode Queue Tag', type: 'Practice', link: 'https://leetcode.com/tag/queue/', desc: 'Practice problems for Queues.' }
          ],
          preference3: [
            { title: 'GFG Queue Data Structure', type: 'Article', link: 'https://www.geeksforgeeks.org/queue-data-structure/', desc: 'Core articles.' }
          ]
        }
      },
      {
        id: 'days-31-35',
        title: 'Days 31–35 — Hash Tables',
        duration: '5 Days',
        subtracks: [
          {
            id: 'hash-concepts',
            title: 'Concepts',
            concepts: [
              { id: 'c-hash-func', name: 'Hashing & Hash Functions', learn: 'Mapping key objects to integer buckets uniform distribution.' },
              { id: 'c-hash-collisions', name: 'Collision Handling', learn: 'Chaining (LinkedList bucket) vs Open Addressing (Linear/Quadratic Probing, Double Hashing).' }
            ]
          },
          {
            id: 'hash-apps',
            title: 'Applications',
            concepts: [
              { id: 'c-hash-freq', name: 'Frequency Maps', learn: 'Tracking counts of numbers/strings in O(1) average lookup.' },
              { id: 'c-hash-prefix-opt', name: 'Prefix Sum + HashMap Optimization', learn: 'Solving Subarray Sum Equals K in O(n) time.' },
              { id: 'c-hash-2sum-3sum', name: 'Two Sum & Three Sum', learn: 'Complement lookup for instant pair matching.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'HashTable Implementation & Design', type: 'GitHub', link: 'https://github.com/jwasham/coding-interview-university#hash-table', desc: 'Detailed hashing notes.' },
            { title: 'Hash Table Crash Course', type: 'YouTube', link: 'https://www.youtube.com/watch?v=shsUJgJEMg0', desc: 'FreeCodeCamp hash map video.' }
          ],
          preference2: [
            { title: 'NeetCode Hash Map Practice', type: 'Practice', link: 'https://neetcode.io/practice', desc: 'Top Hash Map problem set.' }
          ],
          preference3: [
            { title: 'GeeksforGeeks Hashing', type: 'Article', link: 'https://www.geeksforgeeks.org/hashing-data-structure/', desc: 'Conceptual guides.' }
          ]
        }
      },
      {
        id: 'days-36-40',
        title: 'Days 36–40 — Heaps / Priority Queues',
        duration: '5 Days',
        subtracks: [
          {
            id: 'heap-min-max',
            title: 'Min & Max Heaps',
            concepts: [
              { id: 'c-heap-min', name: 'Min Heap Definition & Implementation', learn: 'Complete binary tree where parent node <= children nodes. Array representation [2*i + 1, 2*i + 2].' },
              { id: 'c-heap-max', name: 'Max Heap Definition & Implementation', learn: 'Parent node >= children nodes. Heapify-Up O(log n) and Heapify-Down O(log n).' },
              { id: 'c-heap-sort', name: 'Heap Sort', learn: 'Building heap in O(n) and extracting min/max n times in O(n log n).' }
            ]
          },
          {
            id: 'heap-problems',
            title: 'Problems & Applications',
            concepts: [
              { id: 'c-heap-kth', name: 'Kth Largest / Smallest Element', learn: 'Using Min Heap of size K to find Kth largest element in O(n log k).' },
              { id: 'c-heap-greedy-graph', name: 'Applications in Greedy & Graph Algorithms', learn: 'Dijkstra\'s shortest path algorithm and Prim\'s minimum spanning tree.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Priority Queue & Heap In-Depth', type: 'GitHub', link: 'https://github.com/williamfiset/Algorithms/tree/master/src/main/java/com/williamfiset/algorithms/datastructures/graphtheory', desc: 'WilliamFiset heap algorithms repo.' },
            { title: 'Heaps & Priority Queue Tutorial', type: 'YouTube', link: 'https://www.youtube.com/watch?v=HqPJF2L5h9U', desc: 'Complete Heapify and Heap Sort video.' }
          ],
          preference2: [
            { title: 'LeetCode Heap / PriorityQueue', type: 'Practice', link: 'https://leetcode.com/tag/heap-priority-queue/', desc: 'Heap problem practice.' }
          ],
          preference3: [
            { title: 'GFG Heap Data Structure', type: 'Article', link: 'https://www.geeksforgeeks.org/heap-data-structure/', desc: 'Heap articles and diagrams.' }
          ]
        }
      },
      {
        id: 'days-41-45',
        title: 'Days 41–45 — Recursion & Backtracking',
        duration: '5 Days',
        subtracks: [
          {
            id: 'recursion-fund',
            title: 'Recursion Fundamentals',
            concepts: [
              { id: 'c-rec-base-case', name: 'Base Case & Recursive Case', learn: 'Ensuring termination, call stack execution, call stack memory consumption.' },
              { id: 'c-rec-tree', name: 'Recursion Tree Visualization', learn: 'Drawing decision trees to calculate time complexity by branching factor.' }
            ]
          },
          {
            id: 'backtracking-tech',
            title: 'Backtracking Techniques',
            concepts: [
              { id: 'c-bt-nqueens', name: 'N-Queens Problem', learn: 'Placing N non-attacking queens on N x N board using backtracking.' },
              { id: 'c-bt-subsets', name: 'Subsets Generation', learn: 'Include / exclude element recursive choices.' },
              { id: 'c-bt-perms', name: 'Permutations Generation', learn: 'Swapping elements or tracking visited boolean arrays.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Backtracking Algorithm Templates', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm/blob/master/algorithm/%E5%9B%9E%E6%BA%AF%E7%AE%97%E6%B3%95%E8%AF%A6%E8%A7%A3%E6%B1%87%E7%BD%96.md', desc: 'Universal backtracking template.' },
            { title: 'Recursion & Backtracking Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=ZGgB9C2G8N8', desc: 'Striver recursion playlist.' }
          ],
          preference2: [
            { title: 'NeetCode Backtracking Playlist', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXg', desc: 'NeetCode problem solutions.' }
          ],
          preference3: [
            { title: 'GeeksforGeeks Backtracking', type: 'Article', link: 'https://www.geeksforgeeks.org/backtracking-algorithms/', desc: 'Backtracking conceptual guides.' }
          ]
        }
      },
      {
        id: 'days-46-50',
        title: 'Days 46–50 — Sorting Algorithms',
        duration: '5 Days',
        subtracks: [
          {
            id: 'quad-sorts',
            title: 'O(n²) Quadratic Sorts',
            concepts: [
              { id: 'c-sort-bubble', name: 'Bubble Sort', learn: 'Repeatedly swapping adjacent out-of-order elements in O(n²) time.' },
              { id: 'c-sort-selection', name: 'Selection Sort', learn: 'Finding minimum element in unsorted region and moving to front.' },
              { id: 'c-sort-insertion', name: 'Insertion Sort', learn: 'Building sorted array one element at a time. O(n) best-case for nearly sorted arrays.' }
            ]
          },
          {
            id: 'log-sorts',
            title: 'O(n log n) Divide & Conquer Sorts',
            concepts: [
              { id: 'c-sort-merge', name: 'Merge Sort', learn: 'Dividing array in half, recursively sorting halves, merging sorted halves in O(n log n) time and O(n) space.' },
              { id: 'c-sort-quick', name: 'Quick Sort', learn: 'Selecting pivot, partitioning array around pivot, sorting sub-arrays in-place O(n log n) average.' },
              { id: 'c-sort-comp', name: 'Sorting Complexity Comparison', learn: 'Stability, in-place behavior, time and space tradeoffs for all sorting algorithms.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Sorting Algorithms Visualizations & Code', type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms#sorting', desc: 'JavaScript sorting implementations.' },
            { title: 'Merge Sort & Quick Sort Explained', type: 'YouTube', link: 'https://www.youtube.com/watch?v=JSceec-wEyw', desc: 'FreeCodeCamp sorting tutorial.' }
          ],
          preference2: [
            { title: 'Visualgo Sorting Animations', type: 'Article', link: 'https://visualgo.net/en/sorting', desc: 'Interactive step-by-step sorting animation.' }
          ],
          preference3: [
            { title: 'GFG Sorting Algorithms', type: 'Article', link: 'https://www.geeksforgeeks.org/sorting-algorithms/', desc: 'Comparison charts and proofs.' }
          ]
        }
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Phase 3 — Trees & Advanced Structures',
    dayRange: 'Days 51–70',
    description: 'Master Binary Trees, Traversals, Binary Search, Tries, and Graph Theory.',
    tracks: [
      {
        id: 'days-51-55',
        title: 'Days 51–55 — Trees',
        duration: '5 Days',
        subtracks: [
          {
            id: 'tree-basics',
            title: 'Binary Tree Basics',
            concepts: [
              { id: 'c-tree-bfs', name: 'Breadth-First Search (BFS / Level-Order)', learn: 'Traversing tree level by level using Queue data structure.' },
              { id: 'c-tree-dfs', name: 'Depth-First Search (DFS)', learn: 'Exploring tree branches deeply using Recursion stack.' }
            ]
          },
          {
            id: 'tree-traversals',
            title: 'Tree Traversals',
            concepts: [
              { id: 'c-tree-inorder', name: 'Inorder Traversal (Left, Root, Right)', learn: 'Yields sorted order in Binary Search Trees.' },
              { id: 'c-tree-preorder', name: 'Preorder Traversal (Root, Left, Right)', learn: 'Used for copying or serializing trees.' },
              { id: 'c-tree-postorder', name: 'Postorder Traversal (Left, Right, Root)', learn: 'Used for deleting nodes or bottom-up evaluations.' }
            ]
          },
          {
            id: 'tree-key-concepts',
            title: 'Key Concepts',
            concepts: [
              { id: 'c-tree-height', name: 'Height of a Tree', learn: '1 + max(height(left), height(right)).' },
              { id: 'c-tree-diameter', name: 'Diameter of a Tree', learn: 'Longest path between any two nodes in a tree.' },
              { id: 'c-tree-lca', name: 'Lowest Common Ancestor (LCA)', learn: 'Finding shared parent node nearest to target nodes.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Binary Tree Algorithms Masterclass Repo', type: 'GitHub', link: 'https://github.com/striver7/Strivers-A2Z-DSA-Course', desc: 'Striver binary tree codebase.' },
            { title: 'Binary Tree Full Video Series', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJkFVk', desc: 'Striver complete Tree playlist.' }
          ],
          preference2: [
            { title: 'NeetCode Trees Checklist', type: 'Practice', link: 'https://neetcode.io/roadmap', desc: 'Trees problem set.' }
          ],
          preference3: [
            { title: 'GFG Binary Tree', type: 'Article', link: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', desc: 'Conceptual articles.' }
          ]
        }
      },
      {
        id: 'days-56-60',
        title: 'Days 56–60 — Binary Search',
        duration: '5 Days',
        subtracks: [
          {
            id: 'bs-tech',
            title: 'Binary Search Techniques',
            concepts: [
              { id: 'c-bs-iterative', name: 'Iterative Binary Search', learn: 'Maintaining low, high, and mid = low + (high - low) / 2 in while loop.' },
              { id: 'c-bs-recursive', name: 'Recursive Binary Search', learn: 'Recursive call stack halving range.' }
            ]
          },
          {
            id: 'bs-apps',
            title: 'Applications',
            concepts: [
              { id: 'c-bs-rotated', name: 'Rotated Sorted Arrays (LeetCode #33)', learn: 'Identifying which half is sorted to adjust low/high bounds.' },
              { id: 'c-bs-peak', name: 'Find Peak Element', learn: 'Using slope mid < mid + 1 to locate peak.' }
            ]
          },
          {
            id: 'bs-adv',
            title: 'Advanced Technique',
            concepts: [
              { id: 'c-bs-on-answer', name: 'Binary Search on Answer', learn: 'Monotonic check function condition for optimization problems (e.g. Koko Eating Bananas, Capacity to Ship Packages).' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Binary Search Patterns Guide', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm/blob/master/think_like_computer/BinarySearch.md', desc: 'Universal binary search framework.' },
            { title: 'Binary Search on Answer Masterclass', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF', desc: 'Striver Binary Search playlist.' }
          ],
          preference2: [
            { title: 'LeetCode Binary Search Study Plan', type: 'Practice', link: 'https://leetcode.com/studyplan/binary-search/', desc: 'Curated problem list.' }
          ],
          preference3: [
            { title: 'GFG Binary Search', type: 'Article', link: 'https://www.geeksforgeeks.org/binary-search/', desc: 'Conceptual examples.' }
          ]
        }
      },
      {
        id: 'days-61-65',
        title: 'Days 61–65 — Tries',
        duration: '5 Days',
        subtracks: [
          {
            id: 'trie-impl',
            title: 'Implementation & Operations',
            concepts: [
              { id: 'c-trie-node', name: 'Trie Node & Structure', learn: 'Node with children map/array [26] and isEndOfWord boolean flag.' },
              { id: 'c-trie-insert-search', name: 'Insert & Search Operations', learn: 'Inserting string O(L) where L is string length, search O(L).' },
              { id: 'c-trie-prefix', name: 'Prefix Search & Autocomplete', learn: 'Finding if any word starts with prefix and returning autocomplete suggestions.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Trie Data Structure Implementation', type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/trie', desc: 'Clean JavaScript Trie.' },
            { title: 'Trie Data Structure & Problems', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0pcIDCZnntUGFwjH55L7Qov', desc: 'Striver Trie playlist.' }
          ],
          preference2: [
            { title: 'LeetCode Trie Tag', type: 'Practice', link: 'https://leetcode.com/tag/trie/', desc: 'Practice problems.' }
          ],
          preference3: [
            { title: 'GFG Trie Tutorial', type: 'Article', link: 'https://www.geeksforgeeks.org/trie-insert-and-search/', desc: 'Articles and examples.' }
          ]
        }
      },
      {
        id: 'days-66-70',
        title: 'Days 66–70 — Graph Theory Basics',
        duration: '5 Days',
        subtracks: [
          {
            id: 'graph-rep',
            title: 'Graph Representation',
            concepts: [
              { id: 'c-graph-adj-list', name: 'Adjacency List', learn: 'Map of vertex -> list of neighbor nodes. O(V + E) space.' },
              { id: 'c-graph-adj-matrix', name: 'Adjacency Matrix', learn: '2D matrix V x V. Constant edge check O(1), O(V²) space.' }
            ]
          },
          {
            id: 'graph-traversal',
            title: 'Graph Traversals',
            concepts: [
              { id: 'c-graph-bfs', name: 'BFS Traversal', learn: 'Queue-based level order graph exploration. Shortest path in unweighted graphs.' },
              { id: 'c-graph-dfs', name: 'DFS Traversal', learn: 'Recursion/stack-based depth exploration. Connected components, cycle detection.' },
              { id: 'c-graph-types', name: 'Directed vs Undirected & Weighted vs Unweighted', learn: 'Edge directionality and edge weight differences.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Graph Theory Algorithms Repository', type: 'GitHub', link: 'https://github.com/williamfiset/Algorithms/tree/master/src/main/java/com/williamfiset/algorithms/graphtheory', desc: 'WilliamFiset graph algorithms.' },
            { title: 'Graph Theory Full Video Course', type: 'YouTube', link: 'https://www.youtube.com/watch?v=tWVWeAqZ0WU', desc: 'FreeCodeCamp 6-hour Graph theory course.' }
          ],
          preference2: [
            { title: 'Striver Graph Series', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5zQVFEPwXz', desc: 'Top Graph interview playlist.' }
          ],
          preference3: [
            { title: 'LeetCode Graph Study Plan', type: 'Practice', link: 'https://leetcode.com/studyplan/graph-theory/', desc: 'Practice problems.' }
          ]
        }
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Phase 4 — Algorithms & Optimization',
    dayRange: 'Days 71–90',
    description: 'Master Greedy Choice, Dynamic Programming (Memoization & Tabulation), and Final Sprint Mock Practice.',
    tracks: [
      {
        id: 'days-71-75',
        title: 'Greedy Algorithms',
        duration: '5 Days',
        subtracks: [
          {
            id: 'greedy-basics',
            title: 'Greedy Choice Property',
            concepts: [
              { id: 'c-greedy-def', name: 'Greedy Choice & Optimal Substructure', learn: 'Making locally optimal choice at each step to reach global optimum.' },
              { id: 'c-greedy-activity', name: 'Activity Selection / Interval Scheduling', learn: 'Sorting intervals by finish time.' },
              { id: 'c-greedy-knapsack-frac', name: 'Fractional Knapsack', learn: 'Sorting items by value-to-weight ratio.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Greedy Algorithms Guide', type: 'GitHub', link: 'https://github.com/striver7/Strivers-A2Z-DSA-Course', desc: 'Striver greedy code implementations.' },
            { title: 'Greedy Algorithms Playlist', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rF1w2KbuZWEvh9EUvqq_Qg', desc: 'Complete Greedy video playlist.' }
          ],
          preference2: [
            { title: 'LeetCode Greedy Tagged', type: 'Practice', link: 'https://leetcode.com/tag/greedy/', desc: 'Greedy practice set.' }
          ],
          preference3: [
            { title: 'GFG Greedy Algorithms', type: 'Article', link: 'https://www.geeksforgeeks.org/greedy-algorithms/', desc: 'Conceptual articles.' }
          ]
        }
      },
      {
        id: 'days-76-85',
        title: 'Dynamic Programming',
        duration: '10 Days',
        subtracks: [
          {
            id: 'dp-core',
            title: 'Core Concepts',
            concepts: [
              { id: 'c-dp-fib', name: 'Fibonacci & Overlapping Subproblems', learn: 'Memoization (Top-Down) vs Tabulation (Bottom-Up) vs Space Optimization.' },
              { id: 'c-dp-01-knapsack', name: '0/1 Knapsack Problem', learn: '2D DP table pick / don\'t pick choices state transitions.' },
              { id: 'c-dp-lcs', name: 'Longest Common Subsequence (LCS)', learn: 'Comparing matching characters dp[i][j] = 1 + dp[i-1][j-1].' },
              { id: 'c-dp-subseq', name: 'Subsequence & Partition DP', learn: 'Subset sum, partition equal subset sum, coin change.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'Dynamic Programming Patterns Repo', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm/tree/master/dynamic_programming', desc: 'Labuladong DP framework.' },
            { title: 'Striver DP Playlist', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYA074wPzsPtY', desc: 'Striver 50-video DP masterclass.' }
          ],
          preference2: [
            { title: 'NeetCode DP Playlist', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLot-Xpze53lcvx_tjrr_m2lgD2NsRHlNO', desc: 'NeetCode DP video solutions.' }
          ],
          preference3: [
            { title: 'LeetCode DP Study Plan', type: 'Practice', link: 'https://leetcode.com/studyplan/dynamic-programming/', desc: 'Practice problems.' }
          ]
        }
      },
      {
        id: 'days-86-90',
        title: 'Final Sprint — Integration & Mock Practice',
        duration: '5 Days',
        subtracks: [
          {
            id: 'sprint-mock',
            title: 'Mock Contests & Revision Strategy',
            concepts: [
              { id: 'c-sprint-mixed', name: 'Mixed Problem Solving', learn: 'Unseen problem categorization under timed constraints.' },
              { id: 'c-sprint-contests', name: 'LeetCode & Codeforces Contests', learn: 'Participating in weekly/biweekly contests to practice pressure management.' },
              { id: 'c-sprint-sheets', name: 'Striver Sheet & NeetCode 150 Revision', learn: 'Reviewing core 150 templates before technical interviews.' }
            ]
          }
        ],
        resources: {
          preference1: [
            { title: 'NeetCode 150 Practice Sheet', type: 'Practice', link: 'https://neetcode.io/practice', desc: 'Ultimate 150 interview problems.' },
            { title: 'Striver A2Z DSA Sheet', type: 'Practice', link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2', desc: 'A2Z DSA roadmap sheet.' }
          ],
          preference2: [
            { title: 'LeetCode Weekly Contest Page', type: 'Practice', link: 'https://leetcode.com/contest/', desc: 'Live weekly programming contests.' }
          ],
          preference3: [
            { title: 'CodeNinja / CodeStudio Guided Paths', type: 'Practice', link: 'https://www.naukri.com/code360/guided-paths', desc: 'Guided interview paths.' }
          ]
        }
      }
    ]
  }
];

export const DATA_STRUCTURES_LIST = [
  {
    category: 'Linear Data Structures',
    items: [
      { id: 'ds-array', name: 'Arrays', timeComplexity: 'Access: O(1), Search: O(n), Insertion: O(n), Deletion: O(n)', spaceComplexity: 'O(n)' },
      { id: 'ds-string', name: 'Strings', timeComplexity: 'Access: O(1), Search: O(n), Concatenation: O(n)', spaceComplexity: 'O(n)' },
      { id: 'ds-ll', name: 'Linked Lists (Singly, Doubly, Circular)', timeComplexity: 'Access: O(n), Search: O(n), Insertion: O(1), Deletion: O(1)', spaceComplexity: 'O(n)' },
      { id: 'ds-stack', name: 'Stacks', timeComplexity: 'Push: O(1), Pop: O(1), Peek: O(1)', spaceComplexity: 'O(n)' },
      { id: 'ds-queue', name: 'Queues (Standard, Circular, Deque)', timeComplexity: 'Enqueue: O(1), Dequeue: O(1)', spaceComplexity: 'O(n)' },
      { id: 'ds-hashmap', name: 'Hash Tables / Hash Maps', timeComplexity: 'Lookup: O(1) avg, Insert: O(1) avg, Delete: O(1) avg', spaceComplexity: 'O(n)' }
    ]
  },
  {
    category: 'Non-Linear Data Structures',
    items: [
      { id: 'ds-tree', name: 'Trees & Binary Search Trees', timeComplexity: 'Search: O(log n) avg, Insert: O(log n) avg', spaceComplexity: 'O(n)' },
      { id: 'ds-heap', name: 'Heaps / Priority Queues (Min & Max)', timeComplexity: 'Find Min/Max: O(1), Insert: O(log n), Delete Min/Max: O(log n)', spaceComplexity: 'O(n)' },
      { id: 'ds-trie', name: 'Tries (Prefix Trees)', timeComplexity: 'Insert: O(L), Search: O(L), Prefix Search: O(L)', spaceComplexity: 'O(N * L)' },
      { id: 'ds-graph', name: 'Graphs (Directed, Undirected, Weighted)', timeComplexity: 'BFS: O(V + E), DFS: O(V + E)', spaceComplexity: 'O(V + E)' }
    ]
  },
  {
    category: 'Advanced Data Structures',
    items: [
      { id: 'ds-dsu', name: 'Union-Find / Disjoint Set Union (DSU)', timeComplexity: 'Find: O(α(N)), Union: O(α(N)) [Inverse Ackermann]', spaceComplexity: 'O(N)' },
      { id: 'ds-seg-tree', name: 'Segment Tree', timeComplexity: 'Build: O(N), Query: O(log N), Update: O(log N)', spaceComplexity: 'O(4N)' },
      { id: 'ds-fenwick', name: 'Fenwick Tree / Binary Indexed Tree (BIT)', timeComplexity: 'Query: O(log N), Update: O(log N)', spaceComplexity: 'O(N)' },
      { id: 'ds-avl', name: 'AVL & Red-Black Balanced Trees', timeComplexity: 'Search: O(log N), Insert: O(log N), Delete: O(log N)', spaceComplexity: 'O(N)' },
      { id: 'ds-bloom', name: 'Bloom Filters', timeComplexity: 'Insert: O(k), Query: O(k)', spaceComplexity: 'O(m) bits' },
      { id: 'ds-lru', name: 'LRU Cache (HashMap + Doubly LinkedList)', timeComplexity: 'Get: O(1), Put: O(1)', spaceComplexity: 'O(Capacity)' }
    ]
  }
];

export const ALGORITHMS_LIST = [
  {
    category: 'Sorting Algorithms',
    items: [
      { id: 'alg-bubble', name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', desc: 'Repeatedly swap adjacent out of order elements.' },
      { id: 'alg-selection', name: 'Selection Sort', time: 'O(n²)', space: 'O(1)', desc: 'Find min in unsorted region and move to front.' },
      { id: 'alg-insertion', name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)', desc: 'Build sorted array one element at a time.' },
      { id: 'alg-merge', name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', desc: 'Divide and conquer stable sorting.' },
      { id: 'alg-quick', name: 'Quick Sort', time: 'O(n log n) avg', space: 'O(log n)', desc: 'In-place pivot partitioning.' }
    ]
  },
  {
    category: 'Searching Algorithms',
    items: [
      { id: 'alg-linear-search', name: 'Linear Search', time: 'O(n)', space: 'O(1)', desc: 'Sequential element checking.' },
      { id: 'alg-binary-search', name: 'Binary Search & Variations', time: 'O(log n)', space: 'O(1)', desc: 'Logarithmic search on sorted arrays.' }
    ]
  },
  {
    category: 'Graph Algorithms',
    items: [
      { id: 'alg-bfs', name: 'BFS (Breadth-First Search)', time: 'O(V + E)', space: 'O(V)', desc: 'Queue-based level order traversal.' },
      { id: 'alg-dfs', name: 'DFS (Depth-First Search)', time: 'O(V + E)', space: 'O(V)', desc: 'Recursion/stack-based depth exploration.' },
      { id: 'alg-dijkstra', name: 'Dijkstra\'s Shortest Path Algorithm', time: 'O((V + E) log V)', space: 'O(V)', desc: 'Single-source shortest path for non-negative weighted graphs.' },
      { id: 'alg-bellman-ford', name: 'Bellman-Ford Algorithm', time: 'O(V * E)', space: 'O(V)', desc: 'Shortest path handling negative edge weights & cycle detection.' },
      { id: 'alg-floyd-warshall', name: 'Floyd-Warshall Algorithm', time: 'O(V³)', space: 'O(V²)', desc: 'All-pairs shortest path dynamic programming.' },
      { id: 'alg-topo-sort', name: 'Topological Sort (Kahn\'s Algorithm)', time: 'O(V + E)', space: 'O(V)', desc: 'Linear ordering of vertices in Directed Acyclic Graph (DAG).' }
    ]
  },
  {
    category: 'Dynamic Programming',
    items: [
      { id: 'alg-dp-fib', name: 'Fibonacci Memoization & Tabulation', time: 'O(n)', space: 'O(1) opt', desc: 'Overlapping subproblems basics.' },
      { id: 'alg-dp-knapsack', name: '0/1 Knapsack Problem', time: 'O(N * W)', space: 'O(N * W)', desc: 'Optimal item weight combination.' },
      { id: 'alg-dp-lcs', name: 'Longest Common Subsequence (LCS)', time: 'O(M * N)', space: 'O(M * N)', desc: 'String alignment matching.' }
    ]
  },
  {
    category: 'Greedy & Divide and Conquer',
    items: [
      { id: 'alg-greedy-choice', name: 'Greedy Algorithms Strategy', time: 'Varies', space: 'O(1)', desc: 'Locally optimal choice at each step.' },
      { id: 'alg-dc-closest', name: 'Closest Pair of Points', time: 'O(n log n)', space: 'O(n)', desc: 'Divide & conquer geometric distance finding.' }
    ]
  },
  {
    category: 'Backtracking & Miscellaneous',
    items: [
      { id: 'alg-nqueens', name: 'N-Queens & Subsets', time: 'O(N!)', space: 'O(N)', desc: 'Recursive state space exploration.' },
      { id: 'alg-kadane', name: 'Kadane\'s Maximum Subarray Algorithm', time: 'O(n)', space: 'O(1)', desc: 'Contiguous maximum sum subarray.' }
    ]
  }
];

export const PATTERNS_LIST = [
  {
    id: 'pat-1',
    number: '01',
    name: 'Sliding Window',
    targetProblemsCount: 5,
    whenToIdentify: 'When problem asks for contiguous subarray/substring meeting condition (min length, max sum, k distinct chars).',
    coreLogic: 'Maintain window boundaries [left, right]. Expand right to satisfy condition, contract left to optimize.',
    variations: ['Fixed Size Window (k length)', 'Variable Size Window (dynamic contraction)'],
    templateCode: `function slidingWindow(arr, k) {\n  let windowSum = 0, maxVal = 0;\n  for (let i = 0; i < arr.length; i++) {\n    windowSum += arr[i];\n    if (i >= k - 1) {\n      maxVal = Math.max(maxVal, windowSum);\n      windowSum -= arr[i - (k - 1)];\n    }\n  }\n  return maxVal;\n}`,
    problems: [
      { id: 'p-sw-1', name: 'Maximum Sum Subarray of Size K', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 'p-sw-2', name: 'Smallest Subarray with a given sum', link: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
      { id: 'p-sw-3', name: 'Longest Substring with K Distinct Characters', link: 'https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/' },
      { id: 'p-sw-4', name: 'Fruits into Baskets', link: 'https://leetcode.com/problems/fruit-into-baskets/' },
      { id: 'p-sw-5', name: 'Longest Substring Without Repeating Characters', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' }
    ],
    resources: {
      preference1: [{ title: 'Sliding Window Ultimate Pattern Guide', type: 'YouTube', link: 'https://www.youtube.com/watch?v=MK-NZ4hN7SM' }],
      preference2: [{ title: 'LeetCode Sliding Window Template', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm' }],
      preference3: [{ title: 'GFG Sliding Window Technique', type: 'Article', link: 'https://www.geeksforgeeks.org/window-sliding-technique/' }]
    }
  },
  {
    id: 'pat-2',
    number: '02',
    name: 'Two Pointers',
    targetProblemsCount: 5,
    whenToIdentify: 'Sorted arrays or linked lists searching for pairs, triplets, or in-place target filtering.',
    coreLogic: 'Set left = 0, right = n - 1. Move left inward or right inward based on comparison against target.',
    templateCode: `function twoPointers(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    let sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++; else right--;\n  }\n  return [-1, -1];\n}`,
    problems: [
      { id: 'p-tp-1', name: 'Two Sum II - Input Array Is Sorted (LeetCode #167)', link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: 'p-tp-2', name: 'Remove Duplicates from Sorted Array (LeetCode #26)', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { id: 'p-tp-3', name: '3Sum (LeetCode #15)', link: 'https://leetcode.com/problems/3sum/' },
      { id: 'p-tp-4', name: 'Container With Most Water (LeetCode #11)', link: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 'p-tp-5', name: 'Trapping Rain Water (LeetCode #42)', link: 'https://leetcode.com/problems/trapping-rain-water/' }
    ],
    resources: {
      preference1: [{ title: 'Two Pointers Pattern Tutorial', type: 'YouTube', link: 'https://www.youtube.com/watch?v=On03HWe2tZM' }],
      preference2: [{ title: 'NeetCode Two Pointers', type: 'Practice', link: 'https://neetcode.io/roadmap' }],
      preference3: [{ title: 'GeeksforGeeks Two Pointers', type: 'Article', link: 'https://www.geeksforgeeks.org/two-pointers-technique/' }]
    }
  },
  {
    id: 'pat-3',
    number: '03',
    name: 'Fast & Slow Pointers',
    targetProblemsCount: 5,
    whenToIdentify: 'LinkedList cycle detection, finding cycle length, or finding middle of LinkedList.',
    coreLogic: 'Move slow pointer 1 step, fast pointer 2 steps. If fast === slow, cycle exists.',
    problems: [
      { id: 'p-fs-1', name: 'LinkedList Cycle (LeetCode #141)', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'p-fs-2', name: 'LinkedList Cycle II (LeetCode #142)', link: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { id: 'p-fs-3', name: 'Happy Number (LeetCode #202)', link: 'https://leetcode.com/problems/happy-number/' },
      { id: 'p-fs-4', name: 'Middle of the Linked List (LeetCode #876)', link: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
      { id: 'p-fs-5', name: 'Palindrome Linked List (LeetCode #234)', link: 'https://leetcode.com/problems/palindrome-linked-list/' }
    ],
    resources: {
      preference1: [{ title: 'Floyd Cycle Finding Algorithm', type: 'YouTube', link: 'https://www.youtube.com/watch?v=gBTe7lFR3vc' }],
      preference2: [{ title: 'Fast and Slow Pointer Pattern', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm' }],
      preference3: [{ title: 'GFG Cycle Detection', type: 'Article', link: 'https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/' }]
    }
  },
  {
    id: 'pat-4',
    number: '04',
    name: 'Merge Intervals',
    targetProblemsCount: 5,
    whenToIdentify: 'Overlapping intervals, merging time slots, or inserting new interval.',
    coreLogic: 'Sort intervals by start time. Iterate and compare current start with previous end.',
    problems: [
      { id: 'p-mi-1', name: 'Merge Intervals (LeetCode #56)', link: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 'p-mi-2', name: 'Insert Interval (LeetCode #57)', link: 'https://leetcode.com/problems/insert-interval/' },
      { id: 'p-mi-3', name: 'Non-overlapping Intervals (LeetCode #435)', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { id: 'p-mi-4', name: 'Meeting Rooms (LeetCode #252)', link: 'https://leetcode.com/problems/meeting-rooms/' },
      { id: 'p-mi-5', name: 'Meeting Rooms II (LeetCode #253)', link: 'https://leetcode.com/problems/meeting-rooms-ii/' }
    ],
    resources: {
      preference1: [{ title: 'Merge Intervals Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=44H3cEC2fFM' }],
      preference2: [{ title: 'Interval Patterns Repo', type: 'GitHub', link: 'https://github.com/striver7/Strivers-A2Z-DSA-Course' }],
      preference3: [{ title: 'GFG Merge Intervals', type: 'Article', link: 'https://www.geeksforgeeks.org/merging-intervals/' }]
    }
  },
  {
    id: 'pat-5',
    number: '05',
    name: 'Cyclic Sort',
    targetProblemsCount: 5,
    whenToIdentify: 'Arrays containing numbers in range 1 to N or 0 to N.',
    coreLogic: 'Iterate through array: swap element at index i to its correct index arr[i] - 1.',
    problems: [
      { id: 'p-cs-1', name: 'Missing Number (LeetCode #268)', link: 'https://leetcode.com/problems/missing-number/' },
      { id: 'p-cs-2', name: 'Find All Numbers Disappeared in an Array (LeetCode #448)', link: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/' },
      { id: 'p-cs-3', name: 'Find the Duplicate Number (LeetCode #287)', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { id: 'p-cs-4', name: 'Find All Duplicates in an Array (LeetCode #442)', link: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/' },
      { id: 'p-cs-5', name: 'First Missing Positive (LeetCode #41)', link: 'https://leetcode.com/problems/first-missing-positive/' }
    ],
    resources: {
      preference1: [{ title: 'Cyclic Sort Pattern Video', type: 'YouTube', link: 'https://www.youtube.com/watch?v=JfinxytTYFQ' }],
      preference2: [{ title: 'Cyclic Sort Code Template', type: 'GitHub', link: 'https://github.com/youngyangyang04/leetcode-master' }],
      preference3: [{ title: 'GFG Cyclic Sort', type: 'Article', link: 'https://www.geeksforgeeks.org/cycle-sort/' }]
    }
  },
  {
    id: 'pat-6',
    number: '06',
    name: 'In-place Reversal of Linked List',
    targetProblemsCount: 5,
    whenToIdentify: 'Reversing LinkedList nodes between given positions in O(1) space.',
    coreLogic: 'Track prev, curr, next pointers. Reverse next pointers in loop without extra memory.',
    problems: [
      { id: 'p-ipll-1', name: 'Reverse Linked List (LeetCode #206)', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'p-ipll-2', name: 'Reverse Linked List II (LeetCode #92)', link: 'https://leetcode.com/problems/reverse-linked-list-ii/' },
      { id: 'p-ipll-3', name: 'Reverse Nodes in k-Group (LeetCode #25)', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
      { id: 'p-ipll-4', name: 'Swap Nodes in Pairs (LeetCode #24)', link: 'https://leetcode.com/problems/swap-nodes-in-pairs/' },
      { id: 'p-ipll-5', name: 'Reorder List (LeetCode #143)', link: 'https://leetcode.com/problems/reorder-list/' }
    ],
    resources: {
      preference1: [{ title: 'Reverse LinkedList Step-by-Step', type: 'YouTube', link: 'https://www.youtube.com/watch?v=G0_I-ZF0S38' }],
      preference2: [{ title: 'NeetCode LinkedList Playlist', type: 'Practice', link: 'https://neetcode.io/practice' }],
      preference3: [{ title: 'GFG Reverse Linked List', type: 'Article', link: 'https://www.geeksforgeeks.org/reverse-a-linked-list/' }]
    }
  },
  {
    id: 'pat-7',
    number: '07',
    name: 'Tree Breadth First Search (BFS)',
    targetProblemsCount: 5,
    whenToIdentify: 'Traversing tree level by level, finding level averages, or shortest tree depth.',
    coreLogic: 'Use Queue. Push root. While queue not empty, loop through level size.',
    problems: [
      { id: 'p-tbfs-1', name: 'Binary Tree Level Order Traversal (LeetCode #102)', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 'p-tbfs-2', name: 'Zigzag Level Order Traversal (LeetCode #103)', link: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
      { id: 'p-tbfs-3', name: 'Average of Levels in Binary Tree (LeetCode #637)', link: 'https://leetcode.com/problems/average-of-levels-in-binary-tree/' },
      { id: 'p-tbfs-4', name: 'Minimum Depth of Binary Tree (LeetCode #111)', link: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/' },
      { id: 'p-tbfs-5', name: 'Populating Next Right Pointers (LeetCode #116)', link: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/' }
    ],
    resources: {
      preference1: [{ title: 'Tree BFS Pattern Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=6ZnyEApgFYg' }],
      preference2: [{ title: 'Striver Tree BFS Code', type: 'GitHub', link: 'https://github.com/striver7/Strivers-A2Z-DSA-Course' }],
      preference3: [{ title: 'GFG Level Order Traversal', type: 'Article', link: 'https://www.geeksforgeeks.org/level-order-tree-traversal/' }]
    }
  },
  {
    id: 'pat-8',
    number: '08',
    name: 'Tree Depth First Search (DFS)',
    targetProblemsCount: 5,
    whenToIdentify: 'Finding root-to-leaf paths, path sum calculations, or tree height.',
    coreLogic: 'Use recursive call stack. Explore left subtree deeply, then right subtree.',
    problems: [
      { id: 'p-tdfs-1', name: 'Path Sum (LeetCode #112)', link: 'https://leetcode.com/problems/path-sum/' },
      { id: 'p-tdfs-2', name: 'Path Sum II (LeetCode #113)', link: 'https://leetcode.com/problems/path-sum-ii/' },
      { id: 'p-tdfs-3', name: 'Binary Tree Maximum Path Sum (LeetCode #124)', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: 'p-tdfs-4', name: 'Sum Root to Leaf Numbers (LeetCode #129)', link: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/' },
      { id: 'p-tdfs-5', name: 'Lowest Common Ancestor (LeetCode #236)', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' }
    ],
    resources: {
      preference1: [{ title: 'Tree DFS Patterns Video', type: 'YouTube', link: 'https://www.youtube.com/watch?v=fnmisGIHQvo' }],
      preference2: [{ title: 'NeetCode Trees Playlist', type: 'Practice', link: 'https://neetcode.io/practice' }],
      preference3: [{ title: 'GFG Tree DFS', type: 'Article', link: 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/' }]
    }
  },
  {
    id: 'pat-9',
    number: '09',
    name: 'Two Heaps',
    targetProblemsCount: 5,
    whenToIdentify: 'Calculating median of dynamic data stream or dividing elements into two halves.',
    coreLogic: 'Maintain Max Heap for lower half, Min Heap for upper half. Balance heap sizes.',
    problems: [
      { id: 'p-th-1', name: 'Find Median from Data Stream (LeetCode #295)', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 'p-th-2', name: 'Sliding Window Median (LeetCode #480)', link: 'https://leetcode.com/problems/sliding-window-median/' },
      { id: 'p-th-3', name: 'IPO (LeetCode #502)', link: 'https://leetcode.com/problems/ipo/' },
      { id: 'p-th-4', name: 'Maximize Capital', link: 'https://leetcode.com/problems/ipo/' },
      { id: 'p-th-5', name: 'Find the Median of a Number Stream', link: 'https://leetcode.com/problems/find-median-from-data-stream/' }
    ],
    resources: {
      preference1: [{ title: 'Median from Data Stream Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=itmhHWaHupI' }],
      preference2: [{ title: 'Two Heaps Template Repo', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm' }],
      preference3: [{ title: 'GFG Two Heaps Median', type: 'Article', link: 'https://www.geeksforgeeks.org/median-of-stream-of-integers-running-integers/' }]
    }
  },
  {
    id: 'pat-10',
    number: '10',
    name: 'Subsets',
    targetProblemsCount: 5,
    whenToIdentify: 'Permutations, combinations, powerset, or subset generation.',
    coreLogic: 'Breadth-First iterative approach or Backtracking recursive choice tree.',
    problems: [
      { id: 'p-sub-1', name: 'Subsets (LeetCode #78)', link: 'https://leetcode.com/problems/subsets/' },
      { id: 'p-sub-2', name: 'Subsets II (LeetCode #90)', link: 'https://leetcode.com/problems/subsets-ii/' },
      { id: 'p-sub-3', name: 'Permutations (LeetCode #46)', link: 'https://leetcode.com/problems/permutations/' },
      { id: 'p-sub-4', name: 'Permutations II (LeetCode #47)', link: 'https://leetcode.com/problems/permutations-ii/' },
      { id: 'p-sub-5', name: 'Letter Combinations of a Phone Number (LeetCode #17)', link: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' }
    ],
    resources: {
      preference1: [{ title: 'Subsets & Permutations Backtracking', type: 'YouTube', link: 'https://www.youtube.com/watch?v=REOH22XwdQE' }],
      preference2: [{ title: 'NeetCode Backtracking', type: 'Practice', link: 'https://neetcode.io/practice' }],
      preference3: [{ title: 'GFG Power Set', type: 'Article', link: 'https://www.geeksforgeeks.org/power-set/' }]
    }
  },
  {
    id: 'pat-11',
    number: '11',
    name: 'Modified Binary Search',
    targetProblemsCount: 5,
    whenToIdentify: 'Searching sorted/rotated/infinite arrays or matrices in logarithmic O(log N) time.',
    coreLogic: 'Identify sorted subarray half or dynamic boundary search.',
    problems: [
      { id: 'p-mbs-1', name: 'Search in Rotated Sorted Array (LeetCode #33)', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'p-mbs-2', name: 'Find Minimum in Rotated Sorted Array (LeetCode #153)', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'p-mbs-3', name: 'Search a 2D Matrix (LeetCode #74)', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 'p-mbs-4', name: 'First and Last Position of Element (LeetCode #34)', link: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
      { id: 'p-mbs-5', name: 'Peak Index in a Mountain Array (LeetCode #852)', link: 'https://leetcode.com/problems/peak-index-in-a-mountain-array/' }
    ],
    resources: {
      preference1: [{ title: 'Binary Search Variants Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=r3pRJ8-skgs' }],
      preference2: [{ title: 'Striver Binary Search Code', type: 'GitHub', link: 'https://github.com/striver7/Strivers-A2Z-DSA-Course' }],
      preference3: [{ title: 'GFG Binary Search Variations', type: 'Article', link: 'https://www.geeksforgeeks.org/binary-search/' }]
    }
  },
  {
    id: 'pat-12',
    number: '12',
    name: 'Bitwise XOR',
    targetProblemsCount: 5,
    whenToIdentify: 'Finding missing or duplicate elements using constant auxiliary memory O(1).',
    coreLogic: 'XORing number with itself cancels to 0. XORing number with 0 yields number.',
    problems: [
      { id: 'p-bxor-1', name: 'Single Number (LeetCode #136)', link: 'https://leetcode.com/problems/single-number/' },
      { id: 'p-bxor-2', name: 'Single Number II (LeetCode #137)', link: 'https://leetcode.com/problems/single-number-ii/' },
      { id: 'p-bxor-3', name: 'Single Number III (LeetCode #260)', link: 'https://leetcode.com/problems/single-number-iii/' },
      { id: 'p-bxor-4', name: 'Missing Number (LeetCode #268)', link: 'https://leetcode.com/problems/missing-number/' },
      { id: 'p-bxor-5', name: 'Find the Difference (LeetCode #389)', link: 'https://leetcode.com/problems/find-the-difference/' }
    ],
    resources: {
      preference1: [{ title: 'Bitwise XOR Tricks & Problems', type: 'YouTube', link: 'https://www.youtube.com/watch?v=PyFN_IyFAmE' }],
      preference2: [{ title: 'Bit Manipulation Repo', type: 'GitHub', link: 'https://github.com/graphicsfuzz/bit-manipulation-tricks' }],
      preference3: [{ title: 'GFG Bitwise XOR', type: 'Article', link: 'https://www.geeksforgeeks.org/bitwise-xor-operator-in-c-c/' }]
    }
  },
  {
    id: 'pat-13',
    number: '13',
    name: 'Top K Elements',
    targetProblemsCount: 5,
    whenToIdentify: 'Finding K largest, K smallest, or K most frequent elements.',
    coreLogic: 'Maintain Min Heap of size K for largest elements or Max Heap of size K for smallest.',
    problems: [
      { id: 'p-topk-1', name: 'Kth Largest Element in an Array (LeetCode #215)', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 'p-topk-2', name: 'Top K Frequent Elements (LeetCode #347)', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'p-topk-3', name: 'K Closest Points to Origin (LeetCode #973)', link: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
      { id: 'p-topk-4', name: 'Sort Characters By Frequency (LeetCode #451)', link: 'https://leetcode.com/problems/sort-characters-by-frequency/' },
      { id: 'p-topk-5', name: 'Reorganize String (LeetCode #767)', link: 'https://leetcode.com/problems/reorganize-string/' }
    ],
    resources: {
      preference1: [{ title: 'Top K Elements Heap Pattern', type: 'YouTube', link: 'https://www.youtube.com/watch?v=YPTqKIgVk-k' }],
      preference2: [{ title: 'NeetCode Heap Problems', type: 'Practice', link: 'https://neetcode.io/practice' }],
      preference3: [{ title: 'GFG Kth Largest Element', type: 'Article', link: 'https://www.geeksforgeeks.org/kth-smallest-largest-element-in-unsorted-array/' }]
    }
  },
  {
    id: 'pat-14',
    number: '14',
    name: 'K-way Merge',
    targetProblemsCount: 5,
    whenToIdentify: 'Merging K sorted arrays or sorted lists into a single sorted list.',
    coreLogic: 'Insert head of each array into Min Heap. Extract min, insert next element from same array.',
    problems: [
      { id: 'p-kwm-1', name: 'Merge k Sorted Lists (LeetCode #23)', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'p-kwm-2', name: 'Kth Smallest Element in a Sorted Matrix (LeetCode #378)', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/' },
      { id: 'p-kwm-3', name: 'Find K Pairs with Smallest Sums (LeetCode #373)', link: 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/' },
      { id: 'p-kwm-4', name: 'Smallest Range Covering Elements from K Lists (LeetCode #632)', link: 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/' },
      { id: 'p-kwm-5', name: 'Merge Sorted Array (LeetCode #88)', link: 'https://leetcode.com/problems/merge-sorted-array/' }
    ],
    resources: {
      preference1: [{ title: 'Merge K Sorted Lists Heap Tutorial', type: 'YouTube', link: 'https://www.youtube.com/watch?v=q5a5OiGbT6Q' }],
      preference2: [{ title: 'K-way Merge Code Template', type: 'GitHub', link: 'https://github.com/williamfiset/Algorithms' }],
      preference3: [{ title: 'GFG Merge K Sorted Arrays', type: 'Article', link: 'https://www.geeksforgeeks.org/merge-k-sorted-arrays/' }]
    }
  },
  {
    id: 'pat-15',
    number: '15',
    name: '0–1 Knapsack',
    targetProblemsCount: 5,
    whenToIdentify: 'Optimization problems selecting items with weights/values within capacity constraint.',
    coreLogic: '2D DP array dp[i][w] = max(val[i] + dp[i-1][w-wt[i]], dp[i-1][w]).',
    problems: [
      { id: 'p-ks-1', name: 'Partition Equal Subset Sum (LeetCode #416)', link: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
      { id: 'p-ks-2', name: 'Target Sum (LeetCode #494)', link: 'https://leetcode.com/problems/target-sum/' },
      { id: 'p-ks-3', name: 'Ones and Zeroes (LeetCode #474)', link: 'https://leetcode.com/problems/ones-and-zeroes/' },
      { id: 'p-ks-4', name: 'Last Stone Weight II (LeetCode #1049)', link: 'https://leetcode.com/problems/last-stone-weight-ii/' },
      { id: 'p-ks-5', name: 'Coin Change (LeetCode #322)', link: 'https://leetcode.com/problems/coin-change/' }
    ],
    resources: {
      preference1: [{ title: '0/1 Knapsack Dynamic Programming Video', type: 'YouTube', link: 'https://www.youtube.com/watch?v=nLmhmB6NzcM' }],
      preference2: [{ title: 'Striver DP Sheet', type: 'Practice', link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2' }],
      preference3: [{ title: 'GFG 0/1 Knapsack', type: 'Article', link: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/' }]
    }
  },
  {
    id: 'pat-16',
    number: '16',
    name: 'Topological Sort',
    targetProblemsCount: 5,
    whenToIdentify: 'Ordering dependencies, course prerequisites, build scheduling in DAG.',
    coreLogic: 'Calculate indegrees. Push zero-indegree nodes into Queue (Kahn\'s algorithm BFS).',
    problems: [
      { id: 'p-ts-1', name: 'Course Schedule (LeetCode #207)', link: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'p-ts-2', name: 'Course Schedule II (LeetCode #210)', link: 'https://leetcode.com/problems/course-schedule-ii/' },
      { id: 'p-ts-3', name: 'Alien Dictionary (LeetCode #269)', link: 'https://leetcode.com/problems/alien-dictionary/' },
      { id: 'p-ts-4', name: 'Minimum Height Trees (LeetCode #310)', link: 'https://leetcode.com/problems/minimum-height-trees/' },
      { id: 'p-ts-5', name: 'Sequence Reconstruction (LeetCode #444)', link: 'https://leetcode.com/problems/sequence-reconstruction/' }
    ],
    resources: {
      preference1: [{ title: 'Topological Sort Kahn Algorithm Video', type: 'YouTube', link: 'https://www.youtube.com/watch?v=73jneNywuTV' }],
      preference2: [{ title: 'Graph Topological Sort Code', type: 'GitHub', link: 'https://github.com/williamfiset/Algorithms' }],
      preference3: [{ title: 'GFG Topological Sorting', type: 'Article', link: 'https://www.geeksforgeeks.org/topological-sorting/' }]
    }
  }
];

export const countTotalRoadmapLeafConcepts = () => {
  let count = 0;
  DSA_PHASES.forEach(phase => {
    phase.tracks.forEach(track => {
      track.subtracks.forEach(subtrack => {
        count += subtrack.concepts.length;
      });
    });
  });
  return count;
};
