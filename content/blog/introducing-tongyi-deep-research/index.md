---
date: '2025-09-16T14:39:24+08:00'
title: 'Tongyi DeepResearch: A New Era of Open-Source AI Researchers'
showtoc: true
---

{{< button href="https://github.com/Alibaba-NLP/DeepResearch" label="GITHUB" external=true >}}
{{< button href="https://huggingface.co/Alibaba-NLP/Tongyi-DeepResearch-30B-A3B" label="HUGGINGFACE" external=true >}}
{{< button href="https://modelscope.cn/models/iic/Tongyi-DeepResearch-30B-A3B" label="MODELSCOPE" external=true >}}
{{< button href="https://tongyi-agent.github.io/showcase/" label="SHOWCASE" external=true >}}

{{< figure src="/img/introducing-tongyi-deep-research/final_results.png#center" width="100%">}}

## From Chatbot to Autonomous Agent

We are proud to present **Tongyi DeepResearch**, the first fully open&#8209;source Web Agent to achieve performance on par with OpenAI's DeepResearch across a comprehensive suite of benchmarks. Tongyi DeepResearch demonstrates state&#8209;of&#8209;the&#8209;art results, scoring 32.9 on the academic reasoning task Humanity's Last Exam (HLE), 43.4 on BrowseComp and 46.7 on BrowseComp&#8209;ZH in extremely complex information&#8209;seeking tasks, and achieving a score of 75 on the user&#8209;centric xbench&#8209;DeepSearch benchmark, systematically outperforming all existing proprietary and open&#8209;source Deep Research agents.

Beyond the model, we share a complete and battle&#8209;tested methodology for creating such advanced agents. Our contribution details a novel data synthesis solution applied across the entire training pipeline, from Agentic Continual Pre&#8209;training (CPT) and Supervised Fine&#8209;Tuning (SFT) for cold&#8209;starting, to the final Reinforcement Learning (RL) stage.  For RL, we provide a full&#8209;stack solution, including algorithmic innovations, automated data curation, and robust infrastructure. For inference, the vanilla ReAct framework showcases the model's powerful intrinsic capabilities without any prompt engineering, while the advanced Heavy Mode (test&#8209;time&#8209;scaling) demonstrates the upper limits of its complex reasoning and planning potential.

## Continual Pre&#8209;training and Post&#8209;training Empowered by Fully Synthetic Data

### Continual Pre&#8209;training Data

We introduce Agentic CPT to deep research agent training, creating powerful agentic foundation models for post&#8209;training. We propose AgentFounder, a systematic and scalable solution for large&#8209;scale data synthesis that creates a data flywheel with data from the post&#8209;training pipeline.

**Data Reorganization and Question Construction.** We continuously collect data from various sources, including documents, publicly available crawled data, knowledge graphs, and historical trajectories and tool invocation records (e.g., search results with links). As shown in the figure, these diverse data sources are restructured into an entity&#8209;anchored open&#8209;world knowledge memory. Based on randomly sampled entities and their corresponding knowledge, we generate multi&#8209;style (question,answer) pairs.

{{< figure src="/img/introducing-tongyi-deep-research/trajectory_systhesis.png#center" width="100%">}}

**Action Synthesis.**  Based on diverse problems and historical trajectories, we construct first&#8209;order action synthesis data and higher&#8209;order action synthesis data. Our method enables large&#8209;scale and comprehensive exploration of the potential reasoning&#8209;action space within offline environments, thereby thereby eliminating the need for additional commercial tool API calls. Specifically, for the higher&#8209;order action synthesis, we remodel trajectories as multi&#8209;step decision&#8209;making processes to enhance the model's decision&#8209;making capabilities.

### Post-training Data

**High-quality synthetic QA pairs**

We develop an end&#8209;to&#8209;end solution for synthetic data generation. This fully automated process requires no human intervention to construct super&#8209;human quality datasets, designed to push the boundaries of AI agent performance. Through long&#8209;term exploration and iteration&#8209;from early methods like reverse&#8209;engineering QA pairs from clickstreams ([WebWalker](https://arxiv.org/abs/2501.07572)) to the more systematic graph&#8209;based synthesis ([WebSailor](https://arxiv.org/abs/2507.02592) and WebSailor&#8209;V2), then the formalized task modeling ([WebShaper](https://arxiv.org/abs/2507.15061))&#8209;our approach ensures both exceptional data quality and massive scalability, breaking through the upper limits of model capabilities.

To address complex, high&#8209;uncertainty questions, we synthesize web&#8209;based QA data through a novel pipeline. The process begins by constructing a **highly interconnected knowledge graph via random walks and isomorphic tables** **towards tabular data fusion** from real&#8209;world websites , ensuring a realistic information structure. We then sample subgraphs and subtables to generate initial questions and answers. The crucial step involves intentionally increasing difficulty by strategically obfuscating or blurring information within the question. This practical approach is grounded in a complete theoretical framework, where we formally model QA difficulty as a series of controllable "atomic operations" (e.g., merging entities with similar attributes) on entity relationships, allowing us to systematically increase complexity.

To further reduce inconsistencies between the organized information structure and the reasoning structure of QA, enable more controllable difficulty and structure scaling of reasoning, we proposed a formal modeling of the information&#8209;seeking problem based on set theory. With this formalization, we developed agents that expands the problem in a controlled manner, and minimizes reasoning shortcuts and structural redundancy, leading to further improved QA quality. Moreover, this formal modeling also allows for efficient verification of QA correctness, effectively addressing the challenge of validating synthetic information&#8209;seeking data for post&#8209;training.

Furthermore, we have developed an automated data engine to scale up the creation of PhD&#8209;level research questions. This engine begins with a multi&#8209;disciplinary knowledge base, generating "seed" QA pairs that require multi&#8209;source reasoning. Each seed then enters a self&#8209;guided loop of "iterative complexity upgrades", where a question&#8209;crafting agent is equipped with a powerful toolset including web search, academic retrieval, and a Python execution environment. In each iteration, the agent expands knowledge boundaries, deepens conceptual abstraction, and even constructs computational tasks, creating a virtuous cycle where the output of one round becomes the more complex input for the next, ensuring a controllable and systematic escalation of task difficulty.

**Bootstrapping Agent Capabilities with SFT Cold&#8209;starting**

To bootstrap the model's initial capabilities, we constructed a set of SFT trajectories via rejection sampling, based on the ReAct and IterResearch frameworks (for details, see below). On one hand, ReAct, as a classic and foundational multi&#8209;turn reasoning format, instills rich reasoning behaviors and reinforces the model's ability to adhere to structured formats. **On the other hand, we introduce IterResearch, an innovative agent paradigm (detailed below).** It unleashes the model's full reasoning potential by dynamically reconstructing a streamlined workspace in each turn, ensuring that every decision is deliberate and well&#8209;considered. Leveraging IterResearch, we constructed a set of trajectories that integrate reasoning, planning, and tool&#8209;use, thereby strengthening the model's capacity for sustained planning when confronted with complex 


## Rollout Mode

We have conducted extensive exploration into the rollout paradigms for DeepResearch&#8209;type agents. As a result, our final model supports multiple rollout formats, including the native ReAct Mode and the context&#8209;managing Heavy Mode.

### Native ReAct Mode

Our model demonstrates excellent performance using the native ReAct reasoning paradigm without any prompt engineering. It strictly adheres to the Thought&#8209;Action&#8209;Observation cycle, performing multiple iterations to solve problems. With a model context length of 128K, it can handle a large number of interaction rounds, fully achieving scaling in its interaction with the environment. ReAct's simplicity and universality provide the clearest benchmark for a model's intrinsic capabilities and the efficacy of our training pipeline.

Our choice of ReAct is heavily informed by "The Bitter Lesson", which posits that general methods leveraging scalable computation ultimately outperform approaches that rely on complex, human&#8209;engineered knowledge and intricate designs.

### Heavy Mode

In addition to the native ReAct mode, we have developed a "Heavy Mode" for complex, multi&#8209;step research tasks. This mode is built on our new IterResearch paradigm, designed to push the agent's capabilities to their limit.

The IterResearch paradigm was created to solve the "cognitive suffocation" and "noise pollution" that occurs when agents accumulate all information into a single, ever&#8209;expanding context. Instead, IterResearch deconstructs a task into a series of "research rounds".

{{< figure src="/img/introducing-tongyi-deep-research/iter_research.png#center" width="100%">}}

In each round, the agent reconstructs a streamlined workspace using only the most essential outputs from the previous round. Within this focused workspace, the agent analyzes the problem, integrates key findings into a continuously evolving central report, and then decides its next action&#8209;either gathering more information or providing a final answer. This iterative process of "synthesis and reconstruction" allows the agent to maintain a clear "cognitive focus" and high reasoning quality throughout long tasks.

Building on this, we propose the Research&#8209;Synthesis framework. In this model, multiple Research Agents use the IterResearch process to explore a problem in parallel. A final Synthesis Agent then integrates their refined reports and conclusions to produce a more comprehensive final answer. This parallel structure enables the model to consider a wider range of research paths within a limited context window, pushing its performance to the limit.

{{< figure src="/img/introducing-tongyi-deep-research/heavy_mode.png#center" width="100%">}}

## End-to&#8209;End Agent Training Pipeline

{{< figure src="/img/introducing-tongyi-deep-research/pipeline.png#center" width="100%">}}

Training an agentic model like this required us to **rethink the entire model training pipeline**, from pre&#8209;training to fine&#8209;tuning to reinforcement learning. We established a new paradigm for agent model training that connects _Agentic CPT_ → _Agentic_ _SFT_ → _Agentic RL_, creating a seamless end&#8209;to&#8209;end training loop for an AI agent. Here's how we tackled the final stage with reinforcement learning, which was crucial for aligning the agent's behavior with high&#8209;level goals:

### On&#8209;Policy Agent Reinforcement Learning (RL)

Constructing a high&#8209;quality agent through RL is a complex system engineering challenge; if this entire development process is viewed as a "reinforcement learning" loop, any instability or lack of robustness in its components can lead to erroneous "reward" signals. We will now share our practices in RL, covering both the algorithmic and infrastructure sides.

For RL algorithm,  we made several algorithmic breakthroughs, using a customized on&#8209;policy **Group Relative Policy Optimization (GRPO).** We employ a strictly on&#8209;policy training regimen, ensuring that the learning signal is always relevant to the model's current capabilities. The training objective is optimized using a token&#8209;level policy gradient loss. Second, to further reduce variance in the advantage estimation, we adopt a leave&#8209;one&#8209;out strategy. Furthermore, we employ a conservative strategy for negative samples, having observed that an unfiltered set of negative trajectories significantly degrades training stability. This can manifest as a "format collapse" phenomenon after extended training. To mitigate this, we selectively exclude certain negative samples from the loss calculation, for instance, those that do not yield a final answer because they exceed a length limit. For the sake of efficiency, we do not employ dynamic sampling. We instead leverage larger batch and group sizes, which serve to maintain smaller variance and provide adequate supervision.

{{< figure src="/img/introducing-tongyi-deep-research/rl_curve.png#center" width="100%">}}

The training dynamics demonstrate effective learning, with a consistent upward trend in reward. Meanwhile, policy entropy remains consistently high, indicating sustained exploration and preventing premature convergence. We attribute this to the non&#8209;stationary nature of the web environment, which naturally fosters a robust, adaptive policy and obviates the need for explicit entropy regularization.

We consider that the algorithm is important but not the only decisive factor in the success of Agentic RL. We have experimented with many different algorithms and tricks, and find that **data and stability of the training environment** **are likely the more critical components in determining whether the RL works**. Interestingly, we have tested to train the model directly on the BrowseComp testing set, but the results are substantially poorer than when using our synthetic data. We hypothesize that this disparity arises because the synthetic data offers a more consistent distribution, which allows the model to be more effectively tailored. Conversely, the human&#8209;annotated data (such as BrowseComp) is inherently noisier. Given its limited scale, it is difficult to approximate a learnable underlying distribution, which consequently hinders the model to learn and generalize from it.

{{< figure src="/img/introducing-tongyi-deep-research/rl_arch.png#center" width="100%">}}

On the **infrastructure side**, training an agent with tools required us to develop a highly stable and efficient environment:

*   **Synthetic Training Environment:** Relying on live web APIs for development is expensive, slow, and inconsistent. We addressed this by creating **a simulated training environment using an offline Wikipedia database and a custom tool suite**. By adapting our data pipeline to generate high&#8209;quality, complex tasks for this environment, we created a cost&#8209;effective, fast, and controllable platform that dramatically accelerates our research and iteration.
    
*   **Stable & Efficient Tool Sandbox:** To ensure reliable tool use during agent training and evaluation, we developed a unified sandbox. The sandbox handles concurrency and failure gracefully by caching results, retrying failed calls, and using redundant providers as fallbacks (e.g., a backup search API). This provides the agent with a fast and deterministic experience, which is crucial for preventing tool errors from corrupting its learning trajectory.
    
*   **Automatic Data Curation:** Data is the core driver of model capability enhancement; its importance even surpasses that of the algorithm. The quality of the data directly determines the upper bound on the model's ability to generalize to out&#8209;of&#8209;distribution scenarios through self&#8209;exploration. To address this challenge, **we optimize data in real time, guided by training dynamics.** This optimization is achieved through a fully automated data synthesis and filtering pipeline that dynamically adjusts the training set. By closing the loop between data generation and model training, this approach not only ensures training stability but also delivers substantial performance gains.
    
*   **On&#8209;Policy Asynchronous Framework:** We implemented a custom **step&#8209;level asynchronous RL training loop** on top of rLLM. Multiple agent instances interact with the (simulated or real) environment in parallel, each producing trajectories. 
    

Through these measures, we "closed the loop" on agent training. Starting from a raw model, we did Agentic pre&#8209;training to initialize tool&#8209;use skills, then supervised finetuning on expert&#8209;like data to cold start, and finally on&#8209;policy RL to let the model conduct self&#8209;evolution. This full&#8209;stack approach &#8209; now proven with Tongyi DeepResearch &#8209; **presents a new paradigm for training AI agents** that can robustly solve complex tasks in dynamic environments.

_(Our RL approach is inspired by several past work from_ [_Agentica_](https://agentica-project.com/index.html)_. We adapt their_ [_rLLM_](https://github.com/rllm-org/rllm) _framework and extend it to train our web agents.)_

## Real&#8209;World Applications and Impact

Tongyi DeepResearch is not just a research showcase; it’s already powering real applications within Alibaba and beyond, demonstrating its value in practical scenarios:

*   **Gaode Mate (Map & Navigation Agent)**: Collaborating with Amap (Gaode) Team, we co&#8209;developed "**Xiao Gao**," an AI copilot that leverages the app's rich toolset. It can execute complex travel planning commands, like creating a multi&#8209;day driving tour that includes specific scenic spots and pet&#8209;friendly hotels. Through multi&#8209;step reasoning, Xiao Gao autonomously researches and integrates information to produce a detailed, personalized itinerary, offering an intelligent planning experience that far surpasses standard navigation.

{{< figure src="/img/introducing-tongyi-deep-research/xiaogao.png#center" width="100%">}}

*   **Tongyi FaRui (Legal Research Agent):**  Empowered by our DeepResearch architecture, FaRui now functions as a true legal agent. It autonomously executes complex, multi&#8209;step research tasks that mirror a junior attorney's workflow&#8209;systematically retrieving case law, cross&#8209;referencing statutes, and synthesizing analysis. Crucially, all conclusions are grounded in verifiable judicial sources and delivered with precise case and statute citations, ensuring professional&#8209;grade accuracy and credibility.
    
{{< figure src="/img/introducing-tongyi-deep-research/farui.png#center" width="100%">}}

## Limitations

Our future work will address three key limitations. First, the current 128k context length is still insufficient for the most complex long&#8209;horizon tasks, requiring us to explore expanded context windows and more sophisticated information management. Second, our training pipeline's scalability remains unproven on foundation models significantly larger than our 30B&#8209;scale MoE, and we plan to validate our methods on larger&#8209;scale models. Lastly, we aim to improve the efficiency of our reinforcement learning framework by investigating techniques like partial rollouts, which will necessitate solving the challenges of off&#8209;policy training, such as distributional shift.

## Series Work

{{< figure src="/img/introducing-tongyi-deep-research/family.png#center" width="100%">}}

Tongyi DeepResearch also has an extensive deep research agent family. You can find more information in the following papers:

\[1\] [WebWalker: Benchmarking LLMs in Web Traversal](https://arxiv.org/pdf/2501.07572)

\[2\] [WebDancer: Towards Autonomous Information Seeking Agency](https://arxiv.org/pdf/2505.22648)

\[3\] [WebSailor: Navigating Super&#8209;human Reasoning for Web Agent](https://arxiv.org/pdf/2507.02592)

\[4\] [WebShaper: Agentically Data Synthesizing via Information&#8209;Seeking Formalization](https://arxiv.org/pdf/2507.15061)

\[5\] [WebWatcher: Breaking New Frontier of Vision&#8209;Language Deep Research Agent](https://arxiv.org/pdf/2508.05748)

\[6\] [WebResearch: Unleashing reasoning capability in Long&#8209;Horizon Agents](https://arxiv.org/abs/2509.13309)

\[7\] [ReSum: Unlocking Long&#8209;Horizon Search Intelligence via Context Summarization](https://arxiv.org/abs/2509.13313)

\[8\] [WebWeaver: Structuring Web&#8209;Scale Evidence with Dynamic Outlines for Open&#8209;Ended Deep Research](https://arxiv.org/abs/2509.13312)

\[9\] [WebSailor&#8209;V2: Bridging the Chasm to Proprietary Agents via Synthetic Data and Scalable Reinforcement Learning](https://arxiv.org/abs/2509.13305)

\[10\] [Scaling Agents via Continual Pre&#8209;training](https://arxiv.org/abs/2509.13310)

\[11\] [Towards General Agentic Intelligence via Environment Scaling](https://arxiv.org/abs/2509.13311)

Our team has a long&#8209;standing commitment to the research and development of deep research agents. Over the past six months, we have consistently published one technical report per month, totaling five to date. Today, we are excited to simultaneously release six new reports and share our Tongyi DeepResearch&#8209;30B&#8209;A3B model with the community.

Stay tuned for our next generation of agentic models.

```bibtex
@misc{tongyidr,
  author={Tongyi DeepResearch Team},
  title={Tongyi-DeepResearch},
  year={2025},
  howpublished={\url{https://github.com/Alibaba-NLP/DeepResearch}}
}
```
