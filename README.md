# 🎨 AI Fitting Studio

AI 기술로 당신만의 스타일을 완성하는 웹 애플리케이션입니다.

> **최신 업데이트**: FLUX Fill Pro 최신 모델 적용 완료! (2025년 3월 버전)

## ✨ 주요 기능

- 📸 **이미지 업로드**: 드래그 앤 드롭으로 간편한 이미지 업로드
- 🎨 **마스킹 브러시**: 변경하고 싶은 부분을 직관적으로 선택
- 🤖 **AI 스타일링**: FLUX Fill Pro/Dev 모델을 사용한 고품질 이미지 생성
- 📱 **PWA 지원**: 모바일 앱처럼 설치하여 사용 가능
- 💾 **이미지 저장**: 고화질로 결과 이미지 다운로드
- 📤 **소셜 공유**: 인스타그램, 카카오톡 공유 기능

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`env.example` 파일을 참고하여 `.env` 파일을 생성하고 Replicate API 토큰을 설정하세요:

```bash
cp env.example .env
```

`.env` 파일을 열어서 다음과 같이 설정하세요:

```env
REPLICATE_API_TOKEN=your_actual_replicate_api_token_here
PORT=3000
```

**Replicate API 토큰 발급 방법:**
1. [Replicate](https://replicate.com) 회원가입
2. [API Tokens 페이지](https://replicate.com/account/api-tokens)에서 토큰 생성
3. 생성된 토큰을 `.env` 파일에 입력

### 3. 서버 실행

```bash
npm start
```

또는 개발 모드로 실행 (파일 변경 시 자동 재시작):

```bash
npm run dev
```

### 4. 브라우저에서 접속

```
http://localhost:3000
```

## 🌐 라이브 데모

[https://ai-fitting-studio-mu.vercel.app/](https://ai-fitting-studio-mu.vercel.app/)

## 🎯 사용 방법

1. **이미지 업로드**: 스타일링을 적용할 사진을 드래그 앤 드롭하거나 클릭하여 업로드
2. **마스킹**: 변경하고 싶은 부분을 브러시로 칠하기 (주황색으로 표시)
3. **프롬프트 입력**: 원하는 스타일을 텍스트로 설명 (예: "red dress, elegant")
4. **AI 생성**: "🚀 AI 스타일링 생성" 버튼 클릭
5. **결과 확인**: 생성된 이미지 확인 및 저장/공유

## 🔧 API 엔드포인트

### POST /upload
이미지를 Imgur에 업로드합니다.

**요청:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**응답:**
```json
{
  "url": "https://i.imgur.com/example.png"
}
```

### POST /replicate
Replicate API를 통해 AI 모델을 실행합니다.

**요청:**
```json
{
  "version": "model_version_id",
  "input": {
    "prompt": "red dress, elegant",
    "image": "image_url",
    "mask": "mask_url"
  }
}
```

### GET /replicate/:id
Replicate 예측 결과를 폴링합니다.

## 🔧 기술 스택

### Frontend
- **HTML5/CSS3**: 모던 웹 표준
- **JavaScript (ES6+)**: 바닐라 자바스크립트
- **Canvas API**: 이미지 처리 및 마스킹
- **PWA**: 프로그레시브 웹 앱

### Backend
- **Node.js**: 서버 런타임
- **Express.js**: 웹 프레임워크
- **Replicate API**: AI 모델 호스팅
- **Imgur API**: 이미지 업로드

### AI Models
- **FLUX Fill Pro**: 최고 품질 인페인팅 모델
- **FLUX Fill Dev**: 오픈소스 인페인팅 모델
- **Stable Diffusion**: 폴백 모델

## 📁 프로젝트 구조

```
ai-fitting-studio/
├── server.js              # Express 서버
├── package.json           # 의존성 관리
├── env.example            # 환경변수 예시
├── index.html             # 메인 페이지
├── app.js                 # 클라이언트 JavaScript
├── style.css              # 스타일시트
├── manifest.json          # PWA 매니페스트
├── sw.js                  # 서비스 워커
├── generate-icons.html    # 아이콘 생성기
└── README.md              # 프로젝트 문서
```

## 📱 PWA 기능

- 오프라인 지원
- 모바일 앱 설치 가능
- 푸시 알림 (향후 추가 예정)
- 네이티브 앱과 유사한 UX

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트 링크: [https://github.com/ttedtedteddy/ai-fitting-studio](https://github.com/ttedtedteddy/ai-fitting-studio)

---

⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요! 