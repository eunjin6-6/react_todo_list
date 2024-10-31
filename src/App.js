import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Form from 'react-bootstrap/Form';
import { useCallback, useEffect, useState } from 'react';
import Todo from './Todo'
import Button from 'react-bootstrap/Button';

function App() {
  /*
  로컬 스토리지에
  데이터 추가
  window.localStorage.setItem(key, value)
  window.localStorage.setItem('name', '홍길동');

  데이터 읽기
  window.localStorage.getItem('name')

  데이터 삭제
  window.localStorage.removeItem('name')
  

  let obj = {id:1, text: 'Learn web'};
  console.log(obj); //객체
  //로컬 스토리지에는 문자열만 쓰기 가능
  //객체->JSON 문자열 JSON.stringify(대상) (제이슨형식으로 문자열로 변경)
  let objString = JSON.stringify(obj);
  console.log(objString); //{} 까지 다 문자열로 들어감 '{"id":1,"text":"Learn web"}'

  //로컬스토리지에 데이터 쓰기
  window.localStorage.setItem('todo',objString);
  //읽기
  let test = window.localStorage.getItem('todo');
  //JSON 문자열->객체 (제이슨형식->자바스크립트 객체로) JSON.parse(대상);
  let testObj =  JSON.parse(test);
  console.log(testObj);
  console.log(testObj.text); //객체안에 원하는 데이터 추출 가능
  */


  const [todo, setTodo] = useState([]);
  const [todoId, setTodoId] = useState(0);
  console.log(todoId);

  /* 임시로 넣어보기
  let obj = [{id:1, text: 'Learn web'}]; //배열로 넣어줘야함, 뒤에서 map 돌릴수 있음
  let objString = JSON.stringify(obj);
  window.localStorage.setItem('todo',objString);
  */

  //변수에 담아서 값이 바뀌는지 확인 할 수 있도록 수정, getTodoList 함수>함수가 담겨있는 객체로
  let getTodoList = useCallback(()=>{
    
    console.log('getTodoList 실행');

    const todoStrFromLocalStorage = window.localStorage.getItem('todo');
    if(todoStrFromLocalStorage !== null && todoStrFromLocalStorage !== '[]'){//값이 있으면
      //JSON 문자열->객체 
      const todoObj =  JSON.parse(todoStrFromLocalStorage);
      //console.log(todoObj[todoObj.length-1].id); //마지막 인덱스 번호의 id값 조회

      setTodo(todoObj);

      setTodoId(todoObj[todoObj.length-1].id);
      //setTodoId(Math.max(...todoObj.map((item) => item.id)) + 1);
    }
  
  },[]); //useCallback함수로 getTodoList의 함수 결과가 변경되었는지 여부 알 수 있음


  //변경된 목록의 ID 조회하는 함수
  let updateTodoId = useCallback( ()=>{
    console.log('updateTodoId 실행');

    //할일 리스트가 있으면
    if(todo.length>0){
      setTodoId(todo[todo.length-1].id);
    }else{ //리스트 없으면
      setTodoId(0);
    }
    
  },[todo]);


  //로컬스토리지에 추가하는 함수

  let setStorage = useCallback(()=>{

    console.log('setStorage 실행');

    let todoString = JSON.stringify(todo);
    window.localStorage.setItem('todo',todoString);
  },[todo]);

/*
  //로컬스토리지에 추가하는 함수
  let setStorage = ()=>{

    console.log('setStorage 실행');

    let todoString = JSON.stringify(todo);
    window.localStorage.setItem('todo',todoString);
  }

*/

  //로컬스토리지에서 todo key에 값이 있으면 > 조회 > todo에 목록으로 저장
  useEffect(()=>{
    getTodoList();
  },[getTodoList])//뒤에 인수 빈 배열이면 최초 한번만 실행 > getTodoList 객체의 값이 변경되면 getTodoList 다시 실행

  useEffect(()=>{
    setStorage();
  },[setStorage]) //최초 한번 실행, setStorage 변경되면 다시 실행

  useEffect(()=>{
    updateTodoId();
  },[todo,updateTodoId]) //todo, updateTodoId 변경되면 TodoId 업데이트



  let addTodo = (value)=>{

    console.log('addTodo 실행');

    let newTodos = [...todo];

    let newId = todoId+1;
    setTodoId(newId);
    //const newId = Math.max(todoId, ...todo.map((item) => item.id + 1));
    //setTodoId(newId + 1);

    newTodos.push({id:newId, text: value, checked: false});
    //기존거를 newTodos로 교체
    setTodo(newTodos);
    document.querySelector('#todo').value='';
  }


  //클릭했을때 체크박스 표시됨
  let checkUpdate = (id, value)=>{

    console.log('checkUpdate 실행');
    //console.log(id, value);
    //console.log(typeof(id)); //number

    let newTodos = todo.map(item=> item.id === id ? {...item, checked:value} : item);
    setTodoId(newTodos);
  }

  let deleteTodo = (id)=>{

    console.log('deleteTodo 실행');
    let newTodos = [...todo];
    let idx = newTodos.findIndex(item=> item.id === id);
    newTodos.splice(idx, 1);
    
    setTodo(newTodos);
    console.log(todoId);
  }


  let updateTodo = (id,text)=>{
    let newTodos = todo.map(item=> item.id === id ? {...item, text:text} : item);
    setTodoId(newTodos);
  }

  let todos = todo.map((item,idx)=>
    <Todo data={item} key={idx} updateTodo={updateTodo} checkUpdate={checkUpdate} deleteTodo={deleteTodo} />
  )




  return (
    <div className="container">
      <h1>Todo List</h1>
      <Form onSubmit={(e)=>{
        e.preventDefault();
        //console.log(e.target.todo.value) //test
        addTodo(e.target.todo.value);
      }}>
      <Form.Group className="mb-3" controlId="todo">
        <Form.Label>할 일 입력</Form.Label>
        <Form.Control type="text" name="todo" placeholder="할 일을 입력하세요." />
      </Form.Group>
      <Button type="submit" variant="primary">입력</Button>
    </Form>
    <hr/>
    <div>
      {todos}
    </div>
    </div>
  );
}

export default App;
