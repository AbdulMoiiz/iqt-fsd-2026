# Architecture and code review answers

## What steps would you take to secure a web application?

I would start with a threat model and secure defaults. Serve traffic over TLS, authenticate users with a proven identity provider, and enforce authorization on every resource operation. Validate inputs at the API boundary, use parameterized database access, and encode output to reduce injection and XSS risks. Protect browser sessions with secure, HttpOnly cookies and appropriate CSRF controls; keep CORS narrow.

Secrets belong in a managed secret store, never in source control or images. Give the application and database the least privileges they need, restrict network access, and keep dependencies and base images patched. In CI, run tests, dependency and container scans, and review migrations. In production, collect structured logs and security signals, set alerts, back up data, and practice recovery. For this assessment's unauthenticated single-user scope, I would add identity and per-user task ownership before exposing personal task data publicly.

## How would you improve the performance of a slow React application?

First I would measure: browser Performance tools, React Profiler, Web Vitals, and bundle analysis identify whether the delay comes from rendering, JavaScript, network requests, or the server. I would fix the largest measured cost before adding memoization.

For rendering, keep state close to where it is used, avoid needless parent updates, memoize expensive calculations or components only when profiling supports it, and virtualize genuinely long lists. For loading, split routes and heavy features, remove unused dependencies, compress assets, and cache static files. For data, avoid duplicate requests, use sensible request caching, and reduce payload size. I would compare the same user flows before and after each change, including slower devices and networks, so an optimization improves the experience rather than only a synthetic score.

## Explain the difference between SQL and NoSQL databases and when you would use each.

SQL databases store related data in tables with a defined schema and support joins, constraints, and transactions. I choose one when relationships and consistency matter, such as payments, inventory, or this task app. MySQL also gives us straightforward migrations and an index for the task list. “SQL” does not mean it cannot scale, and schema changes are manageable with migrations.

NoSQL covers several distinct models, including document, key-value, graph, and wide-column stores. I choose a specific model when its access pattern fits better: documents for flexible aggregate-shaped records, key-value for fast lookups or caching, and graph for traversal-heavy relationships. I still plan indexes, consistency, and data evolution. The decision should follow query patterns, correctness requirements, and operational needs rather than a blanket claim that one category is faster.

## How would you deploy a full-stack application to AWS?

I would build versioned images in CI and push the API image to ECR. Serve the React build from private S3 through CloudFront, with Route 53 and ACM for DNS and TLS. Run the Spring Boot API as an ECS Fargate service in private subnets behind a public Application Load Balancer. Keep MySQL on RDS in private subnets, with automated backups and Multi-AZ for a production availability target. Security groups would allow only the required paths between the ALB, API, and database.

Store database credentials in Secrets Manager and grant ECS tasks only the IAM permissions they need. Run Flyway migrations as a controlled deployment step before shifting traffic. Use health checks, rolling deployment and rollback settings, CloudWatch logs and alarms, and infrastructure as code. I would add ElastiCache only after measurements show repeated reads or latency that justify its cost and cache invalidation complexity. This is the proposed architecture; the assessment app has not been deployed to AWS.
