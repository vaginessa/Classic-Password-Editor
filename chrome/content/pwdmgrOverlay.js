/*
    Saved Password Editor, extension for Firefox 3.0+
    Copyright (C) 2010  Daniel Dawson <ddawson@icehouse.net>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

document.getElementById("signonsTree").addEventListener(
  "select",
  function (ev) {
    var selections = GetTreeSelections(signonsTree);
    if (selections.length == 1 && !gSelectUserInUse) {
      document.getElementById("key_editSignon").removeAttribute("disabled");
      document.getElementById("key_cloneSignon").removeAttribute("disabled");
      document.getElementById("edit_signon").removeAttribute("disabled");
      document.getElementById("clone_signon").removeAttribute("disabled");
      document.getElementById("speMenuBtn_editSignon").
        removeAttribute("disabled");
      document.getElementById("speMenuBtn_cloneSignon").
        removeAttribute("disabled");
      if (!spEditor.userChangedMenuBtn) {
        document.getElementById("speMenuBtn").command = "edit_signon";
        document.getElementById("speMenuBtn").
          setAttribute("icon", "properties");
      }
    } else {
      document.getElementById("speMenuBtn").command = "new_signon";
      document.getElementById("speMenuBtn").
        setAttribute("icon", "add");
      document.getElementById("key_editSignon").
        setAttribute("disabled", "true");
      document.getElementById("key_cloneSignon").
        setAttribute("disabled", "true");
      document.getElementById("edit_signon").
        setAttribute("disabled", "true");
      document.getElementById("clone_signon").
        setAttribute("disabled", "true");
      document.getElementById("speMenuBtn_editSignon").
        setAttribute("disabled", "true");
      document.getElementById("speMenuBtn_cloneSignon").
        setAttribute("disabled", "true");
      spEditor.userChangedMenuBtn = false;
    }
  },
  false);

const spEditor = {
  strBundle: null,
  prefs: Components.classes["@mozilla.org/preferences-service;1"].
         getService(Components.interfaces.nsIPrefService).
         getBranch("extensions.savedpasswordeditor."),

  userChangedMenuBtn: false,

  menuBtnSel: function (ev, elem) {
    var mb = document.getElementById("speMenuBtn");
    switch(elem.id) {
    case "speMenuBtn_editSignon":
      mb.command = "edit_signon";
      mb.setAttribute("icon", "properties");
      this.editSignon();
      break;

    case "speMenuBtn_cloneSignon":
      mb.command = "clone_signon";
      mb.removeAttribute("icon");
      this.cloneSignon();
      break;

    case "speMenuBtn_newSignon":
      mb.command = "new_signon";
      mb.setAttribute("icon", "add");
      this.newSignon();
      break;
    }

    this.userChangedMenuBtn = true;
    ev.stopPropagation();
  },

  editSignon: function () {
    var selections = GetTreeSelections(signonsTree);
    if (selections.length != 1) return;
    var table =
      signonsTreeView._filterSet.length ? signonsTreeView._filterSet : signons;
    var signon = table[selections[0]];
    var ret = { newSignon: null };
    window.openDialog(
      "chrome://savedpasswordeditor/content/pwdedit.xul", "",
      "centerscreen,dependent,dialog,chrome,modal,resizable",
      signon, false, ret);
    if (!ret.newSignon) return;
    passwordmanager.modifyLogin(signon, ret.newSignon);
    LoadSignons();
  },

  cloneSignon: function () {
    var selections = GetTreeSelections(signonsTree);
    if (selections.length != 1) return;
    var table =
      signonsTreeView._filterSet.length ? signonsTreeView._filterSet : signons;
    var signon = table[selections[0]];
    var ret = { newSignon: null };
    window.openDialog(
      "chrome://savedpasswordeditor/content/pwdedit.xul", "",
      "centerscreen,dependent,dialog,chrome,modal,resizable",
      signon, true, ret);
    if (!ret.newSignon) return;
    try {
      passwordmanager.addLogin(ret.newSignon);
      LoadSignons();
    } catch (e) {
      Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
        getService(Components.interfaces.nsIPromptService).
        alert(window, this.strBundle.getString("error"),
              this.strBundle.getFormattedString("badnewentry", [e.message]));
    }
  },

  newSignon: function () {
    var ret = { newSignon: null };
    window.openDialog(
      "chrome://savedpasswordeditor/content/pwdedit.xul", "",
      "centerscreen,dependent,dialog,chrome,modal,resizable",
      null, false, ret);
    if (!ret.newSignon) return;
    try {
      passwordmanager.addLogin(ret.newSignon);
      LoadSignons();
    } catch (e) {
      Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
        getService(Components.interfaces.nsIPromptService).
        alert(window, this.strBundle.getString("error"),
              this.strBundle.getFormattedString("badnewentry", [e.message]));
    }
  },
}
