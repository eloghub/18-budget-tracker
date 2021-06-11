const request = indexedDB.open("budget", 1)
let database;

request.onupgradeneeded = function(event) {
    const db = event.target.result
    db.createObjectStore("pending", {autoIncrement: true})
};

request.onsuccess = function(event) {
    database = event.target.result
    if(navigator.onLine) {
        getDatabase() 
    }
}

request.onerror = function(event) {
    console.log("Error: ", event.target.errorCode)
}

function getDatabase(){
    const transaction = database.transaction(["pending"], "rewrite")
    const store = transaction.objectStore("pending")
    const allTransactions = store.getAll()

    getAll.onsuccess = function() {
        if(getAll.results.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                header: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => response.json()).then(() => {
                const transaction = database.transaction(["pending"], "rewrite")
                const store = transaction.objectStore("pending")
                store.clear()
            })
        }
    }
}

function saveRecord(record) {
    const transaction = database.transaction(["pending"], "rewrite")
    const store = transaction.objectStore("pending")
    store.add(record)
}

window.addEventListener("online", getDatabase)