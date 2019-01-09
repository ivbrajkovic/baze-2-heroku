"use strict";

/**
 * Make row selected on click and make cell editable
 */
(() => {
  // Listen for click at document level
  document.getElementById("content").addEventListener("click", function(event) {
    // If click came from editable cell
    if (
      event.target.nodeName == "TD" &&
      event.target.parentNode.parentNode.classList.contains("editable-1")
    ) {
      let td = event.target;
      let tr = td.parentNode;
      let table = tr.parentNode.parentNode;
      let row_selected = parseInt(table.getAttribute("data-selectedRow"));

      // If clicked on non selected row
      if (row_selected != tr.rowIndex) {
        // Deselect last selected
        if (!isNaN(row_selected)) {
          [...table.rows][row_selected].classList.remove("row-selected");
        }

        // Select the row and save row index (not count first two rows in header)
        table.setAttribute("data-selectedRow", tr.rowIndex);
        tr.classList.add("row-selected");
      }

      if (tr.firstChild != td) {
        // Add cellSelected clas to td
        td.classList.add("cellSelected");

        // Sellect all text in cell
        let range = document.createRange();
        range.selectNodeContents(td);
        let sel = window.getSelection();
        sel.addRange(range);

        // Add event listener for blur
        td.addEventListener(
          "blur",
          function(event) {
            event.target.classList.remove("cellSelected");
            sel.removeAllRanges();
          },
          // Remove handler after only one call
          { once: true },
          true
        );
      }
    }
  });
})();
