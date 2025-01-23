pipeline {
    agent any

    stages {
        stage('Backend Build') {
            steps {
                echo 'Building Backend...'
                dir('backend') {
                    sh './gradlew clean build' // Gradle 빌드
                }
            }
        }

        stage('Frontend Build') {
            steps {
                echo 'Building Frontend...'
                dir('frontend') {
                    sh 'npm install'           // Node.js 의존성 설치
                    sh 'npm run build'         // Next.js 빌드
                }
            }
        }

        stage('Docker Compose') {
            steps {
                echo 'Deploying with Docker Compose...'
                sh 'docker-compose up --build -d'
            }
        }
    }
}
