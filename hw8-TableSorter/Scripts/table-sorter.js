window.onload = function () {
    $("table").each(function () {
        var tbody = $(this).children("tbody");
        $(this).find("th").each(function (index) {
            $(this).click(sortTable(tbody, index));
        });
    })
}

function sortTable(tbody, index) {
    return function () {
        // Remove other <th> icon
        $(this).siblings().removeClass("sort-ascending sort-descending");
        // Judge whether ascend or descend
        var isAscending = $(this).hasClass("sort-ascending")
        $(this).removeClass("sort-ascending sort-descending").addClass(isAscending ? "sort-descending" : "sort-ascending");
        $(tbody).append($(tbody).find("tr").sort(sortHandler(index + 1, isAscending)));
    }
}

function sortHandler(index, isAscending) {
    return function (a, b) {
        var aText = $(a).find("td:nth-child(" + index + ")").text();
        var bText = $(b).find("td:nth-child(" + index + ")").text();
        return (aText < bText ? 1 : aText > bText ? -1 : 0) * (isAscending ? 1 : -1);
    }
}