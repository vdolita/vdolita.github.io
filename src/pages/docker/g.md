# 多容器应用

之前我们已经成功运行了一个单容器应用，接下来我们将尝试运行一个多容器应用，使用一个 Mysql 容器来代替 sqlite 数据库。

> 一般来说，一个容器应该只运行一个程序，原因如下:
>
> - 可以更好的对应用的瓶颈进行伸缩扩容，例如 API 和数据库，中间件等
> - 单独的容器可以让你更好的管理不同组件、程序、代码的版本升级，回滚等
> - 你的应用在生产环境可能使用的是单独的数据库实例，这样我们就没必要将数据库软件和代码打包在一个镜像内，可以降低镜像的体积
> - 但容器中运行多个进程可能会增加启动和关闭容器的复杂度

所以我们的应用将会如下图所示:  
![app](https://docs.docker.com/get-started/images/multi-app-architecture.png)

## 容器网络

容器在默认情况下是无法相互通信且相互独立的，但是当我们将容器置于同一网络中时，则可以相互通信。

## 启动 Mysql

配置容器网络的方式有两种：1）在启动的时候分配。2）连接到已经存在的容器。现在，我们会首先创建一个网络，然后在启动 Mysql 容器时附加该网络。

1.  创建网络  
    `docker network create todo-app`
2.  启动[Mysql](https://hub.docker.com/_/mysql/)容器并附加网络，同时我们会使用环境变量来初始化我们的数据库。

         docker run -d \
         --network todo-app --network-alias mysql \
         -v todo-mysql-data:/var/lib/mysql \
         -e MYSQL_ROOT_PASSWORD=secret \
         -e MYSQL_DATABASE=todos \
         mysql:5.7

    我们将会在后面解释 `--network-alias` 标志的作用。

    > Tip
    > 你可能注意到我们使用了一个名为`todo-mysql-data`的命名卷用来持久化 Mysql 的数据，但是我们并没有使用`docker volume create`来创建它。实际上当命名卷不存在时，Docker 会自动帮我们创建这个命名卷。

3.  为了确认我们的数据已经成功启动并运行，我们可以通过以下方式来确认
    `docker exec -it <mysql-container-id> mysql -u root -p`  
    当询问密码时，请使用 **secret** ，在 Mysql Shell 中，确认已成功创建`todos`数据库。
    `mysql> SHOW DATABASES;`  
    你应该可以看到类似下面的结果
    > +--------------------+  
    > | Database |  
    > +--------------------+  
    > | information_schema |  
    > | mysql |  
    > | performance_schema |  
    > | sys |  
    > | todos |  
    > +--------------------+  
    > 5 rows in set (0.00 sec)

## 连接到 Mysql 数据库

现在我们的数据库已经成功启动运行了，那我们在同一网络的其他容器怎么连接到 Mysql 容器呢（请记住每一个容器都会有一个独立的 IP 地址）？  
我们接下来会使用 [nicolaka/netshoot](https://github.com/nicolaka/netshoot) (一个通用网络测试工具容器)容器来进行测试验证。

1. 启动 nicolaka/netshoot 容器，并确保与 Mysql 连接到同一网路。  
   `docker run -it --network todo-app nicolaka/netshoot`
2. 在容器中，使用 `dig` 命令来测试能否解析到 mysql 的 dns 记录  
   `dig mysql`  
   接下来你应该可以看到成功解析了 mysql 的 dns 记录，这是因为我们之前使用了 `--network-alias mysql` 的标志，因此我们可以在容器中简单的使用 `mysql` 来连接目标容器。

## 使用 Mysql 持久化数据

todo 应用支持配置一系列的环境变量来设置 Mysql 连接参数:

1. `MYSQL_HOST` Mysql 的 hostname
2. `MYSQL_USER` 连接用户名
3. `MYSQL_PASSWORD` 连接密码
4. `MYSQL_DB` 连接的数据库名
   > 使用环境变量的方式可能会存在泄漏秘钥的可能，在生产环境中建议使用更为安全的方式，如挂载秘钥文件等

现在，让我们配置我们的开发环境。

1.  对于 Mysql8.0 以上的版本，需要运行以下命令  
    `mysql> ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'secret';`  
    `mysql> flush privileges;`
2.  设置开发容器的环境变量

        docker run -dp 3000:3000 \
        -w /app -v "$(pwd):/app" \
        --network todo-app \
        -e MYSQL_HOST=mysql \
        -e MYSQL_USER=root \
        -e MYSQL_PASSWORD=secret \
        -e MYSQL_DB=todos \
        node:12-alpine \
        sh -c "yarn install && yarn run dev"

3.  查看开发容器的日志（`docker logs <container-id>`），验证是否正常运行
    > nodemon src/index.js  
    > [nodemon] 1.19.2  
    > [nodemon] to restart at any time, enter \`rs\`  
    > ....  
    > Listening on port 3000
4.  在浏览器打开你的应用页面（http://localhost:3000），并添加一些 todo 事项
5.  连接到 Mysql 容器，验证我们的 todo 事项是否成功保存（密码是**secret**）  
    `docker exec -it <mysql-container-id> mysql -p todos`  
    然后在 mysql shell 中，运行以下命令  
    `mysql> select * from todo_items;`  
    查看查询结果中是否有你刚刚添加的 todo 事项。

现在如果你在 docker desktop 的面板中查看容器，你会发现没有任何迹象表明 Mysql 和 Node 容器是同一个应用，而且运行起来也十分麻烦，每次启动两个容器需要输入大量的命令,下一节我们将介绍**Docker compose**来简化这点。

## 回顾

到现在为止，我们已经实现了一个多容器应用，使用 Mysql 来持久化我们的数据。学习了一点点关于容器的网络知识和如何通过 dns 进行服务发现。
我们首先需要创建网络，然后启动容器并指定网络、设置环境变量，公开端口等等。通过 Docker Compose,我们可以更加轻松的实现以上步骤。
