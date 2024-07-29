import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Amplify } from 'aws-amplify';
import awsConfig from '../aws-exports';
import SignOut from './SignOut';

Amplify.configure(awsConfig);

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [updateItemName, setUpdateItemName] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const idToken = sessionStorage.getItem('idToken');
            const response = await axios.get('http://localhost:4000/items', {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const addItem = async () => {
        try {
            const idToken = sessionStorage.getItem('idToken');
            const response = await axios.post('http://localhost:4000/items', 
                { name: newItemName }, 
                { headers: { Authorization: `Bearer ${idToken}` } }
            );
            setItems([...items, response.data]);
            setNewItemName('');
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const updateItem = async (itemId) => {
        try {
            const idToken = sessionStorage.getItem('idToken');
            const response = await axios.put(`http://localhost:4000/items/${itemId}`, 
                { name: updateItemName },
                { headers: { Authorization: `Bearer ${idToken}` } }
            );
            setItems(items.map(item => (item._id === itemId ? response.data : item)));
            setEditingItem(null);
            setUpdateItemName('');
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            const idToken = sessionStorage.getItem('idToken');
            await axios.delete(`http://localhost:4000/items/${id}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    

    return (
        <div>
            <h2>Item List</h2>
            <SignOut />
            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        {editingItem === item._id ? (
                            <input
                                type="text"
                                value={updateItemName}
                                onChange={e => setUpdateItemName(e.target.value)}
                                placeholder="Update item name"
                            />
                        ) : (
                            item.name
                        )}
                        {editingItem === item._id ? (
                            <button onClick={() => updateItem(item._id)}>Save</button>
                        ) : (
                            <button onClick={() => { setEditingItem(item._id); setUpdateItemName(item.name); }}>Edit</button>
                        )}
                        <button onClick={() => deleteItem(item._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="New item name"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
            />
            <button onClick={addItem}>Add Item</button>
        </div>
    );
};

export default ItemList;
