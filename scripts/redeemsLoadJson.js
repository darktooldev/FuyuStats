async function loadJson() {
    try {
        const tableBody = document.querySelector(".table-body");
        const tableFoot = document.querySelector(".table-foot");
    
        const jsonData = await fetch("scripts/Data.json");

        const data = await jsonData.json();

        let totalRedeems = 0;
        let totalCost = 0;

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
    } catch (error) {
        console.error("Error fetching json data:", error);
    }
}
loadJson();