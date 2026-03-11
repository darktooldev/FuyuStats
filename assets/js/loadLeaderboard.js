const tableBody = document.querySelector(".tableBody");
const monthSelector = document.getElementById("monthSelector");
const selectedMonthsContainer = document.getElementById("selectedMonthsContainer");

const USERNAME = 1;
const COST = 3;

const cacheJsonFilesMap = new Map();
const map = new Map();
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

    selectedMonthsContainer.append(button);  // TODO: append buttons in order
    selectedMonthsCounter++;

    if(selectedMonthsCounter === 1)
        selectedMonthsContainer.removeAttribute("hidden");
}

document.getElementById("applyMonthsButton").addEventListener("click", fillLeaderboard);

async function fillLeaderboard() {
    tableBody.innerHTML = `<tr><td colspan="3">Loading ...</td></tr>`;
    map.clear();

    const files = [];
    for(let i = 0; i < selectedMonthsArray.length; i++) {
        if(selectedMonthsArray[i].isEnabled) {
            files.push(selectedMonthsArray[i].month+"-Data.json")
        }
    }

    const allMonthsArray = await Promise.all(files.map(f => fetchJsonFileData(f)));

    for(let i = 0; i < allMonthsArray.length; i++) {
        let month = allMonthsArray[i];
        for(let j = 0; j < month.length; j++) {
            let redeem = month[j];

            if(map.has(redeem[USERNAME])) {
                let curr_amount = map.get(redeem[USERNAME]);
                curr_amount += Number(redeem[COST]); 
                map.set(redeem[USERNAME], curr_amount);
            } else {
                map.set(redeem[USERNAME], Number(redeem[COST]));
            }
        }
    }

    const arr = Array.from(map);

    arr.sort((i1, i2) => i2[1] - i1[1]);

    let rank = 1;

    let rows = "";
    arr.forEach(item => {
        let text = `
                    <tr>
                        <td>${rank}</td>
                        <td>${item[0]}</td>
                        <td>${item[1]}</td>
                    </tr>
                    `;
        rank++;

        rows += text;
    });

    tableBody.innerHTML = rows;
}

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