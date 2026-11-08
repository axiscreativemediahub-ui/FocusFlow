# Contributing to FocusFlow

1. Maintain strict separation of concerns. Do not couple DOM manipulation tightly to business logic in `store.js`, `tasks.js`, or `timer.js`.
2. Do not introduce external dependencies without explicit approval.
3. Ensure automated CI tests pass before issuing pull requests. The repository uses native Node.js tests to minimize execution time.
4. Semantic HTML and accessibility (`aria-labels`, semantic tags) must be strictly maintained.
