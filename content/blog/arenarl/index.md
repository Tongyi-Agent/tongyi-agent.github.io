---
date: '2026-01-14T14:00:00+08:00'
title: '[Tongyi DeepResearch x Amap] ArenaRL: Scaling RL for Open-Ended Agents via Tournament-Based Relative Ranking'
showtoc: true
---

{{< button href="https://huggingface.co/papers/2601.06487" label="PAPER" external=true >}}
{{< button href="https://github.com/Alibaba-NLP/qqr" label="GITHUB" external=true >}}
{{< button href="https://huggingface.co/collections/Alibaba-NLP/arenarl" label="HUGGINGFACE" external=true >}}

Today, we are excited to announce the release and open-sourcing of **ArenaRL**, a novel comparative reinforcement learning (RL) method designed specifically for open-ended agents. Alongside the methodology, we are releasing the training framework and a comprehensive suite of benchmarks for full-lifecycle evaluation.

As AI evolves from passive question-answering to active problem-solving, enhancing an agent's planning and execution capabilities through Reinforcement Learning (RL) has become a focal point in the industry. While RL has demonstrated remarkable success in domains with verifiable outcomes—such as mathematics and code generation—it faces significant hurdles in open-ended tasks like complex travel planning or deep market research, where no single "golden answer" exists.

To address this, we propose **ArenaRL**. By moving away from unstable absolute scalar scoring and introducing a **Tournament Mechanism**, ArenaRL derives robust reward signals through pairwise comparisons. Crucially, it utilizes an optimized **Seeded Single-Elimination** topology to maintain computational complexity at a controllable linear level ($O(N)$), striking the optimal balance between performance and efficiency.

This method has already been validated in large-scale, real-world scenarios within **Amap's (Gaode Map)** core business operations.

# The Challenge: Discriminative Collapse in Open-Ended Tasks

In open-ended tasks—such as "Plan a cost-effective family trip"—traditional RL paradigms typically rely on a Reward Model to assign an absolute scalar score (Pointwise Scoring) to each generated trajectory.

However, in practice, we identified a critical failure mode in this approach: **Discriminative Collapse**.

1.  **Absence of Objective Ground Truth:** Open-ended tasks are inherently subjective. Unlike math problems, it is difficult for a Reward Model to assign a precise, objective absolute score.
    
2.  **Signal Dominated by Noise:** As the policy model improves, the quality of responses tends to converge (e.g., all scoring between 0.8 and 0.9). The Reward Model struggles to distinguish subtle differences between high-quality responses. Consequently, random noise in the scoring process drowns out the true advantage signal, leading to stagnation or even degeneration during training.
    

{{< figure src="https://cdn.jsdelivr.net/gh/Tongyi-Agent/tongyi-agent.github.io@main/img/arenarl/reward.png#center" width="100%">}}

## Core Method: ArenaRL — Relative Ranking via Tournaments

ArenaRL introduces a paradigm shift: **moving from absolute scoring to intra-group relative ranking**. We constructed a multi-dimensional evaluation arena to ensuring the model receives robust optimization signals even in complex open-ended domains.

### 1. Evaluation Mechanism: Process-Aware Pairwise Evaluation

The quality of an open-ended agent depends not just on the final answer, but on the reasoning process. ArenaRL introduces a **Process-Aware** evaluation mechanism that scrutinizes not only the outcome but also the logical tightness of the **Chain-of-Thought (CoT)** and the precision of **Tool Use**.

To mitigate **Positional Bias** when using LLMs as judges, we employ a bidirectional scoring protocol, ensuring that every "match" yields a fair and fine-grained result.

### 2. Core Algorithm: Tournament-Based Relative Ranking

ArenaRL generates a group of candidate responses for a single query, creating an "arena." The model engages in self-play, deriving relative advantage signals through pairwise comparisons.

This mechanism reframes reward modeling as an **intra-group relative ranking** problem. Through quantile reward mapping, discrete rankings are converted into normalized **Advantage Signals**. Compared to absolute scores, relative ranking is inherently more robust to noise, capable of capturing subtle nuances between high-quality trajectories and effectively circumventing "Discriminative Collapse."

{{< figure src="https://cdn.jsdelivr.net/gh/Tongyi-Agent/tongyi-agent.github.io@main/img/arenarl/method_final.png#center" width="100%">}}

### 3. Topology Optimization: From Round-Robin to Seeded Single-Elimination

To find the sweet spot between efficiency and accuracy, we systematically compared various tournament topologies in our paper. The experimental data (based on the Open-Travel benchmark) is shown below

| Topology | Comparison Cost | Avg. Win Rate |
| --- | --- | --- |
| Anchor-Based | $N-1$ | 27.8 |
| Swiss-System | $N \log N$ | 28.3 |
| Double-Elimination | $2N-2$ | 30.2 |
| **Seeded Single-Elimination** | $2N-2$ | **32.5** |
| **Round-Robin** | $N(N-1)/2$ | **32.9** |

Based on these findings, ArenaRL adopts the **Seeded Single-Elimination** architecture:

*   **Anchor-Based Seeding:** We use a baseline trajectory generated via greedy decoding as a "quality anchor" to quickly pre-rank candidates and establish seed positions. This prevents high-quality samples from "colliding" and eliminating each other in early rounds.
    
*   **Linear Elimination:** A binary tournament tree is constructed based on the seed order.
    

Experiments demonstrate that this mechanism strictly controls computational complexity at a linear $O(N)$ level while achieving an advantage estimation accuracy that closely approximates the full Round-Robin tournament.

# Open Data: Full-Lifecycle Benchmarks

The community currently lacks RL training and evaluation datasets specifically tailored for **Open-Ended Agents**. To fill this gap, we have constructed and open-sourced two major benchmarks: **Open-Travel** and **Open-DeepResearch**.

*   **Open-Travel (Co-developed with Amap):** Derived from real-world travel scenarios, covering 5 typical tasks such as vague intent understanding, multi-waypoint planning, and spatiotemporal constraint trade-offs. It replicates the complex decision-making environment of "multiple constraints, no standard solution."
    
*   **Open-DeepResearch:** Focuses on long-horizon information retrieval and report generation, evaluating the agent's ability in multi-step tool invocation, information verification, and deep synthesis.
    

To support the reproduction of the ArenaRL training pipeline, we have released the **Test Sets** and the **RL Training Sets (Prompts)** for these benchmarks:

| Dataset | Domain | RL Training Set | Test Set |
| --- | --- | --- | --- |
| **Open-Travel** | Complex Travel Planning | 1,626 | 250 |
| **Open-DeepResearch** | Deep Info Retrieval | 2,216 | 100 |
| Total |  | **3,842** | **350** |

# Experimental Results

We conducted extensive evaluations on Open-Travel, Open-DeepResearch, and general writing tasks. As shown below, ArenaRL achieves significant performance advantages over SFT baselines and traditional RL methods like GRPO and GSPO:

| Method | Open-Travel | Open-DeepResearch | General Writing |
| --- | --- | --- | --- |
| Closed-source Models |  |  |  |
| GPT-4o | 2.6 | 12.2 | 76.0 |
| Grok-4 | 16.8 | 34.8 | 84.7 |
| Gemini-2.5-pro | 10.6 | 28.3 | 85.4 |
| Claude-3.7-Sonnet | 31.6 | 19.1 | 76.6 |
| Fine-tuning & RL |  |  |  |
| SFT | 16.4 | 16.7 | 72.1 |
| GRPO | 16.4 | 25.2 | 73.6 |
| GSPO | 17.2 | 25.2 | 73.0 |
| **ArenaRL (Ours)** | **41.8** | **64.3** | **80.3** |

**Analysis:**

1.  **Complex Planning (Open-Travel):** In tasks involving vague intents and multi-dimensional constraints, ArenaRL achieved a **significant performance boost** compared to SFT and traditional RL. This demonstrates that the tournament mechanism effectively incentivizes the model to escape local optima and explore superior planning strategies.
    
2.  **Long-Horizon Tasks (Open-DeepResearch):** Traditional RL methods often produce unusable outputs due to "length bias" in long-context tasks. ArenaRL improved the **Valid Generation Rate to ~99%**, effectively solving the instruction-following challenge in long-text scenarios.
    
3.  **General Writing:** On three major general writing benchmarks, ArenaRL also performed exceptionally well, proving that the method possesses strong generalization capabilities beyond tool-use agents.
    

## Real-World Application: Amap (Gaode Map)

ArenaRL has not only excelled in academic benchmarks but has also been successfully validated in **Amap's real-world business scenarios**. We evaluated it across two dimensions: Deterministic Search and Open-Ended Planning.

*   **Deterministic POI Search:** In POI search tasks defined by explicit rules and intense competition, ArenaRL demonstrated extreme adaptability to rigid constraints. Compared to the baseline, search accuracy improved by **75% to 83%**. This proves that even in deterministic settings, the tournament mechanism can keenly capture subtle quality differences, pushing performance beyond existing bottlenecks.
    
*   **Complex Open-Ended Planning:** Addressing multi-step reasoning tasks—such as _"Find a quiet bar near the Bund with a river-view terrace for a date"_ or _"Inter-city travel with luggage and time constraints"_—the core business metric rose from **69% to 80%**. The model exhibited stronger logical consistency, effectively handling vague user intents and making optimal trade-offs between multiple constraints (time, cost, preference), significantly enhancing user satisfaction in complex tail scenarios.
    

# System Architecture & Ecosystem

To empower the developer community, we have simultaneously open-sourced the RL training/test data and the `qqr` training framework. `qqr` is a lightweight, non-intrusive extension library built on [`slime`](https://github.com/THUDM/slime), designed specifically for open-ended agent training.

*   **ArenaRL Algorithm:** Full implementation of the core algorithms described in the paper. It includes built-in topologies for Anchor-Based, Round-Robin, Swiss-System, Double-Elimination, and Seeded Single-Elimination tournaments.
    
*   **Designed for Open-Ended Agents:** Specifically engineered to tackle discriminative collapse in complex, open-ended tasks, ensuring continuous policy improvement via relative ranking even when reward model scores stagnate.
    
*   **MCP Support:** Seamlessly integration with the MCP standardizes the decoupling of LLM inference and tool environments. Developers can reuse existing MCP Servers as training environments without rewriting interfaces.
    
*   **High-Performance Training:** Built on top of [`slime`](https://github.com/THUDM/slime)to deliver high-throughput, distributed rollout generation and training for large-scale agent evolution.
    

We hope ArenaRL provides the community with a practical methodology for agent evolution, propelling us from Imitation Learning toward a broader era of **Self-Evolution**.

## 🔗 Open Source Links

*   **Paper:** [https://huggingface.co/papers/2601.06487](https://huggingface.co/papers/2601.06487)
    
*   **GitHub:** [https://github.com/Alibaba-NLP/qqr](https://github.com/Alibaba-NLP/qqr)
    
*   **HuggingFace**: [https://huggingface.co/collections/Alibaba-NLP/arenarl](https://huggingface.co/collections/Alibaba-NLP/arenarl)