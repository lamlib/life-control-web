pipeline {
    agent { docker { image: 'node:22.17.1-alpine3.22' } }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
            }
        }
    }
}