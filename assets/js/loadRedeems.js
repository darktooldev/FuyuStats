const tableBody = document.querySelector(".tableBody");
const monthSelector = document.getElementById("monthSelector");
const selectedMonthsContainer = document.getElementById("selectedMonthsContainer");

const USERNAME = 1;
const TITEL = 2;
const COST = 3;

let totalRedeems = 0;
let totalCost = 0;

const cacheJsonFilesMap = new Map();
const selectedMonthsArray = [];
let selectedMonthsCounter = 0;

for(let i = 1; i < monthSelector.options.length-1; i++) {
    selectedMonthsArray.push({isEnabled: false, month: monthSelector.options[i].value});
}

monthSelector.addEventListener("change", () => {
    let val = monthSelector.value;

    switch (val) {
        case "all":
            for (let i = 1; i < monthSelector.options.length - 1; i++)
                addMonthToContainer(i);
            break;
    
        case "select": // do nothing
            break;

        default:
            let index = monthSelector.selectedIndex;
            addMonthToContainer(index);
            break;
    }
    monthSelector.selectedIndex = 0;
});

function addMonthToContainer(index) {
    if(selectedMonthsArray[index-1].isEnabled)
        return;

    selectedMonthsArray[index-1].isEnabled = true;

    let button = document.createElement("button");
    button.className = "bgAndColor";
    button.textContent = `X ${monthSelector.options[index].text}`;

    button.addEventListener("click", () => {
        selectedMonthsArray[index - 1].isEnabled = false;
        button.remove();
        selectedMonthsCounter--;

        if(selectedMonthsCounter === 0)
            selectedMonthsContainer.hidden = true;
    });

    selectedMonthsContainer.append(button);
    selectedMonthsCounter++;

    if(selectedMonthsCounter === 1)
        selectedMonthsContainer.removeAttribute("hidden");
}

document.getElementById("applyMonthsButton").addEventListener("click", addMonthsToTable);

async function addMonthsToTable() {
    tableBody.innerHTML = `<tr><td colspan="4">Loading ...</td></tr>`;
    totalRedeems = 0;
    totalCost = 0;

    const files = [];
    for(let i = 0; i < selectedMonthsArray.length; i++) {
        if(selectedMonthsArray[i].isEnabled) {
            files.push(selectedMonthsArray[i].month+"-Data.json")
        }
    }
    
    
    const allMonthsArray = await Promise.all(files.map(f => fetchJsonFileData(f)));
    
    const nameSet = new Set();
    const rewardSet = new Set();
    
    let rows = "";
    for(let i = 0; i < allMonthsArray.length; i++) {
        let month = allMonthsArray[i];
        for(let j = month.length-1; j >= 0; j--) {
            const redeem = month[j];

            nameSet.add(redeem[USERNAME]);
            rewardSet.add(redeem[TITEL]);

            totalRedeems++;
            totalCost += Number(redeem[COST]);

            rows += `<tr>
                        <td>${redeem[0]}</td>
                        <td>${redeem[USERNAME]}</td>
                        <td>${redeem[TITEL]}</td>
                        <td>${redeem[COST]}</td>
                     </tr>`;
        }
    }

    let options = "";
    nameSet.forEach(name => {
        options += `<option value="${name}"></option>`;
    });
    document.getElementById("nameList").innerHTML = options;

    options = "";
    rewardSet.forEach(reward => {
        options += `<option value="${reward}"></option>`;
    });
    document.getElementById("rewardList").innerHTML = options;

    tableBody.innerHTML = rows;
    document.getElementById("totalRedeemsCount").textContent = totalRedeems;
    document.getElementById("totalRedeemsCost").textContent = totalCost;
}

const filterButton = document.getElementById("filterButton");

filterButton.addEventListener("click", () => {
    totalRedeems = 0;
    totalCost = 0;
    
    const filterName = document.getElementById("filterNameField").value;
    const filterReward = document.getElementById("filterRewardField").value;
    
    const rows = tableBody.rows;
    tableBody.hidden = true;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const name = row.cells[USERNAME].textContent;
        const reward = row.cells[TITEL].textContent;

        let userMatch = filterName === '' || filterName === name;
        let rewardMatch = filterReward === '' || filterReward === reward;
    
        if(userMatch && rewardMatch) {
            totalRedeems++;
            totalCost += Number(row.cells[COST].textContent);
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }

    tableBody.hidden = false;

    document.getElementById("totalRedeemsCount").textContent = totalRedeems;
    document.getElementById("totalRedeemsCost").textContent = totalCost;
});

async function fetchJsonFileData(monthFileName) {
    if(cacheJsonFilesMap.has(monthFileName)) {
        return cacheJsonFilesMap.get(monthFileName);
    }

    try {
        const jsonData = await fetch("assets/redeems/"+monthFileName);
        if(!jsonData.ok) return [];

        const data = await jsonData.json();

        cacheJsonFilesMap.set(monthFileName, data);
        return data;
    } catch (error) {
        console.error("Error fetching json data:", error);
        return [];
    }
}