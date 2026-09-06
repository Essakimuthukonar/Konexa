```groovy
pipeline {
    agent { label 'frontend' }

    environment {
        DOCKER_IMAGE = 'muthukonar/konexa'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_LATEST = 'latest'

        SERVER = 'ubuntu@10.0.1.143'
    }

    stages {

        stage('Clone Source Code') {
            steps {
                echo '===== CLONING KONEXA SOURCE CODE ====='

                git branch: 'main',
                    url: 'https://github.com/Essakimuthukonar/Konexa.git'
            }
        }

        stage('Docker Build') {
            steps {
                echo '===== BUILDING KONEXA DOCKER IMAGE ====='

                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE}:${DOCKER_LATEST} \
                        .
                '''
            }
        }

        stage('Docker Image Validation') {
            steps {
                echo '===== VALIDATING DOCKER IMAGE ====='

                sh '''
                    docker images ${DOCKER_IMAGE}
                    docker inspect ${DOCKER_IMAGE}:${DOCKER_TAG} > /dev/null

                    echo "===== DOCKER IMAGE VALIDATION PASSED ====="
                '''
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo '===== LOGGING IN TO DOCKER HUB ====='

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
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

        stage('Push Docker Image') {
            steps {
                echo '===== PUSHING KONEXA IMAGE TO DOCKER HUB ====='

                sh '''
                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE}:${DOCKER_LATEST}
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo '===== DEPLOYING KONEXA DOCKER CONTAINER ====='

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        ssh -i ~/.ssh/id_ed25519 \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} << EOF

                            set -e

                            echo "===== DOCKER HUB LOGIN ====="

                            echo "$DOCKER_PASSWORD" | \
                            docker login \
                            --username "$DOCKER_USERNAME" \
                            --password-stdin

                            echo "===== PULLING LATEST KONEXA IMAGE ====="

                            docker pull ${DOCKER_IMAGE}:${DOCKER_LATEST}

                            echo "===== STOPPING OLD KONEXA CONTAINER ====="

                            docker rm -f konexa-v3 2>/dev/null || true

                            echo "===== STARTING NEW KONEXA CONTAINER ====="

                            docker run -d \
                                --name konexa-v3 \
                                -p 3000:3000 \
                                --restart unless-stopped \
                                ${DOCKER_IMAGE}:${DOCKER_LATEST}

                            echo "===== REMOVING UNUSED IMAGES ====="

                            docker image prune -f

                            echo "===== KONEXA DOCKER DEPLOYMENT SUCCESS ====="

EOF
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '===== VERIFYING KONEXA DEPLOYMENT ====='

                sh '''
                    ssh -i ~/.ssh/id_ed25519 \
                        -o StrictHostKeyChecking=no \
                        ${SERVER} \
                        "docker ps --filter name=konexa-v3 && curl -f http://localhost:3000"
                '''
            }
        }
    }

    post {
        success {
            echo '===== 🚀 KONEXA DOCKER CI/CD PIPELINE SUCCESS ====='
        }

        failure {
            echo '===== ❌ KONEXA DOCKER CI/CD PIPELINE FAILED ====='
        }

        always {
            sh 'docker logout || true'
        }
    }
}
```
