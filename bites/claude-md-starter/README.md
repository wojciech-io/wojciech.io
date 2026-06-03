# CLAUDE.md Starter for GTM Agents

A ready-to-use CLAUDE.md template for building GTM AI agents with Claude Code.

## What this is

A structured operator brief that Claude Code reads at session start. Fill in the brackets with your client data. The agent gets persistent identity, ICP scoring criteria, tone rules, and skill definitions.

## How to use

1. Copy `CLAUDE.md` to your project root
2. Fill in every `[bracketed]` field with your client-specific data
3. Create the `/memory/` directory structure
4. Run Claude Code. It reads CLAUDE.md automatically.

## What it covers

- **Operator identity**: who the agent is and what it does
- **ICP definition**: firmographic, technographic, and behavioral signals
- **Tone rules**: what the agent writes like (and hard-banned phrases)
- **Skills**: five named sub-tasks with clear inputs and outputs
- **Hard stops**: when the agent should skip, not guess
- **Memory structure**: where persistent context lives between sessions

## Related

- [The GTM agent starter pack](https://wojciech.io/insights/claude-code-vs-clay/)
- [How I use Claude Code in client GTM work](https://wojciech.io/insights/claude-code-client-gtm/)
- [Four layers that make a GTM agent work](https://wojciech.io/insights/gtm-ai-agent-four-layer-architecture-guide/)
