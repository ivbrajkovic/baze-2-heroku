"use strict";

/**
 * Main logic fro DOM manipulation
 */
(() => {
  let isAdminModalOpen = false;
  const socket = io({ autoConnect: false });

  const unosModal = $("#unosModal");
  const adminModal = $("#admin-modal");

  const btn_send = document.getElementById("btn-send");
  const admin_table = document.getElementById("admin-table-wrapper");
  const topbar_menu = document.getElementById("topbar-menu");
  const sidebar_menu = document.getElementById("sidebar-menu");
  const prikaz_podataka = document.getElementById("prikaz-podataka");
  const input_command = document.getElementById("input-command");
  const sidebar_toggler = document.getElementById("sidebar-toggler");
  const connect_socket = document.getElementsByClassName("connect-socket");

  // Init wave effect on buttons{}
  Waves.attach("#sidebar-menu a");
  Waves.init();

  //#region Socket
  //
  // let socket = io("https://localhost:3001", { secure: true });
  // const socket = io({
  //   autoConnect: false
  // });
  //
  //
  // Custom handshake
  socket.on("hello", function(data) {
    console.log(data);
    socket.emit("hello", {
      client: "Hello from client"
    });
  });
  //
  // On info received from server
  socket.on("info", data => {
    if (isAdminModalOpen) admin_table.createTableInfo(data);
    else Swal("Uspješno izvršeno!", "", "success");
  });
  //
  // On data received from db
  socket.on("data", data => {
    if (isAdminModalOpen) admin_table.createTable(data);
    else prikaz_podataka.createTable(data);
  });
  //
  //#endregion

  //#region Topbar
  //
  // Hide topbar dropdown on click in mobile view
  document.getElementById("topbar-dropdown").onclick = function(event) {
    this.classList.remove("show");
    // console.log("click: ", event.target.tagName);
    if (event.target.tagName == "A") SetTopbarLinkActive(event.target);
  };
  //
  function SetTopbarLinkActive(node) {
    if (!node.parentNode.classList.contains("active")) {
      document
        .getElementById("topbar-dropdown")
        .querySelector("li.nav-item.active")
        .classList.remove("active");
      node.parentNode.classList.add("active");
    }
  }
  //
  // Set active link from topbar based on address
  // [
  //   ...document.getElementById("topbar-dropdown").getElementsByTagName("a")
  // ].forEach(element => {
  //   if (element.getAttribute("href") == location.pathname)
  //   //if (element.getAttribute("id") == prikaz_podataka.getAttribute("data"))
  //     element.parentNode.classList.add("active");
  // });
  // document
  //   .getElementById("topbar-dropdown")
  //   .addEventListener("click", function() {});
  //
  // View about form
  document
    .getElementById("view-proizvod")
    .addEventListener("click", function() {
      helper.deleteAll(prikaz_podataka);
      // prikaz_podataka.setAttribute("data", "proizvod");
      // helper.getURL(prikaz_podataka, "/proizvod");
      document.getElementById("view-all-product").click();
    });
  //
  // View about form
  document.getElementById("view-about").addEventListener("click", function() {
    helper.deleteAll(prikaz_podataka);
    helper.getURL(prikaz_podataka, "/about");
  });
  //
  // View contact form
  document.getElementById("view-contact").addEventListener("click", function() {
    helper.deleteAll(prikaz_podataka);
    helper.getURL(prikaz_podataka, "/contact");
  });
  //
  //#endregion

  //#region Sidebar
  //
  // Animate sidebar and sidebar toggler
  sidebar_toggler.onclick = function() {
    this.classList.toggle("open");
    sidebar_menu.classList.toggle("active");
  };
  //
  // Add on click even listener on all links with id on sidebar
  sidebar_menu.querySelectorAll("li a[id]").forEach(element => {
    element.addEventListener("click", SetSidebarLinkActive);
  });
  //
  // Set active link on side bar
  function SetSidebarLinkActive() {
    if (!this.classList.contains("active")) {
      sidebar_menu.querySelector("li a.active").classList.remove("active");
      this.classList.add("active");
    }
  }
  //
  // Show all products view
  document.getElementById("view-all-product").onclick = () => {
    helper.deleteAll(prikaz_podataka);
    helper.getURL(prikaz_podataka, "/all");
  };
  //
  // Show skladiste view
  document.getElementById("view-skladiste").onclick = () => {
    helper.deleteAll(prikaz_podataka);
    helper.getURL(prikaz_podataka, "/skladiste");
  };
  //
  // Show maloprodaja view
  document.getElementById("view-maloprodaja").onclick = () => {
    helper.deleteAll(prikaz_podataka);
    helper.getURL(prikaz_podataka, "/maloprodaja");
  };
  //
  // Show veleprodaja view
  document.getElementById("view-veleprodaja").onclick = () => {
    helper.deleteAll(prikaz_podataka);
    helper.getURL(prikaz_podataka, "/veleprodaja");
  };
  //
  // Loade manage tables
  document
    .getElementById("manage-tables")
    .addEventListener("click", function() {
      //event.preventDefault();
      if (!socket.connected) {
        // view error msgbox
        Swal({
          type: "error",
          title: "Prikljčak nije povezan",
          text: "Povežite priključak i pokušajte ponovo.",
          animation: false,
          customClass: "animated flipInY"
        });
      } else {
        // Recquest all tables from db
        socket.emit("command", { mode: "manage" });
      }
    });
  //
  // Socket switch,
  // retreive list of all socket switches on the app
  [...connect_socket].forEach(value => {
    value.addEventListener("change", event => {
      //event.preventDefault();
      // Toggle socket connected
      if (socket.connected) {
        socket.close();
        [...connect_socket].forEach(val => {
          val.checked = false;
        });
      } else {
        socket.open();
        [...connect_socket].forEach(val => {
          val.checked = true;
        });
      }
    });
  });
  //
  //#endregion

  //#region Modals
  //
  //#region Admin
  //

  // Open admin modal
  document.getElementById("view-admin-modal").onclick = () => {
    adminModal.modal();
  };
  //
  // On key press on admin modal
  adminModal.keypress(function(e) {
    // On press enter send command
    if (e.which == 13) btn_send.click();
  });
  //
  // On show admin modal
  adminModal.on("show.bs.modal", function(e) {
    isAdminModalOpen = true;
  });
  //
  // On hide admin modal
  adminModal.on("hidden.bs.modal", function(e) {
    isAdminModalOpen = false;
  });
  //
  btn_send.onclick = () => {
    // Delete tables on admin modal ( the old way :) )
    admin_table.innerHTML = "";
    socket.emit("command", { mode: "admin", data: input_command.value });
  };
  //
  //#endregion
  //
  //#region Unos
  //
  // Open unos proizvoda modal
  $("#unosProizvoda").click(() => {
    // TO DO
    // $("#unosModal").modal();
  });
  //
  // On show unos modal
  unosModal.one("show.bs.modal", function(e) {
    $(this)
      .addClass("modal-scrollfix")
      .find(".modal-body")
      .html("loading...")
      .load("/products/add", function() {
        unosModal.removeClass("modal-scrollfix").modal("handleUpdate");
        $("#unosModal select").selectpicker("refresh");
      });
  });
  //
  //#endregion
  //
  //#endregion

  //#region proto fnc
  //
  Object.prototype.createTableInfo = function(data) {
    //console.log(data);
    this.innerText = data;
  };
  Object.defineProperty(Object.prototype, "createTableInfo", {
    enumerable: false
  });
  //
  // Stvara tabele za prilaz podataka
  Object.prototype.createTable = function(db_data) {
    let root,
      card_box,
      col_lg_6,
      dropdown,
      dropdown_items,
      table,
      thead,
      th,
      tbody,
      tr,
      nTables = 0;

    // Brise prikaz_podataka
    while (this.firstChild) this.removeChild(this.firstChild);

    // console.log("db_data :", db_data);
    if (!db_data) {
      helper.createNode({
        tag: "h3",
        parent: this,
        text: "Error parsing response from server."
      });
      return;
    }

    // Foreach table in object
    for (let data of db_data) {
      //
      Object.keys(data).forEach(key => {
        let data_table = data[key];
        //
        // Two table per row on container
        if (nTables == 3) nTables = 0;
        if (nTables == 0) {
          // Append to DOM at the end
          root = helper.createNode({
            tag: "div",
            class: "row"
          });

          // Only for DEBUG, else append at the end
          // this.appendChild(root);
        }
        ++nTables;
        //
        //////////////////////////////////////////////////////////////////
        //#region Table container
        //
        col_lg_6 = helper.createNode({
          tag: "div",
          parent: root,
          //class: !isAdminModalOpen ? "col-md-6 col-lg-4" : "col"
          class: "col"
        });
        card_box = helper.createNode({
          tag: "div",
          parent: col_lg_6,
          class: "card-box"
        });
        //
        //#endregion
        //////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////
        //#region Table
        //
        // Table
        // if (!helper.isEmpty(data[data_table])) {
        //
        table = helper.createNode({
          tag: "table",
          parent: card_box,
          class: !isAdminModalOpen
            ? "table table-striped shadow-2"
            : "table table-striped",
          attribute: { id: data_table.table }
        });
        //
        // Table header
        thead = helper.createNode({ tag: "thead", parent: table });
        if (!isAdminModalOpen) {
          tr = helper.createNode({ tag: "tr", parent: thead });
          //
          //////////////////////////////////////////////////////////////////
          //#region Table title and drpdown
          //
          // Table name
          th = helper.createNode({
            tag: "th",
            parent: tr,
            class: "table__header",
            attribute: { colspan: data_table.columns.length },
            text: data_table.table
          });
          //
          // Dropdown
          dropdown = helper.createNode({
            tag: "div",
            parent: th,
            class: "dropdown float-right"
          });
          //
          // Dropdown toggler icon
          helper.createNode({
            tag: "i",
            parent: helper.createNode({
              tag: "a",
              parent: dropdown,
              class: "dropdown-toggle arrow-none card-drop",
              attribute: {
                href: "#",
                "data-toggle": "dropdown",
                "aria-expanded": false
              }
            }),
            class: "material-icons",
            //false,
            text: "more_vert"
          });
          //
          // Dropdown items container
          dropdown_items = helper.createNode({
            tag: "div",
            parent: dropdown,
            class:
              "dropdown-menu dropdown-menu-right shadow-2 rounded-0 theme-gradient-light-4"
          });
          //
          // Dropdown item update
          helper
            .createNode({
              tag: "a",
              parent: dropdown_items,
              class: "dropdown-item",
              attribute: {
                href: "#",
                id: `${data_table.table}_item_uredi`
              },
              text: "Uredi"
            })
            .addEventListener("click", function() {
              let obj = helper.getSelectedRowData(this, "update");
              if (obj) socket.emit("command", { mode: "update", data: obj });
              else
                Swal("Greška!", "Odaberite ispravni red u tablici.", "error");
            });
          //
          // Dropdown item delete
          helper
            .createNode({
              tag: "a",
              parent: dropdown_items,
              class: "dropdown-item",
              attribute: {
                href: "#",
                id: `${data_table.table}_item_obrisi`
              },
              text: "Obrisi"
            })
            .addEventListener("click", function() {
              let obj = helper.getSelectedRowData(this, "delete");
              if (obj) {
                Swal({
                  title: "Jeste li sigurni?",
                  text: "Obrisani podatak se neće moći povratiti.",
                  type: "warning",
                  showCancelButton: true,
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Odustani",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "Da, obriši"
                }).then(result => {
                  if (result.value) {
                    socket.emit("command", { mode: "delete", data: obj });
                  }
                });
              } else Swal("Greška!", "Odaberite ispravni red u tablici.", "error");
            });
          //
          // Dropdown item add
          helper
            .createNode({
              tag: "a",
              parent: dropdown_items,
              class: "dropdown-item",
              attribute: {
                href: "#",
                id: `${data_table.table}_item_dodaj`
              },
              text: "Dodaj"
            })
            .addEventListener("click", function() {
              let obj = helper.getSelectedRowData(this, "add");
              if (obj)
                socket.emit(
                  "command",
                  { mode: "add", data: obj, id: data_table.table },
                  function(data) {
                    //
                    // Add id to table
                    let table = document.getElementById(data.id);
                    table.rows[table.rows.length - 1].cells[0].innerText =
                      data.ret;
                    //
                    Swal(
                      "Uspješno izvršeno!",
                      "Redak je dodan u bazu.",
                      "success"
                    );
                    //
                    // Add empty row at last position
                    let tr = helper.createNode({
                      tag: "tr",
                      parent: table.lastChild
                    });
                    // Add columns
                    for (
                      let i = 0, l = table.rows[1].cells.length;
                      i < l;
                      i++
                    ) {
                      helper.createNode({
                        tag: "td",
                        parent: tr,
                        attribute: {
                          contentEditable: i != 0 ? "true" : "false"
                        },
                        text: i != 0 ? "..." : ""
                      });
                    }
                  }
                );
              else
                Swal("Greška!", "Odaberite ispravni red u tablici.", "error");
            });
          //
          //#endregion
          //////////////////////////////////////////////////////////////////
        }
        //
        // Columns
        tr = helper.createNode({ tag: "tr", parent: thead });
        for (let column of data_table.columns) {
          helper.createNode({ tag: "th", parent: tr, text: column });
        } //);
        //
        // Body
        tbody = helper.createNode({
          tag: "tbody",
          parent: table,
          class: !isAdminModalOpen ? "editable-1" : false
        });
        //
        // Rows
        // Check if data is avaible
        if (data_table.rows) {
          for (let data_row of data_table.rows) {
            tr = helper.createNode({ tag: "tr", parent: tbody });
            //
            // Data
            //for (let data_cell of data_row) {
            for (let i = 0, l = data_row.length; i < l; i++) {
              helper.createNode({
                tag: "td",
                parent: tr,
                attribute: {
                  contentEditable:
                    i != 0 && !isAdminModalOpen ? "true" : "false"
                },
                text: data_row[i]
              });
            }
          }
        }
        //
        // Add insert row to the last position
        tr = helper.createNode({ tag: "tr", parent: tbody });
        for (let i = 0, l = data_table.columns.length; i < l; i++) {
          helper.createNode({
            tag: "td",
            parent: tr,
            attribute: {
              contentEditable: i != 0 ? "true" : "false"
            },
            text: i != 0 ? "..." : ""
          });
        }
        //
        //#endregion
        //////////////////////////////////////////////////////////////////

        // Append prikaz_podataka to DOM
        this.appendChild(root);
      });
    }
  };
  //
  Object.defineProperty(Object.prototype, "createTable", {
    enumerable: false
  });
  //
  //#endregion

  document.getElementById("view-all-product").click();
  document.getElementById("view-proizvod").parentNode.classList.add("active");
})();
