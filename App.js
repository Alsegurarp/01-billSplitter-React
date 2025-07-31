import './App.css';
import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null); // null PORQUE NADIE ESTA SELECCIONADO POR DEFAULT

  function handleShowFriendForm(){
    setShowForm((showForm) => !showForm);
  }

  function handleAddFriend(friend){
    setFriends((friends) => [...friends, friend]);
    setShowForm(false);
  }

  function onShowBillFunction(friend){
    // setSelectedFriend(friend);
    setSelectedFriend((cur) =>
      cur?.id === friend.id ? null : friend);
    setShowForm(false); // Para que no tenga las 2 interfaces abiertas cuando seleccione a un amigo
  }

  // con el map es la manera en la que se actualizan los objetos en react
  function handleSplitBill(value){
    setFriends((friends) => friends.map((friend) => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend))
    // cambia el valor de friends, despues pasa por un map a todos los frinds, y le pregunta a cada uno, "tu id es igual al que selecciono?"
    // Si no es igual, entonces "pasa" y si eres el que estoy seleccionando... te hago una copia, pero en la propiedad 'balance' la voy a editar
    // ahora balance debe de cambiar, tomo tu current balance value, con el que vienes y le agrego el value que te mando en props
  }

  return (
    <>
    <div className='app'>
      <div className='sidebar'> 
        <FriendsList friends={friends} onShowBill={onShowBillFunction} selectedFriend={selectedFriend}/>
          {showForm && <FormAddFriend onAddFriend={handleAddFriend}/> }
        <Button onClick={handleShowFriendForm}>{showForm ? 'close' : 'Add friend'}</Button>
      </div>
        {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />}
    </div>
    </>
  );
}

function FriendsList({friends, onShowBill, selectedFriend}){


  return(
    <ul>
      {friends.map((friend) => (
        < Friend friend={friend} key={friend.id} onShowBill={onShowBill} selectedFriend={selectedFriend} />
      ))}
    </ul>
  )
}

function Friend({friend, onShowBill, selectedFriend}){

  const isSelected = selectedFriend?.id === friend.id;
  // selectedFriend.id es un objeto, despues a su propiedad id se compara con el friend que estamos seleccionando

  return(
    <>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image}/>
        <h3>{friend.name}</h3>
        {friend.balance < 0 && <p className='red'>Le debes {friend.name} ${Math.floor(friend.balance)}</p>}
        {friend.balance === 0 && <p>No se deben nada</p>}
        {friend.balance > 0 && <p className='green'>Te debe {friend.name} ${Math.floor(friend.balance)}</p>}

        <Button onClick={() => onShowBill(friend)}>{isSelected ? "close" : "Select"}</Button>
     
      </li>
      
    </>
  )
}

function Button({children, onClick}){
  
  return(
       <button className='button' onClick={onClick}>{children}</button>
  )
}

function FormAddFriend({onAddFriend}){
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48")
  // By default en esta url me da una imagen de 48x48px random

  function handleSubmit(e){
    e.preventDefault();

    const id =  Math.floor(Math.random() * 100);
    
    const newFriend = {
      name, 
      image: `${image}?=${id}`,
      balance: 0,
      id,
    }
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  };



  return(
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>👯 Friend name</label>
      <input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>

      <label>🌇 Image url</label>
      <input type='text' value={image} onChange={(e)=>setImage(e.target.value)}/>

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({selectedFriend, onSplitBill}){
  const [billValue, setBillValue] = useState("");
  const [myExpenses, setMyExpenses] = useState("");
  // Here, derive state - usa de referencia el resultado de otros estados
  // pero hazlo sin crear un nuevo estado
  const paidByFriend = billValue ? billValue - myExpenses : "";
  // Es con ternary, pq puede que no haya nada, - asi evitamos el undefined -
  const [whoIsPaying, setWhoIsPaying] = useState("user"); //By default to have a value

  function handleSubmit(e){
    e.preventDefault();

    if(!billValue || !myExpenses) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -myExpenses);

  }


  // The (Number(e.target.value)) - Is because we need to declare 
  // Transform the string that u r getting into a number, cuz then we will use it
  return(
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name} </h2>

        <label>💴 Bill Value</label>
        <input type='text' value={billValue} onChange={(e) => setBillValue(Number(e.target.value))}/>

        <label>😁 Your expenses</label>
        <input type='text' value={myExpenses} 
          onChange={(e) => setMyExpenses(
            Number(e.target.value) > billValue ? myExpenses : Number(e.target.value))} />

        <label>🫂 {selectedFriend.name}'s' expenses</label>
        <input type='text' disabled value={paidByFriend}/>

        <label>💰 Who is paying?</label>
        <select 
            value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value='user'>You</option>
          <option value='friend'>{selectedFriend.name}</option>
        </select>

        <Button>🤑 Split bill</Button>
    </form>
  )
}