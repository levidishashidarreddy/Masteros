// Central Data Store for SQL Default 19-Track Roadmap & Curated Resources

export const SQL_DEFAULT_ROADMAP_DATA = {
  id: "sql-master-roadmap",
  title: "SQL Master Learning Roadmap",
  subtitle: "Master databases, query filtering, joins, CTEs, window functions, and real-world analytics",
  category: "SQL",
  icon: "database",
  tracks: [
    {
      id: "sql-track-1",
      number: 1,
      title: "SQL Foundations",
      badge: "Foundations",
      desc: "Introduction to relational databases, SQL syntax, table creation, and fundamental querying.",
      topics: [
        {
          id: "sql-t1-top1",
          name: "Introduction to Databases & SQL",
          subtopics: [
            "What is a database?",
            "What is SQL?",
            "DBMS vs RDBMS",
            "Tables, rows, columns and records",
            "Primary concepts of relational databases",
            "SQL syntax basics"
          ]
        },
        {
          id: "sql-t1-top2",
          name: "Database Basics",
          subtopics: [
            "Creating databases",
            "Selecting databases",
            "Creating tables",
            "Data types",
            "Constraints introduction"
          ]
        },
        {
          id: "sql-t1-top3",
          name: "SELECT Basics",
          subtopics: [
            "SELECT",
            "SELECT *",
            "Selecting specific columns",
            "Aliases using AS",
            "DISTINCT",
            "Basic expressions"
          ]
        },
        {
          id: "sql-t1-top4",
          name: "Basic Querying",
          subtopics: [
            "FROM",
            "WHERE",
            "ORDER BY",
            "LIMIT",
            "Basic filtering"
          ]
        }
      ]
    },
    {
      id: "sql-track-2",
      number: 2,
      title: "Filtering & Query Conditions",
      badge: "Filtering",
      desc: "Filter data effectively using comparison operators, logical operators, wildcards, and NULL checks.",
      topics: [
        {
          id: "sql-t2-top5",
          name: "Comparison Operators",
          subtopics: [
            "=",
            "!= / <>",
            ">",
            "<",
            ">=",
            "<="
          ]
        },
        {
          id: "sql-t2-top6",
          name: "Logical Operators",
          subtopics: [
            "AND",
            "OR",
            "NOT"
          ]
        },
        {
          id: "sql-t2-top7",
          name: "Advanced Filtering",
          subtopics: [
            "IN",
            "NOT IN",
            "BETWEEN",
            "LIKE",
            "Wildcards: % and _",
            "Pattern matching"
          ]
        },
        {
          id: "sql-t2-top8",
          name: "NULL Handling",
          subtopics: [
            "IS NULL",
            "IS NOT NULL",
            "Understanding NULL behavior",
            "COALESCE basics"
          ]
        }
      ]
    },
    {
      id: "sql-track-3",
      number: 3,
      title: "Aggregation & Grouping",
      badge: "Aggregation",
      desc: "Summarize and group data using aggregate functions, GROUP BY, and HAVING clauses.",
      topics: [
        {
          id: "sql-t3-top9",
          name: "Aggregate Functions",
          subtopics: [
            "COUNT()",
            "SUM()",
            "AVG()",
            "MIN()",
            "MAX()"
          ]
        },
        {
          id: "sql-t3-top10",
          name: "GROUP BY",
          subtopics: [
            "Grouping data",
            "Multiple-column grouping"
          ]
        },
        {
          id: "sql-t3-top11",
          name: "HAVING",
          subtopics: [
            "HAVING vs WHERE",
            "Filtering grouped results"
          ]
        },
        {
          id: "sql-t3-top12",
          name: "DISTINCT & Counting",
          subtopics: [
            "DISTINCT values",
            "COUNT(DISTINCT column)"
          ]
        }
      ]
    },
    {
      id: "sql-track-4",
      number: 4,
      title: "Data Manipulation",
      badge: "DML",
      desc: "Modify data stored in database tables using INSERT, UPDATE, and DELETE operations.",
      topics: [
        {
          id: "sql-t4-top13",
          name: "INSERT",
          subtopics: [
            "INSERT INTO",
            "Single-row insert",
            "Multiple-row insert"
          ]
        },
        {
          id: "sql-t4-top14",
          name: "UPDATE",
          subtopics: [
            "Updating records",
            "UPDATE with WHERE",
            "Avoiding accidental full-table updates"
          ]
        },
        {
          id: "sql-t4-top15",
          name: "DELETE",
          subtopics: [
            "DELETE with WHERE",
            "Understanding DELETE behavior"
          ]
        }
      ]
    },
    {
      id: "sql-track-5",
      number: 5,
      title: "Table Design & SQL Constraints",
      badge: "DDL & Schema",
      desc: "Design robust relational schemas with primary keys, foreign keys, constraints, and table alterations.",
      topics: [
        {
          id: "sql-t5-top16",
          name: "CREATE TABLE",
          subtopics: [
            "Table creation",
            "Choosing appropriate data types"
          ]
        },
        {
          id: "sql-t5-top17",
          name: "Constraints",
          subtopics: [
            "PRIMARY KEY",
            "FOREIGN KEY",
            "UNIQUE",
            "NOT NULL",
            "DEFAULT",
            "CHECK"
          ]
        },
        {
          id: "sql-t5-top18",
          name: "ALTER TABLE",
          subtopics: [
            "Add columns",
            "Modify columns where supported",
            "Drop columns where supported"
          ]
        },
        {
          id: "sql-t5-top19",
          name: "DROP & TRUNCATE",
          subtopics: [
            "DROP TABLE",
            "TRUNCATE",
            "Difference between DELETE, TRUNCATE and DROP"
          ]
        }
      ]
    },
    {
      id: "sql-track-6",
      number: 6,
      title: "JOINS ⭐",
      badge: "Core Feature ⭐",
      desc: "Combine rows from two or more tables based on related columns.",
      topics: [
        {
          id: "sql-t6-top20",
          name: "JOIN Fundamentals",
          subtopics: [
            "Why joins are needed",
            "Understanding relationships between tables"
          ]
        },
        {
          id: "sql-t6-top21",
          name: "INNER JOIN",
          subtopics: [
            "Matching records in both tables",
            "ON clause syntax",
            "Joining 2+ tables"
          ]
        },
        {
          id: "sql-t6-top22",
          name: "LEFT JOIN",
          subtopics: [
            "All records from left table",
            "Handling unmatched NULL values",
            "Finding missing relationships"
          ]
        },
        {
          id: "sql-t6-top23",
          name: "RIGHT JOIN",
          subtopics: [
            "All records from right table",
            "Equivalence with LEFT JOIN"
          ]
        },
        {
          id: "sql-t6-top24",
          name: "FULL OUTER JOIN",
          subtopics: [
            "All records from both tables",
            "Where supported by selected SQL engine"
          ]
        },
        {
          id: "sql-t6-top25",
          name: "CROSS JOIN",
          subtopics: [
            "Cartesian product",
            "Generating combinations"
          ]
        },
        {
          id: "sql-t6-top26",
          name: "SELF JOIN",
          subtopics: [
            "Joining a table to itself",
            "Table aliases",
            "Employee/Manager relationships"
          ]
        },
        {
          id: "sql-t6-top27",
          name: "Multi-Table Joins",
          subtopics: [
            "One-to-one relationships",
            "One-to-many relationships",
            "Matching vs non-matching records"
          ]
        }
      ]
    },
    {
      id: "sql-track-7",
      number: 7,
      title: "Set Operations",
      badge: "Set Theory",
      desc: "Combine result sets of two or more SELECT queries using set operators.",
      topics: [
        {
          id: "sql-t7-top28",
          name: "UNION",
          subtopics: [
            "Combining distinct rows",
            "Rules for column numbers & data types",
            "JOIN vs UNION differences"
          ]
        },
        {
          id: "sql-t7-top29",
          name: "UNION ALL",
          subtopics: [
            "Combining all rows including duplicates",
            "UNION vs UNION ALL performance"
          ]
        },
        {
          id: "sql-t7-top30",
          name: "INTERSECT",
          subtopics: [
            "Returning common rows",
            "Where supported by dialect"
          ]
        },
        {
          id: "sql-t7-top31",
          name: "EXCEPT / MINUS",
          subtopics: [
            "Returning rows in first query but not second",
            "Dialect variations (EXCEPT vs MINUS)"
          ]
        }
      ]
    },
    {
      id: "sql-track-8",
      number: 8,
      title: "CASE & Conditional Logic",
      badge: "Control Flow",
      desc: "Implement IF-THEN-ELSE conditional logic directly inside SQL SELECT and UPDATE statements.",
      topics: [
        {
          id: "sql-t8-top32",
          name: "CASE Statements",
          subtopics: [
            "Simple CASE",
            "Searched CASE",
            "Multiple conditions",
            "Nested conditional logic"
          ]
        },
        {
          id: "sql-t8-top33",
          name: "Conditional Calculations",
          subtopics: [
            "Categories",
            "Labels",
            "Business rules",
            "Classification logic"
          ]
        }
      ]
    },
    {
      id: "sql-track-9",
      number: 9,
      title: "String Functions",
      badge: "Text Manipulation",
      desc: "Clean, format, parse, and manipulate textual data stored in string columns.",
      topics: [
        {
          id: "sql-t9-top34",
          name: "String Basics",
          subtopics: [
            "CONCAT",
            "LENGTH",
            "LOWER",
            "UPPER",
            "TRIM"
          ]
        },
        {
          id: "sql-t9-top35",
          name: "String Manipulation",
          subtopics: [
            "SUBSTRING / SUBSTR",
            "REPLACE",
            "LEFT / RIGHT where supported",
            "String searching patterns"
          ]
        }
      ]
    },
    {
      id: "sql-track-10",
      number: 10,
      title: "Date & Time",
      badge: "Temporal Data",
      desc: "Filter, extract, truncate, and calculate differences between dates and timestamps.",
      topics: [
        {
          id: "sql-t10-top36",
          name: "Date Basics",
          subtopics: [
            "Date data types",
            "Current date/time functions"
          ]
        },
        {
          id: "sql-t10-top37",
          name: "Date Filtering",
          subtopics: [
            "Filtering by date",
            "Date ranges"
          ]
        },
        {
          id: "sql-t10-top38",
          name: "Date Functions",
          subtopics: [
            "EXTRACT",
            "DATE_TRUNC",
            "DATEDIFF",
            "DATEADD",
            "Dialect variations (MySQL vs Postgres vs SQL Server)"
          ]
        }
      ]
    },
    {
      id: "sql-track-11",
      number: 11,
      title: "Subqueries & CTEs ⭐",
      badge: "Advanced Logic ⭐",
      desc: "Master nested queries, correlated subqueries, EXISTS, and clean Common Table Expressions (CTEs).",
      topics: [
        {
          id: "sql-t11-top39",
          name: "Subqueries",
          subtopics: [
            "Scalar subqueries",
            "Subqueries in WHERE",
            "Subqueries in FROM",
            "Nested queries"
          ]
        },
        {
          id: "sql-t11-top40",
          name: "Correlated Subqueries",
          subtopics: [
            "Row-by-row outer query evaluation",
            "Performance considerations"
          ]
        },
        {
          id: "sql-t11-top41",
          name: "EXISTS & NOT EXISTS",
          subtopics: [
            "Checking existence",
            "EXISTS vs IN efficiency"
          ]
        },
        {
          id: "sql-t11-top42",
          name: "CTEs",
          subtopics: [
            "WITH clause",
            "Multiple CTEs",
            "CTE chains"
          ]
        },
        {
          id: "sql-t11-top43",
          name: "Recursive CTEs",
          subtopics: [
            "Basic recursive queries",
            "Hierarchical data concepts"
          ]
        }
      ]
    },
    {
      id: "sql-track-12",
      number: 12,
      title: "Window Functions ⭐",
      badge: "Analytics Core ⭐",
      desc: "Perform calculations across set of rows related to current row using OVER(), PARTITION BY, and ranking functions.",
      topics: [
        {
          id: "sql-t12-top44",
          name: "Window Function Fundamentals",
          subtopics: [
            "OVER()",
            "PARTITION BY",
            "ORDER BY inside window functions"
          ]
        },
        {
          id: "sql-t12-top45",
          name: "Ranking Functions",
          subtopics: [
            "ROW_NUMBER()",
            "RANK()",
            "DENSE_RANK()"
          ]
        },
        {
          id: "sql-t12-top46",
          name: "Analytical Functions",
          subtopics: [
            "LAG()",
            "LEAD()"
          ]
        },
        {
          id: "sql-t12-top47",
          name: "Running Calculations",
          subtopics: [
            "Running totals",
            "Moving calculations",
            "Cumulative calculations"
          ]
        }
      ]
    },
    {
      id: "sql-track-13",
      number: 13,
      title: "Advanced Querying",
      badge: "Optimization",
      desc: "Construct complex multi-step queries, debug performance bottlenecks, and write readable SQL code.",
      topics: [
        {
          id: "sql-t13-top48",
          name: "Complex Query Construction",
          subtopics: [
            "Combining joins",
            "Subqueries",
            "CTEs",
            "Aggregations",
            "Window functions"
          ]
        },
        {
          id: "sql-t13-top49",
          name: "Query Problem-Solving",
          subtopics: [
            "Breaking complex problems into steps",
            "Writing readable SQL",
            "Query debugging"
          ]
        },
        {
          id: "sql-t13-top50",
          name: "Query Optimization Basics",
          subtopics: [
            "Avoiding unnecessary SELECT *",
            "Reducing unnecessary operations",
            "Understanding query efficiency"
          ]
        }
      ]
    },
    {
      id: "sql-track-14",
      number: 14,
      title: "Indexing & Performance",
      badge: "Indexing",
      desc: "Understand B-tree indexes, execution plans, and how database engines search tables efficiently.",
      topics: [
        {
          id: "sql-t14-top51",
          name: "Indexing Basics",
          subtopics: [
            "What is an index?",
            "Why indexes improve some queries",
            "When indexes may not help"
          ]
        },
        {
          id: "sql-t14-top52",
          name: "Types of Indexing Concepts",
          subtopics: [
            "Single-column indexes",
            "Composite indexes"
          ]
        },
        {
          id: "sql-t14-top53",
          name: "Query Execution",
          subtopics: [
            "EXPLAIN",
            "Query plans",
            "Basic query plan understanding"
          ]
        }
      ]
    },
    {
      id: "sql-track-15",
      number: 15,
      title: "Transactions & Database Concepts",
      badge: "Transactions",
      desc: "Learn BEGIN, COMMIT, ROLLBACK, ACID guarantees, and database concurrency fundamentals.",
      topics: [
        {
          id: "sql-t15-top54",
          name: "Transactions",
          subtopics: [
            "BEGIN",
            "COMMIT",
            "ROLLBACK"
          ]
        },
        {
          id: "sql-t15-top55",
          name: "ACID Properties",
          subtopics: [
            "Atomicity",
            "Consistency",
            "Isolation",
            "Durability"
          ]
        },
        {
          id: "sql-t15-top56",
          name: "Basic Concurrency Concepts",
          subtopics: [
            "Fundamental concepts suitable for SQL learners"
          ]
        }
      ]
    },
    {
      id: "sql-track-16",
      number: 16,
      title: "Practice & Problem Solving",
      badge: "Patterns",
      desc: "Master key SQL patterns: filtering, aggregations, duplicate detection, and Nth highest values.",
      topics: [
        {
          id: "sql-t16-top57",
          name: "SQL Problem-Solving Patterns",
          subtopics: [
            "Filtering problems",
            "Aggregation problems",
            "GROUP BY + HAVING problems",
            "JOIN problems",
            "Subquery problems",
            "CTE problems",
            "Window function problems",
            "Ranking problems",
            "Duplicate detection",
            "Consecutive records",
            "Second/Nth highest value problems"
          ]
        },
        {
          id: "sql-t16-top58",
          name: "Practice Progress",
          subtopics: [
            "Tracking your own practice progress at your own pace"
          ]
        }
      ]
    },
    {
      id: "sql-track-17",
      number: 17,
      title: "Interview Preparation",
      badge: "Interviews",
      desc: "Prepare for coding interviews with top technical SQL interview question archetypes.",
      topics: [
        {
          id: "sql-t17-top59",
          name: "Common SQL Interview Patterns",
          subtopics: [
            "Second highest salary",
            "Nth highest record",
            "Duplicate detection",
            "Remove/find duplicates",
            "Ranking problems",
            "Department-wise top records",
            "Running totals",
            "Joins-based questions",
            "Employee/manager relationship questions",
            "Date-based questions"
          ]
        }
      ]
    },
    {
      id: "sql-track-18",
      number: 18,
      title: "Real-World SQL Projects",
      badge: "Projects",
      desc: "Apply SQL to end-to-end analytics projects: revenue analysis, customer segmentation, and inventory.",
      topics: [
        {
          id: "sql-t18-top60",
          name: "Sales Analysis",
          subtopics: [
            "Revenue queries",
            "Product analysis",
            "Customer analysis"
          ]
        },
        {
          id: "sql-t18-top61",
          name: "Customer Segmentation",
          subtopics: [
            "RFM analysis concepts",
            "Cohort grouping"
          ]
        },
        {
          id: "sql-t18-top62",
          name: "Inventory Analysis",
          subtopics: [
            "Stock turnover",
            "Reorder thresholds"
          ]
        },
        {
          id: "sql-t18-top63",
          name: "Business Analytics Queries",
          subtopics: [
            "Monthly recurring revenue",
            "Churn rate calculation"
          ]
        },
        {
          id: "sql-t18-top64",
          name: "Portfolio Projects",
          subtopics: [
            "Publishing SQL projects and dataset analysis to GitHub"
          ]
        }
      ]
    },
    {
      id: "sql-track-19",
      number: 19,
      title: "SQL Tools & Ecosystem",
      badge: "Tools & Cloud",
      desc: "Explore modern SQL clients (DBeaver, pgAdmin), Cloud warehouses (BigQuery, Snowflake), and dbt.",
      topics: [
        {
          id: "sql-t19-top65",
          name: "Database Tools",
          subtopics: [
            "MySQL Workbench",
            "PostgreSQL / pgAdmin",
            "DBeaver"
          ]
        },
        {
          id: "sql-t19-top66",
          name: "Cloud / Modern SQL",
          subtopics: [
            "BigQuery basics",
            "Introduction to cloud databases"
          ]
        },
        {
          id: "sql-t19-top67",
          name: "Advanced Ecosystem Introduction",
          subtopics: [
            "dbt introduction",
            "Data warehouse concepts",
            "Snowflake introduction"
          ]
        }
      ]
    }
  ]
};
