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

## 从 Chatbot 到 Autonomous Agent

我们发布了通义 DeepResearch —— 首个在性能上可与 OpenAI DeepResearch 相媲美、并在多项权威基准测试中取得领先表现的全开源 Web Agent。

在多个极高难度的信息检索和推理任务中，通义DeepResearch 取得了最先进的（SOTA）成绩：

*   Humanity’s Last Exam (HLE)：32.9
*   BrowseComp-EN：45.3
*   BrowseComp-ZH：49.5
*   用户中心化的 xBench-DeepSearch：75.0

系统性地超越了目前所有的闭源及开源 Deep Research 代理。

不仅如此，我们还完整分享了一套可落地的高阶Agent构建方法论，详细介绍了从数据合成、Agentic 持续预训练（CPT）、有监督微调（SFT）冷启动，到最终强化学习（RL）阶段的全套流程。在 RL 环节，我们提供了算法创新、自动化数据构建与高稳定性基础设施的全栈解决方案。

在推理阶段，基础的 ReAct 模式无需任何提示工程即可充分展现模型固有能力，而深度模式（test-time-scaling） 则展示了其在复杂推理与规划能力上的上限。

## 基于完全合成数据的持续预训练和后训练

该模型能力基于一种多阶段数据策略，旨在创建海量高质量的代理训练数据，而无需依赖昂贵的人工注释。

### 持续预训练数据

我们将 Agentic CPT 引入到Deep Research Agent训练中，为后训练创建强大的Agent基础模型。我们提出了 AgentFounder，这是一个系统化且可扩展的大规模数据合成解决方案，它利用来自后训练流程的数据创建数据飞轮。

**数据重组和任务构建** 我们持续从各种来源收集数据，包括文档、公开的爬取数据、知识图谱、历史轨迹和工具调用记录（例如，带有链接的搜索结果）。这些不同的数据源被重构为基于实体的开放世界知识记忆。基于随机采样的实体及其对应的知识，我们生成多风格（问题-答案）对。

{{< figure src="/img/introducing-tongyi-deep-research/trajectory_systhesis.png#center" width="100%">}}

**动作合成** 基于多样化的问题和历史轨迹，我们构建了一阶动作合成数据和高阶动作合成数据。我们的方法能够在离线环境下大规模、全面地探索潜在的推理-动作空间，从而消除了对额外商业工具 API 调用的需求。具体而言，对于高阶动作合成，我们将轨迹重构为多步骤决策过程，以增强模型的决策能力。

### 后训练数据

**高质量合成问答数据**

我们开发了一套端到端的合成数据生成解决方案。这一全自动流程无需人工干预即可构建超越人类质量的数据集，旨在突破人工智能代理的性能极限。经过长期的探索和迭代——从早期的网页点击流逆向工程问答对（WebWalker）到更系统的基于图谱的合成方法（WebSailor 和 WebSailor-V2），再到形式化的任务建模（WebShaper），我们的方法确保了卓越的数据质量和强大的可扩展性，突破了模型能力的上限。

为了解决复杂且高度不确定的问题，我们通过一种新颖的流程合成基于 Web 的问答数据。该流程首先通过在高度互联的知识图谱随机游走和基于表格数据融合同构表构建，将来自真实网站数据整合，并确保信息结构的真实性。然后，我们对子图和子表进行采样，生成初始问题和答案。关键步骤是通过策略性地混淆或模糊问题中的信息来增加问题难度。该方法基于一个完整的理论框架，我们将问答难度正式建模为一系列可控的“原子操作”（例如，合并具有相似属性的实体），这些操作基于实体关系，使我们能够系统地增加复杂性。

为了进一步减少问答系统的信息结构与推理结构之间的不一致性，提高推理难度和结构扩展能力，我们提出了一种基于集合论的信息搜索问题正式建模。基于这种正式建模，我们开发了能够以可控方式扩展问题的智能体，并最大限度地减少了推理捷径和结构冗余，从而进一步提升了问题质量。此外，这种正式建模还能高效地验证问答的正确性，有效解决了信息搜索合成数据难以验证的挑战。

此外，我们还开发了一个自动化数据引擎，以扩大博士级研究问题的创建规模。该引擎基于多学科知识库，生成需要多源推理的“种子”问答对。然后，每个种子都会进入一个自我引导的“迭代复杂性升级”循环，其中，一个问题构建代理配备了一套强大的工具，包括网络搜索、学术检索和 Python 执行环境。在每次迭代中，代理都会扩展知识边界，深化概念抽象，甚至构建计算任务，从而形成一个演化循环，上一轮的输出成为下一轮更复杂的输入，确保任务难度的可控且系统地升级。

**超越高质量问答**

为了最大限度地提升模型在推理、规划和工具使用方面的能力，我们引入了 IterResearch，这是一种创新的Agent范式（详情见下文）。它通过在每一轮中动态地重建精简的工作空间，取代了传统的不断积累上下文的方法。这种方法充分释放了模型的推理潜力，并确保模型的每个决策都是经过深思熟虑的结果。

通过这一过程，我们不仅创建了“问题”，还创建了如何逐步、有条理地解决问题的“黄金范例”。该数据集由经过严格筛选的高质量问题解决示例组成，有助于充分释放模型在推理、规划和工具使用方面的潜力。

## Rollout模式

我们对深度研究型智能体的部署范式进行了广泛的探索。因此，我们的最终模型支持多种部署格式，包括原生的 ReAct 模式和上下文管理的深度模式。

### ReAct 模式

我们的模型使用 ReAct 推理范式展现出卓越的性能。它严格遵循“思考-行动-观察”的循环，通过多次迭代来解决问题。模型上下文长度为 128K，可以处理大量的交互轮次，从而完全实现与环境交互的可扩展性。ReAct 的简单性和通用性为模型的内在能力和我们训练流程的有效性提供了最清晰的基准。

我们选择 ReAct 很大程度上受到了“The Bitter Lesson”的影响，利用可扩展计算的通用方法最终将优于依赖复杂的人工知识和复杂设计的方法。

### 深度模式

除了 ReAct 模式外，我们还开发了“深度模式”，用于处理复杂的多步研究任务。此模式基于我们全新的 IterResearch 范式，旨在将Agent的能力发挥到极致。

IterResearch 范式的创建是为了解决Agent将所有信息堆积在一个不断扩展的单一情境中时出现的“认知瓶颈”和“噪音污染”。相反，IterResearch 将一项任务解构为一系列“研究轮次”。

在每一轮中，Agent仅使用上一轮中最重要的输出来重建一个精简的工作空间。在这个专注的工作空间中，Agent会分析问题，将关键发现整合成一个不断演变的核心报告，然后决定下一步行动——是收集更多信息还是提供最终答案。这种“综合与重构”的迭代过程使Agent能够在执行长期任务时保持清晰的“认知焦点”和高质量的推理能力。

在此基础上，我们提出了“研究-合成”框架。在该模型中，多个研究Agent使用 IterResearch 流程并行探索同一个问题。Agent会最终整合它们完善的报告和结论，从而得出更全面的最终答案。这种并行结构使模型能够在有限的上下文窗口内考虑更广泛的研究路径，从而将其性能推向极限。

{{< figure src="/img/introducing-tongyi-deep-research/heavy_mode.png#center" width="100%">}}

## 端到端Agent训练流程

{{< figure src="/img/introducing-tongyi-deep-research/pipeline.png#center" width="100%">}}

训练这样的Agent模型需要**重新思考整个模型训练流程**，从预训练到微调再到强化学习。我们建立了一种新的代理模型训练范式，将Agentic CPT → Agentic SFT → Agentic RL 连接起来，为 AI Agent创建了一个无缝的端到端训练循环。以下是我们利用强化学习解决最后阶段的方法，这对于使代理的行为与高阶目标保持一致至关重要：

### 基于策略的代理强化学习 (RL)

通过强化学习构建高质量的Agent是一项复杂的系统工程挑战；如果将整个开发过程视为一个“强化学习”循环，其组件中的任何不稳定或鲁棒性不足都可能导致错误的“奖励”信号。接下来，我们将分享我们在强化学习方面的实践，涵盖算法和基础设施两个方面。

在强化学习算法方面，我们使用定制的基于策略的组相对策略优化 (GRPO) 取得了多项算法突破。我们采用严格的在线策略训练方案，确保学习信号始终与模型当前能力相关。训练目标使用 token 级策略梯度损失进行优化。其次，为了进一步降低优势估计的方差，我们采用了留一法 (leave-one-out) 策略。此外，由于观察到未经过滤的负轨迹会显著降低训练稳定性，我们对负样本采取了保守策略。在延长训练时间后，这可能会表现为“格式崩溃”现象。为了缓解这种情况，我们会选择性地从损失计算中排除某些负样本，例如，那些由于超出长度限制而无法得出最终答案的样本。为了提高效率，我们不采用动态采样。相反，我们利用更大的批次和组大小，这有助于保持较小的方差并提供足够的监督。

{{< figure src="/img/introducing-tongyi-deep-research/rl_curve.png#center" width="100%">}}

训练动态展现出有效的学习效果，奖励呈现持续上升趋势。同时，策略熵始终保持在高位，表明模型持续探索，并防止过早收敛。我们将其归因于Web环境的非平稳特性，这种特性自然会促进稳健的自适应策略，并消除了显式熵正则化的需要。

我们认为，算法固然重要，但并非 Agentic 强化学习成功的唯一决定性因素。我们尝试过许多不同的算法和技巧，发现数据和训练环境的稳定性可能是决定强化学习是否有效的更关键因素。有趣的是，我们曾测试直接在 BrowseComp 测试集上训练模型，但效果低于我们合成数据。我们分析这种差异的出现是因为合成数据提供了更一致的分布，从而可以更有效地定制模型。相反，人工标注的数据（例如 BrowseComp）本身就包含更多噪声。由于其规模有限，很难近似可学习的底层分布，从而阻碍了模型从中学习和概括。该现象可进一步延拓到其他Agent的训练上，为更多样和复杂的Agent训练带来启示。

{{< figure src="/img/introducing-tongyi-deep-research/rl_arch.png#center" width="100%">}}

在基础设施方面，使用工具训练Agent需要我们开发一个高度稳定高效的环境：

● 合成训练环境：依赖实时 Web API 进行开发成本高昂、速度慢且不一致。我们利用离线维基百科数据库和自定义工具套件创建了一个模拟训练环境，解决了这一问题。通过调整数据流水线，为该环境生成高质量、复杂的任务，我们创建了一个经济高效、快速可控的平台，显著加快了我们的研究和迭代速度。

● 稳定高效的工具沙盒：为了确保在代理训练和评估期间可靠地使用工具，我们开发了一个统一的沙盒。该沙盒通过缓存结果、重试失败的调用以及使用冗余提供程序作为后备（例如，备用搜索 API）来优雅地处理并发和故障。这为代理提供了快速且确定性的体验，这对于防止工具错误破坏其学习轨迹至关重要。

● 自动数据管理：数据是提升模型能力的核心驱动力，其重要性甚至超过了算法。数据质量直接决定了模型通过自我探索推广到分布外场景的能力上限。为了应对这一挑战，我们在训练动态的指导下实时优化数据。这种优化是通过全自动数据合成和过滤流程实现的，该流程可以动态调整训练集。通过闭合数据生成和模型训练之间的循环，这种方法不仅确保了训练的稳定性，还带来了显著的性能提升。

● 基于策略的异步框架：我们在 rLLM 之上实现了自定义的步级异步强化学习训练循环。多个代理实例并行与（模拟或真实）环境交互，每个实例都会生成轨迹。

通过这些措施，我们实现了Agent训练的“闭环”。从原始模型开始，我们进行了Agentic持续预训练以初始化工具使用技能，然后使用类似专家的数据进行监督微调以实现冷启动，最后进行基于策略的强化学习，使模型进行自我进化。这种全栈方法为训练能够在动态环境中稳健地解决复杂任务的 AI 代理提供了一种全新的范例。

（我们的强化学习 (RL) 方法受到 [Agentica](https://agentica-project.com/index.html) 过去多项研究的启发。我们改造了他们的[rLLM](https://github.com/rllm-org/rllm)框架，并将其扩展用于训练我们的Agent。）

## 应用及影响

通义Deep Research不仅仅是一个研究成果的展示，它已经在阿里巴巴内外赋能实际应用，并在实际场景中展现其价值：

**高德地图（地图导航智能体）** 我们与高德地图团队合作，共同开发了“小高老师”，这是一款利用该应用丰富工具集的人工智能副驾驶。它可以执行复杂的旅行规划命令，例如创建包含特定景点和宠物友好型酒店的多日自驾游路线。通过多步推理，小高老师能够自主搜索和整合信息，生成详细的个性化行程，提供远超标准导航的智能规划体验。

{{< figure src="/img/introducing-tongyi-deep-research/xiaogao.png#center" width="100%">}}

**通义法睿（法律Deep Research）** 在我们Deep Research架构的赋能下，法睿现在能够真正充当法律研究代理。它可以自主执行复杂的多步骤研究任务，模拟初级律师的工作流程——系统地检索案例、交叉引用法规并进行综合分析。至关重要的是，所有结论均基于可验证的司法资料，并附有精确的案例和法规引用，确保专业级的准确性和可信度。
    
{{< figure src="/img/introducing-tongyi-deep-research/farui.png#center" width="100%">}}

## 未来工作

我们未来的工作将解决三个关键局限性。首先，目前 128k 的上下文长度对于最复杂的长视域任务来说仍然不足，需要我们探索扩展上下文窗口和更复杂的信息管理。其次，我们的训练流程的可扩展性尚未在远大于 300 亿规模 MoE 的基础模型上得到验证，我们计划在更大规模的模型上验证我们的方法。最后，我们的目标是通过研究partial rollouts 等技术来提高强化学习框架的效率，这将需要解决离线策略训练的挑战，例如分布偏移。

## 系列工作

{{< figure src="/img/introducing-tongyi-deep-research/family.png#center" width="100%">}}

通义Deep Research也拥有丰富的Deep Research Agent家族。您可以在以下论文中找到更多信息：

\[1\] [WebWalker: Benchmarking LLMs in Web Traversal](https://arxiv.org/pdf/2501.07572)

\[2\] [WebDancer: Towards Autonomous Information Seeking Agency](https://arxiv.org/pdf/2505.22648)

\[3\] [WebSailor: Navigating Super-human Reasoning for Web Agent](https://arxiv.org/pdf/2507.02592)

\[4\] [WebShaper: Agentically Data Synthesizing via Information-Seeking Formalization](https://arxiv.org/pdf/2507.15061)

\[5\] [WebWatcher: Breaking New Frontier of Vision-Language Deep Research Agent](https://arxiv.org/pdf/2508.05748)

\[6\] [WebResearch: Unleashing reasoning capability in Long-Horizon Agents](https://arxiv.org/abs/2509.13309)

\[7\] [ReSum: Unlocking Long-Horizon Search Intelligence via Context Summarization](https://arxiv.org/abs/2509.13313)

\[8\] [WebWeaver: Structuring Web-Scale Evidence with Dynamic Outlines for Open-Ended Deep Research](https://arxiv.org/abs/2509.13312)

\[9\] [WebSailor-V2: Bridging the Chasm to Proprietary Agents via Synthetic Data and Scalable Reinforcement Learning](https://arxiv.org/abs/2509.13305)

\[10\] [Scaling Agents via Continual Pre-training](https://arxiv.org/abs/2509.13310)

\[11\] [Towards General Agentic Intelligence via Environment Scaling](https://arxiv.org/abs/2509.13311)

我们的团队长期致力于Deep Research的研发。过去六个月，我们每月持续发布一篇技术报告，迄今为止已发布五篇。今天，我们非常高兴地同时发布六篇新报告，并与社区分享我们的通义DeepResearch-30B-A3B模型。

敬请期待我们下一代Agent模型。

```bibtex
@misc{tongyidr,
  author={Tongyi DeepResearch Team},
  title={Tongyi-DeepResearch},
  year={2025},
  howpublished={\url{https://github.com/Alibaba-NLP/DeepResearch}}
}
```
