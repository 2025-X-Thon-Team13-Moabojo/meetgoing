# MeetGoing (팀원 매칭 플랫폼)

해커톤, 공모전, 프로젝트를 함께할 팀원을 찾고 계신가요?
**MeetGoing**은 사용자의 기술 스택, 관심 분야, 활동 지역 등을 분석하여 최적의 팀원을 추천해주는 플랫폼입니다.

## 🚀 주요 기능

### 1. 🤝 AI 팀원 매칭
- 사용자의 프로필(기술 스택, 관심 분야, MBTI 등)을 분석하여 가장 적합한 팀원을 추천합니다.
- 매칭 점수(Suitability Score)를 기반으로 정렬된 추천 목록을 제공합니다.

### 2. 👥 팀 빌딩 및 관리
- **팀 생성**: 원하는 프로젝트 주제로 팀을 생성하고 팀원을 모집할 수 있습니다.
- **팀원 찾기**: 다양한 필터(카테고리, 기술 스택)를 통해 원하는 팀원을 검색할 수 있습니다.

### 3. 🏆 공모전/해커톤 정보
- 최신 공모전 및 해커톤 정보를 한눈에 확인하고, 해당 대회에 참가할 팀을 바로 구성할 수 있습니다.

### 4. 💬 실시간 채팅
- 관심 있는 유저와 실시간으로 대화를 나누며 팀 합류를 제안할 수 있습니다.

### 5. ⭐ 유저 평가 시스템
- 프로젝트 종료 후 팀원 간 상호 평가를 통해 신뢰도 높은 프로필을 구축할 수 있습니다.

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

### Backend / Services
- **Database & Auth**: Firebase (Firestore, Authentication)
- **Deployment**: Vercel (예정)

---

## 📦 설치 및 실행 방법 (Installation & Setup)

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계에 따라 진행해주세요.

### 1. 저장소 클론 (Clone Repository)
```bash
git clone [repository-url]
cd meetgoing
```

### 2. 패키지 설치 (Install Dependencies)
```bash
npm install
```

### 3. 환경 변수 설정 (Environment Variables)
프로젝트 루트 경로에 `.env` 파일을 생성하고 Firebase 설정 정보를 입력해주세요.
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. 개발 서버 실행 (Run Development Server)
```bash
npm run dev
```
실행 후 브라우저에서 `http://localhost:5173`으로 접속하세요.

---

## 📂 프로젝트 구조 (Project Structure)

```
src/
├── components/     # 재사용 가능한 UI 컴포넌트
├── pages/          # 주요 페이지 (UserList, TeamList, Profile 등)
├── context/        # 전역 상태 관리 (AuthContext 등)
├── services/       # Firebase 및 외부 API 통신 로직
├── utils/          # 유틸리티 함수 (매칭 알고리즘 등)
└── assets/         # 이미지 및 정적 파일
```

---

## 📝 라이선스
This project is licensed under the MIT License.
