webpackJsonp([0xc65fdfd58dc9],{388:function(e,n){e.exports={data:{contentfulBlogPost:{title:"Vue 应用性能化指南",publishDate:"September 10th, 2018",heroImage:{sizes:{base64:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAMAAABI111xAAAArlBMVEX////q+/+H5f5v1/540f6t3//j/P9h6P7k+v/e9f/m9//b8f+i1v78/P3d4ujf5Ono7O/Q2N9h8P6U8f/9//+n4P9Quv7T7P+z3P/6+/z09vfu8fT29/n3+fry9Pb09vj+/v5i8/70/f+B2/6W2/6e2v6Qy/7p7PDU2+Lh5uvj5+zc4efX3uT6+/tj8/542f6B1P77/v9k8f6l8v+z3f+Vzv7f/P/c+v/f8f/s9v+Xswy3AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4wcQBR8wU3W02gAAAGJJREFUCB2lwT0OglAQRtH7kYHKcRJiwzb82f8eXAGxgoIQE62MkXk22lFwDtsIVLz4Ixp9PcAlfaoZRKvpoDR0Sm+T+ooIImLcU3t6ujuGX9lJwI3iTnE8kc4XfgwTycSKBefTDj0steJKAAAAAElFTkSuQmCC",aspectRatio:1.8,src:"//images.ctfassets.net/9ys45gwh7pzh/6Od9v3wzLOysiMum0Wkmme/ad6f1e1ae5d62499555658b860aafc99/165c5ff64d5dc532?w=1180&q=50&bg=rgb%3A000000",srcSet:"//images.ctfassets.net/9ys45gwh7pzh/6Od9v3wzLOysiMum0Wkmme/ad6f1e1ae5d62499555658b860aafc99/165c5ff64d5dc532?w=295&h=164&q=50&bg=rgb%3A000000 295w,\n//images.ctfassets.net/9ys45gwh7pzh/6Od9v3wzLOysiMum0Wkmme/ad6f1e1ae5d62499555658b860aafc99/165c5ff64d5dc532?w=590&h=328&q=50&bg=rgb%3A000000 590w,\n//images.ctfassets.net/9ys45gwh7pzh/6Od9v3wzLOysiMum0Wkmme/ad6f1e1ae5d62499555658b860aafc99/165c5ff64d5dc532?w=900&h=500&q=50&bg=rgb%3A000000 900w",srcWebp:"//images.ctfassets.net/9ys45gwh7pzh/6Od9v3wzLOysiMum0Wkmme/ad6f1e1ae5d62499555658b860aafc99/165c5ff64d5dc532?w=1180&q=50&fm=webp&bg=rgb%3A000000",srcSetWebp:"//images.ctfassets.net/9ys45gwh7pzh/6Od9v3wzLOysiMum0Wkmme/ad6f1e1ae5d62499555658b860aafc99/165c5ff64d5dc532?w=295&h=164&q=50&fm=webp&bg=rgb%3A000000 295w,\n//images.ctfassets.net/9ys45gwh7pzh/6Od9v3wzLOysiMum0Wkmme/ad6f1e1ae5d62499555658b860aafc99/165c5ff64d5dc532?w=590&h=328&q=50&fm=webp&bg=rgb%3A000000 590w,\n//images.ctfassets.net/9ys45gwh7pzh/6Od9v3wzLOysiMum0Wkmme/ad6f1e1ae5d62499555658b860aafc99/165c5ff64d5dc532?w=900&h=500&q=50&fm=webp&bg=rgb%3A000000 900w",sizes:"(max-width: 1180px) 100vw, 1180px"}},body:{childMarkdownRemark:{html:'<blockquote>\n<p>作者: <a href="https://github.com/binggg">binggg</a> from 迅雷前端</p>\n<p>原文地址：<a href="https://www.jianshu.com/p/b768dc3bff35">Vue 应用性能优化指南</a></p>\n</blockquote>\n<p>得益于 Vue 的 <strong>响应式系统</strong> 和 <strong>虚拟 DOM 系统</strong> ，Vue 在渲染组件的过程中能自动追踪数据的依赖，并精确知晓数据更新的时候哪个组件需要重新渲染，渲染之后也会经过虚拟 DOM diff 之后才会真正更新到 DOM 上，Vue 应用的开发者<strong>一般不需要</strong>做额外的优化工作。</p>\n<p>但在实践中仍然有可能遇到性能问题，下面会介绍一些定位分析 Vue 应用性能问题的方式及一些优化的建议。</p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d789e70497?w=1200&#x26;h=750&#x26;f=png&#x26;s=17929" alt="Vue 应用运行原理"></p>\n<p>整体内容由三部分组成：</p>\n<ul>\n<li>如何定位 Vue 应用性能问题</li>\n<li>Vue 应用运行时性能优化建议</li>\n<li>Vue 应用加载性能优化建议</li>\n</ul>\n<h2>1. 如何定位 Vue 应用性能问题</h2>\n<p>Vue 应用的性能问题可以分为两个部分，第一部分是运行时性能问题，第二部分是加载性能问题。</p>\n<p>和其他 web 应用一样，定位 Vue 应用性能问题最好的工具是 Chrome Devtool，通过 Performance 工具可以用来录制一段时间的 CPU 占用、内存占用、FPS 等运行时性能问题，通过 Network 工具可以用来分析加载性能问题。</p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d789fc7786?w=1240&#x26;h=1347&#x26;f=png&#x26;s=65568"></p>\n<p>例如，通过 Performance 工具的 Bottom Up 标签我们可以看出一段时间内耗时最多的操作，这对于优化 CPU 占用和 FPS 过低非常有用，可以看出最为耗时的操作发生在哪里，可以知道具体函数的执行时间，定位到瓶颈之后，我们就可以做一些针对性的优化。</p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d7dc70634d?w=1240&#x26;h=1362&#x26;f=png&#x26;s=98226"></p>\n<p>更多 Chrome Devtool 使用方式请参考<a href="https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/">使用 Chrome Devtool 定位性能问题 的指南</a></p>\n<h2>2. Vue 应用运行时性能优化建议</h2>\n<p>运行时性能主要关注 Vue 应用初始化之后对 CPU、内存、本地存储等资源的占用，以及对用户交互的及时响应。下面是一些有用的优化手段：</p>\n<h3>2.1 引入生产环境的 Vue 文件</h3>\n<p>开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。而在生产环境下，这些警告语句没有用，反而会增加应用的体积。有些警告检查还有一些小的<strong>运行时开销</strong>。</p>\n<p>当使用 webpack 或 Browserify 类似的构建工具时，Vue 源码会根据 process.env.NODE_ENV 决定是否启用生产环境模式，默认情况为开发环境模式。在 webpack 与 Browserify 中都有方法来覆盖此变量，以启用 Vue 的生产环境模式，同时在构建过程中警告语句也会被压缩工具去除。</p>\n<p>详细的做法请参阅 <a href="https://cn.vuejs.org/v2/guide/deployment.html">生产环境部署</a></p>\n<h3>2.2 使用单文件组件预编译模板</h3>\n<p>当使用 DOM 内模板或 JavaScript 内的字符串模板时，模板会在<strong>运行时被编译为渲染函数</strong>。通常情况下这个过程已经足够快了，但<strong>对性能敏感的应用还是最好避免这种用法</strong>。</p>\n<p>预编译模板最简单的方式就是使用<strong>单文件组件</strong>——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。</p>\n<p>详细的做法请参阅 <a href="https://cn.vuejs.org/v2/guide/deployment.html#%E6%A8%A1%E6%9D%BF%E9%A2%84%E7%BC%96%E8%AF%91">预编译模板</a></p>\n<h3>2.3 提取组件的 CSS 到单独到文件</h3>\n<p>当使用单文件组件时，组件内的 CSS 会以 <code>&#x3C;style></code> 标签的方式通过 JavaScript 动态注入。这有一些小小的<strong>运行时开销</strong>，将所有组件的 CSS 提取到同一个文件可以避免这个问题，也会让 CSS 更好地进行压缩和缓存。</p>\n<p>查阅这个构建工具各自的文档来了解更多：</p>\n<ul>\n<li><a href="https://vue-loader.vuejs.org/zh-cn/configurations/extract-css.html">webpack + vue-loader</a> (<code>vue-cli</code> 的 webpack 模板已经预先配置好)</li>\n<li><a href="https://github.com/vuejs/vueify#css-extraction">Browserify + vueify</a></li>\n<li><a href="https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler">Rollup + rollup-plugin-vue</a></li>\n</ul>\n<h3>2.4 利用<code>Object.freeze()</code>提升性能</h3>\n<p><code>Object.freeze()</code> 可以冻结一个对象，冻结之后不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。该方法返回被冻结的对象。</p>\n<p>当你把一个普通的 JavaScript 对象传给 Vue 实例的  <code>data</code>  选项，Vue 将遍历此对象所有的属性，并使用  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty">Object.defineProperty</a>  把这些属性全部转为 getter/setter，这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。</p>\n<p>但 Vue 在遇到像 <code>Object.freeze()</code> 这样被设置为不可配置之后的对象属性时，不会为对象加上 setter getter 等数据劫持的方法。<a href="https://github.com/vuejs/vue/blob/v2.5.17/src/core/observer/index.js?1535281657346#L134">参考 Vue 源码</a></p>\n<p><strong>Vue observer 源码</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d7dc90f5c1?w=1240&#x26;h=1104&#x26;f=png&#x26;s=335489"></p>\n<h4>2.4.1 性能提升效果对比</h4>\n<p>在基于 Vue 的一个 <a href="https://github.com/vuejs/vue/blob/v2.5.17/benchmarks/big-table/index.html?1535282017690">big table benchmark</a> 里，可以看到在渲染一个一个 1000 x 10 的表格的时候，开启<code>Object.freeze()</code> 前后重新渲染的对比。</p>\n<p><strong>big table benchmark</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d78d944dde?w=1240&#x26;h=775&#x26;f=png&#x26;s=257196"></p>\n<p><strong>开启优化之前</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/11/165c5feaccc752d5?w=1028&#x26;h=104&#x26;f=png&#x26;s=38063"></p>\n<p><strong>开启优化之后</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/11/165c5feadd555c81?w=924&#x26;h=92&#x26;f=png&#x26;s=35144"></p>\n<p>在这个例子里，<strong>使用了 <code>Object.freeze()</code>比不使用快了 4 倍</strong></p>\n<h4>2.4.2 为什么<code>Object.freeze()</code> 的性能会更好</h4>\n<p><strong>不使用<code>Object.freeze()</code> 的CPU开销</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d7c41b64bf?w=1240&#x26;h=835&#x26;f=png&#x26;s=278972"></p>\n<p><strong>使用 <code>Object.freeze()</code>的CPU开销</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d7fdffa474?w=1240&#x26;h=537&#x26;f=png&#x26;s=235291"></p>\n<p>对比可以看出，使用了 <code>Object.freeze()</code> 之后，减少了 observer 的开销。</p>\n<h4>2.4.3 <code>Object.freeze()</code>应用场景</h4>\n<p>由于 <code>Object.freeze()</code> 会把对象冻结，所以比较适合展示类的场景，如果你的数据属性需要改变，可以重新替换成一个新的 <code>Object.freeze()</code>的对象。</p>\n<h3>2.5 扁平化 Store 数据结构</h3>\n<p>很多时候，我们会发现接口返回的信息是如下的深层嵌套的树形结构：</p>\n<pre><code class="language-json">{\n  "id": "123",\n  "author": {\n    "id": "1",\n    "name": "Paul"\n  },\n  "title": "My awesome blog post",\n  "comments": [\n    {\n      "id": "324",\n      "commenter": {\n        "id": "2",\n        "name": "Nicole"\n      }\n    }\n  ]\n}\n</code></pre>\n<p>假如直接把这样的结构存储在 store 中，如果想修改某个 commenter 的信息，我们需要一层层去遍历找到这个用户的信息，同时有可能这个用户的信息出现了多次，还需要把其他地方的用户信息也进行修改，每次遍历的过程会带来额外的性能开销。</p>\n<p>假设我们把用户信息在 store 内统一存放成 <code>users[id]</code>这样的结构，修改和读取用户信息的成本就变得非常低。</p>\n<p>你可以手动去把接口里的信息通过类似数据的表一样像这样存起来，也可以借助一些工具，这里就需要提到一个概念叫做 <code>JSON数据规范化（normalize）</code>, Normalizr 是一个开源的工具，可以将上面的深层嵌套的 JSON 对象通过定义好的 schema 转变成使用 id 作为字典的实体表示的对象。</p>\n<p>举个例子，针对上面的 JSON 数据，我们定义 <code>users</code> <code>comments</code> <code>articles</code> 三种 schema：</p>\n<pre><code class="language-javascript">import {normalize, schema} from \'normalizr\';\n\n// 定义 users schema\nconst user = new schema.Entity(\'users\');\n\n// 定义 comments schema\nconst comment = new schema.Entity(\'comments\', {\n  commenter: user,\n});\n\n// 定义 articles schema\nconst article = new schema.Entity(\'articles\', {\n  author: user,\n  comments: [comment],\n});\n\nconst normalizedData = normalize(originalData, article);\n</code></pre>\n<p>normalize 之后就可以得到下面的数据，我们可以按照这种形式存放在 store 中，之后想修改和读取某个 id 的用户信息就变得非常高效了，时间复杂度降低到了 O(1)。</p>\n<pre><code class="language-js">{\n  result: "123",\n  entities: {\n    "articles": {\n      "123": {\n        id: "123",\n        author: "1",\n        title: "My awesome blog post",\n        comments: [ "324" ]\n      }\n    },\n    "users": {\n      "1": { "id": "1", "name": "Paul" },\n      "2": { "id": "2", "name": "Nicole" }\n    },\n    "comments": {\n      "324": { id: "324", "commenter": "2" }\n    }\n  }\n}\n</code></pre>\n<p>需要了解更多请参考 normalizr 的文档 <a href="https://github.com/paularmstrong/normalizr">https://github.com/paularmstrong/normalizr</a></p>\n<h3>2.6 避免持久化 Store 数据带来的性能问题</h3>\n<p>当你有让 Vue App 离线可用，或者有接口出错时候进行灾备的需求的时候，你可能会选择把 Store 数据进行持久化，这个时候需要注意以下几个方面：</p>\n<h4>2.6.1 持久化时写入数据的性能问题</h4>\n<p>Vue 社区中比较流行的 vuex-persistedstate，利用了 store 的 subscribe 机制，来订阅 Store 数据的 mutation，如果发生了变化，就会写入 storage 中，默认用的是 localstorage 作为持久化存储。</p>\n<p>也就是说默认情况下每次 commit 都会向 localstorage 写入数据，localstorage 写入是同步的，而且存在不小的性能开销，如果你想打造 60fps 的应用，就必须避免频繁写入持久化数据</p>\n<p>下面是开发环境下通过 Performance 工具抓取的一个截图，可以看到出现了一次长达 6s 的卡顿：</p>\n<p><strong>6秒钟的卡顿</strong>\n<img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d84795d172?w=1240&#x26;h=911&#x26;f=png&#x26;s=405609"></p>\n<p>通过 Bottom-Up 可以看到 setState 占用了 3241.4ms 的 CPU 执行时间，而 setState 正是在向 Storage 写入数据。</p>\n<p><strong>vuex-persistedstate setState 源码</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d847a933ca?w=1240&#x26;h=779&#x26;f=png&#x26;s=265558"></p>\n<p>我们应该尽量减少直接写入 Storage 的频率：</p>\n<ul>\n<li>多次写入操作合并为一次，比如采用函数节流或者将数据先缓存在内存中，最后在一并写入</li>\n<li>只有在必要的时候才写入，比如只有关心的模块的数据发生变化的时候才写入</li>\n</ul>\n<h4>2.6.2 避免持久化存储的容量持续增长</h4>\n<p>由于持久化缓存的容量有限，比如 localstorage 的缓存在某些浏览器只有 5M，我们不能无限制的将所有数据都存起来，这样很容易达到容量限制，同时数据过大时，读取和写入操作会增加一些性能开销，同时内存也会上涨。</p>\n<p>尤其是将 API 数据进行 normalize 数据扁平化后之后，会将一份数据散落在不同的实体上，下次请求到新的数据也会散落在其他不同的实体上，这样会带来持续的存储增长。</p>\n<p>因此，当设计了一套持久化的数据缓存策略的时候，同时应该设计旧数据的缓存清除策略，例如请求到新数据的时候将旧的实体逐个进行清除。</p>\n<h3>2.7 优化无限列表性能</h3>\n<p>如果你的应用存在非常长或者无限滚动的列表，那么采用 <strong>窗口化</strong> 的技术来优化性能，只需要渲染少部分区域的内容，减少重新渲染组件和创建 dom 节点的时间。</p>\n<p><a href="https://github.com/tangbc/vue-virtual-scroll-list">vue-virtual-scroll-list</a> 和 <a href="https://github.com/Akryum/vue-virtual-scroller">vue-virtual-scroller</a> 都是解决这类问题的开源项目。你也可以参考 Google 工程师的文章<a href="https://developers.google.com/web/updates/2016/07/infinite-scroller">Complexities of an Infinite Scroller</a> 来尝试自己实现一个虚拟的滚动列表来优化性能，主要使用到的技术是 DOM 回收、墓碑元素和滚动锚定。</p>\n<p><strong>Google 工程师绘制的无限列表设计</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d8478b24bf?w=1218&#x26;h=1314&#x26;f=png&#x26;s=33736"></p>\n<h3>2.8 通过组件懒加载优化超长应用内容初始渲染性能</h3>\n<p>上面提到的无限列表的场景，比较适合列表内元素非常相似的情况，不过有时候，你的 Vue 应用的超长列表内的内容往往不尽相同，例如在一个复杂的应用的主界面中，整个主界面由非常多不同的模块组成，而用户看到的往往只有首屏一两个模块。在初始渲染的时候不可见区域的模块也会执行和渲染，带来一些额外的性能开销。</p>\n<p><strong>使用组件懒加载在不可见时只需要渲染一个骨架屏，不需要真正渲染组件</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/11/165c5feaf23067e1?w=378&#x26;h=382&#x26;f=jpeg&#x26;s=16139" alt="image"></p>\n<p>你可以对组件直接进行懒加载，对于不可见区域的组件内容，直接不进行加载和初始化，避免初始化渲染运行时的开销。具体可以参考我们之前的专栏文章 <a href="https://juejin.im/post/59bf501ff265da06602971b9">性能优化之组件懒加载: Vue Lazy Component 介绍</a>，了解如何做到组件粒度的懒加载。</p>\n<h2>3. Vue 应用加载性能优化建议</h2>\n<h3>3.1 利用服务端渲染（SSR）和预渲染（Prerender）来优化加载性能</h3>\n<p>在一个单页应用中，往往只有一个 html 文件，然后根据访问的 url 来匹配对应的路由脚本，动态地渲染页面内容。单页应用比较大的问题是首屏可见时间过长。</p>\n<p>单页面应用显示一个页面会发送多次请求，第一次拿到 html 资源，然后通过请求再去拿数据，再将数据渲染到页面上。而且由于现在微服务架构的存在，还有可能发出多次数据请求才能将网页渲染出来，每次数据请求都会产生 RTT（往返时延），会导致加载页面的时间拖的很长。</p>\n<p><strong>服务端渲染、预渲染和客户端渲染的对比</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/10/165c22d84c84cebf?w=1240&#x26;h=638&#x26;f=png&#x26;s=173320"></p>\n<p>这种情况下可以采用服务端渲染（SSR）和预渲染（Prerender）来提升加载性能，这两种方案，用户读取到的直接就是网页内容，由于少了节省了很多 RTT（往返时延），同时，还可以对一些资源内联在页面，可以进一步提升加载的性能。</p>\n<p>可以参考我们的专栏文章 <a href="https://juejin.im/post/59d49d976fb9a00a571d651d">优化向：单页应用多路由预渲染指南</a> 了解如何利用预渲染进行优化。</p>\n<p>服务端渲染（SSR）可以考虑使用 Nuxt 或者按照 Vue 官方提供的 <a href="https://ssr.vuejs.org/zh/">Vue SSR 指南</a>来一步步搭建。</p>\n<h3>3.2 通过组件懒加载优化超长应用内容加载性能</h3>\n<p>在上面提到的超长应用内容的场景中，通过组件懒加载方案可以优化初始渲染的运行性能，其实，这对于优化应用的加载性能也很有帮助。</p>\n<p>组件粒度的懒加载结合异步组件和 webpack 代码分片，可以保证按需加载组件，以及组件依赖的资源、接口请求等，比起通常单纯的对图片进行懒加载，更进一步的做到了按需加载资源。</p>\n<p><strong>使用组件懒加载之前的请求瀑布图</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/11/165c5feb03e51a44?w=1169&#x26;h=664&#x26;f=jpeg&#x26;s=61496"></p>\n<p><strong>使用组件懒加载之后的请求瀑布图</strong></p>\n<p><img src="https://user-gold-cdn.xitu.io/2018/9/11/165c5feb14c9cd5c?w=678&#x26;h=377&#x26;f=jpeg&#x26;s=20406"></p>\n<p>使用组件懒加载方案对于超长内容的应用初始化渲染很有帮助，可以减少大量必要的资源请求，缩短渲染关键路径，具体做法请参考我们之前的专栏文章 <a href="https://juejin.im/post/59bf501ff265da06602971b9">性能优化之组件懒加载: Vue Lazy Component 介绍</a>。</p>\n<h2>总结</h2>\n<p>本文总结了 Vue 应用运行时以及加载时的一些性能优化措施，下面做一个回顾和概括：</p>\n<ul>\n<li>\n<p>Vue 应用运行时性能优化措施</p>\n<ul>\n<li>引入生产环境的 Vue 文件</li>\n<li>使用单文件组件预编译模板</li>\n<li>提取组件的 CSS 到单独到文件</li>\n<li>利用<code>Object.freeze()</code>提升性能</li>\n<li>扁平化 Store 数据结构</li>\n<li>合理使用持久化 Store 数据</li>\n<li>组件懒加载</li>\n</ul>\n</li>\n<li>\n<p>Vue 应用加载性能优化措施</p>\n<ul>\n<li>服务端渲染 / 预渲染</li>\n<li>组件懒加载</li>\n</ul>\n</li>\n</ul>\n<p>文章总结的这些性能优化手段当然不能覆盖所有的 Vue 应用性能问题，我们也会不断总结和补充其他问题及优化措施，希望文章中提到这些实践经验能给你的 Vue 应用性能优化工作带来小小的帮助。</p>'}}}},pathContext:{slug:"vue-app-performance-enhance-guide"}}}});
//# sourceMappingURL=path---blog-vue-app-performance-enhance-guide-d77cdc0df32d2dbc552f.js.map