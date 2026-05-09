# Plan generator smoke (max 3 development tasks)

## Product Areas

### Input handling

- Read all of stdin until EOF.
- Treat empty input as a no-op exit code 0.

### Transformations

- --upper flag uppercases the entire input.
- --reverse flag reverses the entire input string.
- Flags can be combined (--upper --reverse applies both, order: upper then reverse).

### Output and error reporting

- Write transformed text to stdout without adding trailing newline.
- Unknown flags produce a one-line error to stderr and exit code 2.

## User Stories

### Operator can pipe text through df-echo

Acceptance criteria:
- Exit code 0 on successful transform.
- stdout matches expected transformed string byte-for-byte.

## Open Questions

- Should we document transformation order in --help output?

## Notes for the planner

The generated plan MUST contain at most 3 development tasks total. Subtasks count toward this cap.
