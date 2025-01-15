- React 인프런 강의 수강 (1시간) JSX까지 수강.

React란..

프레임워크가 아닌 자바스크립트 SPA 라이브러리.

JSX란?

Javascript와 HTML을 합친..

React는 JSX를 이용, 화면에 컴포넌트를 그림.

JSX는 하나의 태그로 감싸져 있어야 한다.

태그가 끝이 났다는 것을 명시적으로 표시해주어야 한다.

class 대신 className 속성 사용.

```
<input type="text">
대신에

<input type="text" />
이렇게 끝을 닫아줘야 한다.

그리고..

<input class="".. />
대신에

<input className="".. />
를 써야 한다.


const arr = ['a', 'b', 'c'];
const imageUrl =
  'https://dst6jalxvbuf5.cloudfront.net/static/img/logo/logo.svg';

const element = (
	<li>{arr}</li>
	<li>{{<div>111</div>, <div>111</div>, <div>111</div>}}</li>
	배열을 선언하고 안에 어떤 값을 집어넣을 때는, 그 값이 태그가 될 수 있다.
	
	<img src={imageUrl} alt="logo" />
	
	이렇게 쓰면 안됨..
	<img src="{imageUrl}" alt="logo" />
	이렇게 쓰면 문자열로 인식..
);

ReactDOM.render(
  element,
  document.getElementById('root')
);

const element = (
	<li>{1 + 1 === 2 && 'AND 연산자1'}</li>
	여기서..
	&& 연산자 앞의 값이 true면 뒤에 있는 내용이 출력이 된다.
	만약에 false면 출력이 안됨!
	
	<li>{arr.length && 'AND 연산자2'}</li>
	여기서..
	arr.length가 1 이상이면 true.
	0이면 false.
	
	<li>{!!arr.length && 'AND 연산자2'}</li>
	'!' boolean 값으로 만들어 줌.
	
	<li>{text || 'OR 연산자2'}</li>
	text 값이 "", 즉 없을 때
	|| 뒤에 있는 text를 보여준다.
);

ReactDOM.render(
  element,
  document.getElementById('root')
);

```

- Figma 기본 이해와 기능 강의 수강 (1시간) 섹션 3의 4번째 영상까지 수강강.

수강 내역.

피그마에서 프레임을 생성하고, 프로토타입, 각 툴 사용법, 요소 간의 간격 조절 법 등을 수강하였습니다.
