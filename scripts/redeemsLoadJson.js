const tableBody = document.querySelector(".table-body");
const tableFoot = document.querySelector(".table-foot");

var totalRedeems = 0;
var totalCost = 0;
const cachedJsonMap = new Map();

const selectedMonth = document.getElementById("selectMonth");
selectedMonth.addEventListener('change', loadMonth);
loadMonth();

async function loadMonth() {
    tableBody.innerHTML = "";
    tableFoot.innerHTML = "";
    totalRedeems = 0;
    totalCost = 0;
    
    if(selectedMonth.value === "all") {
        const options = selectedMonth.options;
        for(let i = 1; i < options.length; i++) {
            await addDataToTable(options[i].value+"-Data.json");
        }
    } else {
        await addDataToTable(selectedMonth.value+"-Data.json");
    }
    addFootData();
}

async function fetchJsonData(fileName) {
    if(cachedJsonMap.has(fileName)) {
        return cachedJsonMap.get(fileName);
    }

    try {
        const jsonData = await fetch("scripts/"+fileName);
        const data = await jsonData.json();

        cachedJsonMap.set(fileName, data);
        return data;
    } catch (error){
        console.error("Error fetching json data:", error);
    }
}

async function addDataToTable(fileName) {
    const data = await fetchJsonData(fileName);

    data.forEach(item => {
        totalRedeems++;
        totalCost += parseInt(item[3]);
        const row = document.createElement("tr");

        const redeemedAtCell = document.createElement('td');
        redeemedAtCell.textContent = item[0];
        row.appendChild(redeemedAtCell);

        const usernameCell = document.createElement('td');
        usernameCell.textContent = item[1];
        row.appendChild(usernameCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = item[2];
        row.appendChild(titleCell);

        const costCell = document.createElement('td');
        costCell.textContent = item[3];
        row.appendChild(costCell);

        tableBody.insertBefore(row, tableBody.firstChild);
    });
}

function addFootData() {
    const footRow = document.createElement("tr");
    const totalRedeemsTextCell = document.createElement("th");
    totalRedeemsTextCell.textContent = "Total Redeems:";
    footRow.appendChild(totalRedeemsTextCell);
    
    const totalRedeemsNumberCell = document.createElement("th");
    totalRedeemsNumberCell.setAttribute("colspan", 2);
    totalRedeemsNumberCell.textContent = totalRedeems;
    footRow.appendChild(totalRedeemsNumberCell);
    
    const totalRedeemsCost = document.createElement("th");
    totalRedeemsCost.textContent = totalCost;
    footRow.appendChild(totalRedeemsCost);
    
    tableFoot.appendChild(footRow);
}