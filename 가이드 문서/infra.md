# Infra & Deployment Guide

## 1. 환경
- Docker 기반 컨테이너 운영
- Nginx Reverse Proxy
- CI/CD: GitHub Actions

## 2. 환경 변수 관리
- .env.production
- .env.development

## 3. 배포 프로세스
1. GitHub Actions → Build
2. Docker Image 생성
3. 서버로 Push
4. Docker Compose 재시작

## 4. 모니터링
- Prometheus + Grafana
- Error Tracking: Sentry