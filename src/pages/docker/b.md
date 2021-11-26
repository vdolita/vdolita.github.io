# Sample Docker Application

通过本节我们将使用 Docker 来运行一个简单的 Nodejs 程序。

首先我们下载示例代码到本地  
`git clone https://github.com/docker/getting-started.git`

将克隆好的代码中的 **app** 单独目录拷贝出来，放到任意目录下，然后使用 `vscode` 打开该目录，你应该看到如下目录结构。

![directory](https://docs.docker.com/get-started/images/ide-screenshot.png)

为了构建我们的应用程序，我们需要使用一个 **[Dockerfile](https://docs.docker.com/engine/reference/builder/)** 。Dockerfile 是一个基于文本的指令脚本，Docker 根据该文件生成二进制的镜像文件。关于 Dockerfile 的详细说明我们后面会讲解，下面我们先根据以下步骤构建运行我们的镜像。

## 构建镜像

1.  我们现在根目录下创建一个 `Dockerfile` 文件(没有后缀)，使用以下内容

    >

        FROM node:12-alpine
        RUN apk add --no-cache python3 g++ make
        WORKDIR /app
        COPY . .
        RUN yarn install --production
        CMD ["node", "src/index.js"]

2.  接下来让我们打开 `vscode` 的命令面板, 通过以下命令构建我们的镜像

    `docker build -t getting-started .`

    此命令使用 Dockerfile 构建新的容器映像。 您可能已经注意到下载了很多 **Layer**。 这是因为我们指示构建器我们要从 node:12-alpine 镜像开始，由于我们的机器上没有该镜像文件，因此需要下载该镜像文件。  
    镜像下载完成后，Docker 会拷贝当前目录到镜像中，并使用 yarn 来安装我们应用程序的依赖项。CMD 指令指定从该映像启动容器时要运行的默认命令。  
    最后，使用 `-t` 来标记命名我们构建的图像为 **getting-started**。  
    命令末尾的 `.` 告诉 Docker 从当前目录中寻找 **Dockerfile**。

## 运行容器

现在我们有了镜像文件就可以运行我们的应用容器了。

1. 通过 `docker run` 命令来启动我们刚才定义的镜像  
   `docker run -dp 3000:3000 getting-started`  
   请注意 `-d`参数表示以后台的方式运行， `-p`则表示转发本地的 3000 端口到容器的 3000 端口。
2. 等待几秒钟容器初始化完成之后，在浏览器中打开[http://localhost:3000](http://localhost:3000)，你应该可以看到我们的应用页面如下图所示  
   ![app page](https://docs.docker.com/get-started/images/todo-list-empty.png)
3. 接下来你可以尝试添加，标记，删除 item 来测试我们的应用

到目前为止，你已经成功通过 Dockerfile 来构建并运行你的应用，接下来让我们尝试更多管理容器的方法和技巧。

> 还记得怎么查看正在运行的容器的命令吧，尝试一下吧。
