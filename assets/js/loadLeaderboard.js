const tableBody = document.querySelector(".tableBody");

const USERNAME = 1;
const COST = 3;

const cacheJsonFilesMap = new Map();

document.getElementById("applyMonthsButton").addEventListener("click", fillLeaderboard);

async function fillLeaderboard() {
    tableBody.innerHTML = `<tr><td colspan="3">Loading ...</td></tr>`;

    const files = [];
    for(let i = 0; i < selectedMonthsArray.length; i++) {
        if(selectedMonthsArray[i].isEnabled) {
            files.push(selectedMonthsArray[i].month+"-Data.json")
        }
    }
    
    const allMonthsArray = await Promise.all(files.map(f => fetchJsonFileData(f)));

    const userMap = new Map();
    const userArray = [];

    for (const month of allMonthsArray) {
        for(const redeem of month) {
            const username = redeem[USERNAME];
            const cost = Number(redeem[COST]);

            let index = userMap.get(username);

            if(index === undefined) {
                index = userArray.push([username, 0]);
                index--;
            }
            
            userArray[index][1] += cost;
            
            while(index > 0 && userArray[index-1][1] < userArray[index][1]) {
                let tempUser = userArray[index-1];
                userArray[index-1] = userArray[index];
                userArray[index] = tempUser;
                
                userMap.set(userArray[index][0], index);
                index--;
            }

            userMap.set(username, index);
        }
    }

    tableBody.innerHTML = userArray.map((item, index) => {
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${item[0]}</td>
            <td>${item[1]}</td>
        </tr>
        `;
    }).join('');
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