async function loadJson() {
    try {
        const tableBody = document.querySelector(".table-body");
        const tableFoot = document.querySelector(".table-foot");
    
        const jsonData = await fetch("scripts/Data.json");
        const data = await jsonData.json();

        var totalRedeems = 0;
        var totalCost = 0;

        data.forEach(item => {
            totalRedeems++;
            totalCost += parseInt(item.cost);

            const row = document.createElement("tr");

            const redeemedAtCell = document.createElement('td');
            redeemedAtCell.textContent = item.redeemed_at;
            row.appendChild(redeemedAtCell);

            const usernameCell = document.createElement('td');
            usernameCell.textContent = item.user_name;
            row.appendChild(usernameCell);

            const titleCell = document.createElement('td');
            titleCell.textContent = item.title;
            row.appendChild(titleCell);

            const costCell = document.createElement('td');
            costCell.textContent = item.cost;
            row.appendChild(costCell);

            tableBody.appendChild(row);
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
window.onload = loadJson;