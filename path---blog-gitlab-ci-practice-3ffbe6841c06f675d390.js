webpackJsonp([0xc6b79ac9463],{387:function(n,a){n.exports={data:{contentfulBlogPost:{title:"基于 Gitlab CI 搭建持续集成环境",publishDate:"February 9th, 2017",heroImage:{sizes:{base64:null,aspectRatio:2.594142259414226,src:"//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=1180&q=50&bg=rgb%3A000000",srcSet:"//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=295&h=114&q=50&bg=rgb%3A000000 295w,\n//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=590&h=227&q=50&bg=rgb%3A000000 590w,\n//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=1180&h=455&q=50&bg=rgb%3A000000 1180w,\n//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=1240&h=478&q=50&bg=rgb%3A000000 1240w",srcWebp:"//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=1180&q=50&fm=webp&bg=rgb%3A000000",srcSetWebp:"//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=295&h=114&q=50&fm=webp&bg=rgb%3A000000 295w,\n//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=590&h=227&q=50&fm=webp&bg=rgb%3A000000 590w,\n//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=1180&h=455&q=50&fm=webp&bg=rgb%3A000000 1180w,\n//images.ctfassets.net/9ys45gwh7pzh/4shwYI3POEGkw0Eg6kcyaQ/e1b7fb35857923f885b91aeb4844de70/64173-444f3b7a2f88eba4.png?w=1240&h=478&q=50&fm=webp&bg=rgb%3A000000 1240w",sizes:"(max-width: 1180px) 100vw, 1180px"}},body:{childMarkdownRemark:{html:'<h1>基于 Gitlab CI 搭建持续集成环境</h1>\n<p>本文简单介绍了<strong>持续集成</strong>的概念并着重介绍了如何<strong>基于 Gitlab CI 快速构建持续集成环境</strong>，主要介绍了 Gitlab CI 的<strong>基本功能</strong>和<strong>入门操作</strong>流程。</p>\n<blockquote>\n<p>本文提到的 Gitlab 版本为 8.x ，新版的 Gitlab 界面可能会有所不同</p>\n</blockquote>\n<p><a name="44etom"></a></p>\n<h2><a href="#44etom"></a>什么是持续集成？</h2>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-0f610cc3507dc987.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p>持续集成（Continuous Integration，简称 CI）指的是，频繁地（一天多次）将代码集成到主干。</p>\n<p><a name="woymie"></a></p>\n<h3><a href="#woymie"></a>持续集成的好处主要有两个:</h3>\n<p><a name="kznhcm"></a></p>\n<h3><a href="#kznhcm"></a>快速发现错误</h3>\n<p>每完成一点更新，就集成到主干，可以快速发现错误，定位错误也比较容易</p>\n<p><a name="f6izut"></a></p>\n<h3><a href="#f6izut"></a>防止分支大幅偏离主干</h3>\n<p>如果不是经常集成，主干又在不断更新，会导致以后集成的难度变大，甚至难以集成。</p>\n<p>持续集成的目的，就是让产品可以快速迭代，同时还能保持高质量。它的核心措施是，代码集成到主干之前，必须通过自动化测试。只要有一个测试用例失败，就不能集成。</p>\n<p><a name="ni6xoc"></a></p>\n<h2><a href="#ni6xoc"></a>持续交付、持续部署的概念</h2>\n<p>持续交付（Continuous delivery）指的是，频繁地将软件的新版本，交付给质量团队或者用户，以供评审。如果评审通过，代码就进入生产阶段。</p>\n<p>持续部署（continuous deployment）是持续交付的下一步，指的是代码通过评审以后，自动部署到生产环境。</p>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-b5921de034a8db7e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p><a name="my70nf"></a></p>\n<h2><a href="#my70nf"></a>持续集成的原则</h2>\n<p>业界普遍认同的持续集成的原则包括：</p>\n<ul>\n<li>\n<p>需要版本控制软件保障团队成员提交的代码不会导致集成失败。常用的版本控制软件有 git、svn 等；</p>\n</li>\n<li>\n<p>开发人员必须及时向版本控制库中提交代码，也必须经常性地从版本控制库中更新代码到本地；</p>\n</li>\n<li>\n<p>需要有专门的集成服务器来执行集成构建。根据项目的具体实际，集成构建可以被软件的修改来直接触发，也可以定时启动，如每半个小时构建一次；</p>\n</li>\n<li>\n<p>必须保证构建的成功。如果构建失败，修复构建过程中的错误是优先级最高的工作。一旦修复，需要手动启动一次构建。</p>\n</li>\n</ul>\n<p><a name="yd7pur"></a></p>\n<h2><a href="#yd7pur"></a>持续集成系统的组成</h2>\n<p>由此可见，一个完整的构建系统必须包括：</p>\n<ul>\n<li>\n<p>一个自动构建过程，包括自动编译、分发、部署和测试等。</p>\n</li>\n<li>\n<p>一个代码存储库，即需要版本控制软件来保障代码的可维护性，同时作为构建过程的素材库。</p>\n</li>\n<li>\n<p>一个持续集成服务器。</p>\n</li>\n</ul>\n<p><a name="1nswpg"></a></p>\n<h2><a href="#1nswpg"></a>GitLab CI 介绍</h2>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-444f3b7a2f88eba4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p>GitLab CI 是 GitLab 提供的持续集成服务，只要在你的仓库根目录 创建一个.gitlab-ci.yml 文件， 并为该项目指派一个 Runner，当有合并请求或者 push 的时候就会触发 build。</p>\n<p>这个.gitlab-ci.yml 文件定义 GitLab runner 要做哪些操作。 默认有 3 个[stages(阶段)]: build、test、deploy。</p>\n<p>当 build 完成后(返回非零值)，你会看到 push 的 commit 或者合并请求前面出现一个绿色的对号。 这个功能很方便的让你检查出来合并请求是否会导致 build 失败， 免的你去检查代码。</p>\n<p>大部分项目用 GitLab\'s CI 服务跑 build 测试， 开发者会很快得到反馈，知道自己是否写出了 BUG。</p>\n<p>所以简单的说，要让 CI 工作可总结为以下几点:</p>\n<ul>\n<li>\n<p>在仓库根目录创建一个名为.gitlab-ci.yml 的文件</p>\n</li>\n<li>\n<p>为该项目配置一个 Runner</p>\n</li>\n</ul>\n<p>完成上面的步骤后，每次 push 代码到 Git 仓库， Runner 就会自动开始 pipeline。</p>\n<p><a name="fis5wl"></a></p>\n<h2><a href="#fis5wl"></a>基于 Gitlab CI 快速搭建持续集成环境</h2>\n<p><a name="qhgqyf"></a></p>\n<h3><a href="#qhgqyf"></a>开启 Gitlab CI 功能</h3>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-eab9ab2727619f29.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p>在自己的 Gitlab 中打开 CI 界面，比如迅雷的 Gitlab，地址是 <a href="https://gitlab.xunlei.cn/ci/projects">https://gitlab.xunlei.cn/ci/projects</a>，找到自己项目后选择 “Add project To CI”</p>\n<p><a name="wm4ods"></a></p>\n<h3><a href="#wm4ods"></a>项目 Gitlab CI 配置</h3>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-ab24ef4c57d3b411.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p>可以对项目的构建进行详细配置，比如构建的时间表及需要 CI 进行持续集成的分支等，这里配置了 对 master 和 develop 分支进行持续集成。</p>\n<p><a name="hdf2kl"></a></p>\n<h3><a href="#hdf2kl"></a>配置一个 Runner</h3>\n<p>GitLab CI 中，runner 是一个隔离的虚拟机器，用来配合 Gitlab CI 进行构建。</p>\n<p><a name="1mfqgc"></a></p>\n<h4><a href="#1mfqgc"></a>安装 GitLab-Runner</h4>\n<p><a name="pp3cuq"></a></p>\n<h5><a href="#pp3cuq"></a>安装 gitlab-ci-multi-runner</h5>\n<p>环境：centos 7, 使用了清华大学的镜像</p>\n<p>新建 gitlab-ci-multi-runner.repo</p>\n<pre><code class="language-bash">touch /etc/yum.repos.d/gitlab-ci-multi-runner.repo\n</code></pre>\n<p>将以下内容写入文件</p>\n<pre><code>[gitlab-ci-multi-runner]\nname=gitlab-ci-multi-runner\nbaseurl=http://mirrors.tuna.tsinghua.edu.cn/gitlab-ci-multi-runner/yum/el7\nrepo_gpgcheck=0\ngpgcheck=0\nenabled=1\ngpgkey=https://packages.gitlab.com/gpg.key\n</code></pre>\n<p>执行</p>\n<pre><code class="language-bash">sudo yum makecache\nsudo yum install gitlab-ci-multi-runner\n</code></pre>\n<p><a name="50xlwi"></a></p>\n<h5><a href="#50xlwi"></a>其他系统安装</h5>\n<p><a href="https://docs.gitlab.com/runner/install/">https://docs.gitlab.com/runner/install/</a></p>\n<p><a name="xdurgi"></a></p>\n<h5><a href="#xdurgi"></a>Gitlab CI Multi Runner 国内镜像</h5>\n<p><a href="https://mirrors.tuna.tsinghua.edu.cn/help/gitlab-ci-multi-runner/">https://mirrors.tuna.tsinghua.edu.cn/help/gitlab-ci-multi-runner/</a></p>\n<p><a name="laabxf"></a></p>\n<h4><a href="#laabxf"></a>Runner 的区分</h4>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-f5d54d4508c8bf2a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<ul>\n<li>\n<p>指定 Runner： 可以指定运行某一个 Gitlab CI 的项目</p>\n</li>\n<li>\n<p>共享 Runner：可以运行所有的 CI 项目</p>\n</li>\n</ul>\n<blockquote>\n<p>Gitlab Runner 和 Gitlab 不能安装在同一个机器</p>\n</blockquote>\n<p><a name="ockwey"></a></p>\n<h4><a href="#ockwey"></a>注册一个指定的 runner</h4>\n<blockquote>\n<p>注册共享的 Runner 需要 gitlab 的 admin 权限</p>\n</blockquote>\n<pre><code class="language-bash">sudo gitlab-ci-multi-runner register\n</code></pre>\n<ol>\n<li>\n<p>输入 Gitlab CI 地址, (e.g. <a href="https://gitlab.xunlei.cn/ci">https://gitlab.xunlei.cn/ci</a>)</p>\n</li>\n<li>\n<p>输入项目 CI token</p>\n</li>\n<li>\n<p>输入 Runner 描述（e.g. <a href="http://home.xl9.xunlei.com">home.xl9.xunlei.com</a> 测试 runner）</p>\n</li>\n<li>\n<p>输入 Runner 标签，可以多个，用逗号隔开（e.g. 10.10.34.91-dev）</p>\n</li>\n<li>\n<p>输入 Runner 执行的语言 (e.g. shell)</p>\n</li>\n</ol>\n<p>注册完成之后，GitLab-CI 立刻就会多出一条 Runner 记录</p>\n<p><a name="2qcoek"></a></p>\n<h4><a href="#2qcoek"></a>启动 runner</h4>\n<p>这里把批量运行 Runner 这个功能安装为一项服务</p>\n<pre><code class="language-bash"># Install runner as service and start it:\n\ncd ~\ngitlab-ci-multi-runner install\ngitlab-ci-multi-runner start\n</code></pre>\n<p><a name="gdvxxc"></a></p>\n<h3><a href="#gdvxxc"></a>创建<code>.gitlab-ci.yml</code></h3>\n<p><a name="vnv0gp"></a></p>\n<h4><a href="#vnv0gp"></a><code>.gitlab-ci.yml</code> 文件是什么</h4>\n<p><code>.gitlab-ci.yml</code> 用来配置 CI 用你的项目中做哪些操作，这个文件位于仓库的根目录。</p>\n<p>当有新内容 push 到仓库后，GitLab 会查找是否有.gitlab-ci.yml 文件，如果文件存在， Runners 将会根据该文件的内容开始 build 本次 commit。</p>\n<blockquote>\n<p><code>.gitlab-ci.yml</code> 使用 YAML 语法， 你需要格外注意缩进格式，要用空格来缩进，不能用 tabs 来缩进。</p>\n</blockquote>\n<p><a name="30rvuv"></a></p>\n<h4><a href="#30rvuv"></a>创建<code>.gitlab-ci.yml</code></h4>\n<pre><code class="language-yaml">stages:\n  - test\n  - deploy\n\n# 变量\nvariables:\n  DEV_RSYNC_PATH: \'/data/deploy/xunlei.com/misc.xl9.xunlei.com/d/\'\n\n# 所有 stage 之前的操作\nbefore_script:\n  - npm set registry http://xnpm.sz.xunlei.cn\n  - npm install\n\n# 代码检查\nlint:\n  stage: test\n  script: npm run lint\n\n# 单元测试\nunit:\n  stage: test\n  script: npm run unit\n\n# 部署测试服务器\ndeploy_dev:\n  stage: deploy\n  tags:\n    - 10.10.34.91-dev\n  only:\n    - develop\n  script:\n    - rsync -av --delete-after --exclude-from=/data/shell/home.xl9.xunlei_exclude.list . $DEV_RSYNC_PATH\n    - chmod -R 755 $DEV_RSYNC_PATH\n    - chown -R nobody:nobody $DEV_RSYNC_PATH\n    - find $DEV_RSYNC_PATH -type f -exec chmod 644 {} \\;\n    - cd $DEV_RSYNC_PATH\n    - npm install\n</code></pre>\n<p><a name="zc9gww"></a></p>\n<h4><a href="#zc9gww"></a>推送构建配置文件</h4>\n<p>配置好<code>.gitlab-ci.yml</code>文件之后，只要把它加入 git 后然后推送到远程仓库，CI 就会开始自动化集成</p>\n<p><a name="eolxgd"></a></p>\n<h3><a href="#eolxgd"></a>查看可视化的构建过程</h3>\n<p>Gitlab CI 提供了可视化的构建过程的显示可以随时查看。</p>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-a5e4d7f9a357bfff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p><a name="7g4ggi"></a></p>\n<h3><a href="#7g4ggi"></a>启用构建邮件通知</h3>\n<p>Gitlab CI 提高了一些 Service， 比如邮件通知，可以配置一系列接受邮件的地址和是否只有失败的时候才发送邮件。</p>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-3340515c0dce48ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-f83e13188d00ab95.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p><a name="hlortb"></a></p>\n<h3><a href="#hlortb"></a>徽章</h3>\n<p>徽章，当 Pipelines 执行完成，会生成徽章，你可以将这些徽章加入到你的 <a href="http://README.md">README.md</a> 文件或者你的网站。</p>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-056af2b71ff5af9c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>\n<p><a name="iu7mkz"></a></p>\n<h2><a href="#iu7mkz"></a>结语</h2>\n<p>本文简单介绍了持续集成的概念并着重介绍了如何基于 Gitlab CI 快速构建持续集成环境，主要介绍了 Gitlab CI 的基本功能和入门操作流程。<br />希望在进一步的学习和应用中与大家分享 Gitlab CI 的其它高级的应用。</p>\n<p><a name="7qszpe"></a></p>\n<h2><a href="#7qszpe"></a>延伸阅读</h2>\n<ul>\n<li>\n<p><a href="https://doc.gitlab.cc/ce/ci/quick_start/README.html">https://doc.gitlab.cc/ce/ci/quick_start/README.html</a></p>\n</li>\n<li>\n<p><a href="http://www.jianshu.com/p/2b43151fb92e">http://www.jianshu.com/p/2b43151fb92e</a></p>\n</li>\n<li>\n<p><a href="https://scarletsky.github.io/2016/07/29/use-gitlab-ci-for-continuous-integration/">https://scarletsky.github.io/2016/07/29/use-gitlab-ci-for-continuous-integration/</a></p>\n</li>\n</ul>\n<p><a name="r7adso"></a></p>\n<h2><a href="#r7adso"></a>关于我</h2>\n<blockquote>\n<p>来自 <strong>迅雷前端</strong> 团队。在迅雷的业务开发之余，创办了内部组件仓库 XNPM ，参与了 @xunlei/vue-lazy-component 等几个迅雷前端开源项目的开发。个人开源项目有 mrn.js 等。我是一个热爱前端技术，喜欢造轮子，爱折腾的人，也是一个奉行“懒惰使人进步”的懒人工程师。</p>\n</blockquote>\n<p><img src="http://upload-images.jianshu.io/upload_images/64173-911068f632c162cf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240#width="></p>'}}}},pathContext:{slug:"gitlab-ci-practice"}}}});
//# sourceMappingURL=path---blog-gitlab-ci-practice-3ffbe6841c06f675d390.js.map