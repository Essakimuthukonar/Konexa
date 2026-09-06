
pipeline {

    agent { label 'frontend' }

    environment {

        // Docker Hub
        DOCKER_IMAGE = 'muthukonar/konexa'
        DOCKER_TAG = "${BUILD_NUMBER}"

        // EC2
        SERVER = 'ubuntu@10.0.1.143'

        // Jenkins credential IDs
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
        SSH_CREDENTIALS = 'konexa-ec2-ssh'
    }

    stages {

        stage('Clone Source Code') {
            steps {
                echo '===== CLONING KONEXA FROM GITHUB ====='

                deleteDir()

                git(
                    branch: 'konexa-v3-docker',
                    url: 'https://github.com/Essakimuthukonar/Konexa.git'
                )

                sh '''
                    echo "===== SOURCE CODE CLONED ====="
                    git branch --show-current
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

                    echo "===== DOCKER HUB PUSH SUCCESSFUL ====="
                '''
            }
        }

        stage('Prepare EC2') {
            steps {
                echo '===== CHECKING EC2 DOCKER ENVIRONMENT ====='

                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} << 'EOF'

                            set -e

                            echo "===== EC2 CONNECTED ====="

                            echo "===== DOCKER VERSION ====="
                            docker --version

                            echo "===== DOCKER STATUS ====="
                            sudo systemctl is-active docker

                            echo "===== DOCKER ACCESS TEST ====="
                            docker ps

EOF
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo '===== DEPLOYING KONEXA TO EC2 ====='

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

                        sh '''
                            ssh \
                                -o StrictHostKeyChecking=no \
                                ${SERVER} \
                                "DOCKER_USERNAME='${DOCKER_USERNAME}' DOCKER_PASSWORD='${DOCKER_PASSWORD}' bash -s" << 'EOF'

                                set -e

                                echo "===== DOCKER HUB LOGIN ON EC2 ====="

                                echo "$DOCKER_PASSWORD" | \
                                docker login \
                                --username "$DOCKER_USERNAME" \
                                --password-stdin

                                echo "===== PULLING LATEST KONEXA IMAGE ====="

                                docker pull ${DOCKER_IMAGE}:latest

                                echo "===== STOPPING OLD KONEXA CONTAINER ====="

                                docker rm -f konexa-v3 2>/dev/null || true

                                echo "===== STARTING NEW KONEXA CONTAINER ====="

                                docker run -d \
                                    --name konexa-v3 \
                                    -p 3000:3000 \
                                    --restart unless-stopped \
                                    ${DOCKER_IMAGE}:latest

                                echo "===== WAITING FOR APPLICATION ====="

                                sleep 10

                                echo "===== RUNNING CONTAINER ====="

                                docker ps --filter name=konexa-v3

                                echo "===== KONEXA DEPLOYMENT COMPLETED ====="

EOF
                        '''
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '===== VERIFYING KONEXA APPLICATION ====='

                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} \
                            "docker ps --filter name=konexa-v3 && curl -f http://localhost:3000"
                    '''

                    echo '===== KONEXA APPLICATION IS RUNNING ====='
                }
            }
        }

        stage('Docker Cleanup') {
            steps {
                echo '===== CLEANING UNUSED DOCKER IMAGES ====='

                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

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
            echo '''
            ==========================================
            KONEXA CI/CD PIPELINE SUCCESS
            ==========================================
            GitHub -> Jenkins -> Docker Build
                    -> Docker Hub -> EC2
                    -> Port 3000
            ==========================================
            '''
        }

        failure {
            echo '''
            ==========================================
            KONEXA CI/CD PIPELINE FAILED
            ==========================================
            Check the failed stage in Jenkins Console.
            ==========================================
            '''
        }

        always {
            sh 'docker logout || true'
        }
    }
}

