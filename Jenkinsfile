```groovy
pipeline {
    agent { label 'frontend' }

    environment {
        // Docker Hub
        DOCKER_IMAGE = 'muthukonar/konexa'
        DOCKER_TAG = "${BUILD_NUMBER}"

        // Deployment server
        SERVER = 'ubuntu@10.0.1.143'
        PROJECT_DIR = '/home/ubuntu/konexa-new'

        // Jenkins credentials
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
        SSH_CREDENTIALS = 'konexa-ec2-ssh'
    }

    stages {

        stage('Clone Source Code') {
            steps {
                echo '===== CLONING KONEXA FROM GITHUB ====='

                deleteDir()

                git branch: 'main',
                    url: 'https://github.com/Essakimuthukonar/Konexa.git'

                sh '''
                    echo "===== SOURCE CODE CLONED SUCCESSFULLY ====="
                    git log -1 --oneline
                    ls -la
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo '===== BUILDING KONEXA DOCKER IMAGE ====='

                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE}:latest \
                        .
                '''
            }
        }

        stage('Docker Image Validation') {
            steps {
                echo '===== VALIDATING DOCKER IMAGE ====='

                sh '''
                    docker image inspect ${DOCKER_IMAGE}:${DOCKER_TAG} > /dev/null

                    echo "===== IMAGE VALIDATION PASSED ====="

                    docker images ${DOCKER_IMAGE}
                '''
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo '===== LOGGING IN TO DOCKER HUB ====='

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | \
                        docker login \
                            --username "$DOCKER_USERNAME" \
                            --password-stdin
                    '''
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                echo '===== PUSHING KONEXA IMAGE TO DOCKER HUB ====='

                sh '''
                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Prepare EC2') {
            steps {
                echo '===== PREPARING KONEXA EC2 SERVER ====='

                sshagent(credentials: "${SSH_CREDENTIALS}") {
                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} << 'EOF'

                            set -e

                            echo "===== CHECKING DOCKER ====="

                            docker --version

                            echo "===== CREATING PROJECT DIRECTORY ====="

                            mkdir -p ${PROJECT_DIR}

                            echo "===== EC2 PREPARATION COMPLETE ====="

EOF
                    '''
                }
            }
        }

        stage('Deploy Docker Compose') {
            steps {
                echo '===== DEPLOYING KONEXA WITH DOCKER COMPOSE ====='

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sshagent(credentials: "${SSH_CREDENTIALS}") {

                        sh '''
                            ssh \
                                -o StrictHostKeyChecking=no \
                                ${SERVER} << EOF

                                set -e

                                echo "===== LOGGING IN TO DOCKER HUB ====="

                                echo "$DOCKER_PASSWORD" | \
                                docker login \
                                    --username "$DOCKER_USERNAME" \
                                    --password-stdin

                                echo "===== PULLING KONEXA IMAGE ====="

                                docker pull ${DOCKER_IMAGE}:latest

                                echo "===== CREATING DOCKER NETWORK ====="

                                docker network inspect konexa-network >/dev/null 2>&1 || \
                                docker network create konexa-network

                                echo "===== STOPPING OLD KONEXA CONTAINER ====="

                                docker rm -f konexa-v3 2>/dev/null || true

                                echo "===== STARTING KONEXA CONTAINER ====="

                                docker run -d \
                                    --name konexa-v3 \
                                    --network konexa-network \
                                    -p 3000:3000 \
                                    --restart unless-stopped \
                                    ${DOCKER_IMAGE}:latest

                                echo "===== KONEXA CONTAINER STARTED ====="

                                docker ps --filter name=konexa-v3

EOF
                        '''
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '===== VERIFYING KONEXA DEPLOYMENT ====='

                sshagent(credentials: "${SSH_CREDENTIALS}") {
                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} \
                            "docker ps --filter name=konexa-v3 && curl -f http://localhost:3000"

                        echo "===== KONEXA DEPLOYMENT VERIFIED ====="
                    '''
                }
            }
        }

        stage('Docker Cleanup') {
            steps {
                echo '===== CLEANING UNUSED DOCKER IMAGES ====='

                sshagent(credentials: "${SSH_CREDENTIALS}") {
                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} \
                            "docker image prune -f"
                    '''
                }
            }
        }
    }

    post {

        success {
            echo '=============================================='
            echo '🚀 KONEXA DOCKER CI/CD PIPELINE SUCCESS'
            echo '=============================================='
        }

        failure {
            echo '=============================================='
            echo '❌ KONEXA DOCKER CI/CD PIPELINE FAILED'
            echo '=============================================='
        }

        always {
            sh 'docker logout || true'
        }
    }
}
```
