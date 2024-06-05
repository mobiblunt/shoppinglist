import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore"
import  myImage from "../../public/leaves.png";

const firebaseConfig = {
  apiKey: "AIzaSyDldaM3qYKq4hZUUCO0LYI-350TfJAjIEw",
  authDomain: "shopping-6acd3.firebaseapp.com",
  projectId: "shopping-6acd3",
  storageBucket: "shopping-6acd3.appspot.com",
  messagingSenderId: "672943075334",
  appId: "1:672943075334:web:3b05fbb5844a85f0c31387"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const shoppingListInDB = ref(database, "shoppingList");
const shoppingListInDB = collection(db, "shoppingList")

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState(null)

  const handleAddButtonClick = async () => {
     
    await addDoc(shoppingListInDB, list);
    setInputValue([]);
    setList(null)

  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    

    const newNote = {
      body: event.target.value,
      createdAt: Date.now()
  }
  
  setList(newNote)
    
  };

  const handleItemRemove = (itemId) => {
    const exactLocationOfItemInDB = doc(db, "shoppingList", itemId);
    deleteDoc(exactLocationOfItemInDB);
  };
  console.log(items)
  useEffect(() => {
    const unsubscribe = onSnapshot(shoppingListInDB, (snapshot) => {
      
        const notesArr = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
      }))
        setItems(notesArr);
      
    });
    
    return unsubscribe
    
  }, []);

  return (
    <div className="container">
      <img src={myImage} />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleAddButtonClick}>Add</button>
      <ul>
        {items.length > 0 ? (
          items.map((itemId) => (
            <li key={itemId.id}  onClick={() => handleItemRemove(itemId.id)}>
              {itemId.body}
            </li>
          ))
        ) : (
          <li>No items here... yet</li>
        )}
      </ul>
    </div>
  );
}

export default ShoppingList;
