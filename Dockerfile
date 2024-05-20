# 기본 이미지 설정
FROM node:20

# 앱 디렉토리 생성 및 설정
WORKDIR /usr/src/app

# 앱의 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 복사
COPY . .

# 앱 빌드
RUN npm run build

# 앱 실행
CMD ["npm", "run","start:docker"]
