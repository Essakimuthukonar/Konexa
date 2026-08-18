pipeline {
    agent { label 'frontend' }

    stages {

        stage('Clone Source Code') {
            steps {
                echo '===== CLONING KONEXA SOURCE CODE ====='

                git branch: 'main',
                    url: 'https://github.com/Essakimuthukonar/Konexa.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '===== INSTALLING DEPENDENCIES ====='

                sh 'npm ci'
            }
        }

        stage('Build Application') {
            steps {
                echo '===== BUILDING KONEXA FRONTEND ====='

                sh 'npm run build'
            }
        }

        stage('Run Tests') {
            steps {
                echo '===== RUNNING KONEXA CI VALIDATION ====='

                sh '''
                    test -f package.json
                    test -f package-lock.json
                    test -d .next
                    test -f next.config.mjs

                    echo "===== KONEXA CI VALIDATION PASSED ====="
                '''
            }
        }

        stage('Package Application') {
            steps {
                echo '===== PACKAGING KONEXA APPLICATION ====='

                sh '''
                    rm -f konexa-frontend.tar.gz

                    tar -czf konexa-frontend.tar.gz \
                        .next \
                        public \
                        package.json \
                        package-lock.json \
                        next.config.mjs
                '''

                echo '===== KONEXA PACKAGE CREATED ====='
            }
        }

        stage('Deploy to Konexa Server') {
            steps {
                echo '===== DEPLOYING TO KONEXA SERVER ====='

                sh '''
                    set -e

                    chmod 600 ~/.ssh/id_ed25519

                    echo "===== COPYING BUILD TO KONEXA SERVER ====="

                    scp -i ~/.ssh/id_ed25519 \
                        -o StrictHostKeyChecking=no \
                        konexa-frontend.tar.gz \
                        ubuntu@10.0.1.143:/tmp/konexa-frontend.tar.gz

                    echo "===== CONNECTING TO KONEXA SERVER ====="

                    ssh -i ~/.ssh/id_ed25519 \
                        -o StrictHostKeyChecking=no \
                        ubuntu@10.0.1.143 << 'EOF'

                        set -e

                        echo "===== DEPLOYING KONEXA FRONTEND ====="

                        mkdir -p /home/ubuntu/konexa-frontend

                        rm -rf /home/ubuntu/konexa-frontend/*

                        tar -xzf /tmp/konexa-frontend.tar.gz \
                            -C /home/ubuntu/konexa-frontend

                        cd /home/ubuntu/konexa-frontend

                        echo "===== INSTALLING PRODUCTION DEPENDENCIES ====="

                        npm ci --omit=dev

                        echo "===== STARTING KONEXA WITH PM2 ====="

                        pm2 delete konexa-frontend || true

                        pm2 start npm \
                            --name konexa-frontend \
                            -- start

                        pm2 save

                        echo "===== KONEXA FRONTEND DEPLOYMENT SUCCESS ====="

EOF
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '===== VERIFYING KONEXA DEPLOYMENT ====='

                sh '''
                    ssh -i ~/.ssh/id_ed25519 \
                        -o StrictHostKeyChecking=no \
                        ubuntu@10.0.1.143 \
                        "pm2 status && curl -f http://localhost:3000"
                '''
            }
        }

        stage('Deliver Artifact') {
            steps {
                echo '===== ARCHIVING BUILD ARTIFACT ====='

                archiveArtifacts \
                    artifacts: 'konexa-frontend.tar.gz',
                    fingerprint: true
            }
        }
    }

    post {
        success {
            echo '===== 🚀 KONEXA CI/CD PIPELINE SUCCESS ====='
        }

        failure {
            echo '===== ❌ KONEXA CI/CD PIPELINE FAILED ====='
        }
    }
}
