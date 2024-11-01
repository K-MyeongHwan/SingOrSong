<a href="https://club-project-one.vercel.app/" target="_blank">
<img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/SINGORSONG_Introduce.png" alt="배너" width="100%"/>
</a>

<br/>
<br/>

# 0. Getting Started (시작하기)
```bash
$ npm start
```

<br/>
<hr />

# 1. Project Overview (프로젝트 개요)
- 프로젝트 이름: Sing Or Song
- 프로젝트 설명: 어디서든 사용할 수 있는 노래방 앱

<br/>
<hr/>

# 2. Key Features (주요 기능)
- **회원가입**:
  - 회원가입 시 DB에 유저정보가 등록됩니다.

- **로그인**:
  - 사용자 인증 정보를 통해 로그인합니다.
  - 소셜 로그인 ( 구글, 카카오, 네이버 ) 를 통해 간편 이용할 수 있습니다.

- **마이 페이지**:
  - 내가 불렀던 노래들을 확인할 수 있습니다.
  - 체크박스를 통해 내가 불렀던 노래를 업로드, 공유할 수 있습니다.
  - 내 정보, 프로필 사진 등을 간편하게 업데이트할 수 있습니다.

- **검색 기능**:
  - 가수와 유저들을 검색 기능을 통해 서칭할 수 있습니다.
  - 가수와 유저들이 공유한 곡 리스트를 확인할 수 있습니다.

- **메인 페이지**:
  - 이번 달 신곡들을 DB 에서 검색해 보여줍니다.
  - 노래, 커버곡의 랭킹을 확인할 수 있습니다.

- **노래 인기차트**:
  - 다양한 카테고리들로 검색, 정렬해 노래 리스트를 보여줍니다.
  - TOP12 의 노래들을 슬라이드 기능을 통해 보여줍니다.
 
- **노래**:
  - 선택한 노래의 정보들을 모달창을 통해 보여줍니다.
  - 선택한 노래를 플레이 버튼으로 들을 수 있습니다.

- **노래 커버**:
  - 선택한 노래를 마이크를 통해 부를 수 있습니다.
  - 불렀던 노래를 업로드하여 AWS S3에 저장, 확인할 수 있습니다.

<br/>
<br/>

# 3. Technology Stack (기술 스택)

<br/>

## 3.1 Frotend
|  |  |  |
|-----------------|-----------------|-----------------|
| React    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/react.png" alt="React" width="100"> | 18.3.1    |
| React-Bootstrap    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/react_bootstrap.png" alt="React-Bootstrap" width="100"> | 18.3.1    |
| MaterialUI    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/material-ui.svg" alt="MUI" width="100">    | 5.0.0  |
| SweetAlert2    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/sweetAlert2.png" alt="SweetAlert" width="100">    | 1.11.12    |
| Javascript    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/JS.png" alt="Javascript" width="100"> | 

<br/>

## 3.2 Backend
|  |  |  |
|-----------------|-----------------|-----------------|
| Java    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/java.png" alt="Java" width="100">    | 10.12.5    |
| JPA    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/JPA.png" alt="JPA" width="100">    | 10.12.5    |
| SpringBoot    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/springBoot.png" alt="SpringBoot" width="100">    | 10.12.5    |
| Spring Security    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/security.png" alt="Spring Security" width="100">    | 10.12.5    |
| Spring Security OAuth2 Client    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/oauth2.0.jpeg" alt="Spring Security OAuth2 Client" width="100">    | 10.12.5    |

<br/>

## 3.3 Open API
|  |  |
|-----------------|-----------------|
| AWS S3 API    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/s3.png" alt="AWS" width="100">    |
| Google Login API    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/google_logo.png" alt="Google" width="100">    |
| Kakao Login API   |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/kakao_logo.png" alt="Kakao" width="100">    |
| Naver Login API   |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/naver_logo.png" alt="Naver" width="100">    |

<br/>

## 3.4 DataBase
|  |  |
|-----------------|-----------------|
| MySQL    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/Mysql.webp" alt="MySQL" width="100">    |

<br/>

## 3.5 Cooperation
|  |  |
|-----------------|-----------------|
| Git    |  <img src="https://github.com/user-attachments/assets/483abc38-ed4d-487c-b43a-3963b33430e6" alt="git" width="100">    |
| Notion    |  <img src="https://github.com/user-attachments/assets/34141eb9-deca-416a-a83f-ff9543cc2f9a" alt="Notion" width="100">    |

<br/>

## 3.6 Programming Tool
|  |  |
|-----------------|-----------------|
| IntelliJ IDEA    |  <img src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/intelliJ.png" alt="IntelliJ" width="100">    |

<br/>
<hr/>

# 4. Coding Convention
## 문장 종료
```
// 세미콜론(;)
console.log("Hello World!");
```

<br/>


## 명명 규칙
* 상수 : 영문 대문자 + 스네이크 케이스
```
const NAME_ROLE;
```
* 변수 & 함수 : 카멜케이스
```
// state
const [isLoading, setIsLoading] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [currentUser, setCurrentUser] = useState(null);

// 배열 - 복수형 이름 사용
const datas = [];

// 정규표현식: 'r'로 시작
const = rName = /.*/;

// 이벤트 핸들러: 'on'으로 시작
const onClick = () => {};
const onChange = () => {};

// 반환 값이 불린인 경우: 'is'로 시작
const isLoading = false;

// Fetch함수: method(get, post, put, del)로 시작
const getEnginList = () => {...}
```

<br/>

## 블록 구문
```
// 한 줄짜리 블록일 경우라도 {}를 생략하지 않고, 명확히 줄 바꿈 하여 사용한다
// good
if(true){
  return 'hello'
}

// bad
if(true) return 'hello'
```

<br/>

## 함수
```
함수는 함수 표현식을 사용하며, 화살표 함수를 사용한다.
// Good
const fnName = () => {};

// Bad
function fnName() {};
```

<br/>

## 태그 네이밍
Styled-component태그 생성 시 아래 네이밍 규칙을 준수하여 의미 전달을 명확하게 한다.<br/>
태그명이 길어지더라도 의미 전달의 명확성에 목적을 두어 작성한다.<br/>
전체 영역: Container<br/>
영역의 묶음: {Name}Area<br/>
의미없는 태그: <><br/>
```
<Container>
  <ContentsArea>
    <Contents>...</Contents>
    <Contents>...</Contents>
  </ContentsArea>
</Container>
```

<br/>

## 폴더 네이밍
카멜 케이스를 기본으로 하며, 컴포넌트 폴더일 경우에만 파스칼 케이스로 사용한다.
```
// 카멜 케이스
camelCase
// 파스칼 케이스
PascalCase
```

<br/>

## 파일 네이밍
```
컴포넌트일 경우만 .jsx 확장자를 사용한다. (그 외에는 .js)
customHook을 사용하는 경우 : use + 함수명
```

<br/>
<hr/>

# 5. ScreenShot

