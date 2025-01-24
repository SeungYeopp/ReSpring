pipeline {
    agent any
    environment {
        ENV_FILE = credentials('project-env')
    }
    stages {
        stage('Setup Environment') {
            steps {
                script {
                    // backend와 frontend 디렉토리에 Secret File 내용 복사
                    sh 'cp $ENV_FILE ./backend/.env'
                    sh 'cp $ENV_FILE ./frontend/.env'
                }
            }
        }
        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build'
                }
            }
        }
        stage('Frontend Build') {
            tools {
                nodejs "NodeJS-20"
            }
            steps {
                dir('frontend') {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }
        stage('Docker Compose') {
            steps {
                sh '''
                docker-compose down || true
                docker-compose up -d --build
                '''
            }
        }
    }
}
