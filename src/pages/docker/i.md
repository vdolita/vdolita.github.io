# 镜像构建最佳实践

## 安全扫描

为了避免安全隐患，我们最好定期通过 `docker scan` 命令扫描我们的镜像文件， Docker 使用 [Snyk](https://snyk.io/) 提供的漏洞扫描服务。

> Note
> 使用扫描服务时你必须先登录 Docker `docker login`，之后使用 `docker scan <image-name>` 来扫描安全漏洞。

更多请参考这里 [docker scan documentation](https://docs.docker.com/engine/scan/)  
另外如果你使用了 Docker Hub 的镜像仓库服务，也可以自行[配置](https://docs.docker.com/docker-hub/vulnerability-scanning/)来自动扫描新上传的镜像。

## 镜像层 (Image layering)

通过 `docker image history <image-name>` 命令，你可以看到镜像的构建信息(每个命令都会产生一个新的文件层，镜像就是有一层层文件形成的)  
![img](./asset/Screen%20Shot%202021-12-14%20at%203.09.40%20PM.png)  
如果你想看到完成的信息，可以加上 `--no-trunc` 标志

## (镜像层缓存)Layer caching

合理的使用镜像缓存可以加快我们镜像的构建速度，镜像的文件层是基于上级文件层构建的，一旦上级文件层发生更改，下级的所有层都需要重新构建！

让我们回顾之前使用的 Dockerfile

    # syntax=docker/dockerfile:1
    FROM node:12-alpine
    WORKDIR /app
    COPY . .
    RUN yarn install --production
    CMD ["node", "src/index.js"]

查看镜像构建历史信息我们可以发现，Dockerfile 中的每条命令都会产生一层新的镜像层。你也许会记得当我们修改 Dockerfile 时，Nodejs 的库依赖需要重新安装，然而我们并不需要每一次都重新安装相同的依赖。  
为了修复这个问题，我们需要重新整理构建文件。对于 Nodejs 应用，依赖是基于`package.json` 来管理的。因此，我们在构建文件中先拷贝 `package.json` 文件，安装依赖，之后在进行其他操作。这样的话，只有当我们的 Nodejs 依赖文件发生更改时，我们才会重新执行依赖的安装步骤。

1.  更新 Dockerfile 文件

        # syntax=docker/dockerfile:1
        FROM node:12-alpine
        WORKDIR /app
        COPY package.json yarn.lock ./
        RUN yarn install --production
        COPY . .
        CMD ["node", "src/index.js"]

2.  在 Dockerfile 的同目录新建一个名为 `.dockerignore` 的文件，使用以下内容

    > node_modules

    `.dockerignore` 文件可以让 Docker 忽略将构建过程中所不需要的文件，可以参考[这里](https://docs.docker.com/engine/reference/builder/#dockerignore-file)来了解更多的信息。有了这个文件，Docker 将在`COPY`命令忽略 `node_modules` 目录，不然我们将可能会覆盖在 `RUN yarn install --production` 中安装的依赖文件，关于在 Nodejs 应用中使用容器的进一步说明，你可以查看[这里](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

3.  重新构建镜像  
    `docker build -t getting-started .`  
    你应该可以看到类似下面的输出

         Sending build context to Docker daemon  219.1kB
         Step 1/6 : FROM node:12-alpine
         ---> b0dc3a5e5e9e
         Step 2/6 : WORKDIR /app
         ---> Using cache
         ---> 9577ae713121
         Step 3/6 : COPY package.json yarn.lock ./
         ---> bd5306f49fc8
         Step 4/6 : RUN yarn install --production
         ---> Running in d53a06c9e4c2
         yarn install v1.17.3
         [1/4] Resolving packages...
         [2/4] Fetching packages...
         info fsevents@1.2.9: The platform "linux" is incompatible with this module.
         info "fsevents@1.2.9" is an optional dependency and failed compatibility check. Excluding it from installation.
         [3/4] Linking dependencies...
         [4/4] Building fresh packages...
         Done in 10.89s.
         Removing intermediate container d53a06c9e4c2
         ---> 4e68fbc2d704
         Step 5/6 : COPY . .
         ---> a239a11f68d8
         Step 6/6 : CMD ["node", "src/index.js"]
         ---> Running in 49999f68df8f
         Removing intermediate container 49999f68df8f
         ---> e709c03bc597
         Successfully built e709c03bc597
         Successfully tagged getting-started:latest

    你可以看到所有的层都会被重新构建，这是因为我们完全更改了 Dockerfile 的构建命令顺序

4.  现在，我们简单更改一下 `src/static/index.html`
5.  重新构建镜像 `docker build -t getting-started .`，应该可以看到类似下面的输出

        Sending build context to Docker daemon  219.1kB
        Step 1/6 : FROM node:12-alpine
        ---> b0dc3a5e5e9e
        Step 2/6 : WORKDIR /app
        ---> Using cache
        ---> 9577ae713121
        Step 3/6 : COPY package.json yarn.lock ./
        ---> Using cache
        ---> bd5306f49fc8
        Step 4/6 : RUN yarn install --production
        ---> Using cache
        ---> 4e68fbc2d704
        Step 5/6 : COPY . .
        ---> cccde25a3d9a
        Step 6/6 : CMD ["node", "src/index.js"]
        ---> Running in 2be75662c150
        Removing intermediate container 2be75662c150
        ---> 458e5c6f080c
        Successfully built 458e5c6f080c
        Successfully tagged getting-started:latest

    可以看到，从步骤 1-4 都使用了缓存，这样可以加速我们的镜像构建速度。

## 多阶段构建

我们不会在本章过多的讨论多阶段构建，但是多阶段构建可以进一步的优化我们的镜像文件，多阶段构建有下面的优点

- 将构建时依赖与运行时依赖区分
- 通过仅传送应用程序需要的内容来减少镜像文件大小

### 以 Maven/Tomcat 来举例

构建 Java 应用时，我们需要先将代码文件编译，这时候需要 JDK。但是在生产环境我们并不需要 JDK，因为这时候代码都是经过编译了的，我们可能只需要 Tomcat 来启动一个 Java web 应用，这时候多阶段构建就可以很好地处理压缩镜像文件体积。

    # syntax=docker/dockerfile:1
    FROM maven AS build
    WORKDIR
    Learn more about the "WORKDIR" Dockerfile command.
    /app
    COPY . .
    RUN mvn package

    FROM tomcat
    COPY --from=build /app/target/file.war /usr/local/tomcat/webapps

在以上示例中，第一阶段我们先使用 maven 来编译代码，而在第二阶段，我们使用 Tomcat 来运行代码，最终的镜像文件一般为最后阶段构建产生的文件，但是你也可以通过 `--target` 标志来显式指定。

### React 例子

在构建 React 应用时，我们一般需要 Node 环境来编译 JS 代码（JSX，），SASS 样式等等，而在编译完成之后，我们并不需要 Node 环境，只需要一个简单的 nginx 来启动一个 web 服务。

    # syntax=docker/dockerfile:1
    FROM node:12 AS build
    WORKDIR /app
    COPY package* yarn.lock ./
    RUN yarn install
    COPY public ./public
    COPY src ./src
    RUN yarn run build

    FROM nginx:alpine
    COPY --from=build /app/build /usr/share/nginx/html

## 回顾

这本章节中，我们进一步了解了镜像构建的细节。
