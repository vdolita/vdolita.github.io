# 绑定模式（bind mounts）

在之前的章节中，我们尝试了**命名卷**模式来持久化我们的数据。而通过绑定模式，我们可以自己制定需要挂载的目录，这在进行本地开发时很有用处，我们可以将本地代码挂载到容器中，方便运行和调试。

## 对比

|                                              | Named Volumes             | Bind Mounts                   |
| -------------------------------------------- | ------------------------- | ----------------------------- |
| Host Location                                | Docker chooses            | You control                   |
| Mount Example (using -v)                     | my-volume:/usr/local/data | /path/to/data:/usr/local/data |
| Populates new volume with container contents | Yes                       | No                            |
| Supports Volume Drivers                      | Yes                       | No                            |

## 在开发容器中使用绑定模式

为了使用容器作为开发环境，我们需要做一下几点

- 将代码挂载到容器
- 安装依赖
- 启动**nodedemon**来观察文件的改动

步骤:

1.  请将之前启动的所有 **getting-started** 容器删除
2.  运行以下命令启动开发容器

    docker run -dp 3000:3000 \
     -w /app -v "$(pwd):/app" \
     node:12-alpine \
     sh -c "yarn install && yarn dev"

    - `-dp 3000:3000` 端口转发, 后台模式运行
    - `-w /app` 设置工作目录，sh 命令将在该目录运行
    - `-v "$(pwd):/app` 将当前目录挂载到容器的 `/app` 目录
    - `node:12-alpine` 容器的镜像,请注意这是我们应用的基础容器
    - `sh -c "yarn install && yarn run dev"` 我们启动容器之后容器执行的命令

3.  你可以通过 `docker logs -f <container-id>` 命令查看容器的日志，你应该会看到以下内容：

        $ docker logs -f <container-id>
        nodemon src/index.js
        [nodemon] 1.19.2
        [nodemon] to restart at any time, enter `rs`
        [nodemon] watching dir(s): *.*
        [nodemon] starting `node src/index.js`
        Using sqlite database at /etc/todos/todo.db
        Listening on port 3000

    通过 `ctrl+c` 命令退出

4.  现在，让我们做一些简单的更改。更改文件 `src/static/js/app.js` 的 109 行

        - {submitting ? 'Adding...' : 'Add Item'}
        + {submitting ? 'Adding...' : 'Add'}

5.  切换到浏览器刷新页面，我们将会看到我们的更改(可能需要等待一些时间)
    ![img](https://docs.docker.com/get-started/images/updated-add-button.png)
6.  你可以尝试进行其他修改，当你完成后，停止容器并构建一个新镜像
    `docker build -t getting-started .`

在使用 Docker 为主的开发环境中，我们通常都使用绑定模式，这个可以很好地将环境和代码隔离。我们将代码从版本管理服务中拉取之后，直接使用 Docker 镜像即可进行本地开发，免去了安装配置运行环境的繁琐。而之后，我们可以使用 **Docker Compose** 来进一步简化初始化开发环境所需运行的命令。

## 回顾

到目前为止，我们已经可以持久化我们的数据，并进行开发和调试。而当我们的应用要上到产品环境是，我们需要更加稳定效率的数据库，下一节我们将使用 Mysql 数据库来代替 sqlite，并介绍如何让容器与容器之间可以相互通信。
