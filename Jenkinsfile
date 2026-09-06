pipeline {

```
agent { label 'frontend' }

environment {
    DOCKER_IMAGE = 'muthukonar/konexa'
    DOCKER_TAG = "${BUILD_NUMBER}"

    SERVER = 'ubuntu@10.0.1.143'

    DOCKER_CREDENTIALS = 'dockerhub-credentials'
    SSH_CREDENTIALS = 'frontend-agent-ssh'
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
                echo "Branch:"
                git branch --show-current

                echo "Latest Commit:"
                git log -1 --oneline

                echo "Project Files:"
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
                echo "===== DOCKER IMAGES ====="
                docker images ${DOCKER_IMAGE}

                echo "===== DOCKER IMAGE INSPECT ====="
                docker inspect ${DOCKER_IMAGE}:${DOCKER_TAG} > /dev/null

                echo "===== IMAGE VALIDATION PASSED ====="
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
                echo "===== PUSHING VERSIONED IMAGE ====="

                docker push ${DOCKER_IMAGE}:${DOCKER_TAG}

                echo "===== PUSHING LATEST IMAGE ====="

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

                        echo "=========================================="
                        echo "        EC2 CONNECTION SUCCESSFUL"
                        echo "=========================================="

                        echo "===== DOCKER VERSION ====="
                        docker --version

                        echo "===== DOCKER SERVICE STATUS ====="
                        sudo systemctl is-active docker

                        echo "===== DOCKER ACCESS TEST ====="
                        docker ps

                        echo "===== PORT 3000 CHECK ====="
                        sudo ss -lntp | grep :3000 || true

                        echo "===== EC2 PREPARATION COMPLETE ====="
```

EOF
'''

```
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

                            DOCKER_IMAGE="muthukonar/konexa"

                            echo "=========================================="
                            echo "       KONEXA EC2 DEPLOYMENT"
                            echo "=========================================="

                            echo "===== DOCKER HUB LOGIN ====="

                            echo "$DOCKER_PASSWORD" | \
                            docker login \
                            --username "$DOCKER_USERNAME" \
                            --password-stdin

                            echo "===== PULLING LATEST KONEXA IMAGE ====="

                            docker pull "$DOCKER_IMAGE:latest"

                            echo "===== STOPPING OLD KONEXA CONTAINER ====="

                            docker rm -f konexa-v3 2>/dev/null || true

                            echo "===== STARTING NEW KONEXA CONTAINER ====="

                            docker run -d \
                                --name konexa-v3 \
                                -p 3000:3000 \
                                --restart unless-stopped \
                                "$DOCKER_IMAGE:latest"

                            echo "===== WAITING FOR APPLICATION ====="

                            sleep 10

                            echo "===== CONTAINER STATUS ====="

                            docker ps --filter "name=konexa-v3"

                            echo "===== APPLICATION HEALTH CHECK ====="

                            curl -f http://localhost:3000

                            echo ""
                            echo "=========================================="
                            echo "     KONEXA DEPLOYMENT SUCCESSFUL"
                            echo "=========================================="
```

EOF
'''

```
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
                        "echo '===== CONTAINER ====='; \
                         docker ps --filter 'name=konexa-v3'; \
                         echo '===== PORT ====='; \
                         docker port konexa-v3; \
                         echo '===== HTTP HEALTH CHECK ====='; \
                         curl -f http://localhost:3000"
                '''

                echo '===== KONEXA APPLICATION IS RUNNING ON PORT 3000 ====='
            }
        }
    }

    stage('Docker Cleanup') {
        steps {
            echo '===== CLEANING UNUSED DOCKER RESOURCES ====='

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
        ==============================================
             KONEXA CI/CD PIPELINE SUCCESS
        ==============================================

        GitHub
            |
            v
        Jenkins
            |
            v
        Docker Build
            |
            v
        Docker Hub
            |
            v
        EC2
            |
            v
        Docker Container
            |
            v
        Port 3000
            |
            v
        KONEXA APPLICATION

        ==============================================
        '''
    }

    failure {
        echo '''
        ==============================================
             KONEXA CI/CD PIPELINE FAILED
        ==============================================

        Check the failed stage in Jenkins Console.

        ==============================================
        '''
    }

    always {
        sh 'docker logout || true'
    }
}
```

}
