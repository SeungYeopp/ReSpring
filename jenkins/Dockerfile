FROM jenkins/jenkins:lts

USER root

RUN groupadd -g 122 docker

RUN usermod -aG docker jenkins

USER jenkins
