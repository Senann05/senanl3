const mainContainer = document.querySelector('#mainContainer');
const fromInput = document.querySelector('#from');
const toInput = document.querySelector('#to');
const amountInput = document.querySelector('#amount');
const addCardButton = document.querySelector('#addCardButton');

const apiUrl = 'https://acb-api.algoritmika.org/api/transaction';

let isEditing = false;
let editTransactionId = null; 

addCardButton.addEventListener('click', () => {
    const fromValue = fromInput.value;
    const toValue = toInput.value;
    const amountValue = amountInput.value;

    if (!fromValue || !toValue || !amountValue) {
        alert('Zəhmət olmasa bütün xanalari doldurun!');
        return;
    }

    const transactionData = {
        from: fromValue,
        to: toValue,
        amount: amountValue
    };

    if (isEditing) {
        fetch(`${apiUrl}/${editTransactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        })
        .then(response => response.json())
        .then(data => {
            displayTransactions(); 
            resetForm(); 
        })
        .catch(error => {
            console.error('Error updating transaction:', error);
        });
    } else {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        })
        .then(response => response.json())
        .then(data => {
            displayTransactions();
        })
        .catch(error => {
            console.error('Error creating transaction:', error);
        });
    }

    resetForm(); 
});

function displayTransactions() {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        mainContainer.innerHTML = '';
        data.forEach(transaction => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <p>${transaction.from} -dan ${transaction.to}-yə ${transaction.amount} manat ödəniş köçürüldü</p>
                <button onclick="editTransaction(${transaction.id}, '${transaction.from}', '${transaction.to}', ${transaction.amount})">Edit</button>
                <button onclick="deleteTransaction(${transaction.id})">Delete</button>
            `;
            mainContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching transactions:', error);
    });
}

function editTransaction(id, from, to, amount) {
    isEditing = true;
    editTransactionId = id;

    fromInput.value = from;
    toInput.value = to;
    amountInput.value = amount;

    addCardButton.textContent = 'Update Transaction';
}

function deleteTransaction(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        displayTransactions();
    })
    .catch(error => {
        console.error('Error deleting transaction:', error);
    });
}

function resetForm() {
    fromInput.value = '';
    toInput.value = '';
    amountInput.value = '';
    addCardButton.textContent = 'Add Transaction';
    isEditing = false;
    editTransactionId = null;
}

window.onload = displayTransactions;
