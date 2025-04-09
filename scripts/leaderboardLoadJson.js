async function loadLeaderboard() {
    const tableBody = document.querySelector(".table-body");

    const jsonData = await fetch("scripts/Data.json");
    const data = await jsonData.json();

    const map = new Map();

    data.forEach(item => {
        if(map.has(item.user_name)) {
            let curr_amount = parseInt(map.get(item.user_name));
            curr_amount += parseInt(item.cost);
            map.set(item.user_name, curr_amount);
        } else {
            map.set(item.user_name, parseInt(item.cost));
        }
    });

    const array = Array.from(map);
    array.sort((item1, item2) => item2[1] - item1[1]);

    let rank = 1;

    array.forEach(item => {

        const row = document.createElement("tr");

        const rankCell = document.createElement('td');
        rankCell.textContent = rank;
        rankCell.style.paddingLeft = "25px";
        row.appendChild(rankCell);

        const usernameCell = document.createElement('td');
        usernameCell.textContent = item[0];
        row.appendChild(usernameCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = item[1];
        row.appendChild(amountCell);

        tableBody.appendChild(row);

        rank++;

        // console.log(`Username: ${item[0]} | Amount: ${item[1]}`);
    });
}
loadLeaderboard();