FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y docker.io

RUN getent group docker || groupadd -g 122 docker

RUN usermod -aG docker jenkins

RUN curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose \
    && ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

USER jenkins
