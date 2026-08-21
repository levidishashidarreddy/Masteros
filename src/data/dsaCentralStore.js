// src/data/dsaCentralStore.js
// SINGLE SOURCE OF TRUTH for all DSA data across MasterOS (Workspace, Roadmap, Dashboard)
// Topic-based hierarchy preserving exact learning sequence and resources.

export const DSA_CENTRAL_STORE = {
  phases: [
    {
      id: 'phase-1',
      title: 'Phase 1 — Fundamentals',
      description: 'Master core complexity, foundational arrays, strings, bit manipulation, and linked lists.',
      tracks: [
        {
          id: 'algo-thinking',
          title: 'Algorithmic Thinking & Complexity',
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
              { title: 'Big-O Notation Complete Guide', type: 'GitHub', link: 'https://github.com/jwasham/coding-interview-university#algorithmic-complexity--big-o--asymptotic-analysis', desc: 'Detailed breakdown of time & space complexities.', why: 'Essential foundation for analyzing code efficiency.' },
              { title: 'Asymptotic Analysis & Big O Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=g2o22C3CRfU', desc: 'FreeCodeCamp complete video lecture on complexity analysis.', why: 'Visual proofs and step-by-step loop counting examples.' }
            ],
            preference2: [
              { title: 'Big-O CheatSheet Visual Map', type: 'Article', link: 'https://www.bigocheatsheet.com/', desc: 'Graphical breakdown of common data structure operations.', why: 'Quick visual reference table.' },
              { title: 'MIT 6.006 Algorithmic Thinking Class', type: 'YouTube', link: 'https://www.youtube.com/watch?v=ZaKxUqgCEwU', desc: 'MIT OpenCourseWare Intro to Algorithms.', why: 'Rigorous academic foundations.' }
            ],
            preference3: [
              { title: 'GeeksforGeeks Time & Space Complexity', type: 'Article', link: 'https://www.geeksforgeeks.org/time-complexity-and-space-complexity/', desc: 'Detailed mathematical proofs and examples.', why: 'Code snippets in multiple languages.' }
            ]
          }
        },
        {
          id: 'arrays-track',
          title: 'Arrays',
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
              { title: 'Array Data Structure Repository', type: 'GitHub', link: 'https://github.com/youngyangyang04/leetcode-master', desc: 'Carl Striver array technique guides and code templates.', why: 'Clear pattern templates for interviews.' },
              { title: 'Arrays & Subarrays Deep Dive', type: 'YouTube', link: 'https://www.youtube.com/watch?v=N0MgLVcefcg', desc: 'Complete Array & Kadane algorithm breakdown.', why: 'Step-by-step visual subarray tracing.' }
            ],
            preference2: [
              { title: 'NeetCode Array & Hashing Roadmap', type: 'Practice', link: 'https://neetcode.io/roadmap', desc: 'Curated list of array interview problems.', why: 'Top 15 array coding problems.' }
            ],
            preference3: [
              { title: 'Striver A2Z DSA Sheet — Arrays', type: 'Practice', link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2', desc: 'Step-by-step array problem sheet.', why: 'Structured beginner to hard array roadmap.' }
            ]
          }
        },
        {
          id: 'strings-track',
          title: 'Strings',
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
              { title: 'String Algorithm CheatSheet', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm', desc: 'String pattern techniques and algorithms.', why: 'Covers two-pointer string manipulation.' },
              { title: 'String Manipulation Video Course', type: 'YouTube', link: 'https://www.youtube.com/watch?v=UqQ5U8f0tS4', desc: 'Top string interview algorithms.', why: 'Detailed walk-through of string hashing.' }
            ],
            preference2: [
              { title: 'LeetCode String Tagged Problems', type: 'Practice', link: 'https://leetcode.com/tag/string/', desc: 'All LeetCode string problems sorted by difficulty.', why: 'Comprehensive question set.' }
            ],
            preference3: [
              { title: 'GeeksforGeeks String Data Structure', type: 'Article', link: 'https://www.geeksforgeeks.org/string-data-structure/', desc: 'Detailed string operations and built-in methods.', why: 'Standard reference API docs.' }
            ]
          }
        },
        {
          id: 'bit-manip-track',
          title: 'Bit Manipulation Techniques',
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
              { title: 'Bit Hacks & Tricks GitHub Repo', type: 'GitHub', link: 'https://github.com/graphicsfuzz/bit-manipulation-tricks', desc: 'Bitwise tricks cheat sheet.', why: 'Instant reference for fast bitwise hacks.' },
              { title: 'Bit Manipulation Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=PyFN_IyFAmE', desc: 'Detailed video on bitwise algorithms.', why: 'Explains XOR trick in single number problems.' }
            ],
            preference2: [
              { title: 'Striver Bit Manipulation Series', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rnubhA_0EwYwXU9jZ9B05p', desc: 'Complete bitwise tutorial playlist.', why: 'Covers bitmasking for dynamic programming.' }
            ],
            preference3: [
              { title: 'LeetCode Bit Manipulation Study Plan', type: 'Practice', link: 'https://leetcode.com/studyplan/bit-manipulation/', desc: 'Curated LeetCode bit problems.', why: 'Targeted bit manipulation problem set.' }
            ]
          }
        },
        {
          id: 'linked-list-track',
          title: 'Linked Lists',
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
              { title: 'Linked List Implementation Guide', type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/linked-list', desc: 'Clean JavaScript implementation with tests.', why: 'Clean pointer manipulation templates.' },
              { title: 'Linked List Deep Dive Video', type: 'YouTube', link: 'https://www.youtube.com/watch?v=Hj_rA0dhr2I', desc: 'Visual step-by-step linked list tutorial.', why: 'Visual node pointer pointer diagrams.' }
            ],
            preference2: [
              { title: 'NeetCode Linked List Problems', type: 'Practice', link: 'https://neetcode.io/practice', desc: 'Top 10 essential Linked List problems.', why: 'Must-know interview questions.' }
            ],
            preference3: [
              { title: 'GeeksforGeeks Linked List Tutorial', type: 'Article', link: 'https://www.geeksforgeeks.org/data-structures/linked-list/', desc: 'Complete conceptual articles.', why: 'Detailed memory diagram illustrations.' }
            ]
          }
        }
      ]
    },
    {
      id: 'phase-2',
      title: 'Phase 2 — Core DSA',
      description: 'Master stacks, queues, hash tables, heaps, recursion, backtracking, and fundamental sorting.',
      tracks: [
        {
          id: 'stacks-track',
          title: 'Stacks',
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
              { title: 'Monotonic Stack & Queue Guide', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm/blob/master/data_structure/%E5%8D%95%E8%B0%83%E6%A0%85.md', desc: 'Monotonic stack templates.', why: 'Standard template for Next Greater Element.' },
              { title: 'Stacks & Monotonic Stacks Lecture', type: 'YouTube', link: 'https://www.youtube.com/watch?v=Dq_ObZwTY_U', desc: 'Striver Next Greater Element tutorial.', why: 'Detailed stack frame breakdowns.' }
            ],
            preference2: [
              { title: 'LeetCode Stack Tagged Problems', type: 'Practice', link: 'https://leetcode.com/tag/stack/', desc: 'Essential stack practice problems.', why: 'Practice stack questions by frequency.' }
            ],
            preference3: [
              { title: 'GeeksforGeeks Stack Data Structure', type: 'Article', link: 'https://www.geeksforgeeks.org/stack-data-structure/', desc: 'Articles and examples.', why: 'Reference notes.' }
            ]
          }
        },
        {
          id: 'queues-track',
          title: 'Queues',
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
              { title: 'Queue & Deque Implementations', type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/queue', desc: 'JavaScript queue implementation.', why: 'Clean array and list based queues.' },
              { title: 'Sliding Window Maximum with Deque', type: 'YouTube', link: 'https://www.youtube.com/watch?v=CZQGRp93K4g', desc: 'NeetCode sliding window max tutorial.', why: 'Detailed explanation of monotonic deque.' }
            ],
            preference2: [
              { title: 'LeetCode Queue Tag', type: 'Practice', link: 'https://leetcode.com/tag/queue/', desc: 'Practice problems for Queues.', why: 'Targeted Queue practice.' }
            ],
            preference3: [
              { title: 'GFG Queue Data Structure', type: 'Article', link: 'https://www.geeksforgeeks.org/queue-data-structure/', desc: 'Core articles.', why: 'Reference implementation.' }
            ]
          }
        },
        {
          id: 'hash-tables-track',
          title: 'Hash Tables',
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
              { title: 'HashTable Implementation & Design', type: 'GitHub', link: 'https://github.com/jwasham/coding-interview-university#hash-table', desc: 'Detailed hashing notes.', why: 'Covers internal load factor resizing.' },
              { title: 'Hash Table Crash Course', type: 'YouTube', link: 'https://www.youtube.com/watch?v=shsUJgJEMg0', desc: 'FreeCodeCamp hash map video.', why: 'Collision resolution explained visually.' }
            ],
            preference2: [
              { title: 'NeetCode Hash Map Practice', type: 'Practice', link: 'https://neetcode.io/practice', desc: 'Top Hash Map problem set.', why: 'Top 10 HashMap interview problems.' }
            ],
            preference3: [
              { title: 'GeeksforGeeks Hashing', type: 'Article', link: 'https://www.geeksforgeeks.org/hashing-data-structure/', desc: 'Conceptual guides.', why: 'Articles and examples.' }
            ]
          }
        },
        {
          id: 'heaps-track',
          title: 'Heaps / Priority Queues',
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
              { title: 'Priority Queue & Heap In-Depth', type: 'GitHub', link: 'https://github.com/williamfiset/Algorithms/tree/master/src/main/java/com/williamfiset/algorithms/datastructures/graphtheory', desc: 'WilliamFiset heap algorithms repo.', why: 'Complete Java/C++ heap source.' },
              { title: 'Heaps & Priority Queue Tutorial', type: 'YouTube', link: 'https://www.youtube.com/watch?v=HqPJF2L5h9U', desc: 'Complete Heapify and Heap Sort video.', why: 'Step-by-step array tree mapping.' }
            ],
            preference2: [
              { title: 'LeetCode Heap / PriorityQueue', type: 'Practice', link: 'https://leetcode.com/tag/heap-priority-queue/', desc: 'Heap problem practice.', why: 'Heap questions sorted by difficulty.' }
            ],
            preference3: [
              { title: 'GFG Heap Data Structure', type: 'Article', link: 'https://www.geeksforgeeks.org/heap-data-structure/', desc: 'Heap articles and diagrams.', why: 'Reference guides.' }
            ]
          }
        },
        {
          id: 'recursion-backtracking-track',
          title: 'Recursion & Backtracking',
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
              { title: 'Backtracking Algorithm Templates', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm/blob/master/algorithm/%E5%9B%9E%E6%BA%AF%E7%AE%97%E6%B3%95%E8%AF%A6%E8%A7%A3%E6%B1%87%E7%BD%96.md', desc: 'Universal backtracking template.', why: 'Standard decision tree framework.' },
              { title: 'Recursion & Backtracking Masterclass', type: 'YouTube', link: 'https://www.youtube.com/watch?v=ZGgB9C2G8N8', desc: 'Striver recursion playlist.', why: 'Detailed call stack diagrams.' }
            ],
            preference2: [
              { title: 'NeetCode Backtracking Playlist', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXg', desc: 'NeetCode problem solutions.', why: 'Walk-through of subsets and N-Queens.' }
            ],
            preference3: [
              { title: 'GeeksforGeeks Backtracking', type: 'Article', link: 'https://www.geeksforgeeks.org/backtracking-algorithms/', desc: 'Backtracking conceptual guides.', why: 'Reference articles.' }
            ]
          }
        },
        {
          id: 'sorting-track',
          title: 'Sorting Algorithms',
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
              { title: 'Sorting Algorithms Visualizations & Code', type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms#sorting', desc: 'JavaScript sorting implementations.', why: 'Clean JavaScript implementations.' },
              { title: 'Merge Sort & Quick Sort Explained', type: 'YouTube', link: 'https://www.youtube.com/watch?v=JSceec-wEyw', desc: 'FreeCodeCamp sorting tutorial.', why: 'Clear visual step-by-step sorting animations.' }
            ],
            preference2: [
              { title: 'Visualgo Sorting Animations', type: 'Article', link: 'https://visualgo.net/en/sorting', desc: 'Interactive step-by-step sorting animation.', why: 'Interactive step-by-step animation.' }
            ],
            preference3: [
              { title: 'GFG Sorting Algorithms', type: 'Article', link: 'https://www.geeksforgeeks.org/sorting-algorithms/', desc: 'Comparison charts and proofs.', why: 'Sorting time & space comparison matrix.' }
            ]
          }
        }
      ]
    },
    {
      id: 'phase-3',
      title: 'Phase 3 — Trees & Advanced Structures',
      description: 'Master Binary Trees, Traversals, Binary Search, Tries, and Graph Theory.',
      tracks: [
        {
          id: 'trees-track',
          title: 'Trees',
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
              { title: 'Binary Tree Algorithms Masterclass Repo', type: 'GitHub', link: 'https://github.com/striver7/Strivers-A2Z-DSA-Course', desc: 'Striver binary tree codebase.', why: 'Standard tree interview questions.' },
              { title: 'Binary Tree Full Video Series', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJkFVk', desc: 'Striver complete Tree playlist.', why: 'Best visual tree traversals series.' }
            ],
            preference2: [
              { title: 'NeetCode Trees Checklist', type: 'Practice', link: 'https://neetcode.io/roadmap', desc: 'Trees problem set.', why: 'Must-do tree problems.' }
            ],
            preference3: [
              { title: 'GFG Binary Tree', type: 'Article', link: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', desc: 'Conceptual articles.', why: 'Tree articles.' }
            ]
          }
        },
        {
          id: 'binary-search-track',
          title: 'Binary Search',
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
              { title: 'Binary Search Patterns Guide', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm/blob/master/think_like_computer/BinarySearch.md', desc: 'Universal binary search framework.', why: 'Clear low/high boundary rules.' },
              { title: 'Binary Search on Answer Masterclass', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF', desc: 'Striver Binary Search playlist.', why: 'Mastering search space functions.' }
            ],
            preference2: [
              { title: 'LeetCode Binary Search Study Plan', type: 'Practice', link: 'https://leetcode.com/studyplan/binary-search/', desc: 'Curated problem list.', why: 'Targeted practice.' }
            ],
            preference3: [
              { title: 'GFG Binary Search', type: 'Article', link: 'https://www.geeksforgeeks.org/binary-search/', desc: 'Conceptual examples.', why: 'Reference docs.' }
            ]
          }
        },
        {
          id: 'tries-track',
          title: 'Tries',
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
              { title: 'Trie Data Structure Implementation', type: 'GitHub', link: 'https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/trie', desc: 'Clean JavaScript Trie.', why: 'Clean prefix tree code.' },
              { title: 'Trie Data Structure & Problems', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0pcIDCZnntUGFwjH55L7Qov', desc: 'Striver Trie playlist.', why: 'Visual node insertion and search.' }
            ],
            preference2: [
              { title: 'LeetCode Trie Tag', type: 'Practice', link: 'https://leetcode.com/tag/trie/', desc: 'Practice problems.', why: 'Trie questions.' }
            ],
            preference3: [
              { title: 'GFG Trie Tutorial', type: 'Article', link: 'https://www.geeksforgeeks.org/trie-insert-and-search/', desc: 'Articles and examples.', why: 'Conceptual reference.' }
            ]
          }
        },
        {
          id: 'graphs-track',
          title: 'Graph Theory',
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
              { title: 'Graph Theory Algorithms Repository', type: 'GitHub', link: 'https://github.com/williamfiset/Algorithms/tree/master/src/main/java/com/williamfiset/algorithms/graphtheory', desc: 'WilliamFiset graph algorithms.', why: 'Standard graph algorithms repository.' },
              { title: 'Graph Theory Full Video Course', type: 'YouTube', link: 'https://www.youtube.com/watch?v=tWVWeAqZ0WU', desc: 'FreeCodeCamp 6-hour Graph theory course.', why: 'Visual graph traversal animations.' }
            ],
            preference2: [
              { title: 'Striver Graph Series', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5zQVFEPwXz', desc: 'Top Graph interview playlist.', why: 'Dijkstra and Topological sort tutorials.' }
            ],
            preference3: [
              { title: 'LeetCode Graph Study Plan', type: 'Practice', link: 'https://leetcode.com/studyplan/graph-theory/', desc: 'Practice problems.', why: 'Curated problem set.' }
            ]
          }
        }
      ]
    },
    {
      id: 'phase-4',
      title: 'Phase 4 — Algorithms & Optimization',
      description: 'Master Greedy Choice, Dynamic Programming (Memoization & Tabulation), and Final Sprint Mock Practice.',
      tracks: [
        {
          id: 'greedy-track',
          title: 'Greedy Algorithms',
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
              { title: 'Greedy Algorithms Guide', type: 'GitHub', link: 'https://github.com/striver7/Strivers-A2Z-DSA-Course', desc: 'Striver greedy code implementations.', why: 'Interval scheduling templates.' },
              { title: 'Greedy Algorithms Playlist', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rF1w2KbuZWEvh9EUvqq_Qg', desc: 'Complete Greedy video playlist.', why: 'Detailed proofs of greedy choice.' }
            ],
            preference2: [
              { title: 'LeetCode Greedy Tagged', type: 'Practice', link: 'https://leetcode.com/tag/greedy/', desc: 'Greedy practice set.', why: 'Practice questions.' }
            ],
            preference3: [
              { title: 'GFG Greedy Algorithms', type: 'Article', link: 'https://www.geeksforgeeks.org/greedy-algorithms/', desc: 'Conceptual articles.', why: 'Reference docs.' }
            ]
          }
        },
        {
          id: 'dp-track',
          title: 'Dynamic Programming',
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
              { title: 'Dynamic Programming Patterns Repo', type: 'GitHub', link: 'https://github.com/labuladong/fucking-algorithm/tree/master/dynamic_programming', desc: 'Labuladong DP framework.', why: 'Master state transition equations.' },
              { title: 'Striver DP Playlist', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYA074wPzsPtY', desc: 'Striver 50-video DP masterclass.', why: 'Top DP series for technical interviews.' }
            ],
            preference2: [
              { title: 'NeetCode DP Playlist', type: 'YouTube', link: 'https://www.youtube.com/playlist?list=PLot-Xpze53lcvx_tjrr_m2lgD2NsRHlNO', desc: 'NeetCode DP video solutions.', why: '2D DP table visualization.' }
            ],
            preference3: [
              { title: 'LeetCode DP Study Plan', type: 'Practice', link: 'https://leetcode.com/studyplan/dynamic-programming/', desc: 'Practice problems.', why: 'Structured DP question path.' }
            ]
          }
        },
        {
          id: 'sprint-track',
          title: 'Final Integration & Mock Practice',
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
              { title: 'NeetCode 150 Practice Sheet', type: 'Practice', link: 'https://neetcode.io/practice', desc: 'Ultimate 150 interview problems.', why: 'High yield interview prep.' },
              { title: 'Striver A2Z DSA Sheet', type: 'Practice', link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2', desc: 'A2Z DSA roadmap sheet.', why: 'Complete DSA question bank.' }
            ],
            preference2: [
              { title: 'LeetCode Weekly Contest Page', type: 'Practice', link: 'https://leetcode.com/contest/', desc: 'Live weekly programming contests.', why: 'Timed speed practice.' }
            ],
            preference3: [
              { title: 'CodeNinja / CodeStudio Guided Paths', type: 'Practice', link: 'https://www.naukri.com/code360/guided-paths', desc: 'Guided interview paths.', why: 'Company specific paths.' }
            ]
          }
        }
      ]
    }
  ]
};

export const countTotalCentralLeafConcepts = () => {
  let count = 0;
  DSA_CENTRAL_STORE.phases.forEach(phase => {
    phase.tracks.forEach(track => {
      track.subtracks.forEach(subtrack => {
        count += subtrack.concepts.length;
      });
    });
  });
  return count;
};

export const HARSHA_VERSE_INSPIRATION_DATA = {
  title: "Credits & Inspiration",
  subtitle: "Harsha Verse DSA Learning System",
  desc: "This DSA Workspace was inspired by the learning approach, roadmap, and educational content shared by Harsha Verse. This workspace transforms that inspiration into a personalized, interactive system for organizing topics, tracking progress, and learning at your own pace.",
  resources: {
    preference1: [
      {
        title: "Harsha Verse — DSA Roadmap Reference",
        type: "Roadmap",
        badge: "Roadmap",
        link: "https://whimsical.com/harsha-verse-dsa-roadmap-PeL2uTdPZq6u4ECMiHEARR",
        desc: "Reference roadmap used as an important source of inspiration while structuring this DSA learning workspace.",
        why: "Primary visual roadmap structure source"
      },
      {
        title: "Harsha Verse — DSA Roadmap Document",
        type: "Document",
        badge: "Document",
        link: "https://docs.google.com/document/d/1td4pyjgWSFTrmmEV-ewlchKC4mSMy5iB-CshRk2B0Cw/edit?tab=t.0#heading=h.enfly8158zrp",
        desc: "Reference document used for roadmap structure, learning organization, and inspiration.",
        why: "Curriculum structure & topic breakdown reference"
      },
      {
        title: "Harsha Verse — YouTube Learning Resource",
        type: "YouTube",
        badge: "YouTube",
        link: "https://www.youtube.com/watch?v=IK63UfMh9E8",
        desc: "Video content and learning guidance that inspired the development of this DSA Workspace.",
        why: "Harsha Verse DSA Masterclass Video Guide"
      }
    ]
  }
};

