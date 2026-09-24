// Central Data Store for SQL Default 11-Track Master Roadmap & Curated Resources

export const SQL_DEFAULT_ROADMAP_DATA = {
  id: "sql-master-roadmap",
  title: "SQL Master Learning Roadmap",
  subtitle: "Master databases, query filtering, aggregations, joins, subqueries, window functions, and real-world analytics",
  category: "SQL",
  icon: "database",
  tracks: [
    {
      id: "sql-track-1",
      number: 1,
      title: "SQL Foundations",
      badge: "Foundations",
      desc: "Master core database concepts, SELECT statements, WHERE clauses, filtering, ordering, and pattern matching.",
      topics: [
        {
          id: "sql-t1-top1",
          name: "Database & SQL Fundamentals",
          subtopics: ["What is a database?", "DBMS vs RDBMS", "Tables, rows & columns", "Primary Key basics", "Basic SQL syntax structure"]
        },
        {
          id: "sql-t1-top2",
          name: "SELECT Basics",
          subtopics: ["SELECT statement", "Selecting specific columns", "Selecting all columns (*)", "Column Aliases (AS)", "Basic expressions"]
        },
        {
          id: "sql-t1-top3",
          name: "FROM and Table Selection",
          subtopics: ["Specifying target tables", "Table Aliases", "Database schema qualification"]
        },
        {
          id: "sql-t1-top4",
          name: "WHERE Filtering",
          subtopics: ["Filtering row conditions", "Execution order of WHERE", "Text vs numeric filtering"]
        },
        {
          id: "sql-t1-top5",
          name: "Comparison Operators",
          subtopics: ["Equal (=)", "Not Equal (!= or <>)", "Greater Than (>)", "Less Than (<)", "Greater/Equal (>=)", "Less/Equal (<=)"]
        },
        {
          id: "sql-t1-top6",
          name: "Logical Operators",
          subtopics: ["AND operator", "OR operator", "NOT operator", "Combining logical expressions", "Operator precedence"]
        },
        {
          id: "sql-t1-top7",
          name: "IN / BETWEEN",
          subtopics: ["IN operator for lists", "NOT IN operator", "BETWEEN range filtering", "Date and number ranges"]
        },
        {
          id: "sql-t1-top8",
          name: "LIKE and Pattern Matching",
          subtopics: ["Percent (%) wildcard", "Underscore (_) wildcard", "Case sensitivity in LIKE", "ILIKE (PostgreSQL)"]
        },
        {
          id: "sql-t1-top9",
          name: "NULL Handling",
          subtopics: ["Understanding NULL in SQL", "IS NULL", "IS NOT NULL", "COALESCE function", "NULLIF function"]
        },
        {
          id: "sql-t1-top10",
          name: "ORDER BY",
          subtopics: ["Ascending order (ASC)", "Descending order (DESC)", "Multi-column sorting", "Sorting by column position"]
        },
        {
          id: "sql-t1-top11",
          name: "LIMIT / OFFSET",
          subtopics: ["Restricting row counts", "OFFSET for pagination", "LIMIT vs TOP vs FETCH FIRST"]
        },
        {
          id: "sql-t1-top12",
          name: "DISTINCT",
          subtopics: ["Removing duplicate rows", "DISTINCT on single column", "DISTINCT on multiple columns"]
        }
      ]
    },
    {
      id: "sql-track-2",
      number: 2,
      title: "Aggregations",
      badge: "Aggregations",
      desc: "Summarize data using aggregate functions, group data by categories, and filter aggregated results.",
      topics: [
        {
          id: "sql-t2-top1",
          name: "COUNT",
          subtopics: ["COUNT(*)", "COUNT(column)", "COUNT(DISTINCT column)", "Handling NULLs in COUNT"]
        },
        {
          id: "sql-t2-top2",
          name: "SUM",
          subtopics: ["Totaling numeric columns", "SUM with WHERE filtering", "SUM with CASE expressions"]
        },
        {
          id: "sql-t2-top3",
          name: "AVG",
          subtopics: ["Calculating averages", "Handling NULL values in AVG", "Rounding average results"]
        },
        {
          id: "sql-t2-top4",
          name: "MIN / MAX",
          subtopics: ["Finding minimum values", "Finding maximum values", "MIN/MAX on dates and strings"]
        },
        {
          id: "sql-t2-top5",
          name: "GROUP BY",
          subtopics: ["Grouping rows by columns", "Multi-column GROUP BY", "SQL execution order with GROUP BY"]
        },
        {
          id: "sql-t2-top6",
          name: "HAVING",
          subtopics: ["Filtering aggregate results", "HAVING vs WHERE comparison", "Combining WHERE and HAVING"]
        },
        {
          id: "sql-t2-top7",
          name: "DISTINCT Counts",
          subtopics: ["Counting unique entities", "Performance considerations of COUNT(DISTINCT)"]
        }
      ]
    },
    {
      id: "sql-track-3",
      number: 3,
      title: "Joins",
      badge: "Joins",
      desc: "Combine data across multiple relational tables using primary/foreign key relationships.",
      topics: [
        {
          id: "sql-t3-top1",
          name: "Primary Key / Foreign Key Concepts",
          subtopics: ["Relational integrity", "Parent-child table relationships", "Foreign key constraints"]
        },
        {
          id: "sql-t3-top2",
          name: "INNER JOIN",
          subtopics: ["Matching records across tables", "ON clause syntax", "Filtering inside JOIN vs WHERE"]
        },
        {
          id: "sql-t3-top3",
          name: "LEFT JOIN",
          subtopics: ["Preserving left table rows", "Handling unmatched right rows (NULLs)", "Finding missing relationships"]
        },
        {
          id: "sql-t3-top4",
          name: "RIGHT JOIN",
          subtopics: ["Preserving right table rows", "Converting RIGHT JOIN to LEFT JOIN"]
        },
        {
          id: "sql-t3-top5",
          name: "FULL OUTER JOIN",
          subtopics: ["Combining all matched & unmatched rows", "Full relational audit queries"]
        },
        {
          id: "sql-t3-top6",
          name: "CROSS JOIN",
          subtopics: ["Cartesian product of tables", "Generating permutations & date matrices"]
        },
        {
          id: "sql-t3-top7",
          name: "Multi-table Joins",
          subtopics: ["Joining 3+ tables in sequence", "Complex ER diagram queries"]
        },
        {
          id: "sql-t3-top8",
          name: "Self JOIN",
          subtopics: ["Joining a table to itself", "Hierarchical data (Employee-Manager)", "Comparing rows in same table"]
        }
      ]
    },
    {
      id: "sql-track-4",
      number: 4,
      title: "Subqueries & CTEs",
      badge: "Subqueries",
      desc: "Construct modular, multi-step queries using inline subqueries, correlated subqueries, and Common Table Expressions (CTEs).",
      topics: [
        {
          id: "sql-t4-top1",
          name: "Subqueries",
          subtopics: ["Nested query concepts", "Single-value scalar subqueries", "Multi-row subqueries"]
        },
        {
          id: "sql-t4-top2",
          name: "Subqueries in WHERE",
          subtopics: ["IN subqueries", "Comparison subqueries", "ANY / ALL operators"]
        },
        {
          id: "sql-t4-top3",
          name: "Subqueries in FROM",
          subtopics: ["Derived tables", "Aliasing inline views", "Aggregating subquery output"]
        },
        {
          id: "sql-t4-top4",
          name: "Correlated Subqueries",
          subtopics: ["Outer query reference", "Row-by-row subquery evaluation", "Performance impact"]
        },
        {
          id: "sql-t4-top5",
          name: "EXISTS",
          subtopics: ["Existence checks", "Semi-joins with EXISTS", "EXISTS vs IN performance"]
        },
        {
          id: "sql-t4-top6",
          name: "NOT EXISTS",
          subtopics: ["Anti-joins with NOT EXISTS", "Finding non-matching records"]
        },
        {
          id: "sql-t4-top7",
          name: "CTEs (Common Table Expressions)",
          subtopics: ["WITH clause syntax", "Readable modular queries", "Reusing CTEs in main query"]
        },
        {
          id: "sql-t4-top8",
          name: "Multiple CTE Chains",
          subtopics: ["Chaining multiple WITH statements", "Refactoring complex queries into CTEs"]
        }
      ]
    },
    {
      id: "sql-track-5",
      number: 5,
      title: "Window Functions",
      badge: "Analytics",
      desc: "Perform calculations across set partitions without collapsing rows using window analytics.",
      topics: [
        {
          id: "sql-t5-top1",
          name: "Window Function Concept",
          subtopics: ["Window functions vs GROUP BY", "Preserving row detail while aggregating"]
        },
        {
          id: "sql-t5-top2",
          name: "OVER() Clause",
          subtopics: ["Defining execution windows", "Empty OVER() clause behavior"]
        },
        {
          id: "sql-t5-top3",
          name: "PARTITION BY",
          subtopics: ["Subdividing window partitions", "Partitioning by multiple columns"]
        },
        {
          id: "sql-t5-top4",
          name: "ORDER BY inside Windows",
          subtopics: ["Frame specification", "Cumulative window computation"]
        },
        {
          id: "sql-t5-top5",
          name: "ROW_NUMBER",
          subtopics: ["Sequential row numbering", "Deduplication using ROW_NUMBER"]
        },
        {
          id: "sql-t5-top6",
          name: "RANK",
          subtopics: ["Ranking with gaps for ties", "Top-N per group queries"]
        },
        {
          id: "sql-t5-top7",
          name: "DENSE_RANK",
          subtopics: ["Ranking without gaps for ties", "Finding Nth highest salaries"]
        },
        {
          id: "sql-t5-top8",
          name: "LAG",
          subtopics: ["Accessing previous row values", "Period-over-period growth calculation"]
        },
        {
          id: "sql-t5-top9",
          name: "LEAD",
          subtopics: ["Accessing subsequent row values", "Time between events analysis"]
        },
        {
          id: "sql-t5-top10",
          name: "Running Totals",
          subtopics: ["Cumulative SUM over time", "Moving averages calculation"]
        },
        {
          id: "sql-t5-top11",
          name: "Ranking Problems",
          subtopics: ["Solving LeetCode / StrataScratch ranking patterns"]
        }
      ]
    },
    {
      id: "sql-track-6",
      number: 6,
      title: "SQL Functions",
      badge: "Functions",
      desc: "Transform strings, apply conditional logic, and manipulate data using built-in SQL functions.",
      topics: [
        {
          id: "sql-t6-top1",
          name: "String Functions",
          subtopics: ["Overview of text manipulation functions across SQL dialects"]
        },
        {
          id: "sql-t6-top2",
          name: "CONCAT",
          subtopics: ["Combining string columns", "CONCAT_WS with separators", "String concatenation operators"]
        },
        {
          id: "sql-t6-top3",
          name: "SUBSTRING",
          subtopics: ["Extracting text segments", "SUBSTR / SUBSTRING positional arguments"]
        },
        {
          id: "sql-t6-top4",
          name: "TRIM",
          subtopics: ["TRIM", "LTRIM", "RTRIM", "Cleaning whitespace from user input"]
        },
        {
          id: "sql-t6-top5",
          name: "UPPER / LOWER",
          subtopics: ["Case conversion", "Case-insensitive text comparison"]
        },
        {
          id: "sql-t6-top6",
          name: "LENGTH",
          subtopics: ["Character count (LENGTH / LEN)", "Byte vs character length"]
        },
        {
          id: "sql-t6-top7",
          name: "REPLACE",
          subtopics: ["Replacing text patterns", "Data cleaning & sanitization"]
        },
        {
          id: "sql-t6-top8",
          name: "CASE Statements",
          subtopics: ["Simple CASE expression", "Searched CASE expression", "Creating conditional buckets"]
        },
        {
          id: "sql-t6-top9",
          name: "Nested CASE",
          subtopics: ["Multi-tier conditional logic", "Pivoting data using CASE + SUM"]
        }
      ]
    },
    {
      id: "sql-track-7",
      number: 7,
      title: "Date & Time",
      badge: "Date & Time",
      desc: "Filter, extract, manipulate, and analyze time-series data and temporal analytics.",
      topics: [
        {
          id: "sql-t7-top1",
          name: "Date Basics",
          subtopics: ["DATE, TIME, DATETIME, TIMESTAMP types", "CURRENT_DATE and CURRENT_TIMESTAMP"]
        },
        {
          id: "sql-t7-top2",
          name: "Date Filtering",
          subtopics: ["Filtering date ranges", "Relative date logic (Last 30 days)"]
        },
        {
          id: "sql-t7-top3",
          name: "Date Extraction",
          subtopics: ["EXTRACT(YEAR / MONTH / DAY)", "DATEPART functions"]
        },
        {
          id: "sql-t7-top4",
          name: "DATEADD / DATEDIFF",
          subtopics: ["Adding intervals to dates", "Calculating difference between timestamps"]
        },
        {
          id: "sql-t7-top5",
          name: "DATE_TRUNC / EXTRACT",
          subtopics: ["Truncating timestamps to Month/Week", "Grouping by time periods"]
        },
        {
          id: "sql-t7-top6",
          name: "Date-based Analysis",
          subtopics: ["Monthly revenue trends", "Daily active user counts"]
        },
        {
          id: "sql-t7-top7",
          name: "Cohort-style Analysis",
          subtopics: ["User retention cohorts", "First purchase date grouping"]
        }
      ]
    },
    {
      id: "sql-track-8",
      number: 8,
      title: "Database Design & Concepts",
      badge: "DDL & Design",
      desc: "Understand table schema creation, constraints, normalization, relationships, and data integrity.",
      topics: [
        {
          id: "sql-t8-top1",
          name: "Primary Keys",
          subtopics: ["SURROGATE keys", "NATURAL keys", "AUTO_INCREMENT / SERIAL / IDENTITY"]
        },
        {
          id: "sql-t8-top2",
          name: "Foreign Keys",
          subtopics: ["Enforcing referential integrity", "ON DELETE CASCADE / SET NULL"]
        },
        {
          id: "sql-t8-top3",
          name: "Constraints",
          subtopics: ["Overview of database integrity constraints"]
        },
        {
          id: "sql-t8-top4",
          name: "NOT NULL",
          subtopics: ["Mandatory data fields", "Adding NOT NULL to existing tables"]
        },
        {
          id: "sql-t8-top5",
          name: "UNIQUE",
          subtopics: ["Preventing duplicate values in non-primary columns"]
        },
        {
          id: "sql-t8-top6",
          name: "CHECK",
          subtopics: ["Validating column value bounds (e.g. age > 0)"]
        },
        {
          id: "sql-t8-top7",
          name: "DEFAULT",
          subtopics: ["Setting fallback default values on column creation"]
        },
        {
          id: "sql-t8-top8",
          name: "Normalization Basics",
          subtopics: ["1NF (First Normal Form)", "2NF (Second Normal Form)", "3NF (Third Normal Form)"]
        },
        {
          id: "sql-t8-top9",
          name: "Relationships",
          subtopics: ["One-to-One (1:1)", "One-to-Many (1:N)", "Many-to-Many (N:M) junction tables"]
        }
      ]
    },
    {
      id: "sql-track-9",
      number: 9,
      title: "Performance",
      badge: "Optimization",
      desc: "Optimize database queries using indexes, execution plans, and query performance tuning.",
      topics: [
        {
          id: "sql-t9-top1",
          name: "Indexing Fundamentals",
          subtopics: ["B-Tree index structure", "Index scan vs Sequential scan", "When indexes help vs hurt"]
        },
        {
          id: "sql-t9-top2",
          name: "CREATE INDEX",
          subtopics: ["CREATE INDEX syntax", "DROP INDEX", "Unique indexes"]
        },
        {
          id: "sql-t9-top3",
          name: "Composite Indexes",
          subtopics: ["Multi-column indexes", "Left-most prefix rule"]
        },
        {
          id: "sql-t9-top4",
          name: "Query Optimization Basics",
          subtopics: ["Avoiding SELECT *", "SARGable queries", "Subquery to JOIN refactoring"]
        },
        {
          id: "sql-t9-top5",
          name: "EXPLAIN / Query Plans",
          subtopics: ["EXPLAIN ANALYZE", "Reading cost metrics", "Identifying performance bottlenecks"]
        }
      ]
    },
    {
      id: "sql-track-10",
      number: 10,
      title: "Practice & Interview",
      badge: "Interviews",
      desc: "Master coding interview patterns, LeetCode SQL 50, StrataScratch, HackerRank, and top technical questions.",
      topics: [
        {
          id: "sql-t10-top1",
          name: "LeetCode SQL 50",
          subtopics: ["Solving curated LeetCode 50 SQL challenges"]
        },
        {
          id: "sql-t10-top2",
          name: "HackerRank SQL",
          subtopics: ["HackerRank domain challenges from Easy to Hard"]
        },
        {
          id: "sql-t10-top3",
          name: "StrataScratch",
          subtopics: ["Real interview questions from FAANG / Fortune 500"]
        },
        {
          id: "sql-t10-top4",
          name: "Interview SQL Patterns",
          subtopics: ["Categorizing core problem archetypes"]
        },
        {
          id: "sql-t10-top5",
          name: "Second Highest Salary",
          subtopics: ["Solving 2nd highest salary using OFFSET, Subqueries, & DENSE_RANK"]
        },
        {
          id: "sql-t10-top6",
          name: "Nth Highest Record",
          subtopics: ["Generic Nth record query pattern"]
        },
        {
          id: "sql-t10-top7",
          name: "Duplicate Detection",
          subtopics: ["Finding duplicates using HAVING COUNT(*) > 1", "Deleting duplicates"]
        },
        {
          id: "sql-t10-top8",
          name: "Ranking Problems",
          subtopics: ["Department top 3 earners", "Consecutive numbers"]
        },
        {
          id: "sql-t10-top9",
          name: "Real-world SQL Problems",
          subtopics: ["Complex multi-join business logic challenges"]
        }
      ]
    },
    {
      id: "sql-track-11",
      number: 11,
      title: "Real Projects",
      badge: "Projects",
      desc: "Build end-to-end portfolio SQL projects for sales, customer segmentation, inventory, and executive dashboards.",
      topics: [
        {
          id: "sql-t11-top1",
          name: "Sales Analysis",
          subtopics: ["Revenue breakdown", "Top product categories", "Regional sales growth"]
        },
        {
          id: "sql-t11-top2",
          name: "Customer Segmentation",
          subtopics: ["RFM (Recency, Frequency, Monetary) analysis in SQL", "Customer Lifetime Value (LTV)"]
        },
        {
          id: "sql-t11-top3",
          name: "Inventory Analysis",
          subtopics: ["Stock turnover rates", "Reorder alert thresholds", "Supplier lead-time analysis"]
        },
        {
          id: "sql-t11-top4",
          name: "Dashboard Queries",
          subtopics: ["Writing performant KPI queries for BI tools (Metabase / PowerBI)"]
        },
        {
          id: "sql-t11-top5",
          name: "GitHub SQL Portfolio",
          subtopics: ["Documenting SQL scripts, ER diagrams, and insights on GitHub"]
        }
      ]
    }
  ]
};

// System Curated Resources for SQL Workspace ("Suggested by MasterOS")
export const SQL_SUGGESTED_RESOURCES = [
  {
    id: "sql-res-1",
    title: "LeetCode SQL 50 Study Plan",
    type: "Practice Platform",
    category: "Practice & Interview",
    url: "https://leetcode.com/studyplan/top-sql-50/",
    description: "Master the 50 most essential SQL questions asked in technical interviews at top tech companies.",
    tag: "Essential Practice",
    badge: "Interactive"
  },
  {
    id: "sql-res-2",
    title: "SQLBolt — Interactive SQL Tutorials",
    type: "Interactive Course",
    category: "Foundations",
    url: "https://sqlbolt.com/",
    description: "Learn SQL with simple, interactive exercises directly in your browser. Perfect for beginners.",
    tag: "Free Course",
    badge: "Interactive"
  },
  {
    id: "sql-res-3",
    title: "Mode Analytics SQL Tutorial",
    type: "Documentation & Guide",
    category: "Analytics & Window Functions",
    url: "https://mode.com/sql-tutorial/",
    description: "Comprehensive tutorial covering Basic, Intermediate, and Advanced SQL including Window Functions.",
    tag: "Industry Standard",
    badge: "Recommended"
  },
  {
    id: "sql-res-4",
    title: "StrataScratch — Real Data Science SQL Questions",
    type: "Practice Platform",
    category: "Interviews & Analytics",
    url: "https://www.stratascratch.com/",
    description: "Practice real SQL questions from companies like Meta, Airbnb, Google, and Amazon.",
    tag: "Interview Prep",
    badge: "FAANG Level"
  },
  {
    id: "sql-res-5",
    title: "HackerRank SQL Practice Domain",
    type: "Practice Platform",
    category: "Practice & Challenges",
    url: "https://www.hackerrank.com/domains/sql",
    description: "Problem sets organized by difficulty covering basic SELECT queries to complex JOINs and Subqueries.",
    tag: "Coding Practice",
    badge: "Free"
  },
  {
    id: "sql-res-6",
    title: "W3Schools SQL Tutorial & Reference",
    type: "Cheatsheet & Reference",
    category: "Foundations",
    url: "https://www.w3schools.com/sql/",
    description: "Quick reference guide for syntax, keywords, functions, and database management.",
    tag: "Syntax Reference",
    badge: "Reference"
  },
  {
    id: "sql-res-7",
    title: "PostgreSQL Official Documentation",
    type: "Documentation",
    category: "Database Design & Performance",
    url: "https://www.postgresql.org/docs/",
    description: "Definitive documentation for PostgreSQL features, indexing, window functions, and EXPLAIN.",
    tag: "Official Docs",
    badge: "Advanced"
  },
  {
    id: "sql-res-8",
    title: "MySQL Reference Manual",
    type: "Documentation",
    category: "Database Design",
    url: "https://dev.mysql.com/doc/refman/8.0/en/",
    description: "Official manual for MySQL 8.0 including storage engines, indexing, and JSON support.",
    tag: "Official Docs",
    badge: "Reference"
  },
  {
    id: "sql-res-9",
    title: "Google BigQuery SQL Reference",
    type: "Cloud Data Warehouse",
    category: "Cloud / Modern SQL",
    url: "https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax",
    description: "Standard SQL documentation for Google BigQuery cloud data warehousing and analytics.",
    tag: "Cloud SQL",
    badge: "Enterprise"
  },
  {
    id: "sql-res-10",
    title: "DBeaver — Universal Database Tool",
    type: "Software Tool",
    category: "Tools & Client",
    url: "https://dbeaver.io/",
    description: "Free multi-platform database tool for developers, SQL programmers, and database administrators.",
    tag: "Database Client",
    badge: "Free Tool"
  },
  {
    id: "sql-res-11",
    title: "MasterOS SQL PDF Cheat Sheet & Drive Resources",
    type: "PDF / Drive",
    category: "Cheatsheet",
    url: "https://drive.google.com/",
    description: "Curated PDF cheatsheets covering SQL Joins visual guide, Window functions cheat sheet, and execution order.",
    tag: "PDF Guide",
    badge: "Curated PDF"
  },
  {
    id: "sql-res-12",
    title: "MasterOS Tech & SQL Community Channels",
    type: "Community Channel",
    category: "Community & Updates",
    url: "https://whatsapp.com/channel/",
    description: "Join the MasterOS WhatsApp & Telegram community channels for daily SQL challenge problems and solutions.",
    tag: "Community",
    badge: "WhatsApp / Telegram"
  }
];
