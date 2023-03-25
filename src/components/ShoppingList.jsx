import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import  myImage from "../../public/leaves.png";

const appSettings = {
    databaseURL: "https://shopping-database-e4b2a-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddButtonClick = () => {
    push(shoppingListInDB, inputValue);
    setInputValue("");
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleItemRemove = (itemId) => {
    const exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`);
    remove(exactLocationOfItemInDB);
  };

  useEffect(() => {
    onValue(shoppingListInDB, (snapshot) => {
      if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
        setItems(itemsArray);
      } else {
        setItems([]);
      }
    });
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
          items.map(([itemId, itemValue]) => (
            <li key={itemId} onClick={() => handleItemRemove(itemId)}>
              {itemValue}
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
