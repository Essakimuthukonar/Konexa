pipeline {

    agent { label 'frontend' }

    triggers {
        githubPush()
    }

    environment {
        DOCKER_IMAGE = 'muthukonar/konexa'
        DOCKER_TAG = "${BUILD_NUMBER}"

        SERVER = 'ubuntu@10.0.1.143'

        DOCKER_CREDENTIALS = 'dockerhub-credentials'
        SSH_CREDENTIALS = 'frontend-agent-ssh'

        K8S_NAMESPACE = 'konexa'
        HELM_RELEASE = 'konexa'
        HELM_CHART = 'helm'
    }

    stages {

        stage('Clone Source Code') {
            steps {
                echo '===== CLONING KONEXA MAIN BRANCH ====='

                deleteDir()

                git(
                    branch: 'main',
                    url: 'https://github.com/Essakimuthukonar/Konexa.git'
                )

                sh '''
                    set -e

                    echo "===== SOURCE ====="
                    git branch --show-current
                    git log -1 --oneline

                    echo "===== PROJECT ====="
                    ls -la

                    echo "===== HELM CHART ====="
                    ls -la helm
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo '===== BUILDING KONEXA IMAGE ====='

                sh '''
                    set -e

                    docker build \
                        -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE}:latest \
                        .
                '''
            }
        }

        stage('Docker Image Validation') {
            steps {
                echo '===== VALIDATING IMAGE ====='

                sh '''
                    set -e

                    docker inspect ${DOCKER_IMAGE}:${DOCKER_TAG} > /dev/null

                    echo "===== IMAGE ====="
                    docker images ${DOCKER_IMAGE}

                    echo "===== VALIDATION PASSED ====="
                '''
            }
        }

        stage('Docker Hub Login') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        set -e

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

                sh '''
                    set -e

                    echo "===== PUSHING ${DOCKER_IMAGE}:${DOCKER_TAG} ====="

                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}

                    echo "===== PUSHING LATEST ====="

                    docker push ${DOCKER_IMAGE}:latest

                    echo "===== DOCKER PUSH SUCCESSFUL ====="
                '''
            }
        }

        stage('Prepare Kubernetes') {
            steps {

                echo '===== CHECKING KUBERNETES ====='

                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} << 'EOF'

                            set -e

                            echo "===== KUBECTL ====="
                            kubectl version --client

                            echo "===== HELM ====="
                            helm version --short

                            echo "===== KUBERNETES NODES ====="
                            kubectl get nodes

                            echo "===== NAMESPACE ====="
                            kubectl get namespace ${K8S_NAMESPACE} \
                                || kubectl create namespace ${K8S_NAMESPACE}

                            echo "===== PREPARATION COMPLETE ====="

EOF
                    '''
                }
            }
        }

        stage('Upload Helm Chart') {
            steps {

                echo '===== UPLOADING HELM CHART TO EC2 ====='

                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

                    sh '''
                        set -e

                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} \
                            "rm -rf /tmp/konexa-helm && mkdir -p /tmp/konexa-helm"

                        scp \
                            -o StrictHostKeyChecking=no \
                            -r ${HELM_CHART}/* \
                            ${SERVER}:/tmp/konexa-helm/
                    '''
                }
            }
        }

        stage('Helm Deploy to Kubernetes') {
            steps {

                echo '===== DEPLOYING KONEXA WITH HELM ====='

                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} << EOF

                            set -e

                            echo "=========================================="
                            echo "       KONEXA KUBERNETES DEPLOYMENT"
                            echo "=========================================="

                            echo "===== HELM UPGRADE ====="

                            helm upgrade --install ${HELM_RELEASE} /tmp/konexa-helm \
                                --namespace ${K8S_NAMESPACE} \
                                --create-namespace \
                                --set image.repository=${DOCKER_IMAGE} \
                                --set image.tag=${DOCKER_TAG} \
                                --set image.pullPolicy=Always \
                                --wait \
                                --timeout 10m

                            echo "===== HELM DEPLOYMENT SUCCESSFUL ====="

EOF
                    '''
                }
            }
        }

        stage('Kubernetes Rollout') {
            steps {

                echo '===== WAITING FOR KUBERNETES ROLLOUT ====='

                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} << 'EOF'

                            set -e

                            kubectl rollout status \
                                deployment/konexa \
                                -n konexa \
                                --timeout=10m

                            echo "===== PODS ====="

                            kubectl get pods \
                                -n konexa \
                                -o wide

                            echo "===== SERVICES ====="

                            kubectl get svc \
                                -n konexa

                            echo "===== PVC ====="

                            kubectl get pvc \
                                -n konexa

EOF
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {

                echo '===== VERIFYING KONEXA ====='

                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {

                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=no \
                            ${SERVER} << 'EOF'

                            set -e

                            echo "===== HELM STATUS ====="

                            helm status konexa \
                                -n konexa

                            echo "===== DEPLOYMENT ====="

                            kubectl get deployment konexa \
                                -n konexa

                            echo "===== POD HEALTH ====="

                            kubectl get pods \
                                -n konexa

                            echo "===== APPLICATION TEST ====="

                            curl -f http://localhost

                            echo ""
                            echo "=========================================="
                            echo "     KONEXA DEPLOYMENT VERIFIED"
                            echo "=========================================="

EOF
                    '''
                }
            }
        }

        stage('Docker Cleanup') {
            steps {

                echo '===== CLEANING JENKINS DOCKER IMAGE ====='

                sh '''
                    docker image prune -f || true
                    docker logout || true
                '''
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
            Helm
                |
                v
            Kubernetes
                |
                v
            Konexa Deployment
                |
                v
            Konexa Pods
                |
                v
            MongoDB StatefulSet + PVC

            ==============================================
            '''
        }

        failure {

            echo '''
            ==============================================
                 KONEXA CI/CD PIPELINE FAILED
            ==============================================

            Check the failed Jenkins stage.

            ==============================================
            '''
        }
    }
}
