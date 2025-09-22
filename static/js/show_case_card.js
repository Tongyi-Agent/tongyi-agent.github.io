
function rander_data(json_data) {
    fetch(json_data+'?t=' + Date.now())
            .then(r => r.json())
            .then(data => {
              window.myData = data;

        // 定义步骤数据 (保持不变)
        const steps = window.myData;
        // console.log('-----++++', steps)
           // 获取DOM元素
   // 获取DOM元素
   // document.querySelector('.command-text').textContent = steps.init_query || "Initial Query Placeholder";
    const leftPanel = document.getElementById('leftPanel');
    const terminalBody = document.getElementById('terminalBody');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    // --- 新增：获取暂停按钮的图标元素 ---
    const pauseIcon = pauseButton.querySelector('.pause-icon');
    const playIcon = pauseButton.querySelector('.play-icon');
    // --- 结束新增 ---
    const speedButtons = document.querySelectorAll('.speed-button');
    // const initialPrompt = document.getElementById('initialPrompt'); // 不再需要全局获取
    const countdownElement = document.getElementById('countdown');
    const countdownNumberElement = document.getElementById('countdownNumber');
    const cancelButton = document.getElementById('cancelButton');
    // 初始化变量
    let currentStep = 0;
    let intervalId = null;
    let speed = 1000; // 默认速度 1x (1000ms)
    let isPlaying = false;
    let countdown = 3;
    let initialPromptElement = null; // 用于存储初始化动画元素的引用
    let toolTypeText = ''; // 用于存储工具类型文本 (如 "Search:", "Visit:")

    // --- 新增：用于流式显示 thought 的变量 ---
    let thoughtStreamIntervalId = null;
    let isThoughtStreaming = false; // 标记当前是否正在流式显示 thought
    let currentThoughtStepIndex = -1; // 正在流式显示的步骤索引
    let currentThoughtContent = ""; // 当前要流式显示的 thought 内容
    let currentThoughtDisplayIndex = 0; // 当前已显示的字符索引
    let thoughtDisplayElement = null; // 显示 thought 内容的 DOM 元素
    let thoughtStreamSpeed = 4; // 流式显示速度 (ms/字符)
    // --- 结束新增 ---

    // 渲染左侧单个步骤 (修改此函数以支持流式显示 thought)
    function renderLeftStep(step, index) {
      const thoughtSection = document.createElement('div');
      // const htmlString = marked.parse(step.thought); // 不立即解析，留给流式显示处理
      thoughtSection.className = 'thought-section';
      thoughtSection.innerHTML = `
        <div class="thought-header" onclick="toggleThought('thought${index}')">
          <svg class="thought-toggle" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
          <span>Thought - Step ${step.step}</span>
        </div>
        <div id="thought${index}" style="width: 95%;margin-left: 5%;" class="thought-content visible">
          <!-- Thought 内容将由流式显示函数填充 -->
        </div>
      `;
      leftPanel.appendChild(thoughtSection);

      // --- 新增：获取 thought 显示元素的引用 ---
      thoughtDisplayElement = thoughtSection.querySelector(`#thought${index}`);
      // --- 结束新增 ---

      // --- 修改开始：处理 tool_call 显示 ---
      let toolIconHtml = ''; // 用于存储工具图标
      let mainContentText = ''; // 用于存储主要的查询内容
      const executionTime = `${Math.floor(Math.random() * 600) + 500}ms`;
      try {
        // console.log('+++++++++++++++', step.tool_call)
        const toolCallObj = JSON.parse(step.tool_call);
        // 根据工具类型设置图标、类型文本和主要内容
        if (toolCallObj.name === "search") {
          toolIconHtml = '<span class="search-icon">🔍</span>';
          toolTypeText = 'Search';
          // 获取并截取第一个查询项
          let queryDisplay = "Search Query";
          if (toolCallObj.arguments?.query && Array.isArray(toolCallObj.arguments.query) && toolCallObj.arguments.query.length > 0) {
            queryDisplay = toolCallObj.arguments.query[0];
          }
          // 对主要内容应用字数限制
          mainContentText = queryDisplay.substring(0, 20000);
        } else if (toolCallObj.name === "visit") {
          toolIconHtml = '<span class="search-icon">🌐</span>';
          toolTypeText = 'Visit';
          // 获取并截取URL
          let urlDisplay = toolCallObj.arguments?.url || "Visited URL";
          let goal = toolCallObj.arguments?.goal;
          mainContentText = urlDisplay+"<br>"+goal;
        } else {
          // 其他工具类型
          toolIconHtml = '<span class="search-icon">🛠️</span>';
          toolTypeText = `${toolCallObj.name}:`;
          // 尝试获取参数信息
          let argsStr = JSON.stringify(toolCallObj.arguments || {});
          mainContentText = argsStr.substring(0, 20000);
        }
      } catch (e) {
        // 解析失败，回退到显示原始字符串的一部分，并使用错误图标
        if (step.tool_call.indexOf('<code>') !== -1) {
          // console.log('+++++++++++pppppppppppp',step.tool_call)
          let t_split = step.tool_call.split("\n",1); // 注意这里的 \n
          // console.log('--------+++++++++---------', t_split)
          toolIconHtml = '<span class="search-icon">🐍</span>';
          toolTypeText = JSON.parse(t_split[0]).name;
          // 获取并截取代码片段
          const codeRegex = /<code>\s*([\s\S]*?)\s*<\/code>/;
          const match = step.tool_call.match(codeRegex);
          let codeContent = "";
          if (match && match[1]) {
            // match[1] 是第一个 (也是唯一的) 捕获组，即 <code> 和 </code> 之间的内容
            codeContent = match[1];
            console.log("提取到的代码内容:");
            console.log(codeContent);
          } else {
            console.log("未找到 <code> 标签或其内容。");
          }
          console.log('-----------------', codeContent)
          let displayLines = codeContent.replaceAll('\n','<br>').replaceAll(' ','&nbsp'); // 注意这里的 \n
          mainContentText = displayLines.substring(0, 20000);
        }
        else {
            console.warn("Failed to parse tool_call:", step.tool_call, e);
            toolIconHtml = '<span class="search-icon"></span>';
            toolTypeText = 'Raw Tool Call:';
            // 直接对原始字符串应用字数限制
            mainContentText = step.tool_call.substring(0, 20000);
        }
      }
      // --- 修改结束 ---

      // 创建命令块，将图标+类型放在底部
      const commandBlock = document.createElement('div');
      commandBlock.className = 'command-block';
      commandBlock.style.display = 'none'; // 👈 初始隐藏
      commandBlock.dataset.stepIndex = index; // 👈 绑定索引
      commandBlock.innerHTML = `
        <div class="command-header">
          <svg class="command-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <!-- 主要的查询内容 -->
          <div class="command-text-main">
            ${mainContentText}
          </div>
        </div>
        <!-- 新增：在 command-header 下方添加 icon+type 的标签 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <div class="command-type-label">
            ${toolIconHtml.replace(":","")} ${toolTypeText.replace(":","")}
          </div>
        <span class="command-time success">${executionTime}</span>
    </div>
      `;
      leftPanel.appendChild(commandBlock);
      // 自动滚动到新添加的内容
      leftPanel.scrollTop = leftPanel.scrollHeight;
    }

    // --- 新增：流式显示 thought 内容的函数 ---
    /**
     * 启动 thought 内容的流式显示
     * @param {string} content - 要流式显示的原始 thought 内容
     * @param {number} stepIndex - 当前步骤的索引
     * @param {function} onComplete - 当流式显示完成时调用的回调函数
     */
    function startThoughtStream(content, stepIndex, onComplete) {
        if (isThoughtStreaming) {
            console.warn("Thought stream is already running.");
            return;
        }

        // 设置全局状态和变量
        isThoughtStreaming = true;
        currentThoughtStepIndex = stepIndex;
        currentThoughtContent = content; // 保存原始内容，不立即解析 Markdown
        currentThoughtDisplayIndex = 0;

        // 清空显示元素
        if (thoughtDisplayElement) {
            thoughtDisplayElement.textContent = ''; // 使用 textContent 避免 HTML 解析问题
        }

        // 启动定时器进行流式显示
        thoughtStreamIntervalId = setInterval(() => {
            // 检查是否暂停
            if (!isPlaying) {
                return; // 如果暂停，则不更新显示
            }

            // 检查是否已完成显示
            if (currentThoughtDisplayIndex >= currentThoughtContent.length) {
                clearInterval(thoughtStreamIntervalId);
                isThoughtStreaming = false;
                currentThoughtStepIndex = -1;
                // 流式显示完成后，解析 Markdown 并更新内容
                if (thoughtDisplayElement) {
                    thoughtDisplayElement.innerHTML = marked.parse(currentThoughtContent);
                }
                // 调用完成回调
                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
                return;
            }

            // 获取下一个字符
            const nextChar = currentThoughtContent.charAt(currentThoughtDisplayIndex);
            // 更新显示
            if (thoughtDisplayElement) {
                // 注意：这里直接追加字符，不处理 \n 为 <br>，因为最终会用 marked.parse
                // 如果需要实时换行效果，可以在这里处理 \n
                 if (nextChar === '\n') {
                     thoughtDisplayElement.textContent += '\n'; // 保留换行符
                 } else {
                     thoughtDisplayElement.textContent += nextChar;
                 }
            }
            currentThoughtDisplayIndex++;

            // 自动滚动到新添加的内容
            leftPanel.scrollTop = leftPanel.scrollHeight;

        }, thoughtStreamSpeed); // 使用 thoughtStreamSpeed 控制速度
    }

    /**
     * 暂停 thought 的流式显示
     */
    function pauseThoughtStream() {
        // 流式显示本身依赖 isPlaying 标志，这里不需要额外操作
        // clearInterval(thoughtStreamIntervalId); // 不要清除，否则恢复时无法继续
        // isThoughtStreaming = false; // 不要重置，否则无法恢复
    }

    /**
     * 恢复 thought 的流式显示
     */
    function resumeThoughtStream() {
        // 流式显示本身依赖 isPlaying 标志，这里不需要额外操作
        // 如果之前被 clearInterval 了，则需要重新启动，但当前逻辑不需要
    }
    // --- 结束新增 ---


    // 渲染右侧终端内容 (仅显示当前步骤)
/**
 * 渲染右侧终端内容 (仅显示当前步骤)
 * 修改后版本：支持检测并动态渲染 HTML 内容或 URL
 * @param {string} content - 来自 step.tool_response 的内容
 */
/**
 * 渲染右侧终端内容 (仅显示当前步骤)
 * 修改后版本：支持检测并动态渲染 HTML 内容或 URL 网页
 * @param {string} content - 来自 step.tool_response 的内容
 */
function renderTerminalContent(content) {
    console.log('+======================')
    // 清空之前的所有命令内容，但保留初始的提示符
    // 假设 terminalBody 是指向右侧面板 .terminal-body 的全局变量
    terminalBody.innerHTML = `<div class="terminal-prompt"><div class="prompt-user">${toolTypeText}</div></div>`;
    const commandElement = document.createElement('div');
    commandElement.className = 'terminal-command';
    // --- 新增逻辑开始：检测并处理 URL ---
    // 使用正则表达式检查 content 是否为一个有效的 URL
    if (content.startsWith('http://')) {
        console.log('-------+++++++++++++------------')
        const urlToLoad = content.trim();
        console.log("Detected URL, rendering the webpage in an iframe:", urlToLoad);
        // 确保 URL 有协议头
        let fullUrl = urlToLoad;
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            fullUrl = 'http://' + fullUrl; // 默认添加 http
        }
        try {
            // 创建一个 iframe 元素
            const iframe = document.createElement('iframe');
            iframe.src = fullUrl;
            // 设置 sandbox 属性以增强安全性 (根据需要调整)
            // 注意：allow-scripts 和 allow-same-origin 通常需要加载大多数网页，但这会降低隔离性
            // 如果遇到问题，可以尝试移除或调整 sandbox 属性
            iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation';
            iframe.style.width = '100%';
            iframe.style.height = '70vh'; // 设置一个合适的高度
            iframe.style.border = '1px solid #ddd';
            iframe.style.borderRadius = '4px';
            iframe.title = `Rendered content from ${fullUrl}`;
            iframe.loading = 'lazy'; // 可选：延迟加载
            // 将 iframe 包装在一个 div 中以便于样式控制
            const containerDiv = document.createElement('div');
            containerDiv.className = 'url-content-container'; // 可以在 CSS 中定义此类
            console.log('-------+++++++++++++------------',iframe)
            containerDiv.appendChild(iframe);
            containerDiv.style.marginTop = '10px';
            // 将包含 iframe 的容器添加到 commandElement 中
            commandElement.appendChild(containerDiv);
            // 监听加载和错误事件 (可选)
            iframe.onload = () => {
                console.log("Iframe content loaded successfully.");
            };
            iframe.onerror = (e) => {
                console.error("Error loading iframe content:", e);
                // 可以在容器内显示错误信息
                containerDiv.innerHTML = `<p style="color: #f44336;">[Error: Failed to load URL: ${fullUrl}]</p>`;
            };
        } catch (error) {
            console.error("Failed to create iframe for URL:", urlToLoad, error);
            commandElement.innerHTML = `<div class="command-line"><span class="command-keyword">$</span><span class="command-function error">[Error: Failed to render URL: ${urlToLoad}]</span></div>`;
        }
    }
    // --- 新增逻辑结束 ---
    // --- 原有逻辑：检测并处理 HTML 内容 ---
    else if (content && typeof content === 'string' &&
        (content.trim().toLowerCase().startsWith('<!doctype html>') ||
         content.trim().toLowerCase().startsWith('<html'))) {
        console.log("Detected full HTML content, rendering it dynamically.");
        try {
            const blob = new Blob([content], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.src = blobUrl;
            // 设置 sandbox 属性 (根据需要调整)
            iframe.sandbox = 'allow-scripts allow-same-origin';
            iframe.style.width = '100%';
            iframe.style.height = '70vh';
            iframe.style.border = '1px solid #ddd';
            iframe.style.borderRadius = '4px';
            iframe.title = "Rendered HTML Content";
            iframe.loading = 'lazy';
            const containerDiv = document.createElement('div');
            containerDiv.className = 'html-content-container';
            containerDiv.appendChild(iframe);
            containerDiv.style.marginTop = '10px';
            commandElement.appendChild(containerDiv);
            iframe.onload = () => {
                console.log("HTML content iframe loaded.");
            };
            iframe.onerror = (e) => {
                console.error("Error loading HTML content iframe:", e);
                URL.revokeObjectURL(blobUrl);
                containerDiv.innerHTML = '<p style="color: #f44336;">[Error: Failed to load HTML content]</p>';
            };
            // 可以选择延迟撤销 Blob URL
            setTimeout(() => {
                 URL.revokeObjectURL(blobUrl);
                 console.log("Blob URL revoked after timeout.");
            }, 5000);
        } catch (error) {
            console.error("Failed to create Blob or Object URL for HTML content:", error);
            commandElement.innerHTML = `<div class="command-line"><span class="command-keyword">$</span><span class="command-function error">[Error: Failed to render HTML content]</span></div>`;
        }
    }
    // --- 原有逻辑结束 ---
    else {
        // 如果不是 URL 也不是完整的 HTML，保持原有的处理逻辑
        let displayContent = content || "";
        // 原有的搜索结果图标逻辑 (如果需要的话)
        let iconHtml = "";
        if (displayContent.includes("A Google search for") || displayContent.includes("The useful information in")) {
            iconHtml = '';
        }
        commandElement.innerHTML = `<div class="command-line"> ${iconHtml}<span class="command-function">${marked.parse(displayContent)}</span></div>`;
    }
    // 将构建好的 commandElement 添加到 terminalBody
    terminalBody.appendChild(commandElement);
    // 滚动到底部以显示最新内容
    terminalBody.scrollTop = terminalBody.scrollHeight;
}


    // 更新进度条
    function updateProgress() {
      const percent = (currentStep / (steps.tool_response_list?.length || 1)) * 100;
      progressFill.style.width = `${percent}%`;
      progressText.textContent = `${currentStep}/${steps.tool_response_list?.length || 0}`;
      progressPercent.textContent = `${Math.round(percent)}%`;
    }

    // 播放下一步 (修改此函数以支持 thought 流式显示)
// 播放下一步 (修改此函数以支持 thought 流式显示)
function playNextStep() {
    // 检查是否所有步骤都已播放完毕
    if (!steps.tool_response_list || currentStep >= steps.tool_response_list.length) {
        pausePlayback(); // 如果播放完了，自动暂停
        return;
    }

    // 检查是否当前 thought 正在流式显示，如果是，则不处理下一步
    if (isThoughtStreaming) {
        console.log("Thought is still streaming, waiting for completion before next step.");
        return;
    }

    const step = steps.tool_response_list[currentStep];

    // 1. 渲染左侧步骤结构 (包括 thought 容器，但不显示内容)
    renderLeftStep(step, currentStep);

    // 2. 启动 thought 的流式显示，并在完成后渲染右侧内容和更新进度
    startThoughtStream(step.thought, currentStep, () => {
        // 当 thought 流式显示完成后，执行以下操作：
        console.log(`Thought streaming for step ${currentStep} completed.`);

        // a. 渲染右侧终端内容
        renderTerminalContent(step.tool_response);

        // b. 更新进度和步骤计数
        currentStep++;
        updateProgress();

        // c. 显示当前 step 的 command-block 并滚动到底部
        const commandBlock = leftPanel.querySelector(`.command-block[data-step-index="${currentStep - 1}"]`);
        if (commandBlock) {
            commandBlock.style.display = 'block'; // 👈 显示命令块
            // 滚动到最底部
            leftPanel.scrollTop = leftPanel.scrollHeight;
        }

        // c. 如果 isPlaying 仍为 true，继续播放下一步
        //    这里不再需要递归调用 playNextStep 或 setInterval，
        //    因为主循环 intervalId 会继续触发 playNextStep
        //    我们只需要确保当前步骤处理完毕即可。
    });
}

    // 开始播放
    function startPlayback() {
      if (isPlaying) return;
      isPlaying = true;
      // --- 新增：恢复暂停按钮的样式和图标 ---
      pauseButton.classList.remove('paused');
      pauseIcon.style.display = 'block';
      playIcon.style.display = 'none';
      // --- 结束新增 ---
      // --- 新增：恢复 thought 流式显示 ---
      resumeThoughtStream();
      // --- 结束新增 ---
      intervalId = setInterval(playNextStep, speed);
    }

    // 暂停播放
    function pausePlayback() {
      if (!isPlaying) return;
      isPlaying = false;
      clearInterval(intervalId);
      // --- 新增：改变暂停按钮的样式和图标以表示暂停状态 ---
      pauseButton.classList.add('paused');
      pauseIcon.style.display = 'none';
      playIcon.style.display = 'block';
      // --- 结束新增 ---
      // --- 新增：暂停 thought 流式显示 ---
      pauseThoughtStream();
      // --- 结束新增 ---
    }

    // 重置播放 (也用于重新开始)
    function resetPlayback() {
      pausePlayback(); // 确保先停止任何正在进行的播放
      // --- 新增：停止并重置 thought 流式显示 ---
      if (thoughtStreamIntervalId) {
          clearInterval(thoughtStreamIntervalId);
      }
      isThoughtStreaming = false;
      currentThoughtStepIndex = -1;
      currentThoughtContent = "";
      currentThoughtDisplayIndex = 0;
      thoughtDisplayElement = null; // 重置引用
      // --- 结束新增 ---
      currentStep = 0;
      // 清空左右面板内容，但保留左侧面板的初始结构（包括Initial Query）
      leftPanel.innerHTML = `
        <div class="agent-header">
          <span class="agent-name">Omni-TARS Agent</span>
          <span class="status-badge">Running</span>
        </div>
        <!-- 首次提出的问题（已在HTML中静态定义） -->
        <div class="command-block">
          <div class="command-header">
            <svg class="command-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="command-text">Initial Query: ${steps.init_query}</span>
          </div>
        </div>
      `;
      // 重新插入初始化动画
      insertInitialPrompt();
      // 清空右侧终端内容
      terminalBody.innerHTML = `
        <div class="terminal-prompt">
          <div class="prompt-user"></div>
        </div>
      `;
      updateProgress();
      // --- 新增：确保暂停按钮恢复到初始状态 ---
      pauseButton.classList.remove('paused');
      pauseIcon.style.display = 'block';
      playIcon.style.display = 'none';
      // --- 结束新增 ---
    }

    // 设置播放速度
    function setSpeed(newSpeed) {
      speed = newSpeed;
      if (isPlaying) {
        pausePlayback();
        startPlayback(); // 重新开始播放以应用新速度
      }
    }

    // 切换思考内容显示
    function toggleThought(id) {
      const element = document.getElementById(id);
      const toggle = element.previousElementSibling.querySelector('.thought-toggle');
      if (element.classList.contains('visible')) {
        element.classList.remove('visible');
        toggle.classList.remove('open');
      } else {
        element.classList.add('visible');
        toggle.classList.add('open');
      }
    }

    // 创建并插入初始化动画到左侧面板
    function insertInitialPrompt() {
        // 创建初始化动画元素
        initialPromptElement = document.createElement('div');
        initialPromptElement.className = 'initial-prompt';
        initialPromptElement.id = 'initialPrompt';
        initialPromptElement.innerHTML = `
            <div class="prompt-content">
            <div class="prompt-title">Auto-play Starting</div>
            <div class="prompt-description">Replay will begin in <span id="countdown">3</span> seconds. You can cancel or wait for automatic playback.</div>
            <div class="countdown" id="countdownNumber">3</div>
            <button class="action-button" id="cancelButton">Cancel Auto-play</button>
            </div>
        `;
        // 插入到左侧面板的最前面
        leftPanel.insertBefore(initialPromptElement, leftPanel.firstChild);
        // 重新获取新创建的元素
        const countdownElement = initialPromptElement.querySelector('#countdown');
        const countdownNumberElement = initialPromptElement.querySelector('#countdownNumber');
        const cancelButton = initialPromptElement.querySelector('#cancelButton');
        // 为新创建的取消按钮添加事件监听器
        cancelButton.addEventListener('click', () => {
            initialPromptElement.style.display = 'none';
            // resetPlayback(); // 重置播放状态
          startPlayback();
        });
        // 开始倒计时
        startCountdown(countdownElement, countdownNumberElement);
    }

    // 倒计时函数 (修改为接受元素参数)
    function startCountdown(cdElement, cdNumberElement) {
      let localCountdown = 3; // 使用局部变量避免全局污染
      cdElement.textContent = localCountdown;
      cdNumberElement.textContent = localCountdown;
      const countdownInterval = setInterval(() => {
        localCountdown--;
        cdElement.textContent = localCountdown;
        cdNumberElement.textContent = localCountdown;
        if (localCountdown <= 0) {
          clearInterval(countdownInterval);
          if (initialPromptElement) {
              initialPromptElement.style.display = 'none'; // 隐藏动画
          }
          startPlayback(); // 开始播放步骤
        }
      }, 1000);
    }

    // --- 修改：播放/重置按钮事件监听器 ---
    playButton.addEventListener('click', resetPlayback); // 点击播放按钮直接重置并开始
    // --- 结束修改 ---
    // --- 修改：暂停/恢复按钮事件监听器 ---
    pauseButton.addEventListener('click', () => {
      if (isPlaying) {
        pausePlayback(); // 当前正在播放，则暂停
      } else {
         if (!steps.tool_response_list || currentStep >= steps.tool_response_list.length) {
            // 如果已经播放完毕，点击暂停按钮等同于重置并开始
            resetPlayback();
         } else {
             // 当前已暂停，则恢复播放
             startPlayback();
         }
      }
    });
    // --- 结束修改 ---
    speedButtons.forEach(button => {
      button.addEventListener('click', () => {
        speedButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        setSpeed(parseInt(button.getAttribute('data-speed')));
      });
    });
    // 注意：取消按钮的事件监听器现在在 insertInitialPrompt 中添加

    // 初始化
    resetPlayback(); // 这将调用 insertInitialPrompt
    // 页面加载完成后开始倒计时 (现在由 resetPlayback 触发)
    // window.addEventListener('load', () => {
    //   startCountdown();
    // });
              }).catch(err => console.error('加载失败:', err));

}


