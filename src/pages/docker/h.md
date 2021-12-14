# Docker Compose

[Docker Compose](https://docs.docker.com/compose/)是一个用来定义和分享多容器应用的工具。通过一个 YAML 模板文件，我们可以简单的通过一条命令来启动和停止应用。  
使用 Compose 的另一个好处是我们可以使用一个文件来定义程序栈，将其放在项目代码的根目录，其他人就可以通过这个 Compose 模板文件快速进行开发调试。

## 安装 Docker Compose

如果你是使用 Docker Desktop 来运行 Docker，那你的 Docker Compose 也已经附带安装了。其他可以参考[这里](https://docs.docker.com/compose/install/)。  
安装完成之后，通过以下命令来进行验证  
`docker-compose version`

## 创建 Compose 模板文件

1. 在项目的根目录，创建一个`docker-compose.yml`的文件。
2. 在文件开始，我们需要设置 schema 版本。在大多数情况下建议使用最后的支持版本，更多请参考[Compose file reference](https://docs.docker.com/compose/compose-file/)  
   `version: "3.7"`
3. 下面，我们将会定义一系列运行应用需要的 services(or containers)

   versioon: "3.7"

   services:

现在，让我们将服务迁移到 compose 文件。

## 定义应用服务

回顾一下，我们通过以下命令来启动应用容器

    docker run -dp 3000:3000 \
    -w /app -v "$(pwd):/app" \
    --network todo-app \
    -e MYSQL_HOST=mysql \
    -e MYSQL_USER=root \
    -e MYSQL_PASSWORD=secret \
    -e MYSQL_DB=todos \
    node:12-alpine \
    sh -c "yarn install && yarn run dev"

1.  首先，我们需要定义一个服务入口，我们可以根据需要来命名该服务，而该名字就是容器网络中的 dns 记录(相当于`--network-alias`)，下面我们使用**app**作为服务名。

    version: "3.7"

    services:
    app:
    image: node:12-alpine

2.  你通常会看到**image**后面跟着**command**，但这个顺序不是必须的，你也可以将**command**放在**image**前面

    version: "3.7"

    services:
    app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"

3.  现在让我们转换 `-p 3000:3000` 这一部分。我们将使用[简写](https://docs.docker.com/compose/compose-file/compose-file-v3/#short-syntax-1)，你也可以选择更为[具体](https://docs.docker.com/compose/compose-file/compose-file-v3/#long-syntax-1)的方式

    version: "3.7"

    services:
    app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"
    ports: - 3000:3000

4.  这一步我们将通过 `working_dir` 和 `volumes` 转换 `-w /app` 和 `-v "$(pwd):/app"`，卷(Volumes)也有[简写](https://docs.docker.com/compose/compose-file/compose-file-v3/#short-syntax-3)和[长语法](https://docs.docker.com/get-started/08_using_compose/#:~:text=a%20short%20and-,long,-syntax.)。  
    另一个好处是我们可以再 Compose 模板文件中使用相对路径。

        version: "3.7"

        services:
          app:
            image: node:12-alpine
            command: sh -c "yarn install && yarn run dev"
            ports:
              - 3000:3000
            working_dir: /app
            volumes:
              - ./:/app

5.  最后，通过 `environment` 来设置环境变量

        version: "3.7"

        services:
          app:
            image: node:12-alpine
            command: sh -c "yarn install && yarn run dev"
            ports:
              - 3000:3000
            working_dir: /app
            volumes:
              - ./:/app
            environment:
              MYSQL_HOST: mysql
              MYSQL_USER: root
              MYSQL_PASSWORD: secret
              MYSQL_DB: todos

    请注意不要在代码中泄漏敏感的安全信息如 password 等。

## 定义 Mysql 服务

回顾之前我们用于启动 Mysql 的命令

    docker run -d \
    --network todo-app --network-alias mysql \
    -v todo-mysql-data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=secret \
    -e MYSQL_DATABASE=todos \
    mysql:5.7

1.  我们将使用 `mysql` 作为服务型(我们前面配置的环境变量使用的 MYSQL_HOST)，使用 5.7 版本的 Mysql

        version: "3.7"

        services:
          app:
            # The app service definition
        mysql:
          image: mysql:5.7

2.  这一步，我们将定义卷映射。当我们使用 `docker run`命令时，Docker 会自动帮我们创建命名卷，但是 Docker Compose 需要我们自己显式的定义命名卷，然后才能在服务中使用，更多请参考[这里](https://docs.docker.com/compose/compose-file/compose-file-v3/#volume-configuration-reference)。

        version: "3.7"

        services:
          app:
            # The app service definition
          mysql:
            image: mysql:5.7
            volumes:
              - todo-mysql-data:/var/lib/mysql

        volumes:
          todo-mysql-data:

3.  最后，设置 Mysql 的环境变量

        version: "3.7"

        services:
          app:
            # The app service definition
          mysql:
            image: mysql:5.7
            volumes:
              - todo-mysql-data:/var/lib/mysql
            environment:
              MYSQL_ROOT_PASSWORD: secret
              MYSQL_DATABASE: todos

        volumes:
          todo-mysql-data:

现在，我们整个 `docker-compose.yml` 文件应该如下所示：

    version: "3.7"

    services:
      app:
        image: node:12-alpine
        command: sh -c "yarn install && yarn run dev"
        ports:
          - 3000:3000
        working_dir: /app
        volumes:
          - ./:/app
        environment:
          MYSQL_HOST: mysql
          MYSQL_USER: root
          MYSQL_PASSWORD: secret
          MYSQL_DB: todos

      mysql:
        image: mysql:5.7
        volumes:
          - todo-mysql-data:/var/lib/mysql
        environment:
          MYSQL_ROOT_PASSWORD: secret
          MYSQL_DATABASE: todos

    volumes:
      todo-mysql-data:

## 运行我们的程序堆栈

1. 确保没有其他的 app/db 容器正在运行（之前章节所运行测试的容器）,可以通过 `docker ps` 和 `docker rm -f <ids>` 来终止移除
2. 通过 `docker-compose up` 命令启动我们的程序堆栈，添加 `-d` 标志以后台运行  
   `docker-compose up -d`  
   运行这个命令时，我们可以看到类似如下的输出

   > Creating network "app_default" with the default driver  
   > Creating volume "app_todo-mysql-data" with default driver  
   > Creating app_app_1 ... done  
   > Creating app_mysql_1 ... done

   可以看到 Docker Compose 自动为我们创建了网络和命名卷。

3. 使用 `docker-compose logs -f` 命令，我们可以观察到多个服务中的日志被合并到了一起，通过该命令也可以方便的观测到容器启动是否正常。`-f` 标志可以让我们实时看到最新的日志输出。

   > mysql_1 | 2019-10-03T03:07:16.083639Z 0 [Note] mysqld: ready for connections.  
   >  mysql_1 | Version: '5.7.27' socket: '/var/run/mysqld/mysqld.sock' port: 3306 MySQL Community Server (GPL)  
   >  app_1 | Connected to mysql db at host mysql  
   >  app_1 | Listening on port 3000

   服务名位于每行日志的开头,如果你只想看到特定服务的日志,则可以使用 `docker-compose logs -f app` 命令

4. 现在，让我们打开浏览器测试验证 todos 应用。

## 在 Docker Desktop 中查看应用堆栈

当我们查看 Docker dashboard 的时候，应该可以看到一个组名为**app**，这是我们的项目名称，Docker Compose 默认使用 `docker-compose.yml` 所处的目录名称。  
![img](https://docs.docker.com/get-started/images/dashboard-app-project-collapsed.png)  
如果你打开应用堆栈，会看到其中有两个正在运行的容器，默认的命名规则是 `<project-name>_<service-name>_<replica-number>`  
![img](https://docs.docker.com/get-started/images/dashboard-app-project-expanded.png)

## 终止应用

我们可以简单的通过 `docker-compose down` 命令来终止我们的应用堆栈，此时容器和网络都将被**删除**,而命名卷则不会，如果你想将命名卷也删除，可以加上 `--volumes` 标志。

## 回顾

在本节中，我们了解了 Docker Compose 以及它如何帮助我们简化多服务应用程序的定义和共享。 我们通过将我们使用的命令转换为适当的撰写格式来创建一个 Compose 文件。但是我们使用的 Dockerfile 其实大有问题，下一章我们将了解有哪些问题以及如何解决。
