function filterTable() {
    var tableFoot = document.querySelector(".table-foot");

    var nameFilter = document.getElementById("filterName").value;
    var redeemFilter = document.getElementById("filterRedeem").value;

    const rows = document.querySelectorAll(".table-body tr");
    
    var totalRedeems = 0;
    var totalCost = 0;

    rows.forEach(row => {
        var username = row.cells[1].textContent;
        var redeem = row.cells[2].textContent;

        var userMatch = nameFilter === '' || username === nameFilter;
        var redeemMatch = redeemFilter === '' || redeem === redeemFilter;

        if(userMatch && redeemMatch) {
            totalRedeems++;
            totalCost += parseInt(row.cells[3].textContent);
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
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

    tableFoot.deleteRow(0);
    tableFoot.appendChild(footRow);
}