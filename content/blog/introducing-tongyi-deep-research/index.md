---
date: '2025-09-16T14:39:24+08:00'
draft: true
title: 'Tongyi DeepResearch: A New Era of Open-Source AI Researchers'
---

{{< figure src="/img/introducing-tongyi-deep-research/final_results.png#center" width="100%">}}

## From Chatbot to Agent – Achieving SOTA with an Agentic 30B Model

We are proud to present **Tongyi DeepResearch**, the first fully open-source Web Agent to achieve performance on par with OpenAI's DeepResearch across a comprehensive suite of benchmarks. Tongyi DeepResearch demonstrates state-of-the-art results, scoring 32.9 on the academic reasoning task Humanity's Last Exam (HLE), 43.4 on BrowseComp and 46.7 on BrowseComp-ZH in extremely complex information-seeking tasks, and achieving a score of 75 on the user-centric xbench-DeepSearch benchmark, systematically outperforming all existing proprietary and open-source Deep Research agents.

Beyond the model, we share a complete and battle-tested methodology for creating such advanced agents. Our contribution details a novel data synthesis solution applied across the entire training pipeline, from Agentic Continual Pre-training (CPT) and Supervised Fine-Tuning (SFT) for cold-starting, to the final Reinforcement Learning (RL) stage.  For RL, we provide a full-stack solution, including algorithmic innovations, automated data curation, and robust infrastructure. For inference, the vanilla ReAct framework showcases the model's powerful intrinsic capabilities without any prompt engineering, while the advanced Heavy Mode (test-time-scaling) demonstrates the upper limits of its complex reasoning and planning potential.

## Continual Pre-training and Post-training Empowered by Fully Synthetic Data

The model's capabilities are built upon a novel, multi-stage data strategy designed to create vast and high-quality agentic training data without relying on costly human annotation.

### Continual Pre-training Data

We introduce Agentic CPT to deep research agent training, creating powerful agentic foundation models for post-training. We propose AgentFounder, a systematic and scalable solution for large-scale data synthesis that creates a data flywheel with data from the post-training pipeline.

**Data Reorganization and Question Construction.** We continuously collect data from various sources, including documents, publicly available crawled data, knowledge graphs, and historical trajectories and tool invocation records (e.g., search results with links). As shown in the figure, these diverse data sources are restructured into an entity-anchored open-world knowledge memory. Based on randomly sampled entities and their corresponding knowledge, we generate multi-style (question,answer) pairs.

{{< figure src="/img/introducing-tongyi-deep-research/trajectory_systhesis.png#center" width="100%">}}

**Action Synthesis.**  Based on diverse problems and historical trajectories, we construct first-order action synthesis data and higher-order action synthesis data. Our method enables large-scale and comprehensive exploration of the potential reasoning-action space within offline environments, thereby thereby eliminating the need for additional commercial tool API calls. Specifically, for the higher-order action synthesis, we remodel trajectories as multi-step decision-making processes to enhance the model's decision-making capabilities.

### Post-training Data

**High-quality synthetic QA pairs**

We develop an end-to-end solution for synthetic data generation. This fully automated process requires no human intervention to construct super-human quality datasets, designed to push the boundaries of AI agent performance. Through long-term exploration and iteration—from early methods like reverse-engineering QA pairs from clickstreams ([WebWalker](https://arxiv.org/abs/2501.07572)) to the more systematic graph-based synthesis ([WebSailor](https://arxiv.org/abs/2507.02592) and WebSailor-V2), then the formalized task modeling ([WebShaper](https://arxiv.org/abs/2507.15061))—our approach ensures both exceptional data quality and massive scalability, breaking through the upper limits of model capabilities.

To address complex, high-uncertainty questions, we synthesize web-based QA data through a novel pipeline. The process begins by constructing a **highly interconnected knowledge graph via random walks and isomorphic tables** **towards tabular data fusion** from real-world websites , ensuring a realistic information structure. We then sample subgraphs and subtables to generate initial questions and answers. The crucial step involves intentionally increasing difficulty by strategically obfuscating or blurring information within the question. This practical approach is grounded in a complete theoretical framework, where we formally model QA difficulty as a series of controllable "atomic operations" (e.g., merging entities with similar attributes) on entity relationships, allowing us to systematically increase complexity.

To further reduce inconsistencies between the organized information structure and the reasoning structure of QA, enable more controllable difficulty and structure scaling of reasoning, we proposed a formal modeling of the information-seeking problem based on set theory. With this formalization, we developed agents that expands the problem in a controlled manner, and minimizes reasoning shortcuts and structural redundancy, leading to further improved QA quality. Moreover, this formal modeling also allows for efficient verification of QA correctness, effectively addressing the challenge of validating synthetic information-seeking data for post-training.

Furthermore, we have developed an automated data engine to scale up the creation of PhD-level research questions. This engine begins with a multi-disciplinary knowledge base, generating "seed" QA pairs that require multi-source reasoning. Each seed then enters a self-guided loop of "iterative complexity upgrades", where a question-crafting agent is equipped with a powerful toolset including web search, academic retrieval, and a Python execution environment. In each iteration, the agent expands knowledge boundaries, deepens conceptual abstraction, and even constructs computational tasks, creating a virtuous cycle where the output of one round becomes the more complex input for the next, ensuring a controllable and systematic escalation of task difficulty.

**Beyond High-Quality QA**

To maximize a model's capabilities in reasoning, planning, and tool use, we introduce IterResearch, an innovative Agent paradigm (see below for more details). By dynamically reconstructing a streamlined workspace in each turn, it replaces the traditional approach of endlessly accumulating context. This method fully unleashing the model's reasoning potential and ensuring that each of the model's decisions is the result of careful deliberation.

Through this process, we have created not just "problems", but "golden examples" of how to solve them in a step-by-step, methodical manner. This dataset, composed of rigorously selected, high-quality problem-solving examples, serves to fully unlock the model's potential in reasoning, planning, and tool use.

## Rollout Mode

We have conducted extensive exploration into the rollout paradigms for DeepResearch-type agents. As a result, our final model supports multiple rollout formats, including the native ReAct Mode and the context-managing Heavy Mode.

### Native ReAct Mode

Our model demonstrates excellent performance using the native ReAct reasoning paradigm without any prompt engineering. It strictly adheres to the Thought-Action-Observation cycle, performing multiple iterations to solve problems. With a model context length of 128K, it can handle a large number of interaction rounds, fully achieving scaling in its interaction with the environment. ReAct's simplicity and universality provide the clearest benchmark for a model's intrinsic capabilities and the efficacy of our training pipeline.

Our choice of ReAct is heavily informed by "The Bitter Lesson", which posits that general methods leveraging scalable computation ultimately outperform approaches that rely on complex, human-engineered knowledge and intricate designs.

### Heavy Mode

In addition to the native ReAct mode, we have developed a "Heavy Mode" for complex, multi-step research tasks. This mode is built on our new IterResearch paradigm, designed to push the agent's capabilities to their limit.

The IterResearch paradigm was created to solve the "cognitive suffocation" and "noise pollution" that occurs when agents accumulate all information into a single, ever-expanding context. Instead, IterResearch deconstructs a task into a series of "research rounds".

In each round, the agent reconstructs a streamlined workspace using only the most essential outputs from the previous round. Within this focused workspace, the agent analyzes the problem, integrates key findings into a continuously evolving central report, and then decides its next action—either gathering more information or providing a final answer. This iterative process of "synthesis and reconstruction" allows the agent to maintain a clear "cognitive focus" and high reasoning quality throughout long tasks.

Building on this, we propose the Research-Synthesis framework. In this model, multiple Research Agents use the IterResearch process to explore a problem in parallel. A final Synthesis Agent then integrates their refined reports and conclusions to produce a more comprehensive final answer. This parallel structure enables the model to consider a wider range of research paths within a limited context window, pushing its performance to the limit.

{{< figure src="/img/introducing-tongyi-deep-research/heavy_mode.png#center" width="100%">}}

## End-to-End Agent Training Pipeline

{{< figure src="/img/introducing-tongyi-deep-research/pipeline.png#center" width="100%">}}

Training an agentic model like this required us to **rethink the entire model training pipeline**, from pre-training to fine-tuning to reinforcement learning. We established a new paradigm for agent model training that connects _Agentic CPT_ → _Agentic_ _SFT_ → _Agentic RL_, creating a seamless end-to-end training loop for an AI agent. Here's how we tackled the final stage with reinforcement learning, which was crucial for aligning the agent's behavior with high-level goals:

### On-Policy Agent Reinforcement Learning (RL)

Constructing a high-quality agent through RL is a complex system engineering challenge; if this entire development process is viewed as a "reinforcement learning" loop, any instability or lack of robustness in its components can lead to erroneous "reward" signals. We will now share our practices in RL, covering both the algorithmic and infrastructure sides.

For RL algorithm,  we made several algorithmic breakthroughs, using a customized on-policy **Group Relative Policy Optimization (GRPO).** We employ a strictly on-policy training regimen, ensuring that the learning signal is always relevant to the model's current capabilities. The training objective is optimized using a token-level policy gradient loss. Second, to further reduce variance in the advantage estimation, we adopt a leave-one-out strategy. Furthermore, we employ a conservative strategy for negative samples, having observed that an unfiltered set of negative trajectories significantly degrades training stability. This can manifest as a "format collapse" phenomenon after extended training. To mitigate this, we selectively exclude certain negative samples from the loss calculation, for instance, those that do not yield a final answer because they exceed a length limit. For the sake of efficiency, we do not employ dynamic sampling. We instead leverage larger batch and group sizes, which serve to maintain smaller variance and provide adequate supervision.

{{< figure src="/img/introducing-tongyi-deep-research/rl_curve.png#center" width="100%">}}

The training dynamics demonstrate effective learning, with a consistent upward trend in reward. Meanwhile, policy entropy remains consistently high, indicating sustained exploration and preventing premature convergence. We attribute this to the non-stationary nature of the web environment, which naturally fosters a robust, adaptive policy and obviates the need for explicit entropy regularization.

We consider that the algorithm is important but not the only decisive factor in the success of Agentic RL. We have experimented with many different algorithms and tricks, and find that **data and stability of the training environment** **are likely the more critical components in determining whether the RL works**. Interestingly, we have tested to train the model directly on the BrowseComp testing set, but the results are substantially poorer than when using our synthetic data. We hypothesize that this disparity arises because the synthetic data offers a more consistent distribution, which allows the model to be more effectively tailored. Conversely, the human-annotated data (such as BrowseComp) is inherently noisier. Given its limited scale, it is difficult to approximate a learnable underlying distribution, which consequently hinders the model to learn and generalize from it.

{{< figure src="/img/introducing-tongyi-deep-research/rl_arch.png#center" width="100%">}}

On the **infrastructure side**, training an agent with tools required us to develop a highly stable and efficient environment:

*   **Synthetic Training Environment:** Relying on live web APIs for development is expensive, slow, and inconsistent. We addressed this by creating **a simulated training environment using an offline Wikipedia database and a custom tool suite**. By adapting our data pipeline to generate high-quality, complex tasks for this environment, we created a cost-effective, fast, and controllable platform that dramatically accelerates our research and iteration.
    
*   **Stable & Efficient Tool Sandbox:** To ensure reliable tool use during agent training and evaluation, we developed a unified sandbox. The sandbox handles concurrency and failure gracefully by caching results, retrying failed calls, and using redundant providers as fallbacks (e.g., a backup search API). This provides the agent with a fast and deterministic experience, which is crucial for preventing tool errors from corrupting its learning trajectory.
    
*   **Automatic Data Curation:** Data is the core driver of model capability enhancement; its importance even surpasses that of the algorithm. The quality of the data directly determines the upper bound on the model's ability to generalize to out-of-distribution scenarios through self-exploration. To address this challenge, **we optimize data in real time, guided by training dynamics.** This optimization is achieved through a fully automated data synthesis and filtering pipeline that dynamically adjusts the training set. By closing the loop between data generation and model training, this approach not only ensures training stability but also delivers substantial performance gains.
    
*   **On-Policy Asynchronous Framework:** We implemented a custom **step-level asynchronous RL training loop** on top of rLLM. Multiple agent instances interact with the (simulated or real) environment in parallel, each producing trajectories. 
    

Through these measures, we "closed the loop" on agent training. Starting from a raw model, we did ACT pre-training to initialize tool-use skills, then supervised finetuning on expert-like data to cold start, and finally on-policy RL to let the model conduct self-evolution. This full-stack approach – now proven with Tongyi DeepResearch – **presents a new paradigm for training AI agents** that can robustly solve complex tasks in dynamic environments.

_(Our RL approach is inspired by several past work from_ [_Agentica_](https://agentica-project.com/index.html)_. We adapt their_ [_rLLM_](https://github.com/rllm-org/rllm) _framework and extend it to train our web agents.)_

## Real-World Applications and Impact

Tongyi DeepResearch is not just a research showcase; it’s already powering real applications within Alibaba and beyond, demonstrating its value in practical scenarios:

*   **Gaode Mate (Map & Navigation Agent)**: Collaborating with Amap (Gaode) Team, we co-developed "**Xiao Gao**," an AI copilot that leverages the app's rich toolset. It can execute complex travel planning commands, like creating a multi-day driving tour that includes specific scenic spots and pet-friendly hotels. Through multi-step reasoning, Xiao Gao autonomously researches and integrates information to produce a detailed, personalized itinerary, offering an intelligent planning experience that far surpasses standard navigation.

{{< figure src="/img/introducing-tongyi-deep-research/xiaogao.png#center" width="100%">}}

*   **Tongyi FaRui (Legal Research Agent):**  Empowered by our DeepResearch architecture, FaRui now functions as a true legal agent. It autonomously executes complex, multi-step research tasks that mirror a junior attorney's workflow—systematically retrieving case law, cross-referencing statutes, and synthesizing analysis. Crucially, all conclusions are grounded in verifiable judicial sources and delivered with precise case and statute citations, ensuring professional-grade accuracy and credibility.
    
{{< figure src="/img/introducing-tongyi-deep-research/farui.png#center" width="100%">}}

## Limitations

Our future work will address three key limitations. First, the current 128k context length is still insufficient for the most complex long-horizon tasks, requiring us to explore expanded context windows and more sophisticated information management. Second, our training pipeline's scalability remains unproven on foundation models significantly larger than our 30B-scale MoE, and we plan to validate our methods on larger-scale models. Lastly, we aim to improve the efficiency of our reinforcement learning framework by investigating techniques like partial rollouts, which will necessitate solving the challenges of off-policy training, such as distributional shift.

## Series Work

{{< figure src="/img/introducing-tongyi-deep-research/family.png#center" width="100%">}}

Tongyi DeepResearch also has an extensive deep research agent family. You can find more information in the following papers:

\[1\] [WebWalker: Benchmarking LLMs in Web Traversal](https://arxiv.org/pdf/2501.07572)

\[2\] [WebDancer: Towards Autonomous Information Seeking Agency](https://arxiv.org/pdf/2505.22648)

\[3\] [WebSailor: Navigating Super-human Reasoning for Web Agent](https://arxiv.org/pdf/2507.02592)

\[4\] [WebShaper: Agentically Data Synthesizing via Information-Seeking Formalization](https://arxiv.org/pdf/2507.15061)

\[5\] [WebWatcher: Breaking New Frontier of Vision-Language Deep Research Agent](https://arxiv.org/pdf/2508.05748)

\[6\] WebResearch: Unleashing reasoning capability in Long-Horizon Agents

\[7\] ReSum: Unlocking Long-Horizon Search Intelligence via Context Summarization

\[8\] WebWeaver: Structuring Web-Scale Evidence with Dynamic Outlines for Open-Ended Deep Research

\[9\] WebSailor-V2: Bridging the Chasm to Proprietary Agents via Synthetic Data and Scalable Reinforcement Learning

\[10\] Scaling Agents via Continual Pre-training

\[11\] Towards General Agentic Intelligence via Environment Scaling

Our team has a long-standing commitment to the research and development of deep research agents. Over the past six months, we have consistently published one technical report per month, totaling five to date. Today, we are excited to simultaneously release six new reports and share our Tongyi DeepResearch-30B-A3B model with the community.

Stay tuned for our next generation of agentic models.

```bibtex
@misc{tongyidr,
  author={Tongyi DeepResearch Team},
  title={Tongyi-DeepResearch},
  year={2025},
  howpublished={\url{https://github.com/Alibaba-NLP/DeepResearch}}
}
```
