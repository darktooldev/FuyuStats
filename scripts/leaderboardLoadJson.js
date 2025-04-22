const map = new Map();

const tableBody = document.querySelector(".table-body");

var selectedMonth = document.getElementById("selectMonth");
selectedMonth.addEventListener('change', loadMonth);

loadMonth();

async function loadMonth() {
    tableBody.innerHTML = "";
    map.clear();
    
    if(selectedMonth.value === "all") {
        const options = selectedMonth.options;
        for(let i = 1; i < options.length; i++) {
            await loadFileIntoMap(options[i].value+"-Data.json");
        }
    } else {
        await loadFileIntoMap(selectedMonth.value+"-Data.json");
    }
    loadLeaderboard();
}

async function loadFileIntoMap(fileName) {
    const jsonData = await fetch("scripts/"+fileName);
    const data = await jsonData.json();

    data.forEach(item => {
        if(map.has(item[1])) {
            let curr_amount = parseInt(map.get(item[1]));
            curr_amount += parseInt(item[3]);
            map.set(item[1], curr_amount);
        } else {
            map.set(item[1], parseInt(item[3]));
        }
    });
}

function loadLeaderboard() {
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
    });
}
