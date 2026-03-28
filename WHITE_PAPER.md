# My Compass Tiered Agentic Development Framework

*Governed AI-Assisted Software Development for the Department of the Navy*

Project Compass Initiative

March 2026

---

# Executive Summary

The My Compass enterprise mobile application represents a fundamental shift in how the Department of the Navy delivers administrative services to its Sailors. Rather than replacing the authoritative legacy systems that process service records, travel claims, leave requests, and assignment cycles, My Compass eliminates the coordination burden that currently falls on the individual Sailor by providing a single, unified interface that retrieves, synthesizes, and presents data from across the Navy's personnel infrastructure.

This white paper documents the Tiered Agentic Loop Architecture, the engineering governance framework that makes AI-assisted development safe, auditable, and repeatable at enterprise scale. The architecture defines three tiers of authority---Strategic Governance (Tier 1, human decision authority), Operational Coordination (Tier 2, the Orchestrator), and Tactical Execution (Tier 3, AI Module Agents)---each with distinct responsibilities, constraints, and accountability boundaries that no tier may override.

Every development session operates within a closed-loop execution model: Load, Execute, Verify, Commit. No step may be skipped. The Directive Library, a structured collection of domain-specific governance documents, loads at every session start and provides the constitutional constraints under which all agent execution occurs. An independent Verifier, fully isolated from the execution context, evaluates every output before it advances. The Governed Development Cycle enforces this discipline at the repository level, ensuring that no code reaches production without clearing every governance gate.

A three-phase authorization model governs data access: Proof of Concept against exclusively synthetic data, an Authorized Pilot against real Sailor records within a GCC High environment, and Full Operational Deployment post-ATO at enterprise scale. Every failure mode identified in this architecture has a documented resolution protocol authored before the failure occurred. This paper provides the complete technical specifications for reviewers, stakeholders, and future developers to evaluate the engineering rigor, governance posture, and operational readiness of the My Compass development program.

**THIS PAGE INTENTIONALLY BLANK**

---

# Table of Contents

- [Executive Summary](#executive-summary)
- [I. The Engineering Premise](#i-the-engineering-premise)
  - [The Engineering Architecture](#the-engineering-architecture)
- [II. Architectural Definitions](#ii-architectural-definitions)
  - [Core Architectural Patterns](#core-architectural-patterns)
  - [Sequential Execution](#sequential-execution)
  - [Queue-Based Activation Model](#queue-based-activation-model)
- [III. The Tiered Agentic Loop Architecture](#iii-the-tiered-agentic-loop-architecture)
  - [The Three Tiers](#the-three-tiers)
  - [The Execution Loop: From Trigger to Merge](#the-execution-loop-from-trigger-to-merge)
  - [The Lessons Learned Repository](#the-lessons-learned-repository)
  - [The Closed-Loop Execution Model](#the-closed-loop-execution-model)
  - [The Directive Library](#the-directive-library)
  - [The Execution Script](#the-execution-script)
- [IV. The Development Workflow](#iv-the-development-workflow)
  - [The Branch Structure](#the-branch-structure)
- [V. Module Architecture Map](#v-module-architecture-map)
- [VI. The Five Constitutional Rules](#vi-the-five-constitutional-rules)
- [VII. Risk Posture: Failure Modes and Mitigations](#vii-risk-posture-failure-modes-and-mitigations)
  - [Technical Risks](#technical-risks)
  - [Governance Risks](#governance-risks)
  - [Quality Gate Framework](#quality-gate-framework)
- [VIII. Developer Onboarding: Continuity by Design](#viii-developer-onboarding-continuity-by-design)
- [IX. Data Architecture and Phased Authorization Model](#ix-data-architecture-and-phased-authorization-model)
  - [The Three-Phase Authorization Model](#the-three-phase-authorization-model)
  - [Data Governance Framework](#data-governance-framework)
- [X. Conclusion](#x-conclusion)
- [Addendum A: Three-Layer Governance Model](#addendum-a-three-layer-governance-model)
- [Addendum B: Developer Quick Reference](#addendum-b-developer-quick-reference)
  - [Environment Setup](#environment-setup)
  - [Navy Terminology](#navy-terminology)

---

# I. The Engineering Premise

This document demonstrates that My Compass is being built with every architectural decision documented and defended. The purpose is to prove the engineering model: that a tiered agentic development architecture, governed by constitutional constraints and executed through a disciplined human-on-the-loop workflow, produces enterprise-quality Navy software reliably, at speed, and with a clear resolution path for every failure mode.

## The Engineering Architecture

The engineering Architecture has three parts. First, the Tiered Agentic Loop Architecture creates a development environment where AI agents produce scoped, verifiable code within defined module boundaries, with no undocumented side effects. Second, the Governance Model: the Directive Library, the Execution Scripts, and the Orchestrator/Verifier/QA role structure, makes governance failures structurally improbable rather than merely procedurally discouraged. The difference between those two conditions is the difference between a system that depends on discipline and a system that enforces it. Third, every error class this system can encounter has a documented resolution protocol that returns the system to a known-good state without loss of progress or data integrity.

---

# II. Architectural Definitions

The architecture described in this document draws on a specific set of agentic software engineering patterns. Each carries a defined meaning that governs how the system behaves at runtime. These are not glossary entries; they are operational specifications. A system that does not enforce these definitions is not implementing the architecture described here.

Three tiers of authority that are foundational to this architecture. **Tier 1---Strategic Governance** is the human decision layer: the individual who owns the Directive Library and holds all merge authority. **Tier 2---Operational Coordination** is the Orchestrator: the agent that manages sessions, generates Execution Scripts, and routes output for verification. **Tier 3---Tactical Execution** is the Module Agent layer: AI agents that execute scoped, bounded tasks and produce structured output. More information about each Tier can be found in section III.

## Core Architectural Patterns

**Directive Library.** The Directive Library is the constitutional layer of the governance architecture, a structured collection of domain-specific governance documents, each governing a precise area of the system with the depth that a single omnibus file cannot provide. The library loads at the start of every development session before any agent begins work. It defines the standing rules under which all execution occurs. The complete structure and individual directives are detailed in Section III.

**Antigravity.** Antigravity is an agentic integrated development environment (IDE) used to author, govern, and execute all development sessions under this framework. It functions as the runtime host for the Orchestrator and Tier 3 agents, managing directive loading, Execution Script generation, and session logging. In Antigravity, the Directive Library loads automatically at session open; no manual trigger required. References to Antigravity in this paper describe the environment in which this architecture is implemented and validated. Other agentic IDEs may serve the same function when configured to enforce the same session contract.

**Execution Script.** An Execution Script is the session-level instruction set generated by the Orchestrator before an agent (a software process driven by an AI model that receives a structured instruction set, executes a defined task, produces a structured output, and terminates) begins to work. It is the bridge between the Directive Library and the active session. Where directives define the standing rules of the system, the Execution Script applies those rules to a specific task, a specific module, and a specific session. An agent working without an Execution Script is working without governance. That condition is a halt, not a warning. A session that halts is not a mistake the developer caused; it is the architecture working exactly as designed. The system stops rather than proceeding when governance conditions are not met. The developer restarts with a corrected Execution Script.

**Orchestrator.** The Orchestrator is the Tier 2, Operational Coordination agent, the equivalent of a senior engineer or technical lead in a traditional development team. It does not produce code. It creates the conditions under which code can be produced safely. It loads the Directive Library at session start, decomposes the task scope received from Tier 1 into module-level subtasks, generates the Execution Script for each Tier 3 agent, monitors execution boundaries, and routes output to the independent Verifier.

**Verifier.** The Verifier is a fully independent agent instance whose sole function is to evaluate the output of a Tier 3 agent session. It receives no context from the execution session, only the structured output and the Execution Script that defined the session contract. It evaluates output against three criteria: directive compliance, module boundary integrity, and integration contract adherence. The Verifier does not optimize, suggest, or assist. It issues one of two verdicts: pass or halt. Its independence is not procedural; courtesy is what makes the verification meaningful. A Verifier that shares context with the executing agent is not a Verifier.

**Subagent.** A subagent is an AI agent instance assigned to a single, bounded task within a defined module scope.

**Module Agent.** A Module Agent is a Tier 3 AI agent instance assigned to execute feature code within a single, defined module boundary --- see Tier 3 in the Three Tiers section for full authority scope. It operates under a specific Execution Script for one session and returns structured output with a boundary confirmation. It is the equivalent of a junior or mid-level developer executing a well-scoped ticket. A Module Agent that encounters ambiguity in its Execution Script does not interpret and proceed, but rather it halts and issues a clarification request to the Orchestrator.

**Quality Assurance (QA) Agent.** The QA Agent is the quality gate executor --- its role within the governance chain is described in The Execution Loop section. It receives structured output from the Tier 3 Module Agent and runs the full quality gate evaluation: integration tests, offline behavior verification, and four-dimensional scoring per TESTING.md. It enforces coverage thresholds. It does not produce feature code. It produces a pass or remediation verdict that determines whether the commit may advance to staging.

**Multi-Agent Chain.** A multi-agent chain is a sequence of agent handoffs in which each agent's structured output becomes the defined input for the next agent. In this architecture, the chain runs: Orchestrator → Module Agent → QA Agent → Human Review → Verifier → Orchestrator (commit staging). Each handoff is a data transfer, not a conversation. Chain integrity depends entirely on output format discipline. An unstructured output from any agent in the chain generates a halt --- it cannot be consumed by the next agent without interpretation, and interpretation at handoff is an architectural failure.

## Sequential Execution

This architecture is designed to run subagents sequentially, one module, one session, and one agent at a time. That is a risk management decision, not a content limitation. There is a fair argument that creating parallel execution would multiply output speed. However, it also multiplies the scope of impact of any individual failure. If three Module Agents run simultaneously and one produces a boundary violation, the violation may have propagated into the other two sessions before the Verifier Agent catches it. In a system where downstream outputs affect a Sailor's service record, travel entitlements, or assignment timeline, that propagation risk is not acceptable at any phase. Sequential execution ensures one agent fails at a time, in isolation, with a contained scope of impact and a documented return-to-known-good protocol. As module-level directive constraints prove stable across repeated sessions, selective parallelization can be introduced---one module at a time, with Tier 1 authorization.

## Queue-Based Activation Model

Agents within this framework are not persistent background processes and do not activate autonomously. Agents within this framework are not persistent background processes. They do not run continuously or consume resources while idle, or remain active between tasks. They are instantiated in response to defined trigger events and terminate upon completion of their Execution Script. This is both an architectural efficiency and a governance feature; an agent that is not running cannot produce undocumented side effects.

Every user interaction with the My Compass application, every button press, every form submission, every navigation event drops an entry into the session queue. The developer monitors this queue and determines which entries require an agent session. Developer task initiation works the same way: the developer identifies a task, adds it to the queue, and initiates the session manually. A commit (saving completed work to the codebase) or a pull request (submitting that work for review) also enters the queue for governance processing. For readers unfamiliar with these terms: a commit is the act of saving a completed piece of work to the codebase, similar to submitting a signed document to the official record. A pull request is a formal request to have that saved work reviewed before it becomes part of the authoritative codebase, the equivalent of routing a document through the chain of command before it is finalized. A shared branch is an isolated working copy of the codebase where a developer or agent completes a task independently, without affecting anyone else's work, until it is reviewed and approved. In Phase 3, when live API integrations to NSIPS, DTS, and My Navy Assignment are established, queue entries will be generated automatically by system events. In Phases 1 and 2, all queue entries are initiated by the developer. The governance chain --- Tier 1 through Tier 3, Verifier, QA, and merge --- runs identically regardless of how the entry entered the queue.

The queue model means the developer maintains full situational awareness of what the system is processing and what requires a response. A failed integration test enters the queue as a flag requiring investigation. A directive amendment enters the queue as a re-validation task. The human-on-the-loop requirement is not a bottleneck; it is the governance mechanism that ensures every session that runs has been authorized by Tier 1. The queue is the discipline. The governance chain is the execution.

### Illustrated Example: The Queue Model in Action

The following example illustrates how the Queue-Based Activation Model operates end-to-end during Phase 1 of My Compass development. Every concept described in this section, the queue, the governance chain, the human-on-the-loop, the Verifier, and the commit, appears below in sequence. This is the model as it operates today.

**SCENARIO**

Petty Officer Jones opens My Compass on his phone and submits a leave request for 10 days beginning next month. He clicks Submit. The application acknowledges receipt. The session queue now has one entry.

**The governance chain executes as follows:**

| Step | Owner | Action | Gate Condition |
|---|---|---|---|
| **1** | **Developer --- Queue Review** | PO Jones hits Submit. His leave request drops into the session queue. The developer reviews the queue entry and determines it requires validation against leave balance, PRD proximity, and MILPERSMAN policy. The developer initiates an agent session. | *Queue entry reviewed. Session initiation authorized by the developer.* |
| **2** | **Tier 1 --- The Architect** | Antigravity opens. COMPASS.md loads automatically. The full Directive Library loads in sequence. The developer defines and approves the task scope in writing: validate PO Jones's leave request. Module: Leave Validation. Boundary: read-only synthetic Sailor data. No writes to any record. | *Task scope approved in writing. Directive Library confirmed loaded.* |
| **3** | **Tier 2 --- The Orchestrator** | The Orchestrator receives the approved scope, identifies governing documents (SECURITY.md, INTEGRATIONS.md), and generates the Execution Script: Session ID LV-2026-0318, Module Leave Validation, authorized files, output contract, halt conditions. | *Execution Script generated and delivered to the Module Agent.* |
| **4** | **Tier 3 --- Module Agent** | The Module Agent works: pulls Jones's leave balance (14 days available, 10 requested), checks PRD proximity (8 months --- within policy), routes the policy check through the adapter layer, and flags a training block conflict on days 4 and 5. Every file write is logged. | *Structured output produced. Boundary confirmation logged --- no files outside authorized scope touched.* |
| **5** | **QA Agent** | The QA Agent runs the full quality gate: integration tests, offline behavior verification, four-dimension scoring. All dimensions clear 7/10. Training conflict flagged and documented. QA report delivered to human reviewer. | *All thresholds met per TESTING.md. Report delivered to Tier 1.* |
| **6** | **Human on the Loop --- Tier 1** | The developer reads the QA report. The training conflict requires a human decision. Decision documented: leave request conditionally approved, conflict requires coordination with chain of command. Output approved with annotation. | *Human decision documented. Annotated output forwarded to Verifier.* |
| **7** | **Verifier --- Independent Review** | An independent Verifier instance --- no context from the execution session --- loads AUDIT.md only and evaluates: directive compliance, module boundary integrity, integration contract adherence. All three pass. | *Verifier verdict: PASS. Commit staged.* |
| **8** | **Tier 1 --- Final Merge** | The Orchestrator stages the commit. Work advances to QA/Staging. Tier 1 authorizes the final merge to main. CHANGELOG.md updated with Session ID LV-2026-0318. Session closed. PO Jones sees his result in My Compass. | *Production codebase updated. Session logged and closed.* |

In Phase 1, the developer manually reviews the queue and initiates each session. In Phase 3, when live API integrations to NSIPS, DTS, and MyNavy Assignment are established, PO Jones's entry populates the queue automatically the moment he hits Submit. The governance chain in steps 2 through 8 runs identically in both phases. The only thing that changes is what populates the queue. The architecture was designed this way deliberately: the trigger mechanism evolves without touching the governance model.

**AT SCALE**

At 400,000 Sailors, this queue processes thousands of entries simultaneously. Tier 1 does not review every individual entry it sets governance policy that determines which classes of entries auto-advance and which require human review. Routine, low-risk, policy-compliant approvals advance automatically after Verifier pass. Exception-flagged or novel conditions escalate to human review. The human-on-the-loop requirement does not disappear at scale; it becomes smarter.

---

# III. The Tiered Agentic Loop Architecture

The Tiered Agentic Loop Architecture is the governance framework that makes AI-assisted development safe at scale. It defines three tiers of authority, each with distinct responsibilities and constraints. No tier can override the Tier above it. No tier acts without loading the Directive Library and receiving an Execution Script. Every action runs the same four-step closed loop. No exceptions.

## The Three Tiers

**Tier 1 --- Strategic Governance.** Tier 1 is the human decision layer --- the equivalent of a senior engineer, technical lead, or architect in a traditional software team. It owns the Directive Library, the module architecture map, and all merge authority to the main branch. It sets the boundaries within which all agent execution occurs. Tier 1 does not write feature code. It reviews, approves, and locks --- the same function a senior engineer performs in a structured code review and stack integration process. Nothing in Tier 2 or Tier 3 can circumvent Tier 1 authority---not through shortcuts, not through agent autonomy, and not through schedule pressure.

**Tier 2 --- Operational Coordination.** Tier 2 is the Orchestrator. It loads the Directive Library at session start, decomposes the approved task scope into module-level subtasks, and generates the Execution Script that governs each Tier 3 agent's session. It does not write production code. It owns session integrity. When a Tier 3 agent produces output that crosses a module boundary, the Orchestrator halts---it does not route the output forward, assuming the Verifier will catch it.

**Tier 3 --- Tactical Execution.** Tier 3 --- Tactical Execution agents execute, the equivalent of a junior or mid-level developer working on a well-defined ticket in an established codebase. Each receives an Execution Script specifying the module it owns, the task it is executing, the directive constraints that apply, and the integration contract it may not violate. It produces code, runs tests, and returns structured output to the Orchestrator, including a boundary confirmation that no files outside the assigned module scope were touched. A Tier 3 agent that determines mid-session that its task requires crossing a module boundary does not proceed. It flags and halts.

## The Execution Loop: From Trigger to Merge

The Tiered Agentic Loop executes immediately once a developer initiates a session from the queue. The relationship between a queue entry and the governance chain is the same as the relationship

The full execution loop runs as follows. The stages are summarized in the table below; each stage is then explained in narrative form to make the governance gates and handoffs explicit.

Note: The agents referenced in this loop --- the Orchestrator, Module Agent, QA Agent, and Verifier --- are defined in full in Section II, Core Architectural Patterns. The sequence below describes how those agents operate together in practice.

A queue entry initiates the session. A Sailor pressing a button within My Compass, a developer committing completed work, a failed integration flag, or a task the developer has identified and queued for execution --- these are all valid session initiators. The source of the queue entry does not affect the governance chain. What matters is that a recognized condition has been queued, reviewed by Tier 1, and authorized for execution.

**Tier 1 --- Strategic Governance** responds first. The Directive Library loads automatically. The standing rules of the system are active before any agent begins work. Tier 1 defines the task scope and authorizes execution within the constraints that those directives establish. Nothing downstream of Tier 1 operates outside the boundaries Tier 1 has set.

**Tier 2 --- Operational Coordination** receives the approved task scope and takes ownership of execution planning. The Orchestrator evaluates all resources available, active modules, integration contracts, dependency state, current directive constraints, and determines the most efficient and effective path to execution. It generates the Execution Script that governs the Tier 3 session and delivers it to the assigned Module Agent. The Orchestrator does not execute. It creates the conditions under which execution can occur safely.

**Tier 3 --- Tactical Execution** receives the Execution Script and works. The Module Agent executes within its assigned module boundary, logs every file write, and returns structured output with a boundary confirmation. It does not interpret ambiguity. If the Execution Script is unclear, it halts and issues a clarification request to the Orchestrator. If mid-session, the task requires crossing a module boundary, it halts. Execution is bounded, logged, and terminated.

**The QA Agent.** This agent runs before any human reviews the output. It receives the structured output from Tier 3 and executes the full quality gate: integration tests, offline behavior verification, and four-dimensional scoring per TESTING.md. The QA Agent does not produce code and does not suggest changes. It produces a scored report. That report is what the human reviewer reads.

**The human on the loop.** This process ensures a human agent reviews the QA report and verifies the work. This gate cannot be skipped and cannot be automated. The human reads the findings, evaluates the output, and either approves it for forwarding or returns it with documented notes. Human review is not a formality---it is the moment institutional judgment enters the loop.

**The Verifier** receives the human-approved output. It evaluates against three criteria---directive compliance, module boundary integrity, and integration contract adherence---using AUDIT.md only, with no context from the execution session. Its verdict is binary: pass or halt. A halt at the Verifier stage returns the session to Tier 2 for restart with a corrected Execution Script.

**Merge to main** requires Tier 1 authorization. Nothing enters the production codebase that has not cleared the full loop. The CHANGELOG is updated. The session is closed.

## The Lessons Learned Repository

Every session---whether it completes cleanly or terminates in a halt---generates a log entry. The repository structure is shown in the table below. Every halt event is recorded with the trigger, the directive that was violated, and the resolution applied. Every QA failure pattern is captured. Every high-scoring session output is stored as a reference exemplar. This is not post-mortem documentation. It is the active training layer of the system.

The complete governance sequence is illustrated in Diagram 1 below. Each row represents one stage of the execution loop, with the owning tier, the action taken, and the gate condition that must be satisfied before the session can advance to the next stage.

*[Diagram 1: Governance Sequence]*

| | Content | Feeds Back Into |
|---|---|---|
| Every halt event | Trigger that fired. Directive violated. Resolution applied. Session identifier. | Tier 1 directive amendment candidates. |
| Every error and resolution | Exact failure class. Exact fix applied, whether a fix is required or a directive update. | Orchestrator failure mode register update. |
| QA failure patterns | Recurring failures flagged by dimension. Coverage gaps. Integration test failures. | TESTING.md threshold review. QA Agent scoring calibration. |
| Session exemplars | High-scoring outputs stored as reference. Score, module, session identifier, task description. | Raised baseline for passing session standard. |

The lessons learned repository feeds the next Tier 1 directive update. Recurring failure patterns surface as candidates for directive amendment. Exemplar outputs raise the baseline for what a passing session looks like. The system does not repeat errors it has already classified and resolved; it encodes the resolution and moves the standard forward.

This is how the architecture scales. The loop does not grow more complex as the system grows. It grows more precisely. Each cycle that runs produces a doctrine that governs the next cycle better than the one before it.

## The Closed-Loop Execution Model

Every agent action in this system completes a four-step loop. No step can be skipped. A loop that fails at any step halts and escalates---it does not continue, and it does not self-repair without human review.

**Step 1 --- Load.** The Directive Library loads first. In Antigravity, this fires automatically at session open---no manual trigger required. The system confirms which directives govern the session and loads each in sequence before any execution begins. A session that begins without a confirmed directive load is in immediate architectural violation. It halts.

**Step 2 --- Execute.** The Orchestrator delivers the Execution Script to the assigned Tier 3 agent. The agent executes the scoped task within its assigned module boundary. Every file is logged. Every interaction with an external system route through the adapter layer defined in INTEGRATIONS.md, without exception.

**Step 3 --- Verify.** An independent Verifier---a separate agent instance with no context of the execution session---receives the structured output and evaluates it against three criteria: directive compliance, module boundary integrity, and integration contract adherence. The Verifier does not optimize or suggest. It issues one of two verdicts: pass or halt.

**Step 4 --- Commit.** On a Verifier pass, the Orchestrator logs the session output and stages the commit. The commit advances to the developer branch and, on Tier 1 approval, to main. QA and human-on-the-loop review occur at Steps 7 and 8 of the Governed Development Cycle before the Verifier evaluates at Step 9. The commit message is formatted per DEVELOPMENT.md and references the task scope, the Verifier confirmation, and the session identifier. No commit reaches QA without a logged Verifier pass.

## The Directive Library

The governance architecture governed by this framework is organized using a Directive Library, a structured collection of domain-specific documents, each governing a precise area of the system with the depth that a single omnibus file cannot provide. COMPASS.md is the entry point and nothing more. It does not contain domain rules. Its sole function is to tell every agent, before every session, which directives to load and in what order.

The library is structured as follows. Each directive is a standalone governance document with a defined domain, load condition, and enforcement scope.

**COMPASS.md --- Master Session Brief.** Loaded first. Always. Its sole function is to list every directive the agent must load before the session begins and the order in which to load them. It contains no domain rules. In Antigravity, this load fires automatically at session open. Any session that begins without a confirmed COMPASS.md load is in architectural violation.

**DEVELOPMENT.md --- Development Standards.** Governs the Governed Development Cycle, branch naming conventions, commit format requirements, test coverage thresholds, and the role assignments that define which step belongs to which Tier. Every code-producing session loads this directive.

**SECURITY.md --- Data Boundary Law.** The hard constraint document for data handling. Defines precisely what the application may never store, transmit, or cache. Every integration adapter is built against this document. A session that produces output in violation of SECURITY.md generates an automatic halt verdict from the Verifier.

**UI-UX.md --- Interface Standards.** Governs every decision that affects what a user sees and interacts with. Design system specifications, component behavior, accessibility obligations, and brand compliance. @UI-UX.md can be invoked mid-session for targeted compliance checks without interrupting the session context.

**INTEGRATIONS.md --- System Adapter Contracts.** The formal specification for every adapter connecting this application to an external system. What the adapter may request, what it may receive, whether it holds read or write authority, and how it behaves when the external system is unavailable. No integration call is made outside the boundaries defined here.

**AUDIT.md --- Verification Protocol.** The Verifier's exclusive governing document. The Verifier loads AUDIT.md and nothing else. It defines the three verification criteria, halt conditions, escalation path, and the structured verdict format. Its isolation from all other directives is what preserves verification independence.

**TESTING.md --- Quality Assurance Standards.** Quality gate thresholds, test coverage minimums, offline behavior test requirements, the four-dimension scoring framework, and a remediation protocol for outputs that fall below threshold. Loaded by the QA agent at Step 8.

**ONBOARDING.md --- New Developer Protocol.** The entry procedure for any developer or agent joining the program. Directive load order confirmation, first-session rules, role authority map, and the three gates a new contributor must clear before touching production code.

## The Execution Script

The Directive Library defines the standing rules. The Execution Script applies those rules to a specific task, in a specific module, in a specific session. Before any Tier 3 agent writes a line of code, the Orchestrator generates an Execution Script that confirms which directives apply, defines the exact module boundary, specifies what the agent is building and what the output must look like, and states the conditions under which the agent must halt rather than proceed.

A complete Execution Script specifies the session identifier and date, the module in scope (one module per session, no exceptions), the task description, the files authorized for modification, the governing directives referenced by name and version, integration contracts in scope, the output contract, and halt conditions.

---

# IV. The Development Workflow

The nine-step table defining the Governed Development Cycle follows this paragraph (Table [TBD] --- table number to be confirmed upon final pagination per Comment 18). The Governed Development Cycle is the operational heartbeat of every development session on My Compass. It is not a checklist that a developer can choose to abbreviate under schedule pressure. It is a structural sequence where each step creates the precondition for the next step to be valid. Orchestrator's. The full ten-step sequence is defined in the table (#) immediately below. Steps 1--3 and Step 10 are the Orchestrator's responsibility. Steps 4--6 belong to the Module Agent. Step 7 belongs to the QA Agent. Step 8 is the human-on-the-loop review gate and cannot be skipped. Step 9 belongs exclusively to the independent Verifier, fully isolated from all execution contexts. No code merges with any branch without clearing all ten steps.

A branch is an isolated, independent copy of the codebase that can be modified without affecting any other version of the code. Think of it as a separate working environment where a developer or agent can make changes, run tests, and validate output before those changes are considered for inclusion in the authoritative codebase. Branches allow multiple work streams to proceed simultaneously without interfering with each other. In this framework, the branch structure mirrors the tier authority structure: the level of a branch in the hierarchy determines who has authority to modify it and under what conditions.

| Step | Action | Owner | Gate Condition |
|---|---|---|---|
| 1 | Directive Library loads automatically via Antigravity. Confirm load before proceeding. | Orchestrator | COMPASS.md confirmed loaded |
| 2 | Confirm module scope and task boundary with Tier 1. | Orchestrator + Tier 1 | Scope approved in writing |
| 3 | Orchestrator generates an Execution Script referencing all loaded directives. | Orchestrator | Script references all applicable directives |
| 4 | Execute within the assigned module boundary per Execution Script. | Module Agent (Tier 3) | No out-of-scope file writes |
| 5 | Log all file writes. Confirm no out-of-scope modifications. | Module Agent (Tier 3) | Boundary confirmation produced |
| 6 | Return structured output and boundary confirmation to Orchestrator. | Module Agent (Tier 3) | Output matches Execution Script contract |
| 7 | QA gate: integration tests, offline behavior verification, and quality gate scoring per TESTING.md. | QA Agent | All thresholds met per TESTING.md |
| 8 | Human on the Loop review. Read QA report, verify work, and approve or return with documented notes. This gate cannot be skipped. | Human on the Loop (Tier 1) | Human approval documented |
| 9 | Independent Verifier review---AUDIT.md only, fully isolated from execution context. | Verifier (independent) | A pass or halt verdict was issued |
| 10 | Tier 1 merge to main. Merging is the act of permanently incorporating verified, approved work into the authoritative production codebase. Only Tier 1 holds this authority. | Orchestrator + Tier 1 | Tier 1 explicit approval |

## The Branch Structure

The Git repository is organized into four branch levels that mirror the tiered authority structure. A branch is an isolated copy of the codebase where work can be done without affecting any other version. A commit is the act of saving completed work to a branch. A pull request is a formal submission of that work for review before it can advance to the next branch level. Work moves in one direction: upward. Branch protection rules enforcing Tier 1's

**Main --- Production.** The authoritative codebase. Always clean. Tier 1 merge authority is the only path here. Nothing reaches the main that has not cleared the full Governed Development Cycle and received explicit Tier 1 approval.

**QA / Staging Branch.** Where verified work stages are before Tier 1 review. QA runs here. Human review happens here. Nothing unverified enters it.

**Developer Branches.** One branch per developer, per session, per module. A session that produces a halt verdict results in the branch being deleted---main and QA/Staging are untouched.

**Breaker Branch.** A branch whose purpose is intentional failure. Destructive testing, dependency stress tests, and edge-case explorations run here. Nothing from the breaker branch advances to any other branch.

---

# V. Module Architecture Map

This section will map the My Compass codebase into discrete functional modules, document the boundary contract for each module, and define the approved adapter interfaces that prevent cross-module writes. It will also identify the files and directories that Tier 3 Module Agents may modify within each boundary.

---

# VI. The Five Constitutional Rules

These rules are drawn from SECURITY.md and DEVELOPMENT.md. They apply to every session, every agent, and every developer without exception. They are constitutional constraints with operational consequences. A violation does not trigger a warning. It triggers a halt.

**Rule 1 --- Expo Go Compatibility.** No native modules. No bare workflow dependencies. Every package must run in Expo Go without ejection from the managed workflow. A package that violates this rule crashes the application on the device. The Orchestrator confirms package compatibility before any install instruction reaches a Tier 3 agent.

**Rule 2 --- No Data Storage on Device.** No application built under this framework stores sensitive data on the device. Service record data, entitlement calculations, PII, and any data governed by the Privacy Act or CUI framework are retrieved at session start, held in application memory, and released when the session closes. This rule and Rule 3 operates in coordination, not in conflict: offline capability is achieved through a session-scoped, read-only cache of non-sensitive UI state only. No PII, no service record data, and no CUI is ever written to device storage under any condition.

**Rule 3 --- Offline Graceful Degradation.** Every module defines its offline behavior in the module architecture map, and that behavior is tested at the QA gate on every commit. A user operating this application in a degraded or disconnected environment must receive a defined, predictable response from every module---not a crash, not a blank screen, not a silent failure. Offline behavior is implemented through a session-scoped UI state cache containing only non-sensitive display data. This cache is cleared on session close and never persisted across sessions. It does not conflict with Rule 2 because it contains no Privacy Act-protected data, no CUI, and no personally identifiable information.

**Rule 4 --- Adapter Layer Only for Integrations.** No Tier 3 agent, no module, and no developer may communicate directly with a legacy system. Every integration routes through the adapter layer specified in INTEGRATIONS.md. A direct system call is an architectural violation. The session halts.

**Rule 5 --- Module Boundary Integrity.** No agent writes to files outside its assigned module boundary. The boundary is defined in the Execution Script generated for that session and verified independently by the Verifier at Step 7. A boundary violation generates a halt verdict. The branch is discarded.

---

# VII. Risk Posture: Failure Modes and Mitigations

This architecture was built with halt conditions at every layer of the governance chain. Before a failure reaches the production codebase, the boundary check stops it at Step 5. The Verifier catches it at Step 7. The QA gate catches it at Step 8. Tier 1 review catches it at Step 9. A halt is not a failure --- it is the system working exactly as designed. The architecture does not wait for something to break in production before establishing a response. Every failure mode below had a documented resolution protocol before the condition ever occurred.

When something does surface and over time, every system encounters conditions it did not anticipate, the architecture is built for that too. Every halt event, every edge case, and every unexpected condition is logged and routed directly into the Lessons Learned Repository. From there, it surfaces as a candidate for directive amendment, a Tier 1 governance update, or a raised QA threshold. The governance chain does not just catch failures. It converts them into a doctrine that makes the next cycle more precise. The system does not become more fragile as it encounters the unexpected. It becomes more governed.

The risk register below documents the known failure modes and their containment protocols. Each entry follows a consistent five-field format: the trigger is the specific condition that activates the failure; the containment boundary defines what is affected and what the architecture structurally protects; the resolution protocol is the exact sequence of steps to execute; the escalation path identifies who owns the decision when Tier 1 judgment is required; and return-to-known-good defines the observable system state that confirms recovery is complete and no ungoverned output has advanced.

## Technical Risks

**T-1 --- Module Boundary Violation.** A Tier 3 agent modifies files outside its assigned module scope. The scope of impact is contained to the active session; no production code is affected when caught at Step 7. Resolution requires the Verifier to issue a halt verdict with a specific file list, the Orchestrator to log the violation, session termination, and Tier 1 review of the Execution Script to identify scope ambiguity. No output from the violating session carries forward.

**T-2 --- Directive Conflict.** Two documents in the Directive Library contain contradictory rules governing the same condition. Every session that encounters the conflict halts at Step 1. The agent identifies the conflict and cites both directives. The Orchestrator halts and escalates to Tier 1, and Tier 1 resolves by amending the lower-precedence directive. The resolution is logged in CHANGELOG.md.

**T-3 --- Integration Adapter Failure.** A legacy system API returns an error response, a malformed payload, or becomes unavailable. Impact is isolated to the affected module; all other modules continue operating. The affected module activates its defined offline behavior.

**T-4 --- Package Compatibility Break.** A dependency update introduces a native module incompatible with the Expo Go managed workflow. The QA gate at Step 8 identifies the incompatibility before the commit advances. The package is rejected and logged in the blocked-packages register.

## Governance Risks

**G-1 --- Verifier Context Contamination.** The Verifier agent receives execution context from the Tier 3 session, compromising the independence of its verdict. The session is discarded, and a new Verifier instance is instantiated with AUDIT.md only, and Tier 3 output is resubmitted for independent evaluation.

**G-2 --- Scope Creep Under Schedule Pressure.** A developer or the Orchestrator expands the task scope mid-session without Tier 1 approval. The QA agent flags scope expansion by comparing output against the original Execution Script, the session halts, and the expanded scope is extracted and submitted through the full Governed Development Cycle.

**G-3 --- Developer Rotation Without Handoff.** A developer departs the program without completing a documented knowledge transfer. The incoming developer reads COMPASS.md and the complete Directive Library before writing any code, the Orchestrator conducts a load confirmation session, and the first commit is reviewed by Tier 1 regardless of QA gate status.

## Quality Gate Framework

Every output passes through a structured quality gate scored against four dimensions on a defined 1--10 scale. Scores of 1--3 indicate non-compliant output that cannot advance under any condition. Scores of 4--6 require directed remediation before re-evaluation. Scores of 7--9 pass the gate, with any score-specific notes logged for the session record. A score of 10 is exemplary and serves as a reference example for future sessions. The pass threshold is 7 in every dimension simultaneously. An output scoring below 7 in any single dimension is returned with a directed remediation brief specifying the dimension that failed, the specific deficiency, and the corrective action required. One remediation cycle is permitted; a second failure escalates to Tier 1 for task redefinition.

| Dimension | What It Measures | Threshold |
|---|---|---|
| Clarity | Is the output unambiguous? Can the next agent consume it without interpretation? | ≥ 7 / 10 |
| Specificity | Are all referenced files, functions, and contracts explicitly named? | ≥ 7 / 10 |
| Chain-Readiness | Is the output formatted for downstream consumption without transformation? | ≥ 7 / 10 |
| Output Definition | Does the output match the contract defined in the Execution Script? | ≥ 7 / 10 |

---

# VIII. Developer Onboarding: Continuity by Design

One of the most significant risks in any sustained software program is developer rotation. Knowledge that lives in a developer's memory departs with the developer. My Compass resolves this architecturally. The Directive Library, the Governed Development Cycle, and the Execution Script model contain everything a new contributor needs to operate within the governance model from day one.

| Role | Authority | Prerequisites |
|---|---|---|
| **Tier 1 --- Strategic Governance** | Directive Library ownership. Sole merge authority to main. | Full program context. The Directive Library is authored by this role. |
| Orchestrator | Session management. Execution Script generation. Verifier routing. | Complete Directive Library load confirmed. No production code authority. |
| Module Agent (Tier 3) | Feature code within assigned module boundary only. | Active Execution Script in hand. Boundary explicitly defined. |
| Verifier | Pass or halt verdict on Tier 3 output. | AUDIT.md only. Zero execution context. Full independence is required. |
| QA Agent | Quality gate scoring. Integration test execution. | TESTING.md loaded. Coverage thresholds confirmed. |

No developer begins production work until three gates are cleared: a confirmed review of the complete Directive Library, a load confirmation session conducted by the Orchestrator, and a first commit reviewed by Tier 1 independent of QA gate status.

---

# IX. Data Architecture and Phased Authorization Model

My Compass requires access to data governed by the Privacy Act, the CUI framework, and the DoD Risk Management Framework. These constraints are design requirements. The data architecture was built to satisfy them at every phase, not only after an Authority to Operate has been issued.

## The Three-Phase Authorization Model

**Phase 1 --- Proof of Concept (Current).** Data is synthetic only. No real Sailor records, no PII, no CUI. The schema mirrors the production relational model exactly. The complete application logic, the agentic workflow, the Directive Library governance model, and every module's offline behavior are demonstrated without a single authorized data access. The gate to Phase 2 is COMNAVPERSCOM sponsorship confirmed, and GCC High tenant provisioned.

**Phase 2 --- Authorized Pilot.** Real Sailor records for an authorized pilot group. CUI-classified data in scope. The environment is Microsoft 365 Government Community Cloud High (GCC High), FedRAMP High authorized. The data backend is Microsoft Dataverse for Government within the GCC High tenant. The gate to Phase 3 is the Authority to Operate issued through the DoD RMF process.

**Phase 3 --- Full Operational Deployment.** All Navy personnel data within the authorized scope of the ATO. The environment is a DoD-authorized production environment at enterprise scale, designed for 400,000-plus Sailor records with concurrent access at operational volume. All six legacy systems are connected through fully documented, individually authorized adapters. The outcome is My Compass operating as the unified administrative interface for the United States Navy.

## Data Governance Framework

Authorization to access Navy data is granted to a system---not to a developer, not to an agent, and not to a session. No PII is stored on the device. No component communicates directly with a legacy system; every data access route goes through a documented adapter with an explicit contract. My Compass is a read-primary system at the POC and Pilot phases. All data handling at Phase 2 and beyond operates under a System of Records Notice consistent with DoD Privacy Act requirements. Every data access event is logged.

---

# X. Conclusion

The Tiered Agentic Loop Architecture is not a theoretical framework. It is an operational governance model that has been demonstrated through the production of a fully functional, enterprise-quality iOS application. Every architectural decision documented in this paper---the three-tier authority structure, the closed-loop execution model, the Directive Library, the Governed Development Cycle, the five Constitutional Rules, the module boundary enforcement, the Lessons Learned Repository, and the phased data authorization model- is implemented, tested, and enforced in the current My Compass codebase.

The architecture proves three claims. First, AI agents can produce enterprise-quality code when operating within defined governance boundaries. Second, a structured human-on-the-loop model provides more rigorous quality assurance than traditional hand-off-based development lifecycles. Third, the institutional knowledge required to sustain and expand a software program can be encoded in the architecture itself, making the system resilient to developer rotation and organizational change.

My Compass provides the engineering foundation for a unified Sailor-facing administrative interface that reduces friction, encodes policy fidelity, and operates reliably in degraded connectivity environments. The governance model ensures that this capability is built correctly, documented completely, and positioned for responsible scaling through the phased authorization framework described in this paper.

---

# Addendum A: Three-Layer Governance Model

*[Diagram 2: Three-Layer Governance Model]*

---

# Addendum B: Developer Quick Reference

## Environment Setup

Clone the repository and open COMPASS.md before any other file. Load the complete Directive Library in sequence: DEVELOPMENT.md, SECURITY.md, UI-UX.md, INTEGRATIONS.md, AUDIT.md, TESTING.md, ONBOARDING.md. Complete the load confirmation session with the Orchestrator. The first production commit requires Tier 1 review regardless of QA gate status.

## Navy Terminology

| Term | Definition |
|---|---|
| Sailor | The end user of My Compass. Always capitalized. |
| Detailer | Navy assignment officer. |
| EDIPI | Electronic Data Interchange Personal Identifier. Unique key linking all Sailor data tables. |
| PCS | Permanent Change of Station. |
| PRD | Projected Rotation Date. |
| TIS / TIR | Time in Service / Time in Rate. |
| EAOS | End of Active Obligated Service. |
| Billet | An assigned position within a command. |
| JTR | Joint Travel Regulation. |
| CUI | Controlled Unclassified Information. |
| GCC High | Microsoft 365 Government Community Cloud High. |
| ATO | Authority to Operate. |
| RMF | Risk Management Framework. |
| Execution Script | Session-level instruction set generated by the Orchestrator. |
