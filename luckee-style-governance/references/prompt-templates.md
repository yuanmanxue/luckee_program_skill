# Prompt Templates

Use these prompts when delegating the work to Claude or another coding agent. Always keep the scope small.

## Global Prefix

```text
You are working inside `motse-ai/luckee_frontend`.
Follow these constraints at the same time:
1. Obey `luckee-ui-standards` for visual language.
2. Obey `luckee-frontend-code-standards` for architecture and repository conventions.
3. Obey `luckee-style-governance` for migration order and scope control.

Rules:
- Do not rewrite product logic.
- Do not introduce a parallel UI system.
- Prefer semantic tokens, Tailwind classes, `cn()`, and `cva()`.
- Remove visual inline styles when safe, but keep genuine runtime numeric styles.
- Use the smallest coherent patch.
- If the requested scope is too large, shrink it first.

For every response, use this structure:
- Step goal
- Target files
- Why these files are correct
- Change summary table (file / change type / logic impact / risk / rollback)
- Code patch
- Validation steps
- Remaining risks
```

## Audit Prompt

```text
Now perform only the audit step.
Do not do broad code edits yet.

Task:
- Identify token bypass, visual inline styles, fragmented dialogs, missing shared primitives, and business files bypassing `src/components/ui`.
- Classify findings into P0 / P1 / P2.
- Output a table: issue type / representative files / impact / priority / recommended fix.
- Then output the recommended execution order.
```

## Token-First Prompt

```text
Now execute only the token/global-theme step.
Do not restyle business pages yet.

Task:
- Align the base visual language to Luckee design tokens.
- Prefer the existing semantic token structure.
- Keep architecture unchanged.
- Touch only theme files, style entry files, and font-loading files unless there is a clear reason otherwise.
```

## Primitive/Dialog Prompt

```text
Now execute only the primitive/dialog standardization step.

Task:
- Start with shared primitives such as button, input, card, dialog, tabs, toast, and closely related wrappers.
- Preserve existing props and calling patterns.
- Normalize dialog shell before editing many dialog consumers.
- After the shell is stable, update only one or two representative business dialogs.
```

## Inline-Style Cleanup Prompt

```text
Now execute only the inline-style cleanup step.

Task:
- Inspect the chosen files.
- Label each inline-style occurrence as `remove-now`, `keep-runtime`, `extract-shared`, or `needs-judgment`.
- Remove only the safe visual inline styles in this round.
- Explain why any retained inline style is still justified.
```

## Shared Business UI Prompt

```text
Now execute only the shared business UI step.

Task:
- Pick one high-frequency component cluster.
- Reuse the stabilized primitives and tokens.
- Do not change data flow, state, API logic, thread logic, or upload logic.
- Implement the smallest visual slice that improves consistency.
```

## Page Alignment Prompt

```text
Now execute only one page-level alignment step.

Task:
- First compare the current page to `luckee-ui`.
- List the main visual differences.
- Then implement only one page or one tightly related page slice.
- Do not invent page-only one-off styles when a primitive or wrapper should carry the rule.
```

## Scope-Correction Prompt

```text
Your current scope is too large.
Shrink the task back to the smallest verifiable slice.
Only modify the files I explicitly allow.
Do not refactor unrelated modules.
State what should not be touched, then provide the reduced patch.
```
