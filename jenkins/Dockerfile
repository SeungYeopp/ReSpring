FROM jenkins/jenkins:lts

# 루트 사용자로 전환
USER root

# Docker CLI 설치
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io && \
    docker --version

# Docker Compose 설치
RUN curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose && \
    docker-compose --version

# Jenkins 플러그인 설치
RUN jenkins-plugin-cli --plugins "workflow-aggregator docker-workflow"

# Jenkins 사용자에게 필요한 디렉토리 권한 부여
RUN chown -R jenkins:jenkins /var/jenkins_home

# Jenkins 사용자로 복귀
USER jenkins
