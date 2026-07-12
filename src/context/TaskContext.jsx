import React, { createContext, useState, useEffect, useRef } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  doc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs,
  orderBy,
  writeBatch
} from 'firebase/firestore';


export const TaskContext = createContext();

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];


// ROADMAP GENERATOR HELPER

export const getDefaultRoadmapForCategory = (cat) => {
  if (cat === 'JavaScript' || cat === 'JavaScript Complete Mindmap') {
    return {
      id: `javascript-${Date.now()}`,
      title: 'JavaScript Complete Mindmap',
      topics: [
        {
          id: 'js-basics',
          title: '1️⃣ Basics (Foundation)',
          expanded: true,
          subtopics: [
            { id: 'js-basics-1', title: 'What is JavaScript?', done: false },
            { id: 'js-basics-2', title: 'How JS works in browser', done: false },
            { id: 'js-basics-3', title: 'Internal vs External JS', done: false },
            { id: 'js-basics-4', title: 'console.log()', done: false },
            { id: 'js-basics-5', title: 'Comments', done: false },
            { id: 'js-basics-6', title: 'Variables', done: false },
            { id: 'js-basics-7', title: 'var', done: false },
            { id: 'js-basics-8', title: 'let', done: false },
            { id: 'js-basics-9', title: 'const', done: false },
            { id: 'js-basics-10', title: 'Data Types', done: false },
            { id: 'js-basics-11', title: 'String', done: false },
            { id: 'js-basics-12', title: 'Number', done: false },
            { id: 'js-basics-13', title: 'Boolean', done: false },
            { id: 'js-basics-14', title: 'Null', done: false },
            { id: 'js-basics-15', title: 'Undefined', done: false },
            { id: 'js-basics-16', title: 'BigInt', done: false },
            { id: 'js-basics-17', title: 'Symbol', done: false },
            { id: 'js-basics-18', title: 'Type Conversion', done: false },
            { id: 'js-basics-19', title: 'Operators', done: false },
            { id: 'js-basics-20', title: 'Arithmetic', done: false },
            { id: 'js-basics-21', title: 'Comparison', done: false },
            { id: 'js-basics-22', title: 'Logical', done: false },
            { id: 'js-basics-23', title: 'Assignment', done: false },
            { id: 'js-basics-24', title: 'Ternary', done: false }
          ]
        },
        {
          id: 'js-control',
          title: '2️⃣ Control Flow',
          expanded: false,
          subtopics: [
            { id: 'js-control-1', title: 'if', done: false },
            { id: 'js-control-2', title: 'if else', done: false },
            { id: 'js-control-3', title: 'else if', done: false },
            { id: 'js-control-4', title: 'Nested if', done: false },
            { id: 'js-control-5', title: 'switch', done: false },
            { id: 'js-control-6', title: 'Ternary operator', done: false }
          ]
        },
        {
          id: 'js-loops',
          title: '3️⃣ Loops',
          expanded: false,
          subtopics: [
            { id: 'js-loops-1', title: 'for', done: false },
            { id: 'js-loops-2', title: 'while', done: false },
            { id: 'js-loops-3', title: 'do while', done: false },
            { id: 'js-loops-4', title: 'Nested loops', done: false },
            { id: 'js-loops-5', title: 'break', done: false },
            { id: 'js-loops-6', title: 'continue', done: false }
          ]
        },
        {
          id: 'js-funcs',
          title: '4️⃣ Functions',
          expanded: false,
          subtopics: [
            { id: 'js-funcs-1', title: 'Function declaration', done: false },
            { id: 'js-funcs-2', title: 'Function expression', done: false },
            { id: 'js-funcs-3', title: 'Parameters', done: false },
            { id: 'js-funcs-4', title: 'Return statement', done: false },
            { id: 'js-funcs-5', title: 'Arrow functions (=>)', done: false },
            { id: 'js-funcs-6', title: 'Default parameters', done: false },
            { id: 'js-funcs-7', title: 'Rest parameters (...)', done: false },
            { id: 'js-funcs-8', title: 'Callback functions', done: false },
            { id: 'js-funcs-9', title: 'Higher order functions', done: false }
          ]
        },
        {
          id: 'js-strings',
          title: '5️⃣ Strings',
          expanded: false,
          subtopics: [
            { id: 'js-strings-1', title: 'String methods', done: false },
            { id: 'js-strings-2', title: 'length', done: false },
            { id: 'js-strings-3', title: 'slice()', done: false },
            { id: 'js-strings-4', title: 'substring()', done: false },
            { id: 'js-strings-5', title: 'replace()', done: false },
            { id: 'js-strings-6', title: 'split()', done: false },
            { id: 'js-strings-7', title: 'trim()', done: false },
            { id: 'js-strings-8', title: 'toUpperCase()', done: false },
            { id: 'js-strings-9', title: 'toLowerCase()', done: false },
            { id: 'js-strings-10', title: 'includes()', done: false }
          ]
        },
        {
          id: 'js-arrays',
          title: '6️⃣ Arrays',
          expanded: false,
          subtopics: [
            { id: 'js-arrays-1', title: 'Creating arrays', done: false },
            { id: 'js-arrays-2', title: 'Accessing elements', done: false },
            { id: 'js-arrays-3', title: 'Array methods', done: false },
            { id: 'js-arrays-4', title: 'push()', done: false },
            { id: 'js-arrays-5', title: 'pop()', done: false },
            { id: 'js-arrays-6', title: 'shift()', done: false },
            { id: 'js-arrays-7', title: 'unshift()', done: false },
            { id: 'js-arrays-8', title: 'splice()', done: false },
            { id: 'js-arrays-9', title: 'slice()', done: false },
            { id: 'js-arrays-10', title: 'concat()', done: false },
            { id: 'js-arrays-11', title: 'join()', done: false },
            { id: 'js-arrays-12', title: 'Iteration', done: false },
            { id: 'js-arrays-13', title: 'for', done: false },
            { id: 'js-arrays-14', title: 'for...of', done: false },
            { id: 'js-arrays-15', title: 'forEach()', done: false }
          ]
        },
        {
          id: 'js-arradv',
          title: '7️⃣ Array Advanced Methods ⭐',
          expanded: false,
          subtopics: [
            { id: 'js-arradv-1', title: 'map()', done: false },
            { id: 'js-arradv-2', title: 'filter()', done: false },
            { id: 'js-arradv-3', title: 'reduce()', done: false },
            { id: 'js-arradv-4', title: 'find()', done: false },
            { id: 'js-arradv-5', title: 'findIndex()', done: false },
            { id: 'js-arradv-6', title: 'some()', done: false },
            { id: 'js-arradv-7', title: 'every()', done: false },
            { id: 'js-arradv-8', title: 'sort()', done: false },
            { id: 'js-arradv-9', title: 'includes()', done: false }
          ]
        },
        {
          id: 'js-objs',
          title: '8️⃣ Objects',
          expanded: false,
          subtopics: [
            { id: 'js-objs-1', title: 'Creating objects', done: false },
            { id: 'js-objs-2', title: 'Access properties', done: false },
            { id: 'js-objs-3', title: 'Modify properties', done: false },
            { id: 'js-objs-4', title: 'Nested objects', done: false },
            { id: 'js-objs-5', title: 'Object methods', done: false },
            { id: 'js-objs-6', title: 'this keyword', done: false },
            { id: 'js-objs-7', title: 'Object destructuring', done: false },
            { id: 'js-objs-8', title: 'Spread operator (...)', done: false },
            { id: 'js-objs-9', title: 'Object methods', done: false },
            { id: 'js-objs-10', title: 'keys()', done: false },
            { id: 'js-objs-11', title: 'values()', done: false },
            { id: 'js-objs-12', title: 'entries()', done: false }
          ]
        },
        {
          id: 'js-scope',
          title: '9️⃣ Scope & Execution',
          expanded: false,
          subtopics: [
            { id: 'js-scope-1', title: 'Global scope', done: false },
            { id: 'js-scope-2', title: 'Local scope', done: false },
            { id: 'js-scope-3', title: 'Block scope', done: false },
            { id: 'js-scope-4', title: 'Lexical scope', done: false },
            { id: 'js-scope-5', title: 'Hoisting', done: false },
            { id: 'js-scope-6', title: 'Temporal Dead Zone (TDZ)', done: false }
          ]
        },
        {
          id: 'js-dom',
          title: '🔟 DOM Manipulation ⭐⭐⭐',
          expanded: false,
          subtopics: [
            { id: 'js-dom-1', title: 'What is DOM?', done: false },
            { id: 'js-dom-2', title: 'Selecting elements', done: false },
            { id: 'js-dom-3', title: 'getElementById()', done: false },
            { id: 'js-dom-4', title: 'querySelector()', done: false },
            { id: 'js-dom-5', title: 'querySelectorAll()', done: false },
            { id: 'js-dom-6', title: 'Changing content', done: false },
            { id: 'js-dom-7', title: 'innerHTML', done: false },
            { id: 'js-dom-8', title: 'textContent', done: false },
            { id: 'js-dom-9', title: 'CSS manipulation', done: false },
            { id: 'js-dom-10', title: 'Attributes', done: false },
            { id: 'js-dom-11', title: 'Create elements', done: false },
            { id: 'js-dom-12', title: 'Remove elements', done: false },
            { id: 'js-dom-13', title: 'Append elements', done: false }
          ]
        },
        {
          id: 'js-events',
          title: '1️⃣1️⃣ Events',
          expanded: false,
          subtopics: [
            { id: 'js-events-1', title: 'onclick', done: false },
            { id: 'js-events-2', title: 'addEventListener()', done: false },
            { id: 'js-events-3', title: 'Mouse events', done: false },
            { id: 'js-events-4', title: 'Keyboard events', done: false },
            { id: 'js-events-5', title: 'Form events', done: false },
            { id: 'js-events-6', title: 'Event bubbling', done: false },
            { id: 'js-events-7', title: 'Event capturing', done: false },
            { id: 'js-events-8', title: 'Event delegation', done: false }
          ]
        },
        {
          id: 'js-timing',
          title: '1️⃣2️⃣ Timing Functions',
          expanded: false,
          subtopics: [
            { id: 'js-timing-1', title: 'setTimeout()', done: false },
            { id: 'js-timing-2', title: 'setInterval()', done: false },
            { id: 'js-timing-3', title: 'clearTimeout()', done: false },
            { id: 'js-timing-4', title: 'clearInterval()', done: false }
          ]
        },
        {
          id: 'js-errors',
          title: '1️⃣3️⃣ Error Handling',
          expanded: false,
          subtopics: [
            { id: 'js-errors-1', title: 'try', done: false },
            { id: 'js-errors-2', title: 'catch', done: false },
            { id: 'js-errors-3', title: 'finally', done: false },
            { id: 'js-errors-4', title: 'throw', done: false },
            { id: 'js-errors-5', title: 'Custom errors', done: false }
          ]
        },
        {
          id: 'js-advf',
          title: '1️⃣4️⃣ Advanced Functions',
          expanded: false,
          subtopics: [
            { id: 'js-advf-1', title: 'Closures ⭐', done: false },
            { id: 'js-advf-2', title: 'Callback Hell', done: false },
            { id: 'js-advf-3', title: 'Function currying', done: false },
            { id: 'js-advf-4', title: 'IIFE', done: false },
            { id: 'js-advf-5', title: 'Bind', done: false },
            { id: 'js-advf-6', title: 'Call', done: false },
            { id: 'js-advf-7', title: 'Apply', done: false }
          ]
        },
        {
          id: 'js-es6',
          title: '1️⃣5️⃣ ES6+ Features ⭐⭐⭐',
          expanded: false,
          subtopics: [
            { id: 'js-es6-1', title: 'Template literals', done: false },
            { id: 'js-es6-2', title: 'Destructuring', done: false },
            { id: 'js-es6-3', title: 'Spread operator', done: false },
            { id: 'js-es6-4', title: 'Rest operator', done: false },
            { id: 'js-es6-5', title: 'Arrow functions', done: false },
            { id: 'js-es6-6', title: 'Optional chaining', done: false },
            { id: 'js-es6-7', title: 'Nullish coalescing', done: false },
            { id: 'js-es6-8', title: 'Modules', done: false },
            { id: 'js-es6-9', title: 'export', done: false },
            { id: 'js-es6-10', title: 'import', done: false }
          ]
        },
        {
          id: 'js-oop',
          title: '1️⃣6️⃣ OOP in JavaScript',
          expanded: false,
          subtopics: [
            { id: 'js-oop-1', title: 'Objects', done: false },
            { id: 'js-oop-2', title: 'Constructor functions', done: false },
            { id: 'js-oop-3', title: 'Prototypes', done: false },
            { id: 'js-oop-4', title: 'Classes', done: false },
            { id: 'js-oop-5', title: 'Inheritance', done: false },
            { id: 'js-oop-6', title: 'Encapsulation', done: false },
            { id: 'js-oop-7', title: 'Polymorphism', done: false },
            { id: 'js-oop-8', title: 'Static methods', done: false }
          ]
        },
        {
          id: 'js-async',
          title: '1️⃣7️⃣ Asynchronous JavaScript ⭐⭐⭐',
          expanded: false,
          subtopics: [
            { id: 'js-async-1', title: 'Synchronous vs Asynchronous', done: false },
            { id: 'js-async-2', title: 'Callback functions', done: false },
            { id: 'js-async-3', title: 'Promises', done: false },
            { id: 'js-async-4', title: 'Promise methods', done: false },
            { id: 'js-async-5', title: 'Async/Await', done: false },
            { id: 'js-async-6', title: 'Event Loop', done: false },
            { id: 'js-async-7', title: 'Call Stack', done: false },
            { id: 'js-async-8', title: 'Microtask Queue', done: false }
          ]
        },
        {
          id: 'js-api',
          title: '1️⃣8️⃣ Fetch API & APIs',
          expanded: false,
          subtopics: [
            { id: 'js-api-1', title: 'What is API?', done: false },
            { id: 'js-api-2', title: 'JSON', done: false },
            { id: 'js-api-3', title: 'fetch()', done: false },
            { id: 'js-api-4', title: 'GET requests', done: false },
            { id: 'js-api-5', title: 'POST requests', done: false },
            { id: 'js-api-6', title: 'Error handling', done: false },
            { id: 'js-api-7', title: 'API projects', done: false }
          ]
        },
        {
          id: 'js-storage',
          title: '1️⃣9️⃣ Browser Storage',
          expanded: false,
          subtopics: [
            { id: 'js-storage-1', title: 'Local Storage', done: false },
            { id: 'js-storage-2', title: 'Session Storage', done: false },
            { id: 'js-storage-3', title: 'Cookies', done: false }
          ]
        },
        {
          id: 'js-advc',
          title: '2️⃣0️⃣ Advanced Concepts',
          expanded: false,
          subtopics: [
            { id: 'js-advc-1', title: 'Execution Context', done: false },
            { id: 'js-advc-2', title: 'Scope Chain', done: false },
            { id: 'js-advc-3', title: 'Closure', done: false },
            { id: 'js-advc-4', title: 'Prototype Chain', done: false },
            { id: 'js-advc-5', title: 'Garbage Collection', done: false },
            { id: 'js-advc-6', title: 'Event Loop', done: false },
            { id: 'js-advc-7', title: 'Debouncing', done: false },
            { id: 'js-advc-8', title: 'Throttling', done: false }
          ]
        },
        {
          id: 'js-modules',
          title: '2️⃣1️⃣ Modules',
          expanded: false,
          subtopics: [
            { id: 'js-modules-1', title: 'Export', done: false },
            { id: 'js-modules-2', title: 'Import', done: false },
            { id: 'js-modules-3', title: 'Named exports', done: false },
            { id: 'js-modules-4', title: 'Default exports', done: false }
          ]
        },
        {
          id: 'js-regex',
          title: '2️⃣2️⃣ Regular Expressions (Regex)',
          expanded: false,
          subtopics: [
            { id: 'js-regex-1', title: 'Patterns', done: false },
            { id: 'js-regex-2', title: 'Match', done: false },
            { id: 'js-regex-3', title: 'Replace', done: false },
            { id: 'js-regex-4', title: 'Test', done: false }
          ]
        },
        {
          id: 'js-bom',
          title: '2️⃣3️⃣ BOM (Browser Object Model)',
          expanded: false,
          subtopics: [
            { id: 'js-bom-1', title: 'window', done: false },
            { id: 'js-bom-2', title: 'navigator', done: false },
            { id: 'js-bom-3', title: 'location', done: false },
            { id: 'js-bom-4', title: 'history', done: false },
            { id: 'js-bom-5', title: 'screen', done: false }
          ]
        },
        {
          id: 'js-proj',
          title: '2️⃣4️⃣ Practice Projects ⭐⭐⭐',
          expanded: false,
          subtopics: [
            { id: 'js-proj-1', title: 'Calculator', done: false },
            { id: 'js-proj-2', title: 'To-do app', done: false },
            { id: 'js-proj-3', title: 'Stopwatch', done: false },
            { id: 'js-proj-4', title: 'Counter app', done: false },
            { id: 'js-proj-5', title: 'Weather app (API)', done: false },
            { id: 'js-proj-6', title: 'Quiz app', done: false },
            { id: 'js-proj-7', title: 'Expense tracker', done: false },
            { id: 'js-proj-8', title: 'Notes app', done: false },
            { id: 'js-proj-9', title: 'Movie search app', done: false },
            { id: 'js-proj-10', title: 'Portfolio website update and push into github', done: false }
          ]
        }
      ]
    };
  }

  const isLanguageOrTech = [
    'Python', 'Java', 'C++', 'C', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'SQL', 'React', 'NodeJS', 'Node.js'
  ].includes(cat);

  if (isLanguageOrTech) {
    return {
      id: `${cat.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: cat,
      topics: [
        {
          id: 'basics',
          title: 'Basics',
          expanded: true,
          subtopics: [
            { id: 'b-1', title: 'Variables', done: false },
            { id: 'b-2', title: 'Datatypes', done: false },
            { id: 'b-3', title: 'Operators', done: false },
            { id: 'b-4', title: 'Functions', done: false }
          ]
        },
        {
          id: 'inter',
          title: 'Intermediate',
          expanded: false,
          subtopics: [
            { id: 'i-1', title: 'Arrays', done: false },
            { id: 'i-2', title: 'Objects', done: false },
            { id: 'i-3', title: 'DOM', done: false },
            { id: 'i-4', title: 'Events', done: false }
          ]
        },
        {
          id: 'adv',
          title: 'Advanced',
          expanded: false,
          subtopics: [
            { id: 'a-1', title: 'Async JS', done: false },
            { id: 'a-2', title: 'Fetch API', done: false },
            { id: 'a-3', title: 'ES6', done: false },
            { id: 'a-4', title: 'Projects', done: false }
          ]
        }
      ]
    };
  }

  switch (cat) {
    case 'Web Development':
      return {
        id: `web-dev-${Date.now()}`,
        title: 'Web Development',
        topics: [
          {
            id: 'html',
            title: 'HTML',
            expanded: true,
            subtopics: [
              { id: 'html-1', title: 'Introduction', done: true },
              { id: 'html-2', title: 'Basic Structure', done: true },
              { id: 'html-3', title: 'Headings', done: true },
              { id: 'html-4', title: 'Paragraphs', done: true },
              { id: 'html-5', title: 'Lists', done: true },
              { id: 'html-6', title: 'Tables', done: true },
              { id: 'html-7', title: 'Forms', done: true },
              { id: 'html-8', title: 'Semantic Tags', done: false },
              { id: 'html-9', title: 'Audio Video', done: false },
              { id: 'html-10', title: 'SEO Basics', done: false }
            ]
          },
          {
            id: 'css',
            title: 'CSS',
            expanded: false,
            subtopics: [
              { id: 'css-1', title: 'Selectors', done: true },
              { id: 'css-2', title: 'Box Model', done: true },
              { id: 'css-3', title: 'Positioning', done: true },
              { id: 'css-4', title: 'Flexbox', done: false },
              { id: 'css-5', title: 'Grid', done: false },
              { id: 'css-6', title: 'Responsive Design', done: false },
              { id: 'css-7', title: 'Animations', done: false },
              { id: 'css-8', title: 'Transitions', done: false },
              { id: 'css-9', title: 'Media Queries', done: false }
            ]
          },
          {
            id: 'js',
            title: 'JavaScript',
            expanded: false,
            subtopics: [
              { id: 'js-1', title: 'Variables', done: false },
              { id: 'js-2', title: 'Data Types', done: false },
              { id: 'js-3', title: 'Operators', done: false },
              { id: 'js-4', title: 'Functions', done: false },
              { id: 'js-5', title: 'Arrays', done: false },
              { id: 'js-6', title: 'Objects', done: false },
              { id: 'js-7', title: 'DOM', done: false },
              { id: 'js-8', title: 'Events', done: false },
              { id: 'js-9', title: 'Async JavaScript', done: false },
              { id: 'js-10', title: 'Fetch API', done: false },
              { id: 'js-11', title: 'ES6', done: false },
              { id: 'js-12', title: 'Projects', done: false }
            ]
          },
          {
            id: 'react',
            title: 'React',
            expanded: false,
            subtopics: [
              { id: 'react-1', title: 'Components', done: false },
              { id: 'react-2', title: 'Props', done: false },
              { id: 'react-3', title: 'State', done: false },
              { id: 'react-4', title: 'Hooks', done: false },
              { id: 'react-5', title: 'Routing', done: false },
              { id: 'react-6', title: 'API Calls', done: false }
            ]
          }
        ]
      };
    case 'DSA':
      return {
        id: `dsa-${Date.now()}`,
        title: 'DSA',
        topics: [
          { id: 'arrays', title: 'Arrays', expanded: true, subtopics: [{ id: 'arr-1', title: 'Kadane\'s Algorithm', done: false }, { id: 'arr-2', title: 'Two Pointers', done: false }] },
          { id: 'strings', title: 'Strings', expanded: false, subtopics: [{ id: 'str-1', title: 'Anagrams', done: false }, { id: 'str-2', title: 'Palindromes', done: false }] },
          { id: 'recursion', title: 'Recursion', expanded: false, subtopics: [{ id: 'rec-1', title: 'Backtracking', done: false }] },
          { id: 'linkedlists', title: 'Linked Lists', expanded: false, subtopics: [{ id: 'll-1', title: 'Reverse List', done: false }] },
          { id: 'stack', title: 'Stack', expanded: false, subtopics: [{ id: 'st-1', title: 'Valid Parentheses', done: false }] },
          { id: 'queue', title: 'Queue', expanded: false, subtopics: [{ id: 'qu-1', title: 'Queue using Stacks', done: false }] },
          { id: 'trees', title: 'Trees', expanded: false, subtopics: [{ id: 'tr-1', title: 'Binary Trees', done: false }] },
          { id: 'graphs', title: 'Graphs', expanded: false, subtopics: [{ id: 'gr-1', title: 'DFS and BFS', done: false }] },
          { id: 'dp', title: 'Dynamic Programming', expanded: false, subtopics: [{ id: 'dp-1', title: 'Knapsack 0/1', done: false }] }
        ]
      };
    case 'Python':
      return {
        id: `python-${Date.now()}`,
        title: 'Python',
        topics: [
          { id: 'py-basics', title: 'Basics', expanded: true, subtopics: [{ id: 'pyb-1', title: 'Variables & Loops', done: false }] },
          { id: 'py-oop', title: 'OOP', expanded: false, subtopics: [{ id: 'pyo-1', title: 'Inheritance & Polymorphism', done: false }] },
          { id: 'py-funcs', title: 'Functions', expanded: false, subtopics: [{ id: 'pyf-1', title: 'Lambda & Decorators', done: false }] },
          { id: 'py-mods', title: 'Modules', expanded: false, subtopics: [{ id: 'pym-1', title: 'pip & Venv', done: false }] },
          { id: 'py-files', title: 'File Handling', expanded: false, subtopics: [{ id: 'pyfi-1', title: 'Read & Write Text', done: false }] },
          { id: 'py-except', title: 'Exception Handling', expanded: false, subtopics: [{ id: 'pye-1', title: 'Try Except Blocks', done: false }] },
          { id: 'py-dsa', title: 'DSA with Python', expanded: false, subtopics: [{ id: 'pyd-1', title: 'Lists, Dicts, Sets', done: false }] },
          { id: 'py-libs', title: 'Libraries', expanded: false, subtopics: [{ id: 'pyl-1', title: 'NumPy & Pandas', done: false }] }
        ]
      };
    case 'Java':
      return {
        id: `java-${Date.now()}`,
        title: 'Java',
        topics: [
          { id: 'java-basics', title: 'Basics', expanded: true, subtopics: [{ id: 'javb-1', title: 'JVM, JRE, JDK', done: false }, { id: 'javb-2', title: 'Data Types', done: false }] },
          { id: 'java-oop', title: 'OOP', expanded: false, subtopics: [{ id: 'javo-1', title: 'Classes & Interfaces', done: false }] },
          { id: 'java-except', title: 'Exception Handling', expanded: false, subtopics: [{ id: 'jave-1', title: 'Try-catch throw', done: false }] },
          { id: 'java-coll', title: 'Collections Framework', expanded: false, subtopics: [{ id: 'javc-1', title: 'List, Set, Map APIs', done: false }] },
          { id: 'java-thread', title: 'Multithreading', expanded: false, subtopics: [{ id: 'javt-1', title: 'Runnable & ExecutorService', done: false }] },
          { id: 'java-jdbc', title: 'JDBC', expanded: false, subtopics: [{ id: 'javj-1', title: 'SQL Connections', done: false }] }
        ]
      };
    case 'AI/ML':
      return {
        id: `aiml-${Date.now()}`,
        title: 'AI/ML',
        topics: [
          { id: 'aiml-basics', title: 'Basics of AI', expanded: true, subtopics: [{ id: 'mlb-1', title: 'Supervised vs Unsupervised', done: false }] },
          { id: 'aiml-regr', title: 'Linear Regression', expanded: false, subtopics: [{ id: 'mlr-1', title: 'Cost Functions & Gradient Descent', done: false }] },
          { id: 'aiml-trees', title: 'Decision Trees', expanded: false, subtopics: [{ id: 'mlt-1', title: 'Random Forests', done: false }] },
          { id: 'aiml-deep', title: 'Deep Learning', expanded: false, subtopics: [{ id: 'mld-1', title: 'CNNs & RNNs', done: false }] },
          { id: 'aiml-nlp', title: 'NLP', expanded: false, subtopics: [{ id: 'mln-1', title: 'Tokenization & Embeddings', done: false }] },
          { id: 'aiml-llms', title: 'LLMs', expanded: false, subtopics: [{ id: 'mll-1', title: 'Transformers & Fine-Tuning', done: false }] }
        ]
      };
    case 'DevOps':
      return {
        id: `devops-${Date.now()}`,
        title: 'DevOps',
        topics: [
          { id: 'do-git', title: 'Git & GitHub', expanded: true, subtopics: [{ id: 'dog-1', title: 'Branching & Rebase', done: false }] },
          { id: 'do-docker', title: 'Docker', expanded: false, subtopics: [{ id: 'dod-1', title: 'Containers & Dockerfiles', done: false }] },
          { id: 'do-k8s', title: 'Kubernetes', expanded: false, subtopics: [{ id: 'dok-1', title: 'Pods, Services, Deployments', done: false }] },
          { id: 'do-cicd', title: 'CI/CD Pipelines', expanded: false, subtopics: [{ id: 'doci-1', title: 'GitHub Actions', done: false }] },
          { id: 'do-aws', title: 'AWS Basics', expanded: false, subtopics: [{ id: 'doa-1', title: 'EC2 & S3 Buckets', done: false }] },
          { id: 'do-linux', title: 'Linux', expanded: false, subtopics: [{ id: 'dol-1', title: 'Bash Scripts & Cron', done: false }] }
        ]
      };
    case 'Fitness':
    case 'Gym':
      return {
        id: `fitness-${Date.now()}`,
        title: 'Peak Fitness',
        topics: [
          { id: 'fit-workout', title: 'Workout Splits', expanded: true, subtopics: [{ id: 'fitw-1', title: 'Push Pull Legs split', done: false }, { id: 'fitw-2', title: 'Hypertrophy volume routines', done: false }] },
          { id: 'fit-cardio', title: 'Cardio Habits', expanded: false, subtopics: [{ id: 'fitc-1', title: 'High Intensity Intervals (HIIT)', done: false }] },
          { id: 'fit-diet', title: 'Diet & Macros', expanded: false, subtopics: [{ id: 'fitd-1', title: 'Tracking proteins & carbs', done: false }] }
        ]
      };
    case 'Startup':
      return {
        id: `startup-${Date.now()}`,
        title: 'Startup',
        topics: [
          { id: 'st-ideation', title: 'Ideation', expanded: true, subtopics: [{ id: 'sti-1', title: 'Problem validation', done: false }] },
          { id: 'st-mvp', title: 'MVP Development', expanded: false, subtopics: [{ id: 'stm-1', title: 'High fidelity mockups', done: false }, { id: 'stm-2', title: 'Interactive logic build', done: false }] },
          { id: 'st-landing', title: 'Landing Page', expanded: false, subtopics: [{ id: 'stl-1', title: 'Conversion rates optimization', done: false }] },
          { id: 'st-launch', title: 'Launch & Traction', expanded: false, subtopics: [{ id: 'stla-1', title: 'Product Hunt Launch', done: false }] }
        ]
      };
    default:
      return {
        id: `personal-${Date.now()}`,
        title: cat || 'Personal Growth',
        topics: [
          { id: 'per-books', title: 'Book reading list', expanded: true, subtopics: [{ id: 'perb-1', title: 'Read Atomic Habits', done: false }] },
          { id: 'per-morning', title: 'Morning routines', expanded: false, subtopics: [{ id: 'perm-1', title: '20 minutes meditation', done: false }] }
        ]
      };
  }
};


export const TaskProvider = ({ children }) => {
  // Authentication & Profile loading states
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(() => {
    const cached = localStorage.getItem('cache_userProfile');
    return cached ? JSON.parse(cached) : null;
  });
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('isOnboarded') === 'true';
  });
  const [loading, setLoading] = useState(true);

  // Firestore synced state variables
  const [tasks, setTasks] = useState(() => {
    const cached = localStorage.getItem('cache_tasks');
    return cached ? JSON.parse(cached) : [];
  });
  const [exams, setExams] = useState(() => {
    const cached = localStorage.getItem('cache_exams');
    return cached ? JSON.parse(cached) : [];
  });
  const [assignments, setAssignments] = useState(() => {
    const cached = localStorage.getItem('cache_assignments');
    return cached ? JSON.parse(cached) : [];
  });
  const [workspaces, setWorkspaces] = useState(() => {
    const cached = localStorage.getItem('cache_workspaces');
    return cached ? JSON.parse(cached) : [];
  });
  const [collaboratedWorkspaces, setCollaboratedWorkspaces] = useState(() => {
    const cached = localStorage.getItem('cache_collaborated_workspaces');
    return cached ? JSON.parse(cached) : [];
  });
  const [myCreatedTasks, setMyCreatedTasks] = useState([]);
  const [workspaceTasksMap, setWorkspaceTasksMap] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState({});
  const [collaborators, setCollaborators] = useState({});
  const [presenceStates, setPresenceStates] = useState({});
  const [typingStates, setTypingStates] = useState({});
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'Public',
    showSkills: 'Everyone',
    showXP: 'Everyone',
    allowRequests: 'Everyone',
    allowCollaborations: 'Friends'
  });

  const msgListenersRef = useRef({});

  // Caching updates to localStorage
  useEffect(() => {
    if (userProfile) localStorage.setItem('cache_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('cache_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (exams.length > 0) localStorage.setItem('cache_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    if (assignments.length > 0) localStorage.setItem('cache_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    if (workspaces.length > 0) localStorage.setItem('cache_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    if (collaboratedWorkspaces.length > 0) localStorage.setItem('cache_collaborated_workspaces', JSON.stringify(collaboratedWorkspaces));
  }, [collaboratedWorkspaces]);

  const wsTasksListenersRef = useRef({});

  // Real-time synchronization of tasks for owned and collaborated workspaces
  useEffect(() => {
    if (!currentUser) {
      Object.values(wsTasksListenersRef.current).forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
      wsTasksListenersRef.current = {};
      setWorkspaceTasksMap({});
      return;
    }

    const activeWsIds = new Set([
      ...workspaces.map(w => w.id),
      ...collaboratedWorkspaces.map(w => w.id)
    ]);

    // Clean up listeners for workspaces that are no longer active
    Object.keys(wsTasksListenersRef.current).forEach(wsId => {
      if (!activeWsIds.has(wsId)) {
        if (typeof wsTasksListenersRef.current[wsId] === 'function') {
          wsTasksListenersRef.current[wsId]();
        }
        delete wsTasksListenersRef.current[wsId];
        setWorkspaceTasksMap(prev => {
          const copy = { ...prev };
          delete copy[wsId];
          return copy;
        });
      }
    });

    // Start listeners for new active workspaces
    activeWsIds.forEach(wsId => {
      if (!wsTasksListenersRef.current[wsId]) {
        const q = query(collection(db, 'tasks'), where('workspaceId', '==', wsId));
        wsTasksListenersRef.current[wsId] = onSnapshot(q, (snapshot) => {
          const list = [];
          snapshot.forEach(docSnap => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          setWorkspaceTasksMap(prev => ({
            ...prev,
            [wsId]: list
          }));
        }, (err) => {
          console.error(`Error listening to tasks for workspace ${wsId}:`, err);
        });
      }
    });
  }, [currentUser, workspaces, collaboratedWorkspaces]);

  // Merge myCreatedTasks and workspaceTasksMap into single tasks state
  useEffect(() => {
    const allMerged = [...myCreatedTasks];
    Object.values(workspaceTasksMap).forEach(wsTasksList => {
      wsTasksList.forEach(t => {
        if (!allMerged.some(existing => existing.id === t.id)) {
          allMerged.push(t);
        }
      });
    });
    setTasks(allMerged);
  }, [myCreatedTasks, workspaceTasksMap]);

  const getYesterdayStr = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const checkAndResetStreak = async (uid, profile) => {
    if (!uid || !profile) return;
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzOffset).toISOString();
    const todayStr = localISOTime.split('T')[0];

    const lastActivityDate = profile.lastActivityDate || '';
    if (lastActivityDate && lastActivityDate !== todayStr && lastActivityDate !== getYesterdayStr(todayStr)) {
      if (profile.currentStreak !== 0 || profile.streak !== 0) {
        await updateDoc(doc(db, 'users', uid), {
          currentStreak: 0,
          streak: 0
        });
        if (profile.userId) {
          await setDoc(doc(db, 'leaderboards', profile.userId), {
            streak: 0
          }, { merge: true });
        }
      }
    }
  };

  const logProductiveActivity = async (activityType) => {
    if (!currentUser || !userProfile) return;
    const uid = currentUser.uid;
    const userRef = doc(db, 'users', uid);
    
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzOffset).toISOString();
    const todayStr = localISOTime.split('T')[0];

    const activityHistory = userProfile.activityHistory || {};
    const currentCount = activityHistory[todayStr] || 0;
    const updatedHistory = {
      ...activityHistory,
      [todayStr]: currentCount + 1
    };

    let currentStreak = userProfile.currentStreak || 0;
    let highestStreak = userProfile.highestStreak || 0;
    const lastActivityDate = userProfile.lastActivityDate || '';

    if (lastActivityDate === todayStr) {
      // Already active today, streak remains same
    } else if (lastActivityDate === getYesterdayStr(todayStr)) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    if (currentStreak > highestStreak) {
      highestStreak = currentStreak;
    }

    const newXp = (userProfile.xp || 0) + 15;

    await updateDoc(userRef, {
      currentStreak,
      highestStreak,
      streak: currentStreak,
      lastActivityDate: todayStr,
      activityHistory: updatedHistory,
      xp: newXp
    });

    if (userProfile.userId) {
      await setDoc(doc(db, 'leaderboards', userProfile.userId), {
        xp: newXp,
        streak: currentStreak
      }, { merge: true });
    }
  };

  // 1. Auth state observer
  useEffect(() => {
    const handleUser = async (user) => {
      setCurrentUser(user);
      if (user) {
        // Listen to active user's profile doc in Firestore
        const profileRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            setUserProfile(profileData);
            setIsOnboarded(true);
            localStorage.setItem('isOnboarded', 'true');
            checkAndResetStreak(user.uid, profileData);
          } else {
            setUserProfile(null);
            setIsOnboarded(false);
            localStorage.setItem('isOnboarded', 'false');
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile listen error:", error);
          setLoading(false);
        });

        return () => {
          unsubscribeProfile();
        };
      } else {
        setUserProfile(null);
        setIsOnboarded(false);
        setLoading(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isOnboarded');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, []);

  // Apply theme from localStorage instantly on mount to avoid flashes
  useEffect(() => {
    const cachedTheme = localStorage.getItem('themePreference') || 'cyberpunk';
    document.documentElement.setAttribute('data-theme', cachedTheme);
  }, []);

  // Update theme in localStorage & document element when userProfile changes
  useEffect(() => {
    if (userProfile?.themePreference) {
      localStorage.setItem('themePreference', userProfile.themePreference);
      document.documentElement.setAttribute('data-theme', userProfile.themePreference);
    }
  }, [userProfile?.themePreference]);

  // Presence heartbeat & unload hook
  useEffect(() => {
    if (!currentUser || !userProfile || !userProfile.userId) return;
    
    const presenceRef = doc(db, 'presence', userProfile.userId);
    let lastActivity = Date.now();
    let currentStatus = 'online';

    const updatePresenceInFirestore = async (newStatus) => {
      currentStatus = newStatus;
      try {
        await setDoc(presenceRef, {
          status: newStatus,
          lastSeen: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Error setting presence:", err);
      }
    };

    const handleActivity = () => {
      lastActivity = Date.now();
      if (currentStatus === 'away') {
        updatePresenceInFirestore('online');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updatePresenceInFirestore('away');
      } else {
        updatePresenceInFirestore('online');
      }
    };

    // Add activity listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial online write
    updatePresenceInFirestore('online');

    // Heartbeat every 15 seconds
    const heartbeatInterval = setInterval(() => {
      const inactiveDuration = Date.now() - lastActivity;
      if (inactiveDuration > 120000 && currentStatus === 'online') {
        // Inactive for > 2 mins
        updatePresenceInFirestore('away');
      } else if (document.visibilityState === 'hidden' && currentStatus === 'online') {
        updatePresenceInFirestore('away');
      } else {
        // Send heartbeat
        updatePresenceInFirestore(currentStatus);
      }
    }, 15000);

    const setOffline = async () => {
      try {
        await setDoc(presenceRef, {
          status: 'offline',
          lastSeen: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Error setting presence offline:", err);
      }
    };

    const handleUnload = () => {
      setOffline();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
      setOffline();
    };
  }, [currentUser, userProfile?.userId]);

  // Logout method that updates presence to offline instantly
  const logout = async () => {
    if (currentUser && userProfile?.userId) {
      try {
        const presenceRef = doc(db, 'presence', userProfile.userId);
        await setDoc(presenceRef, {
          status: 'offline',
          lastSeen: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Error setting presence offline during logout:", err);
      }
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // 2. Real-time Firestore sync of user collections
  useEffect(() => {
    if (!currentUser || !userProfile) {
      setTasks([]);
      setExams([]);
      setAssignments([]);
      setWorkspaces([]);
      setNotifications([]);
      setFriends([]);
      setSentRequests([]);
      setChats({});
      setAllUsers([]);
      setPresenceStates({});
      setTypingStates({});
      // Clean up any message subcollection listeners
      Object.values(msgListenersRef.current).forEach((unsub) => unsub());
      msgListenersRef.current = {};
      return;
    }

    const uid = currentUser.uid;

    // A. Fetch all users once instead of subscribing to all updates (Optimizing Firestore Reads)
    const fetchUsersOnce = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ uid: docSnap.id, ...docSnap.data() });
        });
        setAllUsers(list);
      } catch (err) {
        console.error("Error fetching users list:", err);
      }
    };
    fetchUsersOnce();

    // B. Listen to tasks (both personal & workspace tasks)
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', uid));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMyCreatedTasks(list);
    });

    // C. Listen to exams
    const examsQuery = query(collection(db, 'exams'), where('userId', '==', uid));
    const unsubscribeExams = onSnapshot(examsQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setExams(list);
    });

    // D. Listen to assignments
    const assignQuery = query(collection(db, 'assignments'), where('userId', '==', uid));
    const unsubscribeAssign = onSnapshot(assignQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAssignments(list);
    });

    // E. Listen to workspaces
    const wsQuery = query(collection(db, 'workspaces'), where('ownerId', '==', uid));
    const unsubscribeWs = onSnapshot(wsQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setWorkspaces(list);
    });

    // E2. Listen to collaborated workspaces
    let unsubscribeCollabWs = () => {};
    if (userProfile && userProfile.userId) {
      const collabWsQuery = query(
        collection(db, 'workspaces'),
        where('collaborators', 'array-contains', userProfile.userId)
      );
      unsubscribeCollabWs = onSnapshot(collabWsQuery, (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        setCollaboratedWorkspaces(list);
      }, (err) => {
        console.error("Error listening to collaborated workspaces:", err);
      });
    }

    // F. Listen to notifications
    const notifQuery = query(collection(db, 'notifications'), where('userId', '==', uid));
    const unsubscribeNotif = onSnapshot(notifQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setNotifications(list);
    });

    // G. Listen to friendships (friends collection)
    const friendsQuery = query(collection(db, 'friends'), where('uids', 'array-contains', uid));
    const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
      const friendList = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const friendUserId = data.userIds.find(id => id !== userProfile.userId);
        if (friendUserId) friendList.push(friendUserId);
      });
      setFriends(friendList);
    });

    // H. Listen to sent friend requests (to maintain sentRequests state)
    const sentReqsQuery = query(
      collection(db, 'friendRequests'), 
      where('senderUid', '==', uid), 
      where('status', '==', 'pending')
    );
    const unsubscribeSentReqs = onSnapshot(sentReqsQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data().receiverUserId);
      });
      setSentRequests(list);
    });

    // I. Listen to active chats and their messages subcollections
    const chatsQuery = query(collection(db, 'chats'), where('uids', 'array-contains', uid));
    const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
      snapshot.forEach((chatDoc) => {
        const chatData = chatDoc.data();
        const chatRoomId = chatDoc.id;
        const friendUserId = chatData.userIds.find(id => id !== userProfile.userId);
        if (!friendUserId) return;

        if (!msgListenersRef.current[chatRoomId]) {
          const msgQuery = query(
            collection(db, `chats/${chatRoomId}/messages`), 
            orderBy('timestamp', 'asc')
          );
          msgListenersRef.current[chatRoomId] = onSnapshot(msgQuery, (msgSnapshot) => {
            const msgs = [];
            const batch = writeBatch(db);
            let hasDeliveryUpdate = false;

            msgSnapshot.forEach((mDoc) => {
              const data = mDoc.data();
              const msgId = mDoc.id;

              // Mark as delivered if received by us but marked as 'sent'
              if (data.senderId !== userProfile.userId && data.status === 'sent') {
                batch.update(doc(db, `chats/${chatRoomId}/messages`, msgId), { status: 'delivered' });
                hasDeliveryUpdate = true;
                data.status = 'delivered';
              }

              msgs.push({ id: msgId, ...data });
            });

            if (hasDeliveryUpdate) {
              batch.commit().catch(err => console.error("Error setting delivered status:", err));
            }

            setChats(prev => ({
              ...prev,
              [friendUserId]: msgs
            }));
          });
        }
      });
    });

    // J. Listen to presence
    const presenceQuery = collection(db, 'presence');
    const unsubscribePresence = onSnapshot(presenceQuery, (snapshot) => {
      const states = {};
      snapshot.forEach((docSnap) => {
        states[docSnap.id] = docSnap.data();
      });
      setPresenceStates(states);
    });

    // K. Listen to typing status
    const typingQuery = collection(db, 'typingStatus');
    const unsubscribeTyping = onSnapshot(typingQuery, (snapshot) => {
      const states = {};
      snapshot.forEach((docSnap) => {
        states[docSnap.id] = docSnap.data();
      });
      setTypingStates(states);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeExams();
      unsubscribeAssign();
      unsubscribeWs();
      unsubscribeCollabWs();
      unsubscribeNotif();
      unsubscribeFriends();
      unsubscribeSentReqs();
      unsubscribeChats();
      unsubscribePresence();
      unsubscribeTyping();
      // Clean up message listeners
      Object.values(msgListenersRef.current).forEach((unsub) => unsub());
      msgListenersRef.current = {};
      // Clean up workspace tasks listeners
      Object.values(wsTasksListenersRef.current).forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
      wsTasksListenersRef.current = {};
    };
  }, [currentUser, userProfile]);

  // Trigger badge updates in Firestore based on actual user metrics
  useEffect(() => {
    if (!currentUser || !userProfile) return;
    
    const unlockedBadges = [];
    const xp = userProfile.xp || 0;
    const streak = userProfile.streak || 0;
    const totalCompletedTasks = tasks.filter(t => t.done).length;
    const workspaceCount = workspaces.length;
    const completedFocusTasks = tasks.filter(t => t.isPinned && t.done).length;
    const completedHtmlTasks = tasks.filter(t => t.done && t.text.toLowerCase().includes('html')).length;
    
    // Check ranking
    const leaderboardList = [...allUsers].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    const myIndex = leaderboardList.findIndex(u => u.userId === userProfile.userId);
    const rank = (xp > 0 && myIndex !== -1) ? myIndex + 1 : null;
    
    if (rank === 1) unlockedBadges.push('🥇');
    if (streak >= 7) unlockedBadges.push('🔥');
    if (xp >= 25000) unlockedBadges.push('💎');
    if (completedHtmlTasks > 0) unlockedBadges.push('📚');
    if (workspaceCount >= 1) unlockedBadges.push('🚀');
    if (completedFocusTasks >= 1) unlockedBadges.push('🎯');
    
    // Check if the badges in the DB match the computed list
    const currentBadges = userProfile.badges || [];
    const isDifferent = unlockedBadges.length !== currentBadges.length || 
                        unlockedBadges.some(b => !currentBadges.includes(b));
                        
    if (isDifferent) {
      const updateBadges = async () => {
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            badges: unlockedBadges
          });
        } catch (err) {
          console.error("Error updating user badges:", err);
        }
      };
      updateBadges();
    }
  }, [currentUser, userProfile?.xp, userProfile?.streak, tasks, workspaces, allUsers]);



  // Wrapper for setUserProfile to write back to Firestore and Leaderboards
  const setUserProfileWrapper = async (updateArg) => {
    if (!currentUser || !userProfile) return;
    let updated;
    if (typeof updateArg === 'function') {
      updated = updateArg(userProfile);
    } else {
      updated = updateArg;
    }
    
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, updated, { merge: true });

    // Also update leaderboard entry
    const lbDocRef = doc(db, 'leaderboards', updated.userId || userProfile.userId);
    await setDoc(lbDocRef, {
      userId: updated.userId || userProfile.userId,
      fullName: updated.fullName || userProfile.fullName,
      username: updated.username || userProfile.username,
      university: updated.university || userProfile.university,
      xp: updated.xp !== undefined ? updated.xp : (userProfile.xp || 0),
      streak: updated.streak !== undefined ? updated.streak : (userProfile.streak || 0),
      tasksCompleted: tasks.filter(t => t.done).length,
      workspaceCompleted: workspaces.filter(w => w.progress === 100).length,
      profilePicture: updated.profilePicture || userProfile.profilePicture
    }, { merge: true });
  };

  // ================= TASK OPERATIONS =================
  const addTask = async (task) => {
    if (!currentUser) return;
    const taskId = `task-${Date.now()}`;
    const newTask = {
      userId: currentUser.uid,
      text: task.text || '',
      done: false,
      priority: task.priority || 'Low',
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || '',
      progress: 0,
      isPinned: task.isPinned || false,
      workspaceId: task.workspaceId || null,
      recurring: task.recurring || 'None',
      completedAt: null,
      colorCategory: task.colorCategory || 'yellow'
    };
    if (newTask.colorCategory === 'yellow') {
      newTask.dueDate = todayStr;
      newTask.dueTime = '';
    }
    
    await setDoc(doc(db, 'tasks', taskId), newTask);
    
    if (newTask.workspaceId === null && newTask.isPinned) {
      await setDoc(doc(db, 'focusTasks', taskId), newTask);
    }
  };

  const editTask = async (id, updatedFields) => {
    if (!currentUser) return;
    const taskRef = doc(db, 'tasks', id);
    const mergedFields = { ...updatedFields };
    if (mergedFields.colorCategory === 'yellow') {
      mergedFields.dueDate = todayStr;
      mergedFields.dueTime = '';
    }
    await updateDoc(taskRef, mergedFields);
    
    const taskSnap = await getDoc(taskRef);
    if (taskSnap.exists()) {
      const taskData = taskSnap.data();
      if (taskData.workspaceId === null && taskData.isPinned) {
        await setDoc(doc(db, 'focusTasks', id), taskData);
      } else {
        await deleteDoc(doc(db, 'focusTasks', id));
      }
    }
  };

  const deleteTask = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'tasks', id));
    await deleteDoc(doc(db, 'focusTasks', id));
  };

  const toggleTask = async (id) => {
    if (!currentUser) return;
    const taskRef = doc(db, 'tasks', id);
    const taskSnap = await getDoc(taskRef);
    if (taskSnap.exists()) {
      const task = taskSnap.data();
      const nextDone = !task.done;
      const updated = {
        done: nextDone,
        progress: nextDone ? 100 : 0,
        completedAt: nextDone ? new Date().toISOString() : null
      };
      await updateDoc(taskRef, updated);
      
      if (task.workspaceId === null && task.isPinned) {
        await updateDoc(doc(db, 'focusTasks', id), updated);
      }

      if (nextDone) {
        await logProductiveActivity('task');
        if (task.isPinned && task.workspaceId === null) {
          await logProductiveActivity('focusTask');
        }
      } else {
        if (userProfile) {
          const newXp = Math.max(0, (userProfile.xp || 0) - 15);
          await updateDoc(doc(db, 'users', currentUser.uid), { xp: newXp });
          if (userProfile.userId) {
            await setDoc(doc(db, 'leaderboards', userProfile.userId), { xp: newXp }, { merge: true });
          }
        }
      }
    }
  };

  const togglePin = async (id) => {
    if (!currentUser) return;
    const taskRef = doc(db, 'tasks', id);
    const taskSnap = await getDoc(taskRef);
    if (taskSnap.exists()) {
      const task = taskSnap.data();
      if (!task.isPinned) {
        const pinnedCount = tasks.filter((t) => t.isPinned && !t.workspaceId && !t.done).length;
        if (pinnedCount >= 6) return;
      }
      const updatedPinned = !task.isPinned;
      await updateDoc(taskRef, { isPinned: updatedPinned });
      
      if (task.workspaceId === null) {
        if (updatedPinned) {
          await setDoc(doc(db, 'focusTasks', id), { ...task, isPinned: true });
        } else {
          await deleteDoc(doc(db, 'focusTasks', id));
        }
      }
    }
  };

  // ================= EXAM OPERATIONS =================
  const addExam = async (exam) => {
    if (!currentUser) return;
    const examId = `exam-${Date.now()}`;
    const newExam = {
      userId: currentUser.uid,
      name: exam.name || '',
      subject: exam.subject || '',
      date: exam.date || '',
      status: 'Pending',
      prepProgress: exam.prepProgress || 0
    };
    await setDoc(doc(db, 'exams', examId), newExam);
  };

  const editExam = async (id, updatedFields) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'exams', id), updatedFields);
  };

  const deleteExam = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'exams', id));
  };

  const toggleExam = async (id) => {
    if (!currentUser) return;
    const examRef = doc(db, 'exams', id);
    const examSnap = await getDoc(examRef);
    if (examSnap.exists()) {
      const exam = examSnap.data();
      const isCompleting = exam.status !== 'Completed';
      await updateDoc(examRef, {
        status: isCompleting ? 'Completed' : 'Pending'
      });

      if (isCompleting) {
        await logProductiveActivity('exam');
      } else {
        if (userProfile) {
          const newXp = Math.max(0, (userProfile.xp || 0) - 15);
          await updateDoc(doc(db, 'users', currentUser.uid), { xp: newXp });
          if (userProfile.userId) {
            await setDoc(doc(db, 'leaderboards', userProfile.userId), { xp: newXp }, { merge: true });
          }
        }
      }
    }
  };

  // ================= ASSIGNMENT OPERATIONS =================
  const addAssignment = async (assign) => {
    if (!currentUser) return;
    const assignId = `assign-${Date.now()}`;
    const newAssign = {
      userId: currentUser.uid,
      name: assign.name || '',
      subject: assign.subject || '',
      dueDate: assign.dueDate || '',
      status: 'Pending',
      progress: assign.progress || 0
    };
    await setDoc(doc(db, 'assignments', assignId), newAssign);
  };

  const editAssignment = async (id, updatedFields) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'assignments', id), updatedFields);
  };

  const deleteAssignment = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'assignments', id));
  };

  const toggleAssignment = async (id) => {
    if (!currentUser) return;
    const assignRef = doc(db, 'assignments', id);
    const assignSnap = await getDoc(assignRef);
    if (assignSnap.exists()) {
      const assign = assignSnap.data();
      const isSubmitting = assign.status !== 'Submitted';
      await updateDoc(assignRef, {
        status: isSubmitting ? 'Submitted' : 'Pending',
        progress: isSubmitting ? 100 : 0
      });

      if (isSubmitting) {
        await logProductiveActivity('assignment');
      } else {
        if (userProfile) {
          const newXp = Math.max(0, (userProfile.xp || 0) - 15);
          await updateDoc(doc(db, 'users', currentUser.uid), { xp: newXp });
          if (userProfile.userId) {
            await setDoc(doc(db, 'leaderboards', userProfile.userId), { xp: newXp }, { merge: true });
          }
        }
      }
    }
  };

  // ================= WORKSPACE CRUD OPERATIONS =================
  const addWorkspace = async (workspace) => {
    if (!currentUser || !userProfile) return;
    const wsId = workspace.id || `ws-${Date.now()}`;
    const newWorkspace = {
      ownerId: currentUser.uid,
      title: workspace.title || '',
      description: workspace.description || '',
      tag: workspace.tag || '',
      progress: 0,
      streak: 0,
      isPublic: workspace.isPublic || false,
      icon: workspace.icon || 'folder',
      bannerImage: workspace.bannerImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      colorTheme: workspace.colorTheme || 'primary',
      category: workspace.category || 'Learning',
      roadmaps: workspace.roadmaps || [],
      notes: workspace.notes || '### Workspace Notes',
      resources: workspace.resources || [],
      projects: workspace.projects || [],
      milestones: workspace.milestones || [],
      collaborators: workspace.collaborators || []
    };
    await setDoc(doc(db, 'workspaces', wsId), newWorkspace);

    const featured = userProfile.featuredWorkspaces || [];
    await updateDoc(doc(db, 'users', currentUser.uid), {
      featuredWorkspaces: [wsId, ...featured]
    });
  };

  const updateWorkspace = async (wsId, updatedFields) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'workspaces', wsId), updatedFields);
  };

  const deleteWorkspace = async (wsId) => {
    if (!currentUser || !userProfile) return;

    const batch = writeBatch(db);

    // 1. Delete workspace doc
    batch.delete(doc(db, 'workspaces', wsId));

    // 2. Remove from user featured workspaces
    if (userProfile.featuredWorkspaces) {
      const featured = userProfile.featuredWorkspaces.filter(id => id !== wsId);
      batch.update(doc(db, 'users', currentUser.uid), {
        featuredWorkspaces: featured
      });
    }

    // 3. Delete tasks associated with workspace
    const tasksQuery = query(collection(db, 'tasks'), where('workspaceId', '==', wsId));
    const tasksSnap = await getDocs(tasksQuery);
    tasksSnap.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });

    // 4. Delete collaboration links (collaborators collection doc)
    batch.delete(doc(db, 'collaborators', wsId));

    // 5. Delete invites / notifications
    const notifsQuery = query(collection(db, 'notifications'), where('meta.workspaceId', '==', wsId));
    const notifsSnap = await getDocs(notifsQuery);
    notifsSnap.forEach((notifDoc) => {
      batch.delete(notifDoc.ref);
    });

    await batch.commit();
  };

  const toggleSubtopic = async (wsId, roadmapId, topicId, subtopicId) => {
    if (!currentUser) return;
    const wsRef = doc(db, 'workspaces', wsId);
    const wsSnap = await getDoc(wsRef);
    if (wsSnap.exists()) {
      const ws = wsSnap.data();
      let wasDone = false;
      const originalRm = (ws.roadmaps || []).find(rm => rm.id === roadmapId);
      if (originalRm) {
        const originalT = (originalRm.topics || []).find(t => t.id === topicId);
        if (originalT) {
          const originalSt = (originalT.subtopics || []).find(st => st.id === subtopicId);
          if (originalSt) {
            wasDone = originalSt.done;
          }
        }
      }
      const isNowDone = !wasDone;
      const xpChange = isNowDone ? 10 : -10;

      const updatedRoadmaps = (ws.roadmaps || []).map((rm) => {
        if (rm.id !== roadmapId) return rm;

        const updatedTopics = (rm.topics || []).map((t) => {
          if (t.id !== topicId) return t;

          const updatedSubtopics = (t.subtopics || []).map((st) => {
            if (st.id !== subtopicId) return st;
            return { ...st, done: isNowDone };
          });

          return { ...t, subtopics: updatedSubtopics };
        });

        return { ...rm, topics: updatedTopics };
      });

      let totalSubtopics = 0;
      let completedSubtopics = 0;

      updatedRoadmaps.forEach((rm) => {
        (rm.topics || []).forEach((t) => {
          (t.subtopics || []).forEach((st) => {
            totalSubtopics++;
            if (st.done) completedSubtopics++;
          });
        });
      });

      const overallProgress = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

      await updateDoc(wsRef, {
        roadmaps: updatedRoadmaps,
        progress: overallProgress
      });

      if (isNowDone) {
        await logProductiveActivity('subtopic');
        // Check if all subtopics of this topic are completed
        const originalRm = (ws.roadmaps || []).find(rm => rm.id === roadmapId);
        if (originalRm) {
          const originalT = (originalRm.topics || []).find(t => t.id === topicId);
          if (originalT) {
            const updatedSubtopics = (originalT.subtopics || []).map((st) => {
              if (st.id === subtopicId) return { ...st, done: true };
              return st;
            });
            if (updatedSubtopics.every(st => st.done)) {
              await logProductiveActivity('topic');
            }
          }
        }
      } else {
        if (userProfile) {
          const newXp = Math.max(0, (userProfile.xp || 0) - 10);
          await updateDoc(doc(db, 'users', currentUser.uid), { xp: newXp });
          if (userProfile.userId) {
            await setDoc(doc(db, 'leaderboards', userProfile.userId), { xp: newXp }, { merge: true });
          }
        }
      }
    }
  };

  // ================= FOLLOW / SOCIAL OPERATIONS =================
  const sendFollowRequest = async (targetId) => {
    if (!currentUser || !userProfile) return;
    const targetUser = allUsers.find(u => u.userId === targetId);
    if (!targetUser) return;
    const targetUid = targetUser.uid;

    if (sentRequests.includes(targetId) || friends.includes(targetId)) return;

    const reqId = `req_${currentUser.uid}_${targetUid}`;
    await setDoc(doc(db, 'friendRequests', reqId), {
      senderUid: currentUser.uid,
      senderUserId: userProfile.userId,
      senderName: userProfile.fullName,
      receiverUid: targetUid,
      receiverUserId: targetId,
      status: 'pending',
      timestamp: new Date().toISOString()
    });

    await addDoc(collection(db, 'notifications'), {
      userId: targetUid,
      text: `Friend request from ${userProfile.fullName}.`,
      type: 'Friends',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { senderId: userProfile.userId, isFriendRequest: true, requestDocId: reqId }
    });

    const sentNotifId = `notif-sent-${Date.now()}`;
    await setDoc(doc(db, 'notifications', sentNotifId), {
      userId: currentUser.uid,
      text: `Follow request sent to ${targetUser.fullName}.`,
      type: 'Friends',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { senderId: targetId }
    });
  };

  const acceptFollowRequest = async (notifId) => {
    if (!currentUser || !userProfile) return;
    const notif = notifications.find((n) => n.id === notifId);
    if (!notif) return;
    
    const senderUserId = notif.meta.senderId;
    const senderUser = allUsers.find(u => u.userId === senderUserId);
    if (!senderUser) return;
    const senderUid = senderUser.uid;

    await deleteDoc(doc(db, 'notifications', notifId));

    const friendshipId = [currentUser.uid, senderUid].sort().join('_');
    await setDoc(doc(db, 'friends', friendshipId), {
      uids: [currentUser.uid, senderUid],
      userIds: [userProfile.userId, senderUserId].sort(),
      timestamp: new Date().toISOString()
    });

    const reqId = `req_${senderUid}_${currentUser.uid}`;
    await deleteDoc(doc(db, 'friendRequests', reqId));

    await addDoc(collection(db, 'notifications'), {
      userId: senderUid,
      text: `${userProfile.fullName} accepted your follow request.`,
      type: 'Friends',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { senderId: userProfile.userId }
    });

    const accNotifId = `notif-acc-${Date.now()}`;
    await setDoc(doc(db, 'notifications', accNotifId), {
      userId: currentUser.uid,
      text: `You accepted ${senderUser.fullName}'s follow request.`,
      type: 'Friends',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { senderId: senderUserId }
    });
  };

  const rejectFollowRequest = async (notifId) => {
    if (!currentUser) return;
    const notif = notifications.find((n) => n.id === notifId);
    if (!notif) return;

    const senderUserId = notif.meta.senderId;
    const senderUser = allUsers.find(u => u.userId === senderUserId);
    if (senderUser) {
      const reqId = `req_${senderUser.uid}_${currentUser.uid}`;
      await deleteDoc(doc(db, 'friendRequests', reqId));
    }

    await deleteDoc(doc(db, 'notifications', notifId));
  };

  const unfollowFriend = async (friendUserId) => {
    if (!currentUser || !userProfile) return;
    const friendUser = allUsers.find(u => u.userId === friendUserId);
    if (!friendUser) return;

    const friendshipId = [currentUser.uid, friendUser.uid].sort().join('_');
    await deleteDoc(doc(db, 'friends', friendshipId));

    const reqId1 = `req_${currentUser.uid}_${friendUser.uid}`;
    const reqId2 = `req_${friendUser.uid}_${currentUser.uid}`;
    await deleteDoc(doc(db, 'friendRequests', reqId1));
    await deleteDoc(doc(db, 'friendRequests', reqId2));
  };

  // ================= CHAT OPERATIONS =================
  const sendChatMessage = async (friendUserId, text, type = 'text', payload = null, replyTo = null) => {
    if (!currentUser || !userProfile) return;
    const friendUser = allUsers.find(u => u.userId === friendUserId);
    if (!friendUser) return;

    const chatRoomId = [userProfile.userId, friendUserId].sort().join('_');

    await setDoc(doc(db, 'chats', chatRoomId), {
      userIds: [userProfile.userId, friendUserId].sort(),
      uids: [currentUser.uid, friendUser.uid].sort(),
      lastMessage: text,
      lastMessageTimestamp: new Date().toISOString()
    }, { merge: true });

    const msgId = `msg-${Date.now()}`;
    const newMsg = {
      senderId: userProfile.userId,
      senderUserId: userProfile.userId,
      text,
      timestamp: new Date().toISOString(),
      seen: false,
      status: 'sent',
      reactions: [],
      type,
      payload,
      replyTo
    };
    await setDoc(doc(db, `chats/${chatRoomId}/messages`, msgId), newMsg);
  };

  const markMessagesAsSeen = async (friendUserId) => {
    if (!currentUser || !userProfile || !userProfile.userId) return;
    const chatRoomId = [userProfile.userId, friendUserId].sort().join('_');
    const friendMessages = chats[friendUserId] || [];
    
    // Find all messages from the friend that are not 'seen'
    const unseenMsgs = friendMessages.filter(
      (msg) => msg.senderId !== userProfile.userId && msg.status !== 'seen'
    );
    
    if (unseenMsgs.length > 0) {
      try {
        const batch = writeBatch(db);
        unseenMsgs.forEach((msg) => {
          batch.update(doc(db, `chats/${chatRoomId}/messages`, msg.id), { 
            status: 'seen', 
            seen: true 
          });
        });
        await batch.commit();
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    }
  };

  const setMyTypingStatus = async (isTyping) => {
    if (!currentUser || !userProfile || !userProfile.userId) return;
    try {
      const typingRef = doc(db, 'typingStatus', userProfile.userId);
      await setDoc(typingRef, {
        typing: isTyping,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error setting typing status:", err);
    }
  };

  const addChatReaction = async (friendUserId, msgIndex, reaction) => {
    if (!currentUser || !userProfile) return;
    const friendMessages = chats[friendUserId] || [];
    const targetMsg = friendMessages[msgIndex];
    if (!targetMsg || !targetMsg.id) return;

    const chatRoomId = [userProfile.userId, friendUserId].sort().join('_');
    const msgRef = doc(db, `chats/${chatRoomId}/messages`, targetMsg.id);
    const msgSnap = await getDoc(msgRef);
    if (msgSnap.exists()) {
      const msg = msgSnap.data();
      const reactions = msg.reactions || [];
      const updatedReactions = reactions.includes(reaction)
        ? reactions.filter(r => r !== reaction)
        : [...reactions, reaction];
      await updateDoc(msgRef, { reactions: updatedReactions });
    }
  };

  // ================= COLLABORATION OPERATIONS =================
  const inviteCollaborator = async (workspaceId, friendUserId, role = 'Editor') => {
    if (!currentUser || !userProfile) return;
    const friendUser = allUsers.find(u => u.userId === friendUserId);
    if (!friendUser) return;

    const list = collaborators[workspaceId] || [];
    if (list.some(c => c.userId === friendUserId)) return;

    const collabRef = doc(db, 'collaborators', workspaceId);
    await setDoc(collabRef, {
      workspaceId,
      users: [...list, { userId: friendUserId, role }]
    }, { merge: true });

    const wsRef = doc(db, 'workspaces', workspaceId);
    const wsSnap = await getDoc(wsRef);
    const wsTitle = wsSnap.exists() ? wsSnap.data().title : 'Workspace';

    await addDoc(collection(db, 'notifications'), {
      userId: friendUser.uid,
      text: `Collaboration invite for workspace: ${wsTitle}.`,
      type: 'Workspace',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { workspaceId, role, senderName: userProfile.fullName, isCollabRequest: true }
    });

    const inviteNotifId = `notif-invite-${Date.now()}`;
    await setDoc(doc(db, 'notifications', inviteNotifId), {
      userId: currentUser.uid,
      text: `Collaboration invite sent to ${friendUser.fullName}.`,
      type: 'Workspace',
      read: false,
      timestamp: new Date().toISOString(),
      meta: { workspaceId, role }
    });
  };

  const acceptCollaborationInvite = async (notifId) => {
    if (!currentUser || !userProfile) return;
    const notif = notifications.find(n => n.id === notifId);
    if (!notif) return;
    const wsId = notif.meta.workspaceId;
    const role = notif.meta.role;

    await deleteDoc(doc(db, 'notifications', notifId));

    const collabRef = doc(db, 'collaborators', wsId);
    const collabSnap = await getDoc(collabRef);
    const list = collabSnap.exists() ? (collabSnap.data().users || []) : [];
    
    if (!list.some(c => c.userId === userProfile.userId)) {
      await setDoc(collabRef, {
        workspaceId: wsId,
        users: [...list, { userId: userProfile.userId, role }]
      }, { merge: true });
    }

    // Add collaborator userId to the workspace document itself
    const wsRef = doc(db, 'workspaces', wsId);
    const wsSnap = await getDoc(wsRef);
    if (wsSnap.exists()) {
      const wsData = wsSnap.data();
      const currentCollabs = wsData.collaborators || [];
      if (!currentCollabs.includes(userProfile.userId)) {
        await updateDoc(wsRef, {
          collaborators: [...currentCollabs, userProfile.userId]
        });
      }
    }

    const joinNotifId = `notif-joined-${Date.now()}`;
    await setDoc(doc(db, 'notifications', joinNotifId), {
      userId: currentUser.uid,
      text: 'You joined a workspace collaboration successfully.',
      type: 'Workspace',
      read: false,
      timestamp: new Date().toISOString(),
      meta: {}
    });
  };

  const rejectCollaborationInvite = async (notifId) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'notifications', notifId));
  };

  const removeCollaborator = async (workspaceId, collabUserId) => {
    if (!currentUser) return;
    try {
      // 1. Remove from the workspace document's collaborators array
      const wsRef = doc(db, 'workspaces', workspaceId);
      const wsSnap = await getDoc(wsRef);
      if (wsSnap.exists()) {
        const wsData = wsSnap.data();
        const collaboratorsArray = wsData.collaborators || [];
        const updatedCollaborators = collaboratorsArray.filter(uid => uid !== collabUserId);
        await updateDoc(wsRef, {
          collaborators: updatedCollaborators
        });
      }

      // 2. Remove from the collaborators collection document's users list
      const collabRef = doc(db, 'collaborators', workspaceId);
      const collabSnap = await getDoc(collabRef);
      if (collabSnap.exists()) {
        const collabData = collabSnap.data();
        const usersList = collabData.users || [];
        const updatedUsers = usersList.filter(u => u.userId !== collabUserId);
        await updateDoc(collabRef, {
          users: updatedUsers
        });
      }

      // 3. Send a notification to the removed collaborator
      const removedUser = allUsers.find(u => u.userId === collabUserId);
      if (removedUser) {
        const removeNotifId = `notif-remove-${Date.now()}`;
        await setDoc(doc(db, 'notifications', removeNotifId), {
          userId: removedUser.uid,
          text: `You have been removed from the collaboration on workspace: ${wsSnap.exists() ? wsSnap.data().title : 'Workspace'}.`,
          type: 'Workspace',
          read: false,
          timestamp: new Date().toISOString(),
          meta: { workspaceId }
        });
      }
    } catch (err) {
      console.error("Error removing collaborator:", err);
    }
  };

  // ================= NOTIFICATION UTILITIES =================
  const markNotificationRead = async (notifId) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      if (!n.read) {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      }
    });
    await batch.commit();
  };

  const deleteNotification = async (notifId) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'notifications', notifId));
  };

  // ================= NOTIFICATION ENGINE COMBINED GETTER =================
  const getNotifications = () => {
    const list = [...notifications];

    exams.forEach((exam) => {
      if (exam.status !== 'Completed' && exam.date === tomorrowStr) {
        if (!list.some((n) => n.id === `alert-exam-${exam.id}`)) {
          list.push({
            id: `alert-exam-${exam.id}`,
            text: `${exam.name} starts tomorrow.`,
            type: 'Exams',
            read: false,
            timestamp: new Date().toISOString(),
            time: 'Exam Tomorrow'
          });
        }
      }
    });

    assignments.forEach((assign) => {
      if (assign.status !== 'Submitted' && assign.dueDate === tomorrowStr) {
        if (!list.some((n) => n.id === `alert-assign-${assign.id}`)) {
          list.push({
            id: `alert-assign-${assign.id}`,
            text: `${assign.name} due in 12 hours.`,
            type: 'Assignments',
            read: false,
            timestamp: new Date().toISOString(),
            time: 'Due Tomorrow'
          });
        }
      }
    });

    tasks.forEach((task) => {
      if (!task.done && !task.workspaceId && task.dueDate && task.dueDate < todayStr) {
        if (!list.some((n) => n.id === `alert-task-od-${task.id}`)) {
          list.push({
            id: `alert-task-od-${task.id}`,
            text: `Focus task "${task.text}" is overdue.`,
            type: 'Tasks',
            read: false,
            timestamp: new Date().toISOString(),
            time: 'Overdue'
          });
        }
      }
    });

    tasks.forEach((task) => {
      if (!task.done && task.workspaceId && task.dueDate && task.dueDate < todayStr) {
        if (!list.some((n) => n.id === `alert-ws-task-od-${task.id}`)) {
          list.push({
            id: `alert-ws-task-od-${task.id}`,
            text: `Workspace task "${task.text}" deadline is approaching.`,
            type: 'Workspace',
            read: false,
            timestamp: new Date().toISOString(),
            time: 'Overdue'
          });
        }
      }
    });

    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const initializeUserCollections = async (selectedPresetIds, customWorkspaceNames, profileData) => {
    if (!currentUser) return;
    const uid = currentUser.uid;

    const cleanedProfile = {
      ...profileData,
      xp: 0,
      streak: 0,
      connections: 0,
      workspaces: 0,
      todos: 0,
      activityHistory: {},
      badges: [],
      featuredWorkspaces: []
    };

    // 1. Save user profile doc in Firestore
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, cleanedProfile);

    // 2. Save leaderboard entry
    const lbDocRef = doc(db, 'leaderboards', profileData.userId);
    await setDoc(lbDocRef, {
      userId: profileData.userId,
      fullName: profileData.fullName,
      username: profileData.username,
      university: profileData.university,
      xp: 0,
      streak: 0,
      tasksCompleted: 0,
      workspaceCompleted: 0,
      profilePicture: profileData.profilePicture
    });
  };

  return (
    <TaskContext.Provider
      value={{
        currentUser,
        loading,
        isOnboarded,
        userProfile,
        setUserProfile: setUserProfileWrapper,
        logout,
        userId: userProfile?.userId || '',
        initializeUserCollections,
        tasks,
        exams,
        assignments,
        workspaces,
        allUsers,
        friends,
        sentRequests,
        chats,
        collaborators,
        collaboratedWorkspaces,
        presenceStates,
        typingStates,
        setMyTypingStatus,
        markMessagesAsSeen,
        privacySettings,
        setPrivacySettings,
        addTask,
        editTask,
        deleteTask,
        toggleTask,
        togglePin,
        addExam,
        editExam,
        deleteExam,
        toggleExam,
        addAssignment,
        editAssignment,
        deleteAssignment,
        toggleAssignment,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        toggleSubtopic,
        sendFollowRequest,
        acceptFollowRequest,
        rejectFollowRequest,
        unfollowFriend,
        sendChatMessage,
        addChatReaction,
        inviteCollaborator,
        acceptCollaborationInvite,
        rejectCollaborationInvite,
        removeCollaborator,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        getNotifications,
        logProductiveActivity
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
