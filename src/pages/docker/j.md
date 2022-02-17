# Docker 速记表

### 主要概念

镜像 容器 仓库 网络 卷 Docker客户端 Docker守护进程

### 常用命令

1. `docker pull php:7.4` 从默认仓库拉取 PHP 7.4 镜像
2. `docker ps -a` 列出所有的容器
3. `docker images` 列出所有顶级镜像
4. `docker run --rm -it alpine ash`
5. `docker run -d -p 80:80 nginx`
6. `docker run --rm -v /Users/tonylai/code/provision/src/papi:/data/src/v3 -p 80:80 -p 443:443 -d papi:dev`
