const monthSelector = document.getElementById("monthSelector");
const selectedMonthsContainer = document.getElementById("selectedMonthsContainer");

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
    monthSelector.options[index].disabled = true;

    let button = document.createElement("button");
    
    button.className = "bgAndColor";
    button.title = "Remove";
    button.textContent = `X ${monthSelector.options[index].text}`;

    button.addEventListener("click", () => {
        selectedMonthsArray[index - 1].isEnabled = false;
        monthSelector.options[index].disabled = false;
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