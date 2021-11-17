# 容器实践

在本实践中我们将主要通过命令行来进行操作，在 Docker desktop 中也可以通过 dashboard 面板来进行方便的操作。

### 运行容器

运行以下命令  
`docker run -d -p 80:80 docker/getting-started`

如果你是第一次运行这个命令,那么你将会看到 Docker 无法在本地找到 `docker/getting-started:latest` 镜像的提示，然后 Docker 将会自动的前往公共镜像仓库下载此镜像(我们也可以搭建自己的私有镜像仓库)。
如果你的 80 端口已被其他程序占用，那么可以更改为其他没有被占用的端口。例如:

`docker run -d -p 8080:80 docker/getting-started`

容器运行起来之后，你可以在浏览器中前往 [http://localhost](http://localhost), 如果你使用的是其他端口，那么请改为 [http://localhost:8080](http://localhost:8080)。现在你应该已经打开了**Getting Started** 的教程页面了。

下面我们来分析这条命令的含义

- docker 即 Docker client
- run 容器的启动命令
- `-d` 以后台的方式运行
- `-p 80:80` 端口, 将本地的 80 端口转发到容器的 80 端口,第一个是本地主机端口，第二个是容器端口
- `docker/getting-started` 容器的镜像

此时，你的本地主机中已经有 Docker 容器正在运行了，如果我们想看到你所有正在运行的容器，可以运行以下命令

`docker ps`

如果你想看到所有包括暂停的容器, 可以加上`-a`

之前我们说`-d`参数是让容器以后台的命令来运行，那么我们接下来可以试试交互式的容器运行方式

`docker run --rm -i -t alpine ash`

参数解析

- `--rm` 一旦容器停止即销毁
- `-i` 允许你对容器内的标准输入 (STDIN) 进行交互
- `-t` 在新容器内指定一个伪终端或终端。

> Tips  
> 以上的命令可以缩写为, 其他的也是同理  
> `docker run --rm -it alpine ash`

此时我们已经进入了一个 alpine 系统的容器，我们接下来运行的所有命令都将在这个系统中生效。我们可以运行一下命令来进行验证

`cat /etc/os-release`
