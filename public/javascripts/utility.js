"use strict";

/**
 * Namespace helper with utility fnc
 */
const helper = {
  /**
   * Check if an objet is empty
   *
   * @param {object} obj  - object to check
   * @returns {boolean}   - indicate if object is empty
   */
  isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
  },

  /**
   * Delete all child of node
   *
   * @param {element} node  - node from who to delete childs
   */
  deleteAll(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  },

  /**
   * Helper for load HTML into an element
   *
   * @param {obj} element - ellement to set innerHTML
   * @param {String} url  - address for the HTML to fetch
   */
  getURL(element, url) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response =>
        response
          .text()
          .then(response => {
            element.innerHTML = response;
          })
          .catch(error => {
            throw Error(error);
          })
      )
      .catch(error => {
        element.innerHTML = "<h3>" + error + "</h3>";
      });
  },

  /**
   * Helper for load HTML into an element
   *
   * @param {String} url - address for the HTML to fetch
   * @returns {String} - fetched HTML
   */
  async fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
  },

  /**
   * Retreive selected row data
   *
   * @param {object} node  - element clicked
   * @param {String} mode     - retreive mode
   */
  getSelectedRowData(node, mode) {
    let table =
      node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    let selected_row = table.getAttribute("data-selectedrow");

    // If no row selected return false
    if (!selected_row) return false;

    let data = {};
    let object = {};
    object.table = table.getAttribute("id");
    let columns = table.rows[1].cells;
    let cells = table.rows[selected_row].cells;

    if (mode == "update") {
      // console.log("update");
      // If there is NO id, return false
      if (!cells[0].innerText) return false;

      // Retreive all data from cells
      for (let i = 0, l = columns.length; i < l; i++) {
        data[columns[i].innerText.toLowerCase()] = cells[i].innerText;
      }
    } else if (mode == "delete") {
      // console.log("delete");
      // If there is NO id, return false
      if (!cells[0].innerText) return false;

      // Retreive only id
      //data[columns[0].innerText.toLowerCase()] = cells[0].innerText;
      data.id = cells[0].innerText;

      // Delete selected row and clear data-selectedrow attr
      table.deleteRow(selected_row);
      table.setAttribute("data-selectedrow", "");
    } else if (mode == "add") {
      // console.log("add");

      // If there IS id, return false
      if (cells[0].innerText) return false;

      for (let i = 0, l = columns.length; i < l; i++) {
        data[columns[i].innerText.toLowerCase()] = cells[i].innerText;
      }
      // Retreive only id
      // data[columns[0].innerText.toLowerCase()] = cells[0].innerText;
      // table.deleteRow(row_selected);
      // table.setAttribute("data-selectedrow", "");
    }
    object.data = data;
    return object;
  },

  /**
   * Helper node creation
   *
   * @param {object} params - { tag, parent, class, attribute, text }
   * @returns               - reference to created node
   */
  createNode(params) {
    let element = document.createElement(params.tag);
    if (params.class) {
      let tmp = params.class.split(" ");
      for (let i = 0; i < tmp.length; i++) element.classList.add(tmp[i]);
    }
    if (params.attribute) {
      for (const [key, value] of Object.entries(params.attribute)) {
        element.setAttribute(key, value);
      }
    }
    if (params.text) element.innerText = params.text;
    if (params.parent) params.parent.appendChild(element);
    return element;
  },

  /**
   * Debugging only
   *
   * @returns - Returns array of events
   */
  getEvents() {
    let items = Array.prototype.slice
      .call(document.querySelectorAll("*"))
      .map(function(element) {
        let listeners = getEventListeners(element);
        return {
          element: element,
          listeners: Object.keys(listeners).map(function(k) {
            return { event: k, listeners: listeners[k] };
          })
        };
      })
      .filter(function(item) {
        return item.listeners.length;
      });
    return items;
  }
};
