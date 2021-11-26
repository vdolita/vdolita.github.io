# 更新应用

本节我们主要学习如何更新我们的应用程序。

## 更新源代码

1. 修改 `src/static/js/app.js` 文件的第 56 行，修改为以下提示内容。  
   `<p className="text-center">You have no todo items yet! Add one above!</p>`
2. 重新构建应用镜像  
   `docker build -t getting-started .`  
   你会发现我们这一个构建速度比上一次快了许多，这是因为第一次构建时我们已经将 `node:12-alpine` 镜像下载到了本地
3. 运行一个新的应用容器  
   `docker run -dp 3000:3000 getting-started`

不幸的是你应该会看到以下错误

> docker: Error response from daemon: driver failed programming external connectivity on endpoint laughing_burnell
> (bb242b2ca4d67eba76e79474fb36bb5125708ebdabd7f45c8eaf16caaabde9dd): Bind for 0.0.0.0:3000 failed: port is already allocated.

这是因为我们已经有一个正在运行的容器了，**3000** 端口已经被占用，因此我们需要移除旧的容器。

## 更新容器

我们有多种方式来移除一个正在运行的容器。

### 通过 CLI

1. 首先获取容器 ID  
   `docker ps`
2. 通过 `docker stop` 命令停止容器  
   `docker stop <the-container-id>`
3. 销毁**已经停止**的容器  
    `docker rm <the-container-id>`
   > 如果遗忘容器 ID，可以通过 `docker ps -a` 来展现已经停止的容器  
   > 你可以通过 `docker rm -f <the-container-id>` 来强制销毁一个**正在运行**的容器

### 通过 Docker desktop 的 Dashbord 面板

![Dashboard](https://docs.docker.com/get-started/images/dashboard-removing-container.png)

## 启动新容器

现在我们可以启动一个新的容器来查看我们的更改。

1. 启动容器  
   `docker run -dp 3000:3000 getting-started`
2. 刷新你的浏览器页面 [http://localhost:3000](http://localhost:3000)，你应该可以看到新的提示语了
   ![tip](https://docs.docker.com/get-started/images/todo-list-updated-empty-text.png)

# 回顾

当我们更新容器之后，我们会发现之前添加的条目都消失了，而且仅仅是这个简单的代码更改就需要如此之多的步骤，后面我们会介绍新的方法来避免这种问题。
