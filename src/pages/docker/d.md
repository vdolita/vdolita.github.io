# 分享你的应用

在我们完成镜像构建之后，可以上传镜像到公共/私有仓库来分享给他人。本节我们将使用 Docker Hub 仓库来进行学习。

## 注册属于自己的存储库

镜像需要仓库来存储，我们可以使用 Docker Hub 来注册属于自己的存储库，需要注意的是，如果你创建的是公共仓库，那么其他人都可拉取并使用你的镜像，因此需要注意安全问题。本章为了学习需要我们将创建公共仓库。

1. 注册并登陆 [Docker Hub](https://hub.docker.com/)，**Docker ID** 将是你的个人仓库的独有 ID，请使用简洁明了的 ID。
2. 点击 **Create Repository** 按钮
3. 库名称我们可以使用任意名字比如 `getting-started`，请确保 **Visibility** 选项是 **Public**
4. 点击 **Create** 按钮

接下来你应该可以看到如下页面  
![repo](https://docs.docker.com/get-started/images/push-command.png)

## 在镜像中添加个人内容

为了将我们的镜像区分于其他人，我们可以添加属于个人的独特标记，下面让我们更改 `src/static/js/app.js` 第 56 行的内容为(替换其中的 YOUR-USER-NAME 内容)

`<p className="text-center">YOUR-USER-NAME have no todo items yet! Add one above!</p>`

然后再次构建镜像

`docker build -t getting-started .`

## 推送镜像

> **以下内容是个人理解**
>
> 远程仓库镜像地址实际上就是 URL，比如当我们拉取`alpine`镜像时`docker pull alpine` 等价于 `docker pull alpine:latest` 实际上是 `docker pull registry.hub.docker.com/library/alpine:latest`
>
> 使用官方仓库镜像的 URL 地址结构如下(library 是默认的官方地址)  
> `registry.hub.docker.com/<user>/<image>:<tagname>`  
> 私有仓库 URL 地址则如下所示  
> `docker-hub.phoenix.moe/<image>:<tagname>`

我们之前构建的镜像都是位于本地，我们通过推送镜像到远程公共仓库来实现与他人共享。以下命令中的 **YOUR-USER-NAME** 请替换为你注册时候使用的 **Docker ID**

1. 为了推送到我们的个人仓库，我们需要先登录 Docker Hub  
   `Docker login -u <YOUR-USER-NAME>`
2. 接下来我们需要给我们的镜像一个 **tag**，我们之前构建镜像使用的命令 `docker build -t getting-started .` 为我们构建了一个 tag 为 **getting-started** 的镜像，但是为了推送到我们个人的官方仓库地址我们需要使用另一个 tag

   `docker tag getting-started YOUR-USER-NAME/getting-started`

   以上命令其实等价于

   `docker tag getting-started YOUR-USER-NAME/getting-started:latest`

   如果你直接推送 `docker tag getting-started getting-started` 将会出现 Permission denied 的错误，因为实际上我们推送的地址是 `registry.hub.docker.com/library/getting-started:latest` ，而对于这个官方地址我们是没有权限的。

3. 现在我们可以尝试推送镜像到我们位于官方仓库的个人仓库(如果你的镜像过大网络很慢那将需要相当长的时间)  
   `docker push YOUR-USER-NAME/getting-started`

4. 我们可以通过以下命令来显示我们本地的镜像列表  
   `docker image ls`

## 在其他机器上运行你的镜像

现在我们将前往 [Play With Docker](https://labs.play-with-docker.com/) 来进一步实验

1. 在你的浏览器中打开 [Play With Docker](https://labs.play-with-docker.com/) 页面
2. 点击 **Login** 并在下拉框中选择 **Docker**
3. 通过你之前注册的 Docker 账号登陆
4. 登陆之后，点击左面板的 **ADD NEW INSTANCE** 选项，等待一小会儿你的浏览器页面应该会打开一个命令行终端窗口如下图所示  
   ![Terminal](https://docs.docker.com/get-started/images/pwd-add-new-instance.png)
5. 在终端窗口中，运行你刚才 push 的应用镜像  
   `docker run -dp 3000:3000 YOUR-USER-NAME/getting-started`
6. 等待容器成功运行起来之后，你应该会在页面上方 **OPEN PORT** 按钮右侧多出一个 **3000** 的徽章，点击此徽章即可在新页面中看到你正在运行的应用。如果没有显示 3000 的徽章，你可以点击 **OPEN PORT** 输入 3000 来手动操作。

# 回顾

在这一节中, 我们学习了如何推送推送我们的镜像到远端的仓库，并且在其他主机中运行，这是不是与我们的版本发布有些关联呢。

在下一节中我们将学习如何保存我们的数据文件
